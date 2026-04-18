#!/bin/bash
# Test: Verify pipeline integration

echo "Testing pipeline integration..."

# Check that pipeline imports Hindsight functions
if ! grep -n 'generateProjectHindsight' ../../daemon/src/pipeline.ts; then
  echo "FAIL: pipeline.ts doesn't import generateProjectHindsight"
  exit 1
fi

if ! grep -n 'hindsightPlannerContext\|hindsightExecutorContext' ../../daemon/src/pipeline.ts; then
  echo "FAIL: pipeline.ts doesn't import Hindsight context functions"
  exit 1
fi

# Check that .great-minds directory is created
if ! grep -n '\.great-minds' ../../daemon/src/pipeline.ts; then
  echo "FAIL: pipeline.ts doesn't create .great-minds directory"
  exit 1
fi

# Check correct output filename (hindsight.md, not hindsight-report.md)
if ! grep -n 'hindsight\.md' ../../daemon/src/git-intelligence-integration.ts; then
  echo "FAIL: Output filename should be hindsight.md"
  exit 1
fi

if grep -n 'hindsight-report\.md' ../../daemon/src/git-intelligence-integration.ts; then
  echo "FAIL: Found old filename hindsight-report.md"
  exit 1
fi

echo "PASS: Integration correct"
exit 0
