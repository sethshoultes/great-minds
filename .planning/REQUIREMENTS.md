# Pulse v1 — Requirements Specification

**Generated**: 2026-04-09
**Source Documents**:
- `/rounds/localgenius-benchmark-engine/decisions.md` (Locked Decisions)
- `/prds/localgenius-benchmark-engine.md` (Original PRD)
**Project Slug**: `localgenius-benchmark-engine`
**Product Name**: Pulse

---

## Executive Summary

Pulse is the benchmark engine for LocalGenius that transforms isolated customer data into competitive intelligence. It displays a single percentile rank showing how a business compares to peers — "ending the 2am loneliness of not knowing if you're okay."

**v1 Scope**: Restaurants only, single percentile display, 3-4 comparison charts, embeddable badges, one public report.

**Key Constraints**: 2-week timeline, ~500 LOC, no insights engine, no customizable dashboards, no email reports.

---

## Requirements Traceability Matrix

| ID | Requirement | Source | Priority | Wave |
|----|-------------|--------|----------|------|
| REQ-001 | Product named "Pulse" | Decision 1 | MUST | - |
| REQ-002 | Single percentile rank on first screen | Decision 2 | MUST | 3 |
| REQ-003 | Transparent percentile (not proprietary score) | Decision 2 | MUST | 3 |
| REQ-004 | No customizable dashboard widgets | Decision 3 | MUST | - |
| REQ-005 | No insights engine in v1 | Decision 4 | MUST | - |
| REQ-006 | No automated email reports in v1 | Decision 5 | MUST | - |
| REQ-007 | Restaurants industry only | Decision 6 | MUST | 1 |
| REQ-008 | NAICS codes for categorization | Decision 7 | MUST | 1 |
| REQ-009 | Curated peer groups (no free browsing) | Decision 8 | MUST | 2 |
| REQ-010 | 3-4 comparison charts | MVP Feature Set | MUST | 3 |
| REQ-011 | Distribution mechanisms (reports + badges) | Decision 9 | MUST | 4 |
| REQ-012 | Public benchmark report | MVP Feature Set | MUST | 4 |
| REQ-013 | Embeddable badges component | MVP Feature Set | MUST | 4 |
| REQ-014 | Freemium preview hook | MVP Feature Set | MUST | 4 |
| REQ-015 | Min 50+ businesses per cohort | Decision 12 | MUST | 2 |
| REQ-016 | 5 core metrics tracked | MVP Feature Set | MUST | 1 |
| REQ-017 | Nightly batch percentile calculation | Technical Spec | MUST | 2 |
| REQ-018 | Single REST API endpoint | Technical Spec | MUST | 2 |
| REQ-019 | PulseScore component | File Structure | MUST | 3 |
| REQ-020 | IndustryComparison component | File Structure | MUST | 3 |
| REQ-021 | PeerGroupSelector component | File Structure | MUST | 3 |
| REQ-022 | EmbeddableBadge component | File Structure | MUST | 4 |
| REQ-023 | Main dashboard page | File Structure | MUST | 3 |
| REQ-024 | Public report page | File Structure | MUST | 4 |
| REQ-025 | Database schema for benchmarks | File Structure | MUST | 1 |
| REQ-026 | Badge embed JavaScript loader | File Structure | MUST | 4 |
| REQ-027 | Brand voice compliance | Decision 13 | MUST | 3 |
| REQ-028 | Region-based peer selection with fallback | Open Questions | MUST | 2 |
| REQ-029 | ~500 LOC target | Decision 10 | MUST | - |
| REQ-030 | 2-week ship timeline | Decision 10 | MUST | - |
| REQ-031 | Data audit before build | Risk Register | MUST | 0 |
| REQ-032 | No raw data exports | Decision 11 | MUST | - |
| REQ-033 | Calculation date on badges | Risk 7 | SHOULD | 4 |
| REQ-034 | Copy testing for percentile display | Risk 9 | SHOULD | 3 |
| REQ-035 | Social-optimized badge design | Risk 10 | SHOULD | 4 |
| REQ-036 | Graceful "Insufficient Data" message | Risk 2 | SHOULD | 2 |
| REQ-037 | Statistical validity in peer groups | Decision 8+12 | MUST | 2 |
| REQ-038 | No ML/recommendations in v1 | Cut List | MUST | - |
| REQ-039 | No "compare to anyone" feature | Cut List | MUST | - |
| REQ-040 | Integrate with LocalGenius UI | Technical Spec | MUST | 3 |

---

## Detailed Requirements

### Product Identity

#### REQ-001: Product Naming
**Source**: decisions.md — Decision 1
**Priority**: MUST HAVE
**Description**: Product shall be named "Pulse" in all UI, marketing, documentation, and code references.
**Rationale**: One word. One heartbeat. "Check your Pulse" becomes the verb. "Benchmark Engine" describes a feature; "Pulse" builds a brand.
**Acceptance Criteria**:
- [ ] All user-facing text uses "Pulse"
- [ ] No references to "Benchmark Engine" or "LocalGenius Benchmarks"

---

### Core UX Requirements

#### REQ-002: Single Percentile Display
**Source**: decisions.md — Decision 2
**Priority**: MUST HAVE
**Description**: First screen shows single percentile rank as hero element: "You're in the 73rd percentile" or "You're ahead of 73% of restaurants"
**Rationale**: Steve's emotional hook ("one number, one insight, one action") combined with Elon's transparency argument. Percentiles are instantly understood.
**Acceptance Criteria**:
- [ ] Percentile displayed as largest visual element
- [ ] No competing metrics in hero section
- [ ] Format: "You're in the Xth percentile" or "You're ahead of X% of restaurants"

#### REQ-003: Transparent Percentile Calculation
**Source**: decisions.md — Decision 2 (Elon's refinement)
**Priority**: MUST HAVE
**Description**: Display percentile rank, not proprietary score. Users understand ranking methodology.
**Acceptance Criteria**:
- [ ] No "Pulse Score: 78" terminology
- [ ] Percentile is relative ranking against peer cohort
- [ ] Explanation available in help/tooltip

#### REQ-004: Fixed Dashboard Layout
**Source**: decisions.md — Decision 3
**Priority**: MUST HAVE
**Description**: Dashboard layout is fixed and non-configurable. No drag-and-drop or widget customization.
**Rationale**: "The moment you let people move widgets around, you've admitted your design failed."
**Acceptance Criteria**:
- [ ] Layout is identical for all users
- [ ] No settings to rearrange components
- [ ] Design team owns layout decisions

#### REQ-010: Industry Comparison Charts
**Source**: decisions.md — MVP Feature Set
**Priority**: MUST HAVE
**Description**: 3-4 visualizations showing user position relative to peer distribution.
**Acceptance Criteria**:
- [ ] Minimum 3 comparison charts displayed
- [ ] Charts cover: engagement rate, post frequency, follower growth, response time
- [ ] User position clearly marked on each chart

---

### Scope Constraints (Explicit Exclusions)

#### REQ-005: No Insights Engine
**Source**: decisions.md — Decision 4
**Priority**: MUST HAVE
**Description**: No causal inference or "Businesses like yours that did X saw Y% improvement" recommendations in v1.
**Rationale**: Causal inference requires controlled experiments and 10x more data. We ship *comparisons*, not *recommendations*.
**Acceptance Criteria**:
- [ ] No AI-generated suggestions based on peer behavior
- [ ] Comparisons only, no prescriptions
- [ ] Feature flagged for v2

#### REQ-006: No Automated Reports
**Source**: decisions.md — Decision 5
**Priority**: MUST HAVE
**Description**: No scheduled email digests or automated PDF reports.
**Rationale**: "If they won't log in, a PDF won't save us." Prove the core experience first.
**Acceptance Criteria**:
- [ ] No email scheduler for benchmark reports
- [ ] Dashboard is primary interface
- [ ] Manual screenshot/export permitted

#### REQ-032: No Data Exports
**Source**: decisions.md — Decision 11
**Priority**: MUST HAVE
**Description**: No CSV/API export of raw benchmark data.
**Rationale**: "We're not a data warehouse. We're an intelligence engine."
**Acceptance Criteria**:
- [ ] No export button in UI
- [ ] API does not expose raw cohort data
- [ ] Revisit for v2 if enterprise customers request

#### REQ-038: No ML Systems
**Source**: decisions.md — Cut List
**Priority**: MUST HAVE
**Description**: No machine learning or predictive models in v1.
**Acceptance Criteria**:
- [ ] No model training or inference
- [ ] Pure SQL-based calculations only

#### REQ-039: No Free-Form Comparison
**Source**: decisions.md — Cut List
**Priority**: MUST HAVE
**Description**: Users cannot search/select arbitrary competitors.
**Rationale**: Arbitrary comparisons destroy trust.
**Acceptance Criteria**:
- [ ] No competitor search UI
- [ ] No "compare to" selection

---

### Industry & Categorization

#### REQ-007: Single Industry — Restaurants
**Source**: decisions.md — Decision 6
**Priority**: MUST HAVE
**Description**: v1 supports restaurants exclusively. No multi-industry peer comparisons.
**Rationale**: Statistical validity requires density. Spreading thin across categories kills quality.
**Acceptance Criteria**:
- [ ] NAICS filter limited to restaurant codes (722xxx)
- [ ] UI does not show other industry options
- [ ] Error handling for non-restaurant businesses

#### REQ-008: NAICS Code Categorization
**Source**: decisions.md — Decision 7
**Priority**: MUST HAVE
**Description**: Industry classification uses official NAICS taxonomy.
**Rationale**: The IRS, SBA, and Census Bureau already use NAICS. Zero taxonomy maintenance.
**Acceptance Criteria**:
- [ ] Restaurant NAICS codes mapped: 722110, 722511, 722513, 722514, 722515
- [ ] No custom taxonomy maintenance
- [ ] NAICS code stored on business record

---

### Peer Group Configuration

#### REQ-009: Curated Peer Groups
**Source**: decisions.md — Decision 8
**Priority**: MUST HAVE
**Description**: System selects peer groups based on industry, region, size. Users cannot browse competitors.
**Rationale**: "Don't let users browse other businesses' data. That's not insight — that's distraction."
**Acceptance Criteria**:
- [ ] Peer group selected automatically
- [ ] No search/select competitor interface
- [ ] Peer group criteria displayed (industry + region + size)

#### REQ-015: Data Quality Threshold
**Source**: decisions.md — Decision 12
**Priority**: MUST HAVE
**Description**: Minimum 50+ businesses per cohort with 30+ days of data for percentile display.
**Rationale**: "If we don't have 50+ businesses per cohort with 30+ days of clean data, the Pulse Score is a random number generator."
**Acceptance Criteria**:
- [ ] Cohort size validated before calculation
- [ ] Cohorts < 50 show "Insufficient Data"
- [ ] Fallback to broader region if needed

#### REQ-028: Regional Fallback
**Source**: decisions.md — Open Questions
**Priority**: MUST HAVE
**Description**: Peer groups default to metro area (MSA), fallback to state if < 10 peers.
**Acceptance Criteria**:
- [ ] MSA lookup for city → metro mapping
- [ ] Automatic fallback logic
- [ ] Fallback indicated in UI

#### REQ-037: Statistical Validity
**Source**: decisions.md — Decision 8 + 12
**Priority**: MUST HAVE
**Description**: Peer selection algorithm ensures statistical validity.
**Acceptance Criteria**:
- [ ] Industry (primary), region (secondary), size (tertiary)
- [ ] Minimum 10 peers for any displayed benchmark
- [ ] Documented selection algorithm

---

### Core Metrics

#### REQ-016: Five Core Metrics
**Source**: decisions.md — MVP Feature Set
**Priority**: MUST HAVE
**Description**: Track and display: engagement rate, post frequency, follower growth, response time, conversion rate.
**Acceptance Criteria**:
- [ ] All 5 metrics calculated in nightly batch
- [ ] Metrics defined in data dictionary
- [ ] Dashboard displays all 5 metrics

**Metric Definitions** (requires validation against existing schema):
| Metric | Definition | Data Source |
|--------|------------|-------------|
| Engagement Rate | (likes + comments) / followers * 100 | analyticsEvents |
| Post Frequency | Posts per week | analyticsEvents |
| Follower Growth | Net follower change per month | analyticsEvents |
| Response Time | Average time to respond to reviews | analyticsEvents |
| Conversion Rate | Actions / impressions * 100 | attributionEvents |

---

### Technical Implementation

#### REQ-017: Nightly Batch Processing
**Source**: decisions.md — Technical Specifications
**Priority**: MUST HAVE
**Description**: Cron job runs nightly using PERCENTILE_CONT() for pre-computation.
**Acceptance Criteria**:
- [ ] Job scheduled at 2 AM UTC
- [ ] Percentiles stored in benchmark_aggregates
- [ ] Job completes within 30 minutes for 1000+ businesses

#### REQ-018: Benchmarks API Endpoint
**Source**: decisions.md — Technical Specifications
**Priority**: MUST HAVE
**Description**: GET /api/pulse/benchmarks/:customerId returns percentile and comparison data.
**Acceptance Criteria**:
- [ ] Returns: percentile_rank, cohort_description, metrics_comparison
- [ ] Authentication required (reuse LocalGenius auth)
- [ ] Response time < 200ms

#### REQ-025: Database Schema
**Source**: decisions.md — File Structure
**Priority**: MUST HAVE
**Description**: Schema extensions for Pulse benchmark calculations.
**Acceptance Criteria**:
- [ ] Leverage existing benchmarkAggregates table (lines 490-524 in schema.ts)
- [ ] Add/verify: vertical, city, sizeBucket indexes
- [ ] Migration tested on staging

---

### React Components

#### REQ-019: PulseScore Component
**Source**: decisions.md — File Structure
**Priority**: MUST HAVE
**Description**: Hero component displaying single large percentile number.
**Acceptance Criteria**:
- [ ] Large, prominent display
- [ ] Includes peer group context
- [ ] Responsive design

#### REQ-020: IndustryComparison Component
**Source**: decisions.md — File Structure
**Priority**: MUST HAVE
**Description**: Component rendering 3-4 metric comparison charts.
**Acceptance Criteria**:
- [ ] Charts show distribution + user position
- [ ] Loading state per chart
- [ ] Error boundary for failed metrics

#### REQ-021: PeerGroupSelector Component
**Source**: decisions.md — File Structure
**Priority**: MUST HAVE
**Description**: Read-only display of peer group criteria.
**Acceptance Criteria**:
- [ ] Shows: industry, region, size bucket
- [ ] Shows cohort size (e.g., "62 restaurants")
- [ ] Not user-editable

#### REQ-022: EmbeddableBadge Component
**Source**: decisions.md — File Structure
**Priority**: MUST HAVE
**Description**: Badge component for third-party embedding.
**Acceptance Criteria**:
- [ ] Shows tier: Gold (Top 10%), Silver (Top 25%), Bronze (Top 50%)
- [ ] Includes calculation timestamp
- [ ] Minimal external dependencies

---

### Pages & Routes

#### REQ-023: Dashboard Page
**Source**: decisions.md — File Structure
**Priority**: MUST HAVE
**Description**: Main Pulse dashboard integrating all components.
**Acceptance Criteria**:
- [ ] Route: /dashboard/pulse or /pulse/dashboard
- [ ] Integrates: PulseScore, IndustryComparison, PeerGroupSelector
- [ ] Authentication required

#### REQ-024: Public Report Page
**Source**: decisions.md — File Structure
**Priority**: MUST HAVE
**Description**: SEO-friendly public benchmark report page.
**Acceptance Criteria**:
- [ ] Route: /reports/[report-slug]
- [ ] No authentication required
- [ ] Structured data for search engines

---

### Distribution Features

#### REQ-011: Distribution Architecture
**Source**: decisions.md — Decision 9
**Priority**: MUST HAVE
**Description**: Built-in distribution via public reports and embeddable badges.
**Rationale**: "Benchmarks are inherently viral. Build the share mechanic first."
**Acceptance Criteria**:
- [ ] Public reports accessible without login
- [ ] Badges embeddable on external sites
- [ ] Claim links for badge verification

#### REQ-012: Public Benchmark Report
**Source**: decisions.md — MVP Feature Set
**Priority**: MUST HAVE
**Description**: "State of Local Restaurant Marketing" public-facing report.
**Acceptance Criteria**:
- [ ] Report published at /reports/state-of-local-restaurants
- [ ] SEO-optimized meta tags
- [ ] Aggregated data, no individual business identification

#### REQ-013: Embeddable Badges
**Source**: decisions.md — MVP Feature Set
**Priority**: MUST HAVE
**Description**: React component and JavaScript loader for badge embedding.
**Acceptance Criteria**:
- [ ] Badge shows percentile tier (Top 10%, Top 25%, Top 50%)
- [ ] Includes calculation date
- [ ] Light/dark theme support

#### REQ-014: Freemium Preview
**Source**: decisions.md — MVP Feature Set
**Priority**: MUST HAVE
**Description**: Unauthenticated users see partial data requiring signup for full view.
**Acceptance Criteria**:
- [ ] Preview shows peer group stats (aggregated)
- [ ] Personal percentile hidden behind signup
- [ ] Clear CTA: "Sign up to see your rank"

#### REQ-026: Badge Embed Loader
**Source**: decisions.md — File Structure
**Priority**: MUST HAVE
**Description**: JavaScript loader for embedding badges on external sites.
**Acceptance Criteria**:
- [ ] Async script load: /badges/badge-embed.js
- [ ] CORS headers set for all origins
- [ ] Minimal bundle size (< 10KB)

---

### Brand & Voice

#### REQ-027: Brand Voice
**Source**: decisions.md — Decision 13
**Priority**: MUST HAVE
**Description**: All copy is confident, direct, actionable. No corporate jargon.
**Rationale**: "Like a trusted advisor who respects your time."
**Acceptance Criteria**:
- [ ] Copy reviewed against brand guidelines
- [ ] Example tone: "You're ahead of most restaurants your size."
- [ ] No fake enthusiasm or hedging language

---

### Timeline & Constraints

#### REQ-029: Code Size Target
**Source**: decisions.md — Decision 10
**Priority**: MUST HAVE
**Description**: Implementation ~500 lines of code (excluding tests/dependencies).
**Acceptance Criteria**:
- [ ] Day 5 checkpoint: assess LOC trajectory
- [ ] Cut scope if > 800 LOC projected
- [ ] Focus on essential features only

#### REQ-030: Timeline Constraint
**Source**: decisions.md — Decision 10
**Priority**: MUST HAVE
**Description**: Ship to production within 14 calendar days.
**Acceptance Criteria**:
- [ ] Daily standups with progress check
- [ ] Day 5 hard checkpoint
- [ ] Scope cuts if behind schedule

#### REQ-031: Data Audit (BLOCKER)
**Source**: decisions.md — Risk Register (Risk 1)
**Priority**: MUST HAVE
**Description**: Audit existing schema to confirm 5 core metrics exist before build.
**Acceptance Criteria**:
- [ ] SQL query identifies metric availability
- [ ] Gap analysis documented
- [ ] Go/no-go decision within 24 hours of kickoff

---

### Nice-to-Have Requirements

#### REQ-033: Badge Timestamps
**Source**: decisions.md — Risk 7
**Priority**: SHOULD HAVE
**Description**: Badges display "Calculated on [DATE]" to prevent abuse.
**Acceptance Criteria**:
- [ ] Date displayed on badge
- [ ] Date updated only when recalculated

#### REQ-034: Copy Testing
**Source**: decisions.md — Risk 9
**Priority**: SHOULD HAVE
**Description**: Test percentile phrasing with real users.
**Acceptance Criteria**:
- [ ] A/B test "73rd percentile" vs "ahead of 73%"
- [ ] User comprehension validated

#### REQ-035: Social Badge Design
**Source**: decisions.md — Risk 10
**Priority**: SHOULD HAVE
**Description**: Badge designs optimized for social sharing.
**Acceptance Criteria**:
- [ ] Visually appealing design
- [ ] Works on light/dark backgrounds
- [ ] Shareable with single click

#### REQ-036: Insufficient Data UX
**Source**: decisions.md — Risk 2
**Priority**: SHOULD HAVE
**Description**: Graceful message when cohort size < threshold.
**Acceptance Criteria**:
- [ ] Friendly explanation, not error
- [ ] Suggests when to check back
- [ ] No broken UI states

---

## Existing Infrastructure (From Codebase Scout)

### Database Ready-to-Use
| Table | Status | Location |
|-------|--------|----------|
| benchmarkAggregates | READY | schema.ts lines 490-524 |
| analyticsEvents | READY | schema.ts lines 397-422 |
| attributionEvents | READY | schema.ts lines 427-455 |
| businesses | READY | schema.ts lines 124-159 |

### Services Ready-to-Use
| Service | Purpose | Location |
|---------|---------|----------|
| analytics.ts | Event recording + dual-write | /services/analytics.ts |
| insights-engine.ts | Insights framework | /services/insights-engine.ts |
| scheduler.ts | Job scheduling | /services/scheduler.ts |

### Patterns to Follow
- Multi-tenant RLS via `app.current_org_id` session variable
- Dual-write pattern for anonymized benchmarks
- Size bucket calculation: 1-5, 6-15, 16-50 employees
- API response format: `{ data, meta: { timestamp } }`

---

## Cut from v1 (Explicitly Excluded)

| Feature | Rationale | Revisit |
|---------|-----------|---------|
| Insights engine | Requires causal inference + 10x data | v2 |
| Monthly email reports | Dashboard must be sticky first | v2 |
| Customizable dashboards | Design has opinions | Never |
| Raw data exports | Ship intelligence, not bytes | v2 if enterprise |
| ML/recommendations | Premature without data volume | v2 |
| Compare to anyone | Arbitrary comparisons destroy trust | Never |
| Multiple industries | Nail restaurants first | v2 |

---

## Dependencies (Wave Order)

```
Wave 0 (Blockers - Day 1)
└── REQ-031: Data Audit

Wave 1 (Foundation - Days 2-4)
├── REQ-007: Restaurant Industry Filter
├── REQ-008: NAICS Code Mapping
├── REQ-016: Core Metrics Definitions
└── REQ-025: Database Schema

Wave 2 (Data Layer - Days 5-7)
├── REQ-009: Peer Group Algorithm
├── REQ-015: Data Quality Thresholds
├── REQ-017: Nightly Batch Job
├── REQ-018: API Endpoint
├── REQ-028: Regional Fallback
└── REQ-037: Statistical Validity

Wave 3 (UI Layer - Days 8-11)
├── REQ-002: Percentile Display
├── REQ-003: Transparent Percentile
├── REQ-010: Comparison Charts
├── REQ-019: PulseScore Component
├── REQ-020: IndustryComparison Component
├── REQ-021: PeerGroupSelector Component
├── REQ-023: Dashboard Page
├── REQ-027: Brand Voice
└── REQ-040: LocalGenius Integration

Wave 4 (Distribution - Days 12-14)
├── REQ-011: Distribution Architecture
├── REQ-012: Public Report
├── REQ-013: Embeddable Badges
├── REQ-014: Freemium Preview
├── REQ-022: EmbeddableBadge Component
├── REQ-024: Public Report Page
└── REQ-026: Badge Embed Loader
```

---

## North Star

From `essence.md`:

> **What is this product REALLY about?**
> Ending the 2am loneliness of not knowing if you're okay.
>
> **What's the feeling it should evoke?**
> Relief. The exhale of finally knowing.
>
> **What's the one thing that must be perfect?**
> The number. One number. Undeniable.
>
> **Creative direction:**
> Truth, simply told.

*Strip everything away. What remains: one person, one question, one answer.*

---

**Document Version**: 2.0
**Last Updated**: 2026-04-09
**Total Requirements**: 40 (37 MUST HAVE, 3 SHOULD HAVE)
