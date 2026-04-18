#!/bin/bash
# Test: Script Structure Check
# Verifies sync.sh has correct structure and required components

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
SYNC_SCRIPT="$REPO_ROOT/sync.sh"

echo "🔍 Testing sync.sh structure..."

# Check if sync.sh exists
if [[ ! -f "$SYNC_SCRIPT" ]]; then
  echo "❌ FAIL: sync.sh not found at $SYNC_SCRIPT"
  exit 1
fi

FAILURES=0

# Test 1: Check shebang line
echo "  Checking shebang line..."
FIRST_LINE=$(head -1 "$SYNC_SCRIPT")
if [[ "$FIRST_LINE" != "#!/bin/bash" && "$FIRST_LINE" != "#!/usr/bin/env bash" ]]; then
  echo "  ❌ FAIL: First line should be #!/bin/bash or #!/usr/bin/env bash"
  echo "  Found: $FIRST_LINE"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: Correct shebang line"
fi

# Test 2: Check for set -e (fail-fast)
echo "  Checking for 'set -e' directive..."
if ! grep -q "^set -e" "$SYNC_SCRIPT"; then
  echo "  ❌ FAIL: 'set -e' not found (required for fail-fast behavior)"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: 'set -e' directive present"
fi

# Test 3: Check for PLUGIN_ROOT variable
echo "  Checking for PLUGIN_ROOT variable..."
if ! grep -q "PLUGIN_ROOT=" "$SYNC_SCRIPT"; then
  echo "  ❌ FAIL: PLUGIN_ROOT variable not defined"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: PLUGIN_ROOT variable defined"
fi

# Test 4: Check for GREAT_MINDS_ROOT variable
echo "  Checking for GREAT_MINDS_ROOT variable..."
if ! grep -q "GREAT_MINDS_ROOT=" "$SYNC_SCRIPT"; then
  echo "  ❌ FAIL: GREAT_MINDS_ROOT variable not defined"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: GREAT_MINDS_ROOT variable defined"
fi

# Test 5: Check for pre-flight validation - git status check
echo "  Checking for git status validation..."
if ! grep -q "git status" "$SYNC_SCRIPT"; then
  echo "  ❌ FAIL: git status validation not found"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: git status validation present"
fi

# Test 6: Check for pre-flight validation - source directory check
echo "  Checking for source directory validation..."
# Looking for [[ -d ... ]] or [ -d ... ] with daemon/src
if grep -q "\[\[.*-d.*daemon/src" "$SYNC_SCRIPT" || grep -q "\[.*-d.*daemon/src" "$SYNC_SCRIPT"; then
  echo "  ✅ PASS: Source directory validation present"
else
  echo "  ❌ FAIL: Source directory validation not found"
  FAILURES=$((FAILURES + 1))
fi

# Test 7: Check for npm availability check
echo "  Checking for npm availability validation..."
if ! grep -q "command -v npm" "$SYNC_SCRIPT" && ! grep -q "which npm" "$SYNC_SCRIPT"; then
  echo "  ❌ FAIL: npm availability check not found"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: npm availability check present"
fi

# Test 8: Check for error messages with ❌ emoji
echo "  Checking for error messages..."
if ! grep -q "❌" "$SYNC_SCRIPT"; then
  echo "  ⚠️  WARNING: No ❌ emoji found in error messages (recommended for visibility)"
  # Not a failure, just a warning
else
  echo "  ✅ PASS: Error messages with ❌ emoji present"
fi

# Test 9: Check for file copy operations
echo "  Checking for file copy operations..."
if ! grep -q "cp" "$SYNC_SCRIPT"; then
  echo "  ❌ FAIL: No cp commands found (required for file copying)"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: File copy operations present"
fi

# Test 10: Check for npm install command
echo "  Checking for npm install..."
if ! grep -q "npm install" "$SYNC_SCRIPT"; then
  echo "  ❌ FAIL: 'npm install' command not found"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: npm install command present"
fi

# Test 11: Check for git operations (add, commit, push)
echo "  Checking for git operations..."
GIT_OPS_FOUND=0
if grep -q "git add" "$SYNC_SCRIPT"; then
  GIT_OPS_FOUND=$((GIT_OPS_FOUND + 1))
fi
if grep -q "git commit" "$SYNC_SCRIPT"; then
  GIT_OPS_FOUND=$((GIT_OPS_FOUND + 1))
fi
if grep -q "git push" "$SYNC_SCRIPT"; then
  GIT_OPS_FOUND=$((GIT_OPS_FOUND + 1))
fi

if [[ $GIT_OPS_FOUND -lt 3 ]]; then
  echo "  ❌ FAIL: Not all git operations found (add, commit, push required)"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: All git operations present (add, commit, push)"
fi

# Test 12: Check for success message
echo "  Checking for success message..."
if ! grep -q "Done" "$SYNC_SCRIPT"; then
  echo "  ❌ FAIL: Success message 'Done' not found"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: Success message present"
fi

# Test 13: Check for initial sync message
echo "  Checking for initial sync message..."
if ! grep -q "Syncing" "$SYNC_SCRIPT"; then
  echo "  ❌ FAIL: Initial 'Syncing...' message not found"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: Initial sync message present"
fi

# Test 14: Check script doesn't have syntax errors
echo "  Checking bash syntax..."
if bash -n "$SYNC_SCRIPT" 2>/dev/null; then
  echo "  ✅ PASS: No bash syntax errors"
else
  echo "  ❌ FAIL: Bash syntax errors detected"
  bash -n "$SYNC_SCRIPT"
  FAILURES=$((FAILURES + 1))
fi

# Summary
echo ""
if [[ $FAILURES -eq 0 ]]; then
  echo "✅ ALL SCRIPT STRUCTURE CHECKS PASSED"
  exit 0
else
  echo "❌ $FAILURES SCRIPT STRUCTURE CHECK(S) FAILED"
  exit 1
fi
