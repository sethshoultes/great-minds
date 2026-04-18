#!/bin/bash
# Test: File Existence Check
# Verifies all required files for the sync build exist

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "🔍 Testing for required file existence..."

FAILURES=0

# Test 1: Check sync.sh exists and is executable
echo "  Checking sync.sh..."
if [[ ! -f "$REPO_ROOT/sync.sh" ]]; then
  echo "  ❌ FAIL: sync.sh not found at $REPO_ROOT/sync.sh"
  FAILURES=$((FAILURES + 1))
elif [[ ! -x "$REPO_ROOT/sync.sh" ]]; then
  echo "  ❌ FAIL: sync.sh exists but is not executable (run: chmod +x sync.sh)"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: sync.sh exists and is executable"
fi

# Test 2: Check spec.md exists
echo "  Checking spec.md..."
if [[ ! -f "$REPO_ROOT/deliverables/sync-great-minds/spec.md" ]]; then
  echo "  ❌ FAIL: spec.md not found"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: spec.md exists"
fi

# Test 3: Check todo.md exists
echo "  Checking todo.md..."
if [[ ! -f "$REPO_ROOT/deliverables/sync-great-minds/todo.md" ]]; then
  echo "  ❌ FAIL: todo.md not found"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: todo.md exists"
fi

# Test 4: Check tests directory exists
echo "  Checking tests/ directory..."
if [[ ! -d "$REPO_ROOT/deliverables/sync-great-minds/tests" ]]; then
  echo "  ❌ FAIL: tests/ directory not found"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: tests/ directory exists"
fi

# Test 5: Check test scripts exist and are executable
echo "  Checking test scripts..."
TEST_SCRIPTS=(
  "01-banned-patterns.sh"
  "02-file-existence.sh"
  "03-script-structure.sh"
)

for script in "${TEST_SCRIPTS[@]}"; do
  SCRIPT_PATH="$REPO_ROOT/deliverables/sync-great-minds/tests/$script"
  if [[ ! -f "$SCRIPT_PATH" ]]; then
    echo "  ❌ FAIL: Test script $script not found"
    FAILURES=$((FAILURES + 1))
  elif [[ ! -x "$SCRIPT_PATH" ]]; then
    echo "  ❌ FAIL: Test script $script exists but is not executable"
    FAILURES=$((FAILURES + 1))
  else
    echo "  ✅ PASS: Test script $script exists and is executable"
  fi
done

# Test 6: Check source files that will be synced exist
echo "  Checking source files..."
SOURCE_FILES=(
  "daemon/src"
  "daemon/package.json"
  "daemon/README.md"
  "BANNED-PATTERNS.md"
)

for file in "${SOURCE_FILES[@]}"; do
  if [[ ! -e "$REPO_ROOT/$file" ]]; then
    echo "  ❌ FAIL: Source file/directory $file not found"
    FAILURES=$((FAILURES + 1))
  else
    echo "  ✅ PASS: Source file/directory $file exists"
  fi
done

# Test 7: Check daemon/src contains TypeScript files
echo "  Checking daemon/src TypeScript files..."
TS_FILE_COUNT=$(find "$REPO_ROOT/daemon/src" -name "*.ts" -type f 2>/dev/null | wc -l | tr -d ' ')
if [[ $TS_FILE_COUNT -eq 0 ]]; then
  echo "  ❌ FAIL: No TypeScript files found in daemon/src"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ PASS: Found $TS_FILE_COUNT TypeScript files in daemon/src"
  if [[ $TS_FILE_COUNT -ne 11 ]]; then
    echo "  ⚠️  WARNING: Expected 11 TypeScript files, found $TS_FILE_COUNT"
  fi
fi

# Summary
echo ""
if [[ $FAILURES -eq 0 ]]; then
  echo "✅ ALL FILE EXISTENCE CHECKS PASSED"
  exit 0
else
  echo "❌ $FAILURES FILE EXISTENCE CHECK(S) FAILED"
  exit 1
fi
