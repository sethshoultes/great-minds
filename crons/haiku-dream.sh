#!/usr/bin/env bash
# haiku-dream — lightweight dream cycle with memory maintenance
#
# Runs every 60 minutes. Handles:
# 1. Drift detection (are agents drifting from strategy?)
# 2. Memory maintenance (prune, consolidate, optimize)
#
# Cost: ~1 haiku call for drift check, local-only for maintenance

set -uo pipefail

LOG="/tmp/claude-shared/dream.log"
REPO="${PIPELINE_REPO:-$(pwd)}"

log() { echo "$(date '+%Y-%m-%d %H:%M') HAIKU-DREAM: $*" >> "$LOG"; }

log "Starting haiku dream cycle"

# ── Step 1: Drift detection ──────────────────────────────────────────────

STATUS_FILE="$REPO/STATUS.md"
if [ -f "$STATUS_FILE" ]; then
  STATE=$(grep '\*\*state\*\*' "$STATUS_FILE" 2>/dev/null | sed 's/.*\*\*state\*\*: *//' | head -1 || echo "idle")
  if [ "$STATE" != "idle" ] && [ "$STATE" != "operational" ]; then
    log "Pipeline active (state=$STATE) — running drift check"

    cd "$REPO" && claude -p "
You are the dream-cycle monitor. Quickly check for drift:
1. Read STATUS.md — is the current state making progress?
2. Read the latest round transcript — are agents on-strategy?
3. If drifting, write a brief correction note to STATUS.md

Keep it under 100 words. Only flag genuine issues.
" --model haiku >> "$LOG" 2>&1 || log "Drift check failed (non-fatal)"
  else
    log "Pipeline idle — skipping drift check"
  fi
fi

# ── Step 2: Memory maintenance ───────────────────────────────────────────

log "Running memory maintenance"
cd "$REPO/memory-store" && npx tsx src/cli.ts maintain 2>> "$LOG" || log "Memory maintenance failed (non-fatal)"

log "Haiku dream cycle complete"

# Trim log to last 500 lines
tail -500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
