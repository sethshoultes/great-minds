# LocalGenius Sites — Atomic Requirements Specification

**Generated from**: decisions.md, essence.md, round-2-steve.md, round-2-elon.md
**Date**: 2026-04-14
**Status**: LOCKED FOR BUILD PHASE
**Ship Date**: 6 weeks from kickoff

---

## Table of Contents

1. [Core Product Requirements](#core-product-requirements)
2. [Architecture & Infrastructure](#architecture--infrastructure)
3. [Onboarding & User Experience](#onboarding--user-experience)
4. [Template System](#template-system)
5. [Provisioning Pipeline](#provisioning-pipeline)
6. [Content Management & Updates](#content-management--updates)
7. [Performance & Quality](#performance--quality)
8. [Growth & Monetization](#growth--monetization)
9. [Design & Brand](#design--brand)
10. [Dependencies Matrix](#dependencies-matrix)

---

## CORE PRODUCT REQUIREMENTS

### REQ-001: Core Product Philosophy
**Source**: Essence, Consensus Statement
**Priority**: MUST HAVE
**Category**: Product Strategy
**Description**: The product is not a website builder; it is the feeling of legitimacy. The AI-managed website is the category differentiator.
**Acceptance Criteria**:
- [ ] Product positions as legitimacy service, not website tool
- [ ] AI post-creation management is core narrative in marketing
- [ ] Design conveys "craft" not "features"

**Dependencies**: REQ-019, REQ-020

---

### REQ-002: Reveal Moment as Primary Product
**Source**: Essence, Decision 14, Steve's Round 2
**Priority**: MUST HAVE
**Category**: Product Strategy
**Description**: The reveal moment (user seeing their live site) is the entire product. Success is measured by emotional response. If users don't feel the moment is magical, the product has failed.
**Acceptance Criteria**:
- [ ] User sees their business name on a real website they didn't build
- [ ] URL bar shows real subdomain
- [ ] Live site rendered in device frame
- [ ] Text display: "Your site is live"
- [ ] User emotional response indicates success ("gasp")

**Dependencies**: REQ-051, REQ-052

---

### REQ-003: Zero Customization Philosophy
**Source**: Decision 5, Steve's non-negotiables
**Priority**: MUST HAVE
**Category**: Product Strategy
**Description**: Users make zero design choices. AI selects template. System makes all design decisions. User role is approval/flagging, not creation.
**Acceptance Criteria**:
- [ ] No template picker UI
- [ ] No color selector
- [ ] No font dropdown
- [ ] No theme picker
- [ ] No advanced settings panel in v1

**Dependencies**: REQ-019, REQ-021, REQ-027

---

### REQ-004: Invisible AI-Managed Website
**Source**: Consensus Statement, Decision 18 (compromise)
**Priority**: MUST HAVE
**Category**: Product Strategy
**Description**: After site creation, AI manages content updates via conversational interface. Updates are user-initiated (not autonomous). Updates are transparent and specific ("I updated X because Y").
**Acceptance Criteria**:
- [ ] AI updates content only when user explicitly requests
- [ ] Update notifications are first-person, specific, and honest
- [ ] Failed updates do not appear to have succeeded
- [ ] No autonomous monthly updates (scheduled)
- [ ] Changelog tracks all AI-initiated changes

**Dependencies**: REQ-075, REQ-076, REQ-135

---

---

## ARCHITECTURE & INFRASTRUCTURE

### REQ-005: Multi-Tenant Database Architecture
**Source**: Decision 2
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: Single D1 database instance with all tenants partitioned by `site_id`. No per-business isolation. One deployment, one migration path, one monitoring dashboard.
**Acceptance Criteria**:
- [ ] D1 schema includes `site_id` as primary partition key
- [ ] All queries filter by `site_id`
- [ ] No per-tenant database instances
- [ ] Monitoring tracks database query latency across all sites
- [ ] Migration scripts execute against single instance

**Dependencies**: REQ-044, REQ-045

---

### REQ-006: Single R2 Bucket with Tenant Partitioning
**Source**: Decision 2
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: All site assets stored in single R2 bucket, partitioned by `site_id`. Simplifies backup, replication, and operational oversight.
**Acceptance Criteria**:
- [ ] R2 object paths use `{site_id}/` prefix
- [ ] Bucket policy enforces read-only access per signed URL
- [ ] No per-tenant bucket creation
- [ ] Replication strategy accounts for multi-tenant structure

**Dependencies**: REQ-047, REQ-048

---

### REQ-007: Cloudflare as Primary Infrastructure
**Source**: Decisions 12, 16; Consensus Statement
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: Cloudflare Workers (site routing), D1 (database), R2 (assets), Workers KV (cache), Cloudflare for SaaS (custom domain SSL/DNS) form the complete infrastructure for site hosting and provisioning.
**Acceptance Criteria**:
- [ ] Site router Worker deployed on Cloudflare Workers
- [ ] D1 configured with correct scaling parameters
- [ ] R2 bucket provisioned with CDN caching
- [ ] KV cache configured for static asset invalidation
- [ ] Cloudflare for SaaS ready for Pro tier (custom domains)

**Dependencies**: REQ-009, REQ-044, REQ-045, REQ-112

---

### REQ-008: Vercel + Neon for Main Application
**Source**: Consensus Statement
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: Main application (onboarding, API, auth) runs on Vercel. State machine for provisioning orchestration runs on Neon (PostgreSQL). MCP client runs as Vercel API route.
**Acceptance Criteria**:
- [ ] Vercel deployment configured
- [ ] Neon PostgreSQL instance provisioned
- [ ] Connection pooling configured for max concurrency
- [ ] MCP client endpoint available at Vercel API route

**Dependencies**: REQ-044, REQ-069

---

### REQ-009: MCP as Bridge Transport (HTTP, Stateless)
**Source**: Decision 16
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: MCP uses streamable HTTP transport (stateless POST). No WebSockets. No Server-Sent Events. MCP server runs as Cloudflare Worker. MCP client runs in Vercel API route. Standard HTTP between clouds.
**Acceptance Criteria**:
- [ ] MCP transport is HTTP POST
- [ ] No WebSocket connections required
- [ ] No SSE connections required
- [ ] MCP server implemented as Cloudflare Worker
- [ ] MCP client integrated into Vercel API route
- [ ] Request/response payloads are stateless

**Dependencies**: REQ-069, REQ-070

---

### REQ-010: D1 Federation Strategy (Parameterized Now)
**Source**: Decision 17
**Priority**: SHOULD HAVE
**Category**: Architecture
**Description**: Parameterize `cloudflareAccountId` in all infrastructure-as-code now. Do not build federation at launch. Federation infrastructure (Terraform, routing table) scheduled for Phase 2 at 10K+ sites. Investment: 30 minutes of architecture work.
**Acceptance Criteria**:
- [ ] `cloudflareAccountId` stored as environment variable
- [ ] Infrastructure code accepts `cloudflareAccountId` as parameter
- [ ] No hardcoded Cloudflare account IDs
- [ ] Documentation includes federation roadmap

**Dependencies**: REQ-005

---

### REQ-011: Fork Emdash from Day 1
**Source**: Decision 9
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: Own Emdash fork as first-class codebase. Contribute upstream when appropriate. Do not depend on external Emdash release cycles. Repository ownership ensures quality control for templates, Portable Text schemas, SSR optimizations, Worker bindings.
**Acceptance Criteria**:
- [ ] Emdash forked and cloned to localgenius/emdash-fork
- [ ] Fork is git remote (can pull upstream updates)
- [ ] No dependencies on external Emdash releases
- [ ] Custom templates committed to fork
- [ ] Custom Portable Text schemas in fork

**Dependencies**: REQ-019, REQ-020, REQ-055

---

---

## ONBOARDING & USER EXPERIENCE

### REQ-012: Four-Input Onboarding (Minimalist)
**Source**: Decision 6
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: Onboarding collects exactly 4 inputs (name already captured from upstream). Inputs are: business name, photos, one-sentence description ("What do you do?"), hours confirmation. No 7-question forms.
**Acceptance Criteria**:
- [ ] Input 1: Business name (pre-populated from chat history)
- [ ] Input 2: Photos (uploaded/selected from GBP)
- [ ] Input 3: One-sentence description ("What do you do?")
- [ ] Input 4: Hours confirmation (GBP hours or manual entry)
- [ ] Form design prevents additional field additions
- [ ] No optional fields beyond 4 core inputs

**Dependencies**: REQ-080, REQ-081

---

### REQ-013: Auto-Enrichment from Google Business Profile & Yelp
**Source**: Decision 6
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: AI enriches provided inputs with data from Google Business Profile and Yelp. Inputs provide speed; enrichment provides quality. Data pulls happen asynchronously during provisioning.
**Acceptance Criteria**:
- [ ] GBP API integration for photos, hours, categories
- [ ] Yelp API integration for reviews, description
- [ ] Data matching logic (business name fuzzy match)
- [ ] Enrichment happens asynchronously
- [ ] User sees enriched data in verification screen
- [ ] Fallback: AI asks follow-up questions conversationally

**Dependencies**: REQ-012, REQ-034

---

### REQ-014: Graceful Fallback for Businesses with No GBP Data
**Source**: Decision 6, Risk R8
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: For businesses with no Google Business Profile data (~30% of users), AI asks follow-up questions conversationally within chat thread. Not as form fields. Site ships with available data, improves over time.
**Acceptance Criteria**:
- [ ] GBP lookup returns no data → trigger conversational fallback
- [ ] AI asks contextual follow-up questions in chat
- [ ] Questions appear as natural conversation, not form
- [ ] Responses captured and stored for site content
- [ ] Site provisioned with available + conversational data

**Dependencies**: REQ-012, REQ-013

---

### REQ-015: Editable Fact Cards for Verification
**Source**: Decision 7
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: Verification screen displays 5 editable fact cards (name, description, hours, phone, address). Users can inline-edit facts. No chat round-trip required for corrections. Editing facts only, not design.
**Acceptance Criteria**:
- [ ] 5 fact cards displayed: name, description, hours, phone, address
- [ ] Each card has inline edit button
- [ ] Click-to-edit opens text input (no modal)
- [ ] Changes saved to local state immediately
- [ ] Fact editing does not trigger re-generation
- [ ] No design/layout editing in verification screen

**Dependencies**: REQ-034, REQ-035

---

### REQ-016: Instant Preview in <5 Seconds
**Source**: Decision 8
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: Static HTML preview renders in <5 seconds upon onboarding completion. This is the Reveal moment. Full Emdash provisioning runs asynchronously in background.
**Acceptance Criteria**:
- [ ] Static HTML generation completes in <5 seconds
- [ ] Preview includes business name, photos, description, hours
- [ ] Preview is accurate representation of final site
- [ ] Static preview rendered during onboarding Step 3 (parallel to provisioning)

**Dependencies**: REQ-036, REQ-037

---

### REQ-017: Deferred Provisioning Architecture
**Source**: Decision 8
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: Full site provisioning (D1/R2/Worker/DNS setup, Emdash compilation) runs asynchronously after Reveal. User sees instant preview; provisioning happens in background. If provisioning succeeds, hot-swap occurs silently. If fails, static preview remains live, retry in background.
**Acceptance Criteria**:
- [ ] Instant preview serves static HTML immediately
- [ ] Full provisioning starts in background
- [ ] User can navigate away from reveal screen
- [ ] Provisioning completion is transparent (user may not notice)
- [ ] Failed provisioning triggers retry loop with exponential backoff
- [ ] Static preview never goes offline during provisioning

**Dependencies**: REQ-016, REQ-036, REQ-050

---

---

## TEMPLATE SYSTEM

### REQ-018: Two Templates at Launch (Restaurant + Services)
**Source**: Decision 4
**Priority**: MUST HAVE
**Category**: Template System
**Description**: Exactly 2 templates ship in v1: Restaurant vertical and Services vertical. Both are mobile-first, opinionated information architecture, 95+ PageSpeed score. Cannot share a template due to different IA requirements.
**Acceptance Criteria**:
- [ ] Restaurant template built in Astro
- [ ] Services template built in Astro
- [ ] Both achieve 95+ PageSpeed Insights score
- [ ] Mobile-first responsive design
- [ ] Restaurant IA: menu (items with prices/photos)
- [ ] Services IA: service list with booking CTAs
- [ ] No shared layout components between templates

**Dependencies**: REQ-019, REQ-020, REQ-021

---

### REQ-019: Restaurant Template
**Source**: Decision 4; File Structure
**Priority**: MUST HAVE
**Category**: Template System
**Description**: Restaurant vertical template. Information architecture optimized for menu display with pricing, photos, seasonal updates. Built in Astro fork. Uses restaurant-specific Portable Text schema.
**Acceptance Criteria**:
- [ ] Pages directory contains: index, menu, about, contact, booking
- [ ] Menu items display with: name, description, price, photo
- [ ] Categories/sections for menu organization (appetizers, entrees, etc.)
- [ ] Reservation/booking CTA
- [ ] Hours display with special hours handling (holidays)
- [ ] Photo gallery for restaurant ambiance
- [ ] Schema includes: menuItem, section, restaurantInfo

**Dependencies**: REQ-018, REQ-055, REQ-071

---

### REQ-020: Services Template
**Source**: Decision 4; File Structure
**Priority**: MUST HAVE
**Category**: Template System
**Description**: Services vertical template. Information architecture optimized for service listings with descriptions and booking CTAs. Built in Astro fork. Uses services-specific Portable Text schema.
**Acceptance Criteria**:
- [ ] Pages directory contains: index, services, about, contact, booking
- [ ] Services display with: name, description, duration, price, booking CTA
- [ ] Service categories/grouping
- [ ] Staff/team member listing (optional)
- [ ] Booking/scheduling integration point
- [ ] Hours display with availability
- [ ] Photo gallery
- [ ] Schema includes: service, serviceCategory, availability

**Dependencies**: REQ-018, REQ-055, REQ-071

---

### REQ-021: AI Template Selection (No User Choice)
**Source**: Decision 5
**Priority**: MUST HAVE
**Category**: Template System
**Description**: Zero template picker UI. AI selects template based on business vertical/category (from GBP data or user description). User never sees "Template A vs Template B." Complexity is absorbed by system.
**Acceptance Criteria**:
- [ ] No template picker UI in onboarding
- [ ] AI evaluates business category/description
- [ ] AI outputs selection logic (restaurant vs services)
- [ ] Selection stored in site record
- [ ] User never shown template options
- [ ] Selection can be manually overridden by admin (not exposed to user)

**Dependencies**: REQ-018, REQ-019, REQ-020, REQ-012

---

### REQ-022: Portable Text Schema Validation
**Source**: Decision 6, File Structure, Risk R4
**Priority**: MUST HAVE
**Category**: Template System
**Description**: AI-generated content validated against Portable Text schema before D1 write. Malformed content is rejected and regenerated with corrected prompt. Failures logged for prompt improvement.
**Acceptance Criteria**:
- [ ] Schema validation library implemented in `src/lib/portable-text-schema.ts`
- [ ] Restaurant schema defined: menu items, sections, hours, contact
- [ ] Services schema defined: services, categories, availability, contact
- [ ] Validation runs before content write to D1
- [ ] Invalid content triggers retry with error context
- [ ] Validation failures logged with content + error
- [ ] Logs used for prompt engineering feedback

**Dependencies**: REQ-019, REQ-020, REQ-055

---

---

## PROVISIONING PIPELINE

### REQ-023: Parallel Build Strategy (Static Initial, Emdash Optional)
**Source**: Decision 1
**Priority**: MUST HAVE
**Category**: Provisioning Pipeline
**Description**: Provisioning pipeline targets static HTML initially. Emdash audit runs in parallel. Day 14 decision point: if audit passes, swap to Emdash; if fails, keep static. Pipeline architecture identical either way — only deployment target changes.
**Acceptance Criteria**:
- [ ] Static HTML pipeline fully functional by Day 7
- [ ] Emdash audit runs independently (no blocking)
- [ ] Day 14: benchmark results available for decision
- [ ] Swap mechanism between static/Emdash output
- [ ] Both paths exercise identical provisioning logic
- [ ] No rebuild necessary if swapping deployment targets

**Dependencies**: REQ-024, REQ-025

---

### REQ-024: Static HTML Provisioning Pipeline
**Source**: Decision 1, Decision 3
**Priority**: MUST HAVE
**Category**: Provisioning Pipeline
**Description**: Initial provisioning generates static HTML from template + content data. Output stored in R2. Served via Cloudflare edge cache. No runtime generation.
**Acceptance Criteria**:
- [ ] Template + Portable Text content merged to static HTML
- [ ] HTML output includes all assets (CSS, images, fonts)
- [ ] Generated HTML uploaded to R2 at `{site_id}/index.html`
- [ ] Cache invalidation triggered on content update
- [ ] Worker serves static HTML directly (no dynamic runtime)

**Dependencies**: REQ-023, REQ-047

---

### REQ-025: Emdash Audit & Swap Readiness
**Source**: Decision 1, Decision 11, Decision 3
**Priority**: MUST HAVE
**Category**: Provisioning Pipeline
**Description**: Emdash fork runs SSR audit in parallel to static pipeline. Audit measures P99 render time on 5-page site with D1 backend. Pass: <20ms. Acceptable: 20-28ms (needs caching). Fail: >28ms. Audit results inform Day 14 decision to swap pipeline target.
**Acceptance Criteria**:
- [ ] Benchmark script `scripts/benchmark-ssr.ts` created
- [ ] Measures P99 render time across 5 pages
- [ ] D1 backend queries measured realistically
- [ ] Results compared against <20ms pass threshold
- [ ] Audit runs on representative data
- [ ] Day 14: decision documented based on results

**Dependencies**: REQ-023, REQ-011, REQ-026

---

### REQ-026: SSR Fallback: Enhanced Static Generation
**Source**: Risk R1
**Priority**: SHOULD HAVE
**Category**: Provisioning Pipeline
**Description**: If Emdash SSR exceeds 28ms benchmark, fallback to enhanced static generation. Simplify templates if necessary. Pre-rendering eliminates runtime SSR risk entirely.
**Acceptance Criteria**:
- [ ] If Emdash P99 >28ms, documented decision to use static
- [ ] Template simplification identified if needed
- [ ] Build-time generation performance acceptable
- [ ] Static output quality maintained

**Dependencies**: REQ-025

---

### REQ-027: Site Provisioning State Machine
**Source**: Decision 2; File Structure
**Priority**: MUST HAVE
**Category**: Provisioning Pipeline
**Description**: Neon PostgreSQL hosts state machine for site provisioning lifecycle. Tracks: pending, generating, uploading, dns-configuring, provisioned, failed. Enables robust recovery and retry logic.
**Acceptance Criteria**:
- [ ] Neon migration: `site_provisions.sql` creates state table
- [ ] Columns: site_id, status, created_at, updated_at, error_message
- [ ] Status transitions: pending → generating → uploading → dns-configuring → provisioned
- [ ] Failed status includes error context for debugging
- [ ] Retry queue checks failed sites for retry attempt
- [ ] Monitoring dashboard queries state table

**Dependencies**: REQ-008

---

### REQ-028: Async Provisioning Queue with Exponential Backoff
**Source**: Risk R5; File Structure
**Priority**: MUST HAVE
**Category**: Provisioning Pipeline
**Description**: Async job processor `src/services/provisioning-queue.ts` handles site provisioning. Queue backed by Neon state machine. Exponential backoff for retries. Circuit breaker prevents cascading failures during API rate limit surges.
**Acceptance Criteria**:
- [ ] Queue service implemented with job processing
- [ ] Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s max
- [ ] Circuit breaker: stops retries after 5 failures
- [ ] Cloudflare API rate limits trigger circuit break
- [ ] Queue does not block user experience
- [ ] Monitoring tracks queue depth and retry rate

**Dependencies**: REQ-045, REQ-027

---

### REQ-029: Provisioning Success Rate Target
**Source**: PRD metrics
**Priority**: MUST HAVE
**Category**: Provisioning Pipeline
**Description**: Provisioning pipeline must achieve >99% success rate. Failure cases handled gracefully (static fallback, retry loop).
**Acceptance Criteria**:
- [ ] Baseline: >99% sites complete provisioning
- [ ] Failed sites retry every 5 minutes for 24 hours
- [ ] Static preview remains live during failed provisioning
- [ ] Monitoring alerts on success rate drop below 98%

**Dependencies**: REQ-023, REQ-024, REQ-025, REQ-028

---

### REQ-030: Subdomain Provisioning (localgenius.site)
**Source**: Decision 10 (resolved); Decision 1
**Priority**: MUST HAVE
**Category**: Provisioning Pipeline
**Description**: Sites provisioned with format: `{slug}.localgenius.site`. Short, memorable, brand-aligned. URL length drives Pro tier upsell (custom domains).
**Acceptance Criteria**:
- [ ] Domain `localgenius.site` registered (or equivalent)
- [ ] DNS wildcard configured: `*.localgenius.site` → Cloudflare Workers
- [ ] Slug validation: alphanumeric + hyphens, 3-50 characters
- [ ] Slug uniqueness enforced in D1
- [ ] Worker routing directs {slug} to correct site
- [ ] SSL certificate auto-issued for all subdomains

**Dependencies**: REQ-009, REQ-007

---

### REQ-031: Custom Domain Support (Pro Tier, Month 2)
**Source**: Decision 12
**Priority**: SHOULD HAVE
**Category**: Provisioning Pipeline
**Description**: Custom domains feature shipped in Month 2 as Pro tier ($79/month). 1-tap UX for users. Cloudflare for SaaS handles SSL/DNS automation. Cost to LocalGenius: $2/month per hostname (absorbed into $79 margin).
**Acceptance Criteria**:
- [ ] Custom domain feature tied to $79 Pro tier
- [ ] User enters custom domain → system handles everything
- [ ] Cloudflare for SaaS integration configured
- [ ] SSL certificates auto-issued and renewed
- [ ] DNS setup automated (user adds CNAME only)
- [ ] Notification when live ("usually takes about an hour")
- [ ] Feature cut from v1 (Month 2 launch)

**Dependencies**: REQ-007, REQ-112

---

### REQ-032: Image Upload and Optimization Pipeline
**Source**: Decision 6; File Structure; Risk R7
**Priority**: MUST HAVE
**Category**: Provisioning Pipeline
**Description**: Images uploaded by user are optimized before serving. Sharp-wasm (or Cloudflare Image Resizing) handles resize/compress. Original stored in R2 for archive; optimized version served from CDN. Prevents image upload from degrading PageSpeed.
**Acceptance Criteria**:
- [ ] Image optimization service: `src/services/image-optimizer.ts`
- [ ] Sharp-wasm integrated or Cloudflare Image Resizing configured
- [ ] Resizes images to device widths: 320px, 640px, 1280px
- [ ] WEBP format generated with fallback to JPEG
- [ ] Original image archived in R2
- [ ] Optimized image served from CDN
- [ ] PageSpeed score not degraded by images

**Dependencies**: REQ-047, REQ-088

---

### REQ-033: Pre-Rendered Static Output (Emdash as Build System)
**Source**: Decision 3
**Priority**: MUST HAVE
**Category**: Provisioning Pipeline
**Description**: Emdash generates HTML at provision/update time (build time). Output is pre-rendered, edge-cached. No SSR at request time. Cache invalidation triggered on MCP write. Eliminates entire SSR performance risk surface.
**Acceptance Criteria**:
- [ ] Emdash generates static HTML on provision
- [ ] Output stored in R2 + edge-cached via Cloudflare
- [ ] Content update via MCP triggers cache invalidation
- [ ] No runtime SSR on request
- [ ] Worker serves pre-rendered HTML only
- [ ] Fallback: if generation fails, retry asynchronously

**Dependencies**: REQ-025, REQ-024, REQ-069

---

---

## CONTENT MANAGEMENT & UPDATES

### REQ-034: Verification Screen Before Reveal
**Source**: Decision 7
**Priority**: MUST HAVE
**Category**: Content Management
**Description**: Before revealing site, user sees verification screen with 5 editable fact cards. User confirms/corrects facts. Only after confirmation does Reveal moment occur. No form fields, only inline editable cards.
**Acceptance Criteria**:
- [ ] Verification screen displays after onboarding
- [ ] 5 fact cards: name, description, hours, phone, address
- [ ] User can edit each fact inline
- [ ] Changes saved to local state (not yet committed)
- [ ] Confirm button triggers Reveal moment
- [ ] Confirmed facts written to D1

**Dependencies**: REQ-015, REQ-012

---

### REQ-035: Fact Card Inline Editing
**Source**: Decision 7
**Priority**: MUST HAVE
**Category**: Content Management
**Description**: Each fact card has inline edit functionality. Click-to-edit opens text input. User edits fact directly without modal dialogs or chat round-trips. Changes persist immediately.
**Acceptance Criteria**:
- [ ] Card displays current fact value
- [ ] Click card → edit mode (text input appears)
- [ ] User types new value
- [ ] Click away or Enter → saves value
- [ ] Cancel button reverts to original value
- [ ] No modal dialogs
- [ ] Changes visible immediately

**Dependencies**: REQ-015

---

### REQ-036: MCP Bridge for Content Updates
**Source**: Decision 1; File Structure
**Priority**: MUST HAVE
**Category**: Content Management
**Description**: Service `src/services/emdash-mcp.ts` implements MCP bridge between LocalGenius platform and Emdash-generated sites. Handles content CRUD operations: push updates, fetch current state, trigger re-renders.
**Acceptance Criteria**:
- [ ] MCP client sends content updates to MCP server
- [ ] MCP server runs on Cloudflare Worker (emdash-fork)
- [ ] Bi-directional sync: platform → site and site → platform
- [ ] Update operations: name, description, hours, photos, menu items, services
- [ ] Errors handled gracefully with retry logic
- [ ] Integration tests for every MCP operation

**Dependencies**: REQ-009, REQ-069, REQ-070

---

### REQ-037: User-Initiated Content Updates via Chat
**Source**: Decision 8; MVP Feature
**Priority**: MUST HAVE
**Category**: Content Management
**Description**: User can request content updates through conversational chat interface. AI interprets update request and modifies site content via MCP. User sees confirmation: "I updated X because Y."
**Acceptance Criteria**:
- [ ] Chat interface accepts update requests
- [ ] AI parses intent (e.g., "add dinner special")
- [ ] AI generates content for update
- [ ] Content validated via Portable Text schema
- [ ] MCP sends update to site
- [ ] Confirmation message includes what was updated and why

**Dependencies**: REQ-004, REQ-075, REQ-076, REQ-036

---

### REQ-038: Review Sync to Site (Top 5 Google Reviews, Every 6 Hours)
**Source**: MVP Feature
**Priority**: MUST HAVE
**Category**: Content Management
**Description**: Top 5 Google reviews fetched from GBP and pushed to site via MCP. Sync runs every 6 hours asynchronously. Reviews displayed on site (template-specific placement).
**Acceptance Criteria**:
- [ ] Google Business Profile API integration
- [ ] Fetch top 5 reviews (by rating/recency)
- [ ] Push reviews to site via MCP
- [ ] Cron job runs every 6 hours
- [ ] Reviews stored in D1
- [ ] Template renders reviews (restaurant/services format)
- [ ] Failed sync retries with exponential backoff

**Dependencies**: REQ-036, REQ-019, REQ-020

---

### REQ-039: Optional Monthly AI Updates (Opt-In)
**Source**: Decision 18 (compromise)
**Priority**: NICE TO HAVE
**Category**: Content Management
**Description**: Optional feature: AI suggests monthly content updates (e.g., seasonal menu changes, updated hours). Feature is opt-in, default OFF. User enables in settings. All updates user-initiated (not autonomous).
**Acceptance Criteria**:
- [ ] Feature flag: monthly_updates_enabled
- [ ] Default: false (disabled)
- [ ] User setting to enable/disable
- [ ] AI generates update suggestions conversationally
- [ ] User approves or rejects suggestion
- [ ] No autonomous pushes (all user-triggered)
- [ ] Tracking: suggestion date, user approval, execution

**Dependencies**: REQ-004, REQ-037

---

---

## PERFORMANCE & QUALITY

### REQ-040: 95+ PageSpeed Insights for Both Templates
**Source**: Decision 15
**Priority**: MUST HAVE
**Category**: Performance
**Description**: Both Restaurant and Services templates must score 95+ on Google PageSpeed Insights before entering production pool. Design requirement, not just engineering target.
**Acceptance Criteria**:
- [ ] Restaurant template: 95+ PageSpeed on desktop, 95+ on mobile
- [ ] Services template: 95+ PageSpeed on desktop, 95+ on mobile
- [ ] Measured with representative content
- [ ] No sites enter production pool below 95
- [ ] CSS critical-path inlined
- [ ] Fonts subsetted (Latin only, inlined)
- [ ] Images optimized (sharp-wasm)

**Dependencies**: REQ-018, REQ-019, REQ-020, REQ-032

---

### REQ-041: SSR Benchmark: <20ms Pass Threshold
**Source**: Decision 11
**Priority**: MUST HAVE
**Category**: Performance
**Description**: Pass threshold for Emdash SSR: <20ms P99 render time on 5-page site with D1 backend. Acceptable: 20-28ms (needs caching). Fail: >28ms. Benchmark measured before Day 14 decision point.
**Acceptance Criteria**:
- [ ] Benchmark script measures P99 render time
- [ ] 5-page test site with realistic D1 queries
- [ ] Results documented by Day 14
- [ ] <20ms = pass (ship with Emdash)
- [ ] 20-28ms = acceptable (use with caching)
- [ ] >28ms = fail (use static rendering)

**Dependencies**: REQ-025, REQ-033

---

### REQ-042: Emdash MCP Audit Success Rate >95%
**Source**: Open Questions #5
**Priority**: MUST HAVE
**Category**: Performance
**Description**: Emdash MCP bridge audit measures provisioning success rate. Target: >95% successful MCP operations (no transport failures, no content corruption).
**Acceptance Criteria**:
- [ ] Test script: 100 MCP operations (CRUD for each content type)
- [ ] Audit runs on Day 14
- [ ] Success rate >95% passes audit
- [ ] Failures documented and debugged
- [ ] Retry logic tested for edge cases

**Dependencies**: REQ-036, REQ-025

---

### REQ-043: Site Load Time <3 Seconds
**Source**: Implied by PageSpeed, User Experience
**Priority**: MUST HAVE
**Category**: Performance
**Description**: All generated sites load in <3 seconds on 4G network (simulated). Measured at Reveal moment and ongoing.
**Acceptance Criteria**:
- [ ] Lighthouse test: <3 second load on 4G
- [ ] Measured via Chrome DevTools
- [ ] Verified for both templates
- [ ] Monitored via synthetic monitoring

**Dependencies**: REQ-040, REQ-088

---

---

## GROWTH & MONETIZATION

### REQ-044: "Made with LocalGenius" Footer + Referral Link
**Source**: Decision 13; MVP Feature
**Priority**: MUST HAVE
**Category**: Growth
**Description**: Every site includes footer: "Made with LocalGenius" (not "Powered by"). Footer links to `localgenius.company/sites?ref={slug}`. Links include referral tracking for analytics and future referral program.
**Acceptance Criteria**:
- [ ] Footer text: "Made with LocalGenius"
- [ ] Footer links to: `localgenius.company/sites?ref={slug}`
- [ ] Referral slug tracked in URL parameter
- [ ] Link opens conversion page
- [ ] Both templates include identical footer treatment
- [ ] Footer not removable (part of license)

**Dependencies**: REQ-109, REQ-113

---

### REQ-045: Live Sites Growth Targets (Day 30: 50, Day 60: 500)
**Source**: PRD metrics
**Priority**: MUST HAVE
**Category**: Growth
**Description**: Product targets 50 live sites by Day 30, 500 live sites by Day 60. Metrics tracked daily.
**Acceptance Criteria**:
- [ ] Dashboard metric: cumulative sites created
- [ ] Day 30: ≥50 live sites
- [ ] Day 60: ≥500 live sites
- [ ] Tracking begins Day 1 post-launch
- [ ] Alert if growth rate below forecast

**Dependencies**: REQ-029, REQ-049

---

### REQ-046: MCP Content Updates per Site: ≥2/month
**Source**: PRD metrics
**Priority**: MUST HAVE
**Category**: Growth
**Description**: Engaged users average ≥2 MCP content updates per site per month. Tracks user engagement and AI-managed website stickiness.
**Acceptance Criteria**:
- [ ] Metric: MCP update count per site per month
- [ ] Target: average ≥2 updates/month
- [ ] Tracked per-site and in aggregate
- [ ] Dashboard displays update frequency distribution
- [ ] Alert if average falls below 1.5/month

**Dependencies**: REQ-037, REQ-036

---

### REQ-047: Pro Tier Conversion Target: >20%
**Source**: PRD metrics
**Priority**: SHOULD HAVE
**Category**: Growth
**Description**: Target conversion rate for Pro tier ($79 custom domains) is >20% of users. URL length (localgenius.site) drives Pro upsell.
**Acceptance Criteria**:
- [ ] Tracking: Pro tier conversion rate
- [ ] Baseline: >20% users convert to Pro
- [ ] Dashboard metric: Pro conversion trend
- [ ] Alert if conversion drops below 18%

**Dependencies**: REQ-031, REQ-112

---

### REQ-048: First MCP Story Filmed by Day 30
**Source**: Timeline, MVP Feature
**Priority**: MUST HAVE
**Category**: Growth
**Description**: By Day 30 post-launch, first MCP content update story filmed and published. Story demonstrates AI managing website content based on user request.
**Acceptance Criteria**:
- [ ] Script written: day 25-26
- [ ] Filming: day 27-28
- [ ] Editing: day 28-29
- [ ] Publication: day 30
- [ ] MCP bridge fully stable for filming (zero retries)

**Dependencies**: REQ-036, REQ-037, REQ-004

---

---

## DESIGN & BRAND

### REQ-049: Reveal Moment in Device Frame with "Your Site is Live" Text
**Source**: Decision 14
**Priority**: MUST HAVE
**Category**: Design
**Description**: Reveal moment shows live site in device frame (iPhone/Mac appearance). URL bar shows real subdomain. Text below: "Your site is live." No confetti. Restraint is the design.
**Acceptance Criteria**:
- [ ] Component: `src/components/site-reveal/RevealFrame.tsx`
- [ ] Device frame renders site in responsive mockup
- [ ] URL bar shows actual subdomain (e.g., salsa-kitchen.localgenius.site)
- [ ] Text display: "Your site is live" (exact copy)
- [ ] No confetti or excessive animations
- [ ] Frame design elegant and minimal
- [ ] Preload iframe during provisioning for perceived speed

**Dependencies**: REQ-002, REQ-051

---

### REQ-050: Build Progress Animation ("Building Something Beautiful...")
**Source**: File Structure; Implied by UX
**Priority**: MUST HAVE
**Category**: Design
**Description**: During 5-second static preview generation, UI shows build progress animation. States: "Building something beautiful...", "Optimizing images...", "Rendering your site..." Conveyed as phases of creation.
**Acceptance Criteria**:
- [ ] Component: `src/components/site-reveal/BuildProgress.tsx`
- [ ] Multiple progress states with copy
- [ ] Animation smooth (no jank)
- [ ] Timing aligns with actual build phases
- [ ] Conveys craftsmanship, not technical details

**Dependencies**: REQ-016

---

### REQ-051: Site Preview Generator (Static HTML Rendering)
**Source**: Decision 8; File Structure
**Priority**: MUST HAVE
**Category**: Design
**Description**: Service `src/components/site-preview/PreviewGenerator.ts` renders static HTML preview in <5 seconds. Output includes all critical assets (CSS, images, fonts).
**Acceptance Criteria**:
- [ ] PreviewGenerator component created
- [ ] Renders template + content data to static HTML
- [ ] Includes all critical CSS (inlined)
- [ ] Includes all images (optimized)
- [ ] Includes fonts (subsetted, inlined)
- [ ] Generates in <5 seconds

**Dependencies**: REQ-016, REQ-010

---

### REQ-052: Product Naming: "LocalGenius Sites" in Code, "Presence" in Marketing
**Source**: Decision 19 (compromise)
**Priority**: MUST HAVE
**Category**: Brand
**Description**: Internal codebase and technical references use "LocalGenius Sites." Marketing copy, brand materials, and user-facing product use "Presence." Re-evaluate branding at 1K users milestone.
**Acceptance Criteria**:
- [ ] Code repository name: `localgenius-sites`
- [ ] Product internal name: LocalGenius Sites
- [ ] Marketing site copy: Presence
- [ ] Landing page headline: "Presence"
- [ ] Footer link text: "Made with LocalGenius" (feature name)
- [ ] Decision to keep/rename at 1K users

**Dependencies**: REQ-001

---

### REQ-053: Mobile-First Design System
**Source**: Decision 4
**Priority**: MUST HAVE
**Category**: Design
**Description**: Both templates designed mobile-first. Responsive design ensures 95+ PageSpeed on mobile and desktop. No mobile bloat.
**Acceptance Criteria**:
- [ ] Templates designed for 320px+ screens first
- [ ] Desktop design is enhancement, not primary
- [ ] Responsive images (srcset)
- [ ] Touch-friendly buttons (48px min)
- [ ] No desktop-only features

**Dependencies**: REQ-018, REQ-019, REQ-020, REQ-040

---

### REQ-054: Photo Treatment System
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Design
**Description**: Design system for photo display and treatment across templates. Ensures visual consistency, fast loading, and brand alignment.
**Acceptance Criteria**:
- [ ] Photo gallery component (multiple images)
- [ ] Hero image optimization
- [ ] Aspect ratio consistency
- [ ] Lazy loading for below-the-fold images
- [ ] Fallback for missing photos

**Dependencies**: REQ-032, REQ-019, REQ-020

---

### REQ-055: Portable Text Schema for Restaurant Template
**Source**: Open Questions #6; File Structure
**Priority**: MUST HAVE
**Category**: Design
**Description**: Sanity-compatible Portable Text schema for Restaurant template. Defines all content types: menu items, sections, hours, contact, photos, description.
**Acceptance Criteria**:
- [ ] Schema file: `emdash-fork/templates/restaurant/schema.ts`
- [ ] Types: menuItem, section, restaurantInfo, hours, phone, address
- [ ] Menu item fields: name, description, price, photo, category
- [ ] Section fields: name, items, description
- [ ] Hours: open/close times, special hours for holidays
- [ ] Contact: phone, address, email
- [ ] Validation rules for each field

**Dependencies**: REQ-019, REQ-022

---

### REQ-056: Portable Text Schema for Services Template
**Source**: Open Questions #6; File Structure
**Priority**: MUST HAVE
**Category**: Design
**Description**: Sanity-compatible Portable Text schema for Services template. Defines all content types: services, categories, availability, booking, contact.
**Acceptance Criteria**:
- [ ] Schema file: `emdash-fork/templates/services/schema.ts`
- [ ] Types: service, serviceCategory, availability, contact
- [ ] Service fields: name, description, duration, price, booking CTA
- [ ] Category fields: name, services
- [ ] Availability: schedule, special closures
- [ ] Contact: phone, email, booking link
- [ ] Validation rules for each field

**Dependencies**: REQ-020, REQ-022

---

### REQ-057: Typography System (Fonts, Sizes, Weights)
**Source**: Implied by PageSpeed, Mobile-First
**Priority**: MUST HAVE
**Category**: Design
**Description**: Typography system with subset fonts (Latin only), inlined at build time. Consistent sizing and weight scale across templates.
**Acceptance Criteria**:
- [ ] Font selection: max 2 fonts per template
- [ ] Subsetting: Latin characters only
- [ ] Font files inlined in critical CSS
- [ ] Size scale: 12px-32px with consistent increments
- [ ] Weight scale: 400 (regular), 600 (semibold), 700 (bold)

**Dependencies**: REQ-040, REQ-053

---

### REQ-058: Color System (Palette, Contrast)
**Source**: Implied by Design, Accessibility
**Priority**: MUST HAVE
**Category**: Design
**Description**: Color palette for templates. WCAG AA contrast compliance for all text/background combinations. No color picker (system-defined).
**Acceptance Criteria**:
- [ ] Palette: primary, secondary, accent, neutral (4-5 colors)
- [ ] All text/background contrast ratios ≥4.5:1 (WCAG AA)
- [ ] Consistent palette across both templates
- [ ] No user-facing color customization

**Dependencies**: REQ-003, REQ-053

---

### REQ-059: Brand Voice: Confident, Direct, Specific
**Source**: Round 2 Elon (concession)
**Priority**: MUST HAVE
**Category**: Brand
**Description**: All user-facing copy follows brand voice: confident, direct, specific. No corporate jargon. No generic success messages. First-person when updates happen.
**Acceptance Criteria**:
- [ ] Copy style guide created
- [ ] Success messages specific (not "processed")
- [ ] Error messages explain next steps
- [ ] AI updates use first-person ("I updated...")
- [ ] All copy reviewed for voice consistency

**Dependencies**: REQ-004, REQ-037

---

---

## TIMELINE & DELIVERY

### REQ-060: Six-Week Delivery Timeline
**Source**: Timeline, Locked Decisions
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Complete build and ship in 6 weeks from Day 1 kickoff. Parallel tracks: Steve (Design), Elon (Engineering).
**Acceptance Criteria**:
- [ ] Kickoff: April 14, 2026
- [ ] Ship date: May 26, 2026 (Week 6, Day 42)
- [ ] Week 1-2: Templates + provisioning pipeline
- [ ] Week 3-4: MCP + DNS automation
- [ ] Week 5-6: Integration + production deploy
- [ ] Day 30: First MCP story filmed

**Dependencies**: All requirements

---

### REQ-061: Week 1-2: Template Wireframes & Provisioning Pipeline
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Week 1-2 parallel work: Steve designs templates (wireframes, design system). Elon builds provisioning pipeline (static target) and runs Emdash audit.
**Acceptance Criteria**:
- [ ] Steve: Mobile-first wireframes for both templates
- [ ] Steve: Design system (colors, typography, spacing)
- [ ] Elon: Static provisioning pipeline functional
- [ ] Elon: Emdash audit started (runs in parallel)

**Dependencies**: REQ-060, REQ-019, REQ-020, REQ-023, REQ-024

---

### REQ-062: Week 2-3: Template Buildout & MCP Bridge
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Week 2-3 parallel work: Steve builds templates in Astro. Elon builds MCP bridge and Portable Text validation.
**Acceptance Criteria**:
- [ ] Steve: Restaurant template coded in Astro
- [ ] Steve: Services template coded in Astro
- [ ] Elon: `emdash-mcp.ts` service implemented
- [ ] Elon: Portable Text schema validation complete

**Dependencies**: REQ-060, REQ-019, REQ-020, REQ-036, REQ-022

---

### REQ-063: Week 3-4: DNS Automation & Reveal Flow
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Week 3-4 parallel work: Elon swaps provisioning to Emdash (if audit passes) and automates DNS. Steve designs reveal flow and build animations.
**Acceptance Criteria**:
- [ ] Elon: Day 14 decision documented (static vs Emdash)
- [ ] Elon: DNS wildcard automation for subdomains
- [ ] Elon: Worker routing logic complete
- [ ] Steve: Reveal frame component complete
- [ ] Steve: Build progress animation complete

**Dependencies**: REQ-060, REQ-025, REQ-030, REQ-049, REQ-050

---

### REQ-064: Week 4-5: Integration Testing & Optimization
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Week 4-5: Integration testing with 10-user design review. PageSpeed optimization. Load testing and error recovery.
**Acceptance Criteria**:
- [ ] 10-user design review completed
- [ ] Both templates achieve 95+ PageSpeed
- [ ] Load testing: >100 concurrent provisions
- [ ] Error recovery tested (failures + retries)
- [ ] Monitoring dashboard configured

**Dependencies**: REQ-060, REQ-040, REQ-049

---

### REQ-065: Week 5-6: Production Deploy & MCP Filming
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Week 5-6: Production deployment. Day 30 MCP story filmed. Custom domain prep for Pro tier (Month 2 launch).
**Acceptance Criteria**:
- [ ] Production deploy complete
- [ ] All sites routed through Cloudflare Workers
- [ ] MCP story filmed (Day 27-30)
- [ ] Custom domain infrastructure ready (not in v1)

**Dependencies**: REQ-060, REQ-048, REQ-031

---

---

## DEPENDENCIES MATRIX

### Critical Path Dependencies

```
REQ-060 (Timeline) → ALL REQUIREMENTS
  ├─ REQ-061-065 (Weekly milestones)
  └─ All features depend on timeline completion

REQ-001 (Core Philosophy) → REQ-002, REQ-003, REQ-004, REQ-019, REQ-020
REQ-005 (Multi-Tenant DB) → REQ-027, REQ-028, REQ-008
REQ-009 (MCP HTTP) → REQ-036, REQ-037, REQ-069, REQ-070
REQ-011 (Fork Emdash) → REQ-019, REQ-020, REQ-055, REQ-056

REQ-018 (Two Templates) → REQ-019, REQ-020, REQ-021, REQ-040
  ├─ REQ-019 (Restaurant) → REQ-022, REQ-055
  ├─ REQ-020 (Services) → REQ-022, REQ-056
  └─ REQ-021 (AI Selection) → REQ-012, REQ-013

REQ-023 (Parallel Build) → REQ-024, REQ-025
  ├─ REQ-024 (Static Pipeline) → REQ-047, REQ-032
  └─ REQ-025 (Emdash Audit) → REQ-026, REQ-033, REQ-041

REQ-012 (4-Input Onboarding) → REQ-013, REQ-014, REQ-034, REQ-035, REQ-080, REQ-081
  ├─ REQ-013 (Auto-Enrichment) → REQ-014, REQ-034
  └─ REQ-014 (Graceful Fallback) → REQ-015

REQ-015 (Fact Cards) → REQ-034, REQ-035, REQ-016
REQ-016 (Instant Preview) → REQ-017, REQ-037, REQ-036, REQ-050, REQ-051
REQ-017 (Deferred Provisioning) → REQ-036, REQ-037, REQ-050

REQ-004 (Invisible AI) → REQ-075, REQ-076, REQ-135, REQ-037
REQ-036 (MCP Bridge) → REQ-037, REQ-038, REQ-069, REQ-070
REQ-037 (User-Initiated Updates) → REQ-075, REQ-076, REQ-036, REQ-004

REQ-040 (95+ PageSpeed) → REQ-018, REQ-019, REQ-020, REQ-032, REQ-088
  ├─ REQ-032 (Image Optimization) → REQ-047
  └─ REQ-053 (Mobile-First) → REQ-054, REQ-057, REQ-058

REQ-044 (Footer + Referral) → REQ-109, REQ-113, REQ-029, REQ-049
REQ-045 (Growth Targets) → REQ-029, REQ-049
REQ-048 (MCP Story Day 30) → REQ-036, REQ-037, REQ-004
```

### Blocked Dependencies (Must Resolve First)

```
REQ-025 (Emdash Audit) blocks REQ-026, REQ-041, REQ-033
  → Day 14 decision point

REQ-030 (Subdomain) blocks REQ-016, REQ-017, REQ-049
  → Domain purchase required (REQ-003 in Open Questions)
```

### Shared Component Dependencies

```
Template System (REQ-018-022)
  ├─ Portable Text Schema (REQ-022, REQ-055, REQ-056)
  ├─ File Structure (REQ-019, REQ-020)
  └─ Emdash Fork (REQ-011)

Provisioning (REQ-023-033)
  ├─ State Machine (REQ-027)
  ├─ Async Queue (REQ-028)
  ├─ Image Optimization (REQ-032)
  └─ Success Tracking (REQ-029)

MCP & Content (REQ-036-039)
  ├─ MCP Bridge (REQ-036)
  ├─ User Updates (REQ-037)
  ├─ Review Sync (REQ-038)
  └─ Optional Monthly (REQ-039)

Design & Brand (REQ-049-059)
  ├─ Reveal Moment (REQ-049)
  ├─ Typography (REQ-057)
  └─ Color System (REQ-058)
```

---

## REQUIREMENT STATISTICS

**Total Atomic Requirements**: 65 documented
**Distribution by Category**:
- Core Product: 4
- Architecture: 7
- Onboarding: 5
- Templates: 5
- Provisioning Pipeline: 12
- Content Management: 6
- Performance & Quality: 4
- Growth & Monetization: 5
- Design & Brand: 11
- Timeline & Delivery: 6

**Priority Distribution**:
- MUST HAVE: 53 requirements
- SHOULD HAVE: 6 requirements
- NICE TO HAVE: 6 requirements

**Open Decisions Requiring Resolution**:
1. Subdomain: `{slug}.localgenius.site` (RESOLVED: Elon's position)
2. Monthly AI Updates: Opt-in, default OFF (RESOLVED: Compromise)
3. Product Naming: "LocalGenius Sites" in code, "Presence" in marketing (RESOLVED: Compromise)
4. Emdash SSR Benchmark: Day 14 measurement required
5. Emdash MCP Audit: Day 14 measurement required
6. Portable Text schema fields: Day 14 definition during template design
7. Domain purchase: lg.site availability (Day 3 research)

---

## NOTES ON TRACEABILITY

Every requirement links back to:
- **Locked Decision**: 1-19 from decisions.md
- **MVP Feature**: Explicit feature list
- **Risk**: Risk register (R1-R10)
- **Timeline**: Week 1-6 breakdown
- **Essence**: Core philosophy

Source documents available in `/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-sites/`:
- decisions.md (locked decisions, features, file structure, risks, timeline)
- essence.md (core philosophy)
- round-2-steve.md (design perspective)
- round-2-elon.md (engineering perspective)

---

## NEXT STEPS

1. **Day 1**: Resolve open decisions #7 (domain purchase)
2. **Week 1-2**: Execute REQ-061 (parallel tracks begin)
3. **Day 14**: Measure Emdash SSR (REQ-041), MCP audit (REQ-042), finalize Day 14 decisions
4. **Week 6**: Ship product per REQ-060 timeline
5. **Day 30**: Film MCP story (REQ-048)
6. **Month 2**: Launch Pro tier custom domains (REQ-031)
