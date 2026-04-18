# Hindsight Implementation — Running To-Do List

**Project:** git-intelligence
**Generated:** 2026-04-16
**Spec:** ./spec.md
**Plan:** /Users/sethshoultes/Local Sites/great-minds-plugin/.planning/phase-1-plan.md

---

## Wave 1: Pipeline Integration (CRITICAL PATH)

### Task 1: Create .great-minds/ Directory Structure
- [ ] Read pipeline.ts to understand existing directory creation patterns — verify: find mkdir pattern around line 262
- [ ] Add `const greatMindsDir = resolve(REPO_PATH, ".great-minds");` in runPlan() — verify: grep "greatMindsDir" pipeline.ts shows declaration
- [ ] Add `await mkdir(greatMindsDir, { recursive: true });` before planDir creation in runPlan() — verify: grep "mkdir.*great-minds" finds line in runPlan
- [ ] Add same directory creation in runBuild() function near line 289 — verify: grep "mkdir.*great-minds" finds 2 matches total
- [ ] Verify mkdir import exists from fs/promises — verify: grep "import.*mkdir.*fs/promises" shows import at top
- [ ] Run pipeline test to ensure directory is created — verify: ls -la .great-minds/ in test repo after runPlan

**Commit message:**
```
feat(hindsight): create .great-minds/ directory in pipeline

Add directory creation for Hindsight reports before plan and build phases.
Follows existing mkdir pattern from line 262.

Related: REQ-007
```

---

### Task 2: Integrate Hindsight into Plan Phase
- [ ] Add import statement at top of pipeline.ts: `import { generateProjectHindsight, hindsightPlannerContext } from "./git-intelligence-integration.js";` — verify: grep "import.*generateProjectHindsight" pipeline.ts
- [ ] In runPlan(), after greatMindsDir creation, add hindsightPath constant — verify: grep "hindsightPath.*resolve.*hindsight.md" pipeline.ts
- [ ] Add log statement: `log("PLAN: Generating Hindsight report");` — verify: log appears in pipeline output during plan phase
- [ ] Wrap generateProjectHindsight call in try-catch block — verify: grep -A5 "generateProjectHindsight" shows try-catch
- [ ] Add success log: `log("PLAN: Hindsight report generated at .great-minds/hindsight.md");` — verify: log appears after generation
- [ ] Add error log in catch: `log(\`PLAN: Hindsight generation failed (non-blocking): ${err}\`);` — verify: catch block logs error
- [ ] Extract planner prompt to variable (planPrompt) before runAgent call — verify: const planPrompt appears in runPlan
- [ ] Inject hindsightPlannerContext() into planner prompt before IMPORTANT line — verify: grep "hindsightPlannerContext" pipeline.ts shows call in planPrompt
- [ ] Update runAgent call to use planPrompt variable — verify: runAgent call references planPrompt variable
- [ ] Test: Run plan phase and check .great-minds/hindsight.md exists — verify: cat .great-minds/hindsight.md shows report

**Commit message:**
```
feat(hindsight): integrate report generation into plan phase

- Import generateProjectHindsight and hindsightPlannerContext helpers
- Generate Hindsight report before planner agent runs
- Inject git intelligence context into planner prompt
- Non-blocking error handling (pipeline continues if generation fails)

Closes: REQ-008, REQ-010, REQ-012
```

---

### Task 3: Integrate Hindsight into Build Phase
- [ ] Add import for hindsightExecutorContext if not already imported — verify: grep "hindsightExecutorContext" at top of pipeline.ts
- [ ] In runBuild(), after greatMindsDir creation, add hindsightPath constant — verify: grep "hindsightPath" appears twice (plan and build)
- [ ] Add log statement: `log("BUILD: Generating Hindsight report");` — verify: log appears in pipeline output during build phase
- [ ] Wrap generateProjectHindsight call in try-catch (similar to plan phase) — verify: grep -A5 "BUILD.*generateProjectHindsight" shows try-catch
- [ ] Add success and error logs — verify: both logs present in catch block
- [ ] Extract build-setup prompt to variable (setupPrompt) — verify: const setupPrompt exists in runBuild
- [ ] Inject hindsightExecutorContext() into build-setup prompt — verify: grep "hindsightExecutorContext" shows call in setupPrompt
- [ ] Extract builder (feature) prompt to variable (builderPrompt) — verify: const builderPrompt exists
- [ ] Inject hindsightExecutorContext() into builder feature prompt — verify: hindsightExecutorContext in feature path
- [ ] Extract builder (hotfix) prompt to variable — verify: isHotfix ternary uses builderPrompt variable
- [ ] Inject hindsightExecutorContext() into builder hotfix prompt — verify: hindsightExecutorContext in hotfix path
- [ ] Update all 3 runAgent calls to use prompt variables — verify: all 3 builder calls reference variables
- [ ] Test: Run build phase and verify Hindsight regenerated — verify: check logs for "BUILD: Hindsight report generated"

**Commit message:**
```
feat(hindsight): integrate into build phase

- Regenerate Hindsight report before builder agents run
- Inject git intelligence context into build-setup, builder, and hotfix prompts
- Agents receive instructions to exercise extra care for high-churn/bug-prone files

Closes: REQ-009, REQ-011
```

---

## Wave 2: Correctness & Performance

### Task 4: Fix Threshold Mismatches
- [ ] Open daemon/src/git-intelligence.ts — verify: file opens successfully
- [ ] Line 44: Change filter from `>= 3` to `>= 10` — verify: grep ">=.*10" shows filter on line 44
- [ ] Line 44: Change slice from `.slice(0, 15)` to `.slice(0, 5)` — verify: grep "slice(0, 5)" git-intelligence.ts shows churn slice
- [ ] Line 48: Change bug-prone slice from `.slice(0, 20)` to `.slice(0, 5)` — verify: grep -n "slice(0, 5)" shows 2 matches (lines 44 and 48)
- [ ] Line 55: Update summary text to say "high-churn files" (check count is already dynamic) — verify: summary uses highChurnFiles.length
- [ ] Verify no other hardcoded thresholds remain — verify: grep "slice(0," shows only the two changed lines
- [ ] Test: Generate report on repo with 100+ commits — verify: output shows max 5 high-churn files
- [ ] Test: Verify files with <10 commits are not flagged as high-churn — verify: all flagged files have 10+ changes

**Commit message:**
```
fix(hindsight): correct thresholds to match design decisions

- Change high-churn threshold from 3 to 10 commits (decisions §5)
- Limit output to top 5 files, not 15 (editorial curation)
- Apply consistent curation to bug-prone files (top 5)
- Update summary text to reflect correct counts

Closes: REQ-002, REQ-023, REQ-024
```

---

### Task 5: Parallelize Git Command Execution
- [ ] Refactor git() to async function with Promise return type — verify: function signature shows `async function git(...): Promise<string>`
- [ ] Wrap execSync in Promise constructor in git() — verify: git() returns new Promise
- [ ] Keep try-catch, resolve with empty string on error — verify: catch block calls resolve("")
- [ ] Update generateHindsightReport() signature to async — verify: `export async function generateHindsightReport`
- [ ] Destructure git commands into array with Promise.all() — verify: `const [recentRaw, churnRaw, bugRaw, status, diffStats] = await Promise.all([...])`
- [ ] Ensure all 5 git commands are in the Promise.all array — verify: array contains 5 git() calls
- [ ] Update git-intelligence-integration.ts to await generateHindsightReport() — verify: `await generateHindsightReport` in integration file
- [ ] Test: Time report generation before parallelization — verify: baseline timing recorded
- [ ] Test: Time report generation after parallelization — verify: <200ms on repo with <10k commits

**Commit message:**
```
perf(hindsight): parallelize git command execution

- Convert git() to async function returning Promise
- Wrap 4 git commands in Promise.all() for concurrent execution
- Achieves ~5x speedup (from 500ms to ~100ms per spec)
- Update function signatures and callers accordingly

Closes: REQ-013
```

---

### Task 6: Implement In-Memory Caching
- [ ] Add CacheEntry interface at module level — verify: interface CacheEntry with report and timestamp fields exists
- [ ] Add cache Map declaration: `const cache = new Map<string, CacheEntry>();` — verify: cache declared at module level
- [ ] Add CACHE_TTL_MS constant (60 * 60 * 1000) — verify: constant equals 3600000
- [ ] Add getHEAD() helper function using execSync — verify: function exists and returns git rev-parse HEAD
- [ ] At start of generateHindsightReport, call getHEAD(cwd) — verify: const head = getHEAD(cwd) exists
- [ ] Create cache key: `${repoPath}:${head}` — verify: cacheKey uses both path and HEAD hash
- [ ] Check cache with TTL validation — verify: if block checks cache.get() and Date.now() - timestamp < TTL
- [ ] On cache hit, write to output and return cached report — verify: writeFileSync and return in cache hit block
- [ ] After generating report, store in cache with current timestamp — verify: cache.set(cacheKey, { report, timestamp: Date.now() })
- [ ] Test: Run generateHindsightReport twice in quick succession — verify: second call <100ms
- [ ] Test: Make a commit, run again — verify: cache misses (new HEAD hash logged)
- [ ] Test: Verify cache key format in logs — verify: logs show "repoPath:hash" format

**Commit message:**
```
perf(hindsight): add in-memory caching with HEAD-based invalidation

- Cache reports keyed by (repoPath, HEAD commit, timestamp)
- 1-hour TTL as specified in decisions §3
- Cache invalidates when HEAD changes (new commits)
- Achieves <100ms on cache hit (100x speedup)

Closes: REQ-014, REQ-015, REQ-016
```

---

## Wave 3: Reliability & Edge Cases

### Task 7: Add Timeout Protection and Large Repo Detection
- [ ] Add withTimeout() helper function at module level — verify: function withTimeout exists with Promise.race
- [ ] Update withTimeout signature: `<T>(promise: Promise<T>, timeoutMs: number, defaultValue: T): Promise<T>` — verify: generic type signature
- [ ] Implement Promise.race in withTimeout — verify: Promise.race with timeout Promise using setTimeout
- [ ] Wrap git() calls with withTimeout (10s, empty string default) — verify: return withTimeout(..., 10_000, "")
- [ ] Add large repo detection: `git rev-list --count HEAD` — verify: const commitCount = await git("rev-list --count HEAD", cwd)
- [ ] Parse commit count and check if > 500,000 — verify: if (parseInt(commitCount) > 500_000)
- [ ] Create skip report for large repos — verify: skipReport object with summary "repository too large"
- [ ] Write skip report to output and return early — verify: writeFileSync and return skipReport in large repo block
- [ ] Update formatMarkdown to handle skip messages gracefully — verify: skip report renders properly
- [ ] Test: Mock slow git command — verify: times out after 10s
- [ ] Test: Verify timeout returns empty string, not error — verify: no exceptions thrown

**Commit message:**
```
feat(hindsight): add timeout protection and large repo detection

- Wrap git commands in 10-second timeout (decisions §4)
- Detect repos >500k commits and skip analysis with explanation
- Prevents pipeline hangs on massive monorepos
- Graceful degradation with informative skip message

Closes: REQ-017, REQ-018
```

---

### Task 8: Enhance Edge Case Logging
- [ ] Import log function from logger.ts — verify: `import { log } from "./logger.js";` at top
- [ ] Add createSkipReport() helper function — verify: function exists with reason parameter
- [ ] Implement createSkipReport with consistent structure — verify: returns HindsightReport with skip summary
- [ ] Add git version check at start of generateHindsightReport — verify: execSync("git --version", ...)
- [ ] Wrap git version check in try-catch — verify: catch block logs "git command not found"
- [ ] Return createSkipReport("Git not available") on version check failure — verify: skip report returned
- [ ] Add error logging in git() function catch block — verify: log(`Hindsight: git command failed: ${cmd}`) in catch
- [ ] Add zero-commit check after recentChanges parsing — verify: if (recentChanges.length === 0)
- [ ] Log "No commits found" and return skip report for empty repos — verify: log and createSkipReport in zero-commit block
- [ ] Test: Run on non-git directory — verify: logs "git command not found" and skips gracefully
- [ ] Test: Run on empty repo (git init, no commits) — verify: logs "No commits found"
- [ ] Verify all logs have "Hindsight:" prefix — verify: grep "Hindsight:" shows consistent prefix

**Commit message:**
```
fix(hindsight): enhance edge case handling and logging

- Add git version check before analysis
- Log git command failures instead of silent catch
- Detect and skip empty repos (0 commits) gracefully
- Consistent skip report format across all edge cases
- All logs prefixed with "Hindsight:" for easy filtering

Closes: REQ-019, REQ-020, REQ-021
```

---

## Wave 4: Final Integration & Testing

### Task 9: Fix Output Filename in Integration
- [ ] Open daemon/src/git-intelligence-integration.ts — verify: file opens
- [ ] Line 20: Change "hindsight-report.md" to "hindsight.md" — verify: grep "hindsight.md" git-intelligence-integration.ts shows correct filename
- [ ] Verify no other references to old filename — verify: grep "hindsight-report" returns no matches
- [ ] Test: Generate report and verify output filename — verify: ls .great-minds/hindsight.md exists

**Commit message:**
```
fix(hindsight): correct output filename to hindsight.md

Change output from hindsight-report.md to hindsight.md for consistency
with .great-minds/ namespace (decisions §6).

Related: REQ-012
```

---

### Task 10: Integration Testing & Validation
- [ ] Run full pipeline on test PRD — verify: pipeline completes without errors
- [ ] Verify .great-minds/hindsight.md created — verify: cat .great-minds/hindsight.md shows report
- [ ] Check planner logs reference hindsight report — verify: grep "Hindsight" plan output
- [ ] Check builder logs mention high-churn/bug-prone files — verify: grep "high-churn\|bug-prone" build output
- [ ] Verify pipeline continues if Hindsight fails — verify: simulate failure, pipeline still runs
- [ ] Run on repo with >1000 commits — verify: output shows top 5 hotspots, not more
- [ ] Run pipeline twice quickly — verify: second run uses cache (<100ms)
- [ ] Check TypeScript compilation — verify: npm run build in daemon/ succeeds
- [ ] Run banned patterns test scripts — verify: ./tests/banned-patterns.sh passes
- [ ] Verify no hardcoded paths introduced — verify: ./tests/check-hardcoded-paths.sh passes

---

## Post-Implementation Checklist

- [ ] All 9 tasks completed with commits
- [ ] No breaking changes to existing pipeline phases
- [ ] Manual testing completed for all edge cases
- [ ] Integration test passed (full pipeline run)
- [ ] `.great-minds/hindsight.md` generated correctly
- [ ] Agents reference Hindsight in output
- [ ] Performance targets met (<500ms first, <100ms cached)
- [ ] No TypeScript errors
- [ ] Pipeline logs show Hindsight execution
- [ ] All test scripts pass

---

## Notes

- Each task should take <5 minutes to complete
- Every checkbox has a specific verification step
- If any task fails 3 times, mark as blocked and move to next task
- Keep commits focused and atomic per task
- Use the commit messages provided (they follow PRD requirements)
