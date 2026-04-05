/**
 * Core vector store — SQLite + embeddings for Great Minds agency memory.
 */

import Database from 'better-sqlite3';
import path from 'node:path';
import {
  type EmbeddingProvider,
  TfIdfEmbeddings,
  contentHash,
  createEmbeddingProvider,
} from './embeddings.js';

// ── Types ──────────────────────────────────────────────────────────────────

export const MEMORY_TYPES = [
  'learning',
  'decision',
  'qa-finding',
  'board-review',
  'retrospective',
  'architecture',
] as const;

export type MemoryType = (typeof MEMORY_TYPES)[number];

export interface Memory {
  id: number;
  type: MemoryType;
  agent: string;
  project: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface MemoryWithScore extends Memory {
  score: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function embeddingToBuffer(embedding: Float64Array): Buffer {
  return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
}

function bufferToEmbedding(buf: Buffer): Float64Array {
  const ab = new ArrayBuffer(buf.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.byteLength; i++) {
    view[i] = buf[i];
  }
  return new Float64Array(ab);
}

function cosineSimilarity(a: Float64Array, b: Float64Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// ── MemoryStore class ──────────────────────────────────────────────────────

export class MemoryStore {
  private db: Database.Database;
  private embedder: EmbeddingProvider;

  constructor(dbPath?: string, embedder?: EmbeddingProvider) {
    const resolvedPath = dbPath || path.join(process.cwd(), 'memory.db');
    this.db = new Database(resolvedPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    this.embedder = embedder || createEmbeddingProvider();
    this.initSchema();
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        agent TEXT NOT NULL DEFAULT '',
        project TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL,
        embedding BLOB,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
      CREATE INDEX IF NOT EXISTS idx_memories_agent ON memories(agent);
      CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project);

      CREATE TABLE IF NOT EXISTS embeddings_cache (
        content_hash TEXT PRIMARY KEY,
        embedding BLOB NOT NULL
      );
    `);
  }

  /**
   * Rebuild TF-IDF vocabulary from all stored content.
   * Only needed when using the TF-IDF fallback.
   */
  async rebuildTfIdfVocabulary(): Promise<void> {
    if (!(this.embedder instanceof TfIdfEmbeddings)) return;

    const rows = this.db.prepare('SELECT content FROM memories').all() as { content: string }[];
    this.embedder.buildVocabulary(rows.map((r) => r.content));

    // Re-embed everything with updated vocabulary
    const allRows = this.db.prepare('SELECT id, content FROM memories').all() as {
      id: number;
      content: string;
    }[];

    const update = this.db.prepare('UPDATE memories SET embedding = ? WHERE id = ?');
    const upsertCache = this.db.prepare(
      'INSERT OR REPLACE INTO embeddings_cache (content_hash, embedding) VALUES (?, ?)'
    );

    for (const row of allRows) {
      const embedding = await this.embedder.embed(row.content);
      const buf = embeddingToBuffer(embedding);
      update.run(buf, row.id);
      upsertCache.run(contentHash(row.content), buf);
    }
  }

  /**
   * Get a cached embedding or generate a new one.
   */
  private async getEmbedding(text: string): Promise<Float64Array> {
    const hash = contentHash(text);
    const cached = this.db
      .prepare('SELECT embedding FROM embeddings_cache WHERE content_hash = ?')
      .get(hash) as { embedding: Buffer } | undefined;

    if (cached) {
      return bufferToEmbedding(cached.embedding);
    }

    const embedding = await this.embedder.embed(text);
    const buf = embeddingToBuffer(embedding);
    this.db
      .prepare('INSERT OR REPLACE INTO embeddings_cache (content_hash, embedding) VALUES (?, ?)')
      .run(hash, buf);

    return embedding;
  }

  // ── CRUD ───────────────────────────────────────────────────────────────

  async add(
    type: MemoryType,
    agent: string,
    project: string,
    content: string
  ): Promise<number> {
    // For TF-IDF, rebuild vocabulary to include new content
    if (this.embedder instanceof TfIdfEmbeddings) {
      const existing = this.db.prepare('SELECT content FROM memories').all() as {
        content: string;
      }[];
      this.embedder.buildVocabulary([...existing.map((r) => r.content), content]);
    }

    const embedding = await this.getEmbedding(content);
    const buf = embeddingToBuffer(embedding);

    const result = this.db
      .prepare(
        `INSERT INTO memories (type, agent, project, content, embedding)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(type, agent || '', project || '', content, buf);

    return result.lastInsertRowid as number;
  }

  async search(query: string, limit = 5): Promise<MemoryWithScore[]> {
    // For TF-IDF, ensure vocabulary is up to date
    if (this.embedder instanceof TfIdfEmbeddings) {
      const docs = this.db.prepare('SELECT content FROM memories').all() as {
        content: string;
      }[];
      this.embedder.buildVocabulary(docs.map((r) => r.content));
    }

    const queryEmbedding = await this.embedder.embed(query);

    const rows = this.db
      .prepare('SELECT id, type, agent, project, content, embedding, created_at, updated_at FROM memories WHERE embedding IS NOT NULL')
      .all() as (Memory & { embedding: Buffer })[];

    const scored: MemoryWithScore[] = rows.map((row) => {
      const rowEmbedding = bufferToEmbedding(row.embedding);
      const score = cosineSimilarity(queryEmbedding, rowEmbedding);
      const { embedding: _, ...rest } = row;
      return { ...rest, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }

  listByType(type: MemoryType): Memory[] {
    return this.db
      .prepare(
        'SELECT id, type, agent, project, content, created_at, updated_at FROM memories WHERE type = ? ORDER BY created_at DESC'
      )
      .all(type) as Memory[];
  }

  listByAgent(agent: string): Memory[] {
    return this.db
      .prepare(
        'SELECT id, type, agent, project, content, created_at, updated_at FROM memories WHERE agent = ? ORDER BY created_at DESC'
      )
      .all(agent) as Memory[];
  }

  listByProject(project: string): Memory[] {
    return this.db
      .prepare(
        'SELECT id, type, agent, project, content, created_at, updated_at FROM memories WHERE project = ? ORDER BY created_at DESC'
      )
      .all(project) as Memory[];
  }

  getById(id: number): Memory | undefined {
    return this.db
      .prepare(
        'SELECT id, type, agent, project, content, created_at, updated_at FROM memories WHERE id = ?'
      )
      .get(id) as Memory | undefined;
  }

  remove(id: number): boolean {
    const result = this.db.prepare('DELETE FROM memories WHERE id = ?').run(id);
    return result.changes > 0;
  }

  count(): number {
    const row = this.db.prepare('SELECT COUNT(*) as count FROM memories').get() as {
      count: number;
    };
    return row.count;
  }

  stats(): { total: number; byType: Record<string, number>; byAgent: Record<string, number> } {
    const total = this.count();

    const typeRows = this.db
      .prepare('SELECT type, COUNT(*) as count FROM memories GROUP BY type')
      .all() as { type: string; count: number }[];
    const byType: Record<string, number> = {};
    for (const r of typeRows) byType[r.type] = r.count;

    const agentRows = this.db
      .prepare("SELECT agent, COUNT(*) as count FROM memories WHERE agent != '' GROUP BY agent")
      .all() as { agent: string; count: number }[];
    const byAgent: Record<string, number> = {};
    for (const r of agentRows) byAgent[r.agent] = r.count;

    return { total, byType, byAgent };
  }

  close(): void {
    this.db.close();
  }
}
