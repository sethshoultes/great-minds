# Compass — Build Blueprint
**Portfolio Analytics Foundation: Locked Decisions**

---

## Executive Summary

**Product Name:** Compass
**Core Purpose:** Decision-making tool disguised as analytics
**Emotional Hook:** Stop guessing. Start knowing.
**Build Philosophy:** Steve's clarity + Elon's velocity = Ship truth in days, not months

---

## I. LOCKED DECISIONS

### 1. Product Naming & Brand Voice
**Proposed by:** Steve Jobs
**Winner:** Steve (unanimous)
**Why:** "Compass" is a perfect metaphor — you're lost, it shows you direction. One word, memorable, clarifies purpose. Beats enterprise garbage like "Portfolio Analytics Dashboard."

**Brand Voice:**
- **Direct. Honest. Unsentimental.**
- No sugarcoating: "Pinned is dying. 62% of users never came back."
- Not celebration, not coddling — brutal truth that enables decisions
- Conversational but never casual. Precise but never robotic.
- Think: great coach who wants you to win

**Status:** LOCKED ✓

---

### 2. Core Product Philosophy
**Proposed by:** Steve Jobs (refined by Elon)
**Winner:** Synthesis
**Why:** Both agreed this is a decision-making product, not an analytics product

**Locked Principles:**
- Show DIRECTION, not data
- Three numbers per product (not 400 metrics)
- Ruthless clarity over comprehensive dashboards
- Optimize for "time to decision" not "time to data"
- The feeling of **knowing** = the product

**Status:** LOCKED ✓

---

### 3. Technical Architecture
**Proposed by:** Elon Musk
**Winner:** Elon (with Steve concession)
**Why:** "PostHog is infrastructure porn" — you're pre-PMF on all products, need velocity not complexity

**V1 Architecture:**
- **SQLite database** (not PostHog, not ClickHouse, not Postgres)
- One table: `events`
- Six columns: `product`, `event`, `user_hash`, `timestamp`, `properties_json`, `revenue_cents`
- Simple HTTP POST endpoint (~50 lines of code)
- Runs on existing server — **$0 infrastructure cost**

**Why SQLite wins:**
- Handles 100k writes/day single-threaded
- 10M events = 500MB storage (trivial)
- 4-hour migration to Postgres when needed (~1M events/day)
- Flexibility to change metrics without frontend work

**Status:** LOCKED ✓

---

### 4. The UI Debate — Phased Compromise
**Proposed by:** Steve (UI Week 1) vs Elon (UI Week 26)
**Winner:** Phased approach (synthesis)
**Why:** Steve's right that grep doesn't create habits. Elon's right that premature aesthetics delay data collection.

**PHASE 1 (Week 1):**
- SQLite + HTTP endpoint + event collection
- **Daily text summary** (not dashboard, not SQL dumps)
- Written in Steve's voice: "Pinned: 12 DAU (-40%). 7d retention: 8%. Diagnosis: Dead. Decision: Kill or pivot."
- Output: Email or simple text file

**PHASE 2 (Week 12):**
- **Dashboard UI** — but only after knowing what metrics matter
- Five columns (one per product)
- Three numbers each: DAU, 7-day retention, revenue per user
- Color-coded health: green (growing), yellow (stable), red (dying)
- Load time <3 seconds
- ONE screen, no customization

**Compromises:**
- Elon conceded: UI ships eventually (not grep forever)
- Steve conceded: Data collection before aesthetics
- Both agreed: The output format matters even in text form

**Status:** LOCKED ✓

---

### 5. Core Metrics — What Gets Measured
**Proposed by:** Steve (3 metrics) + Elon (outcomes over sessions)
**Winner:** Synthesis
**Why:** Both agreed on ruthless focus, disagreed on count vs. flexibility

**Per Product (V1):**
1. **Daily Active Users** (the truth)
2. **7-Day Retention** (the future)
3. **Revenue Per User** (the value)

**Event Philosophy:**
- Track outcomes, not activity
- "User generated post that got engagement" > "user spent 3 minutes on page"
- Server-side tracking for revenue
- Client-side for UX signals only

**Status:** LOCKED ✓

---

### 6. Timeline & Build Scope
**Proposed by:** Elon (3 days) vs Steve (1 week with UI)
**Winner:** Phased timeline
**Why:** Speed to first decision matters more than speed to first data dump

**Week 1 Goal:** Data flowing + first Compass reading
- Day 1: Define 20 critical events (4 per product)
- Day 2-3: SQLite backend + HTTP endpoint
- Day 4-7: Integrate 1 product (Pinned), write queries, deliver text summary

**Week 2-4 Goal:** Full integration + first data-driven decision
- Integrate remaining 4 products (1 per day)
- Daily text summaries
- Make ONE major decision (kill/pivot/double-down)

**Week 12 Goal:** Dashboard UI
- Only build once we know what to show
- Dead-simple HTML (not a design masterpiece on day 1)
- Steve's voice, Elon's speed

**Status:** LOCKED ✓

---

## II. MVP FEATURE SET (V1 — What Ships)

### ✅ IN SCOPE

**Backend:**
- SQLite database with `events` table
- HTTP POST endpoint for event ingestion
- Basic event schema (6 columns)
- Daily cron job for metric calculation

**Event Tracking:**
- 20 events total (4 per product)
- Focus on outcome events, not vanity metrics
- User hash for privacy (not PII)
- Revenue tracking in cents

**Metrics (Per Product):**
- Daily Active Users
- 7-Day Retention (D1, D7, D30 cohorts)
- Revenue Per User (MRR, churn rate)
- Manual error rate checks (not automated alerts)

**Output (Phase 1):**
- Daily text summary in Compass voice
- Delivered via email or text file
- Format: "Product: [metric] ([trend]). Diagnosis: [health]. Decision: [recommendation]"

**Integration:**
- Pinned (Week 1)
- Other 4 products (Week 2-4, manual integration)

---

### ❌ CUT FROM V1 (Moved to V2+)

**V2 Features:**
- Cohort analysis beyond D1/D7/D30
- Anomaly detection alerts (you have 10 users, no anomalies exist)
- Cross-product user tracking
- Dashboard UI (comes Week 12)
- Customizable views/widgets
- Real-time updates (hourly refresh sufficient)

**V3+ Features:**
- Resurrection tracking
- Great Minds outcome prediction model
- Weekly digest emails (just query DB manually)
- Revenue per token analysis
- Advanced retention cohorts
- AI-generated insights (GPT-4 fortune-telling)

**NEVER Features:**
- 47 chart types (line + bar only)
- Customizable dashboards ("we decide what matters")
- User settings (font size, themes)
- Minute-by-minute real-time obsession
- PostHog/ClickHouse/infrastructure complexity

---

## III. FILE STRUCTURE (What Gets Built)

### Phase 1: Backend (Week 1)

```
compass/
├── db/
│   └── compass.db                 # SQLite database
├── src/
│   ├── ingest.php                 # HTTP POST endpoint (~50 lines)
│   ├── queries.php                # 5 core SQL queries
│   └── report.php                 # Text summary generator
├── config/
│   └── events.json                # Event schema (20 events defined)
├── integrations/
│   └── pinned/
│       └── tracker.js             # Client-side event tracker
└── cron/
    └── daily-summary.sh           # Runs queries + sends summary
```

### Phase 2: Integrations (Week 2-4)

```
integrations/
├── pinned/
│   └── tracker.js
├── dash/
│   └── tracker.js
├── localgenius/
│   └── tracker.js
├── shipyard/
│   └── tracker.js
└── great-minds/
    └── tracker.js
```

### Phase 3: Dashboard UI (Week 12)

```
ui/
├── index.html                     # Single-page dashboard
├── styles.css                     # Minimal styling (CSS variables for potential dark mode)
├── app.js                         # Fetch + render metrics
└── api/
    └── metrics.php                # JSON endpoint for UI
```

---

## IV. OPEN QUESTIONS (Needs Resolution)

### 1. Dark Mode
**Elon's Position:** "Takes 20 minutes with CSS variables. Users shouldn't suffer for designer ego."
**Steve's Position:** "No user settings. We designed it. It's right."
**Resolution Needed:** CSS variables approach = 20 min work, preserves Steve's "no customization" if it's auto-detected
**Recommendation:** Auto dark mode (respects OS setting), no toggle. Satisfies both.

---

### 2. Refresh Frequency
**Elon's Position:** "Real-time doesn't mean obsessing. When debugging, you need TODAY's data."
**Steve's Position:** "Hourly refresh is enough. Minute-by-minute metrics = lose your mind."
**Resolution Needed:** Compromise on "on-demand refresh" button?
**Recommendation:** Hourly auto-refresh + manual refresh button. Default calm, option for urgency.

---

### 3. Dashboard Customization
**Elon's Position:** "Building for ONE user (Seth). He might need different metrics Monday vs Tuesday."
**Steve's Position:** "No customization forces clarity. If it's not on the only screen, it's not important."
**Resolution Needed:** Can we have "ONE screen with all products" + "product detail view"?
**Recommendation:** Main screen = Steve's vision (5 products, 3 metrics). Click product = detail view with expanded metrics. No drag-drop widgets.

---

### 4. AI Insights
**Steve's Position:** "GPT-4 will tell you 'seasonal factors' — that's fortune-telling, not analytics."
**Elon's Position:** "Half-right. But 'retention dropped 30% after last update' IS a valuable causal insight."
**Resolution Needed:** What's the line between pattern recognition and bullshit?
**Recommendation:** V1 = no AI. V2 = test simple correlations ("Metric X changed after Event Y"). V3 = LLM summaries if V2 proves valuable.

---

### 5. Event Schema Flexibility
**Technical Question:** How do we handle schema changes without breaking historical data?
**Options:**
- A) JSON properties field (flexible but harder to query)
- B) Strict schema with migrations (rigid but performant)
- C) Hybrid: Core columns + JSON overflow

**Recommendation:** Option C — locked columns for metrics queries, JSON for ad-hoc properties

---

## V. RISK REGISTER (What Could Go Wrong)

### CRITICAL RISKS

#### 1. **"We build it and never use it"**
**Probability:** HIGH (most internal tools die this way)
**Impact:** CRITICAL (wasted effort, back to guessing)
**Mitigation:**
- Steve's forcing function: Daily summary EMAILED (not buried in dashboard)
- Habit formation: 30-second check becomes morning routine
- Accountability: Track "decisions made using Compass" as its own metric

**Owner:** Process design (make checking it frictionless)

---

#### 2. **"We measure the wrong things"**
**Probability:** MEDIUM (hard to know what matters pre-PMF)
**Impact:** HIGH (data exists but doesn't inform decisions)
**Mitigation:**
- Week 1: Define events collaboratively (not in isolation)
- Week 4 review: "Did we make a decision? If not, why not?"
- SQLite flexibility: Change metrics in 5 minutes, not 5 days

**Owner:** Event definition phase (Day 1)

---

#### 3. **"Premature optimization — We build Mixpanel"**
**Probability:** MEDIUM (Steve's design ambition + Elon's tech enthusiasm)
**Impact:** HIGH (6 weeks later, still no data)
**Mitigation:**
- Locked V1 scope (above) — anything not listed is banned
- Week 1 hard deadline: If data isn't flowing by Day 7, we failed
- Elon's forcing function: "Can I query this with SQL?" If no, too complex.

**Owner:** Scope enforcement (Phil Jackson / project lead)

---

#### 4. **"Privacy/compliance issues"**
**Probability:** LOW (internal tool, hashed users)
**Impact:** MEDIUM (legal hassle if we track PII)
**Mitigation:**
- User hash (not email/name) in V1
- No IP logging
- No cross-product identity until we have legal review
- Server-side tracking (not third-party pixels)

**Owner:** Implementation (ensure hash-only from Day 1)

---

#### 5. **"SQLite hits limits before we're ready to migrate"**
**Probability:** LOW (10k events/day = years of runway)
**Impact:** MEDIUM (dashboard slow, queries lag)
**Mitigation:**
- Indexed timestamps from Day 1
- Monitor query performance weekly
- Pre-written Postgres migration script (ready when needed)
- ClickHouse research started at 500k events (not 2M)

**Owner:** Technical architecture (Elon's 4-hour migration claim needs testing)

---

### MODERATE RISKS

#### 6. **"Integration hell — 5 products with different tech stacks"**
**Probability:** MEDIUM
**Impact:** MEDIUM (delays full rollout)
**Mitigation:**
- Dead-simple HTTP POST = works from any stack
- Pinned first (validate approach on simplest product)
- One product per day (not all at once)

**Owner:** Integration phase (Week 2-4)

---

#### 7. **"Dashboard UI takes 6 weeks, not 1 week"**
**Probability:** MEDIUM (design scope creep)
**Impact:** LOW (we have text summaries in meantime)
**Mitigation:**
- Phase 1 ships without UI (no dependency)
- Week 12 UI is "dead-simple HTML" (not pixel-perfect masterpiece)
- Steve's 3-second rule: If understanding takes >3 sec, design failed

**Owner:** UI phase gate (Week 12)

---

#### 8. **"We don't know what 'healthy' looks like"**
**Probability:** MEDIUM (green/yellow/red thresholds arbitrary)
**Impact:** MEDIUM (false alarms or missed warnings)
**Mitigation:**
- Week 1-4: No color coding, just raw numbers
- Week 4: Set thresholds based on observed data
- Monthly threshold review (products evolve)

**Owner:** Metric definition (ongoing)

---

## VI. SUCCESS CRITERIA

### Week 1
✅ SQLite database live with events flowing from Pinned
✅ First daily text summary delivered ("Pinned: X DAU, Y retention, Z diagnosis")
✅ 20 events defined across all 5 products

### Week 4
✅ All 5 products integrated
✅ ONE data-driven decision made (kill/pivot/double-down on a product)
✅ Daily summaries consistently delivered and READ

### Week 12
✅ Dashboard UI live (5 products, 3 metrics each, <3 sec load)
✅ Daily habit formed (check Compass = morning routine)
✅ At least 3 major decisions attributed to Compass data

### Week 26 (6 months)
✅ Every product decision references Compass data
✅ V2 features prioritized based on actual usage gaps
✅ Migration to Postgres completed (if needed) or SQLite still thriving

---

## VII. WHO PROPOSED WHAT (Decision Lineage)

### Steve Jobs Wins
1. **Product name:** "Compass" (unanimous)
2. **Brand voice:** Brutal honesty, no sugarcoating (unanimous)
3. **Core philosophy:** Decision-making > analytics (unanimous)
4. **Metrics focus:** 3 per product, ruthless clarity (Elon agreed)
5. **UI must exist:** Even if simple, not grep forever (phased compromise)

### Elon Musk Wins
1. **Technical architecture:** SQLite over PostHog (Steve conceded)
2. **V1 scope:** Cut cohorts/alerts/predictions to V2+ (Steve agreed)
3. **Timeline:** Data collection in days, not weeks (Steve adjusted from "1 week with UI" to "phased")
4. **Event philosophy:** Outcomes over sessions (Steve agreed)
5. **No premature optimization:** Build dashboard after knowing what to show (phased compromise)

### Synthesis (Both Won)
1. **Phased rollout:** Text summary Week 1, UI Week 12
2. **Output format:** Even text summaries use Steve's voice (design matters at every layer)
3. **Flexibility vs rigidity:** SQLite = flexible backend, locked dashboard = rigid frontend
4. **Speed + clarity:** Elon's velocity, Steve's ruthless focus

---

## VIII. THE COVENANT (Non-Negotiables from Both)

### Steve's Line in the Sand
1. UI ships (eventually, not never)
2. ONE screen, no customization
3. Product named "Compass"

### Elon's Line in the Sand
1. Ship data collection in 72 hours
2. SQLite (no infrastructure complexity)
3. Optimize for decision speed, not dashboard aesthetics

### Mutual Oath
- No feature creep beyond locked V1 scope
- Week 4 decision deadline (if no decision made, we failed)
- Compass voice in all outputs (text or UI)

---

## IX. WHAT STILL NEEDS RESOLUTION (Before Build Starts)

1. **Dark mode approach** (auto-detect vs none vs toggle)
2. **Refresh frequency** (hourly auto + manual button?)
3. **Dashboard detail views** (one screen + drill-downs?)
4. **AI insights line** (V2 correlations or never?)
5. **Event schema migration strategy** (hybrid approach?)

**Recommendation:** These are Week 2-4 questions. Don't block Week 1 build.

---

## X. BUILD KICKOFF CHECKLIST

### Before Agent Session Starts:
- [ ] Confirm Week 1 scope (SQLite + Pinned integration + text summary)
- [ ] Define 20 events (4 per product) — requires Seth input
- [ ] Choose existing server for SQLite deployment
- [ ] Set up daily cron job capability

### Agent Session Deliverables:
- [ ] `compass.db` (SQLite schema)
- [ ] `ingest.php` (HTTP POST endpoint)
- [ ] `queries.php` (5 core metric queries)
- [ ] `report.php` (text summary generator)
- [ ] `pinned/tracker.js` (first integration)
- [ ] `events.json` (schema definition)
- [ ] `daily-summary.sh` (cron job)

### Week 1 Exit Criteria:
- [ ] POST an event to endpoint, see it in SQLite
- [ ] Run `report.php`, get text summary in Compass voice
- [ ] Receive first daily email summary

---

## XI. FINAL WORD (The Zen Master's Synthesis)

**What we're building:** A decision-making tool that gives you the feeling of certainty.

**Why it works:** Steve's insistence on clarity + Elon's insistence on speed = something you'll actually use.

**The triangle offense:** Backend (Elon), Frontend (Steve), Adoption (Daily summaries = habit formation).

**Ship Week 1.** Iterate Week 4. Perfect Week 12.

**The compass points north. Let's build it.**

---

*Locked by: Phil Jackson, Zen Master*
*Date: 2024*
*Status: READY FOR BUILD*
