import Database from 'better-sqlite3';
import path from 'path';

// Database path: /data/promptforge.db
const dbPath = path.join(process.cwd(), 'data', 'promptforge.db');

// Create database connection with better-sqlite3
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Set busy timeout to 5 seconds
db.pragma('busy_timeout = 5000');

// Initialize schema
const initSchema = () => {
  // Prompts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS prompts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      current_content TEXT NOT NULL,
      current_version INTEGER DEFAULT 1,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Versions table (immutable history)
  db.exec(`
    CREATE TABLE IF NOT EXISTS versions (
      id TEXT PRIMARY KEY,
      prompt_id TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (prompt_id) REFERENCES prompts(id)
    )
  `);

  // Tests table (A/B test runs)
  db.exec(`
    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      prompt_id TEXT NOT NULL,
      version_a INTEGER NOT NULL,
      version_b INTEGER NOT NULL,
      input TEXT NOT NULL,
      output_a TEXT,
      output_b TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (prompt_id) REFERENCES prompts(id)
    )
  `);

  // Index for fast version lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_versions_prompt ON versions(prompt_id, version_number)
  `);
};

// Initialize schema on module load
initSchema();

export default db;
export { dbPath };
