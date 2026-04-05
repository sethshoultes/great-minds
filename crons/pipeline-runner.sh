#!/usr/bin/env bash
# Pipeline Runner v3 — Granular single-step states
#
# ONE claude -p call per cron run. ONE step. Check result. Advance.
# Each step is small enough that claude -p completes it reliably.
#
# States flow:
#   idle → debate-r1 → debate-r2 → debate-decisions →
#   plan-tasks → plan-review →
#   build-wave → build-verify →
#   qa-1 → qa-1-fix → qa-2 →
#   board-review → board-verdict →
#   ship → idle
#
# Heartbeat installs this. Self-removes on ship or idle-with-no-work.

set -uo pipefail

LOG="/tmp/claude-shared/pipeline.log"
REPO="${PIPELINE_REPO:-$(pwd)}"
QA_FILE="/tmp/claude-shared/qa-pass-count"
STATE_FILE="$REPO/STATUS.md"
# Plugin path detected below after REPO is set

log() { echo "$(date '+%Y-%m-%d %H:%M') PIPE: $*" >> "$LOG"; }

# Read state — works on macOS AND Linux, handles any STATUS.md format
# Matches: **state**, **Agency state**, **pipeline**, case-insensitive
STATE=$(grep -i '\*\*.*state\*\*' "$STATE_FILE" 2>/dev/null | head -1 | sed 's/.*\*\*: *//' | tr '[:upper:]' '[:lower:]' | tr -d ' ')
[ -z "$STATE" ] && STATE="idle"
# Match project name — tries multiple formats
# Try ## heading first (most specific), then ** bold (fallback)
PROJECT=$(grep -i '^## Active Project' "$STATE_FILE" 2>/dev/null | head -1 | sed 's/.*: *//' | sed 's/ (.*//')
[ -z "$PROJECT" ] && PROJECT=$(grep -i 'active project\*\*' "$STATE_FILE" 2>/dev/null | head -1 | sed 's/.*\*\*: *//' | grep -v '^[0-9]*$')
[ -z "$PROJECT" ] && PROJECT=""
# Plugin path — detect environment
PLUGIN_PATH=""
for p in "/Users/sethshoultes/Local Sites/great-minds-plugin" "/home/agent/great-minds-plugin" "$REPO/../great-minds-plugin"; do
  [ -d "$p/skills" ] && PLUGIN_PATH="$p" && break
done
SLUG=$(echo "$PROJECT" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
ROUNDS="$REPO/rounds/$SLUG"

log "state=[$STATE] project=[$PROJECT] slug=[$SLUG]"

# Helper: update pipeline state in STATUS.md
set_state() {
  local new_state="$1"
  if grep -q '\*\*pipeline\*\*' "$STATE_FILE" 2>/dev/null; then
    sed -i '' "s/\*\*pipeline\*\*:.*/\*\*pipeline\*\*: $new_state/" "$STATE_FILE"
  elif grep -q '\*\*state\*\*' "$STATE_FILE" 2>/dev/null; then
    sed -i '' "s/\*\*state\*\*:.*/\*\*state\*\*: $new_state/" "$STATE_FILE"
  fi
  log "STATE → $new_state"
}

set_project() {
  if grep -q '\*\*active project\*\*' "$STATE_FILE" 2>/dev/null; then
    sed -i '' "s/\*\*active project\*\*:.*/\*\*active project\*\*: $1/" "$STATE_FILE"
  fi
}

# Helper: single-step claude -p with timeout
run_step() {
  local step_name="$1"
  local prompt="$2"
  log "STEP: $step_name"
  cd "$REPO" && timeout 600 claude -p "$prompt" --dangerously-skip-permissions >> "$LOG" 2>&1
  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    log "STEP FAILED: $step_name (exit $exit_code)"
    return 1
  fi
  log "STEP DONE: $step_name"
  return 0
}

# ============================================================
# STATE MACHINE — one step per run
# ============================================================

case "$STATE" in

  idle|operational|"")
    # Check for new PRDs
    NEW_PRD=$(find "$REPO/prds" -name "*.md" -not -name "TEMPLATE.md" -not -name "emdash-*" -newer "$STATE_FILE" 2>/dev/null | head -1)
    if [ -n "$NEW_PRD" ]; then
      SLUG=$(basename "$NEW_PRD" .md)
      mkdir -p "$REPO/rounds/$SLUG"
      set_project "$SLUG"
      set_state "debate-r1"
      log "NEW PRD: $NEW_PRD → starting debate-r1"
    else
      log "idle — no new PRDs — uninstalling"
      crontab -l 2>/dev/null | grep -v "pipeline-runner" | crontab - 2>/dev/null
    fi
    ;;

  debate-r1)
    if [ -f "$ROUNDS/round-1-steve.md" ] && [ -f "$ROUNDS/round-1-elon.md" ]; then
      log "R1 already exists — advancing"
      set_state "debate-r2"
    else
      run_step "debate-r1" "Read the PRD at prds/${SLUG}.md. Write TWO debate files:
1. rounds/${SLUG}/round-1-steve.md — Steve Jobs stakes positions on design, naming, UX, what makes it great
2. rounds/${SLUG}/round-1-elon.md — Elon Musk stakes positions on architecture, performance, distribution, what to cut
Write BOTH files. Each should be 40-60 lines with clear positions." && set_state "debate-r2"
    fi
    ;;

  debate-r2)
    if [ -f "$ROUNDS/round-2-steve.md" ] && [ -f "$ROUNDS/round-2-elon.md" ]; then
      log "R2 already exists — advancing"
      set_state "debate-decisions"
    else
      run_step "debate-r2" "Read rounds/${SLUG}/round-1-steve.md and rounds/${SLUG}/round-1-elon.md.
Write TWO challenge files:
1. rounds/${SLUG}/round-2-steve.md — Steve challenges Elon's R1 positions, defends his own
2. rounds/${SLUG}/round-2-elon.md — Elon challenges Steve's R1 positions, defends his own
Lock the 3 decisions that matter most in each file." && set_state "debate-decisions"
    fi
    ;;

  debate-decisions)
    if [ -f "$ROUNDS/decisions.md" ]; then
      log "Decisions exist — advancing"
      set_state "plan-tasks"
    else
      run_step "debate-decisions" "Read all 4 debate files in rounds/${SLUG}/.
Write rounds/${SLUG}/decisions.md — consolidated locked decisions.
For each decision: who proposed it, who won, why. Include MVP feature set and file structure.
This is the blueprint for the build phase." && set_state "plan-tasks"
    fi
    ;;

  plan-tasks)
    if [ -f "$REPO/.planning/phase-1-plan.md" ]; then
      log "Plan exists — advancing"
      set_state "plan-review"
    else
      mkdir -p "$REPO/.planning"
      run_step "plan-tasks" "Read and follow the instructions in the /agency-plan skill at $PLUGIN_PATH/skills/agency-plan/SKILL.md.
Use project slug '${SLUG}'. Read rounds/${SLUG}/decisions.md and prds/${SLUG}.md as inputs.
Write output to .planning/phase-1-plan.md and .planning/REQUIREMENTS.md." && set_state "plan-review"
    fi
    ;;

  plan-review)
    if [ -f "$REPO/.planning/sara-blakely-review.md" ]; then
      log "Plan review exists — advancing"
      set_state "build-wave"
    else
      run_step "plan-review" "Read .planning/phase-1-plan.md.
Write .planning/sara-blakely-review.md — gut-check from customer perspective:
Would a real customer pay for this? What's confusing? What's the 30-second pitch?
Keep it under 30 lines." && set_state "build-wave"
    fi
    ;;

  build-wave)
    run_step "build-wave" "Read and follow the instructions in the /agency-execute skill at $PLUGIN_PATH/skills/agency-execute/SKILL.md.
Use project slug '${SLUG}'. Read .planning/phase-1-plan.md and rounds/${SLUG}/decisions.md as inputs.
Put all output in deliverables/${SLUG}/. Write .planning/execution-report.md when done.
Commit everything on a feature branch and push." && set_state "build-verify"
    ;;

  build-verify)
    if [ -f "$REPO/.planning/execution-report.md" ]; then
      log "Execution report exists — advancing to QA"
      echo "0" > "$QA_FILE"
      set_state "qa-1"
    else
      # Check if files were built even without report
      BUILD_FILES=$(find "$REPO/deliverables/$SLUG" -type f 2>/dev/null | wc -l | tr -d ' ')
      if [ "$BUILD_FILES" -gt 3 ]; then
        log "Build files exist ($BUILD_FILES) without report — creating report and advancing"
        run_step "build-report" "Look at all files in deliverables/${SLUG}/. Write .planning/execution-report.md documenting what was built — file names, line counts, what each file does." && { echo "0" > "$QA_FILE"; set_state "qa-1"; }
      else
        log "Waiting for build output ($BUILD_FILES files)"
      fi
    fi
    ;;

  qa-1)
    QA_NUM=$(($(cat "$QA_FILE" 2>/dev/null || echo 0) + 1))
    run_step "qa-pass-$QA_NUM" "Read and follow the instructions in the /agency-verify skill at $PLUGIN_PATH/skills/agency-verify/SKILL.md.
Use project slug '${SLUG}'. Verify deliverables/${SLUG}/ against .planning/REQUIREMENTS.md.
Write rounds/${SLUG}/qa-pass-${QA_NUM}.md with verdict: PASS or BLOCK.
For each requirement in REQUIREMENTS.md, mark PASS or FAIL with evidence.
If BLOCK: list every issue that must be fixed." \
    && {
      VERDICT=$(grep -iE "PASS|GREEN|SHIP" "$ROUNDS/qa-pass-${QA_NUM}.md" 2>/dev/null | head -1)
      if [ -n "$VERDICT" ]; then
        echo "$QA_NUM" > "$QA_FILE"
        if [ "$QA_NUM" -ge 2 ]; then
          set_state "board-review"
        else
          set_state "qa-2"
        fi
      else
        set_state "qa-fix"
      fi
    }
    ;;

  qa-fix)
    run_step "qa-fix" "Read the latest QA report in rounds/${SLUG}/. Fix every issue listed.
Edit the files directly in deliverables/${SLUG}/. Commit fixes." && set_state "qa-1"
    ;;

  qa-2)
    run_step "qa-pass-2" "Read and follow the instructions in the /agency-verify skill at $PLUGIN_PATH/skills/agency-verify/SKILL.md.
Use project slug '${SLUG}'. This is QA pass 2 — focus on integration: do all pieces work together?
Verify deliverables/${SLUG}/ against .planning/REQUIREMENTS.md.
Write rounds/${SLUG}/qa-pass-2.md with verdict: PASS or BLOCK." \
    && {
      VERDICT=$(grep -iE "PASS|GREEN|SHIP" "$ROUNDS/qa-pass-2.md" 2>/dev/null | head -1)
      if [ -n "$VERDICT" ]; then
        echo "2" > "$QA_FILE"
        set_state "board-review"
      else
        set_state "qa-fix"
      fi
    }
    ;;

  board-review)
    if [ "$(find "$ROUNDS" -name 'board-review-*.md' 2>/dev/null | wc -l | tr -d ' ')" -ge 3 ]; then
      log "Board reviews exist — advancing"
      set_state "board-verdict"
    else
      run_step "board-review" "Read and follow the instructions in the /agency-board-review skill at $PLUGIN_PATH/skills/agency-board-review/SKILL.md.
Use project slug '${SLUG}'. Review deliverables/${SLUG}/ and the PRD at prds/${SLUG}.md.
Write board review files to rounds/${SLUG}/." && set_state "board-verdict"
    fi
    ;;

  board-verdict)
    if [ -f "$ROUNDS/board-verdict.md" ]; then
      log "Verdict exists — advancing to ship"
      set_state "ship"
    else
      run_step "board-verdict" "Read all board reviews in rounds/${SLUG}/board-review-*.md.
Write rounds/${SLUG}/board-verdict.md — consolidated verdict:
Points of agreement, points of tension, overall verdict (PROCEED/HOLD/REJECT).
Write rounds/${SLUG}/shonda-retention-roadmap.md — what keeps users coming back, v1.1 features." && set_state "ship"
    fi
    ;;

  ship)
    run_step "ship" "Read and follow the instructions in the /agency-ship skill at $PLUGIN_PATH/skills/agency-ship/SKILL.md.
Use project slug '${SLUG}'. Ship the project: commit, write retrospective, push, update scoreboard." \
    && {
      set_state "idle"
      set_project ""
      log "PROJECT SHIPPED: $SLUG"
      # Uninstall self
      crontab -l 2>/dev/null | grep -v "pipeline-runner" | crontab - 2>/dev/null
      log "Pipeline cron removed — back to idle"
    }
    ;;

  *)
    log "Unknown state: $STATE — resetting to idle"
    set_state "idle"
    ;;

esac

tail -500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
