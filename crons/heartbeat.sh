#!/usr/bin/env bash
# Smart heartbeat — every 5 min
# Logs health, detects problems, dispatches haiku agent if something's wrong
LOG="/tmp/claude-shared/cron-reports.log"
ALERT="/tmp/claude-shared/alerts.log"
PROBLEMS=""

{
  echo "=== HEARTBEAT $(date '+%H:%M') ==="

  # File count
  FILES=$(find /Users/sethshoultes/Local\ Sites/localgenius/src -type f 2>/dev/null | wc -l | tr -d ' ')
  echo "files: $FILES"
  [ "$FILES" -lt 200 ] && PROBLEMS="$PROBLEMS files_dropped($FILES)"

  # Site checks
  S1=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 https://localgenius.company 2>/dev/null)
  S2=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 https://greatminds.company 2>/dev/null)
  echo "sites: $S1 $S2"
  [ "$S1" != "200" ] && PROBLEMS="$PROBLEMS localgenius_down($S1)"
  [ "$S2" != "200" ] && PROBLEMS="$PROBLEMS greatminds_down($S2)"

  # Memory check
  MEMLINES=$(wc -l < /Users/sethshoultes/Local\ Sites/great-minds/MEMORY.md 2>/dev/null | tr -d ' ')
  echo "memory: $MEMLINES lines"
  [ "$MEMLINES" -gt 100 ] && PROBLEMS="$PROBLEMS memory_bloated($MEMLINES)"

  # DO server check
  DO_STATUS=$(ssh -o ConnectTimeout=5 -o BatchMode=yes -i ~/.ssh/greatminds root@164.90.151.82 \
    'free -h | grep Mem | awk "{print \$3\"/\"\$2}"' 2>/dev/null)
  if [ -z "$DO_STATUS" ]; then
    echo "DO: UNREACHABLE"
    PROBLEMS="$PROBLEMS do_unreachable"
  else
    echo "DO: $DO_STATUS"
    # Check if DO memory is over 90%
    DO_USED=$(ssh -o ConnectTimeout=5 -o BatchMode=yes -i ~/.ssh/greatminds root@164.90.151.82 \
      'free | grep Mem | awk "{printf \"%.0f\", \$3/\$2*100}"' 2>/dev/null)
    [ -n "$DO_USED" ] && [ "$DO_USED" -gt 90 ] && PROBLEMS="$PROBLEMS do_memory_critical(${DO_USED}%)"
  fi

  # Git dirty check
  for repo in localgenius great-minds great-minds-plugin; do
    DIR="/Users/sethshoultes/Local Sites/$repo"
    [ -d "$DIR/.git" ] || continue
    DIRTY=$(git -C "$DIR" status --short 2>/dev/null | wc -l | tr -d ' ')
    [ "$DIRTY" -gt 10 ] && PROBLEMS="$PROBLEMS ${repo}_very_dirty($DIRTY)"
  done

  # Open PR check
  PR_COUNT=$(gh pr list --repo sethshoultes/great-minds --json number 2>/dev/null | grep -c "number" || echo 0)
  PR_COUNT2=$(gh pr list --repo sethshoultes/localgenius --json number 2>/dev/null | grep -c "number" || echo 0)
  TOTAL_PRS=$((PR_COUNT + PR_COUNT2))
  [ "$TOTAL_PRS" -gt 0 ] && echo "open_prs: $TOTAL_PRS"

  echo ""
} >> "$LOG"

# If problems detected, log alert and dispatch haiku to diagnose
if [ -n "$PROBLEMS" ]; then
  echo "$(date '+%Y-%m-%d %H:%M') HEARTBEAT ALERT: $PROBLEMS" >> "$ALERT"

  # Dispatch haiku agent to diagnose and recommend fix
  DIAGNOSIS=$(claude --model haiku --print "You are a system monitor. These problems were detected: $PROBLEMS. For each problem, give a 1-line diagnosis and 1-line fix command. Be specific." 2>/dev/null)

  if [ -n "$DIAGNOSIS" ]; then
    echo "$(date '+%Y-%m-%d %H:%M') HAIKU DIAGNOSIS:" >> "$ALERT"
    echo "$DIAGNOSIS" >> "$ALERT"
    echo "" >> "$ALERT"
  fi
fi

tail -200 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
tail -100 "$ALERT" > "$ALERT.tmp" 2>/dev/null && mv "$ALERT.tmp" "$ALERT" 2>/dev/null
