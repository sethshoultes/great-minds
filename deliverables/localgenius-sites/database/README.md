# LocalGenius Sites — D1 Database Schema

**Generated**: 2026-04-14
**Requirement**: REQ-005: Single D1 database with all tenants partitioned by site_id
**Status**: Complete and Production-Ready

---

## Executive Summary

LocalGenius Sites uses a single Cloudflare D1 SQLite database shared by all tenants. All data is partitioned by `site_id`, a unique identifier for each provisioned website. Every query MUST filter by `site_id` to maintain multi-tenant isolation.

**Key Principle**: "One deployment, one migration path, one monitoring dashboard." — Elon Musk

---

## Architecture Decision

### Why Single D1 Instead of Per-Tenant Databases?

| Aspect | Per-Tenant D1 (Rejected) | Single D1 (Chosen) |
|--------|---------------------------|-------------------|
| **Deployments** | 1 per tenant (50K+ deployments at scale) | 1 total (single deployment) |
| **Migrations** | Complex coordination across instances | Single migration path |
| **Debugging** | 50K separate databases to monitor | One monitoring dashboard |
| **Operational Burden** | Exponential (maintenance nightmare) | Linear (manageable) |
| **Query Performance** | Smaller per-tenant datasets (fast) | Single indexed dataset (fast with proper indexes) |
| **Data Leakage Risk** | Isolated by default | Requires discipline (site_id in every query) |

**Decision**: Single D1 database with strict multi-tenant partitioning via `site_id`.

---

## Schema Overview

### Table 1: `sites`
Core table for all provisioned websites.

**Columns**:
| Column | Type | Required | Purpose |
|--------|------|----------|---------|
| `id` | TEXT | YES | UUID primary key |
| `site_id` | TEXT | YES | **Partition key** (multi-tenant identifier) |
| `organization_id` | TEXT | YES | Parent organization (back-reference) |
| `business_id` | TEXT | YES | Parent business (back-reference) |
| `slug` | TEXT | YES | URL slug (unique across all sites) |
| `template` | TEXT | YES | Template selection: `restaurant` \| `services` |
| `content` | TEXT | NO | JSON Portable Text (complete site content) |
| `status` | TEXT | YES | Site lifecycle: `pending` \| `live` \| `error` |
| `error_details` | TEXT | NO | JSON error context (if status=error) |
| `created_at` | DATETIME | YES | Creation timestamp |
| `updated_at` | DATETIME | YES | Last update timestamp |

**Indexes**:
- `idx_sites_site_id`: Fast tenant isolation
- `idx_sites_slug`: URL routing (filter by site_id first)
- `idx_sites_status`: Provisioning monitoring
- `idx_sites_business`: Back-reference queries
- `idx_sites_organization`: Org-level queries

**Lifecycle States**:
```
pending → (provisioning runs in background) → live
       ↘ (provisioning fails)              ↗ error (retry loop)
```

---

### Table 2: `sites_content`
Versioned content audit trail.

**Purpose**: Every content update creates a new version entry, enabling:
- Content rollback
- Version comparison (diff)
- Audit trail (who changed what)
- Change attribution (user vs. AI vs. auto-refresh)

**Columns**:
| Column | Type | Required | Purpose |
|--------|------|----------|---------|
| `id` | TEXT | YES | UUID primary key |
| `site_id` | TEXT | YES | **Partition key** |
| `version` | INTEGER | YES | Version number (auto-incrementing per site) |
| `content` | TEXT | YES | JSON Portable Text snapshot |
| `change_source` | TEXT | NO | Who/what triggered: `user_manual` \| `ai_update` \| `api_auto_refresh` |
| `change_notes` | TEXT | NO | Audit comment (e.g., "Updated menu for Fall season") |
| `created_at` | DATETIME | YES | Version creation timestamp |

**Indexes**:
- `idx_sites_content_site_version`: History queries
- `idx_sites_content_source`: Audit filtering
- Unique constraint on (site_id, version)

**Example Workflow**:
```
User uploads site content v1.0
  ↓
sites.content = v1.0, sites_content.version = 1
  ↓
AI updates hours (6hr review sync)
  ↓
sites.content = v1.1, sites_content.version = 2, change_source = 'api_auto_refresh'
  ↓
User edits menu
  ↓
sites.content = v1.2, sites_content.version = 3, change_source = 'user_manual'
```

---

### Table 3: `sites_assets`
Image inventory and optimization metadata.

**Purpose**: Track all images served from R2, enabling:
- Responsive image serving (multiple sizes)
- Format optimization (WebP with JPEG fallback)
- Deduplication (same image, different crops)
- Cache busting (content hash)

**Columns**:
| Column | Type | Required | Purpose |
|--------|------|----------|---------|
| `id` | TEXT | YES | UUID primary key |
| `site_id` | TEXT | YES | **Partition key** |
| `original_path` | TEXT | YES | Path as uploaded (reference) |
| `optimized_path` | TEXT | YES | Path in R2: `{site_id}/{asset-id}.{format}` |
| `width` | INTEGER | NO | Original image width (px) |
| `height` | INTEGER | NO | Original image height (px) |
| `format` | TEXT | YES | Optimized format: `webp` \| `jpeg` \| `png` |
| `size_bytes` | INTEGER | NO | File size of optimized image |
| `content_hash` | TEXT | NO | SHA256 hash of original (deduplication) |
| `asset_type` | TEXT | NO | Category: `hero` \| `gallery` \| `thumbnail` \| `menu-item` |
| `created_at` | DATETIME | YES | Upload timestamp |
| `updated_at` | DATETIME | YES | Last update timestamp |

**Indexes**:
- `idx_sites_assets_site`: Asset queries
- `idx_sites_assets_path`: Serving lookups
- `idx_sites_assets_type`: Selective queries
- Unique constraint on (site_id, optimized_path)

**Example Asset Record**:
```json
{
  "id": "asset-123",
  "site_id": "site-abc123",
  "original_path": "uploads/restaurant/hero-summer.jpg",
  "optimized_path": "site-abc123/hero-summer.webp",
  "width": 1920,
  "height": 1080,
  "format": "webp",
  "size_bytes": 145000,
  "content_hash": "sha256:abc123...",
  "asset_type": "hero",
  "created_at": "2026-04-14T10:30:00Z"
}
```

---

## Multi-Tenant Safety Guidelines

### The Golden Rule
**Every query MUST include a `WHERE site_id = @site_id` clause.**

Violating this rule introduces multi-tenant data leakage.

### Safe Query Examples

**Get a site**:
```sql
SELECT * FROM sites WHERE site_id = @site_id AND slug = @slug
```

**Get content history**:
```sql
SELECT * FROM sites_content WHERE site_id = @site_id ORDER BY version DESC
```

**Get images by type**:
```sql
SELECT * FROM sites_assets WHERE site_id = @site_id AND asset_type = 'hero'
```

**Update content (insert new version)**:
```sql
INSERT INTO sites_content (id, site_id, version, content, change_source, change_notes)
VALUES (
  uuid(),
  @site_id,
  (SELECT MAX(version) + 1 FROM sites_content WHERE site_id = @site_id),
  @new_content,
  'user_manual',
  'User edited business hours'
)
```

### Anti-Patterns (DO NOT DO)

❌ Query without site_id filter:
```sql
SELECT * FROM sites WHERE slug = @slug  -- WRONG: exposes all sites with this slug
```

❌ Implicit site_id via authentication:
```sql
SELECT * FROM sites WHERE business_id = @business_id  -- RISKY: trusts auth layer
```

❌ Trusting application-layer filtering alone:
```csharp
var allSites = db.Sites.ToList();
var site = allSites.FirstOrDefault(s => s.SiteId == currentSiteId);  // WRONG: loads all rows
```

### Code Review Checklist

Before merging any database query:
- [ ] Does the query include `WHERE site_id = @site_id`?
- [ ] Is `@site_id` parameterized (never string-concatenated)?
- [ ] Does the query operate on the correct table (sites, sites_content, or sites_assets)?
- [ ] Are indexes used correctly for performance?
- [ ] Is the query tested with multiple sites to verify isolation?

---

## Performance Characteristics

### Query Performance (Indexed Queries)

| Query Type | Index Used | Expected Performance |
|------------|------------|---------------------|
| Get site by slug | `idx_sites_slug` | <5ms (< 100K sites) |
| Get content history | `idx_sites_content_site_version` | <2ms |
| Get images by type | `idx_sites_assets_type` | <2ms |
| List all sites for org | `idx_sites_organization` | <10ms (100K sites) |

### Scaling Characteristics

- **At 1K sites**: Single table, minimal contention
- **At 10K sites**: Indexes critical, partition key essential
- **At 50K sites**: Consider read replicas (future: D1 federation)
- **At 100K+ sites**: Plan federation across multiple Cloudflare accounts

**Future Scaling** (Phase 2, at 10K+ sites):
- Parameterize `cloudflareAccountId` in environment
- Implement shard-aware routing
- Distribute sites across federated D1 instances by geographic region or customer tier

---

## Content Schemas (Portable Text)

### Restaurant Template Schema

```typescript
// src/lib/portable-text-schema.ts

export const restaurantContentSchema = {
  name: 'restaurantContent',
  type: 'object',
  fields: [
    {
      name: 'businessInfo',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', required: true },
        { name: 'description', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'website', type: 'url' },
        { name: 'cuisineType', type: 'array', of: [{ type: 'string' }] },
      ],
    },
    {
      name: 'hours',
      type: 'object',
      fields: [
        { name: 'monday', type: 'string' },    // "11am - 10pm"
        { name: 'tuesday', type: 'string' },
        { name: 'wednesday', type: 'string' },
        { name: 'thursday', type: 'string' },
        { name: 'friday', type: 'string' },
        { name: 'saturday', type: 'string' },
        { name: 'sunday', type: 'string' },
        { name: 'holidays', type: 'array', of: [
          {
            type: 'object',
            fields: [
              { name: 'date', type: 'string' }, // ISO date
              { name: 'note', type: 'string' },
            ]
          }
        ]},
      ],
    },
    {
      name: 'menu',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'section', type: 'string', required: true }, // "Appetizers", "Entrees", etc.
            { name: 'items', type: 'array', of: [
              {
                type: 'object',
                fields: [
                  { name: 'name', type: 'string', required: true },
                  { name: 'description', type: 'string' },
                  { name: 'price', type: 'number' },
                  { name: 'image', type: 'url' },
                  { name: 'allergens', type: 'array', of: [{ type: 'string' }] },
                ]
              }
            ]},
          ]
        }
      ],
    },
    {
      name: 'photos',
      type: 'array',
      of: [{ type: 'url' }],
    },
    {
      name: 'socialLinks',
      type: 'object',
      fields: [
        { name: 'instagram', type: 'url' },
        { name: 'facebook', type: 'url' },
        { name: 'yelp', type: 'url' },
      ],
    },
  ],
};
```

### Services Template Schema

```typescript
export const servicesContentSchema = {
  name: 'servicesContent',
  type: 'object',
  fields: [
    {
      name: 'businessInfo',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', required: true },
        { name: 'description', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'website', type: 'url' },
      ],
    },
    {
      name: 'hours',
      type: 'object',
      fields: [
        { name: 'monday', type: 'string' },
        { name: 'tuesday', type: 'string' },
        { name: 'wednesday', type: 'string' },
        { name: 'thursday', type: 'string' },
        { name: 'friday', type: 'string' },
        { name: 'saturday', type: 'string' },
        { name: 'sunday', type: 'string' },
      ],
    },
    {
      name: 'services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'category', type: 'string', required: true }, // "Hair", "Nails", etc.
            { name: 'items', type: 'array', of: [
              {
                type: 'object',
                fields: [
                  { name: 'name', type: 'string', required: true },
                  { name: 'description', type: 'string' },
                  { name: 'price', type: 'number' },
                  { name: 'duration', type: 'string' }, // "30 min", "1 hour"
                  { name: 'image', type: 'url' },
                ]
              }
            ]},
          ]
        }
      ],
    },
    {
      name: 'photos',
      type: 'array',
      of: [{ type: 'url' }],
    },
    {
      name: 'cta',
      type: 'object',
      fields: [
        { name: 'bookingUrl', type: 'url' },
        { name: 'buttonText', type: 'string', default: 'Book Now' },
      ],
    },
  ],
};
```

---

## Data Lifecycle

### On Site Provisioning (Happy Path)

```
1. User completes onboarding (4 inputs)
2. System creates site record with status='pending'
3. Content validated against schema
4. First sites_content entry created (version=1)
5. Images optimized → sites_assets entries created
6. Async provisioning begins (doesn't block user)
7. When complete: sites.status='live'
8. Site accessible at {slug}.localgenius.site
```

### On Content Update (MCP-Initiated)

```
1. User says "Update the menu" in chat
2. AI parses intent, generates new content
3. Validates against template schema
4. Creates sites_content entry (version=N+1)
5. Updates sites.content with new version
6. MCP sends update to Emdash
7. Cache invalidated via KV
8. User sees confirmation: "I updated your menu"
```

### On Error

```
1. Provisioning fails (e.g., R2 upload timeout)
2. sites.status='error'
3. sites.error_details = JSON { message, code, timestamp }
4. Async retry queue picks up
5. Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s max
6. After 5 failures: circuit break + alert
7. Static preview remains live during retry
```

---

## Monitoring & Alerting

### Key Metrics

```sql
-- Sites by status
SELECT status, COUNT(*) as count FROM sites GROUP BY status;

-- Content update frequency
SELECT
  site_id,
  COUNT(*) as total_versions,
  MAX(created_at) as last_update
FROM sites_content
GROUP BY site_id
ORDER BY last_update DESC
LIMIT 10;

-- Asset usage by type
SELECT asset_type, COUNT(*) as count FROM sites_assets GROUP BY asset_type;

-- Provisioning failures (last 24h)
SELECT
  error_details,
  COUNT(*) as count
FROM sites
WHERE status = 'error' AND created_at > datetime('now', '-1 day')
GROUP BY error_details;
```

### Alerting Rules

- **Error rate > 2%**: Alert on Slack (provisioning health)
- **Query latency p99 > 50ms**: Add index or split data
- **Assets table > 1M rows**: Plan cleanup (old assets)
- **Any query without site_id**: Code review failure (critical)

---

## Migration Strategy

### D1 Deployment Steps

1. **Day 1**: Create D1 database in Cloudflare account
2. **Day 2**: Run `sites_schema.sql` (all tables + indexes)
3. **Day 3**: Seed test data for each template
4. **Day 4**: Deploy application with connection string
5. **Day 5**: Run integration tests (multi-tenant isolation)
6. **Day 6**: Load testing (1K+ concurrent sites)
7. **Day 7**: Production launch

### Backward Compatibility

- Schema v1.0 supports both Restaurant and Services templates
- Future columns added as optional (no migration required)
- Version field in sites_content enables future schema evolution

### Rollback Plan

If production issues occur:
1. Revert to static HTML fallback (sites remain accessible)
2. Restore from D1 backup (if available)
3. Migrate to new database (federation strategy)

---

## Future Enhancements (Phase 2+)

### v1.1 (Post-Launch)
- [ ] Analytics table (page views, clicks, conversions)
- [ ] Review sync table (Google reviews snapshot)
- [ ] SEO metadata tracking

### v2.0 (D1 Federation)
- [ ] Multi-region D1 deployment
- [ ] Shard routing by cloudflareAccountId
- [ ] Cross-region failover

### v3.0 (Custom Domains)
- [ ] Custom domain mapping table
- [ ] SSL certificate tracking
- [ ] CNAME validation

---

## References

- **Requirement**: /great-minds/.planning/REQUIREMENTS.md (REQ-005)
- **Decision Document**: /great-minds/rounds/localgenius-sites/decisions.md (Decision 2)
- **Architecture Guide**: /localgenius/src/db/schema.ts (Drizzle patterns)

---

**Version**: 1.0
**Last Updated**: 2026-04-14
**Status**: Production Ready
