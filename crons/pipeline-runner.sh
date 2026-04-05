#!/usr/bin/env bash
# Pipeline Runner — GSD-enforced, event-driven
#
# Every phase MUST follow the full GSD system. No shortcuts.
# Heartbeat installs this when work is detected. This self-removes when done.
#
# GSD enforcement at every phase:
# - DEBATE: Rick Rubin strips to essence after
# - PLAN: XML task plans, Sara Blakely gut-check, wave grouping
# - BUILD: Wave execution, fresh context per agent, atomic commits,
#          Jony Ive visual review + Maya Angelou copy review BEFORE PR,
#          verification check AFTER each wave, execution report
# - VERIFY: Two independent QA passes, debug agents for failures, UAT against requirements
# - BOARD REVIEW: All 4 members, Shonda retention roadmap
# - SHIP: Marcus retrospective, structured learnings to memory/vector store

set -uo pipefail

LOG="/tmp/claude-shared/pipeline.log"
ALERT="/tmp/claude-shared/alerts.log"
REPO="${PIPELINE_REPO:-$(pwd)}"
QA_PASS_FILE="/tmp/claude-shared/qa-pass-count"

log() { echo "$(date '+%Y-%m-%d %H:%M') PIPELINE: $*" >> "$LOG"; }

STATE=$(grep -oP '(?<=\*\*state\*\*:\s).*' "$REPO/STATUS.md" 2>/dev/null | head -1 || echo "idle")
PROJECT=$(grep -oP '(?<=\*\*active project\*\*:\s).*' "$REPO/STATUS.md" 2>/dev/null | head -1 || echo "")
PROJECT_SLUG=$(echo "$PROJECT" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')

log "state=$STATE project=$PROJECT"

[ ! -f "$QA_PASS_FILE" ] && echo "0" > "$QA_PASS_FILE"

# IDLE — check for new PRDs, uninstall self if nothing
if [ "$STATE" = "idle" ] || [ "$STATE" = "operational" ] || [ -z "$PROJECT" ]; then
  NEW_PRD=$(find "$REPO/prds" -name "*.md" -not -name "TEMPLATE.md" -newer "$REPO/STATUS.md" 2>/dev/null | head -1)
  if [ -n "$NEW_PRD" ]; then
    PROJECT_SLUG=$(basename "$NEW_PRD" .md)
    log "New PRD: $NEW_PRD — STARTING DEBATE"
    echo "0" > "$QA_PASS_FILE"
    cd "$REPO" && claude -p "
You are Phil Jackson. A new PRD arrived: $NEW_PRD

PHASE 1: DEBATE (GSD-enforced)

Step 1: Spawn Steve Jobs and Elon Musk via Agent tool (isolation: worktree, run_in_background: true).
- Steve stakes positions on: design, naming, UX, what makes it great. Writes rounds/${PROJECT_SLUG}/round-1-steve.md
- Elon stakes positions on: architecture, performance, distribution, what to cut. Writes rounds/${PROJECT_SLUG}/round-1-elon.md

Step 2: After both complete, spawn Round 2:
- Steve reads Elon's R1, challenges, defends. Writes rounds/${PROJECT_SLUG}/round-2-steve.md
- Elon reads Steve's R1, challenges, defends. Writes rounds/${PROJECT_SLUG}/round-2-elon.md

Step 3: Consolidate decisions into rounds/${PROJECT_SLUG}/decisions.md

Step 4: Spawn Rick Rubin (model: haiku) to strip decisions to essence — what are the 3 things that actually matter? Writes rounds/${PROJECT_SLUG}/rick-rubin-essence.md

Step 5: Update STATUS.md: state='plan', active project='${PROJECT_SLUG}'
" --dangerously-skip-permissions >> "$LOG" 2>&1
  else
    log "idle — no work — uninstalling pipeline cron"
    crontab -l 2>/dev/null | grep -v "pipeline-runner" | crontab - 2>/dev/null
  fi
  exit 0
fi

case "$STATE" in

  *debate*|*DEBATE*)
    if [ -f "$REPO/rounds/${PROJECT_SLUG}/decisions.md" ]; then
      log "Decisions exist — advancing to PLAN"
      cd "$REPO" && claude -p "
You are Phil Jackson. Debate complete for ${PROJECT_SLUG}.

PHASE 2: PLAN (GSD-enforced)

Read rounds/${PROJECT_SLUG}/decisions.md and the PRD at prds/${PROJECT_SLUG}.md

Step 1: Create structured XML task plans. For EACH task:
  <task-plan>
    <name>Task name</name>
    <wave>1|2|3</wave>
    <owner>Steve Jobs|Elon Musk</owner>
    <inputs>What files/context the agent needs</inputs>
    <outputs>What files the agent produces</outputs>
    <verification>How to verify this task is done correctly</verification>
    <dependencies>Other tasks that must complete first</dependencies>
  </task-plan>

Step 2: Group tasks into dependency-ordered waves. Independent tasks in same wave run in parallel.

Step 3: Write plan to .planning/phase-1-plan.md

Step 4: Spawn Sara Blakely (model: haiku) to gut-check the plan from customer perspective. Would a real customer pay for this? Writes .planning/sara-blakely-review.md

Step 5: Write .planning/REQUIREMENTS.md — checklist of every requirement from the PRD with REQ-IDs for verification tracking.

Step 6: Update STATUS.md state='build'
" --dangerously-skip-permissions >> "$LOG" 2>&1
    else
      log "Waiting for debate decisions"
    fi
    ;;

  *plan*|*PLAN*)
    if [ -f "$REPO/.planning/phase-1-plan.md" ] || [ "$(find "$REPO/.planning" -name "*.md" -newer "$REPO/STATUS.md" 2>/dev/null | wc -l | tr -d ' ')" -gt 0 ]; then
      log "Plan exists — advancing to BUILD"
      cd "$REPO" && claude -p "
You are Phil Jackson. Plan complete for ${PROJECT_SLUG}.

PHASE 3: BUILD / EXECUTE (GSD-enforced — ALL steps mandatory)

Read .planning/phase-1-plan.md for the task plans.

FOR EACH WAVE (sequentially):

  Step 1: PRE-FLIGHT CHECK
  - Verify git tree is clean: git status --short
  - Verify build passes (if applicable)
  - Log pre-flight status

  Step 2: DISPATCH WAVE
  - For each task in this wave, spawn an Agent (isolation: worktree, run_in_background: true)
  - Each agent gets ONLY its task plan + relevant source files (fresh context, no accumulated history)
  - Each agent MUST: create feature branch, make ATOMIC COMMITS (one per logical change), push, create PR
  - Before creating PR: agent MUST spawn Jony Ive (haiku) for visual review if UI task, Maya Angelou (haiku) for copy review if text task

  Step 3: VERIFY WAVE
  - After all agents in this wave complete, check each task's verification criteria from the plan
  - Run: build check, lint check, test check
  - If any task fails verification: spawn a targeted DEBUG AGENT (not a general fix agent) with the specific error and file

  Step 4: EXECUTION REPORT
  - Write .planning/wave-{N}-execution.md documenting: what each agent built, files changed, PRs created, verification results

  Step 5: Merge wave PRs before starting next wave

AFTER ALL WAVES:
  - Write .planning/execution-report.md summarizing all waves
  - Update STATUS.md state='verify'
" --dangerously-skip-permissions >> "$LOG" 2>&1
    else
      log "Waiting for plan"
    fi
    ;;

  *build*|*BUILD*)
    EXEC_REPORT="$REPO/.planning/execution-report.md"
    if [ -f "$EXEC_REPORT" ] || [ "$(find "$REPO/deliverables" -newer "$REPO/STATUS.md" 2>/dev/null | wc -l | tr -d ' ')" -gt 5 ]; then
      # Merge any open PRs first
      gh pr list --repo "sethshoultes/$(basename "$REPO")" --json number --jq '.[].number' 2>/dev/null | while read -r pr; do
        gh pr merge "$pr" --squash --repo "sethshoultes/$(basename "$REPO")" 2>/dev/null && log "Merged PR #$pr"
      done

      QA_COUNT=$(cat "$QA_PASS_FILE" 2>/dev/null || echo 0)
      QA_NUM=$((QA_COUNT + 1))
      log "Build output detected — advancing to VERIFY (QA pass $QA_NUM of 2)"

      cd "$REPO" && claude -p "
You are Phil Jackson. Build complete for ${PROJECT_SLUG}.

PHASE 4: VERIFY — QA PASS $QA_NUM OF 2 (GSD-enforced)

Step 1: Spawn Margaret Hamilton via Agent tool (isolation: worktree) for FULL QA.
She MUST check:
- Syntax: php -l / tsc / eslint on every source file
- Security: SQL injection, XSS, CSRF, unescaped output
- Standards: WordPress coding standards / framework conventions
- Performance: N+1 queries, unbounded loops, missing LIMIT
- Accessibility: ARIA roles, keyboard nav, focus management
- Integration: do the pieces work TOGETHER (not just individually)

Step 2: Run UAT against EVERY requirement in .planning/REQUIREMENTS.md
- For each REQ-ID, verify the requirement is met
- Mark each as PASS/FAIL with evidence

Step 3: If ANY requirement fails:
- Spawn a TARGETED debug agent (isolation: worktree) with the specific failure
- Debug agent fixes ONLY that issue, commits, pushes PR
- Update STATUS.md state='build' (loops back for re-verify after fix)

Step 4: If all pass:
- Write QA report to rounds/${PROJECT_SLUG}/qa-pass-${QA_NUM}.md
- Include: verdict (PASS/BLOCK), requirement coverage (X/Y passed), issues found, fixes applied

Step 5: Spawn Aaron Sorkin (model: haiku) to write a 60-second demo script for the product.

Step 6: Update STATUS.md state='review'
" --dangerously-skip-permissions >> "$LOG" 2>&1
    else
      log "Waiting for build output"
    fi
    ;;

  *verify*|*VERIFY*)
    LATEST_QA=$(find "$REPO/rounds/${PROJECT_SLUG}" -name "qa-pass-*.md" -newer "$REPO/STATUS.md" 2>/dev/null | tail -1)
    if [ -n "$LATEST_QA" ]; then
      QA_VERDICT=$(grep -iE "PASS|GREEN|SHIP|ALL.*PASS" "$LATEST_QA" 2>/dev/null | head -1)
      if [ -n "$QA_VERDICT" ]; then
        QA_COUNT=$(cat "$QA_PASS_FILE" 2>/dev/null || echo 0)
        QA_COUNT=$((QA_COUNT + 1))
        echo "$QA_COUNT" > "$QA_PASS_FILE"
        log "QA pass $QA_COUNT of 2 — verdict: $QA_VERDICT"

        if [ "$QA_COUNT" -ge 2 ]; then
          log "2 QA passes complete — advancing to BOARD REVIEW"
          cd "$REPO" && claude -p "
You are Phil Jackson. QA passed twice for ${PROJECT_SLUG}.

PHASE 5: BOARD REVIEW (GSD-enforced)

Step 1: Spawn ALL 4 board members via Agent tool (model: haiku, run_in_background: true):
- Jensen Huang: tech strategy, data moats, competitive position. What compounds?
- Oprah Winfrey: audience connection, accessibility, first-run experience. Would a normal person get this?
- Warren Buffett: business model, unit economics, moat durability. Would you invest?
- Shonda Rhimes: retention, engagement, narrative arc. Does this keep people coming back?

Each writes a 20-line review to rounds/${PROJECT_SLUG}/board-review-{name}.md

Step 2: Consolidate into rounds/${PROJECT_SLUG}/board-verdict.md with:
- Points of agreement
- Points of tension
- Verdict: PROCEED / PROCEED WITH CHANGES / HOLD / REJECT

Step 3: Spawn Shonda separately for retention roadmap: rounds/${PROJECT_SLUG}/shonda-retention-roadmap.md

Step 4: If HOLD or REJECT — log reason, set STATUS.md to idle, uninstall pipeline
Step 5: If PROCEED — update STATUS.md state='ship'
" --dangerously-skip-permissions >> "$LOG" 2>&1
        else
          log "Need second QA pass — dispatching independent review"
          cd "$REPO" && claude -p "
Second independent QA review for ${PROJECT_SLUG}.
Spawn a FRESH Margaret Hamilton agent (isolation: worktree) — different from the first pass.
Focus on INTEGRATION testing: do all the pieces work together end-to-end?
Run against .planning/REQUIREMENTS.md — verify every REQ-ID.
Write to rounds/${PROJECT_SLUG}/qa-pass-2.md
Update STATUS.md state='review' if passes, 'build' if fails.
" --dangerously-skip-permissions >> "$LOG" 2>&1
        fi
      else
        log "QA FAILED — spawning debug agents"
        cd "$REPO" && claude -p "
QA failed for ${PROJECT_SLUG}. Read the report at $LATEST_QA.
For EACH failure, spawn a TARGETED debug agent (isolation: worktree) that:
1. Reads only the specific failure description
2. Fixes only that issue
3. Commits with message referencing the QA finding
4. Creates a PR
Do NOT do a general fix. Each bug gets its own agent.
After all fixes, update STATUS.md state='build' to re-verify.
" --dangerously-skip-permissions >> "$LOG" 2>&1
      fi
    else
      log "Waiting for QA report"
    fi
    ;;

  *review*|*REVIEW*|*board*)
    REVIEWS=$(find "$REPO/rounds/${PROJECT_SLUG}" -name "board-review-*.md" -newer "$REPO/STATUS.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$REVIEWS" -ge 3 ]; then
      log "Board reviews in ($REVIEWS) — advancing to SHIP"
      cd "$REPO" && claude -p "
You are Phil Jackson. Board review complete for ${PROJECT_SLUG}.

PHASE 6: SHIP (GSD-enforced)

Step 1: Merge all remaining feature branches to main (squash merge)

Step 2: Update STATUS.md: state='idle', clear active project, update metrics

Step 3: Update SCOREBOARD.md with new counts

Step 4: Spawn Marcus Aurelius (model: haiku) to write retrospective:
- What worked well in this project?
- What failed or was inefficient?
- What should we do differently next time?
- Which agents performed best? Which underperformed?
- Write to memory/${PROJECT_SLUG}-retrospective.md

Step 5: Save structured learnings to memory store:
- Run: cd memory-store && ./bin/memory add --type learning --agent 'Phil Jackson' --project '${PROJECT_SLUG}' --content '[key learning]'
- For each major decision, QA finding, and board insight

Step 6: Clean up merged branches

Step 7: Push everything

Step 8: The project is DONE.
" --dangerously-skip-permissions >> "$LOG" 2>&1
      echo "0" > "$QA_PASS_FILE"
      log "Project shipped — uninstalling pipeline cron"
      crontab -l 2>/dev/null | grep -v "pipeline-runner" | crontab - 2>/dev/null
    else
      log "Waiting for board reviews ($REVIEWS so far, need 3+)"
    fi
    ;;

  *ship*|*SHIP*)
    log "Ship phase — finalizing"
    cd "$REPO" && claude -p "Finalize ship for ${PROJECT_SLUG}. Merge remaining branches. Set STATUS.md state to idle. Push." --dangerously-skip-permissions >> "$LOG" 2>&1
    echo "0" > "$QA_PASS_FILE"
    crontab -l 2>/dev/null | grep -v "pipeline-runner" | crontab - 2>/dev/null
    log "Pipeline complete — idle"
    ;;
esac

tail -500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
