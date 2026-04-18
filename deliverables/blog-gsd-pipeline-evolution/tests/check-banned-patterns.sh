#!/bin/bash
# Check for banned patterns in the Phoenix blog post

POST_FILE="../phoenix-post.md"

if [ ! -f "$POST_FILE" ]; then
  echo "ERROR: phoenix-post.md not found"
  exit 1
fi

# Check for marketing buzzwords
BUZZWORDS=$(grep -i "leveraging\|synergies\|best practices\|robust\|scalable" "$POST_FILE" || true)
if [ -n "$BUZZWORDS" ]; then
  echo "FAIL: Found banned buzzwords:"
  echo "$BUZZWORDS"
  exit 1
fi

# Check for comparisons to other systems (forbidden per spec)
COMPARISONS=$(grep -i "airflow\|temporal\|kubernetes\|jenkins" "$POST_FILE" || true)
if [ -n "$COMPARISONS" ]; then
  echo "FAIL: Found comparisons to other systems:"
  echo "$COMPARISONS"
  exit 1
fi

echo "PASS: No banned patterns found"
exit 0
