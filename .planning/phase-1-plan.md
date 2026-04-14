# Phase 1 Plan — Pulse Benchmark Engine Integration

**Generated**: 2026-04-12
**Requirements**: `rounds/localgenius-benchmark-engine/decisions.md` + `.planning/REQUIREMENTS.md`
**Total Tasks**: 12
**Waves**: 4
**Timeline**: 3-5 days (integration only — code already exists)
**Product Name**: Pulse

---

## Executive Summary

This plan covers the **INTEGRATION** of the completed Pulse benchmark engine code into the LocalGenius application. The code has been written (~6,075 LOC across 22 files) and passes QA content review. The focus is now on resolving P0 blockers, performing integration testing, and preparing for production deployment.

**Key Insight from Research Agents**:
- **Codebase Scout**: All 22 deliverable files mapped, integration patterns identified
- **Requirements Analyst**: 40/40 requirements implemented, 2 P0 blockers
- **Risk Scanner**: 15 risks identified, 3 critical blockers

**Build Strategy**: Clear blockers, merge code, validate integration, deploy.

---

## Requirements Traceability

| Requirement | Task(s) | Wave | Status |
|-------------|---------|------|--------|
| P0-BLOCKER-1: Git commit db/ and lib/ | phase-1-task-1 | 1 | BLOCKING |
| P0-BLOCKER-2: Integration testing | phase-1-task-5, task-6, task-7 | 2-3 | BLOCKING |
| P0-BLOCKER-3: Database migrations | phase-1-task-2 | 1 | BLOCKING |
| P1-ISSUE: Batch job scheduler | phase-1-task-3 | 1 | HIGH |
| P1-ISSUE: Multi-tenant RLS | phase-1-task-4 | 1 | HIGH |
| REQ-018: API endpoint validation | phase-1-task-6 | 2 | PENDING |
| REQ-023: Dashboard page validation | phase-1-task-7 | 3 | PENDING |
| REQ-026: Badge embed validation | phase-1-task-8 | 3 | PENDING |
| QA: E2E tests | phase-1-task-9 | 3 | PENDING |
| DEPLOY: Staging | phase-1-task-10 | 4 | PENDING |
| DEPLOY: Production | phase-1-task-11 | 4 | PENDING |
| CLEANUP: Status update | phase-1-task-12 | 4 | PENDING |

---

## Wave Execution Order

### Wave 1 (Sequential — Day 1) — Blocker Resolution

These tasks must complete before integration can begin.

```xml
<task-plan id="phase-1-task-1" wave="1">
  <title>Commit Uncommitted Files to Git</title>
  <requirement>P0-BLOCKER-1: db/ and lib/ directories not in version control</requirement>
  <description>CRITICAL BLOCKER. The db/seeds/ and lib/ directories containing NAICS seeding and region utilities are not committed to git. This violates deployment policy and blocks all further work.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-benchmark-engine/db/seeds/naics-restaurants.ts" reason="166 LOC - NAICS code seed data for restaurants" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-benchmark-engine/lib/naics.ts" reason="270 LOC - NAICS code mapping utilities" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-benchmark-engine/lib/regions.ts" reason="547 LOC - MSA/State region utilities" />
  </context>

  <steps>
    <step order="1">Navigate to /Users/sethshoultes/Local Sites/great-minds/</step>
    <step order="2">Run: git status to confirm db/ and lib/ are untracked</step>
    <step order="3">Run: git add deliverables/localgenius-benchmark-engine/db/ deliverables/localgenius-benchmark-engine/lib/</step>
    <step order="4">Run: git commit -m "feat(pulse): add NAICS seeding and region utilities"</step>
    <step order="5">Verify commit: git log --oneline -1</step>
    <step order="6">Push to remote: git push origin main</step>
  </steps>

  <verification>
    <check type="bash">git status --porcelain | grep -E "^(\?\?|A)" | grep -E "(db/|lib/)" | wc -l # Should be 0</check>
    <check type="bash">git log --oneline -1 # Should show NAICS commit</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - this IS the first blocker -->
  </dependencies>

  <commit-message>feat(pulse): add NAICS seeding and region utilities</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-2" wave="1">
  <title>Create Database Migration Files</title>
  <requirement>P0-BLOCKER-3: 6 Pulse tables need DDL migrations</requirement>
  <description>Create Drizzle migration files for the 6 new Pulse tables defined in schema-pulse.ts. Without migrations, database won't have required tables.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-benchmark-engine/src/db/schema-pulse.ts" reason="349 LOC - 6 table definitions (pulseBenchmarks, pulsePublicReports, pulseBadgeConfigs, percentileHistory, notificationPreferences, pulseBadges)" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/drizzle.config.ts" reason="Drizzle ORM configuration" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/db/schema.ts" reason="Main schema file - Pulse tables must integrate here" />
  </context>

  <steps>
    <step order="1">Copy Pulse table definitions from schema-pulse.ts to LocalGenius schema.ts</step>
    <step order="2">Add organization_id column to pulseBenchmarks, pulsePublicReports, percentileHistory for RLS compliance</step>
    <step order="3">Run: cd /Users/sethshoultes/Local Sites/localgenius && npm run db:generate</step>
    <step order="4">Review generated migration in drizzle/ directory</step>
    <step order="5">Run: npm run db:push (or db:migrate depending on setup)</step>
    <step order="6">Verify tables exist: psql -c "\dt pulse*" or equivalent</step>
  </steps>

  <verification>
    <check type="bash">npm run db:generate # Should complete without errors</check>
    <check type="bash">npm run db:push # Should apply migrations</check>
    <check type="manual">Query: SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'pulse%'</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Must commit code before integrating" />
  </dependencies>

  <commit-message>feat(pulse): add database migrations for Pulse tables</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-3" wave="1">
  <title>Register Batch Job in Scheduler</title>
  <requirement>P1-ISSUE: Nightly batch job not registered in LocalGenius scheduler</requirement>
  <description>The batch-percentiles.ts service exists but the cron trigger is not registered. Register the job to run at 2 AM UTC daily.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-benchmark-engine/src/services/batch-percentiles.ts" reason="451 LOC - Exports cronHandler() for nightly job" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/services/scheduler.ts" reason="Job scheduler framework with register() function" />
  </context>

  <steps>
    <step order="1">Open /Users/sethshoultes/Local Sites/localgenius/src/services/scheduler.ts</step>
    <step order="2">Import cronHandler from Pulse batch service</step>
    <step order="3">Add job registration:
      register({
        name: "pulse-nightly-benchmark",
        description: "Calculate Pulse percentile rankings for all restaurants",
        schedule: "0 2 * * *", // 2 AM UTC daily
        handler: cronHandler,
      });</step>
    <step order="4">Update scheduler.ts to export the new job</step>
    <step order="5">Test job manually: curl -X POST localhost:3000/api/cron/run?job=pulse-nightly-benchmark</step>
  </steps>

  <verification>
    <check type="bash">grep -n "pulse-nightly-benchmark" /Users/sethshoultes/Local Sites/localgenius/src/services/scheduler.ts</check>
    <check type="manual">Trigger job via cron API endpoint, verify no errors</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-2" reason="Database tables must exist before job runs" />
  </dependencies>

  <commit-message>feat(pulse): register nightly benchmark job in scheduler</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-4" wave="1">
  <title>Add Multi-Tenant RLS Columns</title>
  <requirement>P1-ISSUE: Pulse tables missing organization_id for Row-Level Security</requirement>
  <description>Risk Scanner found that pulseBenchmarks, pulsePublicReports, and percentileHistory tables are missing organization_id column. This could cause cross-tenant data leakage.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-benchmark-engine/src/db/schema-pulse.ts" reason="Table definitions - need organization_id added" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/db/schema.ts" reason="Reference for organization_id pattern used in other tables" />
  </context>

  <steps>
    <step order="1">Review businesses table in schema.ts for organization_id pattern</step>
    <step order="2">Add organization_id column to pulseBenchmarks:
      organizationId: uuid("organization_id").notNull().references(() => organizations.id)</step>
    <step order="3">Add organization_id column to pulsePublicReports:
      organizationId: uuid("organization_id").notNull().references(() => organizations.id)</step>
    <step order="4">Add organization_id column to percentileHistory:
      organizationId: uuid("organization_id").notNull().references(() => organizations.id)</step>
    <step order="5">Update peer-groups.ts and batch-percentiles.ts to filter by organization_id</step>
    <step order="6">Regenerate migrations: npm run db:generate && npm run db:push</step>
  </steps>

  <verification>
    <check type="bash">grep -n "organizationId" /Users/sethshoultes/Local Sites/localgenius/src/db/schema.ts | grep -i pulse</check>
    <check type="manual">Verify RLS policy applies to Pulse tables</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-2" reason="Base tables must exist before adding RLS columns" />
  </dependencies>

  <commit-message>security(pulse): add organization_id for multi-tenant RLS compliance</commit-message>
</task-plan>
```

---

### Wave 2 (Sequential — Day 2) — Code Integration

```xml
<task-plan id="phase-1-task-5" wave="2">
  <title>Merge Pulse Code into LocalGenius Source Tree</title>
  <requirement>P0-BLOCKER-2: Integration testing - code must be in main app</requirement>
  <description>Copy Pulse deliverables into LocalGenius source tree at correct locations. Verify TypeScript compilation passes.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-benchmark-engine/" reason="All Pulse deliverables" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/" reason="LocalGenius source tree" />
  </context>

  <steps>
    <step order="1">Copy services:
      cp deliverables/localgenius-benchmark-engine/src/services/*.ts /Users/sethshoultes/Local Sites/localgenius/src/services/pulse/</step>
    <step order="2">Copy components:
      cp deliverables/localgenius-benchmark-engine/src/components/*.tsx /Users/sethshoultes/Local Sites/localgenius/src/components/pulse/</step>
    <step order="3">Copy API routes:
      cp -r deliverables/localgenius-benchmark-engine/src/api/* /Users/sethshoultes/Local Sites/localgenius/src/app/api/</step>
    <step order="4">Copy pages:
      cp -r deliverables/localgenius-benchmark-engine/src/pages/* /Users/sethshoultes/Local Sites/localgenius/src/app/</step>
    <step order="5">Copy lib utilities:
      cp deliverables/localgenius-benchmark-engine/lib/*.ts /Users/sethshoultes/Local Sites/localgenius/src/lib/pulse/</step>
    <step order="6">Copy badge embed script:
      cp deliverables/localgenius-benchmark-engine/badges/badge-embed.js /Users/sethshoultes/Local Sites/localgenius/public/badges/</step>
    <step order="7">Update import paths in copied files to use @/ alias</step>
    <step order="8">Run: cd /Users/sethshoultes/Local Sites/localgenius && npm run build</step>
  </steps>

  <verification>
    <check type="build">npm run build # Must complete without TypeScript errors</check>
    <check type="bash">ls -la /Users/sethshoultes/Local Sites/localgenius/src/services/pulse/</check>
    <check type="bash">ls -la /Users/sethshoultes/Local Sites/localgenius/src/components/pulse/</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Code must be committed first" />
    <depends-on task-id="phase-1-task-2" reason="Database schema must be ready" />
    <depends-on task-id="phase-1-task-3" reason="Scheduler must be configured" />
    <depends-on task-id="phase-1-task-4" reason="RLS columns must be added" />
  </dependencies>

  <commit-message>feat(pulse): integrate Pulse benchmark engine into LocalGenius</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-6" wave="2">
  <title>Validate API Endpoint Integration</title>
  <requirement>REQ-018: GET /api/pulse/benchmarks/:customerId must work</requirement>
  <description>Test the Pulse API endpoint in LocalGenius context. Verify authentication, response format, and error handling.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/app/api/pulse/benchmarks/[customerId]/route.ts" reason="Main benchmark API endpoint" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/api/middleware/auth.ts" reason="Authentication middleware" />
  </context>

  <steps>
    <step order="1">Start LocalGenius dev server: npm run dev</step>
    <step order="2">Test unauthenticated request: curl localhost:3000/api/pulse/benchmarks/test-id
      Expected: 401 Unauthorized</step>
    <step order="3">Get valid auth token from dev environment</step>
    <step order="4">Test authenticated request: curl -H "Authorization: Bearer $TOKEN" localhost:3000/api/pulse/benchmarks/$BUSINESS_ID</step>
    <step order="5">Verify response shape matches BenchmarkResponse interface</step>
    <step order="6">Test wrong customer ID: should return 403 Forbidden</step>
    <step order="7">Test nonexistent customer: should return 404 Not Found</step>
    <step order="8">Verify response time &lt; 200ms</step>
  </steps>

  <verification>
    <check type="manual">curl -w "%{time_total}\n" -o /dev/null -s localhost:3000/api/pulse/benchmarks/$ID # Under 0.2s</check>
    <check type="manual">Verify JSON response has: pulseScore, metrics[], peerGroup{}</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-5" reason="Code must be integrated before testing" />
  </dependencies>

  <commit-message>test(pulse): validate API endpoint integration</commit-message>
</task-plan>
```

---

### Wave 3 (Parallel — Day 3) — UI Validation

```xml
<task-plan id="phase-1-task-7" wave="3">
  <title>Validate Dashboard Page</title>
  <requirement>REQ-023: Dashboard page must render correctly</requirement>
  <description>Test the Pulse dashboard page in browser. Verify all components render, data flows correctly, and responsive design works.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/app/dashboard/pulse/page.tsx" reason="Main dashboard page" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/components/pulse/" reason="All Pulse components" />
  </context>

  <steps>
    <step order="1">Navigate to http://localhost:3000/dashboard/pulse (authenticated)</step>
    <step order="2">Verify PulseScore hero renders with percentile number</step>
    <step order="3">Verify IndustryComparison shows 4 metric charts</step>
    <step order="4">Verify PeerGroupSelector displays peer group info</step>
    <step order="5">Verify ProgressTracking shows week-over-week change</step>
    <step order="6">Test InsufficientDataState: mock sparse cohort, verify message appears</step>
    <step order="7">Test responsive design: check mobile viewport</step>
    <step order="8">Verify no console errors in browser DevTools</step>
  </steps>

  <verification>
    <check type="manual">Visual: PulseScore number is text-7xl and prominent</check>
    <check type="manual">DevTools: No React errors or warnings</check>
    <check type="manual">Mobile: Layout stacks correctly at 375px width</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-6" reason="API must work before UI testing" />
  </dependencies>

  <commit-message>test(pulse): validate dashboard page rendering</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-8" wave="3">
  <title>Validate Badge Embed System</title>
  <requirement>REQ-026: Badge embed script must work cross-origin</requirement>
  <description>Test the badge embed system on an external page. Verify CORS, rendering, and API integration.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/public/badges/badge-embed.js" reason="449 LOC - Standalone badge loader" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/src/app/api/badges/[embedId]/route.ts" reason="Badge data API" />
  </context>

  <steps>
    <step order="1">Create test HTML file on different port (e.g., python -m http.server 8080)</step>
    <step order="2">Add badge embed code to test HTML:
      &lt;div data-pulse-badge="$EMBED_ID" data-theme="light"&gt;&lt;/div&gt;
      &lt;script src="http://localhost:3000/badges/badge-embed.js"&gt;&lt;/script&gt;</step>
    <step order="3">Open test page in browser</step>
    <step order="4">Verify badge renders with correct tier (gold/silver/bronze)</step>
    <step order="5">Verify CORS headers allow cross-origin fetch</step>
    <step order="6">Test dark theme: data-theme="dark"</step>
    <step order="7">Test size variants: data-size="small|medium|large"</step>
    <step order="8">Verify no JavaScript errors in console</step>
  </steps>

  <verification>
    <check type="manual">Badge SVG renders on external page</check>
    <check type="bash">curl -I localhost:3000/badges/badge-embed.js | grep Access-Control</check>
    <check type="manual">Network tab: Badge API returns 200 with JSON data</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-6" reason="API infrastructure must work" />
  </dependencies>

  <commit-message>test(pulse): validate badge embed cross-origin functionality</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-9" wave="3">
  <title>Run E2E Test Suite</title>
  <requirement>QA: End-to-end tests for complete user flows</requirement>
  <description>Create and run Playwright E2E tests covering critical Pulse user journeys.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/playwright.config.ts" reason="Playwright configuration" />
    <file path="/Users/sethshoultes/Local Sites/localgenius/e2e/" reason="E2E test directory" />
  </context>

  <steps>
    <step order="1">Create /Users/sethshoultes/Local Sites/localgenius/e2e/pulse.spec.ts</step>
    <step order="2">Test: Unauthenticated user at /dashboard/pulse redirects to login</step>
    <step order="3">Test: Authenticated user sees PulseScore hero</step>
    <step order="4">Test: All 4 comparison charts render</step>
    <step order="5">Test: Peer group info displays correctly</step>
    <step order="6">Test: Public report page loads at /reports/state-of-local-restaurants</step>
    <step order="7">Test: Badge embed script loads (if separate test environment available)</step>
    <step order="8">Run: npx playwright test e2e/pulse.spec.ts</step>
  </steps>

  <verification>
    <check type="test">npx playwright test pulse --reporter=list</check>
    <check type="manual">npx playwright test pulse --headed # Visual verification</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-7" reason="Dashboard must work before E2E" />
    <depends-on task-id="phase-1-task-8" reason="Badges must work before E2E" />
  </dependencies>

  <commit-message>test(pulse): add E2E tests for dashboard and public pages</commit-message>
</task-plan>
```

---

### Wave 4 (Sequential — Day 4-5) — Deployment

```xml
<task-plan id="phase-1-task-10" wave="4">
  <title>Deploy to Staging Environment</title>
  <requirement>DEPLOY: Staging validation before production</requirement>
  <description>Deploy the integrated Pulse code to staging environment. Run smoke tests.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/.env.staging" reason="Staging environment configuration" />
  </context>

  <steps>
    <step order="1">Create staging branch: git checkout -b staging/pulse-v1</step>
    <step order="2">Push to remote: git push origin staging/pulse-v1</step>
    <step order="3">Trigger staging deployment (Vercel preview or equivalent)</step>
    <step order="4">Wait for deployment to complete</step>
    <step order="5">Run database migrations on staging DB</step>
    <step order="6">Smoke test: Visit staging URL /dashboard/pulse</step>
    <step order="7">Smoke test: Call API endpoint with staging auth token</step>
    <step order="8">Smoke test: Test badge embed on external staging page</step>
    <step order="9">Manually trigger nightly batch job via cron endpoint</step>
    <step order="10">Verify percentile calculations appear in staging DB</step>
  </steps>

  <verification>
    <check type="manual">Staging dashboard loads without errors</check>
    <check type="manual">API returns valid benchmark data</check>
    <check type="manual">Batch job completes successfully</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-9" reason="E2E tests must pass before staging" />
  </dependencies>

  <commit-message>deploy(pulse): deploy to staging environment</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-11" wave="4">
  <title>Deploy to Production</title>
  <requirement>DEPLOY: Production deployment</requirement>
  <description>After staging validation, deploy Pulse to production. Monitor for errors.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/localgenius/.env.production" reason="Production environment configuration" />
  </context>

  <steps>
    <step order="1">Merge staging branch to main: git checkout main && git merge staging/pulse-v1</step>
    <step order="2">Create release tag: git tag -a v1.0.0-pulse -m "Pulse Benchmark Engine v1"</step>
    <step order="3">Push to remote: git push origin main --tags</step>
    <step order="4">Trigger production deployment</step>
    <step order="5">Run database migrations on production DB</step>
    <step order="6">Verify deployment: Visit production /dashboard/pulse</step>
    <step order="7">Monitor error tracking (Sentry or equivalent) for 30 minutes</step>
    <step order="8">Verify first nightly batch job completes (wait for 2 AM UTC or trigger manually)</step>
    <step order="9">Post deployment notification to team</step>
  </steps>

  <verification>
    <check type="manual">Production dashboard loads</check>
    <check type="manual">No errors in monitoring for 30 minutes</check>
    <check type="manual">Batch job completes without errors</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Staging must validate before production" />
  </dependencies>

  <commit-message>deploy(pulse): release v1.0.0-pulse to production</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-12" wave="4">
  <title>Update Status and Documentation</title>
  <requirement>CLEANUP: Update STATUS.md and decisions.md</requirement>
  <description>Mark Pulse as shipped. Update project status files. Archive round transcripts.</description>

  <context>
    <file path="/Users/sethshoultes/Local Sites/great-minds/STATUS.md" reason="Agency status file" />
    <file path="/Users/sethshoultes/Local Sites/great-minds/rounds/localgenius-benchmark-engine/decisions.md" reason="Locked decisions - update build status" />
  </context>

  <steps>
    <step order="1">Update STATUS.md:
      - state: shipped
      - active project: pulse v1.0.0
      - last updated: {current date}</step>
    <step order="2">Update decisions.md:
      - Build Status: SHIPPED
      - Remove P0 blockers (resolved)</step>
    <step order="3">Move /prds/failed/localgenius-benchmark-engine.md to /prds/shipped/</step>
    <step order="4">Create /memory/pulse-learnings.md with retrospective notes</step>
    <step order="5">Update MEMORY.md index</step>
    <step order="6">Commit all status updates</step>
  </steps>

  <verification>
    <check type="manual">STATUS.md shows state: shipped</check>
    <check type="manual">decisions.md shows Build Status: SHIPPED</check>
    <check type="bash">ls /Users/sethshoultes/Local Sites/great-minds/prds/shipped/ | grep localgenius</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-11" reason="Must ship before updating status" />
  </dependencies>

  <commit-message>docs(pulse): update status files for v1.0.0 release</commit-message>
</task-plan>
```

---

## Risk Notes

### P0 Blockers (MUST Fix Before Integration)

| Risk | Impact | Status | Mitigation |
|------|--------|--------|------------|
| Uncommitted files | CRITICAL | phase-1-task-1 | Git add and commit |
| Missing DB migrations | CRITICAL | phase-1-task-2 | Create Drizzle migrations |
| Batch job not scheduled | HIGH | phase-1-task-3 | Register in scheduler.ts |
| Missing RLS columns | HIGH | phase-1-task-4 | Add organization_id |

### P1 Issues (Fix During Integration)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema import failures | HIGH | Validate in task-5 build step |
| API auth bypass | HIGH | Verify middleware in task-6 |
| CORS not configured | MEDIUM | Test in task-8 |

### P2 Concerns (Post-Launch)

| Risk | Timeline | Notes |
|------|----------|-------|
| Hardcoded URLs | v1.1 | Move to env config |
| Zero unit tests | v1.1 | Add test coverage |
| Engagement proxy metric | v2 | Replace with true follower tracking |

---

## Execution Timeline

| Day | Wave | Tasks | Checkpoint |
|-----|------|-------|------------|
| 1 | 1 | task-1, task-2, task-3, task-4 | Blockers cleared, DB ready |
| 2 | 2 | task-5, task-6 | Code merged, API validated |
| 3 | 3 | task-7, task-8, task-9 | UI validated, E2E passing |
| 4-5 | 4 | task-10, task-11, task-12 | Deployed and documented |

---

## Wave Summary

```
Wave 1: [task-1, task-2, task-3, task-4]  <- Sequential (blockers)
Wave 2: [task-5, task-6]                   <- Sequential (integration)
Wave 3: [task-7, task-8, task-9]           <- Parallel (validation)
Wave 4: [task-10, task-11, task-12]        <- Sequential (deployment)
```

**Total**: 12 tasks, 4 waves, 3-5 days

---

## Sign-Off Checklist

Before each wave, verify:
- [ ] Previous wave tasks all committed
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] No lint errors: `npm run lint`

Before ship (end of Wave 4):
- [ ] All 12 tasks committed
- [ ] E2E tests pass
- [ ] Staging validated
- [ ] Production deployed
- [ ] STATUS.md updated
- [ ] Monitoring shows no errors

---

*"The strength of the team is each individual member. The strength of each member is the team." — Phil Jackson*

---

**Clear the blockers. Then we ship.**
