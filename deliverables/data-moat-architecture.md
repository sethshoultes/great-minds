# LocalGenius Data Moat Architecture

**Authors**: Great Minds Agency (Steve Jobs + Elon Musk, with Jensen Huang board oversight)
**Date**: 2026-04-03
**Status**: Architecture Decision Record -- responds to Jensen Huang Board Issue #001
**Reviewers**: Jensen Huang (Board), Full Founding Team

---

## Purpose

This document answers the four questions Jensen Huang posed in Board Review #001 before any application code is written. These are not engineering decisions. They are company strategy decisions that happen to be expressed in SQL.

Jensen's analogy is precise: NVIDIA's telemetry decisions in 2006-2008 determined what insights were available when CUDA needed them in 2012. LocalGenius's data architecture in month 1 determines whether we are a cancelable tool or irreplaceable infrastructure by month 12.

---

## Question 1: What Events Do We Capture, and What Is the Retention Policy?

### Event Taxonomy

Every customer interaction produces events in one of four categories. Each category has different storage characteristics, retention requirements, and privacy implications.

#### Category A: Owner Data (The Relationship)

| Event | Table | Columns | Retention |
|-------|-------|---------|-----------|
| Business profile created/updated | `businesses` | name, vertical, city, state, address, phone, employee_count, timezone, priority_focus, autonomy_level | Account lifetime + 90 days post-deletion |
| User account created/updated | `users` | email, phone, name, role, auth_provider | Account lifetime + 90 days post-deletion |
| Conversation message sent | `messages` | conversation_id, role, content_type, content (JSONB), ai_model, tokens_input, tokens_output | Account lifetime; hard-delete at 90 days post-deletion |
| Platform connected/disconnected | `platform_connections` | platform, connection_status, last_synced_at | Account lifetime; hard-delete immediately on disconnection or account deletion |
| Photo/media uploaded | `media_assets` | asset_type, storage_url, mime_type, alt_text | Account lifetime + 30 days post-deletion |

**Why indefinite retention during account lifetime**: Conversation history IS the product. When Maria asks "what did I post about tacos last month?" -- we must answer. Every message trains the AI on her voice, her preferences, her brand. Deleting conversation history degrades future generation quality. This accumulated context is the first layer of the data moat: the AI knows Maria's business better every week, and no competitor can replicate that knowledge without starting over.

#### Category B: Generated Content (The Work Product)

| Event | Table | Columns | Retention |
|-------|-------|---------|-----------|
| Social post generated | `generated_content` | content_type='social_post', content (JSONB: text, hashtags, image_url), version, approved, ai_model | Account lifetime; 30-day grace post-deletion |
| Review response drafted | `generated_content` | content_type='review_response', content, version, approved | Account lifetime; 30-day grace post-deletion |
| Website content generated | `generated_content` | content_type='website_page', content (JSONB: hero, about, services, hours) | Account lifetime; 30-day grace post-deletion |
| Email/SMS campaign created | `generated_content` | content_type='email_body' or 'sms_body', content | Account lifetime; 30-day grace post-deletion |
| Weekly Digest generated | `generated_content` | content_type='digest', content (JSONB: metrics, narrative, recommendations) | Account lifetime; 30-day grace post-deletion |
| Action proposed/executed | `actions` | action_type, status, content (JSONB), scheduled_for, approved_at, executed_at, auto_approved, external_id | Account lifetime; 30-day grace post-deletion |

**Why 30-day grace, not immediate**: Reactivation within 30 days of cancellation restores the full content library. This is a retention mechanism -- Maria can leave and come back without losing a year of work. After 30 days, PII is hard-deleted but anonymized aggregates survive.

**Performance metadata on generated content**: The `generated_content.performance` JSONB column stores post-publish metrics (reach, engagement, clicks). This is the data that teaches the AI what works for this specific business. After 52 weeks, LocalGenius knows that Maria's Tuesday taco posts outperform her weekend brunch posts by 34%. That is institutional memory no competitor can replicate.

#### Category C: Attribution Events (The Proof)

| Event | Table | Columns | Retention |
|-------|-------|---------|-----------|
| Page view on generated website | `attribution_events` | event_type='page_view', action_id (website deploy action), metadata (referrer, device) | **Raw: 13 months rolling. Aggregated: indefinite.** |
| Phone call to business | `attribution_events` | event_type='phone_call', action_id (GBP optimization), confidence='correlated', attribution_window_hours | 13 months rolling / aggregated indefinite |
| Direction request on Google | `attribution_events` | event_type='direction_request', action_id, confidence='correlated' | 13 months rolling / aggregated indefinite |
| Booking made | `attribution_events` | event_type='booking', action_id, value_cents | 13 months rolling / aggregated indefinite |
| Review received | `attribution_events` | event_type='review_received', metadata (rating, platform) | 13 months rolling / aggregated indefinite |
| Social engagement (like, comment, save) | `attribution_events` | event_type='social_engagement', action_id (the post), confidence='direct' | 13 months rolling / aggregated indefinite |
| Email opened/clicked | `attribution_events` | event_type='email_open' or 'email_click', action_id (the campaign) | 13 months rolling / aggregated indefinite |
| Search impression/click | `attribution_events` | event_type='search_impression' or 'search_click', action_id (SEO action) | 13 months rolling / aggregated indefinite |
| Form submission | `attribution_events` | event_type='form_submission', action_id (website), value_cents | 13 months rolling / aggregated indefinite |

**Why 13 months for raw events**: Year-over-year comparison. Maria needs to see "your April this year vs. April last year." Thirteen months guarantees overlap. Beyond 13 months, raw events are expensive to store at scale (estimated 3.78M rows at 10K users/month). The aggregated rollups in `business_metrics` retain the trend data indefinitely at negligible storage cost.

**Retention enforcement**: A scheduled job (`cron_prune_raw_events`) runs weekly:

```sql
-- Prune raw attribution events older than 13 months
DELETE FROM attribution_events
WHERE occurred_at < now() - INTERVAL '13 months'
  AND id NOT IN (
    -- Keep events that haven't been rolled up yet
    SELECT ae.id FROM attribution_events ae
    LEFT JOIN business_metrics bm
      ON ae.business_id = bm.business_id
      AND date_trunc('week', ae.occurred_at) = bm.period_start
      AND bm.period_type = 'weekly'
    WHERE bm.id IS NULL
  );
```

#### Category D: Benchmark Aggregates (The Moat)

| Event | Table | Columns | Retention |
|-------|-------|---------|-----------|
| Weekly cohort metric computed | `benchmark_aggregates` | vertical, city, size_bucket, period_type='weekly', metric_name, metric_value, sample_size | **Indefinite. No PII. No deletion obligation.** |
| Monthly cohort metric computed | `benchmark_aggregates` | same as above, period_type='monthly' | Indefinite |

**Why indefinite**: These aggregates contain no PII, no business_id, no way to re-identify individual businesses (enforced by minimum anonymity set of 5). They are the compounding asset Jensen identified: every week of operation adds data points that make the benchmarks more accurate, more granular, and more valuable. A competitor who starts 12 months later has 12 months less benchmark data. That gap never closes.

### Retention Summary Table

| Data Category | Raw Retention | Aggregated Retention | Deletion Behavior |
|---------------|--------------|---------------------|-------------------|
| Owner PII (name, email, phone) | Account + 90 days | N/A | Hard delete after grace period |
| Business profile | Account + 90 days | N/A | Hard delete after grace period |
| Conversation history | Account lifetime | N/A | Soft delete; hard delete at 90 days |
| Generated content | Account + 30 days | N/A | Soft delete; hard delete at 30 days |
| Raw attribution events | **13 months rolling** | Indefinite (via `business_metrics`) | Auto-pruned weekly by cron |
| Business metrics (rollups) | Indefinite | N/A | Anonymized on account deletion |
| Benchmark aggregates | N/A | **Indefinite** | Never deleted -- no PII |
| Media assets (R2) | Account + 30 days | N/A | Delete from R2 at 30 days post-deletion |
| Platform OAuth tokens | Account lifetime | N/A | Hard delete immediately on disconnect or deletion |

---

## Question 2: How Do We Attribute Outcomes to LocalGenius Actions?

### The Attribution Model

Attribution is what separates "I think LocalGenius helps" from "LocalGenius generated 23 phone calls this month." The difference is the difference between a tool Maria might cancel and a partner Maria cannot afford to lose.

Every action in the system has a unique `action_id` (UUID). Every measurable outcome references the `action_id` that caused or correlated with it. The `attribution_events` table links them with a confidence level and a time window.

### Three Layers of Attribution

#### Layer 1: Direct Attribution (High Confidence)

Direct attribution means LocalGenius performed an action, and the outcome is a direct, measurable response to that specific action.

| LocalGenius Action | Measurable Outcome | Attribution Mechanism | Confidence |
|-------------------|-------------------|----------------------|------------|
| Posts to Instagram/Facebook | Likes, comments, saves, reach, shares | Meta Graph API engagement metrics polled every 4 hours. `action_id` = the posting action. `external_id` = Instagram post ID. | `direct` |
| Responds to a Google/Yelp review | Review response recorded on platform | Response tracked via `reviews.response_action_id`. | `direct` |
| Sends email campaign | Opens, clicks, replies | Twilio/SendGrid webhook callbacks. `action_id` = the campaign action. | `direct` |
| Sends SMS campaign | Replies, link clicks | Twilio webhook callbacks. | `direct` |
| Deploys/updates website | Page views, unique visitors | Cloudflare Analytics for the generated site. `action_id` = the website deploy action. | `direct` |
| Generates and posts SEO-optimized content | Search impressions, clicks for that content | Google Search Console API, matched by URL. | `direct` |

**Implementation**: A BullMQ cron job (`cron_poll_engagement`) runs every 4 hours per business:

```typescript
// Pseudocode: engagement polling worker
async function pollEngagement(businessId: string) {
  const recentActions = await db.query.actions.findMany({
    where: and(
      eq(actions.businessId, businessId),
      eq(actions.status, 'completed'),
      gte(actions.executedAt, subDays(new Date(), 7)),
      isNotNull(actions.externalId)
    )
  });

  for (const action of recentActions) {
    const metrics = await fetchPlatformMetrics(
      action.externalPlatform,
      action.externalId
    );

    for (const metric of metrics) {
      await db.insert(attributionEvents).values({
        businessId,
        organizationId: action.organizationId,
        actionId: action.id,
        eventType: metric.type,        // 'social_engagement', 'email_open', etc.
        confidence: 'direct',
        attributionWindowHours: null,   // direct = no window needed
        valueCents: metric.estimatedValue,
        metadata: metric.raw,
        occurredAt: metric.timestamp,
      });
    }

    // Dual-write to benchmark aggregates (anonymized)
    await incrementBenchmark(action, metrics);
  }
}
```

#### Layer 2: Correlated Attribution (Medium Confidence)

Correlated attribution means LocalGenius performed an action, and an outcome occurred within a plausible time window that is likely (but not provably) caused by that action.

| LocalGenius Action | Measurable Outcome | Attribution Window | Correlation Method |
|-------------------|-------------------|-------------------|-------------------|
| Optimizes Google Business Profile | Increase in search impressions, direction requests, phone calls | 7 days (168 hours) | Before/after comparison: 7-day rolling average pre-optimization vs. 7-day rolling average post-optimization. Minimum 15% lift to claim correlation. |
| Posts social content | Website traffic spike | 24 hours | Referrer tracking (`metadata.referrer` contains social platform) + temporal proximity (traffic within 24h of post). |
| Sends "we miss you" email/SMS | Customer returns (booking or visit) | 14 days | Email/SMS open confirmed + subsequent booking within 14 days. |
| Responds to negative review | Rating trajectory improvement | 30 days | Pre-response rating trend vs. post-response rating trend. Requires 3+ reviews in each period. |

**Before/after comparison implementation**:

```sql
-- Example: GBP optimization attribution
-- Compare 7-day average phone calls before vs. after optimization
WITH pre_optimization AS (
  SELECT avg(daily_count) as avg_calls
  FROM (
    SELECT date_trunc('day', occurred_at) as day, count(*) as daily_count
    FROM attribution_events
    WHERE business_id = :business_id
      AND event_type = 'phone_call'
      AND occurred_at BETWEEN :optimization_date - INTERVAL '7 days'
                          AND :optimization_date
    GROUP BY 1
  ) daily
),
post_optimization AS (
  SELECT avg(daily_count) as avg_calls
  FROM (
    SELECT date_trunc('day', occurred_at) as day, count(*) as daily_count
    FROM attribution_events
    WHERE business_id = :business_id
      AND event_type = 'phone_call'
      AND occurred_at BETWEEN :optimization_date
                          AND :optimization_date + INTERVAL '7 days'
    GROUP BY 1
  ) daily
)
SELECT
  post.avg_calls,
  pre.avg_calls,
  CASE
    WHEN pre.avg_calls > 0
    THEN ((post.avg_calls - pre.avg_calls) / pre.avg_calls * 100)
    ELSE NULL
  END as lift_percentage
FROM pre_optimization pre, post_optimization post;
```

**Minimum confidence threshold**: Correlated attribution is only recorded when the lift exceeds 15%. Below that, noise dominates signal. We do not claim credit for outcomes that could be random variation.

#### Layer 3: Aggregate Attribution (Business-Level Confidence)

Aggregate attribution does not link to any single action. It answers: "Since joining LocalGenius, how has this business performed overall?"

This powers the Monthly ROI Report and the retention kill-shot from the market-fit analysis.

```sql
-- Monthly ROI Report query
SELECT
  -- Reviews
  (SELECT count(*) FROM reviews
   WHERE business_id = :business_id
     AND review_date >= :join_date) as total_reviews_since_join,
  (SELECT avg(rating) FROM reviews
   WHERE business_id = :business_id
     AND review_date >= :join_date) as avg_rating_since_join,
  (SELECT avg(rating) FROM reviews
   WHERE business_id = :business_id
     AND review_date < :join_date) as avg_rating_before_join,

  -- Website traffic
  (SELECT sum((metrics->>'website_visits')::int)
   FROM business_metrics
   WHERE business_id = :business_id
     AND period_type = 'monthly') as total_website_visits,

  -- Attributed value
  (SELECT sum(value_cents) FROM attribution_events
   WHERE business_id = :business_id
     AND confidence IN ('direct', 'correlated')
     AND occurred_at >= date_trunc('month', now())) as attributed_value_this_month,

  -- Action count
  (SELECT count(*) FROM actions
   WHERE business_id = :business_id
     AND status = 'completed'
     AND executed_at >= date_trunc('month', now())) as actions_completed_this_month;
```

**What Maria sees in her Weekly Digest**:

> "This week, LocalGenius posted 3 times on Instagram (847 total engagements), responded to 2 reviews, and optimized your Google listing. Since you joined 3 months ago, your Google rating improved from 4.2 to 4.5, your website visits increased 340%, and we've attributed an estimated $2,847 in customer value to LocalGenius actions."

The key phrase is "attributed an estimated" -- we are transparent about confidence levels. Direct attribution is stated as fact. Correlated attribution is stated as estimate. Aggregate attribution is stated as trend.

### Attribution Confidence Display Rules

| Confidence Level | How We Display It | Example |
|-----------------|-------------------|---------|
| `direct` | Stated as fact | "Your Instagram post reached 423 people and got 47 likes" |
| `correlated` | Stated as likely cause | "After we optimized your Google listing, phone calls increased ~23%" |
| `aggregate` | Stated as trend | "Since joining 3 months ago, your reviews increased from 28 to 67" |

### Value Estimation

For attribution events where monetary value is calculable, we store `value_cents`:

| Event Type | Value Estimation Method |
|-----------|----------------------|
| `booking` | Booking value if available from Square/platform integration; otherwise, vertical-specific average (restaurant: $45, salon: $65, dental: $200) |
| `phone_call` | Vertical-specific conversion estimate: 30% of calls convert, at average transaction value |
| `form_submission` | Same as phone_call estimate |
| `email_click` | 10% of clicks convert, at average transaction value |
| `direction_request` | 25% of direction requests result in visit, at average transaction value |

These estimates are calibrated quarterly using actual conversion data from businesses that have integrated booking/POS systems (Square, Toast). As our dataset grows, the estimates become more accurate -- another compounding data advantage.

---

## Question 3: Privacy Architecture -- Pseudonymization, Aggregation Thresholds, Consent

### Design Principle

Privacy is not a feature we add. It is a constraint we design around. The architecture must make it **impossible** to violate privacy, not merely **inconvenient**.

### Dual-Write Architecture

When a measurable event occurs, we simultaneously:

1. **Write the raw event** to the business-specific table (`attribution_events`) -- scoped by `business_id` and `organization_id`, protected by Row-Level Security, subject to 13-month retention limit
2. **Increment the anonymized aggregate** in `benchmark_aggregates` -- no `business_id`, no PII, no deletion obligation, permanent

The anonymized aggregate is computed at write-time, not at query-time. This is a critical design decision: if we aggregate at query-time, we must retain the raw data to produce aggregates. By aggregating at write-time, the raw data can be deleted without losing the aggregate intelligence.

```typescript
// Dual-write implementation
async function recordAttributionEvent(event: AttributionEvent) {
  await db.transaction(async (tx) => {
    // 1. Write raw event (PII-scoped, retention-limited)
    await tx.insert(attributionEvents).values(event);

    // 2. Increment business metrics rollup
    await tx.insert(businessMetrics)
      .values({
        businessId: event.businessId,
        organizationId: event.organizationId,
        periodType: 'daily',
        periodStart: startOfDay(event.occurredAt),
        metrics: { [event.eventType]: 1 },
      })
      .onConflictDoUpdate({
        target: [businessMetrics.businessId, businessMetrics.periodType, businessMetrics.periodStart],
        set: {
          metrics: sql`business_metrics.metrics || jsonb_build_object(
            ${event.eventType},
            COALESCE((business_metrics.metrics->>${ event.eventType })::int, 0) + 1
          )`,
        },
      });

    // 3. Increment anonymized benchmark (NO business_id)
    const business = await tx.query.businesses.findFirst({
      where: eq(businesses.id, event.businessId),
      columns: { vertical: true, city: true, employeeCount: true },
    });

    const sizeBucket = employeeCountToBucket(business.employeeCount);

    await tx.insert(benchmarkAggregates)
      .values({
        vertical: business.vertical,
        city: business.city.toLowerCase(),
        sizeBucket,
        periodType: 'weekly',
        periodStart: startOfWeek(event.occurredAt),
        metricName: event.eventType,
        metricValue: 1,
        sampleSize: 1,
        metadata: extractAnonymousMetadata(event),
      })
      .onConflictDoUpdate({
        target: [
          benchmarkAggregates.vertical,
          benchmarkAggregates.city,
          benchmarkAggregates.sizeBucket,
          benchmarkAggregates.periodType,
          benchmarkAggregates.periodStart,
          benchmarkAggregates.metricName,
          benchmarkAggregates.metadata,
        ],
        set: {
          metricValue: sql`benchmark_aggregates.metric_value + 1`,
          // sample_size tracks unique businesses -- use a separate tracking mechanism
        },
      });
  });
}
```

### Anonymization Rules

These rules are non-negotiable. They are enforced at the database level (the `safe_benchmarks` view) and at the application level (the dual-write function). Both layers must agree.

| Dimension | Granularity | Rationale |
|-----------|-------------|-----------|
| **Business identity** | Completely removed. No `business_id` in `benchmark_aggregates`. | Fundamental requirement. |
| **Vertical** | Broad categories only: `restaurant`, `salon`, `dental`, `home_services`, `auto_repair`, `other` | Never sub-vertical. "Tex-Mex restaurant on South Lamar" = one business = Maria. Broad verticals protect identity. |
| **Geography** | City-level only. Never neighborhood, ZIP code, or street. | In small cities, neighborhood + vertical could identify a single business. City-level ensures sufficient anonymity set. |
| **Business size** | Three buckets: `1-5`, `6-15`, `16-50` employees. Never exact headcount. | Exact headcount + vertical + city could narrow to a single business. Buckets prevent this. |
| **Time granularity** | Weekly aggregates minimum. Never daily. | Daily + vertical + city could identify individual businesses in small markets where only one business generates events on a given day. |
| **Metric values** | Aggregate sums and averages only. Never individual data points. | Individual engagement numbers on a specific day could be cross-referenced with public social media data to identify the business. |

### Minimum Anonymity Set: k=5

No benchmark is published, stored, or returned to any user for a cohort with fewer than 5 businesses. This is enforced at two levels:

**Level 1 -- Database view (hard enforcement)**:

```sql
CREATE VIEW safe_benchmarks AS
SELECT *
FROM benchmark_aggregates
WHERE sample_size >= 5;
```

All application code queries `safe_benchmarks`, never `benchmark_aggregates` directly. The view is the only access path.

**Level 2 -- Application code (defense in depth)**:

```typescript
async function getBenchmark(
  vertical: string,
  city: string,
  sizeBucket: string,
  metricName: string
): Promise<BenchmarkResult | null> {
  const result = await db.select()
    .from(safeBenchmarks)  // View, not table
    .where(and(
      eq(safeBenchmarks.vertical, vertical),
      eq(safeBenchmarks.city, city.toLowerCase()),
      eq(safeBenchmarks.sizeBucket, sizeBucket),
      eq(safeBenchmarks.metricName, metricName),
    ))
    .orderBy(desc(safeBenchmarks.periodStart))
    .limit(12);  // Last 12 weeks

  // Defense in depth: application also checks
  if (result.length === 0 || result[0].sampleSize < 5) {
    return null;  // Not enough data for safe benchmarking
  }

  return result;
}
```

### Sample Size Tracking

The `sample_size` column in `benchmark_aggregates` tracks how many distinct businesses contributed to each aggregate. Since we do not store `business_id` in the benchmark table (by design), we track unique business contributions using a separate, ephemeral mechanism:

```sql
-- Benchmark contribution tracking (ephemeral, for sample_size accuracy)
-- This table IS subject to deletion -- it exists only to maintain accurate sample_size counts
CREATE TABLE benchmark_contributions (
    benchmark_key   TEXT NOT NULL,  -- composite: vertical|city|size_bucket|period|metric
    business_id     UUID NOT NULL,
    contributed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (benchmark_key, business_id)
);

-- When a business is deleted, remove their contribution tracking
-- The aggregate VALUES remain (they contain no PII)
-- But sample_size is decremented if it would drop below threshold
```

This is the one place where `business_id` and benchmark data coexist, and it exists solely to maintain accurate sample counts. On account deletion, the contribution record is removed and `sample_size` is decremented. If `sample_size` drops below 5, the `safe_benchmarks` view automatically hides that cohort.

### Consent Architecture

| Consent Type | When Captured | Stored Where | Revocable? |
|-------------|--------------|-------------|------------|
| Core data processing | Onboarding Step 1 (account creation) | `users.consent_at` (TIMESTAMPTZ) | Yes -- account deletion |
| Cross-business benchmarking | Onboarding (opt-in checkbox, default ON) | `businesses.benchmark_opt_in` (BOOLEAN) | Yes -- toggle in settings |
| Email/SMS marketing | Campaign creation | `users.marketing_consent_at` | Yes -- unsubscribe link |
| Third-party data sharing (future B2B product) | NOT captured in v1 | N/A | N/A -- will require separate consent flow |

**Benchmark opt-in default ON rationale**: The benchmarks contain no PII and cannot identify the business. Opting out only removes the business's contribution to aggregate metrics, which slightly degrades benchmark accuracy for everyone. We default to ON because it is analogous to contributing to a census -- the aggregate benefits everyone, the individual is not identifiable. Businesses can opt out at any time.

### GDPR/CCPA Deletion Flow

```
Owner requests deletion
    |
    v
1. Soft-delete: Set deleted_at on organization, business, user records
    |
    v
2. Immediately: Revoke all platform OAuth tokens (hard delete from platform_connections)
    |
    v
3. 90-day grace period (allows reactivation)
    |
    v
4. Hard delete (cron job: cron_hard_delete_expired):
    a. Delete all messages for this business
    b. Delete all actions for this business
    c. Delete all generated_content for this business
    d. Delete all attribution_events for this business
    e. Delete all reviews for this business
    f. Delete media_assets records + actual files from R2
    g. Delete all business_metrics for this business
    h. Delete benchmark_contributions for this business
       (decrement sample_size on affected benchmark_aggregates)
    i. Delete conversation, user, business, organization records
    |
    v
5. What SURVIVES deletion:
    - benchmark_aggregates rows (no PII, no business_id, values only)
    - These aggregates were computed at write-time and stored separately
    - They cannot be re-identified because they contain only:
      vertical + city + size_bucket + period + metric_name + metric_value + sample_size
```

---

## Question 4: Schema Design -- Single-Business Today, Aggregate Benchmarking at 10K Tomorrow, No Migration

### Design Principle: Dual-Path Architecture

The schema serves two query patterns that must never interfere with each other:

1. **Single-business queries** (Maria's app experience): "Show me my reviews this week." Fast, scoped, real-time.
2. **Aggregate benchmark queries** (the data moat): "How do restaurants in Austin my size perform on Tuesdays?" Analytical, cross-business, eventually heavy.

These two paths use different tables, different access patterns, and (eventually) different storage engines. The dual-write pattern at the application layer ensures both paths are fed from the same events without coupling them.

```
                        Event Occurs
                            |
                            v
                    ┌───────────────┐
                    │  Application  │
                    │  Dual-Write   │
                    └───┬───────┬───┘
                        |       |
            ┌───────────┘       └───────────┐
            v                               v
    ┌───────────────┐               ┌───────────────────┐
    │ Business Path │               │  Benchmark Path   │
    │               │               │                   │
    │ attribution_  │               │ benchmark_        │
    │ events        │               │ aggregates        │
    │ business_     │               │                   │
    │ metrics       │               │ (no business_id)  │
    │               │               │ (no PII)          │
    │ (RLS-scoped)  │               │ (globally readable)│
    │ (13mo retain) │               │ (indefinite)       │
    └───────────────┘               └───────────────────┘
            |                               |
            v                               v
    Maria's Weekly Digest           "Restaurants like yours
    Maria's ROI Report               in Austin do X better"
```

### Full Schema (16 Tables + 1 View + 1 Tracking Table)

The complete schema is defined in `engineering/data-model.md`. Here is the summary of how each table serves the dual-path architecture:

#### Business Path Tables (RLS-Enforced, PII-Scoped)

| Table | Purpose | RLS | Est. Rows (10K users, month 12) |
|-------|---------|-----|--------------------------------|
| `organizations` | Multi-tenant root entity | Yes | 10,000 |
| `businesses` | Central entity, all scoping | Yes | 10,500 |
| `users` | Owner accounts | Yes | 10,500 |
| `conversations` | One thread per business | Yes | 10,500 |
| `messages` | All conversation items | Yes | 2,520,000 |
| `actions` | Everything LocalGenius does | Yes | 1,260,000 |
| `attribution_events` | Outcomes linked to actions | Yes | 3,780,000 |
| `business_metrics` | Pre-computed daily/weekly/monthly rollups | Yes | 378,000 |
| `generated_content` | All AI-generated assets | Yes | 1,260,000 |
| `media_assets` | Photos, images, website assets | Yes | 210,000 |
| `platform_connections` | OAuth tokens, integration state | Yes | 31,500 |
| `reviews` | Centralized review store | Yes | 336,000 |
| `websites` | Generated website config | Yes | 10,500 |

#### Benchmark Path Tables (No RLS, No PII)

| Table | Purpose | RLS | Est. Rows (10K users, month 12) |
|-------|---------|-----|--------------------------------|
| `benchmark_aggregates` | Anonymized cross-business metrics | No | 50,000 |
| `benchmark_contributions` | Sample size tracking (ephemeral) | No | ~500,000 (pruned with business deletion) |

#### Access Layer

| Object | Purpose |
|--------|---------|
| `safe_benchmarks` (VIEW) | Enforces k>=5 anonymity set on all benchmark reads |

### Why This Scales Without Migration

**At 300 users (month 3)**: Both paths run on the same Neon Postgres instance. Benchmark queries are trivially fast (5,000 rows in `benchmark_aggregates`). Total database size: ~5 GB.

**At 10,000 users (month 12)**: Both paths still run on Neon Postgres. Benchmark queries touch ~50,000 rows. Neon autoscales compute. Total database size: ~50-80 GB. No changes needed.

**At 100,000 users (year 2-3)**: The benchmark path can be migrated to a columnar store (TimescaleDB, ClickHouse) WITHOUT changing application code. Here is why:

1. The dual-write function is an application-level abstraction. Changing the write target from Postgres to ClickHouse requires modifying one function, not the schema.
2. The `safe_benchmarks` view is the only read path. Replacing it with a ClickHouse-backed query layer requires changing one data source, not every feature that uses benchmarks.
3. The business path tables never touch the benchmark tables. There are no joins between them. They are fully decoupled.
4. The `benchmark_aggregates` table is append-only. Migrating to a columnar store is a bulk insert, not a schema transformation.

**At 1,000,000+ users (year 3+)**: The B2B intelligence product Jensen described (franchise benchmarking, commercial real estate insights, business association reporting) reads exclusively from the benchmark path. It can run on a dedicated analytics cluster with zero impact on the transactional business path.

### Index Strategy

Business path indexes are optimized for single-business, time-scoped queries:

```sql
-- Primary access pattern: "Show me this business's data for this time period"
CREATE INDEX idx_attribution_business ON attribution_events(business_id, occurred_at);
CREATE INDEX idx_messages_business ON messages(business_id, created_at);
CREATE INDEX idx_actions_business_type ON actions(business_id, action_type, created_at);
CREATE INDEX idx_metrics_business_period ON business_metrics(business_id, period_type, period_start);
CREATE INDEX idx_reviews_business ON reviews(business_id, review_date);
```

Benchmark path indexes are optimized for cohort-scoped, metric-specific queries:

```sql
-- Primary access pattern: "Show me this cohort's metric over time"
CREATE INDEX idx_benchmarks_lookup ON benchmark_aggregates(
  vertical, city, size_bucket, metric_name, period_start
);
```

These index strategies are different because the query patterns are different. The dual-path architecture ensures they never compete for the same resources.

### Row-Level Security Configuration

RLS is enabled on all business path tables. The benchmark path tables have no RLS because they contain no tenant-specific data.

```sql
-- RLS policy applied to all 13 business path tables
-- JWT sets app.current_org_id on connection
CREATE POLICY tenant_isolation ON [table_name]
    USING (organization_id = current_setting('app.current_org_id')::UUID);

-- benchmark_aggregates: NO RLS
-- It contains no organization_id, no business_id, no PII
-- It is globally readable by any authenticated user
-- Access is through safe_benchmarks view (enforces k>=5)
```

### The Benchmark Query Jensen Asked For

> "Restaurants in Austin with your profile perform 23% better when they post twice on Tuesday rather than once."

This query resolves to:

```sql
SELECT
  (metadata->>'posts_per_day')::int as posts_per_day,
  avg(metric_value) as avg_engagement,
  sum(sample_size) as total_businesses
FROM safe_benchmarks
WHERE vertical = 'restaurant'
  AND city = 'austin'
  AND size_bucket = '6-15'
  AND metric_name = 'social_engagement'
  AND (metadata->>'day_of_week') = 'tuesday'
  AND period_type = 'weekly'
  AND period_start >= now() - INTERVAL '12 weeks'
GROUP BY (metadata->>'posts_per_day')::int
HAVING sum(sample_size) >= 5
ORDER BY posts_per_day;
```

No PII involved. No business identifiable. The `safe_benchmarks` view enforces k>=5 at the row level. The `HAVING` clause enforces it at the aggregate level. Two layers of protection.

At 300 users, this query may not return results for many cohorts (not enough businesses in each bucket). That is correct -- we do not fabricate benchmarks. As the user base grows, cohorts fill in, and the benchmarks become richer. This is the compounding effect Jensen described: every new business makes the benchmarks more valuable for every existing business.

---

## Appendix A: Drizzle ORM Schema Reference

The complete schema is implemented in Drizzle ORM (TypeScript) at `packages/db/schema.ts`. The SQL in this document is the logical representation. The Drizzle schema is the source of truth for the application.

Key Drizzle design decisions:
- All UUIDs use `uuid('id').primaryKey().defaultRandom()`
- All timestamps use `timestamp('created_at', { withTimezone: true }).notNull().defaultNow()`
- JSONB columns use `jsonb('content').notNull()` with Zod validation at the application layer
- Enums use `.check()` constraints rather than Postgres ENUMs (easier to extend without migration)
- `organization_id` is on every business-scoped table (enforced by TypeScript types, validated by RLS)

## Appendix B: Storage Projections

| Metric | Month 3 (300 users) | Month 12 (10K users) | Year 3 (100K users) |
|--------|:-------------------:|:--------------------:|:-------------------:|
| Database size (Postgres) | ~5 GB | ~50-80 GB | ~500 GB-1 TB |
| Media storage (R2) | ~15 GB | ~525 GB | ~5 TB |
| Benchmark aggregate rows | ~5,000 | ~50,000 | ~500,000 |
| Raw attribution events | ~27,000 | ~3,780,000 | ~25,000,000 (13-mo rolling cap) |
| Monthly Neon cost | ~$69 | ~$200-400 | Migrate to dedicated Postgres or Neon Enterprise |

All projections are within Neon's scaling range through 10K users. The 100K user projection triggers the columnar-store migration for the benchmark path, which is the planned scaling path (see infrastructure.md scaling triggers).

## Appendix C: Decision Traceability

| Decision | Traces To |
|----------|-----------|
| 13-month raw event retention | Jensen Q1: year-over-year comparison; infrastructure.md: storage cost balance |
| Three-layer attribution model | Jensen Q2: "show Maria a causal claim in her Weekly Digest" |
| Dual-write at application layer | Jensen Q3 + Q4: anonymize at write-time, not query-time |
| k=5 minimum anonymity set | Jensen Q3: GDPR-safe cross-business aggregation; industry standard for k-anonymity |
| Broad verticals only (no sub-vertical) | Jensen Q3: prevent re-identification in sparse cohorts |
| City-level geography (no neighborhood) | Jensen Q3: same rationale |
| Weekly minimum time granularity | Jensen Q3: daily + vertical + city could identify individual businesses |
| `safe_benchmarks` view as sole read path | Jensen Q3: enforce privacy at database layer, not just application layer |
| Benchmark path decoupled from business path | Jensen Q4: can migrate to columnar store without touching transactional path |
| `benchmark_contributions` tracking table | Jensen Q3: accurate sample_size without storing business_id in benchmarks |
| Consent opt-in default ON for benchmarks | PRD: GDPR compliance; benchmarks contain no PII so opt-out only degrades accuracy |
| No RLS on benchmark tables | Jensen Q4: benchmarks are globally readable, contain no tenant-specific data |

---

*This document was produced by the Great Minds Agency in response to Jensen Huang Board Issue #001: "Build the Data Moat Before You Build the Product." It should be reviewed and approved by the full founding team before sprint planning begins.*
