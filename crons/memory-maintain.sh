#!/usr/bin/env bash
# Memory maintenance — every 6 hours
# Prunes duplicates, consolidates clusters, optimizes scores
# No AI cost — pure local computation (TF-IDF)
LOG="/tmp/claude-shared/cron-reports.log"
REPO="${PIPELINE_REPO:-/Users/sethshoultes/Local Sites/great-minds}"

{
  echo "=== MEMORY MAINTAIN $(date '+%H:%M') ==="
  cd "$REPO/memory-store" && npx tsx src/cli.ts maintain 2>&1
  echo ""
} >> "$LOG"

tail -200 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
