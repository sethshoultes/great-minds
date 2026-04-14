# R2 Client Library Documentation

## Overview

The `cloudflare-r2.ts` module provides a production-ready client for managing site assets in Cloudflare R2. It implements the multi-tenant architecture required by REQ-006: Single R2 bucket, partitioned by site_id.

**Key Features:**
- Multi-tenant path isolation (all sites in one bucket)
- Automatic CDN caching headers
- Comprehensive error handling
- Pagination support for large asset collections
- Signed URL generation for private assets
- Singleton pattern for resource efficiency

## Architecture

### Multi-Tenant Design

All sites share a single R2 bucket. Isolation is achieved through path prefixing:

```
R2 Bucket Structure:
├── site-id-1/
│   ├── images/
│   │   ├── hero.jpg
│   │   └── menu-item.png
│   └── html/
│       ├── index.html
│       └── about.html
├── site-id-2/
│   ├── images/
│   │   └── logo.jpg
│   └── html/
│       └── index.html
└── site-id-3/
    └── images/
        └── photo.jpg
```

**Benefits:**
- Single monitoring dashboard
- One deployment pipeline
- Simpler operational complexity
- Easier debugging across 50K+ sites

**Isolation:**
- Site 1 can only access/list files under `site-id-1/`
- Site 2 can only access/list files under `site-id-2/`
- No cross-tenant data leakage possible at the path level

## Configuration

### Environment Variables

Required environment variables (from `.env`):

```bash
# R2 Access Credentials
R2_ACCESS_KEY_ID=xxxxx                           # API token access key
R2_SECRET_ACCESS_KEY=xxxxx                       # API token secret
R2_BUCKET_NAME=localgenius-media                 # Shared bucket name
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com  # R2 endpoint
```

### Wrangler Configuration Example

For Cloudflare Workers consuming this module:

```toml
# wrangler.toml

[env.production]
vars = { R2_BUCKET_NAME = "localgenius-media" }

[[r2_buckets]]
binding = "R2"
bucket_name = "localgenius-media"
jurisdiction = "eu"
preview_bucket_name = "localgenius-media-preview"

# Custom domain for CDN access (optional)
[env.production.routes]
pattern = "assets.localgenius.site/*"
zone_id = "your-zone-id"

# Cache Rules (Cloudflare Dashboard)
# Rule 1: Images stay cached 1 year
#   Path: assets.localgenius.site/*/(images|fonts)/*
#   TTL: 1 year
#
# Rule 2: HTML always revalidates
#   Path: assets.localgenius.site/*/html/*
#   TTL: 0 (no cache)
```

## API Reference

### `getR2Client(): CloudflareR2Client`

Get or create the R2 client singleton.

**Usage:**
```typescript
import { getR2Client } from './cloudflare-r2';

const r2 = getR2Client();
```

**Returns:**
- `CloudflareR2Client`: Singleton instance

---

### `uploadAsset(siteId, file, path, contentType?): Promise<UploadResult>`

Upload a file to R2 with automatic cache headers.

**Parameters:**
- `siteId` (string): Tenant identifier (alphanumeric, hyphens, underscores)
- `file` (Buffer | Uint8Array): File content
- `path` (string): Asset path relative to site directory
- `contentType?` (string): MIME type (auto-detected if not provided)

**Returns:**
```typescript
{
  path: string;        // Full R2 path (e.g., "site-123/images/hero.jpg")
  url: string;         // Public CDN URL
  etag: string;        // S3 ETag for cache validation
  contentType: string; // MIME type
  size: number;        // File size in bytes
}
```

**Example:**
```typescript
const r2 = getR2Client();

const imageBuffer = fs.readFileSync('hero.jpg');
const result = await r2.uploadAsset(
  'restaurant-001',
  imageBuffer,
  'images/hero.jpg',
  'image/jpeg'
);

console.log(result.url);
// => https://xxxxx.r2.cloudflarestorage.com/restaurant-001/images/hero.jpg
```

**Cache Headers Applied:**
- Images: `max-age=31536000, immutable` (1 year)
- HTML: `max-age=0, must-revalidate` (no cache)
- Fonts/CSS/JS: `max-age=31536000, immutable` (1 year)
- Other: `max-age=3600, must-revalidate` (1 hour)

---

### `getAssetUrl(siteId, path): string`

Get the public CDN URL for an asset (no verification).

**Parameters:**
- `siteId` (string): Tenant identifier
- `path` (string): Asset path relative to site directory

**Returns:**
- `string`: Public CDN URL

**Example:**
```typescript
const url = r2.getAssetUrl('restaurant-001', 'images/hero.jpg');
// => https://xxxxx.r2.cloudflarestorage.com/restaurant-001/images/hero.jpg
```

**Note:** This method does NOT verify if the asset exists. Use for URL construction only.

---

### `getSignedUrl(siteId, path, expirySeconds?): Promise<string>`

Generate a signed URL for time-limited or private access.

**Parameters:**
- `siteId` (string): Tenant identifier
- `path` (string): Asset path relative to site directory
- `expirySeconds?` (number): Expiration time in seconds (default: 3600)

**Returns:**
- `Promise<string>`: Signed URL with embedded credentials

**Example:**
```typescript
// 1-hour private link
const signedUrl = await r2.getSignedUrl(
  'restaurant-001',
  'images/private-menu.pdf',
  3600
);
```

---

### `deleteAsset(siteId, path): Promise<void>`

Permanently delete an asset from R2.

**Parameters:**
- `siteId` (string): Tenant identifier
- `path` (string): Asset path relative to site directory

**Returns:**
- `Promise<void>`

**Example:**
```typescript
await r2.deleteAsset('restaurant-001', 'images/old-photo.jpg');
```

**⚠️ Warning:** Deletion is permanent and immediate. No soft-delete or versioning.

---

### `listAssets(siteId, options?): Promise<ListAssetsResult>`

List assets for a site with pagination support.

**Parameters:**
- `siteId` (string): Tenant identifier
- `options?` (ListAssetsOptions):
  - `limit?` (number): Max results per page (default: 1000, max: 1000)
  - `prefix?` (string): Filter by asset type (e.g., 'images/', 'html/')
  - `continuationToken?` (string): Token for pagination

**Returns:**
```typescript
{
  assets: Asset[];           // Array of assets
  nextContinuationToken?: string;  // Token for next page
  isTruncated: boolean;      // Whether more results exist
}
```

**Asset Object:**
```typescript
{
  key: string;           // Full R2 key (e.g., "site-123/images/hero.jpg")
  name: string;          // Filename only (e.g., "hero.jpg")
  size: number;          // File size in bytes
  modified: Date;        // Last modified timestamp
  contentType?: string;  // MIME type
  url: string;           // Public CDN URL
}
```

**Examples:**

List all assets:
```typescript
const result = await r2.listAssets('restaurant-001');
for (const asset of result.assets) {
  console.log(asset.name);
}
```

List only images:
```typescript
const result = await r2.listAssets('restaurant-001', {
  prefix: 'images/',
  limit: 100
});
```

Pagination:
```typescript
let continuationToken: string | undefined;
do {
  const result = await r2.listAssets('restaurant-001', {
    prefix: 'images/',
    limit: 100,
    continuationToken
  });

  for (const asset of result.assets) {
    console.log(asset.name);
  }

  continuationToken = result.nextContinuationToken;
} while (continuationToken);
```

## Path Convention

Recommended directory structure within each site_id:

```
{site_id}/
├── images/          # Hero images, menu photos, team photos
│   ├── hero.jpg
│   ├── menu-1.png
│   └── team-photo.webp
├── html/            # Rendered static HTML from Emdash
│   ├── index.html
│   ├── menu.html
│   └── about.html
├── fonts/           # Custom fonts (if needed)
│   └── custom-font.woff2
└── styles/          # Compiled CSS (if needed)
    └── main.css
```

**Path Examples:**
- `uploadAsset('site-123', buffer, 'images/hero.jpg')`
- `uploadAsset('site-123', buffer, 'html/index.html')`
- `listAssets('site-123', { prefix: 'images/' })`

## Caching Strategy

### Cache-Control Headers

The client automatically applies appropriate caching headers based on file type:

| File Type | Cache Header | Duration | Rationale |
|-----------|--------------|----------|-----------|
| Images (.jpg, .png, .webp, .gif, .svg) | `max-age=31536000, immutable` | 1 year | Rarely change, should be versioned in URL |
| Fonts (.woff, .woff2, .ttf, .otf) | `max-age=31536000, immutable` | 1 year | Stable, improves performance |
| Scripts/Styles (.js, .css) | `max-age=31536000, immutable` | 1 year | Versioned in URL at build time |
| HTML files | `max-age=0, must-revalidate, no-cache` | 0 seconds | Frequently updated, always validate |
| Other files | `max-age=3600, must-revalidate` | 1 hour | Default for unknown types |

### Implementation Notes

1. **Immutable Assets**: Only use 1-year caching for versioned assets. Image URLs should include version hash: `hero-v2.jpg`, `style-abc123.css`

2. **HTML Strategy**: Static HTML from Emdash is always revalidated. Cloudflare Caching Rules can be used to serve from edge cache while validating:
   ```toml
   # Cloudflare Cache Rule
   Path: assets.localgenius.site/*/html/*
   TTL: 0 (validate on every request)
   ```

3. **Edge Performance**: While HTML has TTL=0, Cloudflare edge still serves cached versions until revalidation check completes (typically <50ms).

## Error Handling

All methods throw `Error` on failure with descriptive messages:

```typescript
try {
  await r2.uploadAsset('site-123', buffer, 'images/hero.jpg');
} catch (error) {
  console.error(`Upload failed: ${error.message}`);
  // Handle error (retry, fallback, etc.)
}
```

**Common Errors:**
- `Missing required R2 environment variables`: Check .env configuration
- `Invalid site_id: must be alphanumeric`: Site ID contains special characters
- `File cannot be empty`: Empty buffer passed to uploadAsset
- `Failed to upload asset to R2`: Network/S3 API error

## Multi-Account Federation (Future)

For 50K+ sites at scale, the architecture supports federation across multiple Cloudflare accounts:

```typescript
// Future: Multi-account support (Phase 2)
interface FederationConfig {
  cloudflareAccountId: string;  // Route by account
  r2BucketName: string;
  region: string;
}

// At launch: single account
// At 10K+ sites: route by federation table in Neon
// At 50K+ sites: parallel provisioning to multiple accounts
```

## Security Considerations

1. **Environment Variables**: Never commit R2 secrets to version control
2. **Site Isolation**: Path prefixing ensures no cross-tenant access at the file system level
3. **Access Control**: Each site_id is isolated; API token has no per-site restrictions (operate at infrastructure level)
4. **Signed URLs**: Use for time-limited private links; default is public CDN access
5. **HTTPS Only**: R2 endpoint is HTTPS; all transfers are encrypted in transit

## Monitoring & Observability

The client includes metadata tags for debugging:

```typescript
// Metadata added to each upload
Metadata: {
  "uploaded-at": "2026-04-14T12:30:00Z",
  "site-id": "restaurant-001"
}
```

These can be queried in Cloudflare Analytics or R2 API for:
- Asset inventory by site
- Upload timestamp tracking
- Storage optimization analysis

## Testing

See `cloudflare-r2.example.ts` for comprehensive usage examples:

- Upload images
- Upload HTML files
- Get asset URLs
- Generate signed URLs
- List assets with filters
- Delete assets
- Complete provisioning workflow
- Multi-tenant isolation verification

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Missing required R2 environment variables" | .env not configured | Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT |
| Upload returns 403 | Invalid credentials | Verify API token has R2 permissions |
| Upload returns 404 | Bucket doesn't exist | Verify bucket name matches R2 console |
| URLs are 404 | Asset not uploaded | Check site_id and path spelling |
| Cache not working | Headers not applied | Verify Cloudflare Cache Rules are enabled |
| Pagination returns empty | Token expired | Re-request first page |

## References

- [AWS SDK S3Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/): S3-compatible API
- [Cloudflare R2 API](https://developers.cloudflare.com/r2/api/): R2 documentation
- [Cache-Control Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control): MDN reference
- Decision Document: `/rounds/localgenius-sites/decisions.md` (Decision 2: Multi-Tenant Architecture)
