import db from './db';
import { v4 as uuidv4 } from 'uuid';
import type { Prompt, Version, Test, CreatePromptInput, UpdatePromptInput } from './types';

// ============================================
// PROMPT QUERIES
// ============================================

/**
 * Get all prompts ordered by most recently updated
 */
export function getAllPrompts(): Prompt[] {
  const stmt = db.prepare(`
    SELECT id, title, current_content, current_version, tags, created_at, updated_at
    FROM prompts
    ORDER BY updated_at DESC
  `);
  return stmt.all() as Prompt[];
}

/**
 * Get a single prompt by ID
 */
export function getPromptById(id: string): Prompt | undefined {
  const stmt = db.prepare(`
    SELECT id, title, current_content, current_version, tags, created_at, updated_at
    FROM prompts
    WHERE id = ?
  `);
  return stmt.get(id) as Prompt | undefined;
}

/**
 * Create a new prompt with initial version
 */
export function createPrompt(input: CreatePromptInput): Prompt {
  const id = uuidv4();
  const versionId = uuidv4();
  const now = new Date().toISOString();
  const tagsJson = input.tags ? JSON.stringify(input.tags) : null;

  // Insert the prompt
  const insertPrompt = db.prepare(`
    INSERT INTO prompts (id, title, current_content, current_version, tags, created_at, updated_at)
    VALUES (?, ?, ?, 1, ?, ?, ?)
  `);
  insertPrompt.run(id, input.title, input.content, tagsJson, now, now);

  // Create initial version (v1)
  const insertVersion = db.prepare(`
    INSERT INTO versions (id, prompt_id, version_number, content, created_at)
    VALUES (?, ?, 1, ?, ?)
  `);
  insertVersion.run(versionId, id, input.content, now);

  return getPromptById(id)!;
}

/**
 * Update an existing prompt
 */
export function updatePrompt(id: string, fields: UpdatePromptInput): Prompt | undefined {
  const existing = getPromptById(id);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  const updates: string[] = ['updated_at = ?'];
  const values: (string | number | null)[] = [now];

  if (fields.title !== undefined) {
    updates.push('title = ?');
    values.push(fields.title);
  }

  if (fields.content !== undefined) {
    updates.push('current_content = ?');
    values.push(fields.content);

    // If content changed, create a new version
    const nextVersion = getNextVersionNumber(id);
    updates.push('current_version = ?');
    values.push(nextVersion);

    // Create the new version record
    createVersion(id, fields.content);
  }

  if (fields.tags !== undefined) {
    updates.push('tags = ?');
    values.push(fields.tags ? JSON.stringify(fields.tags) : null);
  }

  values.push(id);

  const stmt = db.prepare(`
    UPDATE prompts
    SET ${updates.join(', ')}
    WHERE id = ?
  `);
  stmt.run(...values);

  return getPromptById(id);
}

/**
 * Delete a prompt and all its versions
 */
export function deletePrompt(id: string): boolean {
  const existing = getPromptById(id);
  if (!existing) return false;

  // Delete associated tests first (foreign key)
  const deleteTests = db.prepare('DELETE FROM tests WHERE prompt_id = ?');
  deleteTests.run(id);

  // Delete associated versions (foreign key)
  const deleteVersions = db.prepare('DELETE FROM versions WHERE prompt_id = ?');
  deleteVersions.run(id);

  // Delete the prompt
  const deletePromptStmt = db.prepare('DELETE FROM prompts WHERE id = ?');
  deletePromptStmt.run(id);

  return true;
}

// ============================================
// VERSION QUERIES
// ============================================

/**
 * Get all versions for a prompt, ordered by version number descending
 */
export function getVersionsByPromptId(promptId: string): Version[] {
  const stmt = db.prepare(`
    SELECT id, prompt_id, version_number, content, created_at
    FROM versions
    WHERE prompt_id = ?
    ORDER BY version_number DESC
  `);
  return stmt.all(promptId) as Version[];
}

/**
 * Get a specific version by prompt ID and version number
 */
export function getVersion(promptId: string, versionNumber: number): Version | undefined {
  const stmt = db.prepare(`
    SELECT id, prompt_id, version_number, content, created_at
    FROM versions
    WHERE prompt_id = ? AND version_number = ?
  `);
  return stmt.get(promptId, versionNumber) as Version | undefined;
}

/**
 * Create a new version for a prompt
 */
export function createVersion(promptId: string, content: string): Version {
  const id = uuidv4();
  const versionNumber = getNextVersionNumber(promptId);
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO versions (id, prompt_id, version_number, content, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, promptId, versionNumber, content, now);

  return {
    id,
    prompt_id: promptId,
    version_number: versionNumber,
    content,
    created_at: now,
  };
}

/**
 * Get the next version number for a prompt
 */
export function getNextVersionNumber(promptId: string): number {
  const stmt = db.prepare(`
    SELECT COALESCE(MAX(version_number), 0) + 1 as next_version
    FROM versions
    WHERE prompt_id = ?
  `);
  const result = stmt.get(promptId) as { next_version: number };
  return result.next_version;
}

// ============================================
// TEST QUERIES
// ============================================

/**
 * Get all tests for a prompt
 */
export function getTestsByPromptId(promptId: string): Test[] {
  const stmt = db.prepare(`
    SELECT id, prompt_id, version_a, version_b, input, output_a, output_b, created_at
    FROM tests
    WHERE prompt_id = ?
    ORDER BY created_at DESC
  `);
  return stmt.all(promptId) as Test[];
}

/**
 * Create a new A/B test record
 */
export function createTest(
  promptId: string,
  versionA: number,
  versionB: number,
  input: string,
  outputA?: string,
  outputB?: string
): Test {
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO tests (id, prompt_id, version_a, version_b, input, output_a, output_b, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, promptId, versionA, versionB, input, outputA ?? null, outputB ?? null, now);

  return {
    id,
    prompt_id: promptId,
    version_a: versionA,
    version_b: versionB,
    input,
    output_a: outputA ?? null,
    output_b: outputB ?? null,
    created_at: now,
  };
}

/**
 * Update test outputs after running
 */
export function updateTestOutputs(id: string, outputA: string, outputB: string): Test | undefined {
  const stmt = db.prepare(`
    UPDATE tests
    SET output_a = ?, output_b = ?
    WHERE id = ?
  `);
  stmt.run(outputA, outputB, id);

  const getStmt = db.prepare(`
    SELECT id, prompt_id, version_a, version_b, input, output_a, output_b, created_at
    FROM tests
    WHERE id = ?
  `);
  return getStmt.get(id) as Test | undefined;
}
