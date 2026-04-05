#!/usr/bin/env bash
# Pipeline Runner — event-driven, not always-on
#
# IDLE MODE: Only heartbeat.sh runs (free bash). This script is NOT in crontab.
# When heartbeat detects work (new PRD, new issue, alert), it installs this
# script into crontab. This script runs the pipeline to completion, then
# removes itself from crontab. Back to idle.
#
# Flow: heartbeat detects → installs pipeline cron → pipeline runs →
#       phases advance → 2 QA passes → ship → uninstall pipeline cron → idle

set -euo pipefail

LOG="/tmp/claude-shared/pipeline.log"
ALERT="/tmp/claude-shared/alerts.log"
REPO="${PIPELINE_REPO:-$(pwd)}"
QA_PASS_FILE="/tmp/claude-shared/qa-pass-count"

log() { echo "$(date '+%Y-%m-%d %H:%M') PIPELINE: $*" >> "$LOG"; }

# Read current state
STATE=$(grep -oP '(?<=\*\*state\*\*:\s).*' "$REPO/STATUS.md" 2>/dev/null | head -1 || echo "idle")
PROJECT=$(grep -oP '(?<=\*\*active project\*\*:\s).*' "$REPO/STATUS.md" 2>/dev/null | head -1 || echo "")
PROJECT_SLUG=$(echo "$PROJECT" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')

log "state=$STATE project=$PROJECT slug=$PROJECT_SLUG"

# If idle with no project, we shouldn't be running — uninstall self
if [ "$STATE" = "idle" ] || [ -z "$PROJECT" ]; then
  # Check for new PRDs one more time
  NEW_PRD=$(find "$REPO/prds" -name "*.md" -not -name "TEMPLATE.md" -newer "$REPO/STATUS.md" 2>/dev/null | head -1)
  if [ -n "$NEW_PRD" ]; then
    PROJECT_SLUG=$(basename "$NEW_PRD" .md)
    log "New PRD detected: $NEW_PRD — starting DEBATE"
    cd "$REPO" && claude -p "
You are Phil Jackson, orchestrator of Great Minds Agency.
A new PRD has arrived: $NEW_PRD
Read it. Start Phase 1: DEBATE.
Spawn Steve Jobs and Elon Musk via Agent tool (isolation: worktree, run_in_background: true).
Steve writes rounds/${PROJECT_SLUG}/round-1-steve.md
Elon writes rounds/${PROJECT_SLUG}/round-1-elon.md
When both finish, dispatch Round 2 (each challenges the other).
Then consolidate decisions to rounds/${PROJECT_SLUG}/decisions.md
Spawn Rick Rubin (haiku) to strip decisions to essence.
Update STATUS.md: state to 'plan', active project to '${PROJECT_SLUG}'.
" --dangerously-skip-permissions >> "$LOG" 2>&1
    echo "0" > "$QA_PASS_FILE"
  else
    log "idle — no work — uninstalling pipeline cron"
    # Remove self from crontab
    crontab -l 2>/dev/null | grep -v "pipeline-runner" | crontab - 2>/dev/null
  fi
  exit 0
fi

# Reset QA counter if it doesn't exist
[ ! -f "$QA_PASS_FILE" ] && echo "0" > "$QA_PASS_FILE"

case "$STATE" in
  *debate*|*DEBATE*)
    DECISIONS="$REPO/rounds/${PROJECT_SLUG}/decisions.md"
    if [ -f "$DECISIONS" ]; then
      log "Decisions exist — advancing to PLAN"
      cd "$REPO" && claude -p "
You are Phil Jackson. Debate is complete for ${PROJECT_SLUG}.
Read $DECISIONS. Start Phase 2: PLAN.
Create structured task plans from the debate decisions.
Spawn Sara Blakely (haiku) to gut-check from customer perspective.
Write plans to .planning/ directory.
Update STATUS.md state to 'build'.
" --dangerously-skip-permissions >> "$LOG" 2>&1
    else
      log "Waiting for debate to complete"
    fi
    ;;

  *plan*|*PLAN*)
    PLANS=$(find "$REPO/.planning" -name "*.md" -newer "$REPO/STATUS.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$PLANS" -gt 0 ]; then
      log "Plans exist ($PLANS files) — advancing to BUILD"
      cd "$REPO" && claude -p "
You are Phil Jackson. Plan is complete for ${PROJECT_SLUG}.
Start Phase 3: BUILD (execute).
Spawn agents via Agent tool (isolation: worktree, run_in_background: true).
Steve handles frontend/design, Elon handles backend/architecture.
Before any PR: spawn Jony Ive (haiku) for visual review, Maya Angelou (haiku) for copy review.
Each agent creates a feature branch, builds, commits, pushes, creates a PR.
Update STATUS.md state to 'verify' when all agents complete.
" --dangerously-skip-permissions >> "$LOG" 2>&1
    else
      log "Waiting for plans"
    fi
    ;;

  *build*|*BUILD*)
    # Check if build agents have completed (PRs created or no agents running)
    OPEN_PRS=$(gh pr list --repo "sethshoultes/$(basename "$REPO")" --json number 2>/dev/null | grep -c "number" || echo 0)
    BUILD_FILES=$(find "$REPO/deliverables" -newer "$REPO/STATUS.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$BUILD_FILES" -gt 0 ] || [ "$OPEN_PRS" -gt 0 ]; then
      log "Build output detected ($BUILD_FILES files, $OPEN_PRS PRs) — advancing to VERIFY"
      # Merge any open PRs first
      if [ "$OPEN_PRS" -gt 0 ]; then
        gh pr list --repo "sethshoultes/$(basename "$REPO")" --json number --jq '.[].number' 2>/dev/null | while read -r pr; do
          gh pr merge "$pr" --squash --repo "sethshoultes/$(basename "$REPO")" 2>/dev/null && log "Merged PR #$pr"
        done
      fi
      cd "$REPO" && claude -p "
You are Phil Jackson. Build is complete for ${PROJECT_SLUG}.
Start Phase 4: VERIFY (QA pass $(( $(cat $QA_PASS_FILE) + 1 )) of 2).
Spawn Margaret Hamilton via Agent tool (isolation: worktree) for full QA.
Check everything: syntax, security, compliance, requirements coverage, live testing.
Spawn Aaron Sorkin (haiku) to write a demo script for the feature.
Write QA report to rounds/${PROJECT_SLUG}/qa-pass-$(( $(cat $QA_PASS_FILE) + 1 )).md
If QA PASSES: update STATUS.md state to 'review'.
If QA FAILS: fix the issues, then update STATUS.md state to 'build' (loops back for re-verify).
" --dangerously-skip-permissions >> "$LOG" 2>&1
    else
      log "Waiting for build output"
    fi
    ;;

  *verify*|*VERIFY*)
    QA_REPORTS=$(find "$REPO/rounds/${PROJECT_SLUG}" -name "qa-pass-*.md" 2>/dev/null | wc -l | tr -d ' ')
    LATEST_QA=$(find "$REPO/rounds/${PROJECT_SLUG}" -name "qa-pass-*.md" -newer "$REPO/STATUS.md" 2>/dev/null | tail -1)
    if [ -n "$LATEST_QA" ]; then
      # Check if QA passed
      QA_VERDICT=$(grep -i "PASS\|GREEN\|SHIP" "$LATEST_QA" 2>/dev/null | head -1)
      if [ -n "$QA_VERDICT" ]; then
        QA_COUNT=$(cat "$QA_PASS_FILE" 2>/dev/null || echo 0)
        QA_COUNT=$((QA_COUNT + 1))
        echo "$QA_COUNT" > "$QA_PASS_FILE"
        log "QA pass $QA_COUNT of 2 — verdict: $QA_VERDICT"

        if [ "$QA_COUNT" -ge 2 ]; then
          log "2 QA passes complete — advancing to BOARD REVIEW"
          cd "$REPO" && claude -p "
You are Phil Jackson. QA passed twice for ${PROJECT_SLUG}.
Start Phase 5: BOARD REVIEW.
Spawn all 4 board members via Agent tool (model: haiku, run_in_background: true):
- Jensen Huang: tech strategy, data moats
- Oprah Winfrey: audience, accessibility
- Warren Buffett: business model, economics
- Shonda Rhimes: retention, engagement
Each writes a 20-line review to rounds/${PROJECT_SLUG}/board-review-{name}.md
Consolidate into board verdict.
Spawn Shonda separately for retention roadmap.
Update STATUS.md state to 'ship' when complete.
" --dangerously-skip-permissions >> "$LOG" 2>&1
        else
          log "QA pass $QA_COUNT — need 1 more. Re-running verify."
          cd "$REPO" && claude -p "
QA pass $QA_COUNT complete for ${PROJECT_SLUG}. Need a second independent QA review.
Spawn a DIFFERENT Margaret Hamilton agent (fresh context, worktree isolation) for QA pass 2.
Focus on integration testing — do the pieces work together?
Write to rounds/${PROJECT_SLUG}/qa-pass-2.md
Update STATUS.md state to 'review' when complete.
" --dangerously-skip-permissions >> "$LOG" 2>&1
        fi
      else
        log "QA FAILED — looping back to build for fixes"
        cd "$REPO" && claude -p "
QA failed for ${PROJECT_SLUG}. Read the QA report at $LATEST_QA.
Fix all issues found. Then update STATUS.md state to 'build' so the pipeline re-verifies.
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
Start Phase 6: SHIP.
- Merge all remaining feature branches to main (squash merge)
- Update STATUS.md: state to 'idle', clear active project
- Update SCOREBOARD.md with new counts
- Spawn Marcus Aurelius (haiku) to write retrospective to memory/${PROJECT_SLUG}-retrospective.md
- Clean up merged branches
- Push everything
- The project is DONE.
" --dangerously-skip-permissions >> "$LOG" 2>&1

      # Reset QA counter
      echo "0" > "$QA_PASS_FILE"

      # After ship completes, uninstall self from crontab
      log "Project shipped — uninstalling pipeline cron — back to idle"
      crontab -l 2>/dev/null | grep -v "pipeline-runner" | crontab - 2>/dev/null
    else
      log "Waiting for board reviews ($REVIEWS so far, need 3+)"
    fi
    ;;

  *ship*|*SHIP*)
    log "Ship phase — finalizing and shutting down"
    cd "$REPO" && claude -p "
Finalize ship for ${PROJECT_SLUG}. Merge remaining branches. Set STATUS.md state to idle. Push.
" --dangerously-skip-permissions >> "$LOG" 2>&1
    echo "0" > "$QA_PASS_FILE"
    crontab -l 2>/dev/null | grep -v "pipeline-runner" | crontab - 2>/dev/null
    log "Pipeline complete — cron removed — idle"
    ;;
esac

tail -500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
