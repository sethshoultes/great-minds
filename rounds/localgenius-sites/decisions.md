# LocalGenius Sites (Presence) — Final Decisions Blueprint

**Compiled by**: Phil Jackson, Orchestrator
**Date**: 2026-04-14
**Status**: LOCKED FOR BUILD PHASE
**Ship Date**: 6 weeks from kickoff

---

## Executive Summary

This document consolidates all locked decisions from the Steve Jobs (Design) vs. Elon Musk (Engineering) debate rounds. These decisions are final. The build phase begins now.

**Core Thesis (Unanimous)**: The website is not the product. The feeling is the product. We're selling legitimacy to businesses who have never felt legitimate online.

---

## Section 1: Locked Decisions

### Decision 1: Parallel Build Strategy
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Joint (Steve's framing, Elon's execution) |
| **Decision** | Pipeline + Emdash audit run simultaneously. No blocking dependencies. |
| **Rationale** | Edge Infrastructure Engineer builds provisioning pipeline targeting static HTML initially. MCP Lead runs Emdash audit in parallel. Day 14 decision point: swap to Emdash if audit passes, keep static if it fails. Pipeline architecture is identical either way — only deployment target changes. |
| **Why it won** | Eliminates 2-week blocking dependency while maintaining audit rigor. |

---

### Decision 2: Multi-Tenant Architecture
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk |
| **Decision** | One D1 database. One R2 bucket. All tenants partitioned by `site_id`. |
| **Rationale** | Per-business D1/R2 isolation is over-engineered. Single database = one deployment, one migration path, one monitoring dashboard. At 50K sites, debugging one well-indexed database beats debugging 50K separate databases. |
| **Why it won** | Steve conceded: "elegant in theory, nightmare in practice." Operational sanity trumps theoretical isolation. |

---

### Decision 3: Pre-Rendered Static Output
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Joint |
| **Decision** | Emdash generates HTML at provision/update time. Edge-cached. No SSR at request time. Cache invalidation on MCP write. |
| **Rationale** | Workers have 30ms CPU ceiling. Emdash SSR risks 524 errors at scale. Local business sites change twice a month — pre-rendering is the right model. "Emdash as build system, not runtime." |
| **Why it won** | Eliminates entire SSR performance risk. Steve agreed: "His framing is right." |

---

### Decision 4: Two Templates at Launch
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs |
| **Decision** | Exactly 2 templates. Restaurant vertical + Services vertical. Both genuinely beautiful. |
| **Rationale** | A menu (list of items with prices/photos) and a service list (descriptions with booking CTAs) have fundamentally different information architecture. Cannot share a template. |
| **Why it won** | Elon conceded: "They can't [share a template]... Steve is right." |

---

### Decision 5: AI Template Selection (No User Choice)
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs |
| **Decision** | Zero template picker. AI selects template based on business vertical. User never sees "Template A vs Template B." |
| **Rationale** | Every choice is a moment of doubt. A plumber choosing between templates "isn't exercising agency — he's wondering which one won't make him look stupid." We absorb the complexity. |
| **Why it won** | Core to the zero-customization philosophy. "We ship the decision. They ship their business." |

---

### Decision 6: Four Inputs + Auto-Enrichment
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Joint (Steve's count, Elon's enrichment) |
| **Winner** | Joint |
| **Decision** | 4 inputs during onboarding, not 7 questions. AI enriches from Google/Yelp. |
| **Inputs** | 1. Business name (already captured), 2. Photos (already captured), 3. One-sentence description ("What do you do?"), 4. Hours confirmation |
| **Fallback** | For businesses with no GBP data, AI asks follow-up questions conversationally in the chat thread — not as form fields. |
| **Why it won** | Steve: "7 questions feels like a form." Elon: "4 inputs may produce generic output." Solution: inputs for speed, enrichment for quality. |

---

### Decision 7: Editable Fact Cards for Verification
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs |
| **Decision** | Verification screen shows 5 editable fact cards (name, description, hours, phone, address). Inline editing. No chat round-trip for corrections. |
| **Rationale** | "Fix something" is too vague at the critical moment. Maria needs to *point* at what's wrong, not *describe* it. Editing facts (not design) preserves zero-CMS principle. |
| **Why it won** | Faster and more precise than chat-based corrections. Maintains emotional momentum of reveal. |

---

### Decision 8: Instant Preview + Deferred Provisioning
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (concept) + Elon Musk (Option A parallel provisioning) |
| **Winner** | Joint |
| **Decision** | Generate static HTML preview in <5 seconds for the Reveal. Full Emdash provisioning runs in background. Hot-swap when ready. |
| **Flow** | 1. Onboarding complete → 2. Static preview renders instantly (Reveal moment) → 3. User sees live preview → 4. Background: D1/R2/Worker/DNS provisioning → 5. When complete, static swaps to Emdash silently → 6. If provisioning fails, static stays live, retry in background |
| **Why it won** | Creates the magic Steve wants (instant reveal) while maintaining engineering reliability (full pipeline runs unblocked). |

---

### Decision 9: Fork Emdash from Day 1
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (extended Elon's mitigation) |
| **Winner** | Joint |
| **Decision** | We own the Emdash fork. Contribute upstream when appropriate. Do not depend on external release cycles. |
| **Rationale** | We are Emdash's most demanding user. Our templates, our Portable Text schemas, our SSR optimizations, our Worker bindings. Own the fork = own the quality. |
| **Why it won** | Eliminates single-point-of-failure risk while preserving open-source benefits. |

---

### Decision 10: Short Subdomain
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Contested — requires resolution |
| **Decision** | Purchase `lg.site` or equivalent. Ship `{slug}.lg.site` for shareability. |
| **Counter-position** | Elon's Round 2 (detailed file) rejects this: "`localgenius.site` is ours, already registered. Every share of the URL is brand marketing. URL length drives Pro upsell. Don't solve Pro problem at Base tier." |
| **Status** | **REQUIRES FINAL CALL** — see Open Questions |

---

### Decision 11: SSR Benchmark Bar
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (defined the bar) |
| **Winner** | Joint |
| **Decision** | Pass: <20ms SSR. Acceptable: 20-28ms (needs caching). Fail: >28ms. |
| **Rationale** | Must define pass/fail before audit runs. "If we don't define this now, we'll spend another week arguing about what it means." |
| **Measurement** | 5-page site on D1, P99 render time. |

---

### Decision 12: Custom Domains = Pro Tier
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Joint |
| **Winner** | Joint |
| **Decision** | Custom domains are $79 Pro tier feature only. 1-tap UX for users. Cloudflare for SaaS handles SSL/DNS. |
| **Cost** | $2/month per custom hostname (absorbed into $79 margin = 97% margin). |
| **UX** | User types domain → we handle everything → notification when live ("usually takes about an hour"). |

---

### Decision 13: "Made with LocalGenius" Footer
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Joint (Steve's copy, Elon's growth extension) |
| **Decision** | Footer reads "Made with LocalGenius" (not "Powered by"). Links to `localgenius.company/sites?ref={slug}`. |
| **Rationale** | "Made with" implies craft. "Powered by" is commodity language. The link closes the viral loop — competitor sees footer → clicks → lands on conversion page with referral tracking. |

---

### Decision 14: Reveal Moment Design
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs |
| **Decision** | Live site in device frame. URL bar shows real subdomain. Text below: "Your site is live." No confetti. Restraint is the design. |
| **Technical** | Elon preloads iframe during provisioning. Perceived speed > actual speed. |
| **Why it won** | "The gasp is mandatory. If they don't gasp, we failed." Elon concedes the content creates the magic. |

---

### Decision 15: 95+ PageSpeed or Don't Ship
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Joint |
| **Decision** | Both templates must score 95+ on PageSpeed Insights before entering production pool. Design requirement, not just engineering target. |
| **Dependencies** | Image optimization pipeline (sharp-wasm or Cloudflare Image Resizing) on Day 1. Font subsetting (critical Latin subset inlined). |

---

### Decision 16: MCP Transport = HTTP
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk |
| **Decision** | MCP uses streamable HTTP transport (stateless POST). No WebSockets. No SSE for content CRUD. |
| **Rationale** | Workers handle HTTP natively. MCP server runs as Worker, MCP client runs in Vercel API route. Standard HTTP between clouds. |

---

### Decision 17: D1 Federation Strategy
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk |
| **Decision** | Parameterize `cloudflareAccountId` now. Build federation later. |
| **Rationale** | 30 minutes of architecture investment. No premature optimization. Actual federation (Terraform, routing table) is Phase 2 at 10K+ sites. |

---

### Decision 18: Monthly AI Updates
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Contested |
| **Steve's position** | AI-initiated monthly updates with first-person notification: "I noticed spring menu season... I updated your site." |
| **Elon's position** | No autonomous AI updates. User-initiated only. "AI pushing changes nobody requested is a support nightmare." |
| **Status** | **REQUIRES FINAL CALL** — see Open Questions |

---

### Decision 19: Product Naming
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Steve's position** | Call it "Presence." One word. Brand, not feature. |
| **Elon's position** | Ship under "LocalGenius Sites." Rename after 1,000 users prove they care. |
| **Status** | **REQUIRES FINAL CALL** — see Open Questions |

---

## Section 2: MVP Feature Set (What Ships in v1)

### Included (P0)
| Feature | Owner | Notes |
|---------|-------|-------|
| Provisioning pipeline (static HTML → Emdash hot-swap) | Elon | State machine in Neon, Cloudflare resources as derived state |
| 2 templates (restaurant + services) | Steve | Mobile-first, opinionated IA, 95+ PageSpeed |
| 4-input onboarding + auto-enrichment | Joint | Description, photos, hours, name (pre-captured) |
| Editable fact cards verification | Steve | 5 fields with inline edit |
| Instant preview reveal | Steve | <5 second static render, device frame, "Your site is live" |
| Subdomain hosting | Elon | `{slug}.localgenius.site` (or `lg.site` — pending) |
| MCP bridge for content updates | Elon | `src/services/emdash-mcp.ts` |
| User-initiated content updates via chat | Joint | AI updates site when user asks |
| Image optimization pipeline | Elon | Resize/compress on upload, serve optimized from R2 |
| "Made with LocalGenius" footer + referral link | Joint | Growth engine in every site |
| Review sync to site | Elon | Top 5 Google reviews pushed via MCP every 6 hours |

### Explicitly Cut from v1
| Feature | Reason |
|---------|--------|
| Custom domains | Pro tier, ships Month 2 |
| Analytics dashboard | Google Analytics embed is sufficient. No custom analytics. |
| Theme/color pickers | Zero customization philosophy |
| Font dropdowns | Zero customization philosophy |
| Template browsing | AI selects silently |
| Advanced settings | Scope creep |
| CMS admin panel | Zero CMS exposure — conversational only |

---

## Section 3: File Structure (What Gets Built)

```
localgenius/
├── src/
│   ├── services/
│   │   ├── emdash-mcp.ts              # MCP bridge to Emdash instances
│   │   ├── provisioning-queue.ts       # Async job processor for site creation
│   │   └── image-optimizer.ts          # Sharp-wasm resize/compress pipeline
│   │
│   ├── workers/
│   │   └── site-router/                # Cloudflare Worker for subdomain routing
│   │       ├── index.ts
│   │       └── wrangler.toml
│   │
│   ├── components/
│   │   ├── site-reveal/                # Reveal moment UI
│   │   │   ├── RevealFrame.tsx         # Device frame with live site iframe
│   │   │   ├── BuildProgress.tsx       # "Building something beautiful..." states
│   │   │   └── VerificationCards.tsx   # 5 editable fact cards
│   │   │
│   │   └── site-preview/               # Static preview generator
│   │       └── PreviewGenerator.ts     # <5 second static HTML render
│   │
│   └── lib/
│       ├── portable-text-schema.ts     # Schema validation for AI-generated content
│       └── cloudflare-api.ts           # D1/R2/Worker/DNS provisioning wrappers
│
├── emdash-fork/                        # Our fork of Emdash
│   ├── templates/
│   │   ├── restaurant/                 # Restaurant vertical template
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── schema.ts               # Portable Text schema (menu, hours, etc.)
│   │   │
│   │   └── services/                   # Services vertical template
│   │       ├── pages/
│   │       ├── components/
│   │       └── schema.ts               # Portable Text schema (services, booking, etc.)
│   │
│   ├── mcp-server/                     # MCP server Worker
│   │   └── index.ts
│   │
│   └── astro.config.ts                 # Cloudflare adapter config
│
├── database/
│   └── migrations/
│       ├── site_provisions.sql         # State machine table in Neon
│       └── multi_tenant_sites.sql      # D1 schema (partitioned by site_id)
│
└── scripts/
    ├── provision-site.ts               # CLI for manual provisioning
    ├── benchmark-ssr.ts                # Emdash SSR benchmark tool
    └── seed-content.ts                 # AI content generation for testing
```

---

## Section 4: Open Questions (Require Resolution Before Build)

| # | Question | Options | Recommendation | Decision Owner | Deadline |
|---|----------|---------|----------------|----------------|----------|
| 1 | **Subdomain strategy** | A) `{slug}.localgenius.site` (Elon) — brand equity, drives Pro upsell | B) `{slug}.lg.site` (Steve) — shorter, more shareable | Elon's position is stronger: brand compounds, URL length is the Pro upsell trigger | Phil Jackson | Day 1 |
| 2 | **Monthly AI updates** | A) AI-initiated monthly updates (Steve) — proactive freshness, retention driver | B) User-initiated only (Elon) — no support liability, no unwanted changes | Compromise: Opt-in monthly updates. Default OFF. Users enable in settings. | Phil Jackson | Day 1 |
| 3 | **Product naming** | A) "Presence" (Steve) — brand, emotion, one word | B) "LocalGenius Sites" (Elon) — ship first, rename later | Ship as "LocalGenius Sites" in code. Use "Presence" in marketing copy. Re-evaluate at 1K users. | Phil Jackson | Day 1 |
| 4 | **Emdash SSR benchmark** | What is actual P99 render time on D1? | Target: <20ms | N/A — data required | Elon | Day 14 |
| 5 | **Emdash MCP audit** | Does provisioning succeed >95% of the time? | Target: >95% success rate | N/A — data required | Elon | Day 14 |
| 6 | **Portable Text schema** | What fields per vertical? | Define during template design | N/A — design required | Steve + Elon | Day 14 |
| 7 | **Domain purchase** | Is `lg.site` available? Cost? | Check registrar | N/A — requires research | Elon | Day 3 |

---

## Section 5: Risk Register

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|------|------------|--------|------------|-------|
| R1 | **Emdash SSR exceeds 28ms** | Medium | High | Fallback: enhanced static generation. Pre-rendering eliminates SSR at runtime. If even build-time generation is slow, simplify templates. | Elon |
| R2 | **Emdash fork maintenance burden** | Medium | Medium | Emdash is simple (Astro + D1 + R2). We chose it because it's small enough to maintain ourselves. Budget 2-4 hours/month for upstream sync. | Elon |
| R3 | **MCP spec drift** | Low | High | Pin MCP protocol version. Integration test bridge on every deploy. Monitor Anthropic announcements. | Elon |
| R4 | **AI-generated Portable Text quality** | Medium | Medium | Schema validation before D1 write. Reject malformed content, retry with corrected prompt. Log failures for prompt improvement. | Elon |
| R5 | **Cloudflare API rate limits during provisioning surges** | Low | Medium | Async queue with exponential backoff and circuit breaking. Provisioning is not user-blocking (instant preview handles UX). | Elon |
| R6 | **Customer expectation gap ("AI-managed")** | Medium | High | Never claim AI did something it didn't. First-person, specific notifications: "I updated X because Y." If update fails, don't pretend it succeeded. | Steve |
| R7 | **Image upload degrades PageSpeed** | Medium | Medium | Image optimization pipeline is P0, not nice-to-have. Sharp-wasm resize on upload. Original in R2, optimized served. | Elon |
| R8 | **No GBP data for 30% of users** | High | Low | Graceful fallback: AI asks conversational follow-ups. Site ships with available data, improves over time. | Joint |
| R9 | **Reveal moment feels slow (>5 seconds)** | Low | High | Parallel provisioning (Option A). Start pipeline during onboarding Step 3. By reveal, site is 80% built. Static preview is instant. | Elon |
| R10 | **D1 at 50K tenants** | Low (distant) | Medium | Monitor query latency. Parameterize `cloudflareAccountId` now. Build federation at 10K. | Elon |

---

## Section 6: Timeline

| Week | Steve (Design) | Elon (Engineering) |
|------|----------------|-------------------|
| 1-2 | Template wireframes, mobile-first design system, photo treatment system | Provisioning pipeline (static HTML target), Emdash audit, domain purchase research |
| 2-3 | Template buildout in Astro, verification card design | MCP bridge (`emdash-mcp.ts`), Portable Text validation, image pipeline |
| 3-4 | Reveal flow UX, build progress animations | Swap pipeline to Emdash (if audit passes), DNS automation, subdomain routing |
| 4-5 | Integration testing, 10-user design review | Load testing, error recovery, monitoring, review sync cron |
| 5-6 | Polish pass, PageSpeed optimization, footer styling | Production deploy, custom domain prep (Pro tier), MCP film prep |
| **Day 30** | Direct MCP update story film | Ensure MCP bridge works flawlessly for filming |

**Ship Date**: 6 weeks from kickoff

---

## Section 7: Consensus Statement

**What we agree on:**

1. The website is not the product. The feeling is the product.
2. The AI managing the website after creation is the category differentiator.
3. Architecture: Cloudflare (D1 + R2 + Workers) for sites, Vercel/Neon for app, MCP as bridge.
4. Multi-tenant, pre-rendered, zero CMS exposure.
5. 2 templates, 4 inputs, 95+ PageSpeed, fork Emdash, <20ms SSR target.
6. The reveal moment is the entire product. If they don't gasp, we failed.

**What we disagree on (resolved above):**
- Subdomain strategy → `localgenius.site` (Elon wins on brand equity)
- Monthly updates → Opt-in (compromise)
- Naming → "LocalGenius Sites" in code, "Presence" in marketing (compromise)

---

## Signatures

This document represents the locked decisions of the Great Minds Agency debate process. Build phase begins immediately.

*Steve Jobs — Chief Design & Brand Officer*
*Elon Musk — Chief Product & Growth Officer*
*Phil Jackson — Orchestrator*

---

**Build it. Ship it in 6 weeks. Film the MCP story at Day 30.**

*"Your business deserves to exist on the internet. We make it happen while you're still on the phone."*
