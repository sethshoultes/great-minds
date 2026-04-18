#!/bin/bash
# Check voice and tone requirements

POST_FILE="../phoenix-post.md"

if [ ! -f "$POST_FILE" ]; then
  echo "ERROR: phoenix-post.md not found"
  exit 1
fi

# Check for code blocks (should have real technical content)
CODE_BLOCKS=$(grep -c '```' "$POST_FILE" || echo "0")
if [ "$CODE_BLOCKS" -lt 6 ]; then
  echo "FAIL: Expected at least 3 code blocks (6 backtick markers), found $CODE_BLOCKS"
  exit 1
fi

# Check for concrete error examples/stack traces
if ! grep -q "WATCHDOG\|AGENT HUNG\|AGENT FAILED" "$POST_FILE"; then
  echo "FAIL: Missing concrete error examples with log output"
  exit 1
fi

# Check that it includes real technical details
if ! grep -q "daemon.ts\|pipeline.ts" "$POST_FILE"; then
  echo "FAIL: Missing references to actual source files"
  exit 1
fi

echo "PASS: Voice check - battle-scarred honesty with real technical details"
exit 0
