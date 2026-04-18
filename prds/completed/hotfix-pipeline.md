# PRD: Add Hotfix Pipeline + Structured Build System

> Priority: p1

## Problem

Two related issues with the daemon pipeline:

### Problem 1: No Fast Path for Bug Fixes

The daemon pipeline runs every PRD through the full ceremony: debate (Steve + Elon × 2 rounds + Rick Rubin + Phil Jackson) → plan → build → QA × 2 → creative review → board review → ship. This takes 30-60+ minutes and is designed for new features.

For bug fixes and config changes (like fixing a wrangler.jsonc binding or changing an entrypoint path), this is overkill. The builder agent consistently hangs at the 20-minute timeout because the investigation-heavy PRDs spend all their time reading docs instead of making the 1-2 line fix.

**Evidence:**
- `membership-production-fix` — builder hung at 20min, 0 files produced
- `membership-v2-hung` — builder hung at 20min, 0 files produced
- Both were config/deploy fixes that needed <10 lines changed

### Problem 2: Builder Has No Structure

The builder agent gets one big prompt and runs blind for up to 20 minutes with no self-verification, no progress tracking, and no mid-build review. When it hangs, there's no way to tell where it got stuck or what it accomplished. This affects BOTH the full pipeline and hotfix builds.

Reference: Simon Last's 4 structural rules for long-running agents (proven to sustain 13-day continuous runs):
1. **Self-verification** — test layers the agent loops on
2. **Spec documents** — goals + verification criteria the agent consults before every change
3. **Running to-do list** — visible, editable task breakdown
4. **Adversarial review** — fresh sub-agent reviews every ~20 iterations

## Solution

Two changes, both in `pipeline.ts`:

### Part A: Hotfix Pipeline Path

Add a `hotfix` pipeline path triggered by PRDs with a `hotfix: true` flag or fix/patch in the title:

```
plan → structured-build → QA × 1 → ship
```

No debate. No creative review. No board review. One QA pass instead of two.

### Part B: Structured Build (for ALL builds)

Replace the current "fire and forget" builder with a structured build that creates spec/todo/tests before coding. This applies to BOTH hotfix and full pipeline builds.

## Implementation

### 1. Add hotfix detection in `daemon.ts`

When a PRD is picked up or a GitHub issue is converted, check for hotfix signals:

```typescript
function detectHotfix(prdContent: string): boolean {
  // Check frontmatter
  if (/^hotfix:\s*true/m.test(prdContent)) return true;
  // Check if it's a pure config/fix PRD (no new features)
  if (/^#.*\b(fix|hotfix|patch|config)\b/im.test(prdContent)) return true;
  return false;
}
```

Pass the flag to `runPipeline()`:

```typescript
export async function runPipeline(prdFile: string, project: string, isHotfix = false): Promise<void> {
```

### 2. Skip phases in `runPipeline()` when hotfix

```typescript
if (!isHotfix) {
  await runDebate(prdFile, project);
}

// Plan + Build always run
await runPlan(project);
await runBuild(project, isHotfix);

// QA — 1 pass for hotfix, 2 for features
await runQA(project, 1);
if (!isHotfix) {
  await runQA(project, 2);
  await runCreativeReview(project);
  await runBoardReview(project);
}

await runShip(project);
```

### 3. Structured build phase (replaces current `runBuild`)

Rewrite `runBuild()` to use a 3-step structured approach:

```typescript
export async function runBuild(project: string, isHotfix = false): Promise<void> {
  log(`PHASE: build — project=${project}`);
  const delDir = resolve(DELIVERABLES_DIR, project);
  await mkdir(delDir, { recursive: true });

  const prdPath = resolve(PRDS_DIR, `${project}.md`);
  const planPath = resolve(REPO_PATH, ".planning/phase-1-plan.md");
  const specPath = resolve(delDir, "spec.md");
  const todoPath = resolve(delDir, "todo.md");
  const testsDir = resolve(delDir, "tests");

  // ── Step 1: Create spec.md + todo.md + tests/ ──────────────
  // Builder MUST create these before writing any code.
  
  await runAgent("build-setup", `You are preparing a structured build.

Read the PRD at ${prdPath} and the plan at ${planPath}.
Read CLAUDE.md in the repo root for project rules.
${isHotfix ? "" : "Read BANNED-PATTERNS.md if it exists."}

Create these three files:

1. ${specPath} — A complete spec with:
   - Goals (from the PRD)
   - Implementation approach (from the plan)
   - Verification criteria: exactly how to prove each piece works
   - List every file that will be created or modified

2. ${todoPath} — A running to-do list with checkboxes:
   - Break the work into atomic, verifiable sub-tasks
   - Each task should be completable in <5 minutes
   - Each task should have a verification step
   - Format: "- [ ] Task description — verify: how to check it worked"
   ${isHotfix ? "- For hotfixes, this should be 3-5 tasks max" : ""}

3. Create directory ${testsDir}/ with at least one test script:
   - Shell scripts or node scripts that verify the build output
   - Example: grep for banned patterns, check file existence, run type checks
   - Each test should exit 0 on pass, non-zero on fail

Do NOT write any implementation code yet. Only create spec.md, todo.md, and tests/.`,
    15, "build", "sonnet");

  // ── Step 2: Execute todo.md tasks ──────────────────────────
  // Builder works through todo.md, checking off items, running tests after each.

  const builderPrompt = isHotfix
    ? `You are fixing a bug. Your spec is at ${specPath}. Your todo list is at ${todoPath}.

For each unchecked task in todo.md:
1. Read spec.md to confirm the approach
2. Make the change
3. Run the test scripts in ${testsDir}/ to verify
4. Edit todo.md to check off the completed task: change "- [ ]" to "- [x]"
5. Move to the next task

Do NOT explore the codebase beyond what spec.md says is needed.
Read CLAUDE.md first for project rules.
When all tasks are checked off, commit: git add -A && git commit -m "hotfix: ${project}".`
    : `You are building a feature. Your spec is at ${specPath}. Your todo list is at ${todoPath}.

CRITICAL RULES:
1. Before EVERY change, re-read spec.md to confirm alignment.
2. After EVERY task, run test scripts in ${testsDir}/ and fix failures before moving on.
3. After completing each task, edit todo.md: change "- [ ]" to "- [x]".
4. If you discover a new sub-task, ADD it to todo.md before doing it.
5. Read CLAUDE.md for project rules. Read BANNED-PATTERNS.md if it exists.
6. NO PLACEHOLDER CONTENT. No "coming soon", no "TODO", no stubs.
7. Commit on a feature branch when done: git checkout -b feature/${project} && git add -A && git commit.

Work through todo.md top to bottom. Do not skip tasks. Do not proceed past a failing test.`;

  await runAgent("builder", builderPrompt,
    isHotfix ? 15 : DEFAULT_MAX_TURNS, "build", "sonnet");

  // ── Step 3: Mid-build adversarial review (full pipeline only) ──
  // Fresh sub-agent reviews spec vs implementation for gaps.

  if (!isHotfix) {
    const reviewPath = resolve(delDir, "build-review.md");
    await runAgent("build-reviewer", `You are an adversarial reviewer. You have fresh context — no knowledge of the build process.

Read these files:
- Spec: ${specPath}
- Todo: ${todoPath}
- All files in ${delDir}/

Check for:
1. Gaps between spec.md goals and what was actually built
2. Unchecked items in todo.md
3. Test failures in ${testsDir}/
4. Banned patterns (if BANNED-PATTERNS.md exists, read it and grep deliverables)
5. Placeholder content ("TODO", "coming soon", stub functions)

Write ${reviewPath} with:
- PASS if everything aligns
- BLOCK with specific issues if gaps found

If BLOCK: list exact files and line numbers that need fixing.`,
      15, "build", "sonnet");

    // If reviewer found issues, run a fix pass
    const reviewContent = existsSync(reviewPath)
      ? readFileSync(reviewPath, "utf-8")
      : "";
    if (/BLOCK/i.test(reviewContent)) {
      log("BUILD: Adversarial review BLOCKED — running fix pass");
      await runAgent("build-fixer", `Read the build review at ${reviewPath}.
Fix every issue listed. Re-read spec.md for correct approach.
Run tests in ${testsDir}/ after each fix.
Update todo.md with any new tasks. Check them off when done.
Commit fixes.`, DEFAULT_MAX_TURNS, "build", "sonnet");
    }
  }

  // ── Deterministic post-build commit (existing) ──────────────
  log("BUILD: Verifying all files committed");
  try {
    const opts = { cwd: REPO_PATH, encoding: "utf-8" as const, timeout: 30_000 };
    const status = execSync('git status --short', opts).trim();
    if (status) {
      log(`BUILD: ${status.split("\\n").length} uncommitted files — force-committing`);
      execSync('git add -A', opts);
      execSync(`git commit -m "daemon: auto-commit after build phase for ${project}"`, opts);
    } else {
      log("BUILD: All files committed — clean");
    }
  } catch (err) {
    logError("BUILD: post-build commit failed", err);
  }

  log("PHASE DONE: build");
}
```

### 4. Hang detection via todo.md (optional enhancement)

The daemon watchdog can monitor `todo.md` modification time. If builder hasn't updated it in 10 minutes, it's stuck:

```typescript
// In daemon.ts watchdog, alongside existing timeout check:
const todoPath = resolve(DELIVERABLES_DIR, currentProject, "todo.md");
if (existsSync(todoPath)) {
  const todoMtime = statSync(todoPath).mtimeMs;
  if (Date.now() - todoMtime > 10 * 60 * 1000) {
    log("WATCHDOG: builder hasn't updated todo.md in 10min — likely stuck");
  }
}
```

## Files to Modify

- `daemon/src/pipeline.ts` — rewrite `runBuild()` with 3-step structured build, add `isHotfix` parameter, skip phases conditionally
- `daemon/src/daemon.ts` — add `detectHotfix()`, pass flag to `runPipeline()`, optionally add todo.md watchdog
- `daemon/src/config.ts` — optionally add `HOTFIX_AGENT_TIMEOUT_MS`

## Success Criteria

- [ ] PRDs with `hotfix: true` or fix/patch in title skip debate, creative, and board phases
- [ ] Hotfix pipeline completes in <15 minutes for simple fixes
- [ ] ALL builds (hotfix + full) create spec.md, todo.md, and tests/ before coding
- [ ] Builder consults spec.md before every change and checks off todo.md
- [ ] Builder runs tests after each task and fixes failures before proceeding
- [ ] Full pipeline builds include adversarial mid-build review by fresh sub-agent
- [ ] Single QA pass for hotfixes, two for features
- [ ] Full pipeline unchanged for feature PRDs (debate, creative, board still run)
- [ ] Committed and pushed

## Notes

- Do NOT remove any existing pipeline phases. Only ADD the hotfix path and restructure the build phase.
- The structured build pattern applies to BOTH hotfix and full builds — the difference is scope (fewer todo items for hotfix, no adversarial review for hotfix).
- spec.md and todo.md become inputs for QA — Margaret Hamilton can check todo completion and spec alignment.
- The adversarial review in Step 3 is NOT a replacement for QA. It catches build drift mid-process. QA validates the final output.
