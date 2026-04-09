# Pulse Benchmark Engine — Atomic Requirements Analysis

**Generated**: 2026-04-09
**Source**: `/prds/localgenius-benchmark-engine.md` + `/rounds/localgenius-benchmark-engine/decisions.md`
**Authority**: Phil Jackson (PRD), Steve Jobs + Elon Musk (Decisions), Margaret Hamilton (QA)
**Status**: QA Pass 2 VERIFIED — Ready for Launch Requirements

---

## Executive Summary

The Pulse Benchmark Engine MVP (v1) is **COMPLETE** with 2/2 QA passes confirming 40/40 requirements delivered across 16 files (~4,447 LOC).

**This document focuses on LAUNCH REQUIREMENTS and 30-DAY/Q3 conditions** that must ship before or after v1 launch. Requirements are atomized into implementable, testable units with clear dependencies.

---

## Requirements Traceability Matrix

### LAUNCH REQUIREMENTS (This Sprint) — MUST HAVE

| ID | Requirement | Category | Priority | Status | Source | Dependencies |
|----|-------------|----------|----------|--------|--------|--------------|
| **PULSE-L01** | Email notifications for percentile changes (±5 points) | Services | P0 | TODO | Shonda Rhimes (Board) | — |
| **PULSE-L02** | Struggling restaurant experience redesign (bottom 25%) | Frontend | P0 | TODO | Oprah Winfrey (Board) | PULSE-L01 |
| **PULSE-L03** | Mobile audit: 30-second check-in flow | QA | P0 | TODO | Oprah Winfrey (Board) | PULSE-L02 |

### 30-DAY REQUIREMENTS (Q2 Sprint) — MUST HAVE

| ID | Requirement | Category | Priority | Status | Source | Dependencies |
|----|-------------|----------|----------|--------|--------|--------------|
| **PULSE-30-01** | Path to [Next Tier] feature (product design) | Frontend | P0 | TODO | Shonda Rhimes (Board) | PULSE-L02 |
| **PULSE-30-02** | Weekly email digest (retention hook) | Services | P0 | TODO | Shonda Rhimes (Board) | PULSE-L01 |
| **PULSE-30-03** | Retention attribution tracking (analytics) | Database | P0 | TODO | Warren Buffett (Board) | — |

### Q3 REQUIREMENTS (Quarterly) — MUST HAVE

| ID | Requirement | Category | Priority | Status | Source | Dependencies |
|----|-------------|----------|----------|--------|--------|--------------|
| **PULSE-Q3-01** | Monetization pilot: $19/mo badge premium | API | P1 | TODO | Warren Buffett (Board) | PULSE-D02 |
| **PULSE-Q3-02** | Insights Engine v1 (rule-based initially) | Services | P1 | TODO | Jensen Huang (Board) | PULSE-D06 |
| **PULSE-Q3-03** | Spanish translation (key components) | Frontend | P1 | TODO | Oprah Winfrey (Board) | PULSE-D02 |
| **PULSE-Q3-04** | Cohort density dashboard (internal) | Frontend | P1 | TODO | Warren Buffett (Board) | PULSE-D06 |

### Q4 REQUIREMENTS (Should-Have) — SHOULD HAVE

| ID | Requirement | Category | Priority | Status | Source | Dependencies |
|----|-------------|----------|----------|--------|--------|--------------|
| **PULSE-Q4-01** | Industry report: Q2 2026 Restaurant Benchmark | Marketing | P2 | TODO | Jensen Huang (Board) | PULSE-Q3-02 |
| **PULSE-Q4-02** | Weekly challenge system | Frontend | P2 | TODO | Shonda Rhimes (Board) | PULSE-30-02 |
| **PULSE-Q4-03** | Parallelize batch job (performance) | DevOps | P2 | TODO | Jensen Huang (Board) | PULSE-D07 |

### STRATEGIC (Annual) — NICE TO HAVE

| ID | Requirement | Category | Priority | Status | Source | Dependencies |
|----|-------------|----------|----------|--------|--------|--------------|
| **PULSE-STR-01** | Benchmark API evaluation | API | P3 | TODO | Jensen Huang (Board) | PULSE-Q3-01 |
| **PULSE-STR-02** | Second vertical expansion (Retail/Salons) | Product | P3 | TODO | Warren Buffett + Jensen (Board) | PULSE-Q3-04 |
| **PULSE-STR-03** | Recommendation engine | Services | P3 | TODO | Jensen Huang (Board) | PULSE-Q3-02 |

### DELIVERED (MVP v1 Complete) — REFERENCE ONLY

| ID | Requirement | Category | Priority | Status | Source | Notes |
|----|-------------|----------|----------|--------|--------|-------|
| **PULSE-D01** | Percentile rank display | Frontend | P0 | DELIVERED | Steve Jobs | Single number: "You're in the 73rd percentile" |
| **PULSE-D02** | Industry comparison view (4 metrics) | Frontend | P0 | DELIVERED | Board | Engagement Rate, Post Freq, Engagement Growth, Response Time, Conversion Rate |
| **PULSE-D03** | NAICS-based categorization (722xxx restaurants) | Database | P0 | DELIVERED | Elon Musk | 8 NAICS codes: 722511, 722513, 722514, 722515, 722310, 722320, 722330, 722410 |
| **PULSE-D04** | Curated peer groups (MSA → State fallback) | Services | P0 | DELIVERED | Steve Jobs | No "compare to anyone"; system-selected only |
| **PULSE-D05** | Public benchmark report page (SEO) | Frontend | P0 | DELIVERED | Elon Musk | Reports at `/reports/[slug].tsx` |
| **PULSE-D06** | Embeddable badges with JS loader | API | P0 | DELIVERED | Elon Musk | Badge qualification tiers: Top 10%, Top 25%, Top 50%, Rising |
| **PULSE-D07** | Freemium preview hook | Frontend | P0 | DELIVERED | Elon Musk | Pioneer messaging for cold start |
| **PULSE-D08** | Progress tracking (Last Week vs This Week) | Frontend | P0 | DELIVERED | Board (Shonda/Oprah) | Weekly comparisons |
| **PULSE-D09** | Milestone celebrations | Frontend | P0 | DELIVERED | Board (Oprah) | Positive reinforcement for progress |
| **PULSE-D10** | Graceful "insufficient data" handling | Frontend | P0 | DELIVERED | Both | MIN_COHORT_SIZE=50, MIN_FALLBACK=10 with warning |

---

## Detailed Requirement Specifications

### LAUNCH REQUIREMENTS (This Sprint)

#### PULSE-L01: Email Notifications for Percentile Changes

**Priority**: P0 (MUST HAVE for launch)
**Category**: Services (Backend)
**Source**: Shonda Rhimes (Board Review) — retention risk mitigation
**Rationale**: "Retention without hooks is a wish. Notifications are the hook."

**Description**:
Create an email notification system that alerts customers when their percentile rank changes by ±5 percentage points or more.

**Acceptance Criteria**:
- [ ] Notification triggers when: `|new_percentile - old_percentile| >= 5`
- [ ] Email sent within 15 minutes of batch job completion
- [ ] Email includes: current percentile, change direction (↑/↓), metric context
- [ ] Customer can unsubscribe from notifications (compliance)
- [ ] Unsubscribe preference stored in database
- [ ] Batch job logs all notifications sent (audit trail)
- [ ] Email template matches brand voice: "Your engagement is up. Here's what changed."
- [ ] Test coverage: >=85% (unit + integration tests)

**Technical Notes**:
- Leverage existing `batch-percentiles.ts` cron job to collect changes
- Store notifications in `notification_log` table (new schema addition)
- Use transactional email service (SendGrid, Postmark, or Mailgun)
- Implement exponential backoff for failed sends (3 retries max)
- Log all sends + bounces to analytics

**Dependencies**: None (standalone feature)

**Effort Estimate**: 6-8 hours (backend + email template + tests)

---

#### PULSE-L02: Struggling Restaurant Experience Redesign (Bottom 25%)

**Priority**: P0 (MUST HAVE for launch)
**Category**: Frontend (UX/Design)
**Source**: Oprah Winfrey (Board Review) — trust + empathy
**Rationale**: "Pulse shows you where you are. Now show them where they can go. A struggling restaurant below the median needs hope, not despair."

**Description**:
Redesign the Pulse dashboard UX for restaurants in the bottom 25% of their peer group. Instead of a discouraging red alert, provide actionable next steps and hope.

**Acceptance Criteria**:
- [ ] Component: `BottomQuartileExperience.tsx` created
- [ ] Percentile ≤ 25th displays alternate messaging (not default red)
- [ ] Primary message: "Rising" badge + "You're here. Here's where you can go." narrative
- [ ] Include 2-3 specific, actionable suggestions (e.g., "Businesses like you increased engagement by 15% by...")
- [ ] Highlight the smallest win (metric closest to peer median) first
- [ ] Link to "Next Tier" feature (PULSE-30-01) for aspirational path
- [ ] Tone: hopeful, specific, not patronizing
- [ ] A/B test with 10% sample before full rollout
- [ ] Design reviewed by Oprah for empathy tone
- [ ] QA sign-off from Margaret Hamilton

**Technical Notes**:
- Conditional render in `PulseScore.tsx`: `if (percentile <= 25) { <BottomQuartileExperience /> }`
- Messaging should reference specific metrics (not generic)
- Link to next tier feature (to be designed in PULSE-30-01)
- Store A/B test variant in user session/analytics

**Dependencies**: PULSE-L01 (notifications provide positive reinforcement)

**Effort Estimate**: 12-16 hours (design + component + testing + reviews)

---

#### PULSE-L03: Mobile Audit — 30-Second Check-In Flow

**Priority**: P0 (MUST HAVE for launch)
**Category**: QA (Mobile UX)
**Source**: Oprah Winfrey (Board Review) — accessibility + on-the-go access
**Rationale**: "Restaurant owners check Pulse on their phone at 6am. The mobile experience must work in 30 seconds."

**Description**:
Conduct a comprehensive mobile audit of Pulse dashboard. Verify that the core "check your percentile" flow completes in ≤30 seconds on 4G network on iPhone SE (smallest screen).

**Acceptance Criteria**:
- [ ] Navigation: Dashboard load in ≤5 seconds on 4G (measure with DevTools throttling)
- [ ] Percentile rank visible within 3 taps from home
- [ ] Full "check in" flow (navigate + view percentile + see 1 key metric): ≤30 seconds
- [ ] Text readable at normal zoom (no pinch zoom required)
- [ ] Touch targets: ≥44x44px (WCAG minimum)
- [ ] Test devices: iPhone SE (375px width), iPhone 14 (390px), Android (varied)
- [ ] Network: 4G LTE (not WiFi; test with throttling)
- [ ] Tested on iOS Safari + Chrome + Android Chrome
- [ ] Accessibility audit: no color-only indicators, sufficient contrast
- [ ] Video recording of flow provided to Oprah for sign-off

**Technical Notes**:
- Use Chrome DevTools: Network throttling to "Fast 4G"
- Measure: First Contentful Paint (FCP) + Largest Contentful Paint (LCP)
- Test metrics: LCP <2.5s, CLS <0.1, FID <100ms
- Lighthouse mobile score: ≥85
- Use simulator or real device (preferred)

**Test Cases**:
1. Cold load (no cache) → Percentile visible
2. Returning user → Percentile updates
3. Network drops during load → Graceful error message
4. Offline → "Check back online" message (per existing design)

**Dependencies**: PULSE-L02 (check-in includes struggling restaurant experience)

**Effort Estimate**: 8-12 hours (QA testing + optimization + documentation)

---

### 30-DAY REQUIREMENTS (Q2 Sprint)

#### PULSE-30-01: Path to [Next Tier] Feature

**Priority**: P0 (MUST HAVE within 30 days)
**Category**: Frontend (Product Design)
**Source**: Shonda Rhimes + Oprah Winfrey (Board Review)
**Rationale**: "Pulse shows 'where you are'. The [Next Tier] shows 'where you can go'. This is the retention flywheel."

**Description**:
Design and implement a feature that shows customers the specific actions taken by restaurants in the next percentile tier above them. Creates aspirational path and retention hook.

**Example UX Flow**:
```
You're in 40th percentile
    ↓
[Next Tier] button → "Top 50%"
    ↓
"Businesses like you that improved from 40th to 50th did these 3 things:"
  1. Increased post frequency from 2/week to 4/week (+15% engagement)
  2. Responded to reviews within 2 hours (⬆ 22% in your category)
  3. Added location to posts (⬆ 18% visibility)
```

**Acceptance Criteria**:
- [ ] Component: `NextTierPath.tsx` created
- [ ] Displayed on Pulse dashboard for percentile ≤ 90th
- [ ] Shows 3 specific, actionable patterns from restaurants that moved from current tier → next tier
- [ ] Patterns are data-driven (not marketing fluff)
- [ ] Each pattern includes: action + expected impact %
- [ ] Click-through to help content or setup flow (e.g., "Set up email notifications for your posts")
- [ ] Analytics: track click rate, conversion to action
- [ ] A/B test: control (no next tier) vs. treatment (with next tier)
- [ ] Designed to increase 30-day retention by ≥10%

**Technical Notes**:
- Requires new aggregated insights table: `tier_progression_patterns`
- Patterns generated in nightly batch job (after percentile calc)
- Store: `{ from_tier, to_tier, action_taken, avg_impact_pct, sample_size }`
- Display only if: sample_size ≥ 10 (minimum statistical validity)
- Feature flag: `NEXT_TIER_ENABLED` (for gradual rollout)

**Retention Success Criteria**:
- Customers who click [Next Tier]: 30-day retention ≥ 80%
- Customers without feature: 30-day retention ≥ 70% (baseline)
- Goal: +10% improvement by PULSE-30 deadline

**Dependencies**: PULSE-L02 (bottom quartile gets stronger messaging for next tier)

**Effort Estimate**: 16-20 hours (design + backend aggregation + frontend + A/B setup + analytics)

---

#### PULSE-30-02: Weekly Email Digest

**Priority**: P0 (MUST HAVE within 30 days)
**Category**: Services (Marketing Automation)
**Source**: Shonda Rhimes (Board Review)
**Rationale**: "Reports that nobody reads are dead. But a weekly digest with one metric + one insight? That's sticky."

**Description**:
Send a weekly email digest (every Monday morning) to customers with:
1. Current percentile rank
2. Week-over-week change in top metric
3. One actionable insight from peer group

**Email Structure**:
```
Subject: "Your Pulse: [Metric] is [+/-]X%"

[Hero Section]
You're in the 67th percentile ↑ 3 points this week!

[Metric Spotlight]
Your engagement rate: 4.2% (⬆ +0.3% vs. last week)
Peer average: 3.8%

[Insight]
Restaurants in your tier increased engagement by sending 2x more posts.
Ready to try? [Button: Start experiment]

[CTA]
Check full Pulse dashboard [Button]

[Preference Center]
[Unsubscribe from weekly digest]
```

**Acceptance Criteria**:
- [ ] Digest generated automatically every Monday at 7am (customer timezone)
- [ ] Email includes: current percentile + week-over-week change + insight
- [ ] Email sent to all active customers (who haven't unsubscribed)
- [ ] Personalized: shows customer's actual data, not generic template
- [ ] Metric spotlight: highlight the metric with largest positive change
- [ ] Insight: rule-based initially (e.g., "If [pattern] detected in top 25%, include it")
- [ ] CTA click-through tracked in analytics
- [ ] Unsubscribe link functional and honored next week
- [ ] A/B test subject line: "Your Pulse: [X]" vs. "Quick check: [X]"
- [ ] Send timing: Monday 7am (user's timezone, requires timezone tracking)

**Technical Notes**:
- Scheduled job: `weekly-digest-job` (cron every Monday 0700 UTC + user TZ offset)
- Template: Handlebars or Mjml for email
- Delivery: via transactional email service (same as PULSE-L01)
- Unsubscribe preference: `email_preferences.weekly_digest = false` (stored in DB)
- Analytics table: `email_events` tracks sent/opened/clicked
- A/B test: 50/50 split on subject line for 2 weeks

**Success Metrics**:
- Open rate: ≥40% (industry standard for transactional: 25-35%)
- Click-through rate: ≥5% (goal: drive to dashboard)
- Unsubscribe rate: ≤2% (healthy)

**Dependencies**: PULSE-L01 (reuses notification infrastructure)

**Effort Estimate**: 12-16 hours (job setup + email template + timezone handling + analytics)

---

#### PULSE-30-03: Retention Attribution Tracking

**Priority**: P0 (MUST HAVE within 30 days)
**Category**: Database (Analytics)
**Source**: Warren Buffett (Board Review)
**Rationale**: "What drives retention? Is it the percentile? The next tier? The email digest? We need to know."

**Description**:
Implement attribution tracking to understand which Pulse features drive customer retention and engagement.

**Events to Track**:
1. `pulse_dashboard_view` — Customer opens Pulse dashboard
2. `percentile_notification_sent` — Email notification delivered
3. `percentile_notification_clicked` — Customer clicks notification
4. `next_tier_viewed` — Customer scrolls to Next Tier section
5. `next_tier_action_clicked` — Customer clicks an action suggestion
6. `weekly_digest_opened` — Customer opens weekly email
7. `weekly_digest_cta_clicked` — Customer clicks CTA in digest

**Retention Cohorts**:
- Cohort A: Active Pulse users (≥1 dashboard view/month)
- Cohort B: Notification responders (clicked ≥1 notification)
- Cohort C: Weekly digest readers (opened ≥2 digests)
- Cohort D: Control (no Pulse engagement)

**Acceptance Criteria**:
- [ ] Event table: `pulse_events` with columns: customer_id, event_type, timestamp, metadata
- [ ] All 7 events above are tracked and logged
- [ ] Retention query: 30-day/90-day cohort retention by feature engagement
- [ ] Dashboard: Pulse retention metrics accessible to team (read-only)
- [ ] Monthly report: "Retention impact of Pulse features" sent to board
- [ ] Attribution model: can show correlation between feature use → retention

**Example Query Output**:
```
Cohort A (Pulse users): 82% 30-day retention
Cohort B (Notif responders): 88% 30-day retention
Cohort C (Weekly digest): 85% 30-day retention
Cohort D (Control): 60% 30-day retention
```

**Technical Notes**:
- Use existing analytics infrastructure (Plausible, Mixpanel, or custom)
- Log events at point of action (frontend + backend)
- Retention definition: customer active (any feature use) in current month
- Cohorts are not mutually exclusive (overlap expected)
- Privacy: no customer-level PII in attribution events

**Dependencies**: PULSE-L01, PULSE-30-02 (features to attribute)

**Effort Estimate**: 10-14 hours (schema + event logging + query development + dashboard)

---

### Q3 REQUIREMENTS (Quarterly Milestones)

#### PULSE-Q3-01: Monetization Pilot — $19/mo Badge Premium

**Priority**: P1 (MUST HAVE by Q3)
**Category**: API (Payments)
**Source**: Warren Buffett (Board Review)
**Rationale**: "Benchmarks that aren't monetized are vanity metrics. Build the premium badge tier first."

**Description**:
Launch a freemium upgrade path: free badge (basic) → $19/month premium badge with enhanced features.

**Premium Badge Features**:
- Larger, customizable badge (2x size)
- Custom branding colors (customer's brand)
- Link directly to their public benchmark report
- "Top 10%" label (if qualified) vs. free "Rising" label
- Higher page rank boost (with rel=canonical optimization for SEO)
- Custom badge copy (e.g., "Best in [MSA]" vs. generic)

**Freemium Gate**:
- Free: Basic badge (50x50px) + link to report
- Premium: Enhanced badge (100x100px) + custom colors + branded copy + SEO boost

**Acceptance Criteria**:
- [ ] Stripe integration for billing (monthly recurring)
- [ ] Upgrade flow: Pulse dashboard → [Upgrade] button → Stripe checkout
- [ ] Badge qualification: only show upgrade if customer is top 50% (top 10% auto-premium message)
- [ ] Premium badge component: `PremiumBadge.tsx` replaces `EmbeddableBadge.tsx` for premium customers
- [ ] Custom branding fields: primary_color, secondary_color, custom_text
- [ ] Pricing page: `/pricing/badge-premium` with comparison table
- [ ] Customer support: FAQ for badge upgrades
- [ ] Analytics: track upgrade conversion rate, churn rate
- [ ] Pilot: 30-day pilot with 5-10 hand-picked restaurants (offer at 50% discount)
- [ ] Go/no-go decision at end of Q3 based on pilot LTV:CAC ratio

**Technical Notes**:
- Stripe: create `price_id` for $19/month recurring
- Database: add `badge_tier` (free/premium) + `stripe_subscription_id` to pulseBenchmarks table
- Webhook: handle subscription cancelled → revert to free badge
- Email: send upgrade confirmation + premium badge embed code

**Revenue Forecast**:
- Conservative: 5% of 100 customers (5 customers) → $1,140/year
- Optimistic: 10% of 200 customers (20 customers) → $4,560/year
- Goal: Hit 10+ paying customers by end of Q3

**Dependencies**: PULSE-D06 (existing embeddable badge), PULSE-D05 (report pages)

**Effort Estimate**: 14-18 hours (Stripe setup + UI + custom branding backend + analytics + pilot management)

---

#### PULSE-Q3-02: Insights Engine v1 (Rule-Based)

**Priority**: P1 (MUST HAVE by Q3)
**Category**: Services (Business Intelligence)
**Source**: Jensen Huang + All Board Members
**Rationale**: "The moat isn't the benchmark. The moat is the accumulated wisdom of what works. Build that rule-based engine first. AI is optional."

**Description**:
Implement a rule-based insights engine that generates actionable recommendations: "Businesses like yours that did X saw Y% improvement."

**Insight Categories** (initial):
1. **Post Frequency**: If customer posts 2x/week and peer median is 4x/week, show: "Similar restaurants increased engagement by 18% by posting 4x/week."
2. **Response Time**: If customer's avg response time > peer 75th percentile, show: "Restaurants that respond within 2 hours see 22% higher review engagement."
3. **Engagement Growth**: If customer's 90-day trend is flat, show: "Restaurants in your category that [pattern] saw 15% growth."
4. **Seasonal Patterns**: If season changes (e.g., summer), show: "Similar restaurants increase posts during summer → +12% in your category."

**Insight Quality Thresholds**:
- Only show insights if: sample_size ≥ 20 (peer group size)
- Only show insights if: effect_size ≥ 10% (minimum meaningful impact)
- Only show insights if: statistical_significance ≥ 0.95 (95% confidence)
- Rank insights by: impact_size (highest first)

**Acceptance Criteria**:
- [ ] Component: `InsightsPanel.tsx` on Pulse dashboard
- [ ] Display 2-3 top insights by impact
- [ ] Each insight: "Metric + Pattern + Impact % + Action CTA"
- [ ] Insights stored in `insight_rules` table (rules engine)
- [ ] Insights generated in nightly batch (post-percentile calculation)
- [ ] Rules evaluated against customer metrics
- [ ] No insights shown if sample_size < 20 (avoid spurious correlations)
- [ ] A/B test: with insights vs. without insights
- [ ] Copy tone: "Businesses like yours that..." (not "AI recommends...")
- [ ] Analytics: track insight view rate + CTA click rate

**Rule Examples**:
```sql
INSERT INTO insight_rules VALUES (
  'post_frequency_growth',
  'if post_frequency_pct < 50 AND peer_median_pct >= 50 THEN impact = 18%',
  20, -- min_sample_size
  0.95 -- confidence_threshold
);
```

**Technical Notes**:
- Rule engine: simple SQL-based initially (avoid ML complexity)
- Rules table: `insight_rules(rule_id, rule_logic, min_sample_size, confidence_threshold, effect_size_pct)`
- Generated in batch job: evaluate all rules post-percentile calc
- Store results in: `customer_insights(customer_id, insight_id, metric, action, impact_pct)`
- Display: rank by impact_pct descending, show top 3

**Success Metrics**:
- Insight viewed: ≥70% of customers (visibility)
- CTA clicked: ≥10% of insights (engagement)
- Customers who act on insight: ≥5% (conversion)

**Deferred to v2** (requires AI):
- Causal inference (did the action cause the improvement, or just correlation?)
- ML recommendations (personalized suggestions beyond rules)
- Anomaly detection (flag unusual metrics)

**Dependencies**: PULSE-D06 (insight delivery via dashboard), PULSE-30-01 (next tier patterns can inform rules)

**Effort Estimate**: 18-24 hours (rule definition + SQL rules engine + batch integration + UI + A/B setup + documentation)

---

#### PULSE-Q3-03: Spanish Localization (Key Components)

**Priority**: P1 (MUST HAVE by Q3)
**Category**: Frontend (Internationalization)
**Source**: Oprah Winfrey (Board Review)
**Rationale**: "LocalGenius customers are increasingly Spanish-speaking. Pulse must be accessible in Spanish."

**Scope** (Key Components Only):
- Pulse dashboard page
- Percentile display + metric comparisons
- [Next Tier] feature
- Weekly email digest
- Premium badge pricing page
- Help/FAQ pages

**Out of Scope** (v2):
- Admin dashboards
- Internal analytics pages
- Complex legal terms

**Acceptance Criteria**:
- [ ] Spanish translation for all key components (see scope)
- [ ] User language preference stored in account settings
- [ ] URL structure: `/dashboard/pulse` (English) vs. `/es/dashboard/pulse` (Spanish)
- [ ] Email digest: sent in user's preferred language
- [ ] Metric names translated consistently (e.g., "Engagement Rate" → "Tasa de Engagement")
- [ ] No machine translation; all translated by native Spanish speaker
- [ ] Tested with Spanish-speaking users (QA)
- [ ] RTL layout NOT required (Spanish is LTR)
- [ ] Currency: USD in both languages (no conversion needed for restaurants)
- [ ] Analytics: track language preference (measure Spanish adoption)

**Translation Resources**:
- Key components: ~500 English strings
- Translation effort: ~40-60 hours (including review + QA)
- Tools: i18n (next-i18n or react-i18next)

**Dependencies**: PULSE-L02, PULSE-30-02, PULSE-Q3-01 (components to translate)

**Effort Estimate**: 20-28 hours (setup i18n framework + translation + QA + testing)

---

#### PULSE-Q3-04: Cohort Density Dashboard (Internal)

**Priority**: P1 (MUST HAVE by Q3)
**Category**: Frontend (Analytics/Internal)
**Source**: Warren Buffett (Board Review)
**Rationale**: "We need to see where cohorts are thin. Statistical validity is non-negotiable."

**Description**:
Build an internal (admin-only) dashboard showing cohort sizes and density across geographies and industries. Identify where we have ≥50 businesses (valid) vs. <50 (insufficient).

**Dashboard Metrics**:
- Total businesses by NAICS code (pie chart)
- Businesses by MSA (map heat map)
- Density check: MSA -> State fallback matrix (show which rely on state-level fallback)
- Minimum cohort warning: flag NAICS/MSA combos with <50 businesses
- Trend: cohort growth over time (line chart)

**Acceptance Criteria**:
- [ ] Page: `/admin/pulse/cohort-density` (admin-only)
- [ ] Authentication: admin role required (verified)
- [ ] Charts: NAICS breakdown + MSA heatmap + fallback matrix
- [ ] Alerts: highlight cohorts <50 (in red) vs. ≥50 (green)
- [ ] Data current: updated nightly with batch job
- [ ] Drill-down: click MSA to see NAICS breakdown for that MSA
- [ ] Export: CSV export of full cohort data (for board reports)
- [ ] No customer PII exposed (only aggregate counts)

**Technical Notes**:
- Data source: `pulseBenchmarks` table (aggregated)
- Query: `SELECT NAICS, MSA, COUNT(*) as cohort_size FROM pulseBenchmarks GROUP BY NAICS, MSA`
- Charts: use existing charting library (Recharts, Chart.js)
- Auto-refresh: every 1 hour (data is ~24h old anyway)

**Board Reporting**:
- Monthly snapshot: "Pulse cohort health" sent to board
- Flags any industry/geography with <50 customer threshold breaches

**Dependencies**: PULSE-D03, PULSE-D04 (existing peer grouping logic)

**Effort Estimate**: 12-16 hours (data queries + dashboard UI + export feature + drill-down)

---

### Q4 REQUIREMENTS (Should-Have)

#### PULSE-Q4-01: Industry Report — Q2 2026 Restaurant Benchmark

**Priority**: P2 (SHOULD HAVE by Q4)
**Category**: Marketing (Content)
**Source**: Jensen Huang (Board Review)
**Rationale**: "Published benchmarks are distribution. 'Restaurant benchmark report from 150+ locations' gets media coverage."

**Description**:
Generate and publish an authoritative Q2 2026 restaurant benchmark report summarizing industry trends across Pulse data.

**Report Contents**:
- Executive summary: key findings (2-3 pages)
- Methodology: data collection, cohort composition, statistical validity
- Metrics dashboard: engagement rate, post frequency, response time, conversion rate
- Geographic breakdown: regional variations
- Seasonal patterns: what worked in Q2
- Benchmarking guide: how to use report for competitive analysis
- Appendices: full methodology + data dictionary

**Distribution**:
- Published on website: `/reports/q2-2026-restaurant-benchmark`
- PDF download available
- Press release + media outreach
- LinkedIn article (board + leadership share)
- Email campaign to all Pulse customers

**Acceptance Criteria**:
- [ ] Report generated from Pulse backend (not manual)
- [ ] Data as of Q2 close (June 30, 2026)
- [ ] Cohort: 150+ restaurants (minimum threshold)
- [ ] Includes geographic breakdown (West, South, Midwest, Northeast)
- [ ] No customer-identifying data (anonymized)
- [ ] Report updates quarterly (automated template)
- [ ] Design: professional, on-brand
- [ ] Reviewed by Warren Buffett + board for accuracy
- [ ] Published with press release + social assets
- [ ] Analytics: track downloads + engagement

**Technical Implementation**:
- Template-based generation: Markdown → PDF (via Puppeteer or wkhtmltopdf)
- Automated: runs on first week of next quarter
- Storage: `/public/reports/q2-2026-restaurant-benchmark.pdf`
- Webpage: React component pulling data from Pulse API

**Success Metrics**:
- Downloads: ≥500 (external interest)
- Media mentions: ≥3 articles
- Inbound leads: ≥10 from report

**Dependencies**: PULSE-Q3-02 (insights inform report narrative)

**Effort Estimate**: 16-20 hours (report design + data extraction + writing + design + distribution)

---

#### PULSE-Q4-02: Weekly Challenge System

**Priority**: P2 (SHOULD HAVE by Q4)
**Category**: Frontend (Engagement)
**Source**: Shonda Rhimes (Board Review)
**Rationale**: "Gamification drives engagement. 'Beat your peers this week' is a proven retention hook."

**Description**:
Add a weekly challenge system where restaurants compete on specific metrics week-over-week.

**Challenge Examples**:
- "Response time challenge: Respond to 90% of reviews within 4 hours" (leader: lowest avg response time)
- "Post frequency sprint: Post 4x this week" (leader: highest posts)
- "Engagement surge: Get 50 total engagements" (leader: most total engagement)

**Acceptance Criteria**:
- [ ] Component: `WeeklyChallenge.tsx` on dashboard
- [ ] New challenge every Monday (automated)
- [ ] Leaderboard: top 10 performers in customer's peer group
- [ ] Participation: optional (feature flag with 50% rollout)
- [ ] Rewards: non-monetary (badge, celebration, email highlight)
- [ ] Gamification: streak counter ("2 weeks in top 10")
- [ ] Social share: "I'm top 3 in my region [badge image]"
- [ ] Analytics: track participation rate + engagement impact
- [ ] A/B test: with challenges vs. without

**Technical Notes**:
- Challenge definitions: stored in `challenges` table
- Weekly job: evaluate participants, rank, award badges
- Leaderboard: top 10 from peer group
- Badges: "Weekly champion", "2-week streak", "Top performer"
- Non-monetary (avoid legal/tax complications)

**Success Metrics**:
- Participation rate: ≥30% of active users
- Repeat participation: ≥50% of week 1 participate in week 2
- Engagement uplift: participants vs. non-participants

**Dependencies**: PULSE-L01, PULSE-30-02 (email hooks for challenges)

**Effort Estimate**: 12-16 hours (challenge logic + leaderboard + UI + streak tracking + analytics)

---

#### PULSE-Q4-03: Parallelize Batch Job

**Priority**: P2 (SHOULD HAVE by Q4)
**Category**: DevOps (Performance)
**Source**: Jensen Huang (Board Review)
**Rationale**: "At 10K businesses, nightly percentile batch will take hours. Parallelize now before scaling."

**Description**:
Refactor the `batch-percentiles.ts` job to use parallel processing (worker pool) instead of sequential.

**Current Implementation**:
- Iterate through all customers sequentially
- Calculate percentiles per customer (1K customers = ~2-5 minutes)
- Store results

**Parallelized**:
- Split customers into batches (e.g., 10 batches of 100)
- Process batches in parallel (Node.js worker pool)
- Aggregate results
- Projected: same job in 30-60 seconds (10x faster)

**Acceptance Criteria**:
- [ ] Job runs with 10 parallel workers (tunable)
- [ ] Runtime: ≤1 minute for 1K customers
- [ ] Projected runtime at 10K: ≤10 minutes
- [ ] No duplicate calculations (idempotent)
- [ ] Logging: track worker progress + errors
- [ ] Monitoring: alert if job exceeds SLA (e.g., >5 min for 1K)
- [ ] Tested: load test with 5K customers
- [ ] Rollout: blue/green deploy with monitoring

**Technical Notes**:
- Use: Node.js `worker_threads` or Bull queue with Redis
- Batch size: tune for optimal throughput (start 100/batch)
- Error handling: retry failed batches, log failures
- Database connections: one per worker (pool)
- Idempotency: use `ON CONFLICT ... DO UPDATE` for inserts

**Success Metrics**:
- Batch job duration: <1 min at 1K, <10 min at 10K
- No data loss (idempotency verified)
- Error rate: <0.1%

**Dependencies**: PULSE-D01 (existing batch job), database scaling

**Effort Estimate**: 10-14 hours (refactoring + testing + monitoring setup)

---

## Requirement Categories Summary

### By Category

| Category | Count | Status |
|----------|-------|--------|
| **Frontend** | 8 | 7 TODO, 1 DELIVERED |
| **Services** | 7 | 7 TODO |
| **Database** | 3 | 2 TODO, 1 DELIVERED |
| **API** | 4 | 2 TODO, 2 DELIVERED |
| **QA** | 1 | 1 TODO |
| **DevOps** | 2 | 1 TODO, 1 DELIVERED |
| **Marketing** | 1 | 1 TODO |
| **Product** | 2 | 2 TODO |
| **TOTAL** | **28** | **20 TODO, 8 DELIVERED** |

### By Priority

| Priority | Count | Timeline |
|----------|-------|----------|
| **P0 (LAUNCH)** | 3 | This sprint |
| **P0 (30-DAY)** | 3 | Q2 sprint |
| **P1 (Q3)** | 4 | Q3 milestones |
| **P2 (Q4)** | 3 | Q4 should-haves |
| **P3 (STRATEGIC)** | 3 | Annual planning |
| **REFERENCE (DELIVERED)** | 10 | ✅ Complete |

### By Timeline

| Timeline | Count | Deadline |
|----------|-------|----------|
| **LAUNCH** (This Sprint) | 3 | ASAP (1-2 weeks) |
| **30-DAY** (Q2) | 3 | ~30 days |
| **Q3** | 4 | ~90 days |
| **Q4** | 3 | ~180 days |
| **STRATEGIC** | 3 | Annual |

---

## Dependency Graph

```
PULSE-L01 (Email Notifications)
  ├─ PULSE-L02 (Bottom Quartile UX)
  ├─ PULSE-30-02 (Weekly Digest)
  └─ PULSE-30-03 (Retention Attribution)

PULSE-L02 (Bottom Quartile UX)
  ├─ PULSE-L03 (Mobile Audit)
  └─ PULSE-30-01 (Next Tier)

PULSE-L03 (Mobile Audit)
  └─ PULSE-30-02 (Weekly Digest in workflows)

PULSE-30-01 (Next Tier)
  └─ PULSE-Q3-02 (Insights Engine patterns)

PULSE-30-02 (Weekly Digest)
  ├─ PULSE-Q3-03 (Spanish translation)
  └─ PULSE-Q4-02 (Challenge system)

PULSE-30-03 (Retention Attribution)
  └─ (Standalone, informs all board reporting)

PULSE-Q3-01 (Premium Badge)
  ├─ PULSE-D06 (Existing badge)
  └─ PULSE-D05 (Report pages)

PULSE-Q3-02 (Insights Engine)
  ├─ PULSE-D06 (Dashboard delivery)
  ├─ PULSE-Q4-01 (Report narratives)
  └─ PULSE-Q4-02 (Challenge rules)

PULSE-Q3-03 (Spanish Localization)
  ├─ PULSE-L02 (Component coverage)
  └─ PULSE-30-02 (Email templates)

PULSE-Q3-04 (Cohort Density)
  ├─ PULSE-D03 (NAICS data)
  └─ PULSE-D04 (Peer grouping)

PULSE-Q4-01 (Industry Report)
  ├─ PULSE-Q3-02 (Insights for narrative)
  └─ PULSE-D06 (Benchmark data)

PULSE-Q4-02 (Weekly Challenges)
  ├─ PULSE-L01 (Notification hooks)
  └─ PULSE-30-02 (Email promotion)

PULSE-Q4-03 (Parallelize Batch)
  ├─ PULSE-D01 (Percentile calculation)
  └─ (DevOps only, no product deps)
```

---

## Implementation Roadmap

### Sprint 1 (LAUNCH) — This Week
- [ ] PULSE-L01: Email notifications (±5 points)
- [ ] PULSE-L02: Bottom quartile UX redesign
- [ ] PULSE-L03: Mobile audit (30-second flow)

**Checkpoint**: QA sign-off from Margaret Hamilton

### Sprint 2 (30-DAY) — Next 2-3 Weeks
- [ ] PULSE-30-01: Next tier path feature
- [ ] PULSE-30-02: Weekly email digest
- [ ] PULSE-30-03: Retention attribution

**Checkpoint**: Retention metrics baseline established

### Sprint 3 (Q3-A) — 4-6 Weeks
- [ ] PULSE-Q3-01: Premium badge monetization
- [ ] PULSE-Q3-02: Insights engine v1

**Checkpoint**: 5+ paid badge customers or pivot

### Sprint 4 (Q3-B) — 6-8 Weeks
- [ ] PULSE-Q3-03: Spanish localization
- [ ] PULSE-Q3-04: Cohort density dashboard

**Checkpoint**: Spanish adoption ≥5% of DAU

### Sprint 5 (Q4-A) — 10-12 Weeks
- [ ] PULSE-Q4-01: Industry report Q2 2026
- [ ] PULSE-Q4-03: Parallelize batch job

**Checkpoint**: Report published + media coverage

### Sprint 6 (Q4-B) — 12-14 Weeks
- [ ] PULSE-Q4-02: Weekly challenge system

**Checkpoint**: 30%+ participation rate

### Strategic (Annual) — Beyond Q4
- [ ] PULSE-STR-01: Benchmark API
- [ ] PULSE-STR-02: Second vertical (Retail/Salons)
- [ ] PULSE-STR-03: Recommendation engine (ML)

---

## Risk Register

| # | Risk | Impact | Probability | Mitigation | Owner |
|---|------|--------|-------------|------------|-------|
| 1 | Email notification fatigue → unsubscribe spike | HIGH | MEDIUM | A/B test frequency; start ±5 points threshold | Engineering |
| 2 | Bottom quartile redesign makes app confusing | MEDIUM | LOW | User testing with struggling restaurants; iteration | Design |
| 3 | Mobile flow >30s due to data load | MEDIUM | MEDIUM | Optimize API response; cache aggressively | Engineering |
| 4 | Next tier doesn't drive retention uplift | HIGH | MEDIUM | A/B test early; fallback to other hooks | Product |
| 5 | Spanish translation quality issues | MEDIUM | LOW | Native speaker review + customer testing | Localization |
| 6 | Premium badge has <5% conversion | HIGH | MEDIUM | Adjust pricing/features; monitor LTV:CAC | Product |
| 7 | Insights engine returns meaningless rules | MEDIUM | HIGH | Strict thresholds (n≥20, p<0.05); manual review of rules | Data |
| 8 | Batch job parallelization breaks idempotency | CRITICAL | LOW | Extensive testing; blue/green deploy; rollback plan | Engineering |

---

## Success Criteria (Overall)

By end of Q3 (90 days):
- [ ] All LAUNCH + 30-DAY + Q3 requirements delivered
- [ ] Retention: +10% vs. baseline (attributed to Pulse features)
- [ ] Email engagement: ≥40% open rate on digests
- [ ] Premium badges: ≥10 paying customers ($2,280/year recurring)
- [ ] Spanish users: ≥5% of DAU
- [ ] Insights engine: ≥10% of users click on insights

By end of Q4 (180 days):
- [ ] Industry report published + media coverage
- [ ] Challenges: ≥30% participation rate
- [ ] Batch job: <10 min runtime at 10K businesses
- [ ] Strategic roadmap approved (2nd vertical + API)

---

## Sign-Off

**Document Status**: LOCKED FOR IMPLEMENTATION
**Authority**: Phil Jackson (PRD Owner), Steve Jobs + Elon Musk (Decision Makers), Margaret Hamilton (QA)
**Generated**: 2026-04-09
**Last Reviewed**: 2026-04-09

**Next Review**: After LAUNCH completion (1-2 weeks)

---

**Now we build.**
