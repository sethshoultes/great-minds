# LocalGenius — API Design

**Author**: Elon Musk, Chief Product & Growth Officer
**Date**: 2026-04-02
**Status**: Architecture Decision Record

---

## 1. API Style: REST (Not GraphQL)

**Decision**: RESTful JSON API over HTTPS.

**Why not GraphQL**: 
- The product has two screens (Thread and Digest). The query patterns are predictable and fixed — we know exactly what data each screen needs. GraphQL's flexibility is an advantage when clients have diverse, unpredictable data needs. Ours don't.
- 3 engineers for 6 months. GraphQL adds schema management, resolver complexity, and a learning curve for the Mobile Engineer. REST endpoints are understood by everyone on day one.
- Caching: REST responses cache naturally at the CDN/edge layer (Vercel). GraphQL POST requests don't cache without additional infrastructure (persisted queries, CDN rules).
- Debugging: REST requests are readable in browser devtools and Postman. GraphQL queries require tooling (GraphiQL, Apollo DevTools).

**Convention**: JSON:API-inspired but not strict. All responses follow:
```json
{
  "data": { ... },
  "meta": { "request_id": "...", "timestamp": "..." }
}
```

Error responses:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": { ... }
  },
  "meta": { "request_id": "..." }
}
```

**Base URL**: `https://api.localgenius.com/v1`

---

## 2. Authentication & Authorization

### 2.1 User Authentication: JWT + Refresh Tokens

**Flow**:
1. Owner signs up/logs in → server issues short-lived access token (15 min) + long-lived refresh token (30 days)
2. Mobile app stores refresh token in secure storage (Expo SecureStore)
3. Access token sent as `Authorization: Bearer <token>` header on every request
4. When access token expires → app silently refreshes using refresh token
5. Refresh token rotation: each use invalidates the old refresh token and issues a new one

**JWT payload**:
```json
{
  "sub": "user_uuid",
  "org": "organization_uuid",
  "biz": "business_uuid",
  "plan": "base|pro",
  "iat": 1712000000,
  "exp": 1712000900
}
```

The `org` claim is extracted by middleware and set as `app.current_org_id` in PostgreSQL — this activates RLS policies on every query. No application code touches tenant scoping; the database enforces it.

**Why not session-based auth**: Mobile apps don't have cookie jars. JWT is the native pattern for mobile API authentication. The 15-minute access token window limits exposure if a token is compromised.

### 2.2 Platform OAuth: Token Vault

External platform integrations (Google, Meta, Yelp) use OAuth2. Tokens stored in `platform_connections` table, encrypted at rest (AES-256-GCM, encryption key in environment variable, never in code).

**Token refresh flow**: A scheduled job (every 30 minutes) checks `token_expires_at` for all connections expiring in the next 60 minutes and refreshes proactively. If refresh fails → `connection_status` set to `expired` → owner notified via conversation thread: "Your Instagram connection needs to be refreshed. Tap here to reconnect."

---

## 3. Core API Endpoints

### 3.1 Auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/register` | Create account (email + password or OAuth) |
| `POST` | `/auth/login` | Issue access + refresh tokens |
| `POST` | `/auth/refresh` | Exchange refresh token for new token pair |
| `POST` | `/auth/logout` | Revoke refresh token |
| `POST` | `/auth/forgot-password` | Send password reset email |
| `POST` | `/auth/reset-password` | Complete password reset |

### 3.2 Onboarding

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/onboarding/start` | Create org + business + conversation. Input: business name, type, city. Triggers discovery jobs. |
| `GET` | `/onboarding/discovery` | Poll discovery results (Google/Yelp/Meta data found for this business). |
| `POST` | `/onboarding/confirm` | Confirm discovered data is correct. |
| `POST` | `/onboarding/photos` | Upload photos (multipart). Stores in R2, creates media_assets. |
| `POST` | `/onboarding/priority` | Set priority focus (found_online, reviews, social). |
| `POST` | `/onboarding/complete` | Finalize onboarding. Triggers website gen, first social post, GBP optimization. Returns "The Reveal" data. |

**Onboarding is NOT a single endpoint** — it's a sequence that can be interrupted and resumed (product-design.md: "If she exits during onboarding, she picks up at the exact same step"). Each step is idempotent. The client tracks which step was completed locally and resumes from there.

### 3.3 Conversation (The Core Product)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/conversations/current` | Get the active conversation for the authenticated business. Returns most recent 50 messages. |
| `GET` | `/conversations/current/messages?before={cursor}` | Paginate older messages (cursor-based, 50 per page). |
| `POST` | `/conversations/current/messages` | Send an owner message. Triggers AI response generation (async — see below). |
| `GET` | `/conversations/current/messages/{id}` | Get a single message (used for polling AI response status). |

**AI Response Flow** (critical path):
1. Client sends `POST /conversations/current/messages` with `{ "content": "Post something about our lunch special" }`
2. Server immediately returns `201 Created` with the owner message AND a placeholder assistant message (`status: "generating"`)
3. Server enqueues AI generation job (BullMQ)
4. Client polls `GET /conversations/current/messages/{assistant_message_id}` every 2 seconds (or uses Server-Sent Events — see below)
5. When generation completes, the message is updated with content and any proposed actions
6. Client renders the response with action cards

**Alternative: Server-Sent Events (SSE)** for streaming AI responses:
```
GET /conversations/current/stream
Accept: text/event-stream
```
SSE allows token-by-token streaming of AI responses — the owner sees the response building in real-time, like a human typing. This is preferred UX but adds complexity. **v1 decision: implement SSE from day one.** The conversational interface IS the product. Waiting 5-10 seconds for a blank screen to fill is unacceptable for the "trusted employee" metaphor. Streaming makes the AI feel present.

### 3.4 Actions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/actions?status={status}&type={type}` | List actions (filterable by status, type). |
| `POST` | `/actions/{id}/approve` | Approve a proposed action. Triggers execution. |
| `POST` | `/actions/{id}/reject` | Reject a proposed action. |
| `POST` | `/actions/{id}/edit` | Edit and approve (sends revised content, then executes). |
| `GET` | `/actions/{id}/status` | Check execution status of an approved action. |

### 3.5 Content Generation

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/content/social-post` | Generate a social post (text + image prompt). Input: topic, tone, platform. |
| `POST` | `/content/review-response` | Generate a review response. Input: review_id. |
| `POST` | `/content/email-campaign` | Generate an email campaign. Input: audience segment, goal. |
| `POST` | `/content/regenerate/{id}` | Regenerate a piece of content (owner didn't like the first version). |

These endpoints are typically called internally by the conversation AI (not directly by the mobile client). The conversation flow is: owner speaks → AI interprets → AI calls content generation → AI presents result in thread. But they're exposed as API endpoints for the rare case where the mobile client needs to directly request content (e.g., the onboarding reveal).

### 3.6 Reviews

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/reviews?platform={platform}&responded={bool}` | List reviews, filterable. |
| `GET` | `/reviews/{id}` | Get a single review with response history. |
| `POST` | `/reviews/{id}/respond` | Post a response (approve AI draft or custom). |
| `GET` | `/reviews/summary` | Review summary stats (count, avg rating, sentiment breakdown). |

### 3.7 Website

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/website` | Get current website data (content, domain, deploy status). |
| `POST` | `/website/update` | Update website content (via conversation: "change my hours to..."). Triggers redeploy. |
| `GET` | `/website/preview` | Get a preview URL for pending changes (before deploy). |

### 3.8 Weekly Digest

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/digests` | List past digests (most recent first). |
| `GET` | `/digests/latest` | Get the most recent Weekly Digest. |
| `GET` | `/digests/{id}` | Get a specific digest. |
| `GET` | `/digests/{id}/shareable` | Get the public-shareable version (no sensitive data). Returns a URL. |

### 3.9 Analytics & Attribution

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/analytics/overview?period={weekly\|monthly}` | Business metrics summary for the given period. |
| `GET` | `/analytics/attribution?action_id={id}` | Attribution data for a specific action. |
| `GET` | `/analytics/trends?metric={metric}&period={period}` | Trend data for a specific metric (review count, website visits, etc.). |
| `GET` | `/analytics/benchmarks` | Anonymized benchmarks for this business's vertical/city/size. Uses `safe_benchmarks` view. |

---

## 4. Integration Endpoints (External Platforms)

### 4.1 Google Business Profile API

| Our Endpoint | GBP API Used | Purpose |
|-------------|-------------|---------|
| `POST /integrations/google/connect` | OAuth2 flow | Connect GBP account |
| Internal: review sync job | `accounts.locations.reviews.list` | Pull new reviews (4x/day) |
| Internal: review response job | `accounts.locations.reviews.updateReply` | Post AI-generated responses |
| Internal: GBP optimization job | `accounts.locations.patch` | Update business description, categories, hours, photos |
| Internal: metrics sync job | `accounts.locations.reportInsights` | Pull search impressions, direction requests, calls |

**Rate limit management**: GBP API allows 60 requests/min. At 300 businesses × 4 syncs/day = 1,200 requests/day. Each sync pulls reviews + insights = 2 requests. Total: 2,400 requests/day. At 60/min, this requires spreading across ~40 minutes per cycle. BullMQ handles this with rate-limited queue processing.

### 4.2 Meta Graph API (Instagram + Facebook)

| Our Endpoint | Meta API Used | Purpose |
|-------------|-------------|---------|
| `POST /integrations/meta/connect` | OAuth2 flow (Facebook Login) | Connect Instagram/Facebook |
| Internal: post publishing job | `POST /{page-id}/feed` (FB), `POST /{ig-user-id}/media` (IG) | Publish AI-generated posts |
| Internal: engagement sync job | `GET /{media-id}/insights` | Pull engagement metrics |

**Rate limit management**: 200 calls/user/hour. At 12 posts/month/user ≈ 0.4 posts/day + 4 engagement syncs/day = 4.4 calls/day/user. Nowhere near the limit.

### 4.3 Yelp Fusion API

| Our Endpoint | Yelp API Used | Purpose |
|-------------|-------------|---------|
| Internal: review sync job | `GET /v3/businesses/{id}/reviews` | Pull new Yelp reviews |
| Internal: business discovery | `GET /v3/businesses/search` | Onboarding: find business on Yelp |

**Note**: Yelp Fusion API does NOT allow posting review responses programmatically. Response drafting is done in LocalGenius; the owner must post on Yelp manually (or through Yelp's business portal). The app provides a deep link: "Tap here to post this response on Yelp."

**Rate limit**: 5,000 calls/day. At 300 users × 4 syncs/day = 1,200 calls. Ample headroom.

### 4.4 Stripe (Billing)

| Our Endpoint | Stripe API Used | Purpose |
|-------------|-------------|---------|
| `POST /billing/subscribe` | `POST /v1/subscriptions` | Create subscription ($29 or $79) |
| `POST /billing/portal` | `POST /v1/billing_portal/sessions` | Redirect to Stripe portal for plan changes |
| Webhook: `/webhooks/stripe` | Stripe webhooks | Handle payment success, failure, cancellation |

**Billing is conversation-integrated**: "Upgrade to Pro to unlock email campaigns" appears as a message in the thread with a tap-to-upgrade action. No billing settings page (product-design.md: "No Admin Panel").

---

## 5. Error Handling Patterns

### 5.1 HTTP Status Codes

| Code | Usage |
|------|-------|
| `200` | Success (GET, PUT, PATCH) |
| `201` | Created (POST that creates a resource) |
| `204` | No content (DELETE, or action with no response body) |
| `400` | Validation error (bad input — Zod catches this) |
| `401` | Unauthenticated (missing or expired token) |
| `403` | Forbidden (authenticated but wrong org — RLS would block anyway, this is defense-in-depth) |
| `404` | Not found |
| `409` | Conflict (e.g., duplicate platform connection) |
| `429` | Rate limited |
| `500` | Server error (logged, alerted) |
| `503` | Service unavailable (AI provider down, external API down) |

### 5.2 AI Generation Errors

When AI generation fails (provider outage, content filter, timeout):

1. **First attempt fails** → automatic retry with same prompt (BullMQ retry with 30-second backoff)
2. **Retry fails** → try fallback provider (OpenAI GPT-4o) with same prompt
3. **Fallback fails** → return error message to conversation thread:
   > "I'm having trouble generating that right now. I'll try again in a few minutes. In the meantime, is there anything else I can help with?"
4. **Error is logged** with full context (prompt, model, error type) for debugging

The owner never sees a technical error. The conversation metaphor is maintained: the "employee" is having a brief difficulty, not a system failure.

### 5.3 External Platform Errors

When a platform integration fails (Google API down, Meta rate limit, Yelp timeout):

1. Action status set to `failed` with `error_details` JSON
2. Automatic retry: 3 attempts with exponential backoff (1 min, 5 min, 15 min)
3. If all retries fail → owner notification via conversation thread:
   > "I couldn't post to Instagram right now — their service is having issues. I've saved the post and will try again in an hour."
4. Scheduled retry at 1-hour intervals for up to 24 hours
5. If still failing after 24 hours → escalate to conversation thread:
   > "Instagram has been down for a while. Would you like me to post this to Facebook instead, or wait?"

---

## 6. Rate Limiting

### 6.1 Per-Business Limits

| Endpoint Category | Rate Limit | Window | Rationale |
|-------------------|-----------|--------|-----------|
| Auth (login/register) | 10 requests | 15 min | Brute force protection |
| Conversation messages | 30 messages | 1 hour | Generous — ~1 message every 2 min. Power users during setup. |
| Content generation | 20 requests | 1 hour | AI cost control. Each generation costs ~$0.01-0.05. |
| Action approval | 50 requests | 1 hour | Batch approval during onboarding (approve all generated content). |
| Analytics queries | 60 requests | 1 hour | Dashboard polling (digest view refreshes). |
| Media upload | 20 uploads | 1 hour | Onboarding photo upload (3-6 photos) + ongoing updates. |

### 6.2 Global Limits

| Resource | Limit | Rationale |
|----------|-------|-----------|
| Request body size | 10 MB | Photo uploads. Social post text is < 1 KB. |
| Response timeout | 30 seconds | AI generation can take 5-15 seconds. 30s is the hard ceiling. |
| SSE connection duration | 5 minutes | Single response stream. Reconnect for next interaction. |

Rate limits are implemented with `@upstash/ratelimit` (Redis-backed, sliding window). Rate limit headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset`) are included in every response.

---

## 7. API Versioning

**Strategy**: URL-based versioning (`/v1/...`). All current endpoints are v1.

**Breaking change policy**: No breaking changes to v1 endpoints for 12 months after v2 launch. Mobile app users don't update promptly — we must support old API versions until forced update.

**Non-breaking additions** (new fields, new endpoints) are added to v1 without version bump.

---

## 8. Decision Traceability

| API Decision | Traces To |
|-------------|-----------|
| REST over GraphQL | team-personas.md: 3 engineers, 6 months. Simplicity wins. |
| JWT with organization_id claim | Locked Decision #4 + data-model.md: RLS enforcement |
| SSE for AI responses | product-design.md: conversational interface must feel real-time |
| Conversation-integrated billing | product-design.md: "No Admin Panel" |
| Onboarding as resumable step sequence | product-design.md: "If she exits during onboarding, she picks up at the exact same step" |
| Yelp response via deep link (not API) | Yelp Fusion API limitation — no programmatic review responses |
| 30-second response timeout | AI generation latency (5-15s) + buffer |
| Rate limiting on content generation | market-fit.md: AI costs under 15% of revenue |
