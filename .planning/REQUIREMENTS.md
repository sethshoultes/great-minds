# LocalGenius Sites — Atomic Requirements Specification

**Generated**: 2026-04-14
**Source Documents**:
- `/rounds/localgenius-sites/decisions.md` (19 Locked Decisions + MVP Features)
- `/prds/completed/localgenius-sites.md` (Original PRD)
**Project Slug**: `localgenius-sites`
**Product Name**: LocalGenius Sites (code) / Presence (marketing)
**Ship Date**: 6 weeks from kickoff (May 26, 2026)

---

## Executive Summary

LocalGenius Sites is a managed website service that provisions real, CMS-powered websites for local businesses using Emdash (Astro + Cloudflare). The core thesis: "The website is not the product. The feeling is the product." We're selling legitimacy to businesses who have never felt legitimate online.

**v1 Scope**:
- 2 templates (Restaurant + Services)
- 4-input onboarding + auto-enrichment
- Instant preview reveal (<5 seconds)
- MCP bridge for AI-managed content updates
- Subdomain hosting on `{slug}.localgenius.site`

**Key Constraints**:
- No custom domains in v1 (Pro tier, Month 2)
- No CMS exposure (conversational only)
- No template picker (AI selects silently)
- No theme/font/color customization

---

## Requirements Summary

| Category | Count | Priority |
|----------|-------|----------|
| Core Product | 4 | MUST HAVE |
| Architecture & Infrastructure | 7 | MUST HAVE |
| Onboarding & User Experience | 6 | MUST HAVE |
| Template System | 5 | MUST HAVE |
| Provisioning Pipeline | 11 | MUST HAVE |
| Content Management & Updates | 6 | MUST HAVE |
| Performance & Quality | 4 | MUST HAVE |
| Growth & Monetization | 5 | MUST/SHOULD |
| Design & Brand | 11 | MUST HAVE |
| Timeline & Delivery | 6 | MUST HAVE |
| **TOTAL** | **65** | — |

---

## CORE PRODUCT REQUIREMENTS

### REQ-001: Core Product Philosophy
**Source**: Essence, Consensus Statement
**Priority**: MUST HAVE
**Category**: Product Strategy
**Description**: The product is not a website builder; it is the feeling of legitimacy. The AI-managed website after creation is the category differentiator.
**Acceptance Criteria**:
- [ ] Product positions as legitimacy service, not website tool
- [ ] AI post-creation management is core narrative
- [ ] Design conveys "craft" not "features"

---

### REQ-002: Reveal Moment as Primary Product
**Source**: Essence, Decision 14
**Priority**: MUST HAVE
**Category**: Product Strategy
**Description**: The reveal moment (user seeing their live site) is the entire product. "If they don't gasp, we failed."
**Acceptance Criteria**:
- [ ] User sees their business name on a real website they didn't build
- [ ] URL bar shows real subdomain
- [ ] Live site rendered in device frame
- [ ] Text display: "Your site is live."
- [ ] No confetti or excessive animation (restraint is the design)

---

### REQ-003: Zero Customization Philosophy
**Source**: Decision 5
**Priority**: MUST HAVE
**Category**: Product Strategy
**Description**: Users make zero design choices. AI selects template silently. "Every choice is a moment of doubt."
**Acceptance Criteria**:
- [ ] No template picker UI
- [ ] No color/theme selector
- [ ] No font dropdown
- [ ] No advanced settings in v1

---

### REQ-004: AI-Managed Website Updates
**Source**: Decision 18 (compromise)
**Priority**: MUST HAVE
**Category**: Product Strategy
**Description**: AI manages content updates via conversational interface. Updates are user-initiated (not autonomous). Notifications are first-person and specific.
**Acceptance Criteria**:
- [ ] AI updates content only when user explicitly requests
- [ ] Notifications: "I updated X because Y"
- [ ] Failed updates never appear to have succeeded
- [ ] Monthly AI updates are opt-in, default OFF

---

## ARCHITECTURE & INFRASTRUCTURE

### REQ-005: Multi-Tenant Database Architecture
**Source**: Decision 2
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: Single D1 database with all tenants partitioned by `site_id`. "One deployment, one migration path, one monitoring dashboard."
**Acceptance Criteria**:
- [ ] D1 schema includes `site_id` as partition key
- [ ] All queries filter by `site_id`
- [ ] No per-tenant database instances

---

### REQ-006: Single R2 Bucket with Tenant Partitioning
**Source**: Decision 2
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: All site assets in single R2 bucket, partitioned by `site_id`.
**Acceptance Criteria**:
- [ ] R2 paths: `{site_id}/{asset}`
- [ ] No per-tenant bucket creation

---

### REQ-007: Cloudflare Infrastructure Stack
**Source**: Decision 12, 16, Consensus Statement
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: Cloudflare Workers (routing), D1 (database), R2 (assets), KV (cache), Cloudflare for SaaS (custom domains Pro tier).
**Acceptance Criteria**:
- [ ] Site router Worker deployed
- [ ] D1 provisioned with site schema
- [ ] R2 bucket with CDN caching
- [ ] KV for cache invalidation

---

### REQ-008: Vercel + Neon for Main Application
**Source**: Consensus Statement
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: Main app (onboarding, API, auth) on Vercel. State machine for provisioning in Neon PostgreSQL.
**Acceptance Criteria**:
- [ ] Vercel deployment configured
- [ ] Neon PostgreSQL for state machine
- [ ] MCP client as Vercel API route

---

### REQ-009: MCP HTTP Transport (Stateless)
**Source**: Decision 16
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: MCP uses streamable HTTP POST. No WebSockets. No SSE for CRUD. MCP server as Cloudflare Worker, client in Vercel.
**Acceptance Criteria**:
- [ ] MCP transport is HTTP POST
- [ ] No WebSocket/SSE connections
- [ ] Request/response payloads are stateless

---

### REQ-010: D1 Federation Strategy (Parameterized)
**Source**: Decision 17
**Priority**: SHOULD HAVE
**Category**: Architecture
**Description**: Parameterize `cloudflareAccountId` now. Build federation at 10K+ sites (Phase 2).
**Acceptance Criteria**:
- [ ] `cloudflareAccountId` as environment variable
- [ ] No hardcoded account IDs
- [ ] Federation roadmap documented

---

### REQ-011: Fork Emdash from Day 1
**Source**: Decision 9
**Priority**: MUST HAVE
**Category**: Architecture
**Description**: Own Emdash fork. Do not depend on external releases.
**Acceptance Criteria**:
- [ ] Emdash forked to `localgenius/emdash-fork`
- [ ] Fork tracks upstream (git remote)
- [ ] Custom templates in fork
- [ ] Custom Portable Text schemas in fork

---

## ONBOARDING & USER EXPERIENCE

### REQ-012: Four-Input Onboarding
**Source**: Decision 6
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: Exactly 4 inputs: business name (pre-captured), photos, one-sentence description, hours confirmation.
**Acceptance Criteria**:
- [ ] Input 1: Business name (pre-populated)
- [ ] Input 2: Photos (upload or GBP)
- [ ] Input 3: "What do you do?" (one sentence)
- [ ] Input 4: Hours confirmation
- [ ] No additional fields

---

### REQ-013: Auto-Enrichment from GBP & Yelp
**Source**: Decision 6
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: AI enriches inputs with GBP and Yelp data asynchronously.
**Acceptance Criteria**:
- [ ] GBP API for photos, hours, categories
- [ ] Yelp API for reviews, description
- [ ] Enrichment happens asynchronously
- [ ] Fallback: AI asks conversational follow-ups

---

### REQ-014: Graceful Fallback (No GBP Data)
**Source**: Decision 6, Risk R8
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: For 30% of businesses with no GBP, AI asks follow-ups conversationally (not as form fields).
**Acceptance Criteria**:
- [ ] GBP lookup fails → trigger chat fallback
- [ ] Questions appear as natural conversation
- [ ] Site ships with available data

---

### REQ-015: Editable Fact Cards for Verification
**Source**: Decision 7
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: Verification screen shows 5 editable fact cards (name, description, hours, phone, address). Inline editing, no chat round-trip.
**Acceptance Criteria**:
- [ ] 5 fact cards displayed
- [ ] Each card has inline edit
- [ ] Click-to-edit opens text input
- [ ] No design editing (facts only)

---

### REQ-016: Instant Preview in <5 Seconds
**Source**: Decision 8
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: Static HTML preview renders in <5 seconds for the Reveal moment.
**Acceptance Criteria**:
- [ ] Static HTML generation <5 seconds
- [ ] Preview includes name, photos, description, hours
- [ ] Accurate representation of final site

---

### REQ-017: Deferred Provisioning (Background)
**Source**: Decision 8
**Priority**: MUST HAVE
**Category**: Onboarding
**Description**: Full D1/R2/Worker/DNS provisioning runs in background after Reveal. Hot-swap when ready; static stays live if provisioning fails.
**Acceptance Criteria**:
- [ ] Instant preview serves immediately
- [ ] Full provisioning in background
- [ ] Hot-swap when complete
- [ ] Failed provisioning → retry loop with exponential backoff

---

## TEMPLATE SYSTEM

### REQ-018: Two Templates at Launch
**Source**: Decision 4
**Priority**: MUST HAVE
**Category**: Templates
**Description**: Exactly 2 templates: Restaurant and Services. Both 95+ PageSpeed, mobile-first.
**Acceptance Criteria**:
- [ ] Restaurant template in Astro
- [ ] Services template in Astro
- [ ] Both 95+ PageSpeed
- [ ] Mobile-first responsive design

---

### REQ-019: Restaurant Template
**Source**: Decision 4, File Structure
**Priority**: MUST HAVE
**Category**: Templates
**Description**: Restaurant vertical with menu display, pricing, photos.
**Acceptance Criteria**:
- [ ] Pages: index, menu, about, contact
- [ ] Menu items: name, description, price, photo
- [ ] Hours with holiday handling
- [ ] Reservation CTA
- [ ] Schema: menuItem, section, restaurantInfo

---

### REQ-020: Services Template
**Source**: Decision 4, File Structure
**Priority**: MUST HAVE
**Category**: Templates
**Description**: Services vertical with service listings and booking CTAs.
**Acceptance Criteria**:
- [ ] Pages: index, services, about, contact
- [ ] Services: name, description, duration, price, CTA
- [ ] Service categories
- [ ] Booking integration point
- [ ] Schema: service, serviceCategory, availability

---

### REQ-021: AI Template Selection
**Source**: Decision 5
**Priority**: MUST HAVE
**Category**: Templates
**Description**: AI selects template based on business vertical. User never sees choice.
**Acceptance Criteria**:
- [ ] No template picker UI
- [ ] AI evaluates business type
- [ ] Selection stored in site record
- [ ] Admin override available (not user-facing)

---

### REQ-022: Portable Text Schema Validation
**Source**: Decision 6, Risk R4
**Priority**: MUST HAVE
**Category**: Templates
**Description**: AI content validated against schema before D1 write. Malformed content rejected and regenerated.
**Acceptance Criteria**:
- [ ] `src/lib/portable-text-schema.ts` implemented
- [ ] Restaurant schema defined
- [ ] Services schema defined
- [ ] Validation before write
- [ ] Failures logged for prompt improvement

---

## PROVISIONING PIPELINE

### REQ-023: Parallel Build Strategy
**Source**: Decision 1
**Priority**: MUST HAVE
**Category**: Provisioning
**Description**: Pipeline targets static HTML initially. Emdash audit runs in parallel. Day 14 decision: swap to Emdash if audit passes.
**Acceptance Criteria**:
- [ ] Static HTML pipeline by Day 7
- [ ] Emdash audit runs independently
- [ ] Day 14 benchmark results for decision
- [ ] Swap mechanism between static/Emdash

---

### REQ-024: Static HTML Provisioning
**Source**: Decision 1, 3
**Priority**: MUST HAVE
**Category**: Provisioning
**Description**: Generate static HTML from template + content. Store in R2. Serve via edge cache.
**Acceptance Criteria**:
- [ ] Template + content merged to HTML
- [ ] Output uploaded to R2 at `{site_id}/`
- [ ] Cache invalidation on update
- [ ] Worker serves static HTML

---

### REQ-025: Emdash SSR Benchmark & Audit
**Source**: Decision 1, 11
**Priority**: MUST HAVE
**Category**: Provisioning
**Description**: Audit measures P99 render time. Pass: <20ms. Acceptable: 20-28ms. Fail: >28ms.
**Acceptance Criteria**:
- [ ] Benchmark script: `scripts/benchmark-ssr.ts`
- [ ] Measures P99 across 5 pages with D1
- [ ] Results by Day 14
- [ ] Decision documented

---

### REQ-026: Site Provisioning State Machine
**Source**: Decision 2, File Structure
**Priority**: MUST HAVE
**Category**: Provisioning
**Description**: Neon hosts state machine: pending → generating → uploading → dns-configuring → provisioned → failed.
**Acceptance Criteria**:
- [ ] Migration: `site_provisions.sql`
- [ ] Status transitions tracked
- [ ] Failed states include error context
- [ ] Retry queue for failed sites

---

### REQ-027: Async Queue with Exponential Backoff
**Source**: Risk R5, File Structure
**Priority**: MUST HAVE
**Category**: Provisioning
**Description**: `src/services/provisioning-queue.ts` handles async provisioning. Exponential backoff, circuit breaker.
**Acceptance Criteria**:
- [ ] Queue with job processing
- [ ] Backoff: 1s, 2s, 4s, 8s, 16s, 32s max
- [ ] Circuit breaker after 5 failures
- [ ] Queue doesn't block UX

---

### REQ-028: Provisioning Success Rate >99%
**Source**: PRD metrics
**Priority**: MUST HAVE
**Category**: Provisioning
**Description**: Pipeline achieves >99% success. Failed sites retry for 24 hours.
**Acceptance Criteria**:
- [ ] >99% sites complete provisioning
- [ ] Retry every 5 minutes for 24 hours
- [ ] Static preview remains live during failure
- [ ] Alert if success rate <98%

---

### REQ-029: Subdomain Provisioning
**Source**: Decision 10
**Priority**: MUST HAVE
**Category**: Provisioning
**Description**: Sites at `{slug}.localgenius.site`. Wildcard DNS → Cloudflare Workers.
**Acceptance Criteria**:
- [ ] Domain `localgenius.site` registered
- [ ] DNS wildcard configured
- [ ] Slug validation: alphanumeric + hyphens, 3-50 chars
- [ ] Slug uniqueness in D1
- [ ] SSL auto-issued

---

### REQ-030: Image Optimization Pipeline
**Source**: Decision 6, Risk R7
**Priority**: MUST HAVE
**Category**: Provisioning
**Description**: Images optimized before serving. Sharp-wasm or Cloudflare Image Resizing. Original in R2, optimized served.
**Acceptance Criteria**:
- [ ] `src/services/image-optimizer.ts`
- [ ] Resize to 320px, 640px, 1280px
- [ ] WebP with JPEG fallback
- [ ] PageSpeed not degraded by images

---

### REQ-031: Pre-Rendered Output (Emdash as Build System)
**Source**: Decision 3
**Priority**: MUST HAVE
**Category**: Provisioning
**Description**: Emdash generates HTML at provision/update time. Edge-cached. No SSR at request time.
**Acceptance Criteria**:
- [ ] Static HTML on provision
- [ ] R2 + edge cache storage
- [ ] MCP write triggers cache invalidation
- [ ] No runtime SSR

---

## CONTENT MANAGEMENT & UPDATES

### REQ-032: Verification Screen
**Source**: Decision 7
**Priority**: MUST HAVE
**Category**: Content Management
**Description**: Before Reveal, user confirms/corrects 5 fact cards.
**Acceptance Criteria**:
- [ ] Verification screen after onboarding
- [ ] 5 cards: name, description, hours, phone, address
- [ ] Inline edit each card
- [ ] Confirm button triggers Reveal
- [ ] Facts written to D1

---

### REQ-033: MCP Bridge for Content Updates
**Source**: Decision 1, File Structure
**Priority**: MUST HAVE
**Category**: Content Management
**Description**: `src/services/emdash-mcp.ts` implements MCP bridge for content CRUD.
**Acceptance Criteria**:
- [ ] MCP client sends updates to server
- [ ] MCP server on Cloudflare Worker
- [ ] Operations: name, description, hours, photos, menu, services
- [ ] Retry logic on errors

---

### REQ-034: User-Initiated Updates via Chat
**Source**: Decision 8, MVP Feature
**Priority**: MUST HAVE
**Category**: Content Management
**Description**: User requests updates via chat. AI interprets and modifies via MCP.
**Acceptance Criteria**:
- [ ] Chat accepts update requests
- [ ] AI parses intent
- [ ] Content validated against schema
- [ ] MCP sends update
- [ ] Confirmation: "I updated X because Y"

---

### REQ-035: Review Sync (Top 5 Google Reviews)
**Source**: MVP Feature
**Priority**: MUST HAVE
**Category**: Content Management
**Description**: Top 5 Google reviews pushed via MCP every 6 hours.
**Acceptance Criteria**:
- [ ] GBP API integration
- [ ] Fetch top 5 reviews
- [ ] Push via MCP every 6 hours
- [ ] Reviews in D1, rendered in template

---

### REQ-036: Optional Monthly Updates (Opt-In)
**Source**: Decision 18
**Priority**: NICE TO HAVE
**Category**: Content Management
**Description**: Optional monthly AI suggestions. Opt-in, default OFF. User approves/rejects.
**Acceptance Criteria**:
- [ ] Feature flag: default false
- [ ] User setting to enable
- [ ] AI suggests conversationally
- [ ] User approves before execution

---

## PERFORMANCE & QUALITY

### REQ-037: 95+ PageSpeed for Both Templates
**Source**: Decision 15
**Priority**: MUST HAVE
**Category**: Performance
**Description**: Both templates 95+ on PageSpeed Insights (desktop and mobile).
**Acceptance Criteria**:
- [ ] Restaurant: 95+ desktop, 95+ mobile
- [ ] Services: 95+ desktop, 95+ mobile
- [ ] CSS critical-path inlined
- [ ] Fonts subsetted and inlined
- [ ] Images optimized

---

### REQ-038: SSR <20ms Pass Threshold
**Source**: Decision 11
**Priority**: MUST HAVE
**Category**: Performance
**Description**: Emdash SSR P99 <20ms to pass audit.
**Acceptance Criteria**:
- [ ] P99 <20ms = pass
- [ ] 20-28ms = acceptable with caching
- [ ] >28ms = fail, use static

---

### REQ-039: MCP Audit >95% Success
**Source**: Open Questions #5
**Priority**: MUST HAVE
**Category**: Performance
**Description**: MCP operations >95% success rate.
**Acceptance Criteria**:
- [ ] Test 100 MCP operations
- [ ] Audit on Day 14
- [ ] >95% passes audit

---

### REQ-040: Site Load <3 Seconds
**Source**: Implied by PageSpeed
**Priority**: MUST HAVE
**Category**: Performance
**Description**: All sites load <3 seconds on 4G.
**Acceptance Criteria**:
- [ ] Lighthouse: <3 second load on 4G
- [ ] Both templates verified
- [ ] Synthetic monitoring

---

## GROWTH & MONETIZATION

### REQ-041: "Made with LocalGenius" Footer
**Source**: Decision 13, MVP Feature
**Priority**: MUST HAVE
**Category**: Growth
**Description**: Footer: "Made with LocalGenius" linking to `localgenius.company/sites?ref={slug}`.
**Acceptance Criteria**:
- [ ] Footer text: "Made with LocalGenius"
- [ ] Link: `localgenius.company/sites?ref={slug}`
- [ ] Referral tracking
- [ ] Both templates include footer

---

### REQ-042: Growth Targets
**Source**: PRD metrics
**Priority**: MUST HAVE
**Category**: Growth
**Description**: 50 sites Day 30, 500 sites Day 60.
**Acceptance Criteria**:
- [ ] Dashboard metric: cumulative sites
- [ ] Day 30: ≥50 live sites
- [ ] Day 60: ≥500 live sites

---

### REQ-043: MCP Updates ≥2/month
**Source**: PRD metrics
**Priority**: SHOULD HAVE
**Category**: Growth
**Description**: Engaged users average ≥2 MCP updates/month.
**Acceptance Criteria**:
- [ ] Track MCP updates per site
- [ ] Target: ≥2/month average

---

### REQ-044: Pro Tier Conversion >20%
**Source**: PRD metrics
**Priority**: SHOULD HAVE
**Category**: Growth
**Description**: >20% convert to Pro tier ($79 custom domains).
**Acceptance Criteria**:
- [ ] Track Pro conversion rate
- [ ] Target: >20%

---

### REQ-045: MCP Story Filmed Day 30
**Source**: Timeline, MVP Feature
**Priority**: MUST HAVE
**Category**: Growth
**Description**: First MCP update story filmed by Day 30.
**Acceptance Criteria**:
- [ ] Script written Day 25-26
- [ ] Filming Day 27-28
- [ ] Publication Day 30
- [ ] MCP bridge stable for filming

---

## DESIGN & BRAND

### REQ-046: Reveal Moment Design
**Source**: Decision 14
**Priority**: MUST HAVE
**Category**: Design
**Description**: Device frame with live site. URL bar shows subdomain. "Your site is live." No confetti.
**Acceptance Criteria**:
- [ ] Component: `RevealFrame.tsx`
- [ ] Device frame mockup
- [ ] URL bar with actual subdomain
- [ ] Text: "Your site is live"
- [ ] No excessive animation

---

### REQ-047: Build Progress Animation
**Source**: File Structure
**Priority**: MUST HAVE
**Category**: Design
**Description**: Progress states during generation: "Building something beautiful..."
**Acceptance Criteria**:
- [ ] Component: `BuildProgress.tsx`
- [ ] Multiple progress states
- [ ] Smooth animation
- [ ] Conveys craftsmanship

---

### REQ-048: Product Naming
**Source**: Decision 19
**Priority**: MUST HAVE
**Category**: Brand
**Description**: "LocalGenius Sites" in code, "Presence" in marketing. Re-evaluate at 1K users.
**Acceptance Criteria**:
- [ ] Code: `localgenius-sites`
- [ ] Marketing: "Presence"
- [ ] Footer: "Made with LocalGenius"

---

### REQ-049: Mobile-First Design
**Source**: Decision 4
**Priority**: MUST HAVE
**Category**: Design
**Description**: Templates designed mobile-first. 95+ PageSpeed on mobile.
**Acceptance Criteria**:
- [ ] Design for 320px+ first
- [ ] Desktop as enhancement
- [ ] Responsive images
- [ ] Touch-friendly buttons (48px min)

---

### REQ-050: Photo Treatment System
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Design
**Description**: Photo gallery, hero optimization, aspect ratios, lazy loading.
**Acceptance Criteria**:
- [ ] Gallery component
- [ ] Hero image optimization
- [ ] Consistent aspect ratios
- [ ] Lazy loading below fold

---

### REQ-051: Restaurant Portable Text Schema
**Source**: Open Questions #6
**Priority**: MUST HAVE
**Category**: Design
**Description**: Schema for restaurant content types.
**Acceptance Criteria**:
- [ ] File: `emdash-fork/templates/restaurant/schema.ts`
- [ ] Types: menuItem, section, restaurantInfo, hours
- [ ] Validation rules

---

### REQ-052: Services Portable Text Schema
**Source**: Open Questions #6
**Priority**: MUST HAVE
**Category**: Design
**Description**: Schema for services content types.
**Acceptance Criteria**:
- [ ] File: `emdash-fork/templates/services/schema.ts`
- [ ] Types: service, serviceCategory, availability
- [ ] Validation rules

---

### REQ-053: Typography System
**Source**: Implied by PageSpeed
**Priority**: MUST HAVE
**Category**: Design
**Description**: Subset fonts (Latin), inlined at build time.
**Acceptance Criteria**:
- [ ] Max 2 fonts per template
- [ ] Latin subset only
- [ ] Inlined in critical CSS

---

### REQ-054: Color System
**Source**: Implied by Design
**Priority**: MUST HAVE
**Category**: Design
**Description**: Color palette with WCAG AA contrast.
**Acceptance Criteria**:
- [ ] 4-5 color palette
- [ ] Contrast ≥4.5:1
- [ ] No user color customization

---

### REQ-055: Brand Voice
**Source**: Round 2 debates
**Priority**: MUST HAVE
**Category**: Brand
**Description**: Confident, direct, specific. No jargon. First-person for AI updates.
**Acceptance Criteria**:
- [ ] Copy style guide
- [ ] Specific success messages
- [ ] AI uses "I updated..."

---

## TIMELINE & DELIVERY

### REQ-056: Six-Week Timeline
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Ship in 6 weeks. Kickoff April 14, Ship May 26.
**Acceptance Criteria**:
- [ ] Week 1-2: Templates + provisioning
- [ ] Week 3-4: MCP + DNS automation
- [ ] Week 5-6: Integration + deploy
- [ ] Day 30: MCP story filmed

---

### REQ-057: Week 1-2 Milestones
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Steve: wireframes, design system. Elon: static pipeline, Emdash audit.
**Acceptance Criteria**:
- [ ] Mobile-first wireframes
- [ ] Design system (colors, typography)
- [ ] Static pipeline functional
- [ ] Emdash audit started

---

### REQ-058: Week 2-3 Milestones
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Steve: templates in Astro. Elon: MCP bridge, schema validation.
**Acceptance Criteria**:
- [ ] Restaurant template coded
- [ ] Services template coded
- [ ] `emdash-mcp.ts` implemented
- [ ] Portable Text validation complete

---

### REQ-059: Week 3-4 Milestones
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Day 14 decision. DNS automation. Reveal flow design.
**Acceptance Criteria**:
- [ ] Day 14 decision documented
- [ ] DNS wildcard automation
- [ ] Reveal frame component
- [ ] Build progress animation

---

### REQ-060: Week 4-5 Milestones
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: 10-user review. PageSpeed optimization. Load testing.
**Acceptance Criteria**:
- [ ] 10-user design review
- [ ] Both templates 95+ PageSpeed
- [ ] Load test: >100 concurrent provisions
- [ ] Monitoring configured

---

### REQ-061: Week 5-6 Milestones
**Source**: Timeline
**Priority**: MUST HAVE
**Category**: Project Management
**Description**: Production deploy. MCP story filmed. Pro tier prep.
**Acceptance Criteria**:
- [ ] Production deploy complete
- [ ] MCP story filmed Day 30
- [ ] Custom domain infrastructure ready (not shipped)

---

## RISK REGISTER

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| R1 | Emdash SSR >28ms | HIGH | Fallback to static. Benchmark Day 1-2. |
| R2 | Emdash audit <95% | MEDIUM | Static fallback. Audit by Day 14. |
| R3 | MCP spec drift | LOW | Pin MCP version. Quarterly audit. |
| R4 | AI Portable Text quality | MEDIUM | Schema validation. Retry on failure. |
| R5 | Cloudflare API rate limits | MEDIUM | Async queue. Exponential backoff. Circuit breaker. |
| R6 | Customer expectation gap | MEDIUM | Clear messaging. "I updated X because Y." |
| R7 | Image degrades PageSpeed | MEDIUM | Image pipeline P0. Test PageSpeed before ship. |
| R8 | No GBP data (30% users) | HIGH | Conversational fallback. Ship with available data. |
| R9 | Reveal >5 seconds | LOW | Static preview decoupled. Preload iframe. |
| R10 | D1 at 50K tenants | LOW | Parameterize accountId now. Federation at 10K. |

---

## OPEN QUESTIONS

| # | Question | Status | Resolution |
|---|----------|--------|------------|
| 1 | Subdomain strategy | RESOLVED | `{slug}.localgenius.site` |
| 2 | Monthly AI updates | RESOLVED | Opt-in, default OFF |
| 3 | Product naming | RESOLVED | "LocalGenius Sites" code, "Presence" marketing |
| 4 | Emdash SSR benchmark | Day 14 | Benchmark measurement required |
| 5 | Emdash MCP audit | Day 14 | >95% success required |
| 6 | Portable Text schema | Day 3 | Define during template design |
| 7 | Domain purchase | Day 3 | Research `lg.site` availability |

---

## CUT FROM v1

| Feature | Reason |
|---------|--------|
| Custom domains | Pro tier, Month 2 |
| Analytics dashboard | Google Analytics embed sufficient |
| Theme/color pickers | Zero customization philosophy |
| Font dropdowns | Zero customization philosophy |
| Template browsing | AI selects silently |
| Advanced settings | Scope creep |
| CMS admin panel | Conversational only |

---

**Document Version**: 1.0
**Last Updated**: 2026-04-14
**Total Requirements**: 65
**Priority Split**: 53 MUST HAVE, 6 SHOULD HAVE, 6 NICE TO HAVE
