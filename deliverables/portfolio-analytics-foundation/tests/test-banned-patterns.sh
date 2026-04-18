#!/bin/bash
# Test: Check for banned patterns in Compass codebase
# Exit 0 on pass, non-zero on fail

set -e

COMPASS_DIR="${COMPASS_DIR:-compass}"
FAIL_COUNT=0

echo "🔍 Testing for banned patterns in ${COMPASS_DIR}..."

# Test 1: Check for hardcoded /Users/ paths
echo "  ✓ Checking for hardcoded /Users/ paths..."
if grep -r "/Users/" "$COMPASS_DIR" --include="*.php" --include="*.js" --include="*.sh" 2>/dev/null; then
  echo "    ❌ FAIL: Found hardcoded /Users/ paths"
  FAIL_COUNT=$((FAIL_COUNT + 1))
else
  echo "    ✅ PASS: No hardcoded paths found"
fi

# Test 2: Check for PII in event schema
echo "  ✓ Checking for PII in event schema..."
if grep -i "email\|\"name\":\|address\|phone\|\"ip\":" "$COMPASS_DIR/config/events.json" 2>/dev/null; then
  echo "    ❌ FAIL: Found PII fields in event schema"
  FAIL_COUNT=$((FAIL_COUNT + 1))
else
  echo "    ✅ PASS: No PII fields in schema"
fi

# Test 3: Check for secrets (API keys, tokens)
echo "  ✓ Checking for secrets in code..."
if grep -r "sk-[a-zA-Z0-9]\{20,\}\|cfat_\|gho_" "$COMPASS_DIR" --include="*.php" --include="*.js" --include="*.sh" --include="*.md" 2>/dev/null; then
  echo "    ❌ FAIL: Found hardcoded secrets"
  FAIL_COUNT=$((FAIL_COUNT + 1))
else
  echo "    ✅ PASS: No secrets found"
fi

# Test 4: Check for console.log in PHP (should use error_log)
echo "  ✓ Checking for inappropriate logging..."
if grep -r "console\.log\|var_dump\|print_r" "$COMPASS_DIR" --include="*.php" 2>/dev/null | grep -v "// " | grep -v "/\*"; then
  echo "    ❌ FAIL: Found inappropriate logging (use error_log)"
  FAIL_COUNT=$((FAIL_COUNT + 1))
else
  echo "    ✅ PASS: Proper logging used"
fi

# Test 5: Check for SQL injection vulnerabilities (no prepared statements)
echo "  ✓ Checking for SQL injection vulnerabilities..."
if grep -r "query\|exec" "$COMPASS_DIR" --include="*.php" 2>/dev/null | grep -v "prepare\|bind"; then
  echo "    ⚠️  WARNING: Found potential SQL without prepared statements"
  # Don't fail, just warn — needs manual review
else
  echo "    ✅ PASS: Using prepared statements"
fi

# Summary
echo ""
echo "═══════════════════════════════════════════"
if [ $FAIL_COUNT -eq 0 ]; then
  echo "✅ All banned pattern tests passed"
  exit 0
else
  echo "❌ $FAIL_COUNT banned pattern test(s) failed"
  exit 1
fi
