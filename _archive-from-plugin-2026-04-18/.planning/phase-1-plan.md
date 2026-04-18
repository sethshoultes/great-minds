# Phase 1 Plan — Compass Portfolio Analytics Foundation (Week 1)

**Generated**: 2026-04-16  
**Requirements**: prds/portfolio-analytics-foundation.md + rounds/portfolio-analytics-foundation/decisions.md  
**Total Tasks**: 14  
**Waves**: 4  
**Project Slug**: portfolio-analytics-foundation

---

## Executive Summary

**Product**: Compass — Truth machine that tells you which product to kill before you waste another month.

**Phase 1 Scope** (Week 1):
- SQLite database with 6-column event schema  
- HTTP POST endpoint for event ingestion (~50 lines PHP)  
- 20 events defined (4 per product: Pinned, Dash, LocalGenius, Shipyard, Great Minds)  
- 3 core metrics per product (DAU, 7-day retention, revenue/user)  
- Daily text summary generator (Compass voice: brutal honesty)  
- Pinned integration (Week 1 only; remaining 4 products in Week 2-4)  
- Daily cron job for summary delivery

**Excluded from Phase 1**:
- ❌ Dashboard UI (Week 12)  
- ❌ Cohort analysis beyond D1/D7/D30  
- ❌ Anomaly detection, AI insights, alerts  
- ❌ Cross-product user tracking  
- ❌ Revenue Per Token analysis (V2+)

**Research Completed**: 3 parallel agents (Codebase Scout a7c8979, Requirements Analyst a89d8ff, Risk Scanner a4f5ce5)

---

## Requirements Traceability

| Requirement | Task(s) | Wave | Priority |
|-------------|---------|------|----------|
| REQ-001: SQLite schema | task-1 | 1 | CRITICAL |
| REQ-003 + REQ-010: Event definitions | task-2 | 1 | CRITICAL |
| REQ-011: Init script | task-3 | 1 | HIGH |
| REQ-002: HTTP endpoint | task-4 | 2 | CRITICAL |
| REQ-005-007: Metric queries | task-5,6,7 | 2 | CRITICAL |
| REQ-008: Summary generator | task-8 | 3 | CRITICAL |
| REQ-004: Pinned tracker | task-9 | 3 | CRITICAL |
| REQ-009: Cron job | task-10 | 3 | CRITICAL |
| REQ-012-014: Validation | task-11,12,13 | 4 | CRITICAL |
| REQ-019: Exit criteria | task-14 | 4 | CRITICAL |

---

## Wave Execution Order

### Wave 1 (Parallel - Foundation)

Tasks with NO dependencies — establish data model and event definitions.

**Task 1: Create SQLite Database Schema**
- Create compass.db with 6-column events table
- Indexed timestamps for 100k events/day throughput
- WAL mode for concurrent reads
- Reference: memory-store/src/store.ts, daemon/src/token-ledger.ts
- Verification: Query schema, check WAL mode, insert 1000 events <1 sec

**Task 2: Define 20 Critical Events**
- Create config/events.json with 4 events per product
- Outcome-focused (not vanity metrics)
- Privacy: SHA-256 hashed user_hash only
- **REQUIRES SETH APPROVAL** per decisions.md line 541
- Verification: JSON validates, 20 events total, no PII

**Task 3: Database Initialization Script**
- compass/scripts/init-db.sh (idempotent)
- Environment-driven paths (no hardcoded /Users/)
- Schema validation, integrity checks
- Verification: Run twice safely, COMPASS_DB_PATH override works

---

### Wave 2 (Parallel - Backend Infrastructure)

Depends on Wave 1 (database + schema exist).

**Task 4: HTTP POST Ingestion Endpoint**
- compass/src/ingest.php (~50 lines)
- Validates product, event, hashed user_hash, timestamp
- Rejects PII (email, plain text IDs)
- Returns 200 OK / 400 Bad Request / 500 errors
- Verification: curl POST event → appears in SQLite

**Task 5: DAU Metric Query**
- compass/src/queries.php: compass_calculate_dau()
- COUNT(DISTINCT user_hash) per day, 30-day window
- <1 second execution
- Verification: Insert 10 events, 5 users → DAU=5

**Task 6: 7-Day Retention Query**
- compass_calculate_retention_curves(): D1/D7/D30
- Cohort-based: % returned N days after first event
- <2 seconds execution
- Verification: 10-user cohort, 7 return D1 → 70% retention

**Task 7: Revenue Per User Query**
- compass_calculate_revenue_per_user()
- SUM(revenue_cents) / DAU
- <1 second execution
- Verification: $100 total / 5 users → $20/user

---

### Wave 3 (Sequential - Integration & Output)

Depends on Wave 2 (backend infrastructure complete).

**Task 8: Daily Text Summary Generator**
- compass/src/report.php in Compass voice
- Format: "Product: DAU (trend). Retention: X%. Revenue: $Y. Diagnosis: [health]. Decision: [action]"
- Voice: brutal honesty, no jargon
- Example: "Pinned: 12 DAU (-40%). Diagnosis: Dead. Decision: Kill or pivot."
- Verification: Output matches voice guidelines, no hedging

**Task 9: Pinned Event Tracker**
- compass/integrations/pinned/tracker.js
- 4 events: note_created, note_acknowledged, mention_sent, daily_active_session
- SHA-256 user hashing, async POST
- <5ms overhead, opt-out flag
- **CRITICAL**: Research actual Pinned API first (LEARNINGS.md §1)
- Verification: Create note → event in DB, privacy scan passes

**Task 10: Daily Cron Job**
- compass/cron/daily-summary.sh
- Runs report.php, emails summary (or fallback to file)
- 9 AM daily, logs execution
- Verification: Manual run → email received

---

### Wave 4 (Sequential - Validation & Ship)

Depends on Wave 3 (complete pipeline).

**Task 11: Privacy Validation**
- No PII in schema, ingestion, or database
- SHA-256 hashing verified (64 hex chars)
- Opt-out mechanism tested
- 90-day data retention query
- Verification: Grep for email/@/PII returns zero, database scan passes

**Task 12: Performance Test (100k Events/Day)**
- Load test: Insert 100k events
- Benchmark: DAU <1 sec, retention <2 sec, revenue <1 sec
- Database file <100MB
- Verification: Validates Elon's SQLite claim (decisions.md line 40)

**Task 13: End-to-End Integration Test**
- POST event → SQLite → metrics → summary
- <5 seconds total latency
- Verification: Event flows through entire pipeline

**Task 14: Week 1 Exit Criteria Validation**
- Checklist: SQLite live + Pinned events flowing + summary delivered + 20 events defined
- Git tag: compass-week-1-ship
- Retrospective: WEEK-1-RETROSPECTIVE.md
- Verification: All items ✅, tag exists, ready for Week 2-4

---

## Risk Notes (From Risk Scanner Agent a4f5ce5)

### HIGH RISK - REQUIRE IMMEDIATE MITIGATION

1. **Database Concurrency** (Risk §1)
   - SQLite write locks with 5 concurrent products
   - Mitigation: Task-12 validates 100k/day; escalate to PostgreSQL if fails
   - Owner: Builder (task-4, task-12)

2. **API Hallucination** (Risk §2)
   - Agents inventing non-existent Pinned/Dash/LocalGenius APIs
   - Mitigation: Task-9 step 1 mandates researching actual codebase FIRST
   - Owner: Builder (task-9) + QA validation

3. **Cross-Product Data Consistency** (Risk §3)
   - Async events may show phantom churn
   - Mitigation: send_time + receive_time in schema, dashboard shows "as of {timestamp}"
   - Owner: Builder (task-4, task-8)

4. **Missing Environment Config** (Risk §4)
   - No EXTERNAL_REPOS config documented
   - Mitigation: Create .env.tracking template with PINNED_REPO, DASH_REPO paths
   - Owner: Planner (pre-build) + Builder (task-3)

### MEDIUM RISK - MONITOR DURING BUILD

5. **Great Minds Revenue Mapping Undefined** (Risk §6)
   - V1 ships WITHOUT revenue feature; add in v1.1
   - Owner: Scoped out of Phase 1

6. **Privacy Compliance** (Risk §8)
   - GDPR requirements
   - Mitigation: Task-11 comprehensive audit gates ship
   - Owner: QA (task-11)

7. **Async Event Queue Not Designed** (Risk §9)
   - Products may block if analytics DB slow
   - Mitigation: Task-9 implements async POST with error handling
   - Owner: Builder (task-9)

---

## Success Criteria (decisions.md lines 515-518)

### Week 1 Exit Gates

✅ SQLite database live with events flowing from Pinned  
✅ First daily text summary delivered  
✅ 20 events defined across all 5 products  
✅ Privacy validation passed (no PII)  
✅ Performance validation passed (100k events/day)  
✅ E2E test passed (pipeline works end-to-end)

### Week 4 (Next Phase)

- All 5 products integrated
- ONE data-driven decision made (kill/pivot/double-down)
- Daily summaries consistently delivered AND READ

### Week 12 (Later Phase)

- Dashboard UI live (5 products × 3 metrics, <3 sec load)
- Daily habit formed (check Compass = morning routine)
- 3+ major decisions attributed to Compass data

---

## Estimated Effort

| Wave | Tasks | Timeline |
|------|-------|----------|
| Wave 1 | 3 tasks | Day 1 |
| Wave 2 | 4 tasks | Days 2-3 |
| Wave 3 | 3 tasks | Days 4-6 |
| Wave 4 | 4 tasks | Day 7 |

**Total**: 7 days (Week 1 timeline per decisions.md)  
**Critical Path**: Wave 1 (1 day) → Wave 2 (2 days) → Wave 3 (3 days) → Wave 4 (1 day)  
**Parallel Work**: Wave 1 (3 parallel), Wave 2 (4 parallel)

---

## Next Actions

1. **Verify Seth approved 20 events** (decisions.md line 541 blocker)
2. **Execute task-1**: Create SQLite schema
3. **Execute task-2**: Define events (pending Seth approval)
4. **Execute task-3**: Init script

**Plan Status**: ✅ READY FOR EXECUTION  
**Research**: Complete (3 agents: Codebase Scout, Requirements Analyst, Risk Scanner)  
**Ship Timeline**: Week 1 (7 days from start)

---

*Plan generated: 2026-04-16*  
*Requirements: prds/portfolio-analytics-foundation.md + rounds/portfolio-analytics-foundation/decisions.md*  
*Research agents: a7c8979, a89d8ff, a4f5ce5*  
*Next: Sara Blakely customer gut-check review*
