#!/usr/bin/env bash
# featureDream — autonomous innovation loop
#
# Runs when pipeline is IDLE (no active project). Two modes:
#
# MODE 1: IMPROVE — Board reviews existing products for improvements
#   Jensen: "What's the moat gap?"
#   Oprah: "What's confusing for new users?"
#   Buffett: "What's the revenue opportunity?"
#   Shonda: "What keeps people coming back?"
#   If improvements found → writes PRD → heartbeat picks it up → pipeline runs
#
# MODE 2: DREAM — Agents brainstorm new products
#   Steve + Elon debate 3 product ideas
#   Board votes on the best one
#   Winner becomes a PRD → heartbeat picks it up → pipeline runs
#
# Schedule: runs every 4 hours via crontab (only when idle)
# Cost: ~1 haiku call to check state, full opus only when dreaming

set -uo pipefail

LOG="/tmp/claude-shared/dream.log"
ALERT="/tmp/claude-shared/alerts.log"
REPO="${PIPELINE_REPO:-$(pwd)}"
DREAM_DIR="$REPO/dreams"
PRDS_DIR="$REPO/prds"

log() { echo "$(date '+%Y-%m-%d %H:%M') DREAM: $*" >> "$LOG"; }

# Only run if pipeline is idle
PIPELINE_ACTIVE=$(crontab -l 2>/dev/null | grep -c "pipeline-runner" || true)
PIPELINE_ACTIVE=${PIPELINE_ACTIVE:-0}
STATE=$(grep -oP '(?<=\*\*state\*\*:\s).*' "$REPO/STATUS.md" 2>/dev/null | head -1 || echo "idle")

if [ "$PIPELINE_ACTIVE" -gt 0 ] || { [ "$STATE" != "idle" ] && [ "$STATE" != "operational" ]; }; then
  log "Pipeline active (state=$STATE) — skipping dream"
  exit 0
fi

mkdir -p "$DREAM_DIR" "$PRDS_DIR"

# Decide mode: IMPROVE or DREAM
# Alternate based on day — even days improve, odd days dream
DAY=$(date '+%d')
if [ $((DAY % 2)) -eq 0 ]; then
  MODE="improve"
else
  MODE="dream"
fi

log "MODE: $MODE"

if [ "$MODE" = "improve" ]; then
  # MODE 1: IMPROVE — Board reviews existing products
  LAST_IMPROVE=$(find "$DREAM_DIR" -name "improve-*.md" -mtime -1 2>/dev/null | wc -l | tr -d ' ')
  if [ "$LAST_IMPROVE" -gt 0 ]; then
    log "Already improved in the last 24h — skipping"
    exit 0
  fi

  TIMESTAMP=$(date '+%Y%m%d-%H%M')
  log "Running board improvement review"

  # Board reads recent learnings before reviewing
  LEARNINGS=$(cd "$REPO/memory-store" && npx tsx src/cli.ts search "improvement opportunity" --limit 10 2>/dev/null || echo "(no learnings available)")
  log "Loaded learnings for board context"

  cd "$REPO" && claude -p "
You are Phil Jackson running a featureDream IMPROVE cycle.

Recent learnings from memory store (use these to inform your review):
${LEARNINGS}

Review all shipped products for improvement opportunities:
- LocalGenius (localgenius.company) — AI marketing for local businesses
- Dash (WP Cmd+K command palette) — sethshoultes/dash-command-bar
- Pinned (WP sticky notes) — sethshoultes/pinned-notes
- Great Minds Plugin — sethshoultes/great-minds-plugin
- Shipyard AI (www.shipyard.company) — autonomous site builder

Spawn 4 board members via Agent tool (model: haiku, run_in_background: true):

1. Jensen Huang: For each product, what's the moat gap? What compounds? What's the unfair advantage we're not building?
2. Oprah Winfrey: For each product, what's confusing for new users? What's the first-5-minutes experience?
3. Warren Buffett: For each product, what's the revenue opportunity? What would make this investable?
4. Shonda Rhimes: For each product, what keeps people coming back? What's the retention hook?

Each writes to dreams/improve-${TIMESTAMP}-{name}.md

After all 4 complete, consolidate into dreams/improve-${TIMESTAMP}-summary.md with:
- Top 3 improvements ranked by impact
- If any improvement is significant enough to be a project, write a PRD to prds/ so the pipeline picks it up automatically
" --dangerously-skip-permissions >> "$LOG" 2>&1

else
  # MODE 2: DREAM — Brainstorm new products
  LAST_DREAM=$(find "$DREAM_DIR" -name "dream-*.md" -mtime -2 2>/dev/null | wc -l | tr -d ' ')
  if [ "$LAST_DREAM" -gt 0 ]; then
    log "Already dreamed in the last 48h — skipping"
    exit 0
  fi

  TIMESTAMP=$(date '+%Y%m%d-%H%M')
  log "Running dream cycle — brainstorming new products"

  cd "$REPO" && claude -p "
You are Phil Jackson running a featureDream DREAM cycle.

The agency is idle. Time to innovate. Consider what we're good at:
- WordPress plugins (Dash, Pinned — shipped in one session each)
- SaaS applications (LocalGenius — full stack)
- Multi-agent orchestration (the plugin itself)
- AI integrations (hybrid Claude + Cloudflare Workers AI)
- Video production (Remotion + TTS)

Spawn Steve Jobs and Elon Musk via Agent tool (isolation: worktree, run_in_background: true):

Steve brainstorms 3 product ideas focused on: design quality, user delight, things that make people feel something.
Elon brainstorms 3 product ideas focused on: market size, technical feasibility, things that scale.

Each writes to dreams/dream-${TIMESTAMP}-{name}.md

After both complete, spawn the 4 board members (haiku) to vote:
- Each board member picks their #1 from all 6 ideas and writes a 5-line justification
- Write votes to dreams/dream-${TIMESTAMP}-votes.md

Consolidate: the idea with the most votes (or Phil breaks ties) becomes a PRD.
Write the winning PRD to prds/ so the pipeline picks it up and builds it automatically.

Rules:
- Products must be buildable in one session by the agency
- Must have a clear user and distribution channel
- Prefer products we can dogfood (tools for developers, WordPress ecosystem, AI tooling)
- No vaporware — it ships or it doesn't count
" --dangerously-skip-permissions >> "$LOG" 2>&1

fi

tail -500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
