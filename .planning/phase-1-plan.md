# Phase 1 Plan — Pulse Benchmark Engine (MVP)

**Generated**: 2026-04-09
**Requirements**: `rounds/localgenius-benchmark-engine/decisions.md` + `prds/localgenius-benchmark-engine.md`
**Total Tasks**: 18
**Waves**: 5 (Wave 0 is blocker)
**Timeline**: 2 weeks (~500 LOC)
**Product Name**: Pulse

---

## Executive Summary

This plan implements the Pulse benchmark engine for LocalGenius — a competitive intelligence tool that shows restaurant owners how they compare to peers via a single percentile rank.

**Key Insight from Codebase Scout**: LocalGenius already has production-ready infrastructure:
- `benchmarkAggregates` table designed for this use case
- Dual-write pattern in analytics.recordEvent()
- Multi-tenant RLS architecture
- Job scheduler framework

**Build Strategy**: Extend existing infrastructure, don't reinvent. Focus on the UI layer and public distribution features.

---

## Requirements Traceability

| Requirement | Task(s) | Wave |
|-------------|---------|------|
| REQ-031: Data Audit | phase-1-task-0 | 0 |
| REQ-025: Database Schema | phase-1-task-1 | 1 |
| REQ-008: NAICS Codes | phase-1-task-1 | 1 |
| REQ-016: Core Metrics | phase-1-task-2 | 1 |
| INT-3, INT-4: Analytics Integration | phase-1-task-3 | 1 |
| REQ-017: Nightly Batch Job | phase-1-task-4 | 2 |
| REQ-018: API Endpoint | phase-1-task-5 | 2 |
| REQ-009, REQ-015, REQ-028, REQ-037: Peer Groups | phase-1-task-4, task-5 | 2 |
| REQ-019: PulseScore Component | phase-1-task-6 | 3 |
| REQ-020: IndustryComparison Component | phase-1-task-7 | 3 |
| REQ-021: PeerGroupSelector Component | phase-1-task-8 | 3 |
| REQ-036: Insufficient Data State | phase-1-task-9 | 3 |
| REQ-022: EmbeddableBadge Component | phase-1-task-10 | 3 |
| REQ-023: Dashboard Page | phase-1-task-11 | 4 |
| REQ-024: Public Report Page | phase-1-task-12 | 4 |
| REQ-012: State of Local Restaurants | phase-1-task-13 | 4 |
| REQ-014: Freemium Preview | phase-1-task-14 | 4 |
| REQ-026: Badge Embed Script | phase-1-task-15 | 4 |
| QA-1 to QA-5: Testing | phase-1-task-16, task-17 | 5 |

---

## Wave Execution Order

### Wave 0 (BLOCKER — Day 1)

This task must complete before any code is written.

```xml
<task-plan id="phase-1-task-0" wave="0">
  <title>Data Audit — Validate Core Metrics Exist</title>
  <requirement>REQ-031: Audit existing schema to confirm 5 core metrics exist before build</requirement>
  <description>CRITICAL BLOCKER. Before writing any code, validate that the 5 core metrics (engagement rate, post frequency, follower growth, response time, conversion rate) can be calculated from existing data. If metrics don't exist, this becomes a data collection project and timeline explodes.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/db/schema.ts" reason="Contains analyticsEvents (lines 397-422), attributionEvents (lines 427-455), benchmarkAggregates (lines 490-524)" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/analytics.ts" reason="Contains recordEvent() with dual-write to benchmarkAggregates" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="Defines 5 core metrics (line 200-206)" />
  </context>

  <steps>
    <step order="1">Query analyticsEvents for distinct eventType values: SELECT DISTINCT eventType FROM analytics_events</step>
    <step order="2">Map each metric to existing event types:
      - Engagement rate: social_engagement events ÷ follower count
      - Post frequency: social_post events per week
      - Follower growth: follower_count snapshots over time
      - Response time: review_response events with timestamp deltas
      - Conversion rate: attributionEvents with confidence > 0</step>
    <step order="3">Document gaps: which metrics have data, which don't</step>
    <step order="4">For missing metrics, identify the data collection change required</step>
    <step order="5">Write audit report to .planning/data-audit-results.md</step>
    <step order="6">Make GO/NO-GO decision: if >2 metrics missing, escalate to stakeholders</step>
  </steps>

  <verification>
    <check type="manual">Review .planning/data-audit-results.md</check>
    <check type="manual">Confirm GO decision documented before proceeding</check>
  </verification>

  <dependencies>
    <!-- Wave 0: No dependencies - this IS the blocker -->
  </dependencies>

  <commit-message>docs(pulse): complete data audit for 5 core metrics availability</commit-message>
</task-plan>
```

---

### Wave 1 (Parallel — Days 2-4) — Foundation

These tasks establish the data layer. They can run in parallel.

```xml
<task-plan id="phase-1-task-1" wave="1">
  <title>Pulse Database Schema Extensions</title>
  <requirement>REQ-025: Database schema for benchmarks, REQ-008: NAICS codes</requirement>
  <description>Extend existing LocalGenius schema with Pulse-specific tables. Leverage the existing benchmarkAggregates table pattern. Add pulseRankings for storing calculated percentiles and naicsIndustries reference table.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/db/schema.ts" reason="Existing schema with benchmarkAggregates (lines 490-524), businesses (lines 124-159), multi-tenant RLS patterns" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/drizzle.config.ts" reason="Drizzle ORM configuration" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/.planning/REQUIREMENTS.md" reason="REQ-008: NAICS code requirements" />
  </context>

  <steps>
    <step order="1">Add pulseRankings table to schema.ts:
      - id: uuid primary key
      - businessId: references businesses
      - organizationId: references organizations (for RLS)
      - naicsCode: varchar(6)
      - regionType: enum('metro', 'state')
      - regionCode: varchar(10)
      - sizeBucket: enum('1-5', '6-15', '16-50')
      - metricName: varchar(50)
      - percentileRank: integer (0-100)
      - peerCount: integer
      - benchmarkDate: date
      - calculatedAt: timestamp</step>
    <step order="2">Add naicsIndustries reference table:
      - code: varchar(6) primary key
      - level: integer (2, 4, or 6)
      - description: text
      - parentCode: varchar(6) nullable</step>
    <step order="3">Add unique constraint on pulseRankings: (businessId, metricName, benchmarkDate)</step>
    <step order="4">Add composite index: (naicsCode, regionType, regionCode, sizeBucket, benchmarkDate)</step>
    <step order="5">Seed naicsIndustries with restaurant codes: 722110, 722511, 722513, 722514, 722515</step>
    <step order="6">Run npm run db:generate && npm run db:push</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="manual">psql: SELECT * FROM information_schema.tables WHERE table_name LIKE 'pulse%'</check>
    <check type="manual">psql: SELECT * FROM naics_industries WHERE code LIKE '722%'</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-0" reason="Requires data audit GO decision" />
  </dependencies>

  <commit-message>feat(pulse): add database schema for rankings and NAICS industries</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-2" wave="1">
  <title>Core Metrics Service</title>
  <requirement>REQ-016: 5 core metrics tracked and calculated</requirement>
  <description>Create a metrics normalization service that transforms raw analytics events into the 5 core Pulse metrics. This service will be used by the nightly batch job.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/analytics.ts" reason="Existing analytics aggregation patterns (getWeeklyAggregates, getAttributionSummary)" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/db/schema.ts" reason="analyticsEvents and attributionEvents schemas" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/.planning/REQUIREMENTS.md" reason="Metric definitions (REQ-016)" />
  </context>

  <steps>
    <step order="1">Create /src/services/pulse-metrics.ts</step>
    <step order="2">Define MetricDefinition interface: { name, calculate: (events) => number, unit }</step>
    <step order="3">Implement engagementRate: (likes + comments) / followers * 100</step>
    <step order="4">Implement postFrequency: count(social_post events) / weeks in period</step>
    <step order="5">Implement followerGrowth: (current - previous) / previous * 100</step>
    <step order="6">Implement responseTime: avg(review_response.timestamp - review.timestamp)</step>
    <step order="7">Implement conversionRate: attributed_conversions / total_impressions * 100</step>
    <step order="8">Export getMetricsForBusiness(businessId, dateRange) function</step>
    <step order="9">Add JSDoc documentation for each metric calculation</step>
  </steps>

  <verification>
    <check type="test">npm run test -- --grep "pulse-metrics"</check>
    <check type="manual">Call getMetricsForBusiness with test business, verify 5 metrics returned</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-0" reason="Requires data audit to confirm metric sources" />
  </dependencies>

  <commit-message>feat(pulse): add core metrics normalization service</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-3" wave="1">
  <title>Analytics Integration Hook</title>
  <requirement>INT-3, INT-4: Leverage existing benchmarkAggregates and recordEvent() for dual-write</requirement>
  <description>Extend the existing analytics.recordEvent() to capture Pulse-relevant data. Ensures new events automatically flow into benchmark aggregations.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/analytics.ts" reason="Existing recordEvent() with updateBenchmarks() dual-write (line 129-177)" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/api/middleware/tenant.ts" reason="getSizeBucket() helper function" />
  </context>

  <steps>
    <step order="1">Review existing updateBenchmarks() in analytics.ts</step>
    <step order="2">Add Pulse metric mappings to the metricName field:
      - 'pulse_engagement_rate'
      - 'pulse_post_frequency'
      - 'pulse_follower_growth'
      - 'pulse_response_time'
      - 'pulse_conversion_rate'</step>
    <step order="3">Ensure business.vertical (NAICS code equivalent) flows to aggregates</step>
    <step order="4">Ensure business.city flows to aggregates</step>
    <step order="5">Use getSizeBucket(business.employeeCount) for size categorization</step>
    <step order="6">Add unit tests for the integration</step>
  </steps>

  <verification>
    <check type="test">npm run test -- --grep "analytics"</check>
    <check type="manual">Record test event, query benchmarkAggregates for pulse_ prefix</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-0" reason="Requires data audit completion" />
  </dependencies>

  <commit-message>feat(pulse): integrate Pulse metrics into analytics dual-write pipeline</commit-message>
</task-plan>
```

---

### Wave 2 (Parallel, after Wave 1 — Days 5-7) — Data Layer

```xml
<task-plan id="phase-1-task-4" wave="2">
  <title>Nightly Benchmark Calculation Job</title>
  <requirement>REQ-017: Nightly batch percentile calculation, REQ-009: Curated peer groups, REQ-015: 50+ business threshold, REQ-028: Regional fallback</requirement>
  <description>Create the nightly batch job that calculates percentile rankings for each business within their peer group. Uses PostgreSQL PERCENTILE_CONT() for accurate statistical ranking with metro-to-state fallback.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/scheduler.ts" reason="Job scheduler framework with cron registration" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/jobs/analytics-rollup.ts" reason="Pattern for batch aggregation jobs" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/pulse-metrics.ts" reason="Metrics service from task-2" />
  </context>

  <steps>
    <step order="1">Create /src/services/jobs/pulse-benchmark.ts with PulseBenchmarkJob class</step>
    <step order="2">Implement peer group query:
      SELECT business_id, naics_code, city, size_bucket, metric_value
      FROM benchmark_aggregates
      WHERE metric_name LIKE 'pulse_%'
      GROUP BY naics_code, city, size_bucket
      HAVING count(DISTINCT business_id) >= 10</step>
    <step order="3">Implement metro fallback: if peer count < 10 at city level, expand to state</step>
    <step order="4">Implement percentile calculation using PERCENTILE_CONT:
      PERCENT_RANK() WITHIN GROUP (ORDER BY metric_value) * 100</step>
    <step order="5">Insert/update pulseRankings table with calculated percentiles</step>
    <step order="6">Track peer count for each ranking (for UI display)</step>
    <step order="7">Register job in scheduler.ts: cron '0 2 * * *' (2 AM daily)</step>
    <step order="8">Add job result logging: businesses processed, duration, errors</step>
    <step order="9">Handle edge cases: NULL metrics, division by zero, empty cohorts</step>
  </steps>

  <verification>
    <check type="test">npm run test -- --grep "pulse-benchmark"</check>
    <check type="manual">curl -X POST localhost:3000/api/cron/pulse-benchmark -H "X-Cron-Secret: $SECRET"</check>
    <check type="manual">Query pulseRankings: SELECT COUNT(*) FROM pulse_rankings WHERE benchmark_date = CURRENT_DATE</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Requires pulseRankings schema" />
    <depends-on task-id="phase-1-task-2" reason="Requires metrics service" />
    <depends-on task-id="phase-1-task-3" reason="Requires analytics integration" />
  </dependencies>

  <commit-message>feat(pulse): add nightly benchmark calculation job with PERCENTILE_CONT</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-5" wave="2">
  <title>Benchmarks API Endpoint</title>
  <requirement>REQ-018: GET /api/pulse/benchmarks/:customerId</requirement>
  <description>Create the single REST endpoint that powers the Pulse dashboard. Returns percentile rank, peer group metadata, and comparison metrics.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/app/api/analytics/route.ts" reason="API route pattern with auth, response format" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/api/middleware/auth.ts" reason="verifyAuth() middleware" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/api/middleware/tenant.ts" reason="Multi-tenant context" />
  </context>

  <steps>
    <step order="1">Create /src/app/api/pulse/benchmarks/[customerId]/route.ts</step>
    <step order="2">Add GET handler with verifyAuth() middleware</step>
    <step order="3">Security check: verify customerId matches auth.businessId</step>
    <step order="4">Query pulseRankings for latest benchmarkDate matching businessId</step>
    <step order="5">Query peer group metadata: industry name, region, size range, peer count</step>
    <step order="6">Build response shape:
      {
        data: {
          percentileRank: number,
          peerGroup: { industry, region, sizeRange, peerCount },
          metrics: [{ name, value, percentile, median, p25, p75 }]
        },
        meta: { timestamp, benchmarkDate }
      }</step>
    <step order="7">Handle errors: 401 (no auth), 403 (wrong customer), 404 (no data)</step>
    <step order="8">Add response caching headers (5 min cache, data updates nightly)</step>
  </steps>

  <verification>
    <check type="test">npm run test -- --grep "api/pulse/benchmarks"</check>
    <check type="manual">curl -H "Authorization: Bearer $TOKEN" localhost:3000/api/pulse/benchmarks/$ID</check>
    <check type="manual">Verify 401 without token, 403 with wrong customer ID</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Requires pulseRankings schema" />
    <depends-on task-id="phase-1-task-4" reason="Requires data from benchmark job" />
  </dependencies>

  <commit-message>feat(pulse): add GET /api/pulse/benchmarks/:customerId endpoint</commit-message>
</task-plan>
```

---

### Wave 3 (Parallel, after Wave 2 — Days 8-10) — UI Components

```xml
<task-plan id="phase-1-task-6" wave="3">
  <title>PulseScore Hero Component</title>
  <requirement>REQ-019: Hero component, REQ-002: Single percentile on first screen</requirement>
  <description>The most important component in Pulse. Displays the single percentile number prominently. This is the emotional hook — instant clarity, one number, one answer.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/components/digest/WeeklyDigest.tsx" reason="Existing metrics display with animations" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/lib/animations.ts" reason="fadeUpStagger animation utilities" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="UX requirement: single percentile hero" />
  </context>

  <steps>
    <step order="1">Create /src/components/pulse/PulseScore.tsx with 'use client'</step>
    <step order="2">Define props: { percentileRank: number, metricLabel?: string, loading?: boolean }</step>
    <step order="3">Render "You're ahead of {percentileRank}% of restaurants" in large typography</step>
    <step order="4">Alternative phrasing option: "You're in the {100-percentileRank}th percentile"</step>
    <step order="5">Add subtle entrance animation using existing fadeUpStagger</step>
    <step order="6">Add context subtext: "in {metricLabel}" if provided</step>
    <step order="7">Handle loading state with skeleton placeholder</step>
    <step order="8">Apply brand voice: confident, direct, no hedging</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="manual">Import in test page, verify typography is prominent</check>
    <check type="manual">Verify loading skeleton renders correctly</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-5" reason="Needs API response shape understanding" />
  </dependencies>

  <commit-message>feat(pulse): add PulseScore hero component</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-7" wave="3">
  <title>IndustryComparison Charts Component</title>
  <requirement>REQ-020: 3-4 comparison charts, REQ-010: Charts showing position vs peers</requirement>
  <description>Visual comparison showing customer's position across 4 metrics. Fixed layout (no customization). Uses existing sparkline patterns for consistency.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/components/digest/WeeklyDigest.tsx" reason="Sparkline component pattern" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="4 metrics, no customization" />
  </context>

  <steps>
    <step order="1">Create /src/components/pulse/IndustryComparison.tsx</step>
    <step order="2">Define props:
      { metrics: Array<{
        name: string,
        yourValue: number,
        percentile: number,
        median: number,
        p25: number,
        p75: number
      }> }</step>
    <step order="3">Create MetricCard subcomponent showing:
      - Your value (prominent)
      - Position indicator (green above median, neutral in band, red below p25)
      - Percentile band visualization (p25-median-p75)</step>
    <step order="4">Implement exactly 4 cards: Engagement, Frequency, Growth, Response Time</step>
    <step order="5">Use 2x2 grid layout on desktop, single column on mobile</step>
    <step order="6">Add loading state per card (independent)</step>
    <step order="7">Color coding: green > median, gray in band, red < p25</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="manual">Render with mock data, verify all 4 charts display</check>
    <check type="manual">Test responsive layout on mobile viewport</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-5" reason="Needs API metrics response shape" />
  </dependencies>

  <commit-message>feat(pulse): add IndustryComparison charts component</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-8" wave="3">
  <title>PeerGroupSelector Display Component</title>
  <requirement>REQ-021: Read-only peer group display</requirement>
  <description>Shows which peer group the customer is being compared against. Builds trust through transparency. Read-only, no selection — curated only.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/components/shared/" reason="Existing UI component patterns" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="Curated peer groups, no browsing" />
  </context>

  <steps>
    <step order="1">Create /src/components/pulse/PeerGroupSelector.tsx</step>
    <step order="2">Define props: { industry: string, region: string, sizeRange: string, peerCount: number }</step>
    <step order="3">Display: "Comparing to {peerCount} {industry} businesses in {region} ({sizeRange} employees)"</step>
    <step order="4">Style as subtle info card (supporting role, not prominent)</step>
    <step order="5">Add info icon with tooltip: "Your peer group is selected based on your industry, location, and business size to ensure meaningful comparisons."</step>
    <step order="6">Handle edge case: if peerCount < 50, show softer confidence indicator</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="manual">Render component, verify tooltip works</check>
    <check type="manual">Verify no interactive/edit elements</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-5" reason="Needs peer group data shape" />
  </dependencies>

  <commit-message>feat(pulse): add PeerGroupSelector display component</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-9" wave="3">
  <title>Insufficient Data State Component</title>
  <requirement>REQ-036: Graceful message when cohort < threshold</requirement>
  <description>When peer group has insufficient data for meaningful benchmarks, show helpful message explaining why and when to check back. Not an error state — an informational state.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/components/shared/NotificationBanner.tsx" reason="Existing notification patterns" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="Minimum 10 for display, 50 for full confidence" />
  </context>

  <steps>
    <step order="1">Create /src/components/pulse/InsufficientDataState.tsx</step>
    <step order="2">Define props: { peerGroup: { industry, region, size }, currentCount: number, minRequired: number }</step>
    <step order="3">Friendly message: "We need more restaurants like yours to show meaningful benchmarks."</step>
    <step order="4">Context: "Currently tracking {currentCount} {industry} businesses in {region}. Benchmarks appear when we reach {minRequired}."</step>
    <step order="5">Add hopeful note: "As more restaurants join LocalGenius, your benchmarks will unlock."</step>
    <step order="6">Style as informational (blue/gray), not error (red)</step>
    <step order="7">Include illustration or icon suggesting "coming soon"</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="manual">Render with currentCount=5, minRequired=10</check>
    <check type="manual">Verify messaging is encouraging, not discouraging</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-5" reason="Needs to understand when this state triggers" />
  </dependencies>

  <commit-message>feat(pulse): add InsufficientDataState component</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-10" wave="3">
  <title>EmbeddableBadge Component</title>
  <requirement>REQ-022: Badge component with tiers, REQ-033: Calculation date</requirement>
  <description>Badge showing "Top X% in Engagement" for customer websites. Includes qualification date to prevent outdated displays. Three tiers: Gold (Top 10%), Silver (Top 25%), Bronze (Top 50%).</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="Badge tiers and date requirement" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/components/" reason="Existing styling patterns" />
  </context>

  <steps>
    <step order="1">Create /src/components/pulse/EmbeddableBadge.tsx</step>
    <step order="2">Define props:
      { tier: 'gold' | 'silver' | 'bronze',
        percentile: number,
        metricName: string,
        businessName: string,
        qualifiedDate: string,
        variant?: 'light' | 'dark' }</step>
    <step order="3">Map tiers: gold = top 10%, silver = top 25%, bronze = top 50%</step>
    <step order="4">Design badge: Pulse logo, tier badge, "{businessName}" text, "Top {X}% in {metric}"</step>
    <step order="5">Include date: "Verified {qualifiedDate}" in small text</step>
    <step order="6">Create distinct visual styles: gold = gold/amber, silver = gray/silver, bronze = bronze/copper</step>
    <step order="7">Support light/dark background variants</step>
    <step order="8">Keep component dependency-free for embed use</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="manual">Render all 3 tiers, verify visual distinction</check>
    <check type="manual">Test on light and dark backgrounds</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-5" reason="Needs percentile thresholds from API" />
  </dependencies>

  <commit-message>feat(pulse): add EmbeddableBadge component with tier system</commit-message>
</task-plan>
```

---

### Wave 4 (Parallel, after Wave 3 — Days 11-13) — Integration

```xml
<task-plan id="phase-1-task-11" wave="4">
  <title>Main Pulse Dashboard Page</title>
  <requirement>REQ-023: Dashboard page integrating all components</requirement>
  <description>The main Pulse dashboard that brings together all components into a cohesive, opinionated layout. This is where the magic happens — one page, one number, instant clarity.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/app/" reason="Next.js App Router patterns" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/components/pulse/" reason="All Pulse components from Wave 3" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/lib/auth-client.ts" reason="Client-side auth utilities" />
  </context>

  <steps>
    <step order="1">Create /src/app/pulse/dashboard/page.tsx</step>
    <step order="2">Add authentication check — redirect to /login if not authenticated</step>
    <step order="3">Fetch benchmark data from /api/pulse/benchmarks/:customerId</step>
    <step order="4">Layout structure (fixed, not customizable):
      - Header: "Pulse" branding
      - Hero: PulseScore (full width, prominent)
      - Subhead: PeerGroupSelector (subtle, informational)
      - Body: IndustryComparison (2x2 grid)</step>
    <step order="5">Conditional rendering: if peerCount < 10, show InsufficientDataState instead</step>
    <step order="6">Add loading skeleton for entire page while data fetches</step>
    <step order="7">Add error boundary with friendly error message</step>
    <step order="8">Add "Last updated: {benchmarkDate}" footer</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="test">npm run test -- --grep "pulse/dashboard"</check>
    <check type="manual">Visit /pulse/dashboard as authenticated user</check>
    <check type="manual">Verify layout: hero number prominent, charts below</check>
    <check type="manual">Verify redirect to login when not authenticated</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-5" reason="Requires API endpoint" />
    <depends-on task-id="phase-1-task-6" reason="Requires PulseScore" />
    <depends-on task-id="phase-1-task-7" reason="Requires IndustryComparison" />
    <depends-on task-id="phase-1-task-8" reason="Requires PeerGroupSelector" />
    <depends-on task-id="phase-1-task-9" reason="Requires InsufficientDataState" />
  </dependencies>

  <commit-message>feat(pulse): add main dashboard page with integrated components</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-12" wave="4">
  <title>Public Report Page Template</title>
  <requirement>REQ-024: SEO-friendly public report page</requirement>
  <description>Page template for public benchmark reports like "State of Local Restaurants". Optimized for SEO with proper meta tags, structured data, and social sharing.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/app/" reason="Next.js App Router patterns" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="Public reports for SEO/PR" />
  </context>

  <steps>
    <step order="1">Create /src/app/pulse/reports/[slug]/page.tsx</step>
    <step order="2">Add generateMetadata() for SEO:
      - title: "{Report Title} | Pulse by LocalGenius"
      - description: Dynamic summary
      - Open Graph tags for social sharing</step>
    <step order="3">Add JSON-LD structured data (Article schema)</step>
    <step order="4">Create report layout sections:
      - Hero: Report title, publish date, key stat
      - Executive Summary: 3 bullet points
      - Key Metrics: Charts/visualizations
      - Methodology: Data collection explanation
      - CTA: "See where your restaurant ranks"</step>
    <step order="5">Style for readability with proper typography hierarchy</step>
    <step order="6">Add social sharing buttons (Twitter, LinkedIn, Facebook)</step>
    <step order="7">Add badge embed code section for easy copying</step>
    <step order="8">Add "Powered by LocalGenius" footer with signup CTA</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="manual">Visit /pulse/reports/test-report</check>
    <check type="manual">Check meta tags with View Source</check>
    <check type="manual">Validate structured data at search.google.com/test/rich-results</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Needs badge component for embed section" />
  </dependencies>

  <commit-message>feat(pulse): add public report page template with SEO optimization</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-13" wave="4">
  <title>State of Local Restaurants Report</title>
  <requirement>REQ-012: First public benchmark report</requirement>
  <description>Create the first public benchmark report content. This is the content that drives SEO and establishes LocalGenius as a thought leader in local business marketing.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="Report content requirements" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/app/pulse/reports/" reason="Report page template" />
  </context>

  <steps>
    <step order="1">Create /content/reports/state-of-local-restaurants.json (or .md with frontmatter)</step>
    <step order="2">Write Executive Summary:
      - Key finding 1: Average restaurant engagement rate
      - Key finding 2: Top performing regions
      - Key finding 3: Size correlation with performance</step>
    <step order="3">Add Key Metrics section with visualizations:
      - Median engagement rate by size
      - Post frequency distribution
      - Response time benchmarks</step>
    <step order="4">Add Regional Insights: top 5 metros, lagging metros</step>
    <step order="5">Add Size Analysis: small (1-5) vs medium (6-15) vs large (16-50)</step>
    <step order="6">Add Methodology: data collection, anonymization, statistical approach</step>
    <step order="7">Add CTA: "See where your restaurant ranks — sign up for LocalGenius"</step>
    <step order="8">Generate placeholder charts (can be updated with real data post-launch)</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="manual">Visit /pulse/reports/state-of-local-restaurants</check>
    <check type="manual">Verify all sections render</check>
    <check type="manual">Verify CTA links to signup</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-12" reason="Requires report page template" />
    <depends-on task-id="phase-1-task-4" reason="Needs benchmark data for content" />
  </dependencies>

  <commit-message>content(pulse): add State of Local Restaurants benchmark report</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-14" wave="4">
  <title>Freemium Preview Interface</title>
  <requirement>REQ-014: Preview with signup gate</requirement>
  <description>Public preview showing partial benchmark data to drive signups. Shows industry-level stats but hides personal percentile behind auth.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/app/" reason="Page routing patterns" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/components/pulse/" reason="Pulse components" />
  </context>

  <steps>
    <step order="1">Create /src/app/pulse/preview/page.tsx (public, no auth required)</step>
    <step order="2">Accept query params: ?industry=restaurants&region=denver</step>
    <step order="3">Create public API endpoint: /api/pulse/preview for aggregate stats only</step>
    <step order="4">Show industry-level stats: "Restaurants in Denver average X% engagement"</step>
    <step order="5">Add blurred/locked charts overlay with message: "Sign up to see your exact rank"</step>
    <step order="6">Add prominent CTA button: "See How You Stack Up" → /signup</step>
    <step order="7">Track preview page views for conversion analytics</step>
    <step order="8">Add social sharing: "Share industry insights with your network"</step>
  </steps>

  <verification>
    <check type="build">npm run build</check>
    <check type="manual">Visit /pulse/preview?industry=restaurants&region=denver (no auth)</check>
    <check type="manual">Verify charts are blurred</check>
    <check type="manual">Verify CTA links to signup</check>
    <check type="manual">Verify no personal data exposed</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-7" reason="Requires IndustryComparison for blur overlay" />
    <depends-on task-id="phase-1-task-5" reason="Needs API data structure understanding" />
  </dependencies>

  <commit-message>feat(pulse): add freemium preview with signup gate</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-15" wave="4">
  <title>Badge Embed Script</title>
  <requirement>REQ-026: Lightweight embeddable script for customer HTML</requirement>
  <description>JavaScript embed script that customers add to their websites to display their Pulse badge. Must be lightweight, work without React, and handle CORS.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/public/" reason="Static assets location" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="Badge embed requirements" />
  </context>

  <steps>
    <step order="1">Create /public/badges/pulse-badge.js (vanilla JS, no dependencies)</step>
    <step order="2">Script accepts data attributes: data-business-id, data-metric, data-theme</step>
    <step order="3">Create public badge API: /api/pulse/badges/[businessId]/route.ts
      - Returns: { tier, percentile, metric, qualifiedDate, businessName }
      - No auth required (public badges)
      - Add rate limiting</step>
    <step order="4">Render badge using vanilla JS DOM manipulation</step>
    <step order="5">Include inline CSS scoped to .pulse-badge class (prevent conflicts)</step>
    <step order="6">Add CORS headers to badge API: Access-Control-Allow-Origin: *</step>
    <step order="7">Handle errors: invalid business ID, no badge qualification</step>
    <step order="8">Keep script under 5KB minified</step>
    <step order="9">Document embed code in help center format</step>
  </steps>

  <verification>
    <check type="manual">Create test.html with embed script, verify badge renders</check>
    <check type="manual">Test cross-origin: serve HTML from different port</check>
    <check type="manual">Verify script size: ls -la public/badges/pulse-badge.js</check>
    <check type="manual">Test in Chrome, Firefox, Safari</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Requires badge design/styling from component" />
  </dependencies>

  <commit-message>feat(pulse): add embeddable badge script for customer websites</commit-message>
</task-plan>
```

---

### Wave 5 (After Wave 4 — Day 14) — Testing & Polish

```xml
<task-plan id="phase-1-task-16" wave="5">
  <title>Integration Tests</title>
  <requirement>QA-1 to QA-4: Tests for calculations, fallback, badges, auth</requirement>
  <description>Comprehensive integration tests ensuring Pulse calculations are correct, fallback logic works, and security is enforced.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/vitest.config.ts" reason="Test configuration" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/__tests__/" reason="Existing test patterns" />
  </context>

  <steps>
    <step order="1">Create /src/__tests__/services/pulse-benchmark.test.ts</step>
    <step order="2">Test percentile calculation accuracy with seed data (50+ businesses)</step>
    <step order="3">Test edge cases: 1 business, 9 businesses, exactly 10, 100+</step>
    <step order="4">Test metro-to-state fallback when metro < 10</step>
    <step order="5">Create /src/__tests__/api/pulse-benchmarks.test.ts</step>
    <step order="6">Test 401 for unauthenticated requests</step>
    <step order="7">Test 403 when accessing different customer's data</step>
    <step order="8">Test badge tier assignment: verify 10%/25%/50% thresholds</step>
    <step order="9">Test NULL handling and empty cohort edge cases</step>
  </steps>

  <verification>
    <check type="test">npm run test -- --grep "pulse" --coverage</check>
    <check type="manual">Verify coverage > 80% for Pulse code</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-4" reason="Tests benchmark job" />
    <depends-on task-id="phase-1-task-5" reason="Tests API endpoint" />
    <depends-on task-id="phase-1-task-10" reason="Tests badge qualification" />
  </dependencies>

  <commit-message>test(pulse): add integration tests for benchmark calculation and API</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-17" wave="5">
  <title>E2E Tests</title>
  <requirement>QA-5: End-to-end tests with Playwright</requirement>
  <description>End-to-end tests verifying the complete Pulse user flow from landing to dashboard.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/playwright.config.ts" reason="Playwright config" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/e2e/" reason="Existing E2E patterns" />
  </context>

  <steps>
    <step order="1">Create /e2e/pulse.spec.ts</step>
    <step order="2">Test: Unauthenticated user at /pulse/dashboard redirects to login</step>
    <step order="3">Test: Authenticated user sees PulseScore hero number</step>
    <step order="4">Test: Peer group info displays correctly</step>
    <step order="5">Test: All 4 comparison charts render</step>
    <step order="6">Test: InsufficientDataState shows when peerCount < 10</step>
    <step order="7">Test: Public report page loads at /pulse/reports/state-of-local-restaurants</step>
    <step order="8">Test: Freemium preview shows blurred charts and CTA</step>
    <step order="9">Test: Badge embed script loads and renders on external page</step>
  </steps>

  <verification>
    <check type="test">npx playwright test pulse</check>
    <check type="manual">npx playwright test pulse --headed (visual verification)</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-11" reason="Tests dashboard page" />
    <depends-on task-id="phase-1-task-13" reason="Tests public report" />
    <depends-on task-id="phase-1-task-14" reason="Tests freemium preview" />
    <depends-on task-id="phase-1-task-15" reason="Tests badge embed" />
  </dependencies>

  <commit-message>test(pulse): add E2E tests for dashboard, reports, and badges</commit-message>
</task-plan>
```

---

## Risk Notes

### Critical Risks (Must Mitigate Before Build)

| Risk | Impact | Mitigation |
|------|--------|------------|
| RISK-001: Data doesn't exist | CRITICAL | Wave 0 data audit is a hard gate. No code until GO decision. |
| RISK-005: Insights creep | CRITICAL | REQUIREMENTS.md explicitly excludes insights. Refer stakeholders there. |
| RISK-006: Timeline slip | CRITICAL | Day 5 checkpoint: schema + job + API scaffolded or cut scope. |

### High Risks (Monitor During Build)

| Risk | Impact | Mitigation |
|------|--------|------------|
| RISK-002: Sparse cohorts | HIGH | InsufficientDataState component. Metro→state fallback. |
| RISK-003: Privacy exposure | HIGH | Minimum 10 businesses. No individual identification possible. |
| RISK-011: PERCENTILE_CONT edge cases | HIGH | Unit tests for empty groups, single values, precision. |
| RISK-012: Auth integration | HIGH | Reuse LocalGenius auth middleware. Don't write custom. |
| RISK-016: Badge CORS | HIGH | Test cross-origin in Wave 4. CORS headers on badge API. |

### Architectural Notes

- **LocalGenius infrastructure is production-ready**: benchmarkAggregates, dual-write, RLS all exist.
- **Extend, don't reinvent**: Pulse adds pulseRankings table and new job, reuses everything else.
- **Multi-tenant security**: All queries must respect organization_id RLS.
- **~500 LOC target**: Components are focused. If any task exceeds 100 LOC, reconsider.

---

## Execution Timeline

| Day | Wave | Tasks | Checkpoint |
|-----|------|-------|------------|
| 1 | 0 | Data Audit | GO/NO-GO decision |
| 2-4 | 1 | Schema, Metrics, Analytics | Foundation complete |
| 5-7 | 2 | Batch Job, API | Day 5: 30% complete or cut scope |
| 8-10 | 3 | All UI Components | Components in Storybook |
| 11-13 | 4 | Dashboard, Reports, Preview, Badge Script | Integration complete |
| 14 | 5 | Tests | Ship! |

---

## Wave Summary

```
Wave 0: [task-0]                                    ← BLOCKER (data audit)
Wave 1: [task-1, task-2, task-3]                    ← 3 parallel (foundation)
Wave 2: [task-4, task-5]                            ← 2 parallel (data layer)
Wave 3: [task-6, task-7, task-8, task-9, task-10]   ← 5 parallel (components)
Wave 4: [task-11, task-12, task-13, task-14, task-15] ← 5 parallel (integration)
Wave 5: [task-16, task-17]                          ← 2 parallel (testing)
```

**Total**: 18 tasks, 5 waves (+ blocker wave), 14 days

---

## Sign-Off Checklist

Before each wave, verify:
- [ ] Previous wave tasks all committed
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] No lint errors: `npm run lint`

Before ship (end of Wave 5):
- [ ] All 18 tasks committed
- [ ] E2E tests pass
- [ ] Security review: auth, CORS, RLS
- [ ] Performance: API < 200ms, page load < 3s
- [ ] Accessibility: keyboard navigation, screen reader
- [ ] Mobile responsive

---

*"The strength of the team is each individual member. The strength of each member is the team." — Phil Jackson*

---

**Now we build.**
