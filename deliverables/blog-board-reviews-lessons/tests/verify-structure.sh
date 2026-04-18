#!/bin/bash
# Verify markdown structure and required sections

set -e

BLOG_FILE="${1:-../patterns.md}"

if [ ! -f "$BLOG_FILE" ]; then
    echo "❌ FAIL: Blog file not found at $BLOG_FILE"
    exit 1
fi

echo "Verifying structure of $BLOG_FILE..."

# Check for title (# Patterns)
if ! grep -q "^# Patterns" "$BLOG_FILE"; then
    echo "❌ FAIL: Missing title '# Patterns'"
    exit 1
fi

# Check for minimum section headers (should have 4-box framework)
HEADER_COUNT=$(grep -c "^##" "$BLOG_FILE" || echo "0")
if [ "$HEADER_COUNT" -lt 4 ]; then
    echo "❌ FAIL: Found only $HEADER_COUNT section headers, need at least 4 for 4-box framework"
    exit 1
fi

# Check word count (800-2000 words)
WORD_COUNT=$(wc -w < "$BLOG_FILE" | tr -d ' ')
if [ "$WORD_COUNT" -lt 800 ]; then
    echo "❌ FAIL: Word count $WORD_COUNT is below minimum 800"
    exit 1
fi
if [ "$WORD_COUNT" -gt 2000 ]; then
    echo "⚠️  WARNING: Word count $WORD_COUNT exceeds target 2000 (acceptable if every sentence earns its place)"
fi

echo "✅ Word count: $WORD_COUNT (target: 800-2000)"

# Check for blockquotes
QUOTE_COUNT=$(grep -c "^>" "$BLOG_FILE" || echo "0")
echo "✅ Blockquote lines: $QUOTE_COUNT (target: 8+)"

# Check for proper markdown syntax (no broken blockquotes, headers)
if grep -E "^>{2,}" "$BLOG_FILE"; then
    echo "⚠️  WARNING: Found potential broken blockquote formatting (>> instead of >)"
fi

echo "✅ PASS: Structure verification complete"
exit 0
