# LocalGenius — Data Model

**Author**: Elon Musk, Chief Product & Growth Officer
**Date**: 2026-04-02
**Status**: Architecture Decision Record — THE MOST IMPORTANT DOCUMENT
**Reviewer Requested**: Jensen Huang (Board), Steve Jobs, Technical Co-Founder

---

## Jensen's Four Questions

Before any schema, we answer the board's four questions explicitly. These answers drive every table design.

### Question 1: What data do we collect from each customer interaction, and what is its retention policy?

**Every interaction produces three categories of data:**

| Category | Examples | Retention | Rationale |
|----------|----------|-----------|-----------|
| **Owner data** | Business profile, photos, preferences, conversation history, approval decisions | Indefinite (lifetime of account + 90 days post-deletion) | This is the core product experience. Conversation history IS the product — Maria asks "what did I post about tacos last month?" and we must answer. |
| **Generated content** | Social posts, review responses, website content, email campaigns, Weekly Digests | Indefinite while account active. 30 days post-deletion (grace period for reactivation). | Content performance data compounds — it teaches the AI what works for this specific business. Deleting it degrades future generation quality. |
| **Analytics / attribution** | Page views, call tracking, booking attribution, review velocity, social engagement, SEO rankings | **Raw events**: 13 months (rolling). **Aggregated metrics**: indefinite. | Raw events at scale are expensive to store. 13 months gives us year-over-year comparison capability. Aggregated metrics (weekly/monthly summaries) are tiny and retained forever for trend analysis. |
| **Cross-business benchmarks** | Anonymized performance aggregates by vertical, city, business size | Indefinite (anonymized — no PII, no deletion obligation) | This is the data moat Jensen identified. Aggregated, anonymized benchmarks improve over time and cannot be replicated by competitors who start later. |

**Deletion policy (GDPR/CCPA)**:
- Owner requests deletion → soft-delete business record → 90-day grace period → hard-delete all PII → retain anonymized aggregates (no re-identification possible).
- Anonymized aggregates are computed at write-time and stored separately — they survive deletion because they contain no PII.

### Question 2: How do we attribute outcomes to specific LocalGenius actions?

**The Attribution Model — Three Layers:**

**Layer 1: Direct attribution (high confidence)**
- LocalGenius posts to Instagram → Instagram engagement metrics (likes, comments, saves, reach) → attributed to that specific post action.
- LocalGenius responds to a review → review platform records the response → attributed to that review action.
- LocalGenius sends email/SMS → open, click, reply → attributed to that campaign action.
- LocalGenius deploys/updates website → Cloudflare analytics (page views, unique visitors) → attributed to website actions.

**Layer 2: Correlated attribution (medium confidence)**
- LocalGenius optimizes Google Business Profile → Google search impressions, direction requests, phone calls increase → correlated to GBP optimization window (before/after comparison, 7-day rolling average).
- LocalGenius posts social content → website traffic spikes within 24 hours → correlated via referrer tracking + temporal proximity.
- LocalGenius sends "we miss you" campaign → customer returns within 14 days → correlated via email/SMS open + subsequent booking or visit.

**Layer 3: Aggregate attribution (business-level confidence)**
- Monthly trend: "Since joining LocalGenius 3 months ago, your Google reviews increased from 28 to 67, your rating improved from 4.2 to 4.5, and your website visits increased 340%."
- This is the "Monthly ROI Report" — not attributable to any single action, but attributable to LocalGenius as a system.
- This is the retention kill-shot from market-fit.md Section 4.3.

**Technical implementation**: Every action in the system has a unique `action_id`. Every measurable outcome references the `action_id` that caused or correlated with it. The `attribution_events` table links actions to outcomes with a confidence level (direct, correlated, aggregate) and a time window.

### Question 3: How do we anonymize and aggregate customer data for cross-business benchmarking?

**Anonymization strategy — compute at write-time, store separately:**

When a measurable event occurs (review received, social post engagement, website visit), we simultaneously:
1. Write the raw event to the business-specific event table (PII-scoped, retention-limited)
2. Increment the anonymized aggregate counter in a separate `benchmarks` table (no PII, no business_id, only vertical + city + size_bucket)

**Anonymization rules:**
- Minimum anonymity set: 5 businesses. No benchmark is published or stored for a cohort with fewer than 5 businesses. This prevents re-identification ("the only Tex-Mex restaurant on South Lamar" = Maria).
- Business size buckets: 1-5 employees, 6-15 employees, 16-50 employees. Never exact headcount.
- Geography: city-level only. Never street or neighborhood (prevents re-identification in sparse areas).
- Vertical: restaurant, salon, dental, home services, auto repair, other. Never sub-vertical (no "Tex-Mex" category).
- Time granularity: weekly aggregates minimum. Never daily (daily + vertical + city could identify individual businesses in small markets).

**The benchmark query Jensen wants:**
> "Restaurants in Austin with your profile perform 23% better when they post twice on Tuesday rather than once."

This query resolves to:
```sql
SELECT 
  avg(engagement_rate) as avg_engagement
FROM benchmark_weekly_aggregates
WHERE vertical = 'restaurant'
  AND city = 'austin'
  AND size_bucket = '6-15'
  AND metric_name = 'social_engagement'
  AND day_of_week = 'tuesday'
GROUP BY posts_per_day
HAVING count(DISTINCT anonymized_cohort_id) >= 5;
```

No PII involved. No business identifiable. Just: "restaurants like yours, in your city, your size — here's what works."

### Question 4: What is the data architecture that allows this benchmarking at scale?

**Dual-write architecture:**

```
Owner Action → [Business Event Store]  (PII, scoped, retention-limited)
            ↘ [Benchmark Aggregates]   (anonymized, unscoped, permanent)
```

The benchmark aggregates table is a pre-computed, append-only time-series of anonymized metrics. It does not reference any business_id. It is segmented by vertical, city, size_bucket, and time_period. At 10,000 businesses generating ~50 events/week each, this is ~500K aggregate increments/week — trivial for Postgres.

At scale (100K+ businesses), the benchmark store could migrate to a columnar store (ClickHouse, TimescaleDB) without changing the application code — the dual-write pattern isolates it from the transactional database.

---

## Database Schema

All tables use PostgreSQL. Multi-tenant isolation via `organization_id` on every business-scoped table, enforced by Row-Level Security (RLS) policies.

### Core Entity Tables

```sql
-- Organizations: the multi-tenant root entity.
-- For solo operators, an org has exactly one business.
-- For franchise operators (future), an org has many businesses.
CREATE TABLE organizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    plan            TEXT NOT NULL DEFAULT 'base' CHECK (plan IN ('base', 'pro', 'franchise')),
    stripe_customer_id TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ  -- soft delete
);

-- Businesses: the central entity. Everything scopes to a business.
CREATE TABLE businesses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name            TEXT NOT NULL,                          -- "Maria's Kitchen"
    vertical        TEXT NOT NULL DEFAULT 'restaurant',     -- restaurant, salon, dental, etc.
    city            TEXT NOT NULL,                          -- "Austin"
    state           TEXT NOT NULL,                          -- "TX"
    address         TEXT,
    phone           TEXT,
    employee_count  INTEGER,                               -- for size_bucket benchmarking
    timezone        TEXT NOT NULL DEFAULT 'America/Chicago',
    onboarding_completed_at TIMESTAMPTZ,
    priority_focus  TEXT CHECK (priority_focus IN ('found_online', 'reviews', 'social')),  -- Step 4 choice
    autonomy_level  INTEGER NOT NULL DEFAULT 0 CHECK (autonomy_level BETWEEN 0 AND 3),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);
CREATE INDEX idx_businesses_org ON businesses(organization_id);

-- Users: owners who interact with LocalGenius.
-- v1: one user per business. Multi-user is a future capability.
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    email           TEXT UNIQUE NOT NULL,
    phone           TEXT,
    name            TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'owner',
    auth_provider   TEXT NOT NULL DEFAULT 'email',          -- email, google, apple
    password_hash   TEXT,                                    -- null if OAuth
    last_active_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);
CREATE INDEX idx_users_business ON users(business_id);
CREATE INDEX idx_users_email ON users(email);
```

### Conversation & Action Tables

```sql
-- Conversations: the single thread per business.
-- Each business has one active conversation (the product IS one thread).
-- Messages are ordered by created_at within a conversation.
CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_conversations_business ON conversations(business_id);

-- Messages: every item in the thread.
-- Owner messages, AI responses, action cards, reports — all are messages.
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    role            TEXT NOT NULL CHECK (role IN ('owner', 'assistant', 'system')),
    content_type    TEXT NOT NULL CHECK (content_type IN ('text', 'action_card', 'report', 'digest', 'media')),
    content         JSONB NOT NULL,                        -- flexible: text body, action card data, report data
    ai_model        TEXT,                                  -- which model generated this (sonnet-4.6, haiku-4.5, null for owner)
    tokens_input    INTEGER,                               -- for cost tracking
    tokens_output   INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_business ON messages(business_id, created_at);
CREATE INDEX idx_messages_content_search ON messages USING gin(content jsonb_path_ops);

-- Actions: every thing LocalGenius does or proposes to do.
-- An action is born from a message (AI proposes) and may generate outcome events.
CREATE TABLE actions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    message_id      UUID REFERENCES messages(id),           -- the message that proposed this action
    action_type     TEXT NOT NULL CHECK (action_type IN (
        'social_post', 'review_response', 'website_update', 'email_campaign',
        'sms_campaign', 'seo_optimization', 'gbp_update', 'digest_generation'
    )),
    status          TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN (
        'proposed', 'approved', 'scheduled', 'executing', 'completed', 'failed', 'rejected'
    )),
    content         JSONB NOT NULL,                        -- action-type-specific payload
    scheduled_for   TIMESTAMPTZ,                           -- when to execute (null = immediate on approval)
    approved_at     TIMESTAMPTZ,
    executed_at     TIMESTAMPTZ,
    auto_approved   BOOLEAN NOT NULL DEFAULT false,        -- was this auto-approved by autonomy level?
    external_id     TEXT,                                   -- ID from external platform (Instagram post ID, etc.)
    external_platform TEXT,                                 -- 'instagram', 'facebook', 'google', 'yelp', 'email', 'sms'
    error_details   JSONB,                                 -- if failed, what went wrong
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_actions_business_type ON actions(business_id, action_type, created_at);
CREATE INDEX idx_actions_status ON actions(status) WHERE status IN ('proposed', 'scheduled', 'executing');
CREATE INDEX idx_actions_external ON actions(external_platform, external_id) WHERE external_id IS NOT NULL;
```

### Attribution & Analytics Tables

```sql
-- Attribution events: link actions to measurable outcomes.
-- This is the core of Jensen's Question #2.
CREATE TABLE attribution_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    action_id       UUID REFERENCES actions(id),            -- the LocalGenius action that caused this (null for organic)
    event_type      TEXT NOT NULL CHECK (event_type IN (
        'page_view', 'phone_call', 'direction_request', 'booking',
        'review_received', 'review_response_posted', 'social_engagement',
        'email_open', 'email_click', 'sms_reply', 'website_visit',
        'search_impression', 'search_click', 'form_submission'
    )),
    confidence      TEXT NOT NULL DEFAULT 'direct' CHECK (confidence IN ('direct', 'correlated', 'aggregate')),
    attribution_window_hours INTEGER,                       -- how many hours between action and outcome
    value_cents     INTEGER,                                -- estimated monetary value (if calculable)
    metadata        JSONB,                                  -- event-specific details (referrer, device, etc.)
    occurred_at     TIMESTAMPTZ NOT NULL,                   -- when the outcome happened
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attribution_business ON attribution_events(business_id, occurred_at);
CREATE INDEX idx_attribution_action ON attribution_events(action_id) WHERE action_id IS NOT NULL;
CREATE INDEX idx_attribution_type ON attribution_events(event_type, occurred_at);

-- Business metrics: pre-computed daily/weekly/monthly rollups per business.
-- Powers the Weekly Digest and trend analysis without scanning raw events.
CREATE TABLE business_metrics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    period_type     TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    period_start    DATE NOT NULL,
    metrics         JSONB NOT NULL,                        -- {website_visits: 340, reviews_received: 4, ...}
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(business_id, period_type, period_start)
);
CREATE INDEX idx_metrics_business_period ON business_metrics(business_id, period_type, period_start);
```

### Benchmark Tables (Anonymized — Jensen's Questions #3 and #4)

```sql
-- Benchmark aggregates: anonymized, no business_id, no PII.
-- Written simultaneously with business events (dual-write pattern).
-- Survives account deletion. Cannot be re-identified.
CREATE TABLE benchmark_aggregates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vertical        TEXT NOT NULL,                          -- 'restaurant', 'salon', etc.
    city            TEXT NOT NULL,                          -- 'austin', 'dallas', etc.
    size_bucket     TEXT NOT NULL CHECK (size_bucket IN ('1-5', '6-15', '16-50')),
    period_type     TEXT NOT NULL CHECK (period_type IN ('weekly', 'monthly')),
    period_start    DATE NOT NULL,
    metric_name     TEXT NOT NULL,                          -- 'review_velocity', 'social_engagement', 'website_visits', etc.
    metric_value    NUMERIC NOT NULL,                       -- the aggregate value
    sample_size     INTEGER NOT NULL,                       -- number of businesses in this cohort
    metadata        JSONB,                                  -- additional dimensions (day_of_week, content_type, etc.)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(vertical, city, size_bucket, period_type, period_start, metric_name, metadata)
);
CREATE INDEX idx_benchmarks_lookup ON benchmark_aggregates(vertical, city, size_bucket, metric_name, period_start);

-- Benchmark query: enforces minimum anonymity set at read-time.
-- Application code MUST use this view, never query the table directly.
CREATE VIEW safe_benchmarks AS
SELECT *
FROM benchmark_aggregates
WHERE sample_size >= 5;  -- minimum anonymity set
```

### Content & Media Tables

```sql
-- Generated content: all AI-generated assets (social posts, review responses, etc.)
-- Stored separately from actions because content may be revised before approval.
CREATE TABLE generated_content (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    action_id       UUID REFERENCES actions(id),
    content_type    TEXT NOT NULL CHECK (content_type IN (
        'social_post', 'review_response', 'website_page', 'email_body',
        'sms_body', 'digest', 'seo_description', 'image_prompt'
    )),
    content         JSONB NOT NULL,                        -- {text: "...", hashtags: [...], image_url: "..."}
    version         INTEGER NOT NULL DEFAULT 1,             -- increments on owner edits
    approved        BOOLEAN NOT NULL DEFAULT false,
    performance     JSONB,                                  -- post-publish metrics (reach, engagement, clicks)
    ai_model        TEXT NOT NULL,
    tokens_used     INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_business ON generated_content(business_id, content_type, created_at);
CREATE INDEX idx_content_performance ON generated_content(business_id) 
    WHERE performance IS NOT NULL;  -- only content with measured performance

-- Media assets: owner photos, generated images, website assets.
CREATE TABLE media_assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    asset_type      TEXT NOT NULL CHECK (asset_type IN ('owner_photo', 'generated_image', 'website_asset', 'logo')),
    storage_url     TEXT NOT NULL,                          -- Cloudflare R2 URL
    mime_type       TEXT NOT NULL,
    file_size_bytes INTEGER,
    width           INTEGER,
    height          INTEGER,
    alt_text        TEXT,                                    -- AI-generated accessibility text
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_media_business ON media_assets(business_id, asset_type);
```

### External Platform Connections

```sql
-- Platform connections: OAuth tokens and integration state for each business.
CREATE TABLE platform_connections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    platform        TEXT NOT NULL CHECK (platform IN (
        'google_business', 'instagram', 'facebook', 'yelp', 'square', 'stripe'
    )),
    access_token    TEXT NOT NULL,                          -- encrypted at rest
    refresh_token   TEXT,                                   -- encrypted at rest
    token_expires_at TIMESTAMPTZ,
    platform_user_id TEXT,                                  -- external platform's user/page ID
    platform_business_id TEXT,                              -- external platform's business/listing ID
    connection_status TEXT NOT NULL DEFAULT 'active' CHECK (connection_status IN ('active', 'expired', 'revoked', 'error')),
    last_synced_at  TIMESTAMPTZ,
    metadata        JSONB,                                  -- platform-specific config (which IG account, which FB page)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(business_id, platform)
);
CREATE INDEX idx_connections_business ON platform_connections(business_id);
CREATE INDEX idx_connections_status ON platform_connections(connection_status) 
    WHERE connection_status != 'active';  -- quickly find broken connections

-- Reviews: centralized review store across all platforms.
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    platform        TEXT NOT NULL CHECK (platform IN ('google', 'yelp', 'facebook')),
    external_review_id TEXT NOT NULL,
    reviewer_name   TEXT,
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text     TEXT,
    review_date     TIMESTAMPTZ NOT NULL,
    response_action_id UUID REFERENCES actions(id),         -- the action that responded to this review
    response_text   TEXT,                                    -- the actual response posted
    responded_at    TIMESTAMPTZ,
    sentiment       TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    key_topics      JSONB,                                  -- AI-extracted: ["fish tacos", "wait time", "ambiance"]
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(business_id, platform, external_review_id)
);
CREATE INDEX idx_reviews_business ON reviews(business_id, review_date);
CREATE INDEX idx_reviews_unresponded ON reviews(business_id) 
    WHERE response_action_id IS NULL;  -- quickly find reviews needing response
CREATE INDEX idx_reviews_sentiment ON reviews(business_id, sentiment, review_date);
```

### Website Generation

```sql
-- Generated websites: one per business, versioned.
CREATE TABLE websites (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    domain          TEXT,                                    -- custom domain or generated subdomain
    subdomain       TEXT NOT NULL,                          -- mariaskitchenatx.localgenius.com
    template_id     TEXT NOT NULL,                          -- which design template
    content         JSONB NOT NULL,                         -- page content (hero text, about, menu/services, hours, etc.)
    cloudflare_project_id TEXT,                             -- Cloudflare Pages project
    last_deployed_at TIMESTAMPTZ,
    deploy_status   TEXT DEFAULT 'pending' CHECK (deploy_status IN ('pending', 'deploying', 'live', 'failed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(business_id)
);
```

### Row-Level Security

```sql
-- Enable RLS on all business-scoped tables.
-- Every query runs in the context of a JWT containing organization_id.
-- No application code can accidentally read cross-tenant data.

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribution_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Example policy (applied to all tables above):
CREATE POLICY tenant_isolation ON businesses
    USING (organization_id = current_setting('app.current_org_id')::UUID);

-- benchmark_aggregates does NOT have RLS — it contains no PII and is globally readable.
```

---

## Data Flow Diagrams

### Onboarding Flow (Product-Design.md Steps 1-5)

```
Owner opens app
    → POST /api/onboarding/start
    → Creates: organization, business, user, conversation
    → Triggers: Google/Yelp/Meta discovery (async job)
    → Returns: business profile with discovered data

Owner uploads photos
    → POST /api/media/upload
    → Creates: media_assets (stored in R2)

Owner confirms and completes onboarding
    → POST /api/onboarding/complete
    → Triggers (parallel async jobs):
        1. Website generation → websites table → Cloudflare Pages deploy
        2. First social post → generated_content → actions (status: proposed)
        3. GBP optimization → actions (status: proposed)
        4. Review response drafts → reviews + actions (status: proposed)
    → Returns: "The Reveal" preview data
```

### Weekly Digest Generation

```
Monday 5:00 AM (cron job per timezone):
    → For each business in timezone:
        1. Query business_metrics (last 7 days)
        2. Query actions (completed, last 7 days)
        3. Query attribution_events (last 7 days)
        4. Query benchmark_aggregates (safe_benchmarks view) for comparison
        5. Call Claude Haiku 4.5 with business context + metrics → generate digest narrative
        6. Create message (content_type: 'digest') in conversation
        7. Send push notification + email
        8. Dual-write: increment benchmark_aggregates for this business's metrics
```

### Attribution Flow

```
LocalGenius posts to Instagram (action executed)
    → Store action.external_id = instagram_post_id

Every 4 hours (cron):
    → Poll Meta Graph API for engagement on recent posts
    → For each engagement metric:
        → Create attribution_event:
            action_id = the posting action
            confidence = 'direct'
            event_type = 'social_engagement'
    → Increment business_metrics (daily rollup)
    → Dual-write to benchmark_aggregates (anonymized)

Google reports new phone call to GBP listing:
    → Create attribution_event:
        action_id = most recent GBP optimization action
        confidence = 'correlated'
        attribution_window_hours = 168 (7 days)
        event_type = 'phone_call'
```

---

## Data Retention Summary

| Data Category | Retention | Deletion Behavior |
|---------------|-----------|-------------------|
| Owner PII (name, email, phone) | Account lifetime + 90 days | Hard delete after grace period |
| Business profile | Account lifetime + 90 days | Hard delete after grace period |
| Conversation history | Account lifetime | Soft delete on account deletion, hard delete at 90 days |
| Generated content | Account lifetime | Soft delete, hard delete at 30 days post-deletion |
| Raw attribution events | 13 months rolling | Auto-pruned by scheduled job |
| Business metrics (aggregated) | Indefinite | Retained as anonymized aggregates |
| Benchmark aggregates | Indefinite | Never deleted — contains no PII |
| Media assets (R2) | Account lifetime + 30 days | Delete from R2 at 30 days post-account-deletion |
| Platform tokens | Account lifetime | Hard delete immediately on disconnection or account deletion |

---

## Schema Statistics

| Table | Estimated Rows (300 users, month 3) | Estimated Rows (10,000 users, month 12) |
|-------|-----------------------------------:|----------------------------------------:|
| organizations | 300 | 10,000 |
| businesses | 300 | 10,500 (some franchise multi-business) |
| users | 300 | 10,500 |
| conversations | 300 | 10,500 |
| messages | 18,000 (60/user/month × 3 months × 300 × ramp) | 2,520,000 |
| actions | 9,000 (30/user/month) | 1,260,000 |
| attribution_events | 27,000 (90/user/month) | 3,780,000 |
| business_metrics | 2,700 (3 period types × 300 × ~3 months) | 378,000 |
| benchmark_aggregates | 5,000 | 50,000 |
| generated_content | 9,000 | 1,260,000 |
| reviews | 2,400 (8/user/month) | 336,000 |

**Total estimated database size at month 12**: ~50-80 GB (well within Neon's scaling range).

---

## Decision Traceability

| Schema Decision | Traces To |
|----------------|-----------|
| `organization_id` on every table | Locked Decision #4: multi-tenant from day one |
| RLS policies | Locked Decision #4 + PRD: GDPR/CCPA compliance |
| `autonomy_level` on businesses | Product-design.md: earned autonomy levels 0-3 |
| `priority_focus` on businesses | Product-design.md Step 4: "What matters most to you?" |
| `attribution_events` with confidence levels | Jensen Question #2: outcome attribution |
| `benchmark_aggregates` with `sample_size >= 5` | Jensen Question #3: anonymized benchmarking |
| Dual-write pattern | Jensen Question #4: architecture for cross-business insights |
| `reviews.key_topics` (AI-extracted) | Jensen's data moat insight: "customers mention 'fish tacos' in positive reviews" |
| 13-month raw event retention | Balance of storage cost vs. year-over-year analysis capability |
| `generated_content.performance` | Market-fit.md: data compounding as competitive moat |
| `messages.tokens_input/output` | Market-fit.md: AI cost tracking under 15% ceiling |
