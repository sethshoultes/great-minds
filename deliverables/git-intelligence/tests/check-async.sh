#!/bin/bash
# Test: Verify git functions are async

echo "Testing async implementation..."

# Check that git() function is async
if ! grep -n 'async function git' ../../daemon/src/git-intelligence.ts; then
  echo "FAIL: git() function is not async"
  exit 1
fi

# Check that generateHindsightReport() is async
if ! grep -n 'export async function generateHindsightReport' ../../daemon/src/git-intelligence.ts; then
  echo "FAIL: generateHindsightReport() is not async"
  exit 1
fi

# Check for Promise.all usage (parallelization)
if ! grep -n 'Promise.all' ../../daemon/src/git-intelligence.ts; then
  echo "FAIL: Promise.all not found (commands not parallelized)"
  exit 1
fi

echo "PASS: Async implementation correct"
exit 0
