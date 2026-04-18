# Compass — Portfolio Analytics Foundation
## Complete Build Specification

**Project**: portfolio-analytics-foundation
**Product Name**: Compass
**Phase**: Week 1 (Foundation)
**Status**: Ready for implementation
**Generated**: 2026-04-16

---

## I. Goals (From PRD)

### Primary Goal
Build foundational analytics infrastructure that enables data-driven decisions, cross-product learning, and the compounding advantages that separate portfolios from product collections.

### Core Purpose
**Compass is a truth machine.** It tells you which product to kill before you waste another month. It provides:
- Relief from certainty (not anxiety from guessing)
- Brutal honesty in daily summaries
- The ability to answer: "Which product is growing fastest?" "What's our retention?" "What's our LTV?"

### Success Metrics
| Metric | Target |
|--------|--------|
| Time to first insight | <1 week from implementation |
| Dashboard load time (Phase 3) | <2 seconds |
| Data freshness | <1 hour lag |
| Week 1 Exit | SQLite live + Pinned events flowing + summary delivered |
| Week 4 Exit | ONE data-driven decision made (kill/pivot/double-down) |

### Strategic Success
- Can make data-driven resource allocation decisions
- Can identify underperforming products early
- Can identify cross-product opportunities
- Daily habit formed (check Compass = morning routine)

---

## II. Implementation Approach (From Plan + Decisions)

### Architecture: SQLite Over PostHog

**Decision**: Elon's SQLite approach won over PostHog complexity (decisions.md line 40).

**Rationale**:
- SQLite handles 100k writes/day single-threaded
- $0 infrastructure cost
- 4-hour migration to Postgres when actually needed
- No infrastructure complexity

**Structure**:
```
SQLite database
├── One table: events
├── Six columns: product, event, user_hash, timestamp, properties_json, revenue_cents
├── Simple HTTP POST endpoint (~50 lines PHP)
└── Runs on existing server — $0 cost
```

### Phase 1 Output: Text Summaries (Not Dashboard UI)

**Decision**: Phased rollout — text summaries Week 1, dashboard UI Week 12 (decisions.md line 59).

**Rationale**:
- "Design without data is decoration" — need to see what metrics matter first
- Text summaries in Compass voice delivered via email or file
- UI built after data proves what to show

**Voice**: Brutal honesty. No jargon.
- ✅ "Pinned is dying. 62% never returned. Kill it or pivot."
- ❌ "Retention metrics suggest suboptimal engagement patterns."

### Core Metrics: The Three Numbers That Matter

**Per Product**:
1. **Daily Active Users (DAU)** — the truth
2. **7-Day Retention (D1/D7/D30)** — the future
3. **Revenue Per User** — the value

**Event Philosophy**: Track outcomes, not activity.
- "User generated post that got engagement" > "user spent 3 minutes on page"
- Server-side tracking for revenue
- Client-side for UX signals only

### V1 Scope: Ruthless Cuts

**What Ships**:
- SQLite + HTTP endpoint
- 20 events (4 per product)
- 3 metrics per product
- Daily text summaries
- Pinned integration (Week 1 only)

**Cut to V2+**:
- ❌ Cohort analysis (beyond D1/D7/D30)
- ❌ Anomaly detection alerts
- ❌ Weekly digest emails
- ❌ Cross-product user tracking
- ❌ Time range selectors (30 days only)
- ❌ Dashboard UI (Week 12)

### Privacy-First Approach

**Requirements**:
- No PII collected (no emails, names, IP addresses)
- SHA-256 hashed user identifiers only
- User opt-out mechanism
- 90-day data retention policy (configurable)
- GDPR Article 6(1)(f) legitimate interest basis

---

## III. Verification Criteria

### Database Schema Verification
**Task**: Validate compass.db creation and structure

**Tests**:
1. Query schema: `sqlite3 compass.db ".schema events"` shows 6 columns
2. Check WAL mode: `sqlite3 compass.db "PRAGMA journal_mode;"` returns "wal"
3. Performance: Insert 1000 events in <1 second
4. Index verification: `sqlite3 compass.db ".indices events"` shows timestamp index

**Pass Criteria**: All 4 checks succeed

---

### Event Definition Verification
**Task**: Validate events.json structure and privacy compliance

**Tests**:
1. JSON validates (no syntax errors)
2. Exactly 20 events defined (4 per product × 5 products)
3. No PII in schema (no email, name, IP fields)
4. All events have: product, event, description, outcome_focused flag
5. User identifier field is "user_hash" (not user_id, email, etc.)

**Pass Criteria**: All 5 checks succeed

---

### HTTP Endpoint Verification
**Task**: Validate ingest.php accepts and stores events

**Tests**:
1. POST valid event → returns 200 OK + event appears in SQLite
2. POST missing required field → returns 400 Bad Request
3. POST with email/PII → returns 400 Bad Request (rejected)
4. POST with invalid product → returns 400 Bad Request
5. Database integrity: Event stored matches POST payload

**Pass Criteria**: All 5 checks succeed

**Test Command**:
```bash
curl -X POST http://localhost/compass/src/ingest.php \
  -H "Content-Type: application/json" \
  -d '{
    "product": "pinned",
    "event": "note_created",
    "user_hash": "a1b2c3d4...",
    "timestamp": "2026-04-16T10:00:00Z",
    "properties": {"note_id": "123"},
    "revenue_cents": 0
  }'
```

---

### DAU Metric Verification
**Task**: Validate compass_calculate_dau() query accuracy

**Tests**:
1. Insert 10 events from 5 unique users → DAU returns 5
2. Insert 10 events from same user → DAU returns 1
3. Query executes in <1 second
4. 30-day window calculation correct

**Pass Criteria**: All 4 checks succeed

---

### Retention Metric Verification
**Task**: Validate compass_calculate_retention_curves() accuracy

**Tests**:
1. Create 10-user cohort (Day 0)
2. 7 users return on Day 1 → D1 retention = 70%
3. 5 users return on Day 7 → D7 retention = 50%
4. Query executes in <2 seconds
5. Cohort-based calculation (not user-based)

**Pass Criteria**: All 5 checks succeed

---

### Revenue Per User Verification
**Task**: Validate compass_calculate_revenue_per_user() accuracy

**Tests**:
1. Insert $100 total revenue across 5 users → RPU = $20/user
2. Zero revenue → RPU = $0 (no division errors)
3. Query executes in <1 second
4. Revenue stored in cents (1234 = $12.34)

**Pass Criteria**: All 4 checks succeed

---

### Text Summary Verification
**Task**: Validate report.php output in Compass voice

**Tests**:
1. Output format matches: "Product: [metric] ([trend]). Diagnosis: [health]. Decision: [action]"
2. Voice guidelines met: direct, confident, actionable
3. No hedging language ("suggests", "might", "potentially")
4. No jargon or corporate-speak
5. Every summary ends with decision/recommendation

**Pass Criteria**: All 5 checks succeed

**Example Output**:
```
Pinned: 12 DAU (-40%). 7d retention: 8%. Diagnosis: Dead. Decision: Kill or pivot.
Dash: 47 DAU (+12%). 7d retention: 34%. Diagnosis: Healthy growth. Decision: Double down on onboarding.
```

---

### Pinned Integration Verification
**Task**: Validate tracker.js event flow from Pinned

**Tests**:
1. Create note in Pinned → "note_created" event appears in DB
2. Acknowledge note → "note_acknowledged" event appears in DB
3. Send mention → "mention_sent" event appears in DB
4. Daily active session tracked
5. User hash is SHA-256 (64 hex characters)
6. <5ms overhead (negligible performance impact)
7. Opt-out flag respected (no events when disabled)
8. Async POST (non-blocking)

**Pass Criteria**: All 8 checks succeed

**CRITICAL**: Must research actual Pinned API first (plan line 127) — no hallucinated APIs.

---

### Privacy Validation
**Task**: Comprehensive privacy compliance audit

**Tests**:
1. Grep for email patterns: `grep -r "email\|@" compass/` returns zero matches in data
2. Grep for PII: `grep -r "name\|address\|phone" compass/` returns zero data matches
3. Database scan: `sqlite3 compass.db "SELECT * FROM events LIMIT 100"` shows only hashed user_hash
4. SHA-256 verification: All user_hash values are 64 hex characters
5. Opt-out mechanism: Tracker respects opt-out flag
6. 90-day retention: Query to delete events older than 90 days works

**Pass Criteria**: All 6 checks succeed

---

### Performance Test (100k Events/Day)
**Task**: Validate SQLite can handle production load

**Tests**:
1. Insert 100,000 events via load test script
2. DAU query completes in <1 second
3. Retention query completes in <2 seconds
4. Revenue query completes in <1 second
5. Database file size <100MB after 100k events
6. WAL mode handles concurrent reads during writes

**Pass Criteria**: All 6 checks succeed

**Validates**: Elon's SQLite claim (decisions.md line 40)

---

### End-to-End Integration Test
**Task**: Validate complete pipeline

**Tests**:
1. POST event → appears in SQLite → included in metrics → shown in summary
2. Total latency <5 seconds
3. No data loss in pipeline
4. Error handling at each stage
5. Log files show successful flow

**Pass Criteria**: All 5 checks succeed

---

### Week 1 Exit Criteria Validation
**Task**: Confirm all Phase 1 deliverables complete

**Checklist**:
- [ ] SQLite database live with events flowing from Pinned
- [ ] First daily text summary delivered
- [ ] 20 events defined across all 5 products
- [ ] Privacy validation passed (no PII)
- [ ] Performance validation passed (100k events/day)
- [ ] E2E test passed (pipeline works end-to-end)
- [ ] Git tag created: `compass-week-1-ship`
- [ ] Retrospective written: `WEEK-1-RETROSPECTIVE.md`

**Pass Criteria**: All 8 items checked ✅

---

## IV. Files Created or Modified

### Created Files

#### Database
```
compass/db/compass.db
```
- SQLite database with events table (6 columns)
- WAL mode enabled
- Timestamp index for performance
- Auto-vacuum enabled

#### Backend Infrastructure
```
compass/src/ingest.php
compass/src/queries.php
compass/src/report.php
```
- `ingest.php`: HTTP POST endpoint (~50 lines), validates and stores events
- `queries.php`: 5 core metric functions (DAU, D1/D7/D30 retention, RPU, MRR, churn)
- `report.php`: Text summary generator in Compass voice

#### Configuration
```
compass/config/events.json
```
- 20 event definitions (4 per product)
- Schema: product, event, description, outcome_focused, properties_schema
- Privacy-compliant (no PII fields)

#### Integration
```
compass/integrations/pinned/tracker.js
```
- Client-side event tracker for Pinned
- 4 events: note_created, note_acknowledged, mention_sent, daily_active_session
- SHA-256 user hashing
- Async POST to ingest.php
- Opt-out mechanism
- <5ms overhead

#### Automation
```
compass/cron/daily-summary.sh
```
- Runs report.php daily at 9 AM
- Emails summary or writes to file
- Logs execution
- Error handling

#### Initialization
```
compass/scripts/init-db.sh
```
- Idempotent database initialization
- Creates schema if not exists
- Enables WAL mode
- Creates indexes
- Environment-driven paths (no hardcoded /Users/)
- Integrity checks

#### Environment Template
```
compass/.env.tracking.template
```
- COMPASS_DB_PATH configuration
- PINNED_REPO path
- DASH_REPO path
- LOCALGENIUS_REPO path
- SHIPYARD_REPO path
- GREAT_MINDS_REPO path
- Email delivery settings

#### Documentation
```
compass/README.md
compass/WEEK-1-RETROSPECTIVE.md
```
- Setup instructions
- Architecture overview
- API documentation
- Retrospective (created at end of Week 1)

### Modified Files

**None** — This is a greenfield build. All files are new.

### File Count Summary
- **Created**: 12 files + 1 directory (deliverables/tests/)
- **Modified**: 0 files
- **Tests**: Multiple test scripts in deliverables/tests/

---

## V. Dependencies

### Pre-Build Requirements
1. **Event Definition Approval** — 20 events must be approved by Seth (decisions.md line 541)
2. **Server Access** — Deployment target for compass/ directory
3. **PHP Environment** — PHP 7.4+ with SQLite extension
4. **Cron Access** — Ability to schedule daily job
5. **Email Config** — SMTP settings or fallback to file output

### External Product Access
1. **Pinned Repository** — Must research actual API (plan line 127)
2. **Environment Variables** — EXTERNAL_REPOS config (plan line 191)

### Migration Path
- **Postgres Migration Script** — Pre-written for when SQLite hits limits
- **Timeline**: Ready when needed (Elon claims 4-hour migration)

---

## VI. Risk Mitigation

### HIGH RISK — Addressed

#### Risk 1: Database Concurrency
- **Mitigation**: WAL mode + performance test validates 100k/day
- **Escalation**: Pre-written Postgres migration if SQLite fails

#### Risk 2: API Hallucination
- **Mitigation**: Mandatory step in Pinned integration — research actual codebase FIRST
- **Verification**: QA checks for banned patterns (BANNED-PATTERNS.md)

#### Risk 3: Cross-Product Data Consistency
- **Mitigation**: Async events include send_time + receive_time
- **Dashboard**: Shows "as of {timestamp}" for transparency

#### Risk 4: Missing Environment Config
- **Mitigation**: .env.tracking.template created with all paths
- **Verification**: Init script requires environment variables

### MEDIUM RISK — Monitored

#### Risk 5: Integration Hell
- **Mitigation**: Dead-simple HTTP POST works from any stack
- **Approach**: Pinned first (validate on simplest product), then 1 per day

#### Risk 6: Privacy Compliance
- **Mitigation**: Comprehensive privacy validation (task 11) gates ship
- **Audit**: No PII in schema, ingestion, or database

#### Risk 7: We Build It and Never Use It
- **Mitigation**: Daily summary EMAILED (not buried in dashboard)
- **Metric**: Track "decisions made using Compass" as success metric

---

## VII. Next Steps

### Immediate Actions
1. **Get Seth approval on 20 events** — Blocker per decisions.md line 541
2. **Execute Wave 1** (Parallel):
   - Task 1: Create SQLite database schema
   - Task 2: Define 20 critical events (pending approval)
   - Task 3: Database initialization script
3. **Execute Wave 2** (Parallel, depends on Wave 1):
   - Task 4: HTTP POST ingestion endpoint
   - Task 5: DAU metric query
   - Task 6: 7-day retention query
   - Task 7: Revenue per user query
4. **Execute Wave 3** (Sequential, depends on Wave 2):
   - Task 8: Daily text summary generator
   - Task 9: Pinned event tracker (research API first!)
   - Task 10: Daily cron job
5. **Execute Wave 4** (Sequential, depends on Wave 3):
   - Task 11: Privacy validation
   - Task 12: Performance test (100k events/day)
   - Task 13: End-to-end integration test
   - Task 14: Week 1 exit criteria validation

### Week 1 Timeline
- **Day 1**: Wave 1 (foundation)
- **Days 2-3**: Wave 2 (backend infrastructure)
- **Days 4-6**: Wave 3 (integration & output)
- **Day 7**: Wave 4 (validation & ship)

### Week 2-4 Scope (Next Phase)
- Integrate remaining 4 products (Dash, LocalGenius, Shipyard, Great Minds)
- ONE data-driven decision made
- Daily summaries consistently delivered AND READ

### Week 12 Scope (Later Phase)
- Dashboard UI (after data proves what to show)
- ONE screen, no customization
- 5 products × 3 metrics = brutal clarity
- Load time <3 seconds

---

## VIII. Quality Gates

### Code Quality
- No hardcoded paths (use environment variables per BANNED-PATTERNS.md line 33)
- No PII in code or data
- No secrets in files (per BANNED-PATTERNS.md line 47)
- SHA-256 hashing for user identifiers
- Error handling at every layer

### Voice Quality
- Compass voice in all outputs (brutal honesty, no jargon)
- Direct, confident, actionable
- Example: "Pinned is dying. Kill it or pivot." NOT "Retention metrics suboptimal."

### Performance Quality
- DAU query <1 second
- Retention query <2 seconds
- Revenue query <1 second
- Event ingestion <5ms overhead
- Database handles 100k events/day

### Privacy Quality
- No PII collected or stored
- SHA-256 hashed identifiers only
- User opt-out mechanism
- 90-day retention policy
- GDPR compliant

---

## IX. Success Definition

### Week 1 Success
**The North Star**: SQLite live + Pinned events flowing + first daily summary delivered

**Evidence**:
1. Can POST event → see it in database
2. Can run report.php → get Compass voice summary
3. Can receive daily email with metrics
4. Privacy scan passes (no PII)
5. Performance test passes (100k events/day)

### Week 4 Success
**The North Star**: ONE data-driven decision made

**Evidence**:
1. All 5 products integrated
2. Daily summaries consistently delivered
3. Decision documented: "Based on Compass data showing X, we decided to Y"

### Week 12 Success
**The North Star**: Daily habit formed (check Compass = morning routine)

**Evidence**:
1. Dashboard UI live (<3 sec load)
2. 3+ major decisions attributed to Compass data
3. Morning routine established

### 6-Month Success
**The North Star**: Every product decision references Compass data

**Evidence**:
1. No resource allocation decisions made without consulting Compass
2. V2 features prioritized based on usage gaps
3. Migration to Postgres (if needed) or SQLite still thriving

---

**Specification Status**: ✅ COMPLETE
**Ready for Implementation**: YES
**Blockers**: Seth approval on 20 events (decisions.md line 541)
**Estimated Effort**: 7 days (Week 1 timeline)
**Critical Path**: Wave 1 → Wave 2 → Wave 3 → Wave 4
