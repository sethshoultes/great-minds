# Hindsight (Git Intelligence) — Implementation Spec

**Project:** git-intelligence
**Generated:** 2026-04-16
**PRD:** /Users/sethshoultes/Local Sites/great-minds-plugin/prds/git-intelligence.md
**Plan:** /Users/sethshoultes/Local Sites/great-minds-plugin/.planning/phase-1-plan.md
**Decisions:** /Users/sethshoultes/Local Sites/great-minds-plugin/rounds/git-intelligence/decisions.md

---

## Goals (From PRD)

Give agents X-ray vision into repository health by running git diagnostics before they touch code. Prevents agents from making the same mistakes in the same places by surfacing:
- Churn hotspots (files that change constantly = fragile)
- Bug-prone files (repeatedly patched instead of properly fixed)
- Recent failures/reverts (what went wrong recently)
- Uncommitted state (potential conflicts)

**Critical Constraint:** Add a new module and integrate into existing pipeline. **DO NOT rewrite pipeline.ts.**

---

## Implementation Approach (From Plan)

### Current State
- **60% coded, 0% integrated:** The `git-intelligence.ts` and `git-intelligence-integration.ts` modules exist but are disconnected from the pipeline
- Core git commands are implemented but need threshold corrections
- Helper functions for prompt injection exist but are unused

### Execution Strategy
3 waves of implementation:

**Wave 1 (Critical Path):** Pipeline integration
- Create `.great-minds/` directory structure
- Wire Hindsight into `runPlan()` — generate report before planner runs
- Wire Hindsight into `runBuild()` — regenerate report before builder runs
- Inject context into agent prompts (planner + all 3 builder variants)

**Wave 2 (Correctness & Performance):**
- Fix threshold mismatches (3→10 commits, 15→5 top files)
- Parallelize git commands with `Promise.all()` (5x speedup)
- Add in-memory caching based on HEAD commit hash (100x on cache hits)

**Wave 3 (Reliability & Edge Cases):**
- Add 10-second timeout protection per git command
- Auto-skip repos with >500k commits
- Enhance logging for edge cases (git not available, non-git repos, empty repos)

---

## Architecture

### File Structure
```
daemon/src/
  ├── pipeline.ts                    # MODIFY: Add Hindsight calls (Wave 1)
  ├── git-intelligence.ts            # MODIFY: Fix thresholds, add async, caching (Wave 2)
  ├── git-intelligence-integration.ts # EXISTS: Helper functions already coded
  └── logger.ts                      # USE: For consistent logging

.great-minds/
  └── hindsight.md                   # CREATED: Generated report (runtime)
```

### Design Principles (From Decisions)
- **Zero configuration:** Always on, no options, opinionated defaults
- **Calm veteran voice:** Facts without drama, confidence through understatement
- **Template-based output:** No LLM calls, just curated git data
- **Graceful degradation:** Non-blocking errors, pipeline continues even if generation fails
- **Performance targets:** <500ms first run, <100ms cached

---

## Verification Criteria

### Wave 1 Success Criteria
✅ **Directory creation:**
- [ ] `.great-minds/` directory exists after `runPlan()` starts
- [ ] `.great-minds/` directory exists after `runBuild()` starts

✅ **Report generation:**
- [ ] `hindsight.md` (not `hindsight-report.md`) is created in `.great-minds/` before planner runs
- [ ] Report is regenerated before builder runs (code may have changed since plan)
- [ ] Pipeline logs show "PLAN: Generating Hindsight report" and "BUILD: Generating Hindsight report"

✅ **Prompt injection:**
- [ ] Planner prompt contains `hindsightPlannerContext()` output
- [ ] Build-setup prompt contains `hindsightExecutorContext()` output
- [ ] Builder (feature) prompt contains `hindsightExecutorContext()` output
- [ ] Builder (hotfix) prompt contains `hindsightExecutorContext()` output

✅ **Integration integrity:**
- [ ] All Hindsight calls wrapped in try-catch (non-blocking)
- [ ] Pipeline continues even if Hindsight generation fails
- [ ] No changes to existing pipeline logic (additive only)

### Wave 2 Success Criteria
✅ **Threshold corrections:**
- [ ] High-churn threshold changed from `>= 3` to `>= 10` commits
- [ ] Top files limited to 5 (not 15 for churn, not 20 for bug-prone)
- [ ] Summary text reflects correct counts ("5 high-churn files")
- [ ] `grep ">=.*3" daemon/src/git-intelligence.ts` returns no matches
- [ ] `grep "slice(0, 15)" daemon/src/git-intelligence.ts` returns no matches

✅ **Parallelization:**
- [ ] `git()` function is async and returns `Promise<string>`
- [ ] `generateHindsightReport()` is async
- [ ] Git commands wrapped in `Promise.all()` (5 concurrent calls)
- [ ] Report generation completes in <200ms on repos with <10k commits

✅ **Caching:**
- [ ] Module-level cache `Map<string, CacheEntry>` exists
- [ ] Cache keyed by `${repoPath}:${HEAD_hash}`
- [ ] Cache TTL is 1 hour (3600000ms)
- [ ] Second run within 1 hour with same HEAD returns cached result in <100ms
- [ ] New commit invalidates cache (different HEAD hash)

### Wave 3 Success Criteria
✅ **Timeout protection:**
- [ ] `withTimeout()` helper function exists
- [ ] Git commands wrapped with 10-second timeout
- [ ] Slow commands return empty string after timeout (don't crash)
- [ ] Large repo detection checks commit count before analysis
- [ ] Repos with >500k commits skip with explanation message

✅ **Edge case handling:**
- [ ] Git not available → skip with "Git not available" message
- [ ] Non-git directory → skip gracefully
- [ ] Empty repo (0 commits) → skip with "No commits in repository" message
- [ ] All Hindsight logs prefixed with "Hindsight:" for filtering
- [ ] `createSkipReport()` helper exists for consistent skip messages

### Overall Acceptance (From Plan)
1. ✅ Pipeline runs Hindsight before agent task begins
2. ✅ Output appears at `.great-minds/hindsight.md` with proper formatting
3. ✅ Agent system prompt includes instruction to read Hindsight
4. ✅ Test on repo with >1000 commits shows top 5 hotspots
5. ✅ No pipeline failures introduced by integration
6. ✅ Timeout handles large repos gracefully (skip message)
7. ✅ Cache works (run twice, second <100ms)
8. ✅ Parallel execution works (measure speedup)

---

## File Modifications

### Files to Modify

#### 1. `daemon/src/pipeline.ts`
**Lines affected:** ~262-284 (runPlan), ~289-418 (runBuild)
**Changes:**
- Add import for `generateProjectHindsight`, `hindsightPlannerContext`, `hindsightExecutorContext`
- Create `.great-minds/` directory in both `runPlan()` and `runBuild()`
- Generate Hindsight report before agent calls (wrapped in try-catch)
- Inject context into planner prompt (1 location)
- Inject context into builder prompts (3 locations: setup, feature, hotfix)
- Update `runAgent` calls to use prompt variables instead of inline strings
**Estimated lines added:** ~30 lines
**Risk level:** MEDIUM (high-churn file per Hindsight's own analysis)

#### 2. `daemon/src/git-intelligence.ts`
**Lines affected:** Multiple (thresholds, function signatures, architecture)
**Changes:**
- Line 44: Change `>= 3` to `>= 10` (high-churn threshold)
- Line 44: Change `.slice(0, 15)` to `.slice(0, 5)` (top churn curation)
- Line 48: Change `.slice(0, 20)` to `.slice(0, 5)` (top bug-prone curation)
- Line 55: Update summary text to reflect "top 5" instead of 15
- Convert `git()` to async function returning `Promise<string>`
- Convert `generateHindsightReport()` to async
- Wrap git commands in `Promise.all()` for parallel execution
- Add module-level cache `Map` with TTL logic
- Add `getHEAD()` helper function
- Add cache check at start of `generateHindsightReport()`
- Add cache storage after report generation
- Add `withTimeout()` helper for 10s timeout
- Wrap git calls with timeout protection
- Add large repo detection (>500k commits)
- Add `createSkipReport()` helper for edge cases
- Import `log` from logger.ts
- Add git version check at start
- Enhance error logging in git() function
- Add zero-commit check
**Estimated lines added:** ~80 lines
**Risk level:** LOW (new file, well-tested design)

#### 3. `daemon/src/git-intelligence-integration.ts`
**Lines affected:** Line 20 (output path)
**Changes:**
- Line 20: Change `hindsight-report.md` to `hindsight.md`
- Update function signature to handle async `generateHindsightReport()`
**Estimated lines changed:** 2 lines
**Risk level:** LOW (helper file, minimal changes)

### Files to Create
None. All files already exist.

---

## Banned Patterns Check

### Cross-Project Patterns
✅ **Hardcoded paths:** All paths use `resolve()` with relative paths or `REPO_PATH` constant
✅ **Console.log:** Using `log()` from `logger.ts` for all logging
✅ **Unprotected timeouts:** All git commands wrapped with `withTimeout()` in Wave 3

### Git-Specific Anti-Patterns
✅ **Synchronous git without timeout:** Fixed in Wave 3 (10s timeout per command)
✅ **No edge case handling:** Fixed in Wave 3 (git not available, non-git repo, empty repo)
✅ **Silent failures:** Enhanced logging in Wave 3 (all errors logged with "Hindsight:" prefix)

---

## Performance Targets

| Metric | Target | How to Verify |
|--------|--------|---------------|
| First run (cold) | <500ms | Time `generateHindsightReport()` on repo with ~1000 commits |
| Cached run (hot) | <100ms | Run twice in succession, measure second call |
| Parallel speedup | ~5x | Compare sequential vs parallel git command execution |
| Timeout protection | 10s max | Mock slow git command, verify timeout works |
| Large repo skip | Instant | Detect >500k commits and skip without running git log |

---

## Testing Strategy

### Manual Testing (Per Task)
- **Task 1:** Verify `.great-minds/` directory created in both runPlan and runBuild
- **Task 2:** Run plan phase, check logs for "Generating Hindsight report"
- **Task 3:** Run build phase, check logs for "Hindsight report generated"
- **Task 4:** Generate report on repo with 100+ commits, verify thresholds
- **Task 5:** Time report generation before/after parallelization
- **Task 6:** Run twice in quick succession, verify <100ms cache hit
- **Task 7:** Mock slow git command, verify 10s timeout
- **Task 8:** Test on non-git directory, verify graceful skip

### Integration Testing
1. Run full pipeline on test PRD
2. Verify `.great-minds/hindsight.md` is created (not `.great-minds/hindsight-report.md`)
3. Verify planner agent output references hindsight report
4. Verify builder agent output mentions high-churn or bug-prone files
5. Check pipeline logs for "Hindsight:" entries
6. Verify pipeline completes even if Hindsight fails

### Regression Testing
- Run existing pipeline on known PRD (no new failures introduced)
- Verify no TypeScript errors (`npm run build` in daemon directory)
- Verify no breaking changes to pipeline.ts (existing phases still work)

---

## Risk Mitigation

### High-Risk Changes
**pipeline.ts modification (REQ-007 through REQ-012):**
- **Risk:** Breaking existing pipeline functionality
- **Mitigation:**
  - Additive changes only (no refactoring)
  - Follow existing patterns (mkdir, dynamic imports, prompt injection)
  - Wrap all Hindsight calls in try-catch (non-blocking)
  - Keep changes minimal (~30 lines total)
  - Test on real PRD after each wave

### Edge Cases
**Large monorepos:**
- **Risk:** Pipeline hangs on massive repos
- **Mitigation:** 10s timeout per command, auto-skip >500k commits

**Git unavailable:**
- **Risk:** Pipeline crashes when git not found
- **Mitigation:** Check `git --version` before running, graceful skip

**Cache staleness:**
- **Risk:** Stale data shown to agents
- **Mitigation:** Cache invalidates on HEAD change, 1-hour TTL

---

## Success Metrics (Post-Launch)

**Primary:** 20% reduction in agent-caused breakages on repos with >50 commits

**How to measure:**
- Track: Did agent modify a churn hotspot flagged by Hindsight?
- Track: Did that modification cause errors/reverts?
- Compare: Error rate on files flagged vs not flagged
- Goal: Agents that read Hindsight make fewer mistakes on brittle files

**Secondary metrics:**
- Agents acknowledge Hindsight in their output (visible in logs)
- Report generation completes without errors in >95% of runs
- Cache hit rate >70% during iterative development sessions

---

## Dependencies

### External
- Git CLI (assumed available in pipeline environment)
- Node.js `child_process`, `fs`, `path` (standard library)

### Internal
- `daemon/src/logger.ts` — for consistent logging
- `daemon/src/config.ts` — for `REPO_PATH` constant
- Existing pipeline infrastructure (runAgent, runPlan, runBuild)

---

## Estimated Effort (From Plan)

| Wave | Tasks | Complexity | Est. Time |
|------|-------|------------|-----------|
| Wave 1 | 3 tasks (integration) | Medium | 45-60 min |
| Wave 2 | 3 tasks (correctness & perf) | Medium | 30-45 min |
| Wave 3 | 2 tasks (reliability) | Low | 15-30 min |

**Total:** 90-135 minutes (1.5-2.25 hours)
**Risk Buffer:** +30 minutes for unexpected issues
**Realistic Estimate:** 2-2.5 hours total

---

## Post-Implementation Checklist

- [ ] All 8 tasks committed with proper messages (per phase-1-plan.md)
- [ ] No breaking changes to existing pipeline phases
- [ ] Manual testing completed for all edge cases
- [ ] Integration test passed (full pipeline run)
- [ ] `.great-minds/hindsight.md` generated and formatted correctly
- [ ] Agents reference Hindsight in their output
- [ ] Performance targets met (<500ms first run, <100ms cached)
- [ ] No new TypeScript errors (npm run build passes)
- [ ] Pipeline logs show Hindsight execution clearly
- [ ] All banned patterns verified absent (run test scripts)

---

**Spec Status:** ✅ Complete
**Next Action:** Execute Wave 1 tasks from todo.md
**Estimated Ship Date:** Same day (2-3 hours of focused work)
