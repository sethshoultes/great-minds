# Round 1: Elon's Position — LocalGenius Sites

## Architecture: What's the Simplest System That Could Work?

Kill the per-business D1/R2 isolation. It's over-engineered.

One D1 database. One R2 bucket. All tenants. Partitioned by `site_id`. This is how every real SaaS at scale works. Per-tenant databases are a DevOps nightmare at 10,000 sites and provide zero user benefit.

The simplest architecture: **Multi-tenant Emdash + Workers + single D1 + single R2 + wildcard subdomain routing.** One deployment. One codebase. One database migration path.

Custom domains? Cloudflare for SaaS (SSL for SaaS). Handles it automatically. Don't reinvent DNS management.

## Performance: Bottlenecks and the 10x Path

The bottleneck is **Emdash SSR on D1**. Workers have 30ms CPU ceiling. Emdash is Astro-based. Astro SSR is not designed for 30ms budgets.

Question nobody has answered: What's the P99 render time for an Emdash page hitting D1? If it's >15ms, you're one slow query away from 524 errors at scale.

**10x path:** Pre-render everything. These are local business sites — they change twice a month. Cache invalidation on MCP write, not SSR on every request. Edge-cached HTML, not SSR. Emdash becomes a build system, not a runtime.

## Distribution: 10,000 Users Without Paid Ads

The math: LocalGenius already has users. The PRD says 40-50% are "digital laggard" businesses with no website. If current user base is 25K, that's 10-12K potential Sites customers.

**Distribution = activation, not acquisition.** The feature sells itself during onboarding. "Want us to build you a website right now?" — nobody says no to that.

Viral loop: Every site includes "Powered by LocalGenius" footer link. 10K sites = 10K backlinks. Local business sites get local traffic. Local traffic sees footer. SEO compounds.

**No paid ads needed if you own the funnel already.**

## What to CUT: v2 Features Masquerading as v1

- **Monthly AI-generated updates:** Cut. The AI should update when asked, not autonomously push changes nobody requested. This is feature theater.
- **Advanced analytics:** Cut. Google Analytics embed takes 5 minutes. No custom analytics in v1.
- **Template auto-selection by vertical:** Cut. Let the user pick from 2 templates. AI "selecting" adds complexity, removes user agency, and is one more thing to debug.
- **Content verification UX debate:** Ship it. 30-second review, approve button. Don't overthink this.
- **Confetti on reveal:** Seriously? Ship without. Iterate based on user recordings.

v1 is: Provision site. Populate content. Go live. Accept MCP updates. That's it.

## Technical Feasibility: Can One Agent Session Build This?

No.

One agent session can scaffold the multi-tenant schema, the Workers routing, and the MCP bridge contract. But Emdash integration requires understanding a third-party codebase, and Cloudflare provisioning APIs have edge cases that require iteration.

**Realistic scope for one session:** Multi-tenant D1 schema + subdomain routing + mock MCP endpoint + one hardcoded template. Everything else is integration work requiring human debugging and API key management.

## Scaling: What Breaks at 100x Usage

At 500K requests/month (50 sites doing 10K each), nothing breaks — Cloudflare handles this trivially.

At 50K sites:
- **D1:** Single database with 50K tenant partitions, 2.5B reads/month. This is where D1's beta-ness shows. Monitor query latency.
- **R2:** 2.5TB images (50MB × 50K). Cloudflare handles this. Non-issue.
- **Provisioning queue:** At 500 new sites/day, queue depth matters. But you're not hitting 500/day in year one.

**The real 100x risk is MCP.** Every site update is an LLM call. If 50K sites each make 2 MCP updates/month, that's 100K LLM calls. Cost and latency become real. Rate-limit per-tenant. Queue MCP writes.

---

**Bottom line:** The idea is sound. The economics are absurd (>99% margin). The architecture is over-complicated. Simplify to multi-tenant, pre-render to avoid SSR bottleneck, cut the autonomous update theater, and ship the core loop fast.
