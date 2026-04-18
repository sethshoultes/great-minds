# Compass — Build Blueprint
**Portfolio Analytics Foundation: Locked Decisions**

*Synthesized by Phil Jackson, Zen Master*
*Date: 2026-04-16*
*Status: READY FOR BUILD*

---

## Executive Summary

**Product Name:** Compass
**Core Purpose:** Truth machine. Tells you which product to kill before you waste another month.
**Emotional Hook:** Control. Relief from certainty, not anxiety from guessing.
**Build Philosophy:** Steve's ruthless focus + Elon's ruthless speed = tool you open every morning because knowing beats guessing.

**The Synthesis:** SQLite. Text summaries first. UI when data proves what matters.

---

## I. DECISION REGISTRY

### Decision 1: Product Name — "Compass"
**Proposed by:** Steve Jobs (Round 1)
**Winner:** Steve (Unanimous)
**Why it won:**
- One word. Inevitable. Shows direction, not just data.
- Beats enterprise garbage like "Portfolio Analytics Dashboard"
- Elon concession (Round 2): "It's actually good. Analytics products have shit names. Compass has a metaphor that clarifies purpose."

**LOCKED** ✓

---

### Decision 2: Technical Architecture — SQLite Over PostHog
**Proposed by:** Elon Musk (Round 1)
**Winner:** Elon (Steve conceded Round 2)
**Why it won:**
- "PostHog is infrastructure porn" — you're pre-PMF, need velocity not complexity
- SQLite handles 100k writes/day single-threaded
- $0 infrastructure cost
- 4-hour migration to Postgres when actually needed
- Steve concession: "You're right about scope creep. We don't need PostHog."

**Architecture:**
```
SQLite database
├── One table: events
├── Six columns: product, event, user_hash, timestamp, properties_json, revenue_cents
├── Simple HTTP POST endpoint (~50 lines)
└── Runs on existing server — $0 cost
```

**LOCKED** ✓

---

### Decision 3: The UI Debate — Phased Rollout
**Proposed by:** Steve (UI Week 1) vs Elon (grep forever)
**Winner:** Synthesis (Phased approach)
**Why it won:**
- Steve's insight: "grep is not a product" — habit formation requires visual interface
- Elon's insight: "Design without data is decoration" — need to see what metrics matter first
- Compromise: Text summaries Week 1, Dashboard UI Week 12

**Phase 1 (Week 1):**
- Daily text summary in Compass voice
- "Pinned: 12 DAU (-40%). 7d retention: 8%. Diagnosis: Dead. Decision: Kill or pivot."
- Delivered via email or text file

**Phase 2 (Week 12):**
- Dashboard UI (after knowing what to show)
- ONE screen, no customization
- 5 products × 3 metrics = brutal clarity
- Load time <3 seconds

**LOCKED** ✓

---

### Decision 4: Core Metrics — The Three Numbers That Matter
**Proposed by:** Steve (3 metrics) + Elon (outcomes over sessions)
**Winner:** Synthesis
**Why it won:**
- Both agreed: ruthless focus over comprehensive dashboards
- "You can only look at three numbers at a time" (Steve)
- "Track outcomes, not activity" (Elon)

**Per Product:**
1. **Daily Active Users** — the truth
2. **7-Day Retention** — the future
3. **Revenue Per User** — the value

**Event Philosophy:**
- "User generated post that got engagement" > "user spent 3 minutes on page"
- Server-side tracking for revenue
- Client-side for UX signals only

**LOCKED** ✓

---

### Decision 5: Brand Voice — Brutal Honesty
**Proposed by:** Steve Jobs (Round 1)
**Winner:** Steve (Elon conceded Round 2)
**Why it won:**
- Elon quote: "'Pinned is dying. Fix it or shut it down' is better than 'User retention coefficient decreased 23% WoW.' If we're going to generate text summaries, make them actionable. Conceded."

**Voice Principles:**
- **Direct:** No jargon. No corporate-speak.
- **Confident:** Not "data suggests" — it's "here's what's happening"
- **Actionable:** Every insight ends with "Do this"

**Examples:**
- ✅ "Pinned is dying. 62% never returned. Kill it or pivot."
- ❌ "Retention metrics suggest suboptimal engagement patterns."

**LOCKED** ✓

---

### Decision 6: V1 Scope — Ruthless Cuts
**Proposed by:** Elon (Round 1, refined by Steve Round 2)
**Winner:** Both (Mutual agreement on cuts)
**Why it won:**
- Steve: "Every feature you add is a feature you have to maintain, explain, and support."
- Elon: "You're trying to build Mixpanel when you need a spreadsheet that auto-updates."

**What Ships in V1:**
- SQLite + HTTP endpoint
- 20 events (4 per product)
- 3 metrics per product (DAU, 7d retention, revenue/user)
- Daily text summaries
- Pinned integration (Week 1)

**Cut to V2+:**
- ❌ Cohort analysis (beyond D1/D7/D30)
- ❌ Anomaly detection alerts
- ❌ Weekly digest emails
- ❌ Cross-product user tracking
- ❌ Time range selectors (30 days only)
- ❌ Board member access
- ❌ Churn prediction models
- ❌ Dashboard UI (Week 12, not Week 1)

**LOCKED** ✓

---

### Decision 7: Timeline — 3-Day Build, 4-Week Integration
**Proposed by:** Elon (3 days) vs Steve (1 week with UI)
**Winner:** Phased timeline (Synthesis)
**Why it won:**
- Speed to first decision > speed to first data dump
- Elon's forcing function: "If data isn't flowing by Day 7, we failed"
- Steve's adjustment: UI after data proves what matters

**Week 1:** Data flowing + first Compass reading
- Day 1: Define 20 critical events
- Day 2-3: SQLite backend + HTTP endpoint
- Day 4-7: Integrate Pinned, deliver first text summary

**Week 2-4:** Full integration + first decision
- Integrate remaining 4 products (1 per day)
- Daily text summaries
- Make ONE major decision (kill/pivot/double-down)

**Week 12:** Dashboard UI
- Only build once we know what to show
- Dead-simple HTML (not pixel-perfect masterpiece)
- Steve's voice, Elon's speed

**LOCKED** ✓

---

## II. MVP FEATURE SET (What Ships in V1)

### ✅ IN SCOPE

**Backend Infrastructure:**
- SQLite database (`compass.db`)
- HTTP POST endpoint (`ingest.php` ~50 lines)
- Event schema (6 columns: product, event, user_hash, timestamp, properties_json, revenue_cents)
- Daily cron job for metric calculation

**Event Tracking:**
- 20 events total (4 per product: Pinned, Dash, LocalGenius, Shipyard, Great Minds)
- Focus on outcome events (not vanity metrics)
- User hash for privacy (no PII)
- Revenue tracking in cents (server-side)

**Core Metrics (Per Product):**
- Daily Active Users (the truth)
- 7-Day Retention: D1, D7, D30 cohorts (the future)
- Revenue Per User: MRR, churn rate (the value)
- Manual error rate checks (not automated)

**Output Format (Phase 1):**
- Daily text summary in Compass voice
- Delivered via email or text file
- Format: `"Product: [metric] ([trend]). Diagnosis: [health]. Decision: [recommendation]"`
- Example: `"Pinned: 12 DAU (-40%). 7d retention: 8%. Diagnosis: Dead. Decision: Kill or pivot."`

**Integration Plan:**
- Week 1: Pinned (desktop app, controlled environment)
- Week 2-4: Remaining products (1 per day, manual integration)

---

### ❌ CUT FROM V1 (Deferred to V2+)

**V2 Features:**
- Cohort analysis (beyond D1/D7/D30)
- Anomaly detection alerts
- Cross-product user tracking
- Dashboard UI (Week 12)
- Customizable views/widgets
- Real-time updates (hourly sufficient for V1)

**V3+ Features:**
- Resurrection tracking
- Great Minds outcome prediction model
- Weekly digest emails
- Revenue per token analysis
- Advanced retention cohorts
- AI-generated insights

**NEVER Features:**
- 47 chart types (line + bar only)
- Customizable dashboards ("we decide what matters")
- User settings (font size, themes, time zones)
- Minute-by-minute real-time obsession
- PostHog/ClickHouse/infrastructure complexity

---

## III. FILE STRUCTURE (What Gets Built)

### Phase 1: Backend (Week 1)

```
compass/
├── db/
│   └── compass.db                 # SQLite database (6-column events table)
├── src/
│   ├── ingest.php                 # HTTP POST endpoint (~50 lines)
│   ├── queries.php                # 5 core SQL queries (DAU, retention, revenue)
│   └── report.php                 # Text summary generator (Compass voice)
├── config/
│   └── events.json                # Event schema (20 events defined)
├── integrations/
│   └── pinned/
│       └── tracker.js             # Client-side event tracker
└── cron/
    └── daily-summary.sh           # Runs queries + sends summary email
```

### Phase 2: Integrations (Week 2-4)

```
integrations/
├── pinned/
│   └── tracker.js                 # Week 1
├── dash/
│   └── tracker.js                 # Week 2
├── localgenius/
│   └── tracker.js                 # Week 2
├── shipyard/
│   └── tracker.js                 # Week 3
└── great-minds/
    └── tracker.js                 # Week 3
```

### Phase 3: Dashboard UI (Week 12)

```
ui/
├── index.html                     # Single-page dashboard (ONE screen)
├── styles.css                     # Minimal styling (CSS variables for dark mode)
├── app.js                         # Fetch + render metrics
└── api/
    └── metrics.php                # JSON endpoint for UI
```

---

## IV. OPEN QUESTIONS (Needs Resolution Before Build)

### 1. Dark Mode Strategy
**Context:** Elon says "20 minutes with CSS variables." Steve says "No user settings."
**Options:**
- A) Auto-detect OS preference (no toggle)
- B) No dark mode (Steve's original position)
- C) Toggle (violates "no customization" principle)

**Recommendation:** Option A — auto-detect OS setting, no toggle. Satisfies both.
**Blocker:** No. Can decide during Week 12 UI build.

---

### 2. Refresh Frequency
**Context:** Elon wants on-demand. Steve wants hourly (no obsession).
**Options:**
- A) Hourly auto-refresh only
- B) Hourly auto + manual refresh button
- C) Real-time (rejected by both)

**Recommendation:** Option B — default calm, option for urgency.
**Blocker:** No. Phase 1 has no dashboard, so this is Week 12 decision.

---

### 3. Dashboard Drill-Down Views
**Context:** Steve wants ONE screen. Elon wants flexibility for debugging.
**Options:**
- A) ONE screen only (Steve's original position)
- B) Main screen (5 products × 3 metrics) + click product for detail view
- C) Customizable widgets (rejected by both)

**Recommendation:** Option B — satisfies Steve's "no customization" + Elon's "need granularity for debugging."
**Blocker:** No. Week 12 decision.

---

### 4. AI Insights
**Context:** Steve calls it "fortune-telling." Elon sees value in causal correlations.
**Options:**
- A) Never (Steve's position)
- B) V2 simple correlations ("Metric X changed after Event Y")
- C) V3 LLM summaries (if V2 proves valuable)

**Recommendation:** Option B/C — staged approach. V1 has no AI.
**Blocker:** No. Not in V1 scope.

---

### 5. Event Schema Migration Strategy
**Context:** How to handle schema changes without breaking historical data?
**Options:**
- A) JSON properties field only (flexible but hard to query)
- B) Strict schema with migrations (rigid but performant)
- C) Hybrid: Core columns + JSON overflow

**Recommendation:** Option C — locked columns for metrics queries, JSON for ad-hoc properties.
**Blocker:** **YES.** Must decide before building `compass.db` schema.

---

## V. RISK REGISTER (What Could Go Wrong)

### CRITICAL RISKS

#### Risk 1: "We build it and never use it"
**Probability:** HIGH (most internal tools die this way)
**Impact:** CRITICAL (wasted effort, back to guessing)
**Why it happens:** Analytics tools feel like homework, not habit.

**Mitigation:**
- Daily summary EMAILED (not buried in dashboard)
- 30-second check becomes morning routine
- Track "decisions made using Compass" as its own success metric

**Owner:** Process design (Steve's forcing function: make checking it frictionless)

---

#### Risk 2: "We measure the wrong things"
**Probability:** MEDIUM (hard to know what matters pre-PMF)
**Impact:** HIGH (data exists but doesn't inform decisions)
**Why it happens:** Track vanity metrics (page views) instead of value metrics (outcomes).

**Mitigation:**
- Week 1: Define events collaboratively (not in isolation)
- Week 4 review: "Did we make a decision? If not, why not?"
- SQLite flexibility: Change metrics in 5 minutes, not 5 days

**Owner:** Event definition phase (Day 1) — requires Seth input

---

#### Risk 3: "Premature optimization — We build Mixpanel"
**Probability:** MEDIUM (Steve's design ambition + Elon's tech enthusiasm)
**Impact:** HIGH (6 weeks later, still no data)
**Why it happens:** Feature creep. "Just one more thing..."

**Mitigation:**
- Locked V1 scope (above) — anything not listed is BANNED
- Week 1 hard deadline: If data isn't flowing by Day 7, we failed
- Elon's forcing function: "Can I query this with SQL?" If no, too complex.

**Owner:** Scope enforcement (Phil Jackson / project lead)

---

#### Risk 4: "Privacy/compliance issues"
**Probability:** LOW (internal tool, hashed users)
**Impact:** MEDIUM (legal hassle if we track PII)
**Why it happens:** Accidental PII collection (emails, IPs, names).

**Mitigation:**
- User hash (not email/name) in V1
- No IP logging
- No cross-product identity until legal review
- Server-side tracking (not third-party pixels)

**Owner:** Implementation (ensure hash-only from Day 1)

---

#### Risk 5: "SQLite hits limits before we're ready to migrate"
**Probability:** LOW (10k events/day = years of runway)
**Impact:** MEDIUM (dashboard slow, queries lag)
**Why it happens:** Exponential growth, unoptimized queries.

**Mitigation:**
- Indexed timestamps from Day 1
- Monitor query performance weekly
- Pre-written Postgres migration script (ready when needed)
- ClickHouse research starts at 500k events/day (not 2M)

**Owner:** Technical architecture (validate Elon's "4-hour migration" claim)

---

### MODERATE RISKS

#### Risk 6: "Integration hell — 5 products with different tech stacks"
**Probability:** MEDIUM
**Impact:** MEDIUM (delays full rollout)

**Mitigation:**
- Dead-simple HTTP POST = works from any stack
- Pinned first (validate approach on simplest product)
- One product per day (not all at once)

**Owner:** Integration phase (Week 2-4)

---

#### Risk 7: "Dashboard UI takes 6 weeks, not 1 week"
**Probability:** MEDIUM (design scope creep)
**Impact:** LOW (we have text summaries in meantime)

**Mitigation:**
- Phase 1 ships without UI (no dependency)
- Week 12 UI is "dead-simple HTML" (not pixel-perfect masterpiece)
- Steve's 3-second rule: If understanding takes >3 sec, design failed

**Owner:** UI phase gate (Week 12)

---

#### Risk 8: "We don't know what 'healthy' looks like"
**Probability:** MEDIUM (green/yellow/red thresholds arbitrary)
**Impact:** MEDIUM (false alarms or missed warnings)

**Mitigation:**
- Week 1-4: No color coding, just raw numbers
- Week 4: Set thresholds based on observed data
- Monthly threshold review (products evolve)

**Owner:** Metric definition (ongoing)

---

## VI. WHO WON WHAT (Decision Lineage)

### Steve Jobs Wins (5 decisions)

1. **Product name "Compass"** — Unanimous. Elon conceded Round 2: "It's actually good."
2. **Brand voice (brutal honesty)** — Unanimous. Elon: "Make them actionable. Conceded."
3. **Core philosophy (decision-making > analytics)** — Unanimous synthesis.
4. **Metrics focus (3 per product)** — Elon agreed: "Ruthless focus wins."
5. **UI must exist** — Phased compromise. Steve won principle, Elon won timing.

**Steve's Line in the Sand:**
- UI ships (eventually, not never)
- ONE screen, no customization
- Product named "Compass"

---

### Elon Musk Wins (5 decisions)

1. **Technical architecture (SQLite over PostHog)** — Steve conceded Round 2.
2. **V1 scope cuts** — Steve agreed to ruthless cuts (cohorts, alerts, predictions to V2+).
3. **Timeline (data in days, not weeks)** — Steve adjusted from "1 week with UI" to phased.
4. **Event philosophy (outcomes over sessions)** — Steve agreed.
5. **No premature optimization** — Phased compromise. Elon won timing, Steve won principle.

**Elon's Line in the Sand:**
- Ship data collection in 72 hours
- SQLite (no infrastructure complexity)
- Optimize for decision speed, not dashboard aesthetics

---

### Synthesis (Both Won)

1. **Phased rollout** — Text summary Week 1, UI Week 12
2. **Output format** — Even text summaries use Steve's voice (design matters at every layer)
3. **Flexibility vs rigidity** — SQLite = flexible backend, locked dashboard = rigid frontend
4. **Speed + clarity** — Elon's velocity, Steve's ruthless focus

**Mutual Oath:**
- No feature creep beyond locked V1 scope
- Week 4 decision deadline (if no decision made, we failed)
- Compass voice in all outputs (text or UI)

---

## VII. SUCCESS CRITERIA (How We Know It Works)

### Week 1
- ✅ SQLite database live with events flowing from Pinned
- ✅ First daily text summary delivered
- ✅ 20 events defined across all 5 products

### Week 4
- ✅ All 5 products integrated
- ✅ ONE data-driven decision made (kill/pivot/double-down on a product)
- ✅ Daily summaries consistently delivered AND READ

### Week 12
- ✅ Dashboard UI live (5 products × 3 metrics, <3 sec load)
- ✅ Daily habit formed (check Compass = morning routine)
- ✅ At least 3 major decisions attributed to Compass data

### Week 26 (6 months)
- ✅ Every product decision references Compass data
- ✅ V2 features prioritized based on actual usage gaps
- ✅ Migration to Postgres completed (if needed) or SQLite still thriving

---

## VIII. BUILD KICKOFF CHECKLIST

### Before Agent Session Starts:
- [ ] Confirm Week 1 scope (SQLite + Pinned integration + text summary)
- [ ] **Define 20 events** (4 per product) — **REQUIRES SETH INPUT**
- [ ] Choose existing server for SQLite deployment
- [ ] Set up daily cron job capability
- [ ] **Resolve Open Question #5** (event schema migration strategy)

### Agent Session Deliverables (Week 1):
- [ ] `compass.db` (SQLite schema with indexed timestamps)
- [ ] `ingest.php` (HTTP POST endpoint)
- [ ] `queries.php` (5 core metric queries: DAU, D1/D7/D30 retention, MRR, churn)
- [ ] `report.php` (text summary generator in Compass voice)
- [ ] `pinned/tracker.js` (first integration)
- [ ] `events.json` (schema definition with 20 events)
- [ ] `daily-summary.sh` (cron job)

### Week 1 Exit Criteria (How to validate):
- [ ] POST an event to endpoint → see it in SQLite
- [ ] Run `report.php` → get text summary in Compass voice
- [ ] Receive first daily email summary

---

## IX. THE COVENANT (What We Won't Violate)

### From Steve:
> "Simplicity is the ultimate sophistication. Every feature you add is a feature you have to maintain, explain, and support. Cut the features that don't serve the core promise: *Know your portfolio's health in 30 seconds.*"

### From Elon:
> "This PRD is 219 lines describing a problem that can be solved with 200 lines of code and a SQLite file. Everything else is procrastination masquerading as planning. Ship this in 3 days."

### The Synthesis (Phil Jackson):
> **"What we're building:** A decision-making tool that gives you the feeling of certainty.
> **Why it works:** Steve's insistence on clarity + Elon's insistence on speed = something you'll actually use.
> **Ship Week 1. Iterate Week 4. Perfect Week 12.**
> **The compass points north. Let's build it.**"

---

## X. FINAL WORD

**What it REALLY is:**
Truth machine. Tells you which product to kill before you waste another month.

**Feeling:**
Control. Relief from certainty, not anxiety from guessing.

**The one thing that must be perfect:**
30 seconds. Open. See which product is dying. Decide.

**Creative direction:**
Brutal clarity wins.

**Architecture soul:**
SQLite. Text summaries first. UI when data proves what matters.

**Voice:**
"Pinned is dying. 62% never returned. Kill it or pivot."
Not: "Retention metrics suggest suboptimal engagement patterns."

**The synthesis:**
Steve's ruthless focus + Elon's ruthless speed = tool you open every morning because knowing beats guessing.

---

*Blueprint locked and loaded. Ready for build.*

**— Phil Jackson, Zen Master**
**Great Minds Agency**
**2026-04-16**
