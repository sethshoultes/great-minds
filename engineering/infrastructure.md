# LocalGenius — Infrastructure

**Author**: Elon Musk, Chief Product & Growth Officer
**Date**: 2026-04-02
**Status**: Architecture Decision Record

---

## 1. CI/CD Pipeline: GitHub Actions

**Decision**: GitHub Actions for all CI/CD. Single monorepo (`localgenius/app`), single pipeline.

### 1.1 Pipeline Stages

```
Push to any branch:
  ┌─────────────────────────────────────────────┐
  │ 1. LINT + TYPE CHECK (parallel)             │
  │    - biome check (lint + format)            │
  │    - tsc --noEmit (TypeScript)              │
  │    Duration: ~30 seconds                    │
  └──────────────────────┬──────────────────────┘
                         │
  ┌──────────────────────┴──────────────────────┐
  │ 2. TEST (parallel)                          │
  │    - vitest run (unit + integration)        │
  │    - playwright test (e2e, web only)        │
  │    Duration: ~2-4 minutes                   │
  └──────────────────────┬──────────────────────┘
                         │
  ┌──────────────────────┴──────────────────────┐
  │ 3. BUILD (parallel)                         │
  │    - turbo build --filter=web (Next.js)     │
  │    - turbo build --filter=mobile (Expo)     │
  │    Duration: ~2-3 minutes                   │
  └──────────────────────┬──────────────────────┘
                         │
Push to main only:       │
  ┌──────────────────────┴──────────────────────┐
  │ 4. DEPLOY                                   │
  │    - Vercel auto-deploys from main          │
  │    - Database migrations (drizzle-kit push) │
  │    Duration: ~1-2 minutes                   │
  └──────────────────────┬──────────────────────┘
                         │
  ┌──────────────────────┴──────────────────────┐
  │ 5. POST-DEPLOY                              │
  │    - Smoke tests against production         │
  │    - Sentry release tracking                │
  │    Duration: ~1 minute                      │
  └─────────────────────────────────────────────┘

Total push-to-production time: ~7-10 minutes
```

### 1.2 Mobile Deployment (Separate Track)

Mobile builds run on EAS Build (Expo Application Services), not GitHub Actions:

```
Manual trigger (or tag push: v1.x.x):
  1. EAS Build → iOS + Android binaries (~15-20 min)
  2. EAS Submit → App Store Connect + Google Play Console
  3. TestFlight / Internal Testing Track for review
  4. Manual promotion to production after QA

OTA Updates (no store review):
  Push to main → EAS Update → OTA update deployed
  Users receive update on next app open (~30 seconds)
```

**OTA vs. Store update decision**: Bug fixes and content changes → OTA (instant). Native module changes, major features → Store update (1-3 day review). Expo's managed workflow means most changes are OTA-eligible.

### 1.3 Database Migration Strategy

**Tool**: drizzle-kit (schema-first, generates SQL migrations from TypeScript schema).

**Flow**:
1. Engineer modifies schema in `packages/db/schema.ts`
2. `drizzle-kit generate` creates a migration SQL file
3. Migration reviewed in PR (SQL is human-readable)
4. On merge to main: `drizzle-kit push` runs against production via GitHub Actions
5. Migrations are forward-only — no down migrations in v1 (rollback by deploying a fix, not by reverting schema)

**Why no down migrations**: At 3 engineers and 300 users, a failed migration is fixed by deploying a corrective migration, not by rolling back. Down migrations add complexity and create false confidence in reversibility. If a migration breaks production, the fastest fix is forward.

---

## 2. Environments

### 2.1 Environment Matrix

| Environment | Purpose | URL | Database | Deploys |
|-------------|---------|-----|----------|---------|
| **Development** | Local development | `localhost:3000` | Local Postgres (Docker) or Neon branch | Manual (dev server) |
| **Preview** | PR review | `pr-{number}.localgenius.vercel.app` | Neon branch (auto-created per PR) | Auto on PR push |
| **Staging** | Pre-production testing | `staging.localgenius.com` | Neon staging branch | Auto on merge to `staging` branch |
| **Production** | Live users | `api.localgenius.com` | Neon main branch | Auto on merge to `main` |

**Neon branching** is critical: each preview environment gets an isolated database branch (instant copy-on-write from production schema). Engineers test migrations against real schema without affecting production. Branch cleanup is automatic — Neon deletes branches for closed PRs.

### 2.2 Environment Variables

| Variable | Dev | Staging | Production | Stored In |
|----------|-----|---------|------------|-----------|
| `DATABASE_URL` | Local | Neon staging | Neon production | Vercel env vars |
| `ANTHROPIC_API_KEY` | Dev key (rate-limited) | Production key | Production key | Vercel env vars (encrypted) |
| `REDIS_URL` | Local Redis | Upstash staging | Upstash production | Vercel env vars |
| `STRIPE_SECRET_KEY` | Test mode key | Test mode key | Live mode key | Vercel env vars |
| `GOOGLE_CLIENT_SECRET` | Dev OAuth app | Prod OAuth app | Prod OAuth app | Vercel env vars |
| `META_APP_SECRET` | Dev app | Prod app | Prod app | Vercel env vars |
| `ENCRYPTION_KEY` | Dev key | Staging key | Production key | Vercel env vars |
| `SENTRY_DSN` | Dev project | Staging project | Prod project | Vercel env vars |

**No `.env` files in the repo.** All secrets in Vercel environment variable management. Local development uses `.env.local` (gitignored).

---

## 3. Monitoring & Alerting

### 3.1 Application Monitoring: Sentry

**Decision**: Sentry for error tracking, performance monitoring, and session replay.

**Why Sentry**: The team already knows it (standard in the React/Node ecosystem). Expo SDK integration means mobile errors are automatically captured with device context. Next.js integration captures server-side errors with request context.

**Configuration**:
- **Error tracking**: All unhandled exceptions, rejected promises. Source maps uploaded on deploy for readable stack traces.
- **Performance monitoring**: 20% transaction sample rate (sufficient for 300 users; increase to 100% if debugging performance issues).
- **Session replay**: Enabled for error sessions only (not all sessions — privacy and cost). When an error occurs, Sentry captures a replay of the session leading up to the error.
- **Alert rules**:

| Alert | Condition | Channel | Severity |
|-------|-----------|---------|----------|
| Error spike | >10 errors in 5 minutes (any endpoint) | Slack #eng-alerts + PagerDuty | P1 |
| AI generation failure rate | >5% of AI calls fail in 15 minutes | Slack #eng-alerts | P2 |
| API latency degradation | p95 > 3 seconds for non-AI endpoints | Slack #eng-alerts | P2 |
| Payment webhook failure | Any Stripe webhook fails | Slack #eng-alerts + PagerDuty | P1 |
| External platform auth failure | >3 OAuth token refreshes fail for same platform in 1 hour | Slack #eng-alerts | P2 |

### 3.2 Infrastructure Monitoring: Vercel Analytics + Neon Dashboard

- **Vercel Analytics**: Request volume, latency percentiles, error rates, edge function execution time. Built into Vercel Pro plan.
- **Neon Dashboard**: Database connection count, query latency, storage usage, compute hours. Built into Neon plan.
- **Upstash Dashboard**: Redis memory usage, command rate, queue depth. Built into Upstash plan.

**Why not Datadog/New Relic**: Cost. Datadog starts at $15/host/month with per-feature add-ons that scale to $500+/month quickly. For 300 users on a serverless stack, the built-in dashboards from Vercel + Neon + Upstash + Sentry provide sufficient observability. Re-evaluate at 5,000 users.

### 3.3 Uptime Monitoring: BetterUptime

Simple uptime checks ($20/month):
- `https://api.localgenius.com/health` — every 60 seconds
- `https://localgenius.com` — every 60 seconds
- Status page at `status.localgenius.com` — public, auto-updated

---

## 4. Logging Strategy

### 4.1 Structured Logging

All application logs are structured JSON (not unstructured text). Every log entry includes:

```json
{
  "level": "info|warn|error",
  "message": "Human-readable description",
  "timestamp": "2026-04-02T08:00:00.000Z",
  "request_id": "req_abc123",
  "organization_id": "org_xxx",
  "business_id": "biz_yyy",
  "user_id": "usr_zzz",
  "endpoint": "POST /conversations/current/messages",
  "duration_ms": 1234,
  "metadata": { ... }
}
```

**Why structured**: Vercel logs are searchable by JSON field. When Maria reports "my post didn't go through," the Tech Lead searches `business_id = "biz_yyy" AND endpoint LIKE "%actions%"` and finds the exact failure in seconds.

### 4.2 Log Levels

| Level | Usage | Volume |
|-------|-------|--------|
| `error` | Unhandled exceptions, failed external API calls, data integrity issues | Low — every error is a bug or external failure |
| `warn` | Recoverable issues: rate limit approach, slow query (>500ms), retry triggered | Medium |
| `info` | Request/response summary (one per API call), job completion, deployment events | High — bulk of logs |
| `debug` | AI prompt/response content (truncated), SQL queries, external API payloads | Dev/staging only — never in production (PII risk + volume) |

### 4.3 AI-Specific Logging

Every AI generation call logs:
- Model used (sonnet-4.6, haiku-4.5)
- Input tokens, output tokens
- Latency (ms)
- Whether response was cached
- Whether response required retry
- Cost estimate (tokens × price per token)

This data feeds the AI cost dashboard (see Section 6) and validates the market-fit.md projection of 6.7% AI cost / revenue.

### 4.4 Log Retention

| Environment | Retention | Where |
|-------------|-----------|-------|
| Production | 30 days (Vercel log drain) | Vercel built-in + optional drain to Axiom ($25/month) for longer retention |
| Staging | 7 days | Vercel built-in |
| Development | Session only | Local console |

**Why Axiom as optional drain**: Vercel's built-in logs are limited to 1 hour of search history on the Pro plan. Axiom provides 30-day searchable logs at $25/month. We add this when the first production incident requires looking back more than 1 hour.

---

## 5. Deployment Strategy

### 5.1 Vercel Deployment Model

```
GitHub main branch
    → Vercel auto-deploys
    → Instant rollback available (one click to previous deployment)
    → Zero-downtime deployments (Vercel handles traffic shifting)
```

**Rollback**: If a deployment breaks production, the Tech Lead clicks "Promote to Production" on the previous deployment in Vercel dashboard. Takes < 30 seconds. No git revert needed.

### 5.2 Database Deployment Safety

Migrations run as a GitHub Actions step BEFORE the Vercel deploy is promoted:

1. GitHub Action runs `drizzle-kit push` against production Neon
2. If migration fails → pipeline stops → Vercel deploy is NOT promoted
3. If migration succeeds → Vercel deployment goes live
4. **Backward-compatible migrations only**: New columns are nullable or have defaults. Old columns are not removed until the next release confirms they're unused. This ensures the old code (still serving traffic during deploy) works with the new schema.

### 5.3 Feature Flags

**No feature flag infrastructure in v1.** For 3 engineers and 300 users, feature flags add complexity without proportional value. If we need to hide a feature, we use a simple `plan` check (base vs. pro) or a `business_id` allowlist in an environment variable.

**Re-evaluate at 1,000 users** when A/B testing becomes relevant. LaunchDarkly or Statsig at that point.

### 5.4 Incident Response

| Severity | Definition | Response Time | Who |
|----------|-----------|---------------|-----|
| P1 | Production down, payments failing, data loss risk | 15 minutes | Tech Lead (primary), CEO (comms) |
| P2 | Feature degraded (AI slow, one platform integration down) | 1 hour | On-call engineer |
| P3 | Minor issue, workaround exists | Next business day | Assigned in Linear |

**On-call rotation**: For a 3-engineer team, on-call rotates weekly. Tech Lead → AI Engineer → Mobile Engineer. CEO is escalation for customer-facing comms. No PagerDuty in v1 — Sentry alerts go to Slack; Slack goes to phones.

**Post-incident**: Every P1 gets a written post-mortem within 48 hours. Template: What happened → Why → What we did → What we'll change. Stored in `docs/incidents/`. No blame, only learning.

---

## 6. Cost Projections

### 6.1 Infrastructure Costs: First 300 Users (Month 3)

| Service | Plan | Monthly Cost | Notes |
|---------|------|:------------:|-------|
| **Vercel** | Pro | $60 | $20/member × 3 engineers. Includes preview deploys, analytics, edge functions. |
| **Neon** | Scale | $69 | Serverless Postgres. 300 users generates ~5GB storage, ~50 compute-hours/month. |
| **Upstash Redis** | Pay-as-you-go | $15 | Job queue + caching + rate limiting. ~100K commands/day at 300 users. |
| **Cloudflare R2** | Pay-as-you-go | $5 | Media storage. 300 users × ~50MB each = 15GB. $0.015/GB/month. |
| **Cloudflare Pages** | Free | $0 | Generated customer websites. Unlimited sites, unlimited bandwidth on free tier. |
| **Sentry** | Team | $26 | 50K errors/month, 100 replays. Ample for 300 users. |
| **BetterUptime** | Starter | $20 | Uptime monitoring + status page. |
| **Expo EAS** | Production | $99 | Build + update + submit for iOS + Android. |
| **Axiom** (optional) | Personal | $25 | 30-day log retention. Add when first incident requires log search. |
| **Domain + DNS** | Cloudflare | $15 | `localgenius.com` + DNS management. |
| **Subtotal: Hosting/Infra** | | **$334** | |

### 6.2 Third-Party API Costs (Per 300 Users, Monthly)

| Service | Monthly Cost | Calculation |
|---------|:------------:|-------------|
| **Anthropic Claude** | $279 | Sonnet: ~$0.85/user × 300 = $255. Haiku: ~$0.08/user × 300 = $24. |
| **Replicate (Flux images)** | $96 | ~8 images/user/month × $0.04/image × 300 users. |
| **Twilio SendGrid** | $20 | Essentials plan. ~4 emails/user/month × 300 = 1,200 emails + Weekly Digests. |
| **Google APIs** | $0 | GBP API is free within standard quota. Maps/Places for discovery: ~$10 but within free tier. |
| **Meta Graph API** | $0 | Free within standard rate limits. |
| **Yelp Fusion API** | $0 | Free tier: 5,000 calls/day. We use ~1,200. |
| **Stripe** | ~$396 | 2.9% + $0.30 per transaction. 300 users × $44 ARPU = $13,200 MRR. Stripe fee: ~$396. |
| **Subtotal: APIs** | **$791** | |

### 6.3 Total Infrastructure Cost

| Category | Monthly (300 Users) | Monthly (10,000 Users, Projected) |
|----------|:-------------------:|:----------------------------------:|
| Hosting / Infrastructure | $334 | $850 |
| AI + API Services | $791 | $18,500 |
| Payment Processing (Stripe) | $396 | $13,200 |
| **Total** | **$1,521** | **$32,550** |
| **Per User** | **$5.07** | **$3.26** |
| **% of Revenue** (at $44 ARPU) | **11.5%** | **7.4%** |

### 6.4 Cost Analysis

At 300 users, infrastructure cost is 11.5% of revenue — higher than the long-term target due to fixed costs (Vercel, Sentry, EAS) amortized over fewer users. The variable costs (AI, Stripe) scale linearly.

At 10,000 users, infrastructure drops to 7.4% of revenue. The fixed costs become negligible. AI costs (the largest variable) decline as:
- Caching captures repeat query patterns (seasonal content, common review responses)
- Model costs decrease ~30% annually (historical trend in LLM pricing)
- Haiku handles more batch workloads as we identify which tasks don't need Sonnet quality

**AI cost specifically**: $279/month at 300 users = $0.93/user/month = **2.1% of revenue**. Well under the 15% ceiling. Even with image generation ($0.32/user) and API overhead ($1.68/user for external integrations), total AI+API cost lands at **6.7% of revenue** — exactly matching the market-fit.md projection.

---

## 7. Security

### 7.1 Data at Rest

| Data | Encryption | Method |
|------|-----------|--------|
| Database (Neon) | Encrypted | AES-256, managed by Neon |
| Object storage (R2) | Encrypted | AES-256, managed by Cloudflare |
| Platform OAuth tokens | Encrypted | Application-level AES-256-GCM before storage |
| Backups | Encrypted | Neon manages encrypted backups with point-in-time recovery |

### 7.2 Data in Transit

All traffic over HTTPS (TLS 1.3). No exceptions. Vercel enforces HTTPS redirects. API endpoints reject HTTP requests.

### 7.3 Access Control

| Resource | Access Model |
|----------|-------------|
| Vercel dashboard | 3 engineers (individual accounts, 2FA required) |
| Neon dashboard | Tech Lead + CEO (2 people) |
| Stripe dashboard | CEO + Tech Lead |
| GitHub repo | 3 engineers + CEO (code review required for main) |
| Production database (direct access) | Tech Lead only. Read-only access for AI Engineer via Neon read replica. |

### 7.4 GDPR/CCPA Compliance (PRD Constraint)

| Requirement | Implementation |
|-------------|---------------|
| Right to access | `GET /account/data-export` → generates JSON of all owner data |
| Right to deletion | `DELETE /account` → soft delete → 90-day grace → hard delete + anonymized aggregates retained |
| Data portability | Data export in JSON (structured, machine-readable) |
| Consent tracking | Onboarding captures explicit consent for data processing. Stored in `users.consent_at`. |
| Cookie policy | No cookies on customer-generated websites. App uses auth tokens, not cookies. |

---

## 8. Scaling Triggers

The current architecture handles 300-10,000 users without changes. These are the triggers for re-architecture:

| Trigger | Threshold | Action |
|---------|-----------|--------|
| Database compute saturation | Neon compute hours > 80% of plan limit consistently | Upgrade Neon plan or add read replicas for analytics queries |
| Job queue backlog | BullMQ jobs waiting > 5 minutes consistently | Add dedicated worker process (separate from API) |
| AI latency degradation | Anthropic p95 > 10 seconds consistently | Implement response caching for common patterns, pre-generate template content |
| Storage growth | R2 storage > 1 TB | Implement lifecycle policies (compress old images, delete unused assets) |
| Benchmark query performance | Aggregate queries > 2 seconds | Migrate benchmark_aggregates to TimescaleDB or ClickHouse |
| Team growth beyond 8 engineers | When coordination cost exceeds build cost | Split monorepo into service boundaries (API, AI pipeline, integrations) |

---

## 9. Decision Traceability

| Infrastructure Decision | Traces To |
|------------------------|-----------|
| GitHub Actions CI/CD | team-personas.md: 3 engineers, minimal ops overhead |
| Vercel auto-deploy from main | team-personas.md: "ship fast," zero-config deployment |
| Neon branching for preview envs | team-personas.md: PR-based workflow, Tech Lead reviews all code |
| No feature flags in v1 | team-personas.md: 6 people, 300 users — complexity not justified |
| Forward-only migrations | team-personas.md: "ship, then polish" — fix forward, don't roll back |
| Sentry over Datadog | Cost constraint: $2M seed round, $790K-$960K payroll |
| EAS for mobile builds | tech-stack.md: Expo managed workflow, OTA updates |
| Structured JSON logging | Product: "when Maria reports 'my post didn't go through,' find it in seconds" |
| AI cost logging per call | market-fit.md: validate 6.7% AI cost projection |
| GDPR data export/deletion | PRD: "GDPR/CCPA compliant for customer data handling" |
| $1,521/month total infrastructure | market-fit.md: $44 ARPU, must be profitable at 300 users |
