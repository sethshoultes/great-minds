# LocalGenius — Integration Plan

**Author**: Elon Musk, Chief Product & Growth Officer
**Date**: 2026-04-02
**Status**: Architecture Plan — Execute When API Keys Available

---

## Overview

LocalGenius currently mocks all external platform integrations. This document defines the exact wiring plan for when production API keys are available. Each integration follows the same pattern: OAuth connect → background sync → action execution → attribution tracking.

---

## 1. Google Business Profile API

### Connection Flow
1. Owner taps "Connect Google" in conversation → redirect to Google OAuth consent screen
2. Scopes requested: `https://www.googleapis.com/auth/business.manage`
3. Callback stores access + refresh tokens in `business_settings` (encrypted via ENCRYPTION_KEY)
4. Initial sync: pull business profile, reviews, photos, insights

### Endpoints to Implement

| File | Endpoint | Google API | Purpose |
|------|----------|-----------|---------|
| `src/app/api/integrations/google/connect/route.ts` | `GET` | OAuth2 | Initiate OAuth flow |
| `src/app/api/integrations/google/callback/route.ts` | `GET` | OAuth2 | Handle callback, store tokens |
| `src/services/google/reviews.ts` | Internal | `accounts.locations.reviews.list` | Pull reviews (4x/day cron) |
| `src/services/google/reviews.ts` | Internal | `accounts.locations.reviews.updateReply` | Post AI-generated responses |
| `src/services/google/profile.ts` | Internal | `accounts.locations.patch` | Update description, hours, categories |
| `src/services/google/insights.ts` | Internal | `accounts.locations.reportInsights` | Pull search impressions, calls, directions |

### Rate Limits & Mitigation
- **60 requests/minute per project** (not per user)
- At 300 businesses × 4 syncs/day = 1,200 sync operations/day
- Each sync = 2-3 API calls (reviews + insights + profile check) = ~3,600 calls/day
- At 60/min = need to spread across 60 minutes per sync cycle
- **Implementation**: BullMQ rate-limited queue with `limiter: { max: 50, duration: 60000 }`

### Token Refresh
- Google access tokens expire in 1 hour
- Proactive refresh: cron job every 30 min checks `token_expires_at < now() + 60min`
- On refresh failure: set `connection_status = 'expired'`, notify owner in conversation thread

### Required Environment Variables
```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=https://api.localgenius.com/api/integrations/google/callback
```

### Implementation Sequence (3 days)
1. Day 1: OAuth flow + token storage + manual review pull
2. Day 2: Background review sync cron + auto-response posting
3. Day 3: Profile optimization + insights sync + attribution events

---

## 2. Meta Graph API (Instagram + Facebook)

### Connection Flow
1. Owner taps "Connect Instagram" → Facebook Login OAuth (Instagram requires Facebook Login)
2. Scopes: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`, `pages_manage_posts`
3. Token exchange: short-lived token → long-lived token (60 days)
4. Page selection: if owner manages multiple pages, present selector

### Endpoints to Implement

| File | Endpoint | Meta API | Purpose |
|------|----------|---------|---------|
| `src/app/api/integrations/meta/connect/route.ts` | `GET` | OAuth2 | Initiate Facebook Login |
| `src/app/api/integrations/meta/callback/route.ts` | `GET` | OAuth2 | Handle callback, exchange tokens |
| `src/services/meta/instagram.ts` | Internal | `POST /{ig-user-id}/media` + `POST /{ig-user-id}/media_publish` | Publish photos with captions |
| `src/services/meta/facebook.ts` | Internal | `POST /{page-id}/feed` | Publish page posts |
| `src/services/meta/insights.ts` | Internal | `GET /{media-id}/insights` | Pull engagement metrics |

### Instagram Publishing Constraints
- Instagram API requires a **public** image URL (cannot upload binary directly)
- Flow: upload image to Cloudflare R2 → get public URL → pass to Instagram API → create media container → publish
- Carousel posts (multiple images): create individual containers, then single publish call
- Stories: separate endpoint (`/media` with `media_type=STORIES`)

### Rate Limits
- **200 calls/user/hour** — generous for our usage (~5 calls/day/user)
- **25 content publishes per day per user** — we plan ~12 posts/month = well within limit

### Token Lifecycle
- Long-lived tokens: 60 days. Refresh before expiry.
- If token expires: Instagram posting fails silently → detect in cron → notify owner
- Token refresh endpoint: `GET /oauth/access_token?grant_type=fb_exchange_token`

### Required Environment Variables
```
META_APP_ID=xxxxx
META_APP_SECRET=xxxxx
META_REDIRECT_URI=https://api.localgenius.com/api/integrations/meta/callback
```

### Implementation Sequence (3 days)
1. Day 1: OAuth flow + token storage + page selection
2. Day 2: Facebook post publishing + image upload to R2
3. Day 3: Instagram publishing + engagement sync + attribution

---

## 3. Yelp Fusion API

### Important Limitation
**Yelp does NOT allow programmatic review responses.** We can read reviews but cannot post responses via API. Response flow:
1. LocalGenius drafts response
2. Owner approves
3. App opens Yelp deep link: `yelp:///biz/{business-id}` (mobile) or `https://biz.yelp.com/biz/{id}/reviews` (web)
4. Owner pastes the response manually

### Endpoints to Implement

| File | Endpoint | Yelp API | Purpose |
|------|----------|---------|---------|
| `src/services/yelp/search.ts` | Internal | `GET /v3/businesses/search` | Onboarding: find business on Yelp |
| `src/services/yelp/reviews.ts` | Internal | `GET /v3/businesses/{id}/reviews` | Pull reviews (4x/day) |

### Rate Limits
- **5,000 calls/day** — at 300 users × 4 syncs = 1,200 calls. Ample headroom.
- No per-minute limit specified, but implement 10 req/sec to be safe.

### Required Environment Variables
```
YELP_API_KEY=xxxxx
```

### Implementation Sequence (1 day)
1. Business matching during onboarding + review sync cron

---

## 4. Stripe (Payments)

### Connection Flow
- No OAuth — server-side integration only
- Create Stripe customer on registration → store `stripe_customer_id` on organizations table
- Subscription created after onboarding completion (or after free trial if we add one)

### Endpoints to Implement

| File | Endpoint | Stripe API | Purpose |
|------|----------|-----------|---------|
| `src/app/api/billing/subscribe/route.ts` | `POST` | `POST /v1/subscriptions` | Start $29 or $79 subscription |
| `src/app/api/billing/portal/route.ts` | `POST` | `POST /v1/billing_portal/sessions` | Redirect to Stripe portal |
| `src/app/api/webhooks/stripe/route.ts` | `POST` | Webhooks | Handle payment events |

### Webhook Events to Handle
- `invoice.payment_succeeded` → update org plan status
- `invoice.payment_failed` → notify owner, grace period
- `customer.subscription.deleted` → downgrade to free/inactive
- `customer.subscription.updated` → handle plan changes

### Required Environment Variables
```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### Implementation Sequence (2 days)
1. Day 1: Customer creation + subscription + webhook handling
2. Day 2: Billing portal + conversation-integrated upgrade prompts

---

## 5. Cloudflare R2 (Media Storage)

### Purpose
Store owner photos, AI-generated images, and website assets. Zero egress fees.

### Implementation
- Use `@aws-sdk/client-s3` with R2-compatible endpoint
- Upload flow: owner photo → resize via `sharp` → upload to R2 → return public URL
- Public URL format: `https://media.localgenius.com/{business_id}/{asset_id}.{ext}`

### Required Environment Variables
```
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET_NAME=localgenius-media
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://media.localgenius.com
```

---

## 6. Integration Priority Matrix

| Integration | Business Impact | Engineering Effort | Priority | Ship By |
|------------|:-:|:-:|:-:|:-:|
| Google Business Profile | Critical (reviews = revenue) | 3 days | **P0** | Week 1 |
| Stripe (payments) | Critical (no revenue without it) | 2 days | **P0** | Week 1 |
| Cloudflare R2 (media) | High (photos for social + website) | 1 day | **P1** | Week 1 |
| Meta/Instagram | High (social posting is core feature) | 3 days | **P1** | Week 2 |
| Meta/Facebook | Medium (secondary social channel) | Included with Instagram | **P1** | Week 2 |
| Yelp Fusion | Medium (review monitoring, no posting) | 1 day | **P2** | Week 2 |

**Total: 10 engineering days across 2 weeks.** One engineer (Tech Lead or AI Engineer) can own all integrations.

---

## 7. Testing Strategy

Each integration gets:
1. **Unit tests**: Mock external API responses, verify our processing logic
2. **Integration test**: Real API call to sandbox/test environment (Google has a test GBP, Stripe has test mode)
3. **Webhook test**: Stripe CLI (`stripe listen --forward-to`) for local webhook testing

Test environment API keys stored in GitHub Actions secrets for CI. Never in `.env.example`.

---

## 8. Monitoring & Alerting

When integrations go live, add these Sentry alerts:

| Alert | Condition | Action |
|-------|-----------|--------|
| OAuth token refresh failure | >3 failures for same platform in 1 hour | Slack #eng-alerts |
| External API error rate | >10% of calls to any platform fail in 15 min | Slack #eng-alerts |
| Review sync backlog | Any business >24 hours since last sync | Slack #eng-alerts |
| Stripe webhook failure | Any webhook returns non-200 | PagerDuty (P1) |
