#!/bin/bash
# Verify that code snippets in the post come from actual source files

POST_FILE="../phoenix-post.md"
DAEMON_FILE="../../../daemon/src/daemon.ts"
PIPELINE_FILE="../../../daemon/src/pipeline.ts"

if [ ! -f "$POST_FILE" ]; then
  echo "ERROR: phoenix-post.md not found"
  exit 1
fi

# Check for presence of key functions mentioned in post
if ! grep -q "acquireLock" "$DAEMON_FILE"; then
  echo "FAIL: acquireLock function referenced in post but not found in daemon.ts"
  exit 1
fi

if ! grep -q "saveQueue\|loadQueue" "$DAEMON_FILE"; then
  echo "FAIL: queue persistence functions referenced in post but not found in daemon.ts"
  exit 1
fi

if ! grep -q "runAgentWithRetry" "$PIPELINE_FILE"; then
  echo "FAIL: runAgentWithRetry function referenced in post but not found in pipeline.ts"
  exit 1
fi

if ! grep -q "runAgentWithTimeout" "$PIPELINE_FILE"; then
  echo "FAIL: runAgentWithTimeout function referenced in post but not found in pipeline.ts"
  exit 1
fi

# Check that chokidar watch snippet is authentic
if ! grep -q "awaitWriteFinish.*stabilityThreshold" "$DAEMON_FILE"; then
  echo "FAIL: chokidar config referenced in post but not found in daemon.ts"
  exit 1
fi

echo "PASS: All code snippets verified as authentic from source files"
exit 0
