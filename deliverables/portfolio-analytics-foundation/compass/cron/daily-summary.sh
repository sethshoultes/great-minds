#!/bin/bash
set -euo pipefail

# Compass Daily Summary Cron Job
# Runs report.php and delivers summary via email or file
# Schedule: Daily at 9 AM
# Crontab entry: 0 9 * * * /path/to/daily-summary.sh

# Color output for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPASS_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="${COMPASS_ROOT}/logs"
LOG_FILE="${LOG_DIR}/daily-summary-$(date +%Y%m%d).log"

# Email configuration (optional)
EMAIL_TO="${COMPASS_EMAIL_TO:-}"
EMAIL_FROM="${COMPASS_EMAIL_FROM:-compass@localhost}"
EMAIL_SUBJECT="Compass Daily Report - $(date +%Y-%m-%d)"

# File output configuration
OUTPUT_DIR="${COMPASS_OUTPUT_DIR:-${COMPASS_ROOT}/reports}"
OUTPUT_FILE="${OUTPUT_DIR}/compass-report-$(date +%Y-%m-%d).txt"

# Validate environment
if [ -z "${COMPASS_DB_PATH:-}" ]; then
    echo -e "${RED}ERROR: COMPASS_DB_PATH environment variable not set${NC}"
    exit 1
fi

# Create log directory if needed
mkdir -p "$LOG_DIR"
mkdir -p "$OUTPUT_DIR"

# Start logging
echo "=======================================" >> "$LOG_FILE"
echo "Compass Daily Summary - $(date)" >> "$LOG_FILE"
echo "=======================================" >> "$LOG_FILE"

log() {
    echo "[$(date +%H:%M:%S)] $1" | tee -a "$LOG_FILE"
}

log "Starting daily summary generation..."

# Generate report
log "Running report.php..."
REPORT_OUTPUT=$(php "${COMPASS_ROOT}/src/report.php" 2>&1)
REPORT_EXIT_CODE=$?

if [ $REPORT_EXIT_CODE -ne 0 ]; then
    log "${RED}ERROR: Report generation failed with exit code ${REPORT_EXIT_CODE}${NC}"
    echo "$REPORT_OUTPUT" >> "$LOG_FILE"
    exit 1
fi

log "${GREEN}Report generated successfully${NC}"

# Write to file
log "Writing report to file: ${OUTPUT_FILE}"
echo "$REPORT_OUTPUT" > "$OUTPUT_FILE"

if [ -f "$OUTPUT_FILE" ]; then
    log "${GREEN}Report written to file successfully${NC}"
else
    log "${RED}ERROR: Failed to write report to file${NC}"
    exit 1
fi

# Send email if configured
if [ -n "$EMAIL_TO" ]; then
    log "Sending email to ${EMAIL_TO}..."

    # Try to send via mail command
    if command -v mail &> /dev/null; then
        echo "$REPORT_OUTPUT" | mail -s "$EMAIL_SUBJECT" -r "$EMAIL_FROM" "$EMAIL_TO"
        if [ $? -eq 0 ]; then
            log "${GREEN}Email sent successfully${NC}"
        else
            log "${YELLOW}Warning: Email send failed via mail command${NC}"
        fi
    # Try sendmail
    elif command -v sendmail &> /dev/null; then
        (
            echo "Subject: $EMAIL_SUBJECT"
            echo "From: $EMAIL_FROM"
            echo "To: $EMAIL_TO"
            echo ""
            echo "$REPORT_OUTPUT"
        ) | sendmail -t
        if [ $? -eq 0 ]; then
            log "${GREEN}Email sent successfully via sendmail${NC}"
        else
            log "${YELLOW}Warning: Email send failed via sendmail${NC}"
        fi
    else
        log "${YELLOW}Warning: No mail command available. Email not sent.${NC}"
        log "Report available at: ${OUTPUT_FILE}"
    fi
else
    log "Email delivery not configured (set COMPASS_EMAIL_TO)"
    log "Report available at: ${OUTPUT_FILE}"
fi

# Log statistics
RECORD_COUNT=$(sqlite3 "$COMPASS_DB_PATH" "SELECT COUNT(*) FROM events;" 2>/dev/null || echo "0")
DB_SIZE=$(du -h "$COMPASS_DB_PATH" 2>/dev/null | cut -f1 || echo "unknown")

log "Database statistics:"
log "  - Total events: ${RECORD_COUNT}"
log "  - Database size: ${DB_SIZE}"

# Cleanup old reports (keep last 30 days)
log "Cleaning up old reports..."
find "$OUTPUT_DIR" -name "compass-report-*.txt" -mtime +30 -delete 2>/dev/null || true
find "$LOG_DIR" -name "daily-summary-*.log" -mtime +30 -delete 2>/dev/null || true

log "${GREEN}Daily summary complete${NC}"
echo "" >> "$LOG_FILE"

exit 0
