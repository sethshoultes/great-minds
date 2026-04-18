#!/bin/bash
# Test: Verify threshold corrections in git-intelligence.ts

echo "Testing threshold corrections..."

# Check that high-churn threshold is >= 10, not >= 3
if grep -n '>= 3' ../../daemon/src/git-intelligence.ts; then
  echo "FAIL: Found '>= 3' threshold (should be >= 10)"
  exit 1
fi

# Check that churn files are limited to 5, not 15
if grep -n 'slice(0, 15)' ../../daemon/src/git-intelligence.ts; then
  echo "FAIL: Found 'slice(0, 15)' for churn (should be slice(0, 5))"
  exit 1
fi

# Check that bug-prone files are limited to 5, not 20
if grep -n 'slice(0, 20)' ../../daemon/src/git-intelligence.ts; then
  echo "FAIL: Found 'slice(0, 20)' for bug-prone (should be slice(0, 5))"
  exit 1
fi

echo "PASS: All thresholds correct"
exit 0
