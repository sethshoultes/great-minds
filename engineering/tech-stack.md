# LocalGenius — Technical Stack

**Author**: Elon Musk, Chief Product & Growth Officer
**Date**: 2026-04-02
**Status**: Architecture Decision Record

---

## Decision Framework

Every technology choice is evaluated against four constraints, derived from locked decisions and the PRD:

1. **Team size**: 6 people (3 engineers), 6 months to ship v1
2. **Mobile-first**: "These owners live on their phones" (PRD). Desktop is supported but not prioritized.
3. **AI cost ceiling**: Under 15% of revenue per user ($6.57/user/month at blended $44 ARPU)
4. **Multi-tenant from day one**: Organization → Business → User (Locked Decision #4)

The overriding principle: **boring technology that ships beats exciting technology that demos.** We're 3 engineers building a production product in 6 months. Every dependency we add is a dependency we maintain.

---

## 1. Mobile Framework: React Native (Expo)

**Decision**: React Native with Expo managed workflow.

**Why not Flutter**: Flutter produces excellent apps, but the React ecosystem has a larger talent pool for a 6-person Austin startup. Our Mobile Engineer hire is more likely to have React Native production experience (team-personas.md: "has shipped at least 2 production mobile apps"). Dart is a smaller hiring pool.

**Why not native (Swift/Kotlin)**: Two codebases for 1 mobile engineer is a non-starter. The product is a conversational interface — not a camera app or a game. React Native handles text input, scrolling lists, and card rendering without performance bottlenecks.

**Why Expo**: Expo's managed workflow eliminates native build configuration. OTA updates via EAS Update mean we can push fixes without App Store review cycles. The conversational interface doesn't need bare-workflow native modules — Expo's managed SDK covers push notifications, camera (photo upload), location (city detection during onboarding), and audio (voice input).

**Key libraries**:
| Library | Purpose | Justification |
|---------|---------|---------------|
| `expo` (managed) | Build toolchain, OTA updates | Eliminates native config overhead for 1 mobile engineer |
| `react-native-reanimated` | Animations (card fade-up, approval checkmark) | Product-design.md specifies "200ms fade-up" and "300ms checkmark" — needs performant animation |
| `expo-speech` / `expo-av` | Voice input | Product-design.md: "mic icon sits in the text field" — voice input is a core interaction |
| `expo-image-picker` | Photo upload during onboarding | Step 3 of onboarding: "upload 3-6 photos from camera roll" |
| `expo-notifications` | Push notifications | Weekly Digest, negative review alerts, campaign results |
| `zustand` | State management | Lightweight, no boilerplate. Redux is overkill for a conversational UI. |
| `react-native-mmkv` | Local storage | Offline draft persistence (product-design.md: "auto-save everything") |

**What we do NOT use**:
- No navigation library beyond `expo-router` — the product has two screens (Thread and Digest). No tab navigator needed.
- No form library — there are no forms. Onboarding is a conversation.
- No analytics SDK in v1 — server-side analytics only. No Mixpanel, no Amplitude. We track events through our API.

---

## 2. Backend Framework: Next.js (API Routes) on Node.js

**Decision**: Next.js 14+ with App Router for the web layer and API routes for the backend. Single deployable unit.

**Why not separate backend (Express/Fastify) + separate frontend**: For 3 engineers in 6 months, maintaining two deployable units doubles DevOps overhead. Next.js API routes give us a Node.js backend with zero additional infrastructure. The Tech Lead writes API endpoints in the same repo as the (minimal) web interface.

**Why not Python/Django/FastAPI**: The AI cost model (market-fit.md Section 3) shows text generation is the primary AI interaction — API calls to an LLM provider, not ML inference. Python's ML ecosystem advantage doesn't apply. Node.js/TypeScript gives us a single language across mobile (React Native) and backend (Next.js), reducing context-switching for 3 engineers.

**Why Next.js specifically**: 
- The product-design.md specifies a website generator that outputs "a real, published, mobile-optimized site." Next.js on Vercel is the simplest path to hosting generated static sites.
- Server-side rendering for the (minimal) desktop web version.
- API routes for the mobile app's backend.
- One deployment target, one monitoring stack, one team's cognitive load.

**Key backend libraries**:
| Library | Purpose | Justification |
|---------|---------|---------------|
| `@anthropic-ai/sdk` | LLM API calls | See AI Provider section below |
| `drizzle-orm` | Database ORM | Type-safe, lightweight, SQL-first. No Prisma migration pain. |
| `bullmq` + `redis` | Job queue | Async tasks: social post scheduling, SEO analysis, Weekly Digest generation, review monitoring |
| `zod` | Input validation | Type-safe validation at API boundaries (system boundary = validate) |
| `jose` | JWT handling | Auth tokens (see api-design.md) |
| `sharp` | Image processing | Resize/optimize owner photos for website and social posts |
| `@upstash/ratelimit` | Rate limiting | API rate limiting per business (see api-design.md) |

---

## 3. Database: PostgreSQL (on Neon)

**Decision**: PostgreSQL, hosted on Neon (serverless Postgres).

**Why PostgreSQL**:
- Multi-tenant data model (Locked Decision #4) with `organization_id` scoping on every table. Postgres row-level security (RLS) enforces tenant isolation at the database layer — no application code can accidentally leak cross-tenant data.
- JSONB columns for flexible content storage (AI-generated social posts, review responses, website content have varying schemas per business type).
- Full-text search for conversation history (Maria asks "what did I post about tacos last month?" — needs to search her thread).
- `pg_trgm` for fuzzy matching on business names during onboarding discovery.
- Mature, boring, well-understood. The entire team will have Postgres experience.

**Why Neon (not RDS, not Supabase)**:
- Serverless scaling: pays per query, not per hour. At 300 users, we're running ~$50-80/month. At 10,000 users, Neon autoscales without manual intervention.
- Branching: Neon database branches give us isolated staging environments for free — the Tech Lead can branch the production database for testing without snapshots or copies.
- Connection pooling built-in (PgBouncer) — critical for serverless deployments where connection limits are a common failure mode.

**Why not MongoDB/DynamoDB**: 
- The attribution model (Jensen's Question #2) requires complex joins: actions → outcomes → revenue attribution. Document databases make this painful.
- Multi-tenant RLS is a Postgres superpower. MongoDB tenant isolation requires application-level enforcement — one bug leaks data.
- Our data is fundamentally relational: organizations have businesses, businesses have users, users have conversations, conversations produce actions, actions generate outcomes.

**Supplementary data stores**:
| Store | Purpose | Justification |
|-------|---------|---------------|
| Redis (Upstash) | Job queue (BullMQ), caching, rate limiting, session store | Fast key-value for ephemeral data. Upstash is serverless — zero ops. |
| S3 (Cloudflare R2) | Image/media storage | Owner photos, generated social post images, website assets. R2 has zero egress fees. |

---

## 4. AI Provider: Anthropic Claude (Sonnet 4.6 primary, Haiku 4.5 for batch)

**Decision**: Anthropic Claude as the primary LLM provider. Claude Sonnet 4.6 for interactive generation, Claude Haiku 4.5 for batch/background tasks.

**Why Anthropic Claude over OpenAI GPT**:
- **Cost**: Claude Sonnet 4.6 at $3/$15 per million tokens (input/output) vs GPT-4o at $2.50/$10. The output cost difference is meaningful for our use case — we generate more output (social posts, review responses, website copy) than input. However, Claude's superior instruction-following reduces retry rates, which is the real cost driver. Market-fit.md allocates 15% overhead for retries — better first-pass quality reduces this.
- **Instruction following**: LocalGenius generates customer-facing content that must match specific brand voice, tone, and vocabulary rules (marketing-messaging.md: "words we never use"). Claude's system prompt adherence is measurably stronger for style-constrained generation.
- **Longer context window**: 200K tokens standard. When generating a Weekly Digest, we need to include the full week's conversation history, action log, and analytics. Long context avoids chunking complexity.
- **Safety**: Claude's content filtering is more conservative, which is correct for our use case — we're generating public-facing content for small businesses. A false positive (overly cautious generation) is better than a false negative (generating something that embarrasses Maria).

**Model allocation by feature**:
| Feature | Model | Why |
|---------|-------|-----|
| Social post generation | Sonnet 4.6 | Interactive, owner-facing, quality-critical. Needs voice matching. |
| Review responses | Sonnet 4.6 | Public-facing, reputation-critical. Must match owner's tone. |
| Conversational interactions | Sonnet 4.6 | Real-time, context-dependent. Needs to understand owner intent. |
| Website content generation | Sonnet 4.6 | Onboarding magic moment. Quality is conversion-critical. |
| Email/SMS campaigns | Sonnet 4.6 | Customer-facing content. |
| Weekly Digest generation | Haiku 4.5 | Batch, templated, lower creativity requirement. Runs overnight. |
| SEO analysis | Haiku 4.5 | Batch, analytical, not creative. Background task. |
| Content classification/routing | Haiku 4.5 | Internal routing decision, not user-facing. |

**Cost projection at 300 users (base case)**:
- Sonnet 4.6 interactive: ~$0.85/user/month (estimated from market-fit.md token volumes, adjusted for Anthropic pricing)
- Haiku 4.5 batch: ~$0.08/user/month
- **Total LLM cost: ~$0.93/user/month** (2.1% of blended ARPU)
- Add image generation, embeddings, API calls: ~$2.00/user/month additional (per market-fit.md Section 3.3)
- **Total AI + API cost: ~$2.93/user/month** (6.7% of revenue — well under 15% ceiling)

**Image generation**: Flux (via Replicate) for social post images. $0.03-0.05/image, ~8 images/user/month = $0.24-0.40/month. Cheaper than DALL-E 3 ($0.04-0.08/image) with comparable quality for social media content.

**Fallback strategy**: If Anthropic has an outage, queue all generation tasks in BullMQ with a 30-minute retry window. If outage exceeds 30 minutes, fail over to OpenAI GPT-4o with the same prompt templates. Dual-provider SDK abstraction costs ~1 day of engineering and prevents single-vendor dependency.

---

## 5. Hosting & Deployment: Vercel (Application) + Cloudflare (Generated Sites)

**Decision**: Vercel for the Next.js application. Cloudflare Pages for generated customer websites.

**Why Vercel for the app**:
- Native Next.js deployment. Zero configuration. The Tech Lead pushes to `main`, Vercel deploys.
- Edge functions for API routes — low latency for mobile app interactions (< 200ms p95 for non-AI endpoints).
- Preview deployments on every PR — the entire team sees changes before merge.
- Scales automatically. At 300 users, we're well within Vercel's Pro plan ($20/month per team member).

**Why Cloudflare Pages for generated sites**:
- Product-design.md: "AI-generated website on commoditized hosting." Cloudflare Pages has unlimited sites on the free tier with unlimited bandwidth.
- Each customer website is a static site (generated HTML/CSS/images) deployed to Cloudflare. Zero hosting cost per customer.
- Custom domain support — Maria can point `mariaskitchenatx.com` to her generated site.
- Global CDN — Maria's site loads fast from anywhere. First contentful paint < 1 second.

**Why not AWS**:
- For 3 engineers, AWS is an ops tax. EC2/ECS requires capacity planning, security group management, VPC configuration. Vercel + Neon + Cloudflare is fully managed — the team writes application code, not infrastructure code.
- AWS makes sense at 10,000+ users if we need fine-grained cost optimization. For v1 with 300 users, managed services are cheaper in engineering hours.

---

## 6. Third-Party Integrations

| Integration | API | Purpose | Rate Limits (Key Constraint) |
|-------------|-----|---------|------------------------------|
| Google Business Profile | GBP API v4 | Review monitoring, profile optimization, listing management | 60 requests/min per project. Batch review pulls to 4x/day per business. |
| Meta Graph API | Instagram + Facebook posting, page insights | Social post publishing, engagement metrics | 200 calls/user/hour. Queue posts via BullMQ, not real-time. |
| Yelp Fusion API | Review monitoring, business info | Review alerts, competitive data | 5,000 calls/day. Sufficient for 300 users at 4 pulls/day each = 1,200 calls. |
| Twilio (SendGrid) | Email + SMS | Campaigns, Weekly Digest delivery, transactional email | 100 emails/sec on Essentials plan. |
| Stripe | Payments | Subscription billing ($29/$79 tiers) | No practical limit for our volume. |
| Cloudflare Pages API | Site deployment | Deploying generated customer websites | 500 deployments/day. One per customer per content update. |

---

## 7. Development Tools

| Tool | Purpose | Why |
|------|---------|-----|
| TypeScript | Language (everywhere) | Single language across mobile + backend. Type safety catches errors before runtime. Non-negotiable for a 3-engineer team. |
| pnpm | Package manager | Faster installs, strict dependency resolution. Monorepo-friendly. |
| Turborepo | Monorepo management | `apps/mobile` (Expo), `apps/web` (Next.js), `packages/shared` (types, utils, AI prompts). One repo, one CI pipeline. |
| Biome | Linter + formatter | Replaces ESLint + Prettier with a single, faster tool. Zero config debates. |
| Vitest | Testing | Fast, Vite-native, TypeScript-first. Jest is slower and more configuration. |
| GitHub Actions | CI/CD | See infrastructure.md |
| Linear | Project tracking | Lightweight, fast, opinionated. team-personas.md: "No planning poker." Linear enforces this. |

---

## 8. Stack Summary

```
┌─────────────────────────────────────────────────┐
│                   CLIENT LAYER                   │
│  React Native (Expo)          Next.js (Web)      │
│  iOS + Android                Desktop fallback    │
│  2 screens: Thread + Digest                      │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────┴──────────────────────────┐
│                 APPLICATION LAYER                 │
│  Next.js API Routes (Vercel Edge)                │
│  Auth (JWT) · Rate Limiting · Validation (Zod)   │
└──────────────┬────────────────┬─────────────────┘
               │                │
┌──────────────┴───┐   ┌───────┴──────────────────┐
│   DATA LAYER     │   │    ASYNC LAYER            │
│  PostgreSQL      │   │  BullMQ + Redis           │
│  (Neon)          │   │  (Upstash)                │
│  Multi-tenant    │   │  Job queue:               │
│  RLS enforced    │   │  - Social post scheduling │
│                  │   │  - Review monitoring       │
│  Cloudflare R2   │   │  - SEO analysis           │
│  (media storage) │   │  - Weekly Digest gen       │
│                  │   │  - Site deployment         │
└──────────────────┘   └───────┬──────────────────┘
                               │
┌──────────────────────────────┴──────────────────┐
│               EXTERNAL SERVICES                  │
│  Anthropic Claude (Sonnet 4.6 / Haiku 4.5)      │
│  Google Business Profile API                     │
│  Meta Graph API (IG + FB)                        │
│  Yelp Fusion API                                 │
│  Twilio / SendGrid                               │
│  Stripe                                          │
│  Cloudflare Pages (generated customer sites)     │
│  Flux via Replicate (image generation)           │
└─────────────────────────────────────────────────┘
```

---

## 9. Decision Traceability

| Decision | Traces To |
|----------|-----------|
| React Native (Expo) | PRD: "mobile-first," team-personas.md: 1 mobile engineer |
| Next.js API routes (single deployable) | team-personas.md: 3 engineers, 6 months |
| PostgreSQL with RLS | Locked Decision #4: multi-tenant from day one |
| Neon serverless | Cost constraint: 300 users initially, must scale without ops |
| Anthropic Claude | market-fit.md: AI costs under 15% of revenue; product-design.md: content quality is conversion-critical |
| Haiku for batch tasks | market-fit.md: AI cost optimization via model tiering |
| Vercel hosting | team-personas.md: "ship fast," zero-config deployment |
| Cloudflare Pages for sites | Locked Decision #1: own generation, outsource hosting infrastructure |
| Monorepo (Turborepo) | team-personas.md: 3 engineers sharing code across mobile + backend |
| TypeScript everywhere | team-personas.md: single-language team reduces context-switching |
