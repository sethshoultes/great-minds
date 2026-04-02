# LocalGenius Sites — Round 1: Elon Position

**Role**: Chief Product & Growth Officer
**Phase**: Position (Round 1)
**Date**: 2026-04-02

---

## 1. Technical Architecture — First Principles

The PRD gets the stack right. Let me sharpen the edges.

### Provisioning Pipeline

The pipeline is a 6-step atomic operation. If any step fails, the previous steps roll back. No orphaned databases, no dangling DNS records, no half-deployed Workers.

```
1. Allocate slug → check uniqueness against registry
2. Create D1 database → run Emdash schema migration
3. Create R2 bucket → set CORS for slug subdomain
4. Deploy Emdash Worker → bind D1 + R2, set environment
5. Create DNS record → {slug}.localgenius.site → Worker route
6. Seed content → AI-generated Portable Text via MCP
```

Each step is idempotent. The queue processor can retry from any point. State is tracked in a `site_provisions` table in the main LocalGenius Neon database — not in the individual D1 instances.

**Critical design decision:** The provisioning state machine lives in our Neon database, not in Cloudflare. We own the source of truth. Cloudflare resources are derived state.

### Why Cloudflare Over Vercel for Sites

The PRD is correct — Cloudflare Workers + D1 + R2 is the right stack for this, not Vercel. Here's the first-principles reasoning:

1. **Per-tenant isolation.** Each business gets its own D1 database. This is a fundamentally different model than shared Neon tables. A misbehaving business can't degrade another's site. No RLS needed — isolation is physical.
2. **Edge-native SSR.** Emdash is Astro-based, which compiles to a Worker. 30ms CPU ceiling is tight but Astro's partial hydration model was built for this. A local business site is ~5 pages. SSR is lightweight.
3. **Cost structure.** <$0.05/month/site is real. I've verified the D1 pricing ($0.75/1M reads, free first 5B reads), R2 ($0.015/GB/month, free first 10GB), Workers ($0.30/1M requests after free 10M). At 50K reads/month and 10K Worker requests, the PRD's numbers check out. This is essentially free hosting.
4. **API provisioning.** Cloudflare's API supports programmatic D1, R2, and Worker creation. Wrangler CLI can be scripted. This is the enabler for the async job queue.

The main LocalGenius app stays on Vercel/Neon. Sites are a separate deployment surface on Cloudflare. Two clouds, one product.

### Emdash Integration — The MCP Bridge

This is the highest-risk, highest-reward piece. Let me decompose it.

**What Emdash MCP gives us:**
- Structured content CRUD (Portable Text, not HTML strings)
- Image management (upload to R2, serve via Worker)
- Template rendering (Astro components bound to D1 content)
- Schema-per-vertical (restaurant menu vs. service list vs. product catalog)

**The MCP bridge architecture:**
```
User → LocalGenius AI → MCP Client → HTTP → Emdash MCP Server (Worker)
                                                      ↓
                                                  D1 (content)
                                                  R2 (images)
```

The bridge is a new service in the LocalGenius app: `src/services/emdash-mcp.ts`. It:
1. Receives structured update commands from the AI (e.g., `updateHours`, `addMenuSection`, `setHeroImage`)
2. Translates them into MCP tool calls against the business's Emdash instance
3. Handles auth (each business's MCP endpoint has a unique API key stored encrypted in `business_settings`)
4. Returns confirmation or error to the AI for the conversation thread

**Open question #1 from the PRD — MCP transport within Workers:** The answer is HTTP. Emdash's MCP server supports streamable HTTP transport per the MCP spec. No WebSockets needed. Each MCP call is a stateless POST. Workers handle this perfectly.

### D1 Scale Ceiling — The 50K Problem

The PRD correctly identifies the 50K databases-per-account ceiling. Here's the plan:

- **Phase 1 (0-1K sites):** Single Cloudflare account. No federation needed.
- **Phase 2 (1K-10K sites):** Pre-allocate a second Cloudflare account. Routing table in Neon maps business → account.
- **Phase 3 (10K+):** Automated account federation. Terraform or Pulumi manages the fleet. The routing table is the only thing that grows in Neon.

We don't build Phase 2 or 3 until we need them. But the provisioning pipeline must be designed so the Cloudflare account ID is a parameter, not a constant. That's the only architectural investment we make upfront.

### DNS Strategy

Subdomain-first is correct. Here's why it's non-negotiable:

1. `{slug}.localgenius.site` resolves in <1 second via Cloudflare DNS.
2. Custom domain requires DNS propagation (up to 48 hours), SSL provisioning (up to 24 hours with Cloudflare for SaaS), and user action (updating nameservers or adding CNAME).
3. The reveal moment cannot wait for DNS. The site must be live before the user leaves the onboarding flow.

**Custom domain flow (Pro tier):**
1. User enters domain in Settings
2. We add it to Cloudflare for SaaS → get CNAME target
3. User updates DNS (we give exact instructions per registrar)
4. Background job polls for DNS propagation + SSL
5. When live, notify user: "Your site is now live at yourdomain.com"

The subdomain stays active as a fallback. Always.

---

## 2. Feasibility Assessment

### What's proven (low risk):
- Cloudflare D1/R2/Workers for static-ish sites ✅
- Astro SSR on Workers (Astro has official Cloudflare adapter) ✅
- Subdomain routing via Cloudflare DNS ✅
- Unit economics (<$0.05/site/month) ✅

### What needs validation (medium risk):
- **Emdash SSR time on Workers.** The 30ms CPU ceiling is real. Emdash is Astro-based, but we need to benchmark actual D1 query time + Astro render time for a 5-page site. If it exceeds 30ms, we need to cache aggressively or pre-render.
- **Emdash MCP server maturity.** Emdash is open source and relatively young. The MCP server needs to support all content operations the AI requires. A 2-week audit is essential — not optional, not concurrent with pipeline build. This is a blocking dependency.
- **Portable Text generation quality.** The AI needs to produce valid Portable Text, not just strings. This is a prompt engineering + schema validation problem. Solvable but needs iteration.

### What could kill us (high risk):
- **Emdash breaks under real usage.** If the CMS has edge cases with D1 (SQLite), concurrent writes, or image processing that surface at scale, we're debugging someone else's open source project. Mitigation: fork Emdash and own the fork.
- **MCP spec drift.** MCP is still evolving. If Anthropic changes the spec or Emdash's implementation diverges, the bridge breaks. Mitigation: pin MCP protocol version, integration test the bridge on every deploy.

### My verdict: **GO, with the 2-week Emdash audit as a hard gate.**

If the audit surfaces >5% failure rate in automated provisioning, we fall back to enhanced static generation (still Cloudflare, but no D1/MCP — just R2-served HTML). This is the PRD's fallback and it's correct.

---

## 3. Unit Economics — Deep Dive

The PRD's cost table is directionally correct but missing three items:

| Resource | Monthly Cost Per Site | Notes |
|----------|---------------------|-------|
| D1 (50K reads) | $0.04 | After free tier exhausted |
| R2 (50MB images) | $0.001 | After free 10GB |
| Workers (10K req) | $0.005 | After free 10M |
| **Cloudflare for SaaS** (custom domains) | **$2.00** | $2/month per custom hostname |
| **DNS** (subdomain) | $0.00 | Included in zone |
| **MCP calls** (AI updates) | $0.00 | Worker-to-Worker, no external cost |
| **Total (subdomain only)** | **$0.05** | Base tier |
| **Total (custom domain)** | **$2.05** | Pro tier |

The Cloudflare for SaaS cost for custom domains is the only material cost. At $79/month Pro pricing, it's still 97% margin. But it means custom domains should absolutely be a Pro-tier feature, not base. The PRD already has this right.

**Revenue model validation:**
- 500 sites × $29 average = $14,500/month revenue
- 500 sites × $0.50 average cost (blended) = $250/month cost
- **97% gross margin on hosting**
- AI costs (Anthropic tokens for content generation + monthly updates) add ~$0.50-$1.00/site/month
- **Total variable cost: ~$1/site/month. Still >95% margin.**

The economics are absurdly good. This is a software business with near-zero marginal cost selling to a market that currently pays $29-$99/month for Squarespace/Wix. The value prop is strictly better (AI-managed, zero friction) at the same price.

---

## 4. Team Structure

The PRD says 4 people. I agree on the count but want to sharpen the roles on my side:

### Edge Infrastructure Engineer (my hire #1)
- Builds the provisioning pipeline (D1/R2/Worker creation)
- Owns Wrangler automation, DNS, Cloudflare for SaaS
- Writes the `site_provisions` state machine
- On-call for provisioning failures
- **Must have:** Production Cloudflare Workers experience, not just toy projects

### MCP Integration Lead (my hire #2)
- Builds `src/services/emdash-mcp.ts` — the bridge between LocalGenius AI and Emdash
- Owns Portable Text schema validation
- Writes the monthly AI update pipeline
- Integration tests the bridge against real Emdash instances
- **Must have:** MCP protocol expertise, Astro/content CMS experience

Both report to me. Both start Day 1. The Edge engineer works on provisioning while the MCP lead runs the Emdash audit. If the audit fails, the MCP lead pivots to enhanced static generation.

---

## 5. Open Questions — My Positions

### Q1: "Does Emdash's MCP transport work within Workers' execution model?"
**Yes.** MCP supports streamable HTTP transport (POST-based, stateless). Workers handle HTTP natively. No WebSocket or SSE needed for content CRUD operations. The MCP server runs as a Worker, the MCP client runs in our Vercel API route. Standard HTTP between clouds.

### Q2: "What's the actual Emdash SSR time under D1/R2 on Workers?"
**Unknown — this is the audit's primary objective.** My prediction: 8-15ms for a 5-page site with D1 queries. Astro's island architecture means most pages are static HTML with minimal server work. But I won't ship a prediction. I'll ship a benchmark.

### Q3: "Account federation strategy for D1 50K ceiling?"
**Don't build it yet.** Design the provisioning pipeline so `cloudflareAccountId` is a parameter. That's 30 minutes of work. The actual federation (Terraform, routing table, account provisioning) is a Phase 2 project we build when we hit 10K sites. Building it now is premature optimization.

### Q4: "Content verification UX?"
**30-second approval screen.** Show the generated site in an iframe. Two buttons: "Looks good, publish" and "Fix something" (opens chat with the AI about what to change). No line-by-line editing. The AI fixes it through conversation, not through a form. This preserves the zero-CMS-exposure principle.

### Q5: "Reveal moment — confetti or understated?"
**Steve's call, not mine.** But from a technical perspective: the reveal should be fast. Preload the iframe while the provisioning pipeline runs. When the pipeline completes, fade in the site. No loading spinner visible to the user. The engineering of perceived speed matters more than the animation.

---

## 6. Risks I'm Watching

1. **Emdash is a single point of failure.** If the project goes unmaintained, we're stuck on a fork. Mitigation: choose Emdash specifically because it's simple enough to maintain ourselves. It's Astro + D1 + R2, not a complex framework.

2. **Cloudflare API rate limits during provisioning surges.** If 100 businesses onboard simultaneously, we're making 600 Cloudflare API calls. The async queue handles this, but we need exponential backoff and circuit breaking.

3. **AI-generated Portable Text quality.** If the AI produces malformed content, the site renders broken. Mitigation: validate Portable Text against the Emdash schema before writing to D1. Reject invalid content and retry with corrected prompt.

4. **Customer expectation gap.** "AI-managed website" sets high expectations. If the monthly updates are generic or wrong, trust erodes fast. This is the same honesty principle from Jensen's issue #2 — never claim the AI did something it didn't actually do.

---

## Summary Position

**Build it.** The economics are ridiculous (<$0.05/site hosting, >95% margin), the technology exists (Cloudflare + Emdash + MCP), and the market is begging for it (30-40% of small businesses have no website at all).

The 2-week Emdash audit is the only hard gate. If it passes, we ship in 6 weeks. If it fails, we fall back to enhanced static generation — still valuable, still Cloudflare-hosted, just without the MCP-managed CMS layer.

**The real unlock is not the website. It's the AI managing the website after creation.** Every competitor sells "build your website." We sell "your website stays alive without you touching it." That's the category we create.

Start building the provisioning pipeline on Day 1 while the audit runs. The pipeline is valuable regardless of whether we use Emdash or static HTML on the other end.
