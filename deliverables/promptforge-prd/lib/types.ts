/**
 * PromptForge TypeScript Types
 * Database entities and input types for the prompt version control system
 */

// ============================================
// DATABASE ENTITIES
// ============================================

/**
 * A prompt is the main entity - a piece of text being versioned
 */
export interface Prompt {
  id: string;
  title: string;
  current_content: string;
  current_version: number;
  tags: string | null; // JSON array string, e.g., '["system", "chat"]'
  created_at: string;
  updated_at: string;
}

/**
 * A version is an immutable snapshot of a prompt at a point in time
 */
export interface Version {
  id: string;
  prompt_id: string;
  version_number: number;
  content: string;
  created_at: string;
}

/**
 * A test is an A/B comparison record between two prompt versions
 */
export interface Test {
  id: string;
  prompt_id: string;
  version_a: number;
  version_b: number;
  input: string;
  output_a: string | null;
  output_b: string | null;
  created_at: string;
}

// ============================================
// INPUT TYPES
// ============================================

/**
 * Input for creating a new prompt
 */
export interface CreatePromptInput {
  title: string;
  content: string;
  tags?: string[];
}

/**
 * Input for updating an existing prompt
 */
export interface UpdatePromptInput {
  title?: string;
  content?: string;
  tags?: string[];
}

/**
 * Input for creating an A/B test
 */
export interface CreateTestInput {
  prompt_id: string;
  version_a: number;
  version_b: number;
  input: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Prompt with parsed tags for API responses
 */
export interface PromptWithParsedTags extends Omit<Prompt, 'tags'> {
  tags: string[];
}

/**
 * Standard API error response
 */
export interface ApiError {
  error: string;
  message: string;
}

/**
 * Successful API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Parse tags from JSON string to array
 */
export function parseTags(tagsJson: string | null): string[] {
  if (!tagsJson) return [];
  try {
    return JSON.parse(tagsJson);
  } catch {
    return [];
  }
}

/**
 * Convert a Prompt to PromptWithParsedTags
 */
export function toPromptWithParsedTags(prompt: Prompt): PromptWithParsedTags {
  const { tags, ...rest } = prompt;
  return {
    ...rest,
    tags: parseTags(tags),
  };
}
