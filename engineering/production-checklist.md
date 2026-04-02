# LocalGenius — Production Readiness Checklist

**Date**: 2026-04-01
**Status**: Pre-Launch Gate
**Owners**: Tech Lead (primary), CEO (sign-off)

---

## 1. Security Audit

### Environment Variables

- [ ] Verify `.env.local` is in `.gitignore` — no secrets in version control
- [ ] Confirm no `NEXT_PUBLIC_` prefix on sensitive vars. Only `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` should be client-exposed (see `engineering/integration-plan.md` Section 4)
- [ ] All production secrets set in Vercel environment variable management (encrypted at rest):
  - `DATABASE_URL` (Neon production connection string)
  - `ANTHROPIC_API_KEY`
  - `REDIS_URL` (Upstash production)
  - `STRIPE_SECRET_KEY` (live mode: `sk_live_*`)
  - `STRIPE_WEBHOOK_SECRET` (`whsec_*`)
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
  - `META_APP_ID` / `META_APP_SECRET`
  - `YELP_API_KEY`
  - `ENCRYPTION_KEY` (AES-256-GCM for platform token encryption)
  - `JWT_SECRET` (minimum 256-bit random value)
  - `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`
  - `SENTRY_DSN`
- [ ] Run `grep -r "NEXT_PUBLIC_" src/` and verify each match is intentional and contains no secrets
- [ ] Verify build output contains no leaked env vars: `grep -r "sk_live\|whsec_\|ANTHROPIC_API_KEY" .next/` returns nothing

### CORS

- [ ] Verify Next.js API routes use default same-origin policy — no `Access-Control-Allow-Origin: *`
- [ ] Search codebase for explicit CORS headers: `grep -r "Access-Control-Allow" src/` — if found, confirm allowlist is restricted to `https://localgenius.com` and `https://api.localgenius.com`
- [ ] Verify webhook endpoints (`/api/webhooks/stripe`) skip CORS but validate signatures

### Rate Limiting

- [ ] `@upstash/ratelimit` configured on auth endpoints: **10 requests per 15 minutes** per IP (per `api-design.md` Section 6.1)
  - Endpoints: `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`
- [ ] Content generation rate limit: **20 requests per hour** per business
  - Endpoints: `/content/social-post`, `/content/review-response`, `/content/email-campaign`, `/content/regenerate/*`
- [ ] Conversation messages: **30 messages per hour** per business
- [ ] Media upload: **20 uploads per hour** per business
- [ ] Rate limit headers included in responses: `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- [ ] Verify 429 response matches error format from `api-design.md` Section 5.1

### SQL Injection Protection

- [ ] All database queries use Drizzle ORM parameterized queries (see `src/db/schema.ts`)
- [ ] Search for raw SQL: `grep -r "sql\`" src/` and `grep -r "db.execute" src/` — verify no user input is interpolated into SQL strings
- [ ] The only raw SQL should be `set_config` in `src/api/middleware/tenant.ts` which uses parameterized `$1` placeholder (verified: `params: [auth.organizationId]`)
- [ ] Zod validation (`zod`) applied at all API boundaries before any database interaction

### XSS Protection

- [ ] Search for `dangerouslySetInnerHTML` — verify it is not used with any user-supplied or AI-generated content
- [ ] Verify React auto-escaping is not bypassed in conversation thread rendering
- [ ] AI-generated content (social posts, review responses, digests) is rendered as text nodes, not raw HTML
- [ ] Content-Security-Policy header set in `next.config.js` or middleware

### JWT Security

- [ ] Access tokens expire in **15 minutes** — verified in `src/api/middleware/auth.ts` line 88: `.setExpirationTime("15m")`
- [ ] Refresh tokens expire in **30 days** — verified in `src/api/middleware/auth.ts` line 100: `.setExpirationTime("30d")`
- [ ] Refresh token rotation implemented: each use of a refresh token invalidates the old one and issues a new pair
- [ ] `JWT_SECRET` is **not** the default `"dev-secret-change-in-production"` — verify `process.env.JWT_SECRET` is set in Vercel production environment (see `src/api/middleware/auth.ts` line 22)
- [ ] JWT algorithm is HS256 (verified in `auth.ts` line 85: `{ alg: "HS256" }`)
- [ ] Mobile app stores refresh token in Expo SecureStore (not AsyncStorage)
- [ ] Revoked refresh tokens tracked in Redis or database to prevent reuse

### Password Hashing

- [ ] PBKDF2 with **100,000 iterations** — verified in `src/lib/password.ts` line 5: `const ITERATIONS = 100000`
- [ ] SHA-256 hash function used (verified in `password.ts` line 19: `hash: "SHA-256"`)
- [ ] 16-byte random salt per password (verified in `password.ts` line 9: `new Uint8Array(16)`)
- [ ] 64-byte hash output (verified in `password.ts` line 6: `const HASH_LENGTH = 64`)
- [ ] Uses Web Crypto API (edge runtime compatible, no native dependency)
- [ ] Timing-safe comparison: verify `verifyPassword` uses constant-time comparison (NOTE: current implementation in `password.ts` line 49 uses `===` which is not timing-safe — consider `crypto.timingSafeEqual` or accept risk given PBKDF2 cost)

### Multi-Tenant Isolation (RLS)

- [ ] Row-Level Security enabled on all **14 tenant-scoped tables** per `data-model.md`:
  1. `organizations`
  2. `businesses`
  3. `users`
  4. `conversations`
  5. `messages`
  6. `actions`
  7. `content_items`
  8. `reviews`
  9. `review_responses`
  10. `analytics_events`
  11. `attribution_events`
  12. `weekly_digests`
  13. `business_settings`
  14. (verify 14th — `media_assets` or equivalent if added)
- [ ] `benchmark_aggregates` does NOT have RLS (intentional — no PII, globally readable)
- [ ] RLS policy references `current_setting('app.current_org_id')::UUID` on all tenant tables
- [ ] `setTenantContext()` in `src/api/middleware/tenant.ts` called before every authenticated query — uses `set_config('app.current_org_id', $1, true)` (the `true` parameter means transaction-scoped)
- [ ] Verify no database queries bypass RLS by using a superuser connection
- [ ] Test: authenticated as Org A, attempt to read Org B data — must return empty results

### OAuth Token Encryption

- [ ] Platform tokens (`access_token`, `refresh_token`) in `business_settings` table are encrypted with **AES-256-GCM** before storage
- [ ] `ENCRYPTION_KEY` stored only in Vercel environment variables, never in code
- [ ] Token refresh cron job (every 30 min) proactively refreshes tokens expiring within 60 minutes
- [ ] On platform disconnection or account deletion, tokens are hard-deleted immediately (not soft-deleted)

### GDPR/CCPA Compliance

- [ ] `GET /account/data-export` endpoint returns complete JSON export of all owner data
- [ ] `DELETE /account` initiates soft-delete with **90-day grace period** before hard-delete
- [ ] Hard-delete removes all PII: name, email, phone, conversation history, generated content, media assets
- [ ] Anonymized `benchmark_aggregates` survive deletion (contain no PII, no `business_id`)
- [ ] `users.consent_at` timestamp captured during onboarding (explicit consent for data processing)
- [ ] Raw `analytics_events` auto-pruned on 13-month rolling basis (cron job)
- [ ] Media assets deleted from Cloudflare R2 at 30 days post-account-deletion
- [ ] Minimum anonymity set enforced: `safe_benchmarks` view filters `sample_size >= 5`

### Dependency Audit

- [ ] Run `npm audit` — zero critical or high vulnerabilities
- [ ] Run `npm audit --production` — zero vulnerabilities in production dependencies
- [ ] Review `package-lock.json` for known problematic packages
- [ ] Verify `jose` (JWT), `drizzle-orm`, `@upstash/ratelimit`, `zod` are on latest stable versions

---

## 2. Performance

### API Response Times

- [ ] Non-AI endpoints: target **< 200ms p95** (per `tech-stack.md` Section 5: "< 200ms p95 for non-AI endpoints")
  - `GET /conversations/current` — test with 50 messages loaded
  - `GET /reviews` — test with 30+ reviews
  - `POST /actions/{id}/approve` — single action approval
- [ ] AI generation endpoints: target **< 15 seconds** wall clock
  - `POST /conversations/current/messages` (AI response generation via BullMQ)
  - `POST /content/social-post` (Sonnet 4.6)
  - `POST /content/review-response` (Sonnet 4.6)
- [ ] SSE streaming (`GET /conversations/current/stream`): first token within **2 seconds**
- [ ] Response timeout hard ceiling: **30 seconds** (per `api-design.md` Section 6.2)

### Database Query Performance

- [ ] Verify all indexes defined in `src/db/schema.ts` are created in production Neon:
  - `idx_businesses_org` on `businesses(organization_id)`
  - `idx_users_business` on `users(business_id)`
  - `idx_users_email` on `users(email)`
  - `idx_conversations_business` on `conversations(business_id)`
  - `idx_messages_conversation` on `messages(conversation_id, created_at)`
  - `idx_messages_business` on `messages(business_id, created_at)`
  - `idx_actions_business_type` on `actions(business_id, action_type, created_at)`
  - `idx_actions_status` on `actions(status)`
  - `idx_actions_external` on `actions(external_platform, external_id)`
  - `idx_content_items_business` on `content_items(business_id, content_type, created_at)`
  - `idx_reviews_unique` (unique) on `reviews(business_id, platform, external_review_id)`
  - `idx_reviews_business_date` on `reviews(business_id, review_date)`
  - `idx_reviews_sentiment` on `reviews(business_id, sentiment, review_date)`
  - `idx_review_responses_review` on `review_responses(review_id)`
  - `idx_analytics_events_business` on `analytics_events(business_id, occurred_at)`
  - `idx_analytics_events_type` on `analytics_events(event_type, occurred_at)`
  - `idx_attribution_business` on `attribution_events(business_id, occurred_at)`
  - `idx_attribution_action` on `attribution_events(action_id)`
  - `idx_attribution_type` on `attribution_events(event_type, occurred_at)`
  - `idx_digests_business` on `weekly_digests(business_id, period_start)`
  - `idx_benchmarks_unique` (unique) on `benchmark_aggregates(vertical, city, size_bucket, period_type, period_start, metric_name)`
  - `idx_benchmarks_lookup` on `benchmark_aggregates(vertical, city, size_bucket, metric_name, period_start)`
  - `idx_settings_business_platform` (unique) on `business_settings(business_id, platform)`
  - `idx_settings_status` on `business_settings(connection_status)`
- [ ] Run `EXPLAIN ANALYZE` on the 5 hottest queries:
  1. Fetch latest 50 messages for a conversation
  2. List pending actions for a business
  3. Pull unresponded reviews for a business
  4. Fetch weekly digest by business + period
  5. Benchmark lookup by vertical + city + size_bucket
- [ ] No sequential scans on tables expected to exceed 10K rows

### Connection Pooling

- [ ] Neon built-in PgBouncer enabled (default for serverless driver)
- [ ] Verify connection string uses pooled endpoint: `*-pooler.*.neon.tech` (not direct)
- [ ] No connection leaks: verify all database clients are properly closed/returned to pool
- [ ] Set `max_connections` appropriate for Vercel serverless (Neon handles this, but verify no application-level pool conflicts)

### CDN & Static Assets

- [ ] Vercel Edge Network serves Next.js static assets (automatic with Vercel deployment)
- [ ] Cloudflare CDN configured for R2 media: `media.localgenius.com` → Cloudflare R2 public bucket
- [ ] Cache-Control headers set on media assets: `public, max-age=31536000, immutable` (content-addressed URLs)
- [ ] Generated customer websites on Cloudflare Pages: verify First Contentful Paint **< 1 second** (per `tech-stack.md` Section 5)

### Image Optimization

- [ ] `sharp` resizes owner photos before R2 upload (per `tech-stack.md`: "Resize/optimize owner photos")
- [ ] Maximum upload dimensions and file size enforced (10 MB limit per `api-design.md` Section 6.2)
- [ ] WebP format used where browser supports it
- [ ] Social post images generated at platform-optimal dimensions (Instagram: 1080x1080, Facebook: 1200x630)

### Caching Strategy

- [ ] Redis (Upstash) caches:
  - Rate limit counters (`@upstash/ratelimit`)
  - Session/refresh token blacklist (for rotation invalidation)
  - BullMQ job queue state
- [ ] Consider edge caching for Weekly Digest data (read-heavy, updated weekly)
- [ ] Conversation messages: no caching needed (real-time, always fresh)
- [ ] Benchmark data: consider 1-hour TTL cache (updated weekly, read frequently)

### Bundle Size

- [ ] First Load JS under **100 KB** (target from `tech-stack.md`: current estimate 87.3 KB shared + per-page)
- [ ] Run `next build` and verify bundle analysis output
- [ ] No unnecessary client-side dependencies (AI SDK, database drivers must be server-only)
- [ ] Verify `@anthropic-ai/sdk`, `drizzle-orm`, `bullmq`, `sharp` are not in client bundle

---

## 3. Monitoring & Observability

### Error Tracking (Sentry)

- [ ] Sentry SDK initialized in both Next.js server and client
- [ ] Source maps uploaded to Sentry on every deploy (GitHub Actions post-deploy step)
- [ ] Performance monitoring: **20% transaction sample rate** (per `infrastructure.md` Section 3.1)
- [ ] Session replay enabled for error sessions only (privacy + cost)
- [ ] Sentry release tracking tied to git commit SHA

### Uptime Monitoring (BetterUptime)

- [ ] `https://api.localgenius.com/health` checked every **60 seconds**
- [ ] `https://localgenius.com` checked every **60 seconds**
- [ ] Status page live at `status.localgenius.com`
- [ ] Health endpoint returns:
  - Database connectivity (Neon)
  - Redis connectivity (Upstash)
  - Timestamp and version

### Log Aggregation

- [ ] Structured JSON logging on all API routes (per `infrastructure.md` Section 4.1):
  ```json
  { "level", "message", "timestamp", "request_id", "organization_id", "business_id", "user_id", "endpoint", "duration_ms", "metadata" }
  ```
- [ ] Vercel log drain configured (built-in with Pro plan)
- [ ] Optional: Axiom drain ($25/month) for 30-day searchable log retention — add after first incident requiring log search > 1 hour
- [ ] `debug` level logging disabled in production (PII risk + volume per `infrastructure.md` Section 4.2)

### AI Cost Tracking

- [ ] Every AI generation call logs to `messages` table:
  - `ai_model` (e.g., `sonnet-4.6`, `haiku-4.5`)
  - `tokens_input` (input token count)
  - `tokens_output` (output token count)
- [ ] `content_items.tokens_used` populated for all generated content
- [ ] AI cost dashboard or query available to validate **< 6.7% of revenue** target (per `infrastructure.md` Section 6.4)
- [ ] Log AI call latency, retry count, and cache hit status per `infrastructure.md` Section 4.3

### Database Monitoring

- [ ] Neon dashboard accessible: connection count, query latency, storage usage, compute hours
- [ ] Upstash dashboard accessible: Redis memory usage, command rate, BullMQ queue depth
- [ ] Alert if Neon compute hours exceed 80% of plan limit (scaling trigger per `infrastructure.md` Section 8)

### Alert Thresholds (Sentry + Slack)

- [ ] **Error spike**: > 10 errors in 5 minutes (any endpoint) → Slack `#eng-alerts` + PagerDuty → **P1**
- [ ] **AI generation failure rate**: > 5% of AI calls fail in 15 minutes → Slack `#eng-alerts` → **P2**
- [ ] **API latency degradation**: p95 > 3 seconds for non-AI endpoints → Slack `#eng-alerts` → **P2**
- [ ] **Payment webhook failure**: any Stripe webhook returns non-200 → Slack `#eng-alerts` + PagerDuty → **P1**
- [ ] **OAuth token refresh failure**: > 3 failures for same platform in 1 hour → Slack `#eng-alerts` → **P2**
- [ ] **External API error rate**: > 10% of calls to any platform fail in 15 minutes → Slack `#eng-alerts`
- [ ] **Review sync backlog**: any business > 24 hours since last sync → Slack `#eng-alerts`
- [ ] **BullMQ job backlog**: jobs waiting > 5 minutes consistently → Slack `#eng-alerts`

---

## 4. Deployment Checklist (Pre-Launch)

### Environment & Infrastructure

- [ ] All environment variables set in Vercel production environment (see Section 1 list)
- [ ] `JWT_SECRET` is a cryptographically random 256-bit value (not the dev default)
- [ ] `ENCRYPTION_KEY` is a cryptographically random 256-bit value for AES-256-GCM
- [ ] Database schema pushed to production Neon via `drizzle-kit push`
- [ ] All RLS policies applied to production database (run migration SQL from `data-model.md`)
- [ ] `safe_benchmarks` view created in production database
- [ ] Redis (Upstash) production instance provisioned and connected

### External Services

- [ ] **Stripe**: Live mode keys configured (`sk_live_*`, `pk_live_*`)
- [ ] **Stripe**: Webhooks configured pointing to `https://api.localgenius.com/api/webhooks/stripe`
- [ ] **Stripe**: Webhook signing secret (`whsec_*`) set in Vercel env
- [ ] **Stripe**: Test a subscription creation and cancellation in live mode
- [ ] **Stripe**: Products and prices created for Base ($29/mo) and Pro ($79/mo) plans
- [ ] **Google**: OAuth app approved for production (verified status, not "Testing")
- [ ] **Google**: Redirect URI set to `https://api.localgenius.com/api/integrations/google/callback`
- [ ] **Google**: GBP API quota confirmed (60 req/min default)
- [ ] **Meta**: App reviewed and approved for production (requires Facebook App Review)
- [ ] **Meta**: Permissions approved: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`, `pages_manage_posts`
- [ ] **Meta**: Redirect URI set to `https://api.localgenius.com/api/integrations/meta/callback`
- [ ] **Yelp**: Fusion API key provisioned (5,000 calls/day limit confirmed)
- [ ] **Anthropic**: Production API key with appropriate rate limits
- [ ] **Replicate**: Production API key for Flux image generation
- [ ] **Twilio/SendGrid**: Production credentials, sender domain verified

### Domain & SSL

- [ ] Domain `localgenius.com` configured → Vercel deployment
- [ ] `api.localgenius.com` subdomain configured (if separate from main)
- [ ] `media.localgenius.com` configured → Cloudflare R2 public bucket
- [ ] `status.localgenius.com` configured → BetterUptime status page
- [ ] SSL/TLS verified on all domains (automatic via Vercel + Cloudflare)
- [ ] HTTPS redirect enforced (Vercel default)
- [ ] HSTS header enabled

### Cron Jobs & Background Workers

- [ ] BullMQ workers running and processing jobs:
  - Social post scheduling
  - Review monitoring sync (4x/day per business)
  - SEO analysis (batch, Haiku 4.5)
  - Weekly Digest generation (Monday 5 AM per timezone)
  - Website deployment to Cloudflare Pages
  - Platform token refresh (every 30 min)
  - Analytics event aggregation
  - Raw event pruning (13-month rolling)
- [ ] Cron job registered in Vercel dashboard (or via `vercel.json`)
- [ ] Verify cron timing: Digest generation runs at 5 AM in each business's timezone
- [ ] Rate-limited queue for Google API: `limiter: { max: 50, duration: 60000 }` (per `integration-plan.md`)

### Monitoring & Alerting

- [ ] Sentry DSN configured for production environment
- [ ] Sentry source map upload configured in deploy pipeline
- [ ] BetterUptime monitoring active on `/api/health` and root domain
- [ ] Slack `#eng-alerts` channel created and webhook configured
- [ ] All alert rules from Section 3 configured in Sentry

### Validation & Testing

- [ ] Demo data seeded: "Maria's Kitchen" test business for team smoke testing
- [ ] End-to-end test: register → onboard → generate content → approve → publish
- [ ] End-to-end test: Stripe subscription lifecycle (create, invoice, cancel)
- [ ] End-to-end test: Google OAuth connect → review sync → auto-response
- [ ] End-to-end test: Meta OAuth connect → Instagram post publish
- [ ] **Load test**: simulate **50 concurrent users** (per infrastructure sizing for 300 users)
  - Verify no connection pool exhaustion
  - Verify rate limiters function under load
  - Verify AI generation queue handles burst without timeout
- [ ] Mobile app (Expo): verify builds on iOS and Android via EAS Build
- [ ] Mobile app: verify OTA update mechanism works

---

## 5. Operational Runbook

### Incident Response

| Severity | Definition | Response Time | Responder |
|----------|-----------|:-------------:|-----------|
| **P1** | Production down, payments failing, data loss risk | **15 minutes** | Tech Lead (primary), CEO (customer comms) |
| **P2** | Feature degraded (AI slow, one platform integration down) | **1 hour** | On-call engineer |
| **P3** | Minor issue, workaround exists | **Next business day** | Assigned in Linear |

- [ ] On-call rotation defined: Tech Lead → AI Engineer → Mobile Engineer (weekly rotation)
- [ ] Escalation path documented: Slack `#eng-alerts` → phone call after 5 min no-ack
- [ ] P1 post-mortem template created in `docs/incidents/` (What → Why → Action items)
- [ ] Customer communication template ready for major outages

### Rollback Procedure

- [ ] **Application rollback**: one-click "Promote to Production" on previous deployment in Vercel dashboard (< 30 seconds, zero downtime)
- [ ] **Database rollback**: Neon point-in-time recovery available. Verify backup window covers at least 7 days.
- [ ] **Migration rollback**: forward-only migrations (per `infrastructure.md` Section 1.3) — deploy corrective migration, do not revert schema
- [ ] **Mobile app rollback**: push OTA update via EAS Update to revert JS bundle. Native changes require new store submission.
- [ ] Document: who has Vercel dashboard access to trigger rollback (Tech Lead + CEO)

### Database Backup & Recovery

- [ ] Neon point-in-time recovery enabled and verified
- [ ] Verify recovery window: minimum **7 days** of point-in-time recovery
- [ ] Test restore: create Neon branch from 24-hours-ago point-in-time, verify data integrity
- [ ] Media assets (R2): Cloudflare R2 versioning or backup strategy confirmed
- [ ] Document recovery procedure: who initiates, expected RTO, data loss tolerance

### Secret Rotation

| Secret | Rotation Frequency | Procedure |
|--------|:------------------:|-----------|
| `JWT_SECRET` | Every 90 days or on compromise | 1. Generate new secret. 2. Set in Vercel as new env var. 3. Deploy — all existing access tokens (15 min TTL) expire naturally. 4. Refresh tokens will fail — users re-login once. |
| `ENCRYPTION_KEY` | On compromise only | 1. Generate new key. 2. Run migration to re-encrypt all `business_settings.access_token` and `refresh_token` values. 3. Set new key in Vercel. 4. Deploy. |
| `ANTHROPIC_API_KEY` | On compromise or annually | 1. Generate new key in Anthropic dashboard. 2. Set in Vercel. 3. Deploy. Zero downtime — new key active on next function invocation. |
| `STRIPE_SECRET_KEY` | On compromise only | 1. Roll key in Stripe dashboard (Stripe supports rolling keys with overlap). 2. Set new key in Vercel. 3. Deploy. |
| `STRIPE_WEBHOOK_SECRET` | On compromise only | 1. Create new webhook endpoint in Stripe. 2. Set new secret in Vercel. 3. Deploy. 4. Delete old webhook endpoint. |
| `GOOGLE_CLIENT_SECRET` | On compromise only | 1. Regenerate in Google Cloud Console. 2. Set in Vercel. 3. Deploy. Existing OAuth tokens remain valid. |
| `META_APP_SECRET` | On compromise only | 1. Reset in Meta Developer Console. 2. Set in Vercel. 3. Deploy. Existing long-lived tokens remain valid. |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | On compromise or annually | 1. Create new key pair in Cloudflare. 2. Set in Vercel. 3. Deploy. 4. Delete old key pair after confirming new one works. |

- [ ] Secret rotation procedure documented and accessible to Tech Lead + CEO
- [ ] Calendar reminders set for 90-day JWT_SECRET rotation
- [ ] Verify all secrets are unique across environments (dev, staging, production)

### AI Provider Failover

- [ ] Anthropic outage procedure: BullMQ retries with **30-minute window** (per `tech-stack.md` Section 4)
- [ ] If outage exceeds 30 minutes: failover to OpenAI GPT-4o with same prompt templates
- [ ] Dual-provider SDK abstraction implemented (per `tech-stack.md`: "~1 day of engineering")
- [ ] Verify failover prompt templates produce acceptable quality from GPT-4o
- [ ] User-facing degradation message: "I'm having trouble generating that right now. I'll try again in a few minutes." (per `api-design.md` Section 5.2)

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tech Lead | | | [ ] Approved |
| CEO | | | [ ] Approved |
| AI Engineer | | | [ ] Reviewed |
| Mobile Engineer | | | [ ] Reviewed |
