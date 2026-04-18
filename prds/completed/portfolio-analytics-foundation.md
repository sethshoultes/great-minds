# PRD: Portfolio Analytics Foundation

## Overview
The featureDream product portfolio (LocalGenius, Dash, Pinned, Great Minds, Shipyard AI) currently operates as five isolated products with no shared data, no cross-product insights, and no portfolio-level visibility. This project builds the foundational analytics infrastructure that enables data-driven decisions, cross-product learning, and the compounding advantages that separate portfolios from product collections.

## Problem Statement
**The Problem:**
1. **No portfolio visibility** — Cannot answer basic questions: Which product has the most daily active users? Which has the worst retention? Which features are most used?
2. **Data doesn't compound** — Usage patterns in one product don't improve other products. Learnings are trapped in silos.
3. **No CAC/LTV tracking** — Cannot calculate customer acquisition cost or lifetime value for any product
4. **Great Minds outcome blind spot** — No correlation between PRD inputs and shipped outcomes (token cost vs. revenue generated)
5. **Flying blind on retention** — No retention curves, no cohort analysis, no churn prediction

**Who Has This Problem:** The portfolio operator (you), trying to make resource allocation decisions without data.

**Pain Level:** High — Every strategic decision is currently made on intuition rather than evidence. This compounds over time into misallocated resources and missed opportunities.

## Target Market
**Primary User:** Portfolio operator/product owner
- Needs: Real-time visibility into all products, actionable insights, anomaly detection
- Frequency: Daily check-ins, weekly deep dives, monthly strategy reviews

**Secondary Users:**
- Individual product teams (for product-specific metrics)
- Board members (for review cycles)
- Great Minds agents (for outcome-aware planning)

## Core Features

### 1. Event Tracking Schema
- [ ] Define universal event schema for all products:
  ```
  {
    product: "localgenius" | "dash" | "pinned" | "great-minds" | "shipyard",
    event: "page_view" | "feature_use" | "session_start" | "conversion" | ...,
    user_id: "anonymous_hash",
    timestamp: ISO8601,
    properties: { ... }
  }
  ```
- [ ] Implement privacy-first approach (no PII, hashed identifiers, user opt-out)
- [ ] Define critical events per product:
  - **LocalGenius:** trial_start, subscription_start, post_generated, review_responded, report_viewed
  - **Dash:** command_executed, search_performed, shortcut_used, session_duration
  - **Pinned:** note_created, note_acknowledged, mention_sent, session_duration
  - **Great Minds:** prd_submitted, debate_completed, plan_approved, project_shipped, tokens_consumed
  - **Shipyard:** project_started, stage_completed, project_delivered, revision_requested

### 2. Analytics Dashboard MVP
- [ ] Central dashboard showing all products
- [ ] Key metrics per product:
  - Daily Active Users (DAU)
  - Weekly Active Users (WAU)
  - Monthly Active Users (MAU)
  - DAU/MAU ratio (stickiness)
  - Session duration (average, median)
  - Feature usage breakdown
- [ ] Portfolio-level aggregations:
  - Total users across all products
  - Cross-product usage (users in 2+ products)
  - Portfolio retention curve
- [ ] Time range selector (7d, 30d, 90d, custom)

### 3. Retention & Cohort Analysis
- [ ] Retention curves per product (Day 1, Day 7, Day 30, Day 90)
- [ ] Cohort analysis by signup week/month
- [ ] Churn identification (users who haven't returned in X days)
- [ ] Resurrection tracking (users who returned after churning)

### 4. Great Minds Outcome Tracking
- [ ] Track per project:
  - PRD complexity score (word count, requirements count)
  - Debate outcome (synthesis quality rating)
  - Planning accuracy (planned tasks vs. actual tasks)
  - Execution metrics (tokens consumed, time to ship, bug count)
  - Post-ship performance (if applicable)
- [ ] Calculate: Revenue Per Token = (Revenue from shipped projects) / (Total tokens consumed)
- [ ] Build outcome prediction model over time

### 5. Revenue & Unit Economics (LocalGenius + Shipyard)
- [ ] Revenue tracking:
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Recurring Revenue)
  - Revenue by product, by tier, by cohort
- [ ] Unit economics:
  - CAC (Customer Acquisition Cost) by channel
  - LTV (Lifetime Value) by product
  - LTV:CAC ratio
  - Payback period
- [ ] Churn analysis:
  - Revenue churn vs. logo churn
  - Churn by cohort, by tier, by usage level

### 6. Alerting & Anomalies
- [ ] Alert on significant changes:
  - DAU drop >20%
  - Conversion rate drop >15%
  - Error rate spike
  - Unusual token consumption (Great Minds)
- [ ] Weekly digest email with key metrics and trends

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to first insight | <1 week from implementation |
| Dashboard load time | <2 seconds |
| Data freshness | <1 hour lag |
| Events tracked per day | Measure baseline, then optimize |
| Questions answered | "Which product is growing fastest?" "What's our retention?" "What's our LTV?" |

**Strategic Success:**
- Can make data-driven resource allocation decisions
- Can identify underperforming products early
- Can correlate Great Minds investments with revenue outcomes
- Can identify cross-product opportunities

## Constraints

### Budget
- Use open-source or free-tier tools where possible
- PostHog Community Edition or Plausible (self-hosted)
- SQLite or PostgreSQL for data storage
- Total external cost: <$100/month

### Timeline
- Week 1-2: Event schema defined, tracking implemented in 1 product (Pinned or Dash)
- Week 3-4: Tracking rolled out to all products
- Week 5-6: Dashboard MVP live
- Week 7-8: Retention analysis and Great Minds tracking

### Technical
- Must not impact product performance (async event sending)
- Must be privacy-compliant (GDPR, CCPA)
- Must work across WordPress plugins, web apps, and CLI tools
- Self-hosted preferred for data ownership

### Privacy Requirements
- No personally identifiable information (PII) collected
- Hashed user identifiers only
- User opt-out mechanism required
- Data retention policy (90 days default, configurable)
- GDPR Article 6(1)(f) legitimate interest basis

## Competitive Landscape

**Analytics Tools Considered:**

| Tool | Pros | Cons |
|------|------|------|
| PostHog | Open-source, self-hosted, full-featured | Complexity, resource requirements |
| Plausible | Privacy-first, simple, lightweight | Limited custom events |
| Fathom | Privacy-first, simple | Paid only, limited features |
| Mixpanel | Powerful, great cohorts | Expensive, privacy concerns |
| Amplitude | Enterprise-grade | Expensive, overkill |
| Custom build | Full control | Development time |

**Recommendation:** PostHog Community Edition (self-hosted) for maximum flexibility and data ownership, or Plausible for simplicity if advanced features not needed initially.

## Open Questions

1. **Hosting:** Self-hosted vs. cloud? Self-hosted preferred for cost and data ownership.
2. **User identity:** How to track cross-product users? Cookie-based vs. account-based?
3. **Great Minds integration:** How to surface analytics within Claude Code sessions?
4. **Board integration:** Should board members have direct dashboard access?
5. **Alerting channel:** Email? Slack? Telegram? All three?

## Architecture Sketch

```
┌─────────────────────────────────────────────────────────────────┐
│                     Analytics Dashboard                          │
│  (PostHog UI or Custom Dashboard)                                │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Query
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     Analytics Database                           │
│  (PostHog / ClickHouse / PostgreSQL)                            │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Ingest
                              │
┌───────────┬───────────┬───────────┬───────────┬─────────────────┐
│LocalGenius│   Dash    │  Pinned   │Great Minds│   Shipyard      │
│  (Web)    │(WP Plugin)│(WP Plugin)│  (CLI)    │    (Web)        │
└───────────┴───────────┴───────────┴───────────┴─────────────────┘
     │           │           │           │              │
     └───────────┴───────────┴───────────┴──────────────┘
                              │
                    Event Tracking SDK
                   (JS for web, PHP for WP,
                    Node for CLI)
```

## Dependencies

- Access to all product codebases
- Server/hosting for analytics backend (if self-hosted)
- DNS configuration for analytics subdomain
- Legal review for privacy policy updates

## Board Member Endorsements

> *"Instrument everything. Every product should be sending anonymized usage data to a central analytics layer. This is the foundation of every data moat."* — Jensen Huang

> *"You need to track: CAC, LTV, churn rate, gross margin. You can't optimize what you can't measure."* — Warren Buffett

> *"Revenue Per Token. Track every project: how much did it cost in tokens? How much revenue did it generate? Over 50 projects, this ratio tells you everything."* — Warren Buffett

> *"Users don't see other users. They feel alone. A simple '1,247 notes posted today across all Pinned users' creates belonging."* — Shonda Rhimes

---

**PRD Author:** Phil Jackson (Orchestrator)
**Source:** IMPROVE Cycle 2026-04-16
**Priority:** P1 — Foundation for all future optimization
