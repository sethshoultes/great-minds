/**
 * Cloudflare API Helper Functions
 *
 * Provides high-level wrappers for all Cloudflare API operations used in LocalGenius Sites.
 * All functions automatically use the parameterized cloudflareConfig.accountId.
 *
 * Supported operations:
 * - D1 Database: Query, execute, read
 * - R2 Bucket: Upload, delete, list objects
 * - Workers: Deploy, list, get
 * - DNS: Create/update/delete records
 *
 * @see cloudflare-config.ts for configuration details
 * @see docs/federation-strategy.md for architecture
 */

import {
  cloudflareConfig,
  getCloudflareApiUrl,
  callCloudflareApi,
  CloudflareApiResponse,
  CLOUDFLARE_API_BASE_URL,
} from './cloudflare-config';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * D1 DATABASE OPERATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface D1QueryResult {
  success: boolean;
  results?: Record<string, unknown>[];
  error?: string;
}

/**
 * Execute a SQL query against the D1 database.
 *
 * @param sql - SQL query string (supports parameterized queries with ?)
 * @param bindings - Query parameters (replaces ? placeholders in order)
 * @returns Query results
 *
 * @example
 * ```typescript
 * const sites = await d1Query(
 *   'SELECT * FROM sites WHERE site_id = ? LIMIT 1',
 *   ['acme-pizza-sf']
 * );
 * ```
 */
export async function d1Query(
  sql: string,
  bindings: (string | number | boolean | null)[] = []
): Promise<D1QueryResult> {
  const endpoint = getCloudflareApiUrl(
    `/accounts/${cloudflareConfig.accountId}/d1/database/${cloudflareConfig.d1DatabaseId}/query`
  );

  try {
    const response = await callCloudflareApi<D1QueryResult>(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        sql,
        params: bindings,
      }),
    });

    return response.result;
  } catch (error) {
    throw new Error(
      `D1 query failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Execute a SQL statement (INSERT, UPDATE, DELETE, CREATE TABLE).
 * Identical to d1Query but semantically indicates a write operation.
 *
 * @param sql - SQL statement
 * @param bindings - Query parameters
 * @returns Execution result with affected row count
 */
export async function d1Execute(
  sql: string,
  bindings: (string | number | boolean | null)[] = []
): Promise<D1QueryResult> {
  return d1Query(sql, bindings);
}

/**
 * Run a D1 migration (e.g., schema creation).
 * Used during provisioning to initialize site-specific tables.
 *
 * @param migrationSql - Multi-statement SQL migration script
 * @returns Migration result
 */
export async function d1Migrate(migrationSql: string): Promise<D1QueryResult> {
  const endpoint = getCloudflareApiUrl(
    `/accounts/${cloudflareConfig.accountId}/d1/database/${cloudflareConfig.d1DatabaseId}/query`
  );

  try {
    const response = await callCloudflareApi<D1QueryResult>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ sql: migrationSql }),
    });

    return response.result;
  } catch (error) {
    throw new Error(
      `D1 migration failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * R2 BUCKET OPERATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface R2Object {
  key: string;
  size: number;
  etag: string;
  uploaded: string; // ISO 8601
}

/**
 * Upload a file to the R2 bucket.
 * Automatically prefixes the key with site_id for multi-tenancy.
 *
 * @param siteId - Site identifier (used as prefix)
 * @param fileName - Object name (relative to site prefix)
 * @param data - File content (Buffer, Blob, or string)
 * @param metadata - Optional metadata (content-type, cache-control, etc.)
 * @returns R2 object metadata (ETag, size, etc.)
 *
 * @example
 * ```typescript
 * await r2Upload(
 *   'acme-pizza-sf',
 *   'menu-photo-1.jpg',
 *   imageBuffer,
 *   { 'Content-Type': 'image/jpeg', 'Cache-Control': 'max-age=31536000' }
 * );
 * ```
 */
export async function r2Upload(
  siteId: string,
  fileName: string,
  data: ArrayBuffer | Blob | string,
  metadata?: Record<string, string>
): Promise<R2Object> {
  const objectKey = `${siteId}/${fileName}`;

  // R2 API endpoint for uploading objects
  const endpoint = `https://${cloudflareConfig.accountId}.r2.cloudflarestorage.com/${cloudflareConfig.r2BucketName}/${objectKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
        ...metadata,
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`R2 upload failed: ${response.statusText}`);
    }

    return {
      key: objectKey,
      size: data instanceof ArrayBuffer ? data.byteLength : data.length,
      etag: response.headers.get('etag') || '',
      uploaded: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(
      `R2 upload failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Delete a file from the R2 bucket.
 *
 * @param siteId - Site identifier (used as prefix)
 * @param fileName - Object name to delete
 *
 * @example
 * ```typescript
 * await r2Delete('acme-pizza-sf', 'old-photo.jpg');
 * ```
 */
export async function r2Delete(siteId: string, fileName: string): Promise<void> {
  const objectKey = `${siteId}/${fileName}`;
  const endpoint = `https://${cloudflareConfig.accountId}.r2.cloudflarestorage.com/${cloudflareConfig.r2BucketName}/${objectKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`R2 delete failed: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(
      `R2 delete failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * List all objects in the R2 bucket for a specific site.
 *
 * @param siteId - Site identifier (filters to this prefix)
 * @returns Array of R2 objects for this site
 */
export async function r2ListObjects(siteId: string): Promise<R2Object[]> {
  const prefix = `${siteId}/`;
  const endpoint = getCloudflareApiUrl(
    `/accounts/${cloudflareConfig.accountId}/r2/buckets/${cloudflareConfig.r2BucketName}/objects`
  );

  try {
    const response = await callCloudflareApi<{ objects: R2Object[] }>(endpoint, {
      method: 'GET',
      body: JSON.stringify({ prefix }),
    });

    return response.result.objects || [];
  } catch (error) {
    throw new Error(
      `R2 list failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get public URL for an R2 object.
 * Constructs a standard R2 public URL (requires bucket to be public).
 *
 * @param siteId - Site identifier
 * @param fileName - Object name
 * @returns Public URL
 */
export function r2GetPublicUrl(siteId: string, fileName: string): string {
  const objectKey = `${siteId}/${fileName}`;
  return `https://${cloudflareConfig.r2BucketName}.${cloudflareConfig.accountId}.r2.cloudflarestorage.com/${objectKey}`;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WORKERS OPERATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface WorkerMetadata {
  id: string;
  name: string;
  status: 'active' | 'disabled';
  created_on: string;
  modified_on: string;
  etag: string;
}

/**
 * Deploy a Worker script.
 * Used during site provisioning to create the site-router Worker.
 *
 * @param workerName - Worker name (e.g., "site-router", "content-sync")
 * @param script - Worker script source code
 * @param bindings - Worker bindings (D1, R2, KV, etc.)
 * @returns Worker metadata
 */
export async function workerDeploy(
  workerName: string,
  script: string,
  bindings?: Record<string, unknown>
): Promise<WorkerMetadata> {
  const endpoint = getCloudflareApiUrl(
    `/accounts/${cloudflareConfig.accountId}/workers/scripts/${workerName}`
  );

  try {
    const response = await callCloudflareApi<WorkerMetadata>(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/javascript',
      },
      body: script,
    });

    return response.result;
  } catch (error) {
    throw new Error(
      `Worker deploy failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get Worker metadata.
 *
 * @param workerName - Worker name
 * @returns Worker metadata
 */
export async function workerGet(workerName: string): Promise<WorkerMetadata> {
  const endpoint = getCloudflareApiUrl(
    `/accounts/${cloudflareConfig.accountId}/workers/scripts/${workerName}`
  );

  try {
    const response = await callCloudflareApi<WorkerMetadata>(endpoint, {
      method: 'GET',
    });

    return response.result;
  } catch (error) {
    throw new Error(
      `Worker get failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DNS OPERATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface DnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
}

/**
 * Create a DNS record for a site subdomain.
 * Used during provisioning to map {slug}.localgenius.site to the main zone.
 *
 * @param zoneId - DNS zone ID (from Cloudflare dashboard)
 * @param subdomain - Subdomain name (e.g., "acme-pizza-sf")
 * @param targetDomain - Target domain or CNAME (e.g., "localgenius.site")
 * @param proxied - Whether Cloudflare should proxy traffic (orange cloud)
 * @returns Created DNS record
 *
 * @example
 * ```typescript
 * await dnsCreateRecord(
 *   zoneId,
 *   'acme-pizza-sf',
 *   'localgenius.site',
 *   true // proxied
 * );
 * ```
 */
export async function dnsCreateRecord(
  zoneId: string,
  subdomain: string,
  targetDomain: string,
  proxied: boolean = true
): Promise<DnsRecord> {
  const endpoint = getCloudflareApiUrl(`/zones/${zoneId}/dns_records`);

  try {
    const response = await callCloudflareApi<DnsRecord>(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        type: 'CNAME',
        name: subdomain,
        content: targetDomain,
        ttl: 3600,
        proxied,
      }),
    });

    return response.result;
  } catch (error) {
    throw new Error(
      `DNS create failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Update a DNS record.
 *
 * @param zoneId - DNS zone ID
 * @param recordId - Record ID (from dnsCreateRecord or dnsListRecords)
 * @param updates - Fields to update (name, content, ttl, proxied)
 * @returns Updated DNS record
 */
export async function dnsUpdateRecord(
  zoneId: string,
  recordId: string,
  updates: Partial<Omit<DnsRecord, 'id'>>
): Promise<DnsRecord> {
  const endpoint = getCloudflareApiUrl(`/zones/${zoneId}/dns_records/${recordId}`);

  try {
    const response = await callCloudflareApi<DnsRecord>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    return response.result;
  } catch (error) {
    throw new Error(
      `DNS update failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Delete a DNS record.
 *
 * @param zoneId - DNS zone ID
 * @param recordId - Record ID to delete
 */
export async function dnsDeleteRecord(zoneId: string, recordId: string): Promise<void> {
  const endpoint = getCloudflareApiUrl(`/zones/${zoneId}/dns_records/${recordId}`);

  try {
    await callCloudflareApi(endpoint, {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(
      `DNS delete failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * List DNS records for a zone.
 *
 * @param zoneId - DNS zone ID
 * @param type - Filter by record type (e.g., "CNAME", "A")
 * @returns Array of DNS records
 */
export async function dnsListRecords(
  zoneId: string,
  type?: string
): Promise<DnsRecord[]> {
  const endpoint = getCloudflareApiUrl(
    `/zones/${zoneId}/dns_records${type ? `?type=${type}` : ''}`
  );

  try {
    const response = await callCloudflareApi<DnsRecord[]>(endpoint, {
      method: 'GET',
    });

    return response.result;
  } catch (error) {
    throw new Error(
      `DNS list failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROVISIONING ORCHESTRATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ProvisioningRequest {
  siteId: string;
  businessName: string;
  vertical: 'restaurant' | 'services';
  description: string;
  photoUrls: string[];
  hoursJson: Record<string, unknown>;
}

/**
 * Main provisioning orchestration function.
 * Called during site creation to set up D1, R2, DNS, and Worker bindings.
 *
 * Performs all operations in order:
 * 1. D1: Create site-specific record in multi_tenant_sites table
 * 2. R2: Initialize site folder and upload assets
 * 3. DNS: Create CNAME record for subdomain
 * 4. Updates: Insert content into D1 via MCP
 *
 * @param request - Provisioning request with site details
 * @param zoneId - Cloudflare DNS zone ID
 * @returns Provisioning result with site URL and status
 */
export async function provisionSite(
  request: ProvisioningRequest,
  zoneId: string
): Promise<{ siteUrl: string; siteId: string; status: 'success' | 'partial' }> {
  const { siteId, businessName, vertical, description, photoUrls, hoursJson } = request;
  const errors: string[] = [];

  try {
    // Step 1: Create D1 record
    try {
      await d1Execute(
        `
        INSERT INTO sites (site_id, business_name, vertical, description, hours_json, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'provisioning', datetime('now'))
      `,
        [siteId, businessName, vertical, description, JSON.stringify(hoursJson)]
      );
    } catch (error) {
      errors.push(`D1 insert failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Step 2: Create DNS record
    try {
      await dnsCreateRecord(zoneId, siteId, 'localgenius.site', true);
    } catch (error) {
      errors.push(`DNS creation failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Step 3: Upload photos to R2
    for (const photoUrl of photoUrls) {
      try {
        const photoResponse = await fetch(photoUrl);
        const photoData = await photoResponse.arrayBuffer();
        const fileName = photoUrl.split('/').pop() || 'photo.jpg';

        await r2Upload(siteId, `media/${fileName}`, photoData, {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'max-age=31536000', // 1 year
        });
      } catch (error) {
        errors.push(`Photo upload failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Step 4: Update D1 status to 'provisioned'
    try {
      await d1Execute('UPDATE sites SET status = ? WHERE site_id = ?', [
        'provisioned',
        siteId,
      ]);
    } catch (error) {
      errors.push(`D1 status update failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    const siteUrl = `https://${siteId}.localgenius.site`;

    return {
      siteUrl,
      siteId,
      status: errors.length === 0 ? 'success' : 'partial',
    };
  } catch (error) {
    throw new Error(
      `Provisioning failed: ${errors.join('; ')} | ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * USAGE EXAMPLES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * All functions automatically use cloudflareConfig.accountId. No hardcoding needed.
 *
 * // Query D1
 * const sites = await d1Query('SELECT * FROM sites WHERE status = ?', ['provisioned']);
 *
 * // Upload to R2
 * await r2Upload('acme-pizza-sf', 'menu.pdf', pdfBuffer);
 *
 * // Create DNS record
 * await dnsCreateRecord(zoneId, 'acme-pizza-sf', 'localgenius.site', true);
 *
 * // Full provisioning
 * await provisionSite({
 *   siteId: 'acme-pizza-sf',
 *   businessName: 'Acme Pizza',
 *   vertical: 'restaurant',
 *   description: 'Best pizza in SF',
 *   photoUrls: ['https://...'],
 *   hoursJson: { Mon: '10am-10pm', ... }
 * }, zoneId);
 */

export default {
  d1Query,
  d1Execute,
  d1Migrate,
  r2Upload,
  r2Delete,
  r2ListObjects,
  r2GetPublicUrl,
  workerDeploy,
  workerGet,
  dnsCreateRecord,
  dnsUpdateRecord,
  dnsDeleteRecord,
  dnsListRecords,
  provisionSite,
};
