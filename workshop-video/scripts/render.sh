#!/bin/bash
# Render all video compositions to MP4
# Usage: bash scripts/render.sh [--opening] [--titlecard] [--all]

set -e
cd "$(dirname "$0")/.."

OUTDIR="out"
mkdir -p "$OUTDIR"

render_opening() {
  echo "=== Rendering Workshop Opening (2 min) ==="
  npx remotion render src/index.ts WorkshopOpening "$OUTDIR/workshop-opening.mp4" \
    --codec h264 \
    --crf 18 \
    --log verbose
  echo "  → $OUTDIR/workshop-opening.mp4"
}

render_titlecard() {
  echo "=== Rendering Title Card (10 sec) ==="
  npx remotion render src/index.ts TitleCard "$OUTDIR/title-card.mp4" \
    --codec h264 \
    --crf 18 \
    --log verbose
  echo "  → $OUTDIR/title-card.mp4"
}

case "${1:-all}" in
  --opening)   render_opening ;;
  --titlecard) render_titlecard ;;
  --all|all)
    render_opening
    render_titlecard
    echo ""
    echo "=== All renders complete ==="
    ls -lh "$OUTDIR"/*.mp4
    ;;
  *)
    echo "Usage: bash scripts/render.sh [--opening|--titlecard|--all]"
    exit 1
    ;;
esac
