#!/bin/bash
# Verify the Phoenix post has the required structure

POST_FILE="../phoenix-post.md"

if [ ! -f "$POST_FILE" ]; then
  echo "ERROR: phoenix-post.md not found"
  exit 1
fi

# Check for Phoenix framing in title
TITLE=$(head -1 "$POST_FILE")
if ! echo "$TITLE" | grep -qi "phoenix\|won't stay dead"; then
  echo "FAIL: Title doesn't include Phoenix framing"
  echo "Found: $TITLE"
  exit 1
fi

# Check for 48 restarts in first 100 words
FIRST_100=$(head -10 "$POST_FILE" | head -c 800)
if ! echo "$FIRST_100" | grep -qi "48"; then
  echo "FAIL: First 100 words don't mention '48 restarts'"
  exit 1
fi

# Check for three main sections
if ! grep -q "## The tmux Attempt" "$POST_FILE"; then
  echo "FAIL: Missing 'The tmux Attempt' section"
  exit 1
fi

if ! grep -q "## The Failure Cascade" "$POST_FILE"; then
  echo "FAIL: Missing 'The Failure Cascade' section"
  exit 1
fi

if ! grep -q "## The systemd Solution" "$POST_FILE"; then
  echo "FAIL: Missing 'The systemd Solution' section"
  exit 1
fi

# Check for conclusion section
if ! grep -q "## What Works Now" "$POST_FILE"; then
  echo "FAIL: Missing 'What Works Now' conclusion section"
  exit 1
fi

echo "PASS: Structure verified - Phoenix title, 48 restarts in opening, all required sections present"
exit 0
