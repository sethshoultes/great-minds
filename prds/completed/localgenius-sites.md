# PRD: LocalGenius Sites

## Overview

LocalGenius Sites is a managed website service that provisions real, CMS-powered websites for local businesses using Emdash (Astro + Cloudflare). Instead of generating throwaway HTML during onboarding, LocalGenius deploys a professional, edge-hosted website that the AI assistant can build, update, and maintain through Emdash's MCP server. The user never touches a CMS — they talk to their AI, and their website stays alive.

**One-line pitch:** "Your business, live in five minutes."

## Problem Statement

Local businesses need websites but don't want to build them. The current options fail them:

- **No website** (~30-40% of small businesses): Running on Facebook and Google Maps. They've been "meaning to get a website" for years.
- **Bad website** (outdated Wix/WordPress from 2018): Costs $29/month, never updated, embarrassing to share.
- **Generated HTML** (current LocalGenius onboarding): A static brochure that doesn't change, doesn't rank, doesn't grow.

The gap between "generated HTML page" and "real CMS website" is enormous: real URLs, real metadata, Google indexing, editable content, living presence. LocalGenius Sites closes that gap with zero friction.

## Target Market

**Primary (launch):** Segment A — businesses with no website at all. High urgency, zero switching cost, immediate value.

**Secondary (month 2+):** Segment B — businesses with bad/outdated websites. Need a switching catalyst. AI-managed angle is compelling but migration friction is real.

**Explicitly NOT targeting:** Segment C — businesses with good existing websites on Squarespace/Wix/Webflow. Not our customer for this product.

**TAM within LocalGenius:** ~40-50% of user base (digital-laggard local businesses).

## Core Features (v1)

### Provisioning Pipeline
- Automated per-business deployment: D1 database + R2 bucket + Emdash Worker
- Subdomain-first: `{slug}.localgenius.site` (resolves instantly)
- Custom domain support: propagates asynchronously, user notified when live
- Async provisioning via job queue (target: under 5 minutes wall-clock)
- Provisioning success rate target: >99%

### AI Content Population
- Business answers 7 questions during onboarding
- AI generates structured Portable Text content (not flat strings)
- Template auto-selected by business vertical (invisible to user)
- 30-second owner verification before site goes live ("Does this look right?")
- The reveal moment: engineered as a product feature — designed to make them gasp

### AI-Managed Updates (MCP Integration)
- Natural language prompt bar: "Update my hours to 9-5 Monday through Saturday"
- AI writes to Emdash via MCP server — user never sees the CMS
- Monthly AI-generated site updates: reviews seasonal context, proposes changes
- Business owner gets notification: "Your AI updated your site for spring promotions"

### Templates
- Launch with exactly 2 templates — both genuinely beautiful
- AI selects based on business type (restaurant, services, etc.)
- Each template brand-tested and benchmarked against 30ms Worker CPU limit
- Expand library only after provisioning pipeline proven at scale

### Zero CMS Exposure
- No admin panel, no drag-and-drop, no block editor for end users
- All editing through AI prompt interface via MCP
- Power users who want more get a waitlist for "advanced" tier (validates demand)

## Architecture

### Tech Stack
- **CMS:** Emdash (Astro-based, open source)
- **Database:** Cloudflare D1 (SQLite at edge, per-business)
- **Storage:** Cloudflare R2 (object storage, per-business)
- **Runtime:** Cloudflare Workers
- **AI Bridge:** Emdash MCP server ↔ LocalGenius AI assistant
- **Provisioning:** Cloudflare API / Wrangler CLI, async job queue

### Unit Economics (per business site)
| Resource | Monthly Cost |
|----------|-------------|
| D1 (50K reads/month) | $0.04 |
| R2 (50MB images) | $0.001 |
| Workers (10K requests/month) | $0.005 |
| **Total variable cost** | **<$0.05/month** |

At $29 base / $79 pro subscription, margin is >99% on hosting costs.

### Scale Ceilings
- D1: 50,000 databases per Cloudflare account (plan account federation from day one)
- Workers: rate limits on Cloudflare API for provisioning (async queue handles this)
- CPU: 30ms per request on paid Workers (must benchmark Emdash SSR)

## Pricing

- **Base tier ($29/month):** LocalGenius AI tools + managed website on `{slug}.localgenius.site`
- **Pro tier ($79/month):** Everything in Base + custom domain + priority AI updates + advanced analytics
- Upsell from $29 → $79 is almost pure margin ($50 increase, <$1 marginal cost)

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Time-to-live-site | <10 minutes | Launch |
| Provisioning success rate | >99% | Launch |
| Live sites | 50 | Day 30 |
| Live sites | 500 | Day 60 |
| 30-day retention lift (sites vs no-sites) | >15% | Day 60 measurement |
| MCP content updates per site/month | ≥2 | Day 30+ |
| $79 tier conversion rate | >20% | Day 60 |
| First MCP update story (filmed) | 1 | Day 30 |
| Vertical case studies | 3 | Day 60 |
| Google indexing proof | Published | Day 60 |
| Sites = default product (if retention proven) | Decision | Day 90 |

## Team

| Role | Owner | Responsibility |
|------|-------|---------------|
| Design Lead | Steve's hire | 2 launch templates, visual editing UX, brand system |
| Content Systems Designer | Steve's hire | Portable Text schemas per vertical, AI output quality bar |
| Edge Infrastructure Engineer | Elon's hire | Provisioning pipeline, Wrangler automation, DNS, queues |
| MCP Integration Lead | Elon's hire | LocalGenius AI ↔ Emdash MCP bridge, content update flow |

4 people. No more.

## Constraints

- **Emdash maturity:** 2-week audit runs concurrent with pipeline build. Must hit 95% automated provisioning success. If audit fails, fall back to static HTML generation.
- **Worker CPU:** 30ms ceiling — all Emdash SSR paths must be benchmarked before template enters pool.
- **DNS:** Subdomain-first strategy avoids propagation delays. Custom domains are async.
- **No CMS exposure:** Users never see Emdash admin. All interaction through AI prompt.

## Competitive Landscape

| Competitor | Weakness | Our Advantage |
|-----------|----------|---------------|
| Squarespace | Requires taste and time. Sells the journey. | We sell done. Live in 5 minutes. |
| Wix | Feature bloat. Overwhelming for non-technical users. | Zero friction. AI handles everything. |
| WordPress | Maintenance burden. Security updates. Hosting complexity. | Fully managed on Cloudflare edge. |
| GoDaddy Website Builder | Low quality output. Generic templates. | AI-personalized content. Real CMS underneath. |
| Static page generators | No CMS. Can't update. Don't rank well. | Living site. AI-managed. Google-indexable. |

**Unique differentiator:** No competitor has AI that manages the website after creation via MCP. Build + maintain, not just build.

## Open Questions

1. Does Emdash's MCP transport work within Workers' execution model? (WebSocket vs SSE vs HTTP)
2. What's the actual Emdash SSR time under D1/R2 on Workers? Need benchmark.
3. Account federation strategy for D1 50K ceiling — when do we need it?
4. What content verification UX minimizes friction while preventing AI hallucination of business details?
5. Should the reveal moment include confetti/animation or stay understated?

## Debate Record

- **Round 1:** Steve and Elon staked independent positions on all 6 areas. Agreed on core thesis (problem is real, economics work, MCP is the unlock, Segment A focus, 3-4 person team).
- **Round 2:** Challenged each other on 5 tensions. All 5 resolved. Key concessions: Steve accepted parallel audit (not blocking), Elon accepted beauty from day one (2 templates only), both locked on zero CMS exposure with AI prompt bar.
- **Moderator (Marcus Aurelius):** Mediated final decisions. DNS subdomain-first (Elon), content verification step (Elon), reveal moment engineering (Steve), film MCP story at day 30 (both).
