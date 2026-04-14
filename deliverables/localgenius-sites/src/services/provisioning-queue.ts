/**
 * Provisioning Queue Service — Async Site Provisioning with Retries & Circuit Breaking
 *
 * Handles asynchronous site provisioning with:
 * - Exponential backoff retry strategy (1s → 2s → 4s → 8s → 16s → 32s max)
 * - Circuit breaker pattern for Cloudflare API rate limits
 * - State machine status updates in Neon database
 * - Error recovery and automatic retry scheduling
 *
 * Requirement: REQ-027 — Async queue with exponential backoff and circuit breaker
 *
 * Job Flow:
 * 1. Job enqueued with status 'pending'
 * 2. Process steps: generate HTML → optimize images → upload to R2 → configure DNS
 * 3. On success: update status to 'provisioned'
 * 4. On failure: calculate backoff, schedule retry, update error message
 * 5. Circuit breaker: after 5 failures in 5-min window, pause queue for 30s cooldown
 */

import {
  d1Execute,
  d1Query,
  r2Upload,
  dnsCreateRecord,
  r2GetPublicUrl,
} from '@/lib/cloudflare-api';
import { siteProvisions, siteProvisionStatusEnum } from '@/db/site-provisions-schema';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Portable Text content structure.
 * Used for storing AI-generated content (menu items, service descriptions, etc.)
 */
export interface PortableTextContent {
  _type: string;
  blocks?: Array<{
    _key?: string;
    _type: string;
    children?: Array<{
      _key?: string;
      _type: string;
      text: string;
      marks?: string[];
    }>;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

/**
 * Provisioning job interface.
 * Represents a single site creation task in the queue.
 */
export interface ProvisioningJob {
  siteId: string;
  organizationId: string;
  businessId: string;
  template: 'restaurant' | 'services';
  content: PortableTextContent;
  businessName?: string;
  photoUrls?: string[];
  zoneId?: string;
}

/**
 * Result type for job processing.
 */
export interface JobResult {
  success: boolean;
  siteId: string;
  message: string;
  duration: number;
  retryCount?: number;
  nextRetryAt?: Date;
}

/**
 * Circuit breaker state.
 */
interface CircuitBreakerState {
  failureCount: number;
  windowStart: number;
  isOpen: boolean;
  cooldownStart?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Backoff multipliers in seconds.
 * Maps retry count to delay before next attempt.
 */
const BACKOFF_DELAYS = [1, 2, 4, 8, 16, 32]; // seconds

/**
 * Maximum retry attempts before giving up.
 */
const MAX_RETRIES = 6;

/**
 * Circuit breaker configuration.
 */
const CIRCUIT_BREAKER_CONFIG = {
  failureThreshold: 5, // Break after 5 failures
  windowMs: 5 * 60 * 1000, // 5-minute window
  cooldownMs: 30 * 1000, // 30-second cooldown
};

// ─── Global State ────────────────────────────────────────────────────────────

/**
 * Circuit breaker state tracking.
 * Tracks failures per 5-minute window and manages cooldown periods.
 */
let circuitBreakerState: CircuitBreakerState = {
  failureCount: 0,
  windowStart: Date.now(),
  isOpen: false,
};

// ─── Queue Processor ──────────────────────────────────────────────────────────

/**
 * Process a provisioning job.
 *
 * Main orchestration function that executes all provisioning steps:
 * 1. Generate static HTML from template + content
 * 2. Optimize images (resize, compress)
 * 3. Upload assets to R2 bucket
 * 4. Configure DNS for subdomain
 * 5. Update status to 'provisioned' in state machine
 *
 * On any failure: schedule retry with exponential backoff.
 *
 * @param job - Provisioning job with all required data
 * @returns Result with success status and next retry info
 */
export async function processJob(job: ProvisioningJob): Promise<JobResult> {
  const startTime = Date.now();

  try {
    // Check circuit breaker
    if (circuitBreakerState.isOpen) {
      const cooldownElapsed = Date.now() - (circuitBreakerState.cooldownStart || 0);
      if (cooldownElapsed < CIRCUIT_BREAKER_CONFIG.cooldownMs) {
        throw new Error(
          `Circuit breaker open: cooldown in progress (${CIRCUIT_BREAKER_CONFIG.cooldownMs - cooldownElapsed}ms remaining)`
        );
      } else {
        // Cooldown expired, reset circuit breaker
        resetCircuitBreaker();
      }
    }

    // Update status to 'generating'
    await updateStatus(job.siteId, 'generating', undefined);

    // Step 1: Generate static HTML
    const htmlContent = await generateStaticHtml(job);
    await updateStatus(job.siteId, 'generating', undefined);

    // Step 2: Optimize images (resize, compress)
    const optimizedImages = await optimizeImages(job.photoUrls || []);
    await updateStatus(job.siteId, 'uploading', undefined);

    // Step 3: Upload to R2
    const uploadedAssets = await uploadToR2(job.siteId, {
      html: htmlContent,
      images: optimizedImages,
    });

    // Step 4: Configure DNS
    await updateStatus(job.siteId, 'dns_configuring', undefined);
    await configureDns(job.siteId, job.zoneId);

    // Step 5: Update status to 'provisioned'
    await updateStatus(job.siteId, 'provisioned', undefined);

    const duration = Date.now() - startTime;

    return {
      success: true,
      siteId: job.siteId,
      message: `Site provisioned successfully`,
      duration,
    };
  } catch (err) {
    const duration = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : String(err);

    // Get current retry count from database
    const currentRetryCount = await getRetryCount(job.siteId);
    const nextRetryCount = currentRetryCount + 1;

    // Update circuit breaker
    updateCircuitBreakerOnFailure();

    // Check if we've exceeded max retries
    if (nextRetryCount >= MAX_RETRIES) {
      await updateStatus(job.siteId, 'failed', errorMessage);
      return {
        success: false,
        siteId: job.siteId,
        message: `Job failed after ${MAX_RETRIES} retries: ${errorMessage}`,
        duration,
        retryCount: currentRetryCount,
      };
    }

    // Calculate backoff and schedule retry
    const backoffMs = calculateBackoff(nextRetryCount) * 1000;
    const nextRetryAt = new Date(Date.now() + backoffMs);

    // Update database with retry info
    await updateRetry(job.siteId, nextRetryCount, nextRetryAt, errorMessage);

    return {
      success: false,
      siteId: job.siteId,
      message: `Job failed (retry ${nextRetryCount}/${MAX_RETRIES}): ${errorMessage}`,
      duration,
      retryCount: nextRetryCount,
      nextRetryAt,
    };
  }
}

// ─── Job Step Implementations ────────────────────────────────────────────────

/**
 * Generate static HTML from template and content.
 *
 * Creates pre-rendered HTML output for the specified template (restaurant or services).
 * This is the "build time" rendering that happens before uploading to R2.
 *
 * @param job - Provisioning job with template and content
 * @returns HTML string ready for upload
 */
async function generateStaticHtml(job: ProvisioningJob): Promise<string> {
  // Generate HTML based on template and content
  // In production, this would call Emdash SSR or similar rendering service
  const templateBase = getTemplateBase(job.template);

  // Inject content into template
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${job.businessName || job.siteId}</title>
  <meta property="og:title" content="${job.businessName || job.siteId}">
  <meta property="og:description" content="Made with LocalGenius">
  <style>
    ${templateBase.styles}
  </style>
</head>
<body>
  <div class="site-container">
    <header class="site-header">
      <h1>${job.businessName || job.siteId}</h1>
    </header>
    <main class="site-content">
      ${renderContent(job.content)}
    </main>
    <footer class="site-footer">
      <p><a href="https://localgenius.company/sites?ref=${job.siteId}">Made with LocalGenius</a></p>
    </footer>
  </div>
  <script>${templateBase.scripts}</script>
</body>
</html>`;

  if (!html || html.length === 0) {
    throw new Error('Failed to generate HTML: empty output');
  }

  return html;
}

/**
 * Optimize images for web (resize, compress).
 *
 * Takes raw image URLs and returns optimized versions with multiple sizes.
 * In production, would use sharp-wasm or Cloudflare Image Resizing.
 *
 * @param photoUrls - Array of original image URLs
 * @returns Array of optimized image metadata
 */
async function optimizeImages(
  photoUrls: string[]
): Promise<Array<{ url: string; size: string }>> {
  const optimizedImages: Array<{ url: string; size: string }> = [];

  for (const url of photoUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch image: ${url}`);
        continue;
      }

      const buffer = await response.arrayBuffer();

      // In production: use sharp-wasm to resize/compress
      // For now: track that we attempted optimization
      optimizedImages.push({
        url,
        size: `${buffer.byteLength} bytes`,
      });
    } catch (error) {
      console.warn(`Failed to optimize image ${url}: ${error}`);
    }
  }

  return optimizedImages;
}

/**
 * Upload assets to R2 bucket.
 *
 * Uploads HTML and optimized images to R2 with proper cache headers.
 * Multi-tenancy is handled via siteId prefix in R2 key.
 *
 * @param siteId - Site identifier (used as R2 prefix)
 * @param assets - HTML content and optimized images
 * @returns Array of uploaded asset paths
 */
async function uploadToR2(
  siteId: string,
  assets: {
    html: string;
    images: Array<{ url: string; size: string }>;
  }
): Promise<string[]> {
  const uploadedPaths: string[] = [];

  // Upload HTML
  try {
    const htmlBuffer = new TextEncoder().encode(assets.html);
    await r2Upload(siteId, 'index.html', htmlBuffer, {
      'Content-Type': 'text/html',
      'Cache-Control': 'max-age=3600', // 1 hour
    });
    uploadedPaths.push(`${siteId}/index.html`);
  } catch (error) {
    throw new Error(`Failed to upload HTML: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Upload images
  for (const image of assets.images) {
    try {
      const filename = image.url.split('/').pop() || 'image.jpg';
      const response = await fetch(image.url);
      const buffer = await response.arrayBuffer();

      await r2Upload(siteId, `media/${filename}`, buffer, {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=31536000', // 1 year
      });
      uploadedPaths.push(`${siteId}/media/${filename}`);
    } catch (error) {
      console.warn(`Failed to upload image: ${error}`);
    }
  }

  if (uploadedPaths.length === 0) {
    throw new Error('Failed to upload any assets');
  }

  return uploadedPaths;
}

/**
 * Configure DNS for site subdomain.
 *
 * Creates CNAME record in Cloudflare DNS to route subdomain traffic to site.
 * Maps {siteId}.localgenius.site → site origin.
 *
 * @param siteId - Site identifier (used as subdomain)
 * @param zoneId - Cloudflare DNS zone ID
 */
async function configureDns(siteId: string, zoneId?: string): Promise<void> {
  if (!zoneId) {
    // In production: get zoneId from configuration
    // For now: throw informative error
    throw new Error('DNS zone ID required for DNS configuration');
  }

  try {
    await dnsCreateRecord(zoneId, siteId, 'localgenius.site', true);
  } catch (error) {
    throw new Error(
      `Failed to configure DNS: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ─── State Machine & Retry Management ──────────────────────────────────────

/**
 * Update provisioning job status in state machine.
 *
 * @param siteId - Site identifier
 * @param status - New status
 * @param errorMessage - Optional error message for failed states
 */
export async function updateStatus(
  siteId: string,
  status: 'pending' | 'generating' | 'uploading' | 'dns_configuring' | 'provisioned' | 'failed',
  errorMessage?: string
): Promise<void> {
  try {
    const updateFields = [
      `status = ?`,
      `current_step = ?`,
      `updated_at = NOW()`,
    ];
    const updateValues = [status, status];

    if (errorMessage) {
      updateFields.push(`error_message = ?`);
      updateValues.push(errorMessage);
    }

    const query = `
      UPDATE site_provisions
      SET ${updateFields.join(', ')}
      WHERE site_id = ?
    `;

    await d1Execute(query, [...updateValues, siteId]);
  } catch (error) {
    console.error(`Failed to update status for ${siteId}: ${error}`);
    throw error;
  }
}

/**
 * Get current retry count for a site.
 *
 * @param siteId - Site identifier
 * @returns Current retry count
 */
async function getRetryCount(siteId: string): Promise<number> {
  try {
    const result = await d1Query(
      'SELECT retry_count FROM site_provisions WHERE site_id = ?',
      [siteId]
    );

    if (!result.results || result.results.length === 0) {
      return 0;
    }

    return (result.results[0].retry_count as number) || 0;
  } catch (error) {
    console.error(`Failed to get retry count for ${siteId}: ${error}`);
    return 0;
  }
}

/**
 * Update retry count and schedule next retry.
 *
 * @param siteId - Site identifier
 * @param retryCount - New retry count
 * @param nextRetryAt - When to retry next
 * @param errorMessage - Error message for this attempt
 */
async function updateRetry(
  siteId: string,
  retryCount: number,
  nextRetryAt: Date,
  errorMessage: string
): Promise<void> {
  try {
    await d1Execute(
      `
      UPDATE site_provisions
      SET retry_count = ?,
          last_retry_at = ?,
          error_message = ?,
          updated_at = NOW()
      WHERE site_id = ?
      `,
      [retryCount, nextRetryAt.toISOString(), errorMessage, siteId]
    );
  } catch (error) {
    console.error(`Failed to update retry for ${siteId}: ${error}`);
    throw error;
  }
}

// ─── Exponential Backoff ───────────────────────────────────────────────────

/**
 * Calculate backoff delay in seconds.
 *
 * Implements exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s (capped).
 *
 * @param retryCount - Retry attempt number (1-based)
 * @returns Delay in seconds
 */
export function calculateBackoff(retryCount: number): number {
  if (retryCount < 1) {
    return BACKOFF_DELAYS[0];
  }

  if (retryCount >= BACKOFF_DELAYS.length) {
    return BACKOFF_DELAYS[BACKOFF_DELAYS.length - 1];
  }

  return BACKOFF_DELAYS[retryCount - 1];
}

// ─── Circuit Breaker ──────────────────────────────────────────────────────

/**
 * Update circuit breaker on job failure.
 *
 * Tracks failures in 5-minute window. Opens circuit after 5 failures.
 * Closed circuit during 30-second cooldown, then resets.
 */
function updateCircuitBreakerOnFailure(): void {
  const now = Date.now();
  const windowElapsed = now - circuitBreakerState.windowStart;

  // Check if we're still in the current window
  if (windowElapsed >= CIRCUIT_BREAKER_CONFIG.windowMs) {
    // Window expired, reset failure count
    circuitBreakerState.failureCount = 1;
    circuitBreakerState.windowStart = now;
    circuitBreakerState.isOpen = false;
    return;
  }

  // Increment failure count
  circuitBreakerState.failureCount++;

  // Check if we should open the circuit
  if (circuitBreakerState.failureCount >= CIRCUIT_BREAKER_CONFIG.failureThreshold) {
    circuitBreakerState.isOpen = true;
    circuitBreakerState.cooldownStart = now;
    console.error(
      `Circuit breaker opened: ${circuitBreakerState.failureCount} failures in ${windowElapsed}ms`
    );
  }
}

/**
 * Reset circuit breaker to closed state.
 */
function resetCircuitBreaker(): void {
  circuitBreakerState = {
    failureCount: 0,
    windowStart: Date.now(),
    isOpen: false,
  };
  console.info('Circuit breaker reset');
}

/**
 * Get current circuit breaker state (for monitoring/testing).
 */
export function getCircuitBreakerState(): CircuitBreakerState {
  return { ...circuitBreakerState };
}

// ─── Template Helpers ────────────────────────────────────────────────────────

/**
 * Get template base styles and scripts.
 *
 * @param template - Template type (restaurant or services)
 * @returns Template with styles and scripts
 */
function getTemplateBase(template: 'restaurant' | 'services'): {
  styles: string;
  scripts: string;
} {
  if (template === 'restaurant') {
    return {
      styles: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .site-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .site-header { text-align: center; margin: 40px 0; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .site-header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .site-content { margin: 40px 0; }
        .site-footer { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        .site-footer a { color: #0066cc; text-decoration: none; }
      `,
      scripts: `console.log('Restaurant site loaded');`,
    };
  }

  return {
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      .site-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
      .site-header { text-align: center; margin: 40px 0; border-bottom: 1px solid #eee; padding-bottom: 20px; }
      .site-header h1 { font-size: 2.5rem; margin-bottom: 10px; }
      .site-content { margin: 40px 0; }
      .site-footer { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
      .site-footer a { color: #0066cc; text-decoration: none; }
    `,
    scripts: `console.log('Services site loaded');`,
  };
}

/**
 * Render Portable Text content to HTML.
 *
 * @param content - Portable Text content structure
 * @returns HTML string
 */
function renderContent(content: PortableTextContent): string {
  if (!content || !content.blocks) {
    return '<p>No content available.</p>';
  }

  let html = '';

  for (const block of content.blocks) {
    if (block._type === 'block' && block.children) {
      html += '<p>';
      for (const child of block.children) {
        let text = child.text || '';
        if (child.marks && child.marks.includes('strong')) {
          text = `<strong>${text}</strong>`;
        }
        if (child.marks && child.marks.includes('em')) {
          text = `<em>${text}</em>`;
        }
        html += text;
      }
      html += '</p>';
    }
  }

  return html || '<p>No content available.</p>';
}

// ─── Module Exports ───────────────────────────────────────────────────────

export default {
  processJob,
  updateStatus,
  calculateBackoff,
  getCircuitBreakerState,
};
