# Phase 1 Plan — LocalGenius Sites (Presence)

**Generated**: 2026-04-14
**Requirements**: `.planning/REQUIREMENTS.md` + `rounds/localgenius-sites/decisions.md`
**Total Tasks**: 18
**Waves**: 5
**Timeline**: Weeks 1-2 (Days 1-14)
**Product Name**: LocalGenius Sites (code) / Presence (marketing)

---

## Executive Summary

This plan covers **Phase 1** of LocalGenius Sites: Foundation & Provisioning Pipeline. The goal is to establish the core infrastructure, fork Emdash, build the static HTML provisioning pipeline, and run the Emdash benchmark audit in parallel — culminating in the **Day 14 decision point** for static vs. Emdash.

**Phase 1 Scope**:
- Fork Emdash and set up infrastructure
- Build static HTML provisioning pipeline
- Create provisioning state machine in Neon
- Implement image optimization pipeline
- Run Emdash SSR benchmark audit
- Define Portable Text schemas for both templates
- Begin template wireframes (parallel design track)

**Key Deliverable**: Day 14 benchmark results and decision document.

---

## Research Agent Findings

### Codebase Scout
- LocalGenius uses Next.js 14 + Drizzle ORM + Neon PostgreSQL
- Existing `services/sites.ts` and `services/website-generator.ts` provide integration points
- Onboarding pipeline at `services/onboarding-pipeline.ts` already handles 7 steps
- No existing MCP bridge or image optimization pipeline
- No async job queue for provisioning (currently synchronous)

### Requirements Analyst
- 65 atomic requirements extracted from decisions.md and PRD
- 53 MUST HAVE, 6 SHOULD HAVE, 6 NICE TO HAVE
- Phase 1 covers 24 requirements (architecture, provisioning, templates foundation)

### Risk Scanner
- **P0 Blockers**: Emdash SSR benchmark, Portable Text schema definition
- **P1 Risks**: Image optimization, async queue, MCP bridge
- **External Dependencies**: Emdash fork stability, Cloudflare D1 beta, sharp-wasm

---

## Requirements Traceability

| Requirement | Task(s) | Wave | Status |
|-------------|---------|------|--------|
| REQ-011: Fork Emdash | phase-1-task-1 | 1 | PENDING |
| REQ-005: Multi-tenant D1 schema | phase-1-task-2 | 1 | PENDING |
| REQ-006: R2 bucket setup | phase-1-task-3 | 1 | PENDING |
| REQ-026: Provisioning state machine | phase-1-task-4 | 1 | PENDING |
| REQ-010: Parameterize accountId | phase-1-task-5 | 1 | PENDING |
| REQ-027: Async queue service | phase-1-task-6 | 2 | PENDING |
| REQ-030: Image optimization | phase-1-task-7 | 2 | PENDING |
| REQ-024: Static HTML pipeline | phase-1-task-8 | 2 | PENDING |
| REQ-029: Subdomain/DNS setup | phase-1-task-9 | 2 | PENDING |
| REQ-022, REQ-051: Restaurant schema | phase-1-task-10 | 3 | PENDING |
| REQ-022, REQ-052: Services schema | phase-1-task-11 | 3 | PENDING |
| REQ-022: Schema validation lib | phase-1-task-12 | 3 | PENDING |
| REQ-025: Emdash benchmark script | phase-1-task-13 | 3 | PENDING |
| REQ-057: Template wireframes | phase-1-task-14 | 3 | PENDING |
| REQ-007: Site router Worker | phase-1-task-15 | 4 | PENDING |
| REQ-031: Static → R2 upload | phase-1-task-16 | 4 | PENDING |
| REQ-025, REQ-038: Benchmark audit | phase-1-task-17 | 5 | PENDING |
| REQ-023: Day 14 decision doc | phase-1-task-18 | 5 | PENDING |

---

## Wave Execution Order

### Wave 1 (Parallel — Days 1-2) — Infrastructure Foundation

```xml
<task-plan id="phase-1-task-1" wave="1">
  <title>Fork Emdash Repository</title>
  <requirement>REQ-011: Fork Emdash from Day 1 — Own the fork, contribute upstream when appropriate</requirement>
  <description>Create LocalGenius fork of Emdash. Set up git remotes for upstream tracking. This is the foundation for all template and MCP work.</description>

  <context>
    <file path="https://github.com/emdash-org/emdash" reason="Upstream Emdash repository to fork" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/" reason="Parent directory for fork location" />
  </context>

  <steps>
    <step order="1">Fork Emdash repository on GitHub to sethshoultes/emdash-fork</step>
    <step order="2">Clone fork to /Users/sethshoultes/Local Sites/localgenius/emdash-fork/</step>
    <step order="3">Add upstream remote: git remote add upstream https://github.com/emdash-org/emdash</step>
    <step order="4">Create branch: feature/localgenius-templates</step>
    <step order="5">Update package.json name to @localgenius/emdash-fork</step>
    <step order="6">Run npm install to verify dependencies</step>
    <step order="7">Create templates/ directory structure:
      - templates/restaurant/
      - templates/services/</step>
    <step order="8">Create mcp-server/ directory for MCP Worker</step>
  </steps>

  <verification>
    <check type="bash">ls -la /Users/sethshoultes/Local Sites/localgenius/emdash-fork/</check>
    <check type="bash">git remote -v | grep upstream</check>
    <check type="bash">npm run build # Emdash builds without errors</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies -->
  </dependencies>

  <commit-message>feat(sites): fork Emdash repository for LocalGenius templates</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-2" wave="1">
  <title>Create D1 Multi-Tenant Schema</title>
  <requirement>REQ-005: Single D1 database with all tenants partitioned by site_id</requirement>
  <description>Design and create D1 schema for multi-tenant site storage. All queries filter by site_id. No per-tenant databases.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/db/schema.ts" reason="Existing Drizzle schema patterns" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 2: Multi-tenant architecture" />
  </context>

  <steps>
    <step order="1">Create /Users/sethshoultes/Local Sites/localgenius/database/migrations/sites_schema.sql</step>
    <step order="2">Define sites table:
      - id: TEXT PRIMARY KEY
      - site_id: TEXT NOT NULL (partition key)
      - organization_id: TEXT NOT NULL
      - business_id: TEXT NOT NULL
      - slug: TEXT UNIQUE NOT NULL
      - template: TEXT NOT NULL (restaurant | services)
      - content: TEXT (JSON Portable Text)
      - status: TEXT (pending | live | error)
      - created_at: DATETIME
      - updated_at: DATETIME</step>
    <step order="3">Create sites_content table for versioned content:
      - id: TEXT PRIMARY KEY
      - site_id: TEXT NOT NULL
      - version: INTEGER
      - content: TEXT (JSON)
      - created_at: DATETIME</step>
    <step order="4">Create sites_assets table:
      - id: TEXT PRIMARY KEY
      - site_id: TEXT NOT NULL
      - original_path: TEXT
      - optimized_path: TEXT
      - width: INTEGER
      - height: INTEGER
      - format: TEXT</step>
    <step order="5">Add indexes: CREATE INDEX idx_sites_slug ON sites(slug)</step>
    <step order="6">Document schema in emdash-fork/database/README.md</step>
  </steps>

  <verification>
    <check type="bash">cat /Users/sethshoultes/Local Sites/localgenius/database/migrations/sites_schema.sql</check>
    <check type="manual">Schema includes site_id partition key on all tables</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies -->
  </dependencies>

  <commit-message>feat(sites): create D1 multi-tenant schema with site_id partitioning</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-3" wave="1">
  <title>Configure R2 Bucket with Tenant Paths</title>
  <requirement>REQ-006: Single R2 bucket, partitioned by site_id</requirement>
  <description>Create R2 bucket for site assets. Configure path structure as {site_id}/{asset}. Set up CDN caching headers.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 2: Single R2 bucket" />
  </context>

  <steps>
    <step order="1">Create R2 bucket via Cloudflare dashboard or wrangler:
      wrangler r2 bucket create localgenius-sites</step>
    <step order="2">Configure bucket CORS policy for localgenius.site domain</step>
    <step order="3">Create /Users/sethshoultes/Local Sites/localgenius/src/lib/cloudflare-r2.ts:
      - uploadAsset(siteId, file, path)
      - getAssetUrl(siteId, path)
      - deleteAsset(siteId, path)
      - listAssets(siteId)</step>
    <step order="4">Set default cache headers: Cache-Control: max-age=31536000, immutable</step>
    <step order="5">Document R2 path convention: {site_id}/images/, {site_id}/html/</step>
    <step order="6">Add R2 binding to wrangler.toml</step>
  </steps>

  <verification>
    <check type="bash">wrangler r2 bucket list | grep localgenius-sites</check>
    <check type="bash">cat /Users/sethshoultes/Local Sites/localgenius/src/lib/cloudflare-r2.ts</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies -->
  </dependencies>

  <commit-message>feat(sites): configure R2 bucket with tenant path structure</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-4" wave="1">
  <title>Create Provisioning State Machine</title>
  <requirement>REQ-026: Neon hosts state machine for site provisioning lifecycle</requirement>
  <description>Create Neon PostgreSQL migration for provisioning state machine. States: pending → generating → uploading → dns-configuring → provisioned → failed.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/db/schema.ts" reason="Existing Drizzle schema" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="File Structure: site_provisions.sql" />
  </context>

  <steps>
    <step order="1">Create Drizzle migration in /Users/sethshoultes/Local Sites/localgenius/src/db/schema.ts:
      Add siteProvisions table</step>
    <step order="2">Define columns:
      - id: uuid PRIMARY KEY
      - siteId: text NOT NULL
      - organizationId: uuid NOT NULL (FK to organizations)
      - businessId: uuid NOT NULL (FK to businesses)
      - status: text NOT NULL DEFAULT 'pending'
      - currentStep: text
      - errorMessage: text
      - retryCount: integer DEFAULT 0
      - lastRetryAt: timestamp
      - createdAt: timestamp
      - updatedAt: timestamp</step>
    <step order="3">Create enum for status: pending, generating, uploading, dns_configuring, provisioned, failed</step>
    <step order="4">Add index on status for queue queries</step>
    <step order="5">Run: npm run db:generate</step>
    <step order="6">Run: npm run db:push</step>
    <step order="7">Verify table in Neon dashboard</step>
  </steps>

  <verification>
    <check type="bash">npm run db:generate # No errors</check>
    <check type="bash">npm run db:push # Migration applied</check>
    <check type="manual">Query: SELECT * FROM site_provisions LIMIT 1</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies -->
  </dependencies>

  <commit-message>feat(sites): add provisioning state machine to Neon schema</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-5" wave="1">
  <title>Parameterize Cloudflare Account ID</title>
  <requirement>REQ-010: Parameterize cloudflareAccountId now for future federation</requirement>
  <description>Add cloudflareAccountId as environment variable. No hardcoded account IDs. Prepare for federation at 10K+ sites.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/.env.example" reason="Environment variable template" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 17: D1 Federation Strategy" />
  </context>

  <steps>
    <step order="1">Add to .env.example:
      CLOUDFLARE_ACCOUNT_ID=
      CLOUDFLARE_API_TOKEN=
      CLOUDFLARE_D1_DATABASE_ID=
      CLOUDFLARE_R2_BUCKET_NAME=localgenius-sites</step>
    <step order="2">Create /Users/sethshoultes/Local Sites/localgenius/src/lib/cloudflare-config.ts:
      export const cloudflareConfig = {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        apiToken: process.env.CLOUDFLARE_API_TOKEN,
        d1DatabaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
        r2BucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      }</step>
    <step order="3">Add validation: throw if accountId is missing</step>
    <step order="4">Document federation roadmap in engineering/federation-strategy.md</step>
    <step order="5">Update all Cloudflare API calls to use cloudflareConfig.accountId</step>
  </steps>

  <verification>
    <check type="bash">grep CLOUDFLARE_ACCOUNT_ID /Users/sethshoultes/Local Sites/localgenius/.env.example</check>
    <check type="bash">grep -r "accountId" /Users/sethshoultes/Local Sites/localgenius/src/lib/cloudflare*.ts</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies -->
  </dependencies>

  <commit-message>feat(sites): parameterize Cloudflare account ID for federation readiness</commit-message>
</task-plan>
```

---

### Wave 2 (Sequential — Days 3-5) — Core Services

```xml
<task-plan id="phase-1-task-6" wave="2">
  <title>Build Async Provisioning Queue</title>
  <requirement>REQ-027: Async queue with exponential backoff and circuit breaker</requirement>
  <description>Create provisioning-queue.ts service. Handles async site provisioning with retries, backoff, and circuit breaking for Cloudflare API rate limits.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/onboarding-pipeline.ts" reason="Existing pipeline pattern" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Risk R5: Cloudflare API rate limits" />
  </context>

  <steps>
    <step order="1">Create /Users/sethshoultes/Local Sites/localgenius/src/services/provisioning-queue.ts</step>
    <step order="2">Implement ProvisioningJob interface:
      - siteId: string
      - organizationId: string
      - businessId: string
      - template: 'restaurant' | 'services'
      - content: PortableTextContent</step>
    <step order="3">Implement queue processor:
      - processJob(job: ProvisioningJob): Promise&lt;Result&gt;
      - updateStatus(siteId, status, error?)
      - calculateBackoff(retryCount): number (1s, 2s, 4s, 8s, 16s, 32s max)</step>
    <step order="4">Implement circuit breaker:
      - Track failure count per 5-minute window
      - Break circuit after 5 failures
      - Reset after 30 seconds cooldown</step>
    <step order="5">Add job steps:
      1. Generate static HTML
      2. Optimize images
      3. Upload to R2
      4. Configure DNS
      5. Update status to provisioned</step>
    <step order="6">Add error handling: catch all errors, update state machine, schedule retry</step>
  </steps>

  <verification>
    <check type="bash">npx tsc --noEmit src/services/provisioning-queue.ts</check>
    <check type="test">npm run test -- --grep "provisioning-queue"</check>
    <check type="manual">Verify circuit breaker triggers after 5 failures</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-4" reason="State machine must exist for status updates" />
  </dependencies>

  <commit-message>feat(sites): implement async provisioning queue with circuit breaker</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-7" wave="2">
  <title>Build Image Optimization Pipeline</title>
  <requirement>REQ-030: Images optimized before serving (sharp-wasm or Cloudflare Image Resizing)</requirement>
  <description>Create image-optimizer.ts service. Resize images to 320/640/1280px. Convert to WebP with JPEG fallback. Store original in R2, serve optimized.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 15: 95+ PageSpeed, Risk R7: Image degrades PageSpeed" />
  </context>

  <steps>
    <step order="1">Install sharp: npm install sharp</step>
    <step order="2">Create /Users/sethshoultes/Local Sites/localgenius/src/services/image-optimizer.ts</step>
    <step order="3">Implement optimizeImage function:
      - Input: Buffer, options (widths, format, quality)
      - Output: { original: Buffer, variants: { width: Buffer }[] }</step>
    <step order="4">Implement responsive variants:
      - 320px (mobile)
      - 640px (tablet)
      - 1280px (desktop)</step>
    <step order="5">Implement format conversion:
      - Primary: WebP (quality 80)
      - Fallback: JPEG (quality 85)</step>
    <step order="6">Implement uploadOptimizedImages function:
      - Upload original to R2: {site_id}/images/original/{filename}
      - Upload variants to R2: {site_id}/images/{width}/{filename}.webp</step>
    <step order="7">Add metadata extraction: dimensions, format, size</step>
    <step order="8">Add srcset generation helper for template use</step>
  </steps>

  <verification>
    <check type="test">npm run test -- --grep "image-optimizer"</check>
    <check type="manual">Upload 5MB JPEG → verify &lt;100KB WebP output</check>
    <check type="manual">Verify all 3 responsive widths generated</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-3" reason="R2 bucket must be configured" />
  </dependencies>

  <commit-message>feat(sites): implement image optimization pipeline with responsive variants</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-8" wave="2">
  <title>Build Static HTML Generation Pipeline</title>
  <requirement>REQ-024: Generate static HTML from template + content, store in R2</requirement>
  <description>Create static HTML generator that merges template with Portable Text content. Output includes all critical CSS, optimized images, and fonts.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/website-generator.ts" reason="Existing static HTML generator pattern" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 3: Pre-rendered static output" />
  </context>

  <steps>
    <step order="1">Extend /Users/sethshoultes/Local Sites/localgenius/src/services/website-generator.ts</step>
    <step order="2">Add generateStaticSite function:
      - Input: template, content (Portable Text), images, businessInfo
      - Output: { html: string, assets: Asset[], metadata: Metadata }</step>
    <step order="3">Implement template rendering:
      - Load template from emdash-fork/templates/{template}/
      - Merge Portable Text content into template slots
      - Inline critical CSS
      - Generate srcset for images</step>
    <step order="4">Implement font handling:
      - Subset fonts (Latin only)
      - Inline in critical CSS
      - Max 2 fonts per template</step>
    <step order="5">Generate all pages:
      - index.html
      - menu.html (restaurant) or services.html (services)
      - about.html
      - contact.html</step>
    <step order="6">Add metadata generation:
      - title, description
      - Open Graph tags
      - structured data (LocalBusiness schema)</step>
  </steps>

  <verification>
    <check type="test">npm run test -- --grep "website-generator"</check>
    <check type="manual">Generate site → verify all pages exist</check>
    <check type="manual">Run PageSpeed on generated HTML → target 95+</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Emdash fork must exist for templates" />
    <depends-on task-id="phase-1-task-7" reason="Image optimizer needed for assets" />
  </dependencies>

  <commit-message>feat(sites): implement static HTML generation pipeline</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-9" wave="2">
  <title>Configure Subdomain DNS Wildcard</title>
  <requirement>REQ-029: Sites at {slug}.localgenius.site with wildcard DNS</requirement>
  <description>Configure DNS wildcard record for *.localgenius.site pointing to Cloudflare Workers. Set up SSL auto-provisioning.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 10: Subdomain strategy" />
  </context>

  <steps>
    <step order="1">Verify localgenius.site domain is in Cloudflare</step>
    <step order="2">Add wildcard DNS record:
      Type: CNAME
      Name: *
      Target: localgenius-sites-router.{account}.workers.dev
      Proxy: Yes (orange cloud)</step>
    <step order="3">Configure Cloudflare SSL/TLS:
      - Mode: Full (strict)
      - Edge Certificates: enabled
      - Always Use HTTPS: enabled</step>
    <step order="4">Create slug validation in /Users/sethshoultes/Local Sites/localgenius/src/lib/slug-utils.ts:
      - generateSlug(businessName, city): string
      - validateSlug(slug): boolean
      - isSlugUnique(slug): Promise&lt;boolean&gt;</step>
    <step order="5">Slug rules:
      - 3-50 characters
      - Lowercase alphanumeric + hyphens
      - No leading/trailing hyphens
      - Unique in D1</step>
    <step order="6">Document DNS configuration in engineering/dns-setup.md</step>
  </steps>

  <verification>
    <check type="bash">dig test-slug.localgenius.site</check>
    <check type="manual">Visit https://test-slug.localgenius.site → should route to Worker</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-5" reason="Cloudflare config must be parameterized" />
  </dependencies>

  <commit-message>feat(sites): configure wildcard DNS for subdomain routing</commit-message>
</task-plan>
```

---

### Wave 3 (Parallel — Days 6-9) — Templates & Schemas

```xml
<task-plan id="phase-1-task-10" wave="3">
  <title>Define Restaurant Portable Text Schema</title>
  <requirement>REQ-022, REQ-051: Portable Text schema for restaurant template</requirement>
  <description>Create Portable Text schema for restaurant vertical. Types: menuItem, section, restaurantInfo, hours, contact.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/emdash-fork/templates/restaurant/" reason="Restaurant template directory" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Open Questions #6: Portable Text schema" />
  </context>

  <steps>
    <step order="1">Create /Users/sethshoultes/Local Sites/localgenius/emdash-fork/templates/restaurant/schema.ts</step>
    <step order="2">Define restaurantInfo type:
      - name: string (required)
      - tagline: string
      - description: PortableText
      - cuisine: string[]
      - priceRange: '$' | '$$' | '$$$' | '$$$$'</step>
    <step order="3">Define hours type:
      - dayOfWeek: string
      - open: string (HH:MM)
      - close: string (HH:MM)
      - isSpecialHours: boolean
      - specialNote: string</step>
    <step order="4">Define menuSection type:
      - name: string (required)
      - description: string
      - items: menuItem[]</step>
    <step order="5">Define menuItem type:
      - name: string (required)
      - description: string
      - price: number
      - priceNote: string (e.g., "market price")
      - image: Image
      - dietary: ('vegetarian' | 'vegan' | 'gluten-free')[]
      - isPopular: boolean</step>
    <step order="6">Define contact type:
      - phone: string
      - email: string
      - address: Address
      - reservationUrl: string</step>
    <step order="7">Export schema with validation rules</step>
  </steps>

  <verification>
    <check type="bash">npx tsc --noEmit emdash-fork/templates/restaurant/schema.ts</check>
    <check type="test">npm run test -- --grep "restaurant-schema"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Emdash fork must exist" />
  </dependencies>

  <commit-message>feat(sites): define Portable Text schema for restaurant template</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-11" wave="3">
  <title>Define Services Portable Text Schema</title>
  <requirement>REQ-022, REQ-052: Portable Text schema for services template</requirement>
  <description>Create Portable Text schema for services vertical. Types: service, serviceCategory, availability, contact.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/emdash-fork/templates/services/" reason="Services template directory" />
  </context>

  <steps>
    <step order="1">Create /Users/sethshoultes/Local Sites/localgenius/emdash-fork/templates/services/schema.ts</step>
    <step order="2">Define businessInfo type:
      - name: string (required)
      - tagline: string
      - description: PortableText
      - specialties: string[]</step>
    <step order="3">Define serviceCategory type:
      - name: string (required)
      - description: string
      - services: service[]</step>
    <step order="4">Define service type:
      - name: string (required)
      - description: PortableText
      - duration: string (e.g., "60 min")
      - price: number
      - priceType: 'fixed' | 'starting_at' | 'hourly' | 'custom'
      - image: Image
      - bookingUrl: string</step>
    <step order="5">Define availability type:
      - dayOfWeek: string
      - slots: { start: string, end: string }[]
      - isAvailable: boolean</step>
    <step order="6">Define contact type:
      - phone: string
      - email: string
      - address: Address
      - bookingUrl: string</step>
    <step order="7">Export schema with validation rules</step>
  </steps>

  <verification>
    <check type="bash">npx tsc --noEmit emdash-fork/templates/services/schema.ts</check>
    <check type="test">npm run test -- --grep "services-schema"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Emdash fork must exist" />
  </dependencies>

  <commit-message>feat(sites): define Portable Text schema for services template</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-12" wave="3">
  <title>Build Schema Validation Library</title>
  <requirement>REQ-022: AI content validated against schema before D1 write</requirement>
  <description>Create portable-text-schema.ts library for validating AI-generated content. Reject malformed content, retry with error context.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/emdash-fork/templates/restaurant/schema.ts" reason="Restaurant schema" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/emdash-fork/templates/services/schema.ts" reason="Services schema" />
  </context>

  <steps>
    <step order="1">Create /Users/sethshoultes/Local Sites/localgenius/src/lib/portable-text-schema.ts</step>
    <step order="2">Implement validateContent function:
      - Input: template type, content object
      - Output: { valid: boolean, errors: ValidationError[] }</step>
    <step order="3">Implement type-specific validators:
      - validateRestaurantContent(content)
      - validateServicesContent(content)</step>
    <step order="4">Implement field validators:
      - Required fields present
      - Type checking (string, number, array)
      - Format validation (phone, email, URL)
      - Enum validation (cuisine types, price ranges)</step>
    <step order="5">Implement error reporting:
      - Path to invalid field
      - Expected type/format
      - Actual value
      - Suggestion for fix</step>
    <step order="6">Add logging for validation failures (for prompt improvement)</step>
    <step order="7">Export Zod schemas for type inference</step>
  </steps>

  <verification>
    <check type="test">npm run test -- --grep "portable-text-schema"</check>
    <check type="manual">Validate sample content → verify errors reported correctly</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Restaurant schema must be defined" />
    <depends-on task-id="phase-1-task-11" reason="Services schema must be defined" />
  </dependencies>

  <commit-message>feat(sites): implement Portable Text schema validation library</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-13" wave="3">
  <title>Create Emdash SSR Benchmark Script</title>
  <requirement>REQ-025: Benchmark script measures P99 render time</requirement>
  <description>Create benchmark-ssr.ts script to measure Emdash SSR performance on D1. Pass: &lt;20ms. Acceptable: 20-28ms. Fail: >28ms.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 11: SSR Benchmark Bar" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/emdash-fork/" reason="Emdash fork for benchmarking" />
  </context>

  <steps>
    <step order="1">Create /Users/sethshoultes/Local Sites/localgenius/scripts/benchmark-ssr.ts</step>
    <step order="2">Set up test environment:
      - Create 5-page test site with realistic D1 data
      - Pages: index, menu, about, contact, booking</step>
    <step order="3">Implement benchmark runner:
      - Warm-up: 10 requests (discard)
      - Measurement: 100 requests per page
      - Record: start time, end time, render duration</step>
    <step order="4">Calculate statistics:
      - P50, P90, P95, P99 render times
      - Mean, median, standard deviation
      - Min, max</step>
    <step order="5">Generate report:
      - Overall P99 across all pages
      - Per-page breakdown
      - Pass/Acceptable/Fail verdict</step>
    <step order="6">Add CLI interface:
      npx ts-node scripts/benchmark-ssr.ts --pages 5 --iterations 100</step>
    <step order="7">Output results to engineering/benchmark-results.md</step>
  </steps>

  <verification>
    <check type="bash">npx ts-node scripts/benchmark-ssr.ts --dry-run</check>
    <check type="manual">Run full benchmark → verify P99 calculated correctly</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Emdash fork must exist" />
    <depends-on task-id="phase-1-task-2" reason="D1 schema must exist" />
  </dependencies>

  <commit-message>feat(sites): create Emdash SSR benchmark script</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-14" wave="3">
  <title>Create Template Wireframes (Design Track)</title>
  <requirement>REQ-057: Mobile-first wireframes for both templates</requirement>
  <description>Create mobile-first wireframes for Restaurant and Services templates. Define information architecture, component hierarchy, and responsive breakpoints.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 4: Two templates, mobile-first" />
  </context>

  <steps>
    <step order="1">Create /Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-sites/wireframes/</step>
    <step order="2">Restaurant wireframes:
      - Mobile (320px): index, menu, about, contact
      - Tablet (768px): same pages
      - Desktop (1280px): same pages</step>
    <step order="3">Services wireframes:
      - Mobile (320px): index, services, about, contact
      - Tablet (768px): same pages
      - Desktop (1280px): same pages</step>
    <step order="4">Define component hierarchy:
      - Header (logo, nav, CTA)
      - Hero (image, tagline, CTA)
      - Content sections
      - Footer (contact, hours, "Made with LocalGenius")</step>
    <step order="5">Define responsive behavior:
      - Navigation: hamburger → inline
      - Grid: 1 col → 2 col → 3 col
      - Images: full-width → contained</step>
    <step order="6">Document design decisions in wireframes/README.md</step>
  </steps>

  <verification>
    <check type="manual">Wireframes cover all pages for both templates</check>
    <check type="manual">Mobile-first approach documented</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Restaurant schema informs wireframe content" />
    <depends-on task-id="phase-1-task-11" reason="Services schema informs wireframe content" />
  </dependencies>

  <commit-message>feat(sites): create mobile-first wireframes for both templates</commit-message>
</task-plan>
```

---

### Wave 4 (Sequential — Days 10-12) — Integration

```xml
<task-plan id="phase-1-task-15" wave="4">
  <title>Build Site Router Worker</title>
  <requirement>REQ-007: Site router Worker deployed on Cloudflare Workers</requirement>
  <description>Create Cloudflare Worker that routes {slug}.localgenius.site requests to the correct site content in R2.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="File Structure: workers/site-router/" />
  </context>

  <steps>
    <step order="1">Create /Users/sethshoultes/Local Sites/localgenius/src/workers/site-router/</step>
    <step order="2">Create index.ts with request handler:
      - Extract slug from hostname
      - Look up site in D1 by slug
      - If found: serve from R2
      - If not found: return 404 page</step>
    <step order="3">Create wrangler.toml:
      - name: localgenius-sites-router
      - route: *.localgenius.site/*
      - D1 binding: SITES_DB
      - R2 binding: SITES_ASSETS</step>
    <step order="4">Implement caching:
      - Cache-Control headers from R2
      - Edge caching for static assets</step>
    <step order="5">Implement error handling:
      - 404: Custom "Site not found" page
      - 500: Custom error page with support link</step>
    <step order="6">Add logging:
      - Request URL, slug, site_id
      - Response status, duration</step>
    <step order="7">Deploy: wrangler deploy</step>
  </steps>

  <verification>
    <check type="bash">wrangler deploy --dry-run</check>
    <check type="manual">Visit test-slug.localgenius.site → verify routing works</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-2" reason="D1 schema must exist" />
    <depends-on task-id="phase-1-task-3" reason="R2 bucket must be configured" />
    <depends-on task-id="phase-1-task-9" reason="DNS must be configured" />
  </dependencies>

  <commit-message>feat(sites): implement site router Cloudflare Worker</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-16" wave="4">
  <title>Implement Static Site Upload to R2</title>
  <requirement>REQ-024, REQ-031: Upload generated HTML to R2, serve via edge cache</requirement>
  <description>Connect static HTML generator to R2 upload. Implement cache invalidation on content update.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/website-generator.ts" reason="Static HTML generator" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/lib/cloudflare-r2.ts" reason="R2 client" />
  </context>

  <steps>
    <step order="1">Extend website-generator.ts with uploadSiteToR2 function:
      - Input: siteId, generatedSite
      - Upload each page: {site_id}/index.html, {site_id}/menu.html, etc.
      - Upload assets: {site_id}/images/, {site_id}/fonts/</step>
    <step order="2">Set headers on upload:
      - Content-Type: text/html; charset=utf-8
      - Cache-Control: max-age=31536000, immutable</step>
    <step order="3">Implement cache invalidation:
      - On content update: delete old files, upload new
      - Use KV to track cache version per site</step>
    <step order="4">Create deployStaticSite function:
      - Generate HTML
      - Optimize images
      - Upload to R2
      - Update state machine to 'provisioned'</step>
    <step order="5">Add rollback: if upload fails, restore previous version</step>
    <step order="6">Log deployment: site_id, files uploaded, duration</step>
  </steps>

  <verification>
    <check type="test">npm run test -- --grep "deploy-static-site"</check>
    <check type="manual">Generate site → verify files in R2 → verify site loads</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-3" reason="R2 bucket must be configured" />
    <depends-on task-id="phase-1-task-8" reason="Static HTML generator must exist" />
    <depends-on task-id="phase-1-task-15" reason="Site router must be deployed" />
  </dependencies>

  <commit-message>feat(sites): implement static site upload to R2 with cache invalidation</commit-message>
</task-plan>
```

---

### Wave 5 (Sequential — Days 13-14) — Audit & Decision

```xml
<task-plan id="phase-1-task-17" wave="5">
  <title>Run Emdash SSR Benchmark Audit</title>
  <requirement>REQ-025, REQ-038: Audit measures P99 render time. Pass &lt;20ms.</requirement>
  <description>Execute the benchmark script on production-like environment. Document results. Determine pass/acceptable/fail verdict.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/scripts/benchmark-ssr.ts" reason="Benchmark script" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 11: SSR Benchmark Bar" />
  </context>

  <steps>
    <step order="1">Prepare test environment:
      - Deploy Emdash fork to Cloudflare Workers
      - Populate D1 with realistic test data (5 pages, 20 menu items, 10 services)</step>
    <step order="2">Run benchmark:
      npx ts-node scripts/benchmark-ssr.ts --pages 5 --iterations 100 --output engineering/benchmark-results.md</step>
    <step order="3">Analyze results:
      - Extract P99 render time
      - Compare to thresholds: &lt;20ms pass, 20-28ms acceptable, >28ms fail</step>
    <step order="4">Document findings in engineering/emdash-audit-results.md:
      - Test environment details
      - Raw benchmark data
      - P50, P90, P95, P99 times
      - Per-page breakdown
      - Verdict: PASS / ACCEPTABLE / FAIL</step>
    <step order="5">If FAIL: identify bottlenecks, propose optimizations</step>
    <step order="6">Prepare recommendation for Day 14 decision</step>
  </steps>

  <verification>
    <check type="bash">cat engineering/benchmark-results.md</check>
    <check type="manual">P99 time documented and compared to thresholds</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-13" reason="Benchmark script must exist" />
    <depends-on task-id="phase-1-task-1" reason="Emdash fork must be deployed" />
  </dependencies>

  <commit-message>docs(sites): document Emdash SSR benchmark audit results</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-18" wave="5">
  <title>Document Day 14 Decision</title>
  <requirement>REQ-023: Day 14 decision point for static vs Emdash</requirement>
  <description>Based on benchmark results and MCP audit, document the decision to proceed with Emdash or fallback to static HTML only.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/engineering/emdash-audit-results.md" reason="Benchmark results" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/decisions.md" reason="Decision 1: Parallel Build Strategy" />
  </context>

  <steps>
    <step order="1">Review benchmark results:
      - P99 SSR time
      - Pass/Acceptable/Fail verdict</step>
    <step order="2">Review MCP audit (if completed):
      - Provisioning success rate
      - Error patterns</step>
    <step order="3">Create engineering/day-14-decision.md:
      - Summary of audit results
      - Decision: Emdash or Static
      - Rationale
      - Impact on timeline
      - Next steps</step>
    <step order="4">If Emdash (PASS/ACCEPTABLE):
      - Proceed to Phase 2: MCP integration
      - Timeline unchanged</step>
    <step order="5">If Static (FAIL):
      - Continue with static HTML pipeline
      - Defer Emdash to Phase 3
      - Update timeline in STATUS.md</step>
    <step order="6">Update STATUS.md with decision</step>
    <step order="7">Notify stakeholders (update decisions.md with Day 14 resolution)</step>
  </steps>

  <verification>
    <check type="bash">cat engineering/day-14-decision.md</check>
    <check type="manual">Decision documented with rationale</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-17" reason="Benchmark audit must complete" />
  </dependencies>

  <commit-message>docs(sites): document Day 14 Emdash decision</commit-message>
</task-plan>
```

---

## Risk Notes

### P0 Blockers (Must Resolve in Phase 1)

| Risk | Impact | Status | Mitigation |
|------|--------|--------|------------|
| Emdash SSR >28ms | Fallback to static only | phase-1-task-17 | Benchmark Day 13-14, have static ready |
| Portable Text schema undefined | AI content fails | phase-1-task-10, 11, 12 | Define by Day 9 |
| D1/R2 provisioning failures | Sites don't deploy | phase-1-task-6 | Async queue with circuit breaker |

### P1 High Priority

| Risk | Impact | Mitigation |
|------|--------|------------|
| Image optimization slow | PageSpeed degrades | Benchmark sharp-wasm performance |
| DNS propagation delays | Sites unreachable | Use Cloudflare proxy (instant) |
| Slug collisions | Duplicate URLs | Unique constraint in D1 |

### P2 Monitor (Phase 2+)

| Risk | Timeline | Notes |
|------|----------|-------|
| MCP bridge not built | Phase 2 | Not blocking Phase 1 |
| Custom domains | Month 2 | Pro tier feature |

---

## Execution Timeline

| Day | Wave | Tasks | Checkpoint |
|-----|------|-------|------------|
| 1-2 | 1 | task-1 to task-5 | Infrastructure foundation complete |
| 3-5 | 2 | task-6 to task-9 | Core services operational |
| 6-9 | 3 | task-10 to task-14 | Schemas defined, wireframes complete |
| 10-12 | 4 | task-15 to task-16 | Site routing working |
| 13-14 | 5 | task-17 to task-18 | **Day 14 Decision documented** |

---

## Wave Summary

```
Wave 1: [task-1, task-2, task-3, task-4, task-5]  <- Parallel (foundation)
Wave 2: [task-6, task-7, task-8, task-9]          <- Sequential (services)
Wave 3: [task-10, task-11, task-12, task-13, task-14] <- Parallel (templates)
Wave 4: [task-15, task-16]                        <- Sequential (integration)
Wave 5: [task-17, task-18]                        <- Sequential (audit & decision)
```

**Total**: 18 tasks, 5 waves, 14 days

---

## Sign-Off Checklist

Before each wave, verify:
- [ ] Previous wave tasks all committed
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] No lint errors: `npm run lint`

Phase 1 Complete when:
- [ ] All 18 tasks committed
- [ ] Emdash fork functional
- [ ] Static HTML pipeline working
- [ ] Schemas defined and validated
- [ ] Benchmark audit completed
- [ ] **Day 14 decision documented**

---

## Phase 2 Preview (Weeks 3-4)

After Day 14 decision, Phase 2 covers:
- MCP bridge implementation (`emdash-mcp.ts`)
- Template buildout in Astro
- Reveal flow UI components
- Verification cards
- Review sync cron

---

*"The strength of the team is each individual member. The strength of each member is the team." — Phil Jackson*

---

**Build the foundation. Make the decision. Then we execute.**
