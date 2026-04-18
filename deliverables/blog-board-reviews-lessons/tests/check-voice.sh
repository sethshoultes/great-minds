#!/bin/bash
# Detect hedging language and ensure definitive voice

set -e

BLOG_FILE="${1:-../patterns.md}"

if [ ! -f "$BLOG_FILE" ]; then
    echo "❌ FAIL: Blog file not found at $BLOG_FILE"
    exit 1
fi

echo "Checking voice quality in $BLOG_FILE..."

# Check for hedging language (banned)
HEDGING_PATTERNS="tends to|often|sometimes|potentially|might|could be|perhaps|maybe|probably"

if grep -iE "$HEDGING_PATTERNS" "$BLOG_FILE"; then
    echo "❌ FAIL: Hedging language detected (use 'always', 'never', 'X/Y times' instead)"
    exit 1
fi

# Check for AI hype language (banned)
HYPE_PATTERNS="AI landscape|rise of AI|AI revolution|game-changing|transformative AI|cutting-edge"

if grep -iE "$HYPE_PATTERNS" "$BLOG_FILE"; then
    echo "❌ FAIL: AI hype language detected (use clinical, honest tone)"
    exit 1
fi

# Check for meta-narrative fluff (banned)
FLUFF_PATTERNS="in today's|in this day and age|as we all know|it goes without saying"

if grep -iE "$FLUFF_PATTERNS" "$BLOG_FILE"; then
    echo "❌ FAIL: Meta-narrative fluff detected"
    exit 1
fi

echo "✅ PASS: Voice is definitive and clinical"
exit 0
