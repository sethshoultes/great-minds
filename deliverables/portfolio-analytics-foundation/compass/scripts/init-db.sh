#!/bin/bash
set -euo pipefail

# Compass Database Initialization Script
# Creates SQLite database with events table, indexes, and optimizations
# Idempotent — safe to run multiple times

# Color output for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validate environment variable
if [ -z "${COMPASS_DB_PATH:-}" ]; then
    echo -e "${RED}ERROR: COMPASS_DB_PATH environment variable not set${NC}"
    echo "Usage: COMPASS_DB_PATH=/path/to/compass.db $0"
    exit 1
fi

echo -e "${YELLOW}Compass Database Initialization${NC}"
echo "Database path: $COMPASS_DB_PATH"
echo ""

# Create database directory if it doesn't exist
DB_DIR=$(dirname "$COMPASS_DB_PATH")
if [ ! -d "$DB_DIR" ]; then
    echo "Creating database directory: $DB_DIR"
    mkdir -p "$DB_DIR"
fi

# Create database and schema
echo "Creating database schema..."
sqlite3 "$COMPASS_DB_PATH" <<'SQL'
-- Set pragmas before creating tables (required for auto_vacuum)
PRAGMA auto_vacuum=FULL;
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA cache_size=10000;
PRAGMA temp_store=MEMORY;

-- Create events table (idempotent)
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT NOT NULL,
    event TEXT NOT NULL,
    user_hash TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    properties_json TEXT,
    revenue_cents INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for performance (idempotent)
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_product ON events(product);
CREATE INDEX IF NOT EXISTS idx_events_user_hash ON events(user_hash);
CREATE INDEX IF NOT EXISTS idx_events_product_timestamp ON events(product, timestamp);
CREATE INDEX IF NOT EXISTS idx_events_user_product ON events(user_hash, product);
SQL

# Verify database integrity
echo "Running integrity check..."
INTEGRITY_CHECK=$(sqlite3 "$COMPASS_DB_PATH" "PRAGMA integrity_check;")

if [ "$INTEGRITY_CHECK" = "ok" ]; then
    echo -e "${GREEN}✓ Database integrity check passed${NC}"
else
    echo -e "${RED}✗ Database integrity check failed: $INTEGRITY_CHECK${NC}"
    exit 1
fi

# Verify WAL mode
WAL_MODE=$(sqlite3 "$COMPASS_DB_PATH" "PRAGMA journal_mode;")
if [ "$WAL_MODE" = "wal" ]; then
    echo -e "${GREEN}✓ WAL mode enabled${NC}"
else
    echo -e "${YELLOW}⚠ WAL mode not enabled (got: $WAL_MODE)${NC}"
fi

# Verify auto-vacuum
AUTO_VACUUM=$(sqlite3 "$COMPASS_DB_PATH" "PRAGMA auto_vacuum;")
if [ "$AUTO_VACUUM" = "1" ] || [ "$AUTO_VACUUM" = "2" ]; then
    echo -e "${GREEN}✓ Auto-vacuum enabled${NC}"
else
    echo -e "${YELLOW}⚠ Auto-vacuum not enabled (got: $AUTO_VACUUM)${NC}"
fi

# List tables
echo ""
echo "Database tables:"
sqlite3 "$COMPASS_DB_PATH" ".tables"

# Show schema
echo ""
echo "Events table schema:"
sqlite3 "$COMPASS_DB_PATH" ".schema events"

# List indexes
echo ""
echo "Indexes:"
sqlite3 "$COMPASS_DB_PATH" ".indices events"

# Show current record count
RECORD_COUNT=$(sqlite3 "$COMPASS_DB_PATH" "SELECT COUNT(*) FROM events;")
echo ""
echo "Current event count: $RECORD_COUNT"

echo ""
echo -e "${GREEN}✓ Database initialization complete${NC}"
echo "Database ready at: $COMPASS_DB_PATH"
