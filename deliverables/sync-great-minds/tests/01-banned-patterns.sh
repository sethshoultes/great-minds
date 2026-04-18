#!/bin/bash
# Test: Banned Patterns Check
# Verifies sync.sh doesn't contain banned patterns from BANNED-PATTERNS.md

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
SYNC_SCRIPT="$REPO_ROOT/sync.sh"

echo "🔍 Testing for banned patterns in sync.sh..."

# Check if sync.sh exists
if [[ ! -f "$SYNC_SCRIPT" ]]; then
  echo "❌ FAIL: sync.sh not found at $SYNC_SCRIPT"
  exit 1
fi

FAILURES=0

# Test 1: Check for hardcoded /Users/ paths outside variable declarations
echo "  Checking for hardcoded /Users/ paths..."
# Allow in variable declarations (lines with = and quotes), but not elsewhere
if grep -n '/Users/' "$SYNC_SCRIPT" | grep -v 'PLUGIN_ROOT=' | grep -v 'GREAT_MINDS_ROOT=' | grep -v '^#' > /dev/null 2>&1; then
  echo "  ❌ FAIL: Found hardcoded /Users/ paths in code (outside variable declarations)"
  grep -n '/Users/' "$SYNC_SCRIPT" | grep -v 'PLUGIN_ROOT=' | grep -v 'GREAT_MINDS_ROOT=' | grep -v '^#'
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: No hardcoded /Users/ paths in code"
fi

# Test 2: Check for console.log (should use echo in bash)
echo "  Checking for console.log..."
if grep -n 'console\.log' "$SYNC_SCRIPT" > /dev/null 2>&1; then
  echo "  ❌ FAIL: Found console.log (use echo in bash scripts)"
  grep -n 'console\.log' "$SYNC_SCRIPT"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: No console.log found"
fi

# Test 3: Check for unquoted variables in critical paths (commands only, not echo statements)
echo "  Checking for unquoted path variables in commands..."
# Look for $PLUGIN_ROOT or $GREAT_MINDS_ROOT without quotes in actual commands (not echo)
# Exclude echo statements, variable assignments, and HEREDOC content
UNQUOTED_PLUGIN=$(grep -n '\$PLUGIN_ROOT[^"]' "$SYNC_SCRIPT" | grep -v '"$PLUGIN_ROOT' | grep -v 'echo' | grep -v '=' | grep -v '<<')
UNQUOTED_GREAT_MINDS=$(grep -n '\$GREAT_MINDS_ROOT[^"]' "$SYNC_SCRIPT" | grep -v '"$GREAT_MINDS_ROOT' | grep -v 'echo' | grep -v '=' | grep -v '<<')

if [[ -n "$UNQUOTED_PLUGIN" ]]; then
  echo "  ❌ FAIL: Found unquoted \$PLUGIN_ROOT in commands (paths with spaces require quotes)"
  echo "$UNQUOTED_PLUGIN"
  FAILURES=$((FAILURES + 1))
fi

if [[ -n "$UNQUOTED_GREAT_MINDS" ]]; then
  echo "  ❌ FAIL: Found unquoted \$GREAT_MINDS_ROOT in commands (paths with spaces require quotes)"
  echo "$UNQUOTED_GREAT_MINDS"
  FAILURES=$((FAILURES + 1))
fi

if [[ -z "$UNQUOTED_PLUGIN" && -z "$UNQUOTED_GREAT_MINDS" ]]; then
  echo "  ✅ PASS: All path variables in commands properly quoted"
fi

# Test 4: Check for process.env (should use environment variables directly in bash)
echo "  Checking for process.env usage..."
if grep -n 'process\.env' "$SYNC_SCRIPT" > /dev/null 2>&1; then
  echo "  ❌ FAIL: Found process.env (use \$VARIABLE_NAME in bash)"
  grep -n 'process\.env' "$SYNC_SCRIPT"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: No process.env found"
fi

# Test 5: Check for secret patterns (API keys, tokens)
echo "  Checking for exposed secrets..."
SECRET_PATTERNS="cfat_|sk-[a-zA-Z0-9]{20,}|gho_"
if grep -nE "$SECRET_PATTERNS" "$SYNC_SCRIPT" > /dev/null 2>&1; then
  echo "  ❌ FAIL: Found potential secrets or API tokens"
  grep -nE "$SECRET_PATTERNS" "$SYNC_SCRIPT"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: No exposed secrets found"
fi

# Summary
echo ""
if [[ $FAILURES -eq 0 ]]; then
  echo "✅ ALL BANNED PATTERN CHECKS PASSED"
  exit 0
else
  echo "❌ $FAILURES BANNED PATTERN CHECK(S) FAILED"
  exit 1
fi
