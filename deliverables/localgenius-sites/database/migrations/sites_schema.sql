-- LocalGenius Sites — D1 Multi-Tenant Schema
--
-- Single D1 database shared by all tenants, partitioned by site_id.
-- All queries MUST filter by site_id.
-- No per-tenant database instances.
--
-- Generated: 2026-04-14
-- Requirement: REQ-005

-- ─── 1. Sites Table ────────────────────────────────────────────────────────
-- Core table for all provisioned websites. Partition key: site_id.
-- Stores site metadata, business info, template selection, and lifecycle status.

CREATE TABLE IF NOT EXISTS sites (
  -- Primary identifier
  id TEXT PRIMARY KEY,

  -- Multi-tenant partition key (REQUIRED on every query)
  site_id TEXT NOT NULL,

  -- Business context (for back-reference, context)
  organization_id TEXT NOT NULL,
  business_id TEXT NOT NULL,

  -- Site identity
  slug TEXT UNIQUE NOT NULL,

  -- Template selection (restaurant | services)
  -- AI selects silently based on vertical
  template TEXT NOT NULL CHECK (template IN ('restaurant', 'services')),

  -- Content stored as JSON Portable Text
  -- Structure depends on template type (see Portable Text schemas)
  -- Contains all editable business information:
  -- - name, description, hours, phone, address, photos
  -- - menu items (restaurant) or services list (services)
  -- - contact info, CTAs, etc.
  content TEXT,

  -- Site lifecycle status
  -- pending: site_id allocated, content created, waiting for provisioning
  -- live: provisioning complete, site accessible at {slug}.localgenius.site
  -- error: provisioning failed with error context in error_details
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'live', 'error')),

  -- Error tracking (JSON object with error message, code, timestamp)
  error_details TEXT,

  -- Timestamps
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index on site_id for tenant isolation queries
CREATE INDEX IF NOT EXISTS idx_sites_site_id ON sites(site_id);

-- Index on slug for URL routing (must filter by site_id first)
CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);

-- Index on status for provisioning monitoring
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(site_id, status);

-- Index on business_id for back-reference queries
CREATE INDEX IF NOT EXISTS idx_sites_business ON sites(site_id, business_id);

-- Index on organization_id for org-level queries
CREATE INDEX IF NOT EXISTS idx_sites_organization ON sites(site_id, organization_id);

-- ─── 2. Sites Content (Versioned) ──────────────────────────────────────────
-- Audit trail and versioning for site content.
-- Every content update creates a new version entry.
-- Enables rollback, diff, and content history.

CREATE TABLE IF NOT EXISTS sites_content (
  -- Primary identifier
  id TEXT PRIMARY KEY,

  -- Multi-tenant partition key
  site_id TEXT NOT NULL,

  -- Version number (auto-incrementing per site)
  version INTEGER NOT NULL,

  -- Content snapshot (JSON Portable Text)
  -- Same schema as sites.content at time of version
  content TEXT NOT NULL,

  -- Who/what triggered this version
  -- Values: 'user_manual', 'ai_update', 'api_auto_refresh'
  change_source TEXT DEFAULT 'user_manual',

  -- Change description for audit trail
  change_notes TEXT,

  -- Timestamp of version creation
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index on site_id + version for history queries
CREATE INDEX IF NOT EXISTS idx_sites_content_site_version ON sites_content(site_id, version DESC);

-- Index on change_source for audit filtering
CREATE INDEX IF NOT EXISTS idx_sites_content_source ON sites_content(site_id, change_source);

-- Unique constraint: only one version per site (site_id + version)
CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_content_unique ON sites_content(site_id, version);

-- ─── 3. Sites Assets ──────────────────────────────────────────────────────
-- Tracks optimized images served from R2.
-- Original uploaded, optimized variants stored at predictable paths.
-- Enables cache busting, responsive images, WebP fallback.

CREATE TABLE IF NOT EXISTS sites_assets (
  -- Primary identifier
  id TEXT PRIMARY KEY,

  -- Multi-tenant partition key
  site_id TEXT NOT NULL,

  -- Original file path (as uploaded or referenced)
  original_path TEXT NOT NULL,

  -- Optimized file path in R2
  -- Format: {site_id}/{asset-id}.{format}
  -- Example: site123/hero-image.webp
  optimized_path TEXT NOT NULL,

  -- Image dimensions (original)
  width INTEGER,
  height INTEGER,

  -- Image format of optimized version (webp | jpeg | png)
  format TEXT NOT NULL,

  -- File size in bytes (for optimization verification)
  size_bytes INTEGER,

  -- Hash of original for deduplication
  content_hash TEXT,

  -- Type: hero | gallery | thumbnail | icon | menu-item, etc.
  asset_type TEXT DEFAULT 'gallery',

  -- Timestamp
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index on site_id for asset queries
CREATE INDEX IF NOT EXISTS idx_sites_assets_site ON sites_assets(site_id);

-- Index on optimized_path for serving (always filter by site_id)
CREATE INDEX IF NOT EXISTS idx_sites_assets_path ON sites_assets(site_id, optimized_path);

-- Index on asset_type for selective queries
CREATE INDEX IF NOT EXISTS idx_sites_assets_type ON sites_assets(site_id, asset_type);

-- Unique constraint: one optimized path per site
CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_assets_unique ON sites_assets(site_id, optimized_path);

-- ─── Data Integrity Checks ────────────────────────────────────────────────
-- These ensure site_id is never NULL (partition key safety)

-- Trigger or application-level constraint:
-- All queries on sites, sites_content, sites_assets MUST include:
--   WHERE site_id = @site_id
--
-- Violating this constraint introduces data leakage and multi-tenant vulnerabilities.
-- Code review MUST verify every query includes the site_id filter.

-- ─── Example Queries (Production Safe) ────────────────────────────────────

-- Get site by slug (SAFE: filters by site_id)
-- SELECT * FROM sites WHERE site_id = @site_id AND slug = @slug

-- Get site content history (SAFE: filters by site_id)
-- SELECT * FROM sites_content WHERE site_id = @site_id ORDER BY version DESC

-- Get assets for hero image (SAFE: filters by site_id)
-- SELECT * FROM sites_assets WHERE site_id = @site_id AND asset_type = 'hero'

-- Update site content and increment version (SAFE: filters by site_id)
-- INSERT INTO sites_content (id, site_id, version, content, change_source, change_notes)
-- SELECT uuid(), site_id, MAX(version) + 1, @new_content, 'api_auto_refresh', 'Review sync'
-- FROM sites WHERE site_id = @site_id

-- ─── Migration History ────────────────────────────────────────────────────
-- v1.0 (2026-04-14): Initial multi-tenant schema
--   - sites: core site metadata and status
--   - sites_content: versioned content with audit trail
--   - sites_assets: optimized image inventory
