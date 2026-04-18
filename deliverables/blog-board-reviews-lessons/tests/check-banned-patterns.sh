#!/bin/bash
# Check for banned patterns in blog post

set -e

BLOG_FILE="${1:-../patterns.md}"

if [ ! -f "$BLOG_FILE" ]; then
    echo "❌ FAIL: Blog file not found at $BLOG_FILE"
    exit 1
fi

echo "Checking for banned patterns in $BLOG_FILE..."

# Check for hardcoded paths
if grep -n "/Users/sethshoultes" "$BLOG_FILE"; then
    echo "❌ FAIL: Hardcoded absolute path found"
    exit 1
fi

# Check for secrets (shouldn't be any in a blog post, but be safe)
if grep -E "sk-[a-zA-Z0-9]{20,}|cfat_|gho_" "$BLOG_FILE"; then
    echo "❌ FAIL: Potential secret/API key found"
    exit 1
fi

echo "✅ PASS: No banned patterns detected"
exit 0
