# Pulse — Locked Decisions
## The Zen Master's Final Synthesis

*From the creative tension between Steve Jobs (Chief Design & Brand Officer) and Elon Musk (Chief Product & Growth Officer), the following decisions have been locked for the build phase.*

*This document is the blueprint. Every line has been debated. Nothing ships that isn't here.*

---

## Decision Register

### Decision 1: Product Name — "Pulse"

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (Round 1) |
| **Winner** | Steve Jobs |
| **Accepted by** | Elon Musk (Round 2: "Pulse is a great name. I'll take it.") |
| **Rationale** | One word. One heartbeat. "Check your Pulse" becomes the verb. "Benchmark Engine" describes a feature; "Pulse" builds a brand. |

**LOCKED**

---

### Decision 2: First-Screen UX — Single Number, Instant Clarity

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (Round 1) |
| **Winner** | Steve Jobs |
| **Refined by** | Elon Musk (Round 2: Advocated for percentile over proprietary score for transparency) |
| **Final Form** | Display as percentile rank: "You're in the 73rd percentile" — not a proprietary "Pulse Score: 78" |
| **Rationale** | Steve's emotional hook ("one number, one insight, one action") combined with Elon's transparency argument. Percentiles are instantly understood and don't require explanation. |

**LOCKED**

---

### Decision 3: No Customizable Dashboards

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (Round 1: "The moment you let people move widgets around, you've admitted your design failed.") |
| **Winner** | Steve Jobs |
| **Contested by** | Elon Musk (Round 2: "At scale, a restaurant owner and a plumber have different needs.") |
| **Resolution** | Steve wins v1. Elon's concern noted for v2 if user behavior demands it. |
| **Rationale** | Pulse has opinions. We decide what matters. Configuration is an admission of uncertainty. |

**LOCKED** (for v1)

---

### Decision 4: No Insights Engine in v1

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (Round 1: "This is a recommendation system. That's a different product.") |
| **Winner** | Elon Musk |
| **Contested by** | Steve Jobs (wanted "Businesses like yours that post on Tuesdays see 34% more engagement") |
| **Rationale** | Causal inference requires controlled experiments and 10x more data. We ship *comparisons*, not *recommendations*. The "insights engine" is v2 when data volume justifies statistical validity. |

**LOCKED**

---

### Decision 5: No Monthly Email Reports in v1

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (Round 1: "Manual export is fine for v1.") |
| **Winner** | Elon Musk |
| **Contested by** | Steve Jobs (Round 2: Initially pushed back, then conceded: "If they won't log in, a PDF won't save us.") |
| **Rationale** | Automated reports are a crutch for a weak product. If the dashboard isn't worth returning to, emails won't fix it. Prove the core experience first. |

**LOCKED**

---

### Decision 6: Single Industry First — Restaurants

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (Round 1: "Reduce to 1. Pick restaurants. Nail it. Then expand.") |
| **Winner** | Elon Musk |
| **Accepted by** | Steve Jobs (Round 2: "Single industry first. Restaurants. He's right.") |
| **Rationale** | Statistical validity requires density. Spreading thin across three categories kills quality. Nail restaurants, prove the model, then expand. |

**LOCKED**

---

### Decision 7: NAICS Codes for Industry Categorization

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (implied in technical architecture discussions) |
| **Winner** | Elon Musk |
| **Accepted by** | Steve Jobs (Round 2: "Don't invent taxonomy. Use what exists.") |
| **Rationale** | The IRS, SBA, and Census Bureau already use NAICS. Zero taxonomy maintenance. Existing infrastructure, existing mental models. |

**LOCKED**

---

### Decision 8: Curated Peer Groups (No "Compare to Anyone")

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (Round 1: "Don't let users browse other businesses' data. That's not insight — that's distraction.") |
| **Winner** | Steve Jobs |
| **Accepted by** | Elon Musk (Round 2: Implicit agreement through shared focus on meaningful comparisons) |
| **Rationale** | Arbitrary comparisons destroy trust. We select peer groups based on industry, region, and business size. Comparisons must be meaningful, not arbitrary. |

**LOCKED**

---

### Decision 9: Distribution Built Into Product Architecture

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (Round 1: "Benchmarks are inherently viral. Build the share mechanic first.") |
| **Winner** | Elon Musk |
| **Accepted by** | Steve Jobs (Round 2: "The data IS the marketing.") |
| **Implementation** | Public "State of Local Business" reports (SEO), embeddable badges (backlinks), claim links ("Top 10% of Denver restaurants") |
| **Rationale** | Benchmarks that aren't shared are just analytics. Every customer makes the data more valuable, and the data markets itself. |

**LOCKED**

---

### Decision 10: 2-Week Ship Timeline

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (Round 1: "Ship in 2 weeks. Validate that anyone cares. Then iterate.") |
| **Winner** | Elon Musk |
| **Contested by** | Steve Jobs (implicit — focused on quality and emotional resonance over speed) |
| **Resolution** | Elon wins on timeline. Steve wins on quality bar within that timeline. |
| **Rationale** | The core product is ~500 lines of code. If it takes longer, we're overengineering. Prove demand before building the cathedral. |

**LOCKED**

---

### Decision 11: No Raw Data Exports

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (Round 1: "We're not a data warehouse. We're an intelligence engine.") |
| **Winner** | CONTESTED — Not fully resolved |
| **Contested by** | Elon Musk (Round 2: "Export is a checkbox — 10 lines of code. Don't die on this hill.") |
| **Resolution** | **Steve wins for v1.** No exports. Revisit if power users specifically request it for ROI proof to stakeholders. |
| **Rationale** | The value is in the interpretation, not the bytes. But Elon's point about accountants and loan officers is noted for v2. |

**LOCKED** (for v1, flagged for v2 review)

---

### Decision 12: Data Quality Over Feature Quantity

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (Round 1: "If we don't have 50+ businesses per cohort with 30+ days of clean data, the Pulse Score is a random number generator.") |
| **Winner** | Elon Musk |
| **Accepted by** | Steve Jobs (Round 2: "Data quality is the real bottleneck. Fix the pipeline first. Absolutely right.") |
| **Rationale** | Don't ship lies dressed in green gradients. Statistical validity is non-negotiable. |

**LOCKED**

---

### Decision 13: Brand Voice

| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (Round 1) |
| **Winner** | Steve Jobs |
| **Accepted by** | Elon Musk (Round 2: "Confident. Direct. Actionable. No corporate speak, no fake enthusiasm. Respect the user's time. Agreed.") |
| **The Voice** | Like a trusted advisor who respects your time. Not corporate jargon. Not fake enthusiasm. Example: "You're ahead of most restaurants your size. Here's one thing that could push you further." |

**LOCKED**

---

## MVP Feature Set (What Ships in v1)

### Must Have (Non-Negotiable)

| Feature | Owner | Rationale |
|---------|-------|-----------|
| **Percentile rank display** | Steve (UX) / Elon (arch) | The single number. First thing users see. The emotional hook. |
| **Industry comparison view** | Both | 3-4 charts showing position relative to restaurant peers |
| **NAICS-based categorization** | Elon | Standard taxonomy, zero maintenance |
| **Curated peer groups** | Steve | Region + industry + size matching for meaningful comparisons |
| **One public benchmark report** | Elon | "State of Local Restaurant Marketing" for SEO/PR |
| **Embeddable badges** | Elon | "Top X% in engagement" for customer sites (backlink engine) |
| **Freemium comparison hook** | Elon | "See how you stack up" preview requiring signup for full data |

### 5 Core Metrics (Per Elon, Round 1)

1. Engagement rate
2. Post frequency
3. Follower growth
4. Response time
5. Conversion rate

### Explicitly Cut from v1

| Feature | Proposed By | Why Cut |
|---------|-------------|---------|
| Insights engine ("Businesses like yours...") | Steve (wanted) | Requires 10x data + causal inference. v2. |
| Monthly automated email reports | PRD | If dashboard isn't sticky, emails won't save it |
| Customizable dashboards | Neither | Design has opinions. We decide what matters. |
| Raw data exports | Elon (wanted) | v1 ships intelligence, not bytes. Revisit v2. |
| ML/recommendation systems | PRD | Premature. Ship comparisons first. |
| "Compare to anyone" functionality | Neither | Arbitrary comparisons destroy trust |
| Multiple industries | PRD | Restaurants only. Nail one vertical. |

---

## File Structure (What Gets Built)

```
pulse/
├── database/
│   └── migrations/
│       └── 001_benchmark_schema.sql       # Customer metrics + benchmark tables
│
├── jobs/
│   └── nightly_benchmark_job.js           # Batch percentile calculation
│                                          # GROUP BY industry, PERCENTILE_CONT()
│
├── api/
│   └── routes/
│       └── benchmarks.js                  # GET /api/benchmarks/:customerId
│
├── components/
│   ├── PulseScore.jsx                     # The single percentile number (hero)
│   ├── IndustryComparison.jsx             # 3-4 comparison charts
│   ├── PeerGroupSelector.jsx              # Industry/region/size display
│   └── EmbeddableBadge.jsx                # Public badge component
│
├── pages/
│   ├── Dashboard.jsx                      # Main Pulse dashboard
│   └── PublicReport.jsx                   # SEO-friendly benchmark reports
│
├── public/
│   └── badges/
│       └── badge-embed.js                 # Embeddable badge loader
│
└── content/
    └── reports/
        └── state-of-local-restaurants.md  # First public benchmark report
```

### Technical Specifications

| Component | Technology | Notes |
|-----------|------------|-------|
| **Database** | PostgreSQL (existing) | Leverage existing LocalGenius infrastructure |
| **Computation** | `PERCENTILE_CONT()` in nightly batch | Pre-computed aggregates |
| **API** | Single REST endpoint | `GET /api/benchmarks/:customerId` |
| **Frontend** | React components | Integrates with existing LocalGenius UI |
| **Estimated LOC** | ~500 lines | If it's more, we're overengineering |

---

## Open Questions (Requiring Resolution Before Build)

### 1. Existing Data Structures

| Attribute | Detail |
|-----------|--------|
| **Question** | Are the 5 core metrics (engagement rate, post frequency, follower growth, response time, conversion rate) currently tracked in the database? |
| **Risk** | If metrics don't exist, this becomes a data collection project, not a dashboard project. Timeline explodes. |
| **Owner** | Engineering — audit existing schema immediately |
| **Blocker Level** | CRITICAL |

### 2. Minimum Customers per Category

| Attribute | Detail |
|-----------|--------|
| **Question** | What's the minimum number of businesses in a cohort before we display benchmarks? |
| **Consideration** | Too few = privacy concerns + statistical noise. Elon says 50+ for validity. |
| **Suggested Threshold** | Minimum 10 businesses per cohort to display. Below that, show "insufficient data" gracefully. |
| **Owner** | Product decision needed |

### 3. Geographic Scope for Peer Groups

| Attribute | Detail |
|-----------|--------|
| **Question** | What defines "region" for peer grouping — city, metro area (MSA), state, national? |
| **Trade-off** | Smaller regions = more relevant comparisons but sparser data |
| **Suggested Default** | Metro area (MSA) with fallback to state if <10 peers |
| **Owner** | Product decision needed |

### 4. Badge Qualification Thresholds

| Attribute | Detail |
|-----------|--------|
| **Question** | What percentile qualifies for embeddable badges? |
| **Consideration** | Too exclusive = few badges = limited distribution. Too inclusive = meaningless badges. |
| **Suggested Tiers** | Top 10% (Gold), Top 25% (Silver), Top 50% (Bronze) |
| **Owner** | Product/Marketing decision needed |

### 5. Public Report Cadence

| Attribute | Detail |
|-----------|--------|
| **Question** | How often do we publish "State of Local Restaurant Marketing" reports? |
| **Trade-off** | More frequent = more SEO content but thinner data deltas |
| **Suggested** | Quarterly (per Elon) |
| **Owner** | Marketing decision needed |

---

## Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | **Data doesn't exist** — Core metrics not currently tracked in database | Medium | CRITICAL | Audit existing schema BEFORE build begins. If missing, re-scope entire project. |
| 2 | **Sparse cohorts** — Not enough restaurants in peer groups for meaningful benchmarks | High | High | Set minimum threshold (10+). Show "insufficient data" gracefully. Fallback to broader geographic or industry categories. |
| 3 | **Privacy exposure** — Small peer groups inadvertently reveal competitor data | Medium | High | Minimum 10 businesses per displayed cohort. Aggregate only, no individual identification possible. |
| 4 | **Gaming** — Restaurants inflate metrics to improve rank | Low | Medium | Focus on engagement rate percentages, not absolute numbers. Ratios are harder to game than counts. |
| 5 | **Insights creep** — Stakeholders push for "just one insight" feature in v1 | High | Medium | THIS DOCUMENT IS THE LINE. No insights engine. Comparisons only. Refer back to Decision 4. |
| 6 | **Timeline slip** — 2 weeks becomes 2 months | Medium | High | Daily check-ins. If Day 5 isn't showing progress, cut scope further. Elon's 500-line target is the constraint. |
| 7 | **Badge abuse** — Businesses display outdated badges after ranking drops | Low | Low | Badges include calculation date. Optional v2: dynamic badges that pull live rank via API. |
| 8 | **NAICS mismatch** — Customer-reported industry doesn't match reality | Medium at scale | Medium | Accept for v1. Add validation/correction workflow in v2 if data quality degrades. |
| 9 | **Percentile confusion** — Users don't understand what "73rd percentile" means | Low | Medium | Copy testing. Alternative: "You're ahead of 73% of restaurants" (Steve's phrasing). |
| 10 | **No distribution uptake** — Businesses don't share badges or rankings | Medium | High | Make sharing frictionless. Default badges to "shareable." Test badge designs for social appeal. |

---

## The Essence (North Star)

From `essence.md` — the soul of this product:

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

## Summary of Debate Outcomes

| Domain | Steve Won | Elon Won |
|--------|-----------|----------|
| **Naming** | "Pulse" | — |
| **UX Philosophy** | Single number first, no clutter | — |
| **No Customization** | Locked for v1 | — |
| **Brand Voice** | Confident, direct, human | — |
| **Peer Group Curation** | Meaningful comparisons only | — |
| **Architecture** | — | Pre-computed percentiles, one cron |
| **Scope** | — | Single industry (restaurants) |
| **Timeline** | — | 2 weeks, ~500 LOC |
| **No Insights v1** | — | Comparisons only |
| **No Reports v1** | — | Dashboard must be sticky first |
| **Distribution** | — | Built into architecture |
| **Data Quality** | — | 50+ businesses minimum |

**The synthesis:** Steve shaped *what it feels like*. Elon shaped *what ships when*.

---

## Sign-Off

This document represents the consolidated decisions from:
- `round-1-steve.md` — Steve Jobs' initial positions
- `round-1-elon.md` — Elon Musk's initial positions
- `round-2-steve.md` — Steve's response and concessions
- `round-2-elon.md` — Elon's response and concessions
- `essence.md` — The product's soul

**The tension was productive:**
- Steve's insistence on emotional clarity shaped the UX
- Elon's insistence on shipping fast shaped the scope
- Both agreed on what matters: trust through simplicity

**The path is clear:**
- 2 weeks
- ~500 lines of code
- One number
- One industry (restaurants)
- Distribution built in
- Ship it

---

*"The strength of the team is each individual member. The strength of each member is the team."*

*— Phil Jackson*

---

**Now we build.**
