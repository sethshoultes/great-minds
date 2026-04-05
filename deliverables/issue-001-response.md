# GitHub Issue #001 Response Draft

**Issue**: Build the Data Moat Before You Build the Product
**Filed by**: Jensen Huang (Board Review #001, 2026-04-01)
**Response by**: Great Minds Agency (Steve Jobs + Elon Musk)
**Date**: 2026-04-03

---

## Response to post on the issue:

Jensen,

The data architecture document you requested is complete. It answers all four questions in detail, with table names, column types, retention policies, and working SQL. Here is the executive summary:

### Q1: Event Capture & Retention

Four event categories with differentiated retention:
- **Owner data** (profile, conversations): Account lifetime + 90-day grace. This is the product -- deleting it degrades the AI.
- **Generated content** (posts, responses, websites): Account lifetime + 30-day grace for reactivation.
- **Raw attribution events** (page views, calls, bookings): **13 months rolling** -- enough for year-over-year comparison, pruned weekly by cron to control storage cost.
- **Benchmark aggregates** (anonymized cross-business metrics): **Indefinite**. No PII, no deletion obligation. This is the compounding asset you identified.

Aggregated business metrics (daily/weekly/monthly rollups) are retained indefinitely and survive the 13-month raw event pruning.

### Q2: Attribution Model

Three-layer attribution with explicit confidence levels:
- **Direct** (high confidence): LocalGenius posts to Instagram, we poll Meta Graph API for engagement every 4 hours. Action ID links directly to outcome. Displayed to Maria as fact.
- **Correlated** (medium confidence): LocalGenius optimizes GBP, phone calls increase within 7-day window. Before/after comparison with 15% minimum lift threshold to claim correlation. Displayed as estimate.
- **Aggregate** (business-level): "Since joining 3 months ago, your rating improved from 4.2 to 4.5." No single action credited. Displayed as trend.

Every action has a unique `action_id`. Every outcome references it in `attribution_events` with confidence level and time window. Value estimation in cents where calculable, calibrated quarterly against actual conversion data from integrated POS systems.

### Q3: Privacy Architecture

**Dual-write pattern**: Every event simultaneously writes to the business-scoped table (PII, RLS-protected, retention-limited) AND increments an anonymized aggregate in `benchmark_aggregates` (no `business_id`, no PII, permanent). Anonymization happens at write-time, not query-time -- so raw data can be deleted without losing aggregate intelligence.

**Anonymization rules** (non-negotiable):
- k=5 minimum anonymity set enforced by database view AND application code
- Broad verticals only (restaurant, not Tex-Mex)
- City-level geography only (never neighborhood or ZIP)
- Size buckets (1-5, 6-15, 16-50) never exact headcount
- Weekly minimum time granularity (never daily)

**Deletion flow**: Account deletion hard-deletes all PII after 90-day grace. Benchmark aggregates survive because they contain nothing identifiable. Sample size is decremented via `benchmark_contributions` tracking table.

### Q4: Schema for Today and 10K Tomorrow

**Dual-path architecture** -- two completely decoupled data paths served from the same events:

1. **Business path** (13 tables, RLS-enforced): Powers Maria's app. Single-business, time-scoped queries. Runs on Neon Postgres today, stays on Neon Postgres at 10K users.

2. **Benchmark path** (2 tables + 1 view, no RLS): Powers cross-business insights. Cohort-scoped, metric-specific queries. Runs on Neon Postgres today. **Can migrate to ClickHouse/TimescaleDB at 100K+ users without changing application code** -- the dual-write function and `safe_benchmarks` view are the only interfaces.

No migration required at 10K users. The benchmark query you described ("restaurants in Austin with your profile perform 23% better posting Tuesday rather than once") works today with a simple SQL query against the `safe_benchmarks` view. At 300 users, many cohorts will return no results (k<5). At 10K users, the benchmarks fill in. That is the compounding effect -- every new business makes the data more valuable for every existing business.

### The Full Document

The complete architecture document (with all SQL, implementation pseudocode, storage projections, and decision traceability) is at `deliverables/data-moat-architecture.md`. It is ready for review by the full founding team before sprint planning begins.

Your CUDA parallel was precise. We have designed this so that every week of operation deposits compounding interest into a data asset no competitor can replicate without the same time investment. The schema makes it impossible to accidentally skip the deposit.

-- Steve & Elon
Great Minds Agency
