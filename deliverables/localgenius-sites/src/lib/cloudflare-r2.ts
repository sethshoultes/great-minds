/**
 * Cloudflare R2 Client Library for LocalGenius Sites
 *
 * This module provides a client for managing site assets in Cloudflare R2.
 * Multi-tenant architecture: all sites share a single R2 bucket, partitioned by site_id.
 *
 * Path Convention:
 * - Images: {site_id}/images/{filename}
 * - HTML/Static files: {site_id}/html/{filename}
 * - General assets: {site_id}/{asset_type}/{filename}
 *
 * CDN Caching Strategy:
 * - Immutable assets (versioned): Cache-Control: max-age=31536000, immutable
 * - Dynamic content: Cache-Control: max-age=3600, must-revalidate
 * - HTML files: Cache-Control: max-age=0, must-revalidate (no-cache)
 *
 * Environment Variables Required (for Cloudflare R2):
 * - R2_ACCESS_KEY_ID: Account-level R2 API token access key
 * - R2_SECRET_ACCESS_KEY: Account-level R2 API token secret
 * - R2_BUCKET_NAME: Single shared bucket name (e.g., 'localgenius-media')
 * - R2_ENDPOINT: R2 endpoint URL (e.g., 'https://xxxxx.r2.cloudflarestorage.com')
 *
 * Wrangler Configuration Example:
 * ```toml
 * # wrangler.toml
 * [env.production]
 * vars = { R2_BUCKET_NAME = "localgenius-media" }
 *
 * [[r2_buckets]]
 * binding = "R2"
 * bucket_name = "localgenius-media"
 * jurisdiction = "eu"
 * preview_bucket_name = "localgenius-media-preview"
 *
 * # Caching Rules (Cloudflare Worker)
 * custom_domain = "assets.localgenius.site"
 * custom_domain_sni = "assets.localgenius.site"
 * ```
 *
 * D1 Federation Strategy (for future scaling):
 * This module is parameterized for multi-account R2 setup via cloudflareAccountId.
 * At launch: single account. At 50K+ sites: route by account using federation table.
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Interface for upload operation results
 */
export interface UploadResult {
  /** Full path in R2 bucket (including site_id prefix) */
  path: string;
  /** Public CDN URL for the asset */
  url: string;
  /** ETag from S3 response (used for cache validation) */
  etag: string;
  /** Content type of uploaded file */
  contentType: string;
  /** Size of uploaded file in bytes */
  size: number;
}

/**
 * Interface for asset metadata
 */
export interface Asset {
  /** Full key path in R2 bucket */
  key: string;
  /** Asset filename only (without site_id prefix) */
  name: string;
  /** Size in bytes */
  size: number;
  /** Last modified timestamp */
  modified: Date;
  /** Content type */
  contentType?: string;
  /** Public URL */
  url: string;
}

/**
 * Interface for asset listing options
 */
export interface ListAssetsOptions {
  /** Limit number of results (default: 1000, max: 1000) */
  limit?: number;
  /** Prefix within site directory (e.g., 'images/', 'html/') */
  prefix?: string;
  /** Continuation token from previous listing */
  continuationToken?: string;
}

/**
 * Interface for listing results with pagination
 */
export interface ListAssetsResult {
  /** Array of assets found */
  assets: Asset[];
  /** Continuation token if more results available */
  nextContinuationToken?: string;
  /** Whether there are more results */
  isTruncated: boolean;
}

/**
 * CloudflareR2Client - Production-ready R2 bucket manager for LocalGenius Sites
 *
 * Features:
 * - Multi-tenant path isolation (site_id prefix)
 * - Automatic CDN caching headers
 * - Signed URL generation for private assets
 * - Comprehensive error handling
 * - Asset listing with pagination
 * - Environment-based configuration
 */
class CloudflareR2Client {
  private s3Client: S3Client;
  private bucketName: string;
  private cdnBaseUrl: string;
  private region: string = "auto";

  /**
   * Initialize R2 client with environment configuration
   *
   * @throws Error if required environment variables are missing
   */
  constructor() {
    // Validate required environment variables
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const endpoint = process.env.R2_ENDPOINT;

    if (!accessKeyId || !secretAccessKey || !bucketName || !endpoint) {
      throw new Error(
        "Missing required R2 environment variables: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT"
      );
    }

    this.bucketName = bucketName;
    this.cdnBaseUrl = this.deriveCdnUrl(endpoint);

    // Initialize S3 client with R2 configuration
    // R2 is S3-compatible, so we use AWS SDK with custom endpoint
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint,
      forcePathStyle: true,
    });
  }

  /**
   * Derive CDN base URL from R2 endpoint
   * Converts s3-compatible endpoint to CDN URL
   *
   * Example: https://xxxxx.r2.cloudflarestorage.com → https://xxxxx.r2.cloudflarestorage.com
   *
   * @param endpoint R2 endpoint URL
   * @returns Base URL for CDN access
   */
  private deriveCdnUrl(endpoint: string): string {
    // Remove trailing slash if present
    return endpoint.replace(/\/$/, "");
  }

  /**
   * Build full R2 path with site_id prefix
   *
   * @param siteId Tenant identifier
   * @param assetPath Asset path relative to site directory
   * @returns Full path for R2 key
   */
  private buildR2Path(siteId: string, assetPath: string): string {
    // Ensure siteId is alphanumeric (prevent directory traversal)
    if (!/^[a-zA-Z0-9_-]+$/.test(siteId)) {
      throw new Error(`Invalid site_id: must be alphanumeric (got: ${siteId})`);
    }

    // Normalize asset path (remove leading/trailing slashes)
    const normalizedPath = assetPath.replace(/^\/+|\/+$/g, "");

    return `${siteId}/${normalizedPath}`;
  }

  /**
   * Upload file to R2 bucket with automatic CDN caching headers
   *
   * Usage:
   * ```typescript
   * const result = await r2.uploadAsset('site-123', imageBuffer, 'images/hero.jpg');
   * console.log(result.url); // https://xxxxx.r2.cloudflarestorage.com/site-123/images/hero.jpg
   * ```
   *
   * Caching Strategy:
   * - Images (*.jpg, *.png, *.webp): max-age=31536000, immutable
   * - HTML files: max-age=0, must-revalidate
   * - Other assets: max-age=3600, must-revalidate
   *
   * @param siteId Tenant site identifier
   * @param file File content (Buffer or Uint8Array)
   * @param path Asset path relative to site directory (e.g., 'images/hero.jpg')
   * @param contentType MIME type (auto-detected from path if not provided)
   * @returns Upload result with public URL and metadata
   * @throws Error if upload fails or parameters are invalid
   */
  async uploadAsset(
    siteId: string,
    file: Buffer | Uint8Array,
    path: string,
    contentType?: string
  ): Promise<UploadResult> {
    try {
      // Validate inputs
      if (!siteId || !path) {
        throw new Error("siteId and path are required");
      }

      if (!file || (Buffer.isBuffer(file) ? file.length === 0 : file.byteLength === 0)) {
        throw new Error("File cannot be empty");
      }

      const fullPath = this.buildR2Path(siteId, path);

      // Auto-detect content type if not provided
      const detectedContentType = contentType || this.detectContentType(path);

      // Determine cache headers based on asset type
      const cacheControl = this.determineCacheControl(path);

      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fullPath,
        Body: file,
        ContentType: detectedContentType,
        CacheControl: cacheControl,
        // Add metadata for debugging and future enrichment
        Metadata: {
          "uploaded-at": new Date().toISOString(),
          "site-id": siteId,
        },
      });

      const response = await this.s3Client.send(command);

      // Build public CDN URL
      const publicUrl = `${this.cdnBaseUrl}/${fullPath}`;

      // Extract size from file
      const size = Buffer.isBuffer(file) ? file.length : file.byteLength;

      return {
        path: fullPath,
        url: publicUrl,
        etag: response.ETag || "",
        contentType: detectedContentType,
        size,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload asset to R2: ${errorMessage}`);
    }
  }

  /**
   * Get public CDN URL for an existing asset
   *
   * Usage:
   * ```typescript
   * const url = r2.getAssetUrl('site-123', 'images/hero.jpg');
   * // https://xxxxx.r2.cloudflarestorage.com/site-123/images/hero.jpg
   * ```
   *
   * Note: This method does NOT verify if the asset exists. Use for URL construction only.
   * For conditional access, use getSignedUrl() instead.
   *
   * @param siteId Tenant site identifier
   * @param path Asset path relative to site directory
   * @returns Public CDN URL
   * @throws Error if parameters are invalid
   */
  getAssetUrl(siteId: string, path: string): string {
    const fullPath = this.buildR2Path(siteId, path);
    return `${this.cdnBaseUrl}/${fullPath}`;
  }

  /**
   * Generate signed URL for private or time-limited access
   *
   * Usage:
   * ```typescript
   * // 1-hour expiry
   * const signedUrl = await r2.getSignedUrl('site-123', 'images/private.jpg', 3600);
   * ```
   *
   * @param siteId Tenant site identifier
   * @param path Asset path relative to site directory
   * @param expirySeconds Expiration time in seconds (default: 3600)
   * @returns Signed URL with embedded credentials
   * @throws Error if URL generation fails
   */
  async getSignedUrl(siteId: string, path: string, expirySeconds: number = 3600): Promise<string> {
    try {
      const fullPath = this.buildR2Path(siteId, path);

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fullPath,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expirySeconds,
      });

      return url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate signed URL: ${errorMessage}`);
    }
  }

  /**
   * Delete asset from R2 bucket
   *
   * Usage:
   * ```typescript
   * await r2.deleteAsset('site-123', 'images/old-photo.jpg');
   * ```
   *
   * Note: Deletion is permanent and immediate. No soft-delete or restore available.
   * Consider implementing version control in D1 if history is needed.
   *
   * @param siteId Tenant site identifier
   * @param path Asset path relative to site directory
   * @throws Error if deletion fails
   */
  async deleteAsset(siteId: string, path: string): Promise<void> {
    try {
      const fullPath = this.buildR2Path(siteId, path);

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fullPath,
      });

      await this.s3Client.send(command);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete asset from R2: ${errorMessage}`);
    }
  }

  /**
   * List all assets for a site with pagination support
   *
   * Path Convention for Filtering:
   * - Images only: listAssets('site-123', { prefix: 'images/' })
   * - HTML only: listAssets('site-123', { prefix: 'html/' })
   * - All assets: listAssets('site-123')
   *
   * Usage:
   * ```typescript
   * // Get first page of images
   * const result = await r2.listAssets('site-123', { prefix: 'images/', limit: 100 });
   * console.log(result.assets);
   *
   * // Pagination
   * if (result.isTruncated) {
   *   const nextPage = await r2.listAssets('site-123', {
   *     prefix: 'images/',
   *     continuationToken: result.nextContinuationToken
   *   });
   * }
   * ```
   *
   * @param siteId Tenant site identifier
   * @param options Listing options (prefix, limit, pagination)
   * @returns List of assets with pagination info
   * @throws Error if listing fails
   */
  async listAssets(siteId: string, options: ListAssetsOptions = {}): Promise<ListAssetsResult> {
    try {
      const limit = options.limit || 1000;

      // Build the list prefix: site_id/ + optional asset prefix
      let listPrefix = `${siteId}/`;
      if (options.prefix) {
        listPrefix += options.prefix.replace(/^\/+|\/+$/g, "") + "/";
      }

      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: listPrefix,
        MaxKeys: Math.min(limit, 1000), // AWS SDK enforces max 1000
        ContinuationToken: options.continuationToken,
      });

      const response = await this.s3Client.send(command);

      const assets: Asset[] = (response.Contents || []).map((object) => {
        // Extract filename without site_id and asset type prefix
        const key = object.Key || "";
        const name = key.substring(listPrefix.length);

        return {
          key,
          name,
          size: object.Size || 0,
          modified: object.LastModified || new Date(),
          contentType: this.detectContentType(key),
          url: `${this.cdnBaseUrl}/${key}`,
        };
      });

      return {
        assets,
        nextContinuationToken: response.NextContinuationToken,
        isTruncated: response.IsTruncated || false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to list assets from R2: ${errorMessage}`);
    }
  }

  /**
   * Detect MIME type from file extension
   * Used for Content-Type header and cache control decisions
   *
   * @param path File path with extension
   * @returns MIME type string
   */
  private detectContentType(path: string): string {
    const ext = path.toLowerCase().split(".").pop() || "";

    const mimeTypes: Record<string, string> = {
      // Images
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      ico: "image/x-icon",
      // Documents
      pdf: "application/pdf",
      txt: "text/plain",
      // Archives
      zip: "application/zip",
      gz: "application/gzip",
      // Fonts
      woff: "font/woff",
      woff2: "font/woff2",
      ttf: "font/ttf",
      otf: "font/otf",
      // Video/Audio
      mp4: "video/mp4",
      webm: "video/webm",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      // Web
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      xml: "application/xml",
    };

    return mimeTypes[ext] || "application/octet-stream";
  }

  /**
   * Determine Cache-Control header based on asset type
   *
   * Strategy:
   * - Versioned/immutable assets (images, fonts): 1 year, immutable
   * - Dynamic HTML: no cache (max-age=0)
   * - Other assets: 1 hour with revalidation
   *
   * @param path Asset path/filename
   * @returns Cache-Control header value
   */
  private determineCacheControl(path: string): string {
    const ext = path.toLowerCase().split(".").pop() || "";

    // Immutable assets (1 year = 31536000 seconds)
    const immutableExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "woff", "woff2", "ttf", "otf", "js", "css"];
    if (immutableExtensions.includes(ext)) {
      return "public, max-age=31536000, immutable";
    }

    // HTML files - no caching (always revalidate)
    if (ext === "html") {
      return "public, max-age=0, must-revalidate, no-cache";
    }

    // Default - 1 hour with revalidation
    return "public, max-age=3600, must-revalidate";
  }

  /**
   * Close S3 client connection
   * Call when gracefully shutting down the application
   */
  async close(): Promise<void> {
    this.s3Client.destroy();
  }
}

/**
 * Singleton instance of CloudflareR2Client
 * Exported for global use throughout the application
 */
let r2Instance: CloudflareR2Client | null = null;

/**
 * Get or create R2 client singleton
 *
 * Usage:
 * ```typescript
 * import { getR2Client } from './cloudflare-r2';
 *
 * const r2 = getR2Client();
 * const result = await r2.uploadAsset('site-123', buffer, 'images/hero.jpg');
 * ```
 *
 * @returns CloudflareR2Client instance
 */
export function getR2Client(): CloudflareR2Client {
  if (!r2Instance) {
    r2Instance = new CloudflareR2Client();
  }
  return r2Instance;
}

export default CloudflareR2Client;
