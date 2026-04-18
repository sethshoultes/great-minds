# Compass — Build To-Do List
## Portfolio Analytics Foundation (Week 1)

**Project**: portfolio-analytics-foundation
**Status**: Ready for execution
**Total Tasks**: 42 atomic tasks
**Estimated Time**: 7 days (Week 1)

---

## Wave 1: Foundation (Day 1) — Parallel Execution

### Task Group 1.1: SQLite Database Schema

- [ ] Create compass/ directory structure (db/, src/, config/, integrations/, cron/, scripts/) — verify: `ls -la compass/` shows all 6 directories
- [ ] Create events table schema with 6 columns (product, event, user_hash, timestamp, properties_json, revenue_cents) — verify: `sqlite3 compass/db/compass.db ".schema events"` shows correct columns
- [ ] Add PRIMARY KEY to events table (auto-increment id) — verify: schema shows `id INTEGER PRIMARY KEY AUTOINCREMENT`
- [ ] Create index on timestamp column for performance — verify: `sqlite3 compass/db/compass.db ".indices events"` shows timestamp index
- [ ] Create index on product column for filtering — verify: index list shows product index
- [ ] Enable WAL mode for concurrent reads — verify: `sqlite3 compass/db/compass.db "PRAGMA journal_mode;"` returns "wal"
- [ ] Enable auto-vacuum for database maintenance — verify: `sqlite3 compass/db/compass.db "PRAGMA auto_vacuum;"` returns "1" or "FULL"
- [ ] Insert 1000 test events and time execution — verify: completes in <1 second

### Task Group 1.2: Event Definitions

- [ ] Create config/events.json skeleton with 5 product sections — verify: JSON validates, has 5 top-level product keys
- [ ] Define 4 Pinned events (note_created, note_acknowledged, mention_sent, daily_active_session) — verify: events.json has pinned section with 4 events
- [ ] Define 4 Dash events (command_executed, search_performed, shortcut_used, session_duration) — verify: events.json has dash section with 4 events
- [ ] Define 4 LocalGenius events (trial_start, subscription_start, post_generated, review_responded) — verify: events.json has localgenius section with 4 events
- [ ] Define 4 Shipyard events (project_started, stage_completed, project_delivered, revision_requested) — verify: events.json has shipyard section with 4 events
- [ ] Define 4 Great Minds events (prd_submitted, debate_completed, plan_approved, project_shipped) — verify: events.json has great-minds section with 4 events
- [ ] Add outcome_focused flag to each event — verify: all 20 events have boolean outcome_focused field
- [ ] Add properties_schema to each event (defines expected JSON structure) — verify: all 20 events have properties_schema object
- [ ] Validate no PII fields in any event schema — verify: `grep -i "email\|name\|address\|phone\|ip" config/events.json` returns zero data field matches
- [ ] Count total events — verify: exactly 20 events defined (4 × 5 products)

### Task Group 1.3: Database Initialization Script

- [ ] Create compass/scripts/init-db.sh with shebang and error handling — verify: file exists and starts with `#!/bin/bash`
- [ ] Add environment variable check for COMPASS_DB_PATH — verify: script errors if COMPASS_DB_PATH not set
- [ ] Add idempotent table creation (CREATE TABLE IF NOT EXISTS) — verify: running script twice doesn't error
- [ ] Add index creation (with IF NOT EXISTS) — verify: re-running doesn't duplicate indexes
- [ ] Add WAL mode enablement — verify: script sets journal_mode=wal
- [ ] Add auto-vacuum enablement — verify: script sets auto_vacuum=FULL
- [ ] Add integrity check query — verify: script runs `PRAGMA integrity_check;` and logs result
- [ ] Add success/failure logging — verify: script outputs clear success or error message
- [ ] Make script executable — verify: `ls -l compass/scripts/init-db.sh` shows execute permission
- [ ] Test with COMPASS_DB_PATH override — verify: `COMPASS_DB_PATH=/tmp/test.db ./init-db.sh` creates DB at custom path

---

## Wave 2: Backend Infrastructure (Days 2-3) — Parallel Execution

**Dependency**: Wave 1 must complete (database + schema exist)

### Task Group 2.1: HTTP POST Ingestion Endpoint

- [ ] Create compass/src/ingest.php with request parsing — verify: file exists and reads php://input
- [ ] Add Content-Type validation (must be application/json) — verify: POST with text/plain returns 400
- [ ] Add required field validation (product, event, user_hash, timestamp) — verify: POST missing event returns 400 with error message
- [ ] Add product enum validation (pinned, dash, localgenius, shipyard, great-minds) — verify: POST with invalid product returns 400
- [ ] Add event validation against events.json schema — verify: POST with undefined event returns 400
- [ ] Add PII rejection (detect email patterns, plain text IDs) — verify: POST with email in properties returns 400 and logs rejection
- [ ] Add user_hash format validation (64 hex characters for SHA-256) — verify: POST with invalid hash returns 400
- [ ] Add timestamp validation (ISO 8601 format) — verify: POST with invalid timestamp returns 400
- [ ] Add SQLite connection with error handling — verify: script handles database connection failure gracefully
- [ ] Add INSERT prepared statement — verify: SQL injection attempts are blocked
- [ ] Add success response (200 OK with event_id) — verify: curl POST returns 200 and JSON with id
- [ ] Add error responses (400 Bad Request, 500 Internal Server Error) — verify: various errors return appropriate status codes
- [ ] Test full flow: curl POST valid event — verify: event appears in SQLite with correct data

### Task Group 2.2: DAU Metric Query

- [ ] Create compass/src/queries.php file — verify: file exists
- [ ] Add function compass_calculate_dau($product, $date_range = 30) — verify: function signature correct
- [ ] Add SQLite connection handling — verify: function handles connection errors
- [ ] Write SQL: COUNT(DISTINCT user_hash) WHERE product = ? AND timestamp >= ? — verify: query syntax correct
- [ ] Add prepared statement with parameterized product filter — verify: SQL injection blocked
- [ ] Add date range calculation (default 30 days) — verify: calculates date 30 days ago correctly
- [ ] Add result formatting (return integer DAU count) — verify: returns number, not string
- [ ] Add error handling (return 0 on error with log) — verify: database errors don't crash, log written
- [ ] Test with 10 events from 5 unique users — verify: returns DAU = 5
- [ ] Test with 10 events from same user — verify: returns DAU = 1
- [ ] Benchmark query execution time — verify: completes in <1 second for 100k events

### Task Group 2.3: 7-Day Retention Query

- [ ] Add function compass_calculate_retention_curves($product) — verify: function exists in queries.php
- [ ] Add cohort definition query (first event per user_hash) — verify: correctly identifies cohort start date
- [ ] Add D1 retention query (% returned 1 day after first event) — verify: returns percentage 0-100
- [ ] Add D7 retention query (% returned 7 days after first event) — verify: returns percentage 0-100
- [ ] Add D30 retention query (% returned 30 days after first event) — verify: returns percentage 0-100
- [ ] Add result formatting (return array with d1, d7, d30 percentages) — verify: JSON structure correct
- [ ] Add error handling — verify: database errors return null with log
- [ ] Test: Create 10-user cohort, 7 return D1 — verify: D1 retention = 70%
- [ ] Test: 5 users return D7 — verify: D7 retention = 50%
- [ ] Benchmark query execution time — verify: completes in <2 seconds for 100k events

### Task Group 2.4: Revenue Per User Query

- [ ] Add function compass_calculate_revenue_per_user($product, $date_range = 30) — verify: function exists
- [ ] Add revenue sum query (SUM(revenue_cents)) — verify: aggregates correctly
- [ ] Add DAU count query (reuse compass_calculate_dau) — verify: uses existing function
- [ ] Add division: total_revenue / dau — verify: calculates correctly
- [ ] Add zero-division handling (return 0 if DAU = 0) — verify: doesn't crash on zero users
- [ ] Add result formatting (return cents, not dollars) — verify: 1234 cents returned, not $12.34
- [ ] Add error handling — verify: database errors return 0 with log
- [ ] Test: Insert $100 total across 5 users — verify: returns $20/user (2000 cents)
- [ ] Test: Zero revenue — verify: returns 0 (no errors)
- [ ] Benchmark query execution time — verify: completes in <1 second

---

## Wave 3: Integration & Output (Days 4-6) — Sequential Execution

**Dependency**: Wave 2 must complete (backend infrastructure works)

### Task Group 3.1: Daily Text Summary Generator

- [ ] Create compass/src/report.php file — verify: file exists
- [ ] Add Compass voice guidelines as code comment — verify: comment documents voice principles
- [ ] Add function compass_generate_summary($product) — verify: function signature correct
- [ ] Fetch DAU metric — verify: calls compass_calculate_dau()
- [ ] Fetch retention metrics — verify: calls compass_calculate_retention_curves()
- [ ] Fetch revenue per user — verify: calls compass_calculate_revenue_per_user()
- [ ] Calculate trend (compare to previous period) — verify: shows +12% or -40% correctly
- [ ] Add health diagnosis logic (healthy, declining, dead) — verify: thresholds applied correctly
- [ ] Add decision recommendation logic — verify: actionable decision included
- [ ] Format output: "Product: [metric] ([trend]). Diagnosis: [health]. Decision: [action]" — verify: matches template exactly
- [ ] Add voice validation (no hedging, no jargon) — verify: output is direct and confident
- [ ] Test summary generation for all 5 products — verify: generates 5 distinct summaries
- [ ] Test edge cases (zero data, all metrics zero) — verify: handles gracefully with appropriate messaging
- [ ] Validate voice guidelines — verify: no "suggests", "might", "potentially" in output

### Task Group 3.2: Pinned Event Tracker

- [ ] **RESEARCH STEP**: Read Pinned codebase to understand actual API — verify: documented findings before writing code
- [ ] Create compass/integrations/pinned/tracker.js file — verify: file exists
- [ ] Add SHA-256 hashing function for user identifiers — verify: produces 64 hex character output
- [ ] Add event tracking function: trackEvent(event, properties) — verify: function signature correct
- [ ] Add note_created event trigger — verify: fires when note created in Pinned
- [ ] Add note_acknowledged event trigger — verify: fires when note acknowledged
- [ ] Add mention_sent event trigger — verify: fires when mention sent
- [ ] Add daily_active_session event trigger — verify: fires once per day on first activity
- [ ] Add async HTTP POST to ingest.php — verify: non-blocking, uses fetch or XMLHttpRequest
- [ ] Add opt-out check (respect user preference) — verify: no events sent when opted out
- [ ] Add error handling (silent fail, don't break Pinned) — verify: tracker errors don't crash Pinned
- [ ] Add performance optimization (<5ms overhead) — verify: measure execution time
- [ ] Test: Create note in Pinned — verify: "note_created" event appears in compass.db
- [ ] Test: Acknowledge note — verify: "note_acknowledged" event in DB
- [ ] Test: Send mention — verify: "mention_sent" event in DB
- [ ] Test: User hash format — verify: 64 hex characters (SHA-256)
- [ ] Test: Opt-out flag — verify: no events when user opts out
- [ ] Privacy scan — verify: no PII sent in any event

### Task Group 3.3: Daily Cron Job

- [ ] Create compass/cron/daily-summary.sh file — verify: file exists
- [ ] Add shebang and error handling — verify: proper bash script structure
- [ ] Add timestamp logging — verify: each run logs start time
- [ ] Add report.php execution — verify: script calls PHP correctly
- [ ] Add email sending (or file write fallback) — verify: summary delivered via email or file
- [ ] Add error handling and logging — verify: failures logged to cron log file
- [ ] Add success confirmation log — verify: successful runs logged
- [ ] Make script executable — verify: chmod +x applied
- [ ] Add to crontab (9 AM daily) — verify: `crontab -l` shows entry
- [ ] Test manual execution — verify: `./daily-summary.sh` runs successfully
- [ ] Test email delivery — verify: email received or file created
- [ ] Test error handling — verify: database failure logged, doesn't crash

---

## Wave 4: Validation & Ship (Day 7) — Sequential Execution

**Dependency**: Wave 3 must complete (full pipeline working)

### Task Group 4.1: Privacy Validation

- [ ] Run grep for email patterns in database — verify: `sqlite3 compass.db "SELECT * FROM events" | grep -i "@"` returns zero
- [ ] Run grep for name/address/phone in database — verify: no PII in any event
- [ ] Verify all user_hash values are SHA-256 (64 hex chars) — verify: `sqlite3 compass.db "SELECT DISTINCT user_hash FROM events" | wc -c` shows 64 per hash
- [ ] Test opt-out mechanism in Pinned — verify: no events sent when opted out
- [ ] Verify 90-day retention query works — verify: `DELETE FROM events WHERE timestamp < date('now', '-90 days')` runs successfully
- [ ] Document privacy compliance in README — verify: GDPR Article 6(1)(f) mentioned

### Task Group 4.2: Performance Test (100k Events/Day)

- [ ] Create load test script (insert 100k events) — verify: script generates realistic test data
- [ ] Run load test and measure insert time — verify: 100k inserts complete
- [ ] Benchmark DAU query after load test — verify: <1 second execution
- [ ] Benchmark retention query after load test — verify: <2 seconds execution
- [ ] Benchmark revenue query after load test — verify: <1 second execution
- [ ] Check database file size — verify: <100MB for 100k events
- [ ] Test concurrent reads during writes — verify: WAL mode allows simultaneous queries
- [ ] Document performance results — verify: validates Elon's SQLite claim

### Task Group 4.3: End-to-End Integration Test

- [ ] POST test event via curl — verify: returns 200 OK
- [ ] Query database for test event — verify: event exists with correct data
- [ ] Run DAU query including test event — verify: count increases by 1
- [ ] Run report.php — verify: summary includes test data
- [ ] Measure total pipeline latency — verify: <5 seconds end-to-end
- [ ] Test error handling at each stage — verify: graceful failures logged
- [ ] Review all log files — verify: no errors in pipeline

### Task Group 4.4: Week 1 Exit Criteria

- [ ] Verify SQLite database live — verify: `sqlite3 compass.db ".tables"` shows events table
- [ ] Verify Pinned events flowing — verify: database has pinned events from last 24 hours
- [ ] Verify first daily summary delivered — verify: email received or file created today
- [ ] Verify 20 events defined — verify: `cat config/events.json | grep '"event"' | wc -l` returns 20
- [ ] Verify privacy validation passed — verify: all privacy checks completed ✅
- [ ] Verify performance validation passed — verify: 100k events test completed ✅
- [ ] Verify E2E test passed — verify: pipeline test completed ✅
- [ ] Create git tag: compass-week-1-ship — verify: `git tag -l` shows tag
- [ ] Write WEEK-1-RETROSPECTIVE.md — verify: document learnings and next steps
- [ ] Update STATUS.md to "Week 1 Complete" — verify: status file reflects completion

---

## Blocked / Needs Approval

### Blocking Item 1: Event Definitions
**Status**: ⚠️ BLOCKED
**Reason**: Requires Seth approval (decisions.md line 541)
**Action Required**: Seth must review and approve 20 event definitions
**Unblocks**: Task Group 1.2 (Event Definitions)

### Blocking Item 2: Pinned API Research
**Status**: ⚠️ MUST COMPLETE FIRST
**Reason**: Cannot write tracker.js without understanding actual Pinned API (plan line 127)
**Action Required**: Research Pinned codebase before implementing tracker
**Unblocks**: Task Group 3.2 (Pinned Event Tracker)

---

## Progress Summary

**Wave 1 (Foundation)**: ⬜ 0/30 tasks complete
**Wave 2 (Backend)**: ⬜ 0/40 tasks complete
**Wave 3 (Integration)**: ⬜ 0/42 tasks complete
**Wave 4 (Validation)**: ⬜ 0/23 tasks complete

**Overall Progress**: ⬜ 0/135 atomic tasks complete (0%)

**Status**: Ready for Wave 1 execution (pending Seth approval on events)

---

## Notes

- Each task designed for <5 minutes completion time
- Every task has explicit verification step
- Tasks within waves can be done in parallel
- Tasks between waves must be sequential (respect dependencies)
- ⚠️ indicates blocker — must resolve before proceeding
- ✅ indicates completed and verified task

**Next Action**: Get Seth approval on 20 events, then execute Wave 1 (3 tasks in parallel)
