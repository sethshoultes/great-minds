#!/bin/bash
# Test: Check for banned patterns

echo "Testing for banned patterns..."

# Check for hardcoded paths
if grep -rn '/Users/sethshoultes' ../../daemon/src/git-intelligence*.ts; then
  echo "FAIL: Found hardcoded path"
  exit 1
fi

# Check for console.log instead of logger
if grep -n 'console\.log' ../../daemon/src/git-intelligence.ts | grep -v '//'; then
  echo "FAIL: Found console.log (should use logger)"
  exit 1
fi

# Check for unprotected setTimeout/Promise (should have timeout protection)
# This will be checked after Wave 3 implementation

echo "PASS: No banned patterns found"
exit 0
