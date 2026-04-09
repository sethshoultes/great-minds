'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PromptWithParsedTags } from '@/lib/types';

/**
 * Auto-save configuration options
 */
export interface UseAutoSaveOptions {
  /** The prompt ID to save to */
  promptId: string;
  /** Current content being edited */
  content: string;
  /** Original content to compare against for dirty detection */
  originalContent: string;
  /** Debounce delay in milliseconds (default: 2500ms) */
  debounceMs?: number;
  /** Callback fired after successful save */
  onSave?: (prompt: PromptWithParsedTags) => void;
  /** Callback fired on save error */
  onError?: (error: Error) => void;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Return value from useAutoSave hook
 */
export interface UseAutoSaveReturn {
  /** Whether content has unsaved changes */
  isDirty: boolean;
  /** Whether a save is currently in progress */
  isSaving: boolean;
  /** Timestamp of last successful save, or null if never saved */
  lastSaved: Date | null;
  /** Error from last save attempt, or null if none */
  error: Error | null;
  /** Manually trigger a save (bypasses debounce) */
  save: () => Promise<void>;
}

/**
 * useAutoSave - React hook for auto-saving prompt content with debouncing
 *
 * Features:
 * - Debounces user input (2.5 seconds by default)
 * - Tracks dirty state by comparing to original content
 * - Only saves when content actually changes
 * - Provides manual save function for immediate saves
 * - Error handling with callback support
 *
 * @example
 * ```tsx
 * const { isDirty, isSaving, lastSaved, save } = useAutoSave({
 *   promptId: 'abc123',
 *   content: editorContent,
 *   originalContent: prompt.current_content,
 *   onSave: (updated) => setPrompt(updated),
 *   onError: (err) => toast.error(err.message),
 * });
 * ```
 */
export function useAutoSave({
  promptId,
  content,
  originalContent,
  debounceMs = 2500,
  onSave,
  onError,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  // State
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Refs for stable callbacks and tracking
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>(originalContent);
  const isMountedRef = useRef(true);

  // Compute isDirty: content differs from both original AND last saved
  const isDirty = content !== originalContent && content !== lastSavedContentRef.current;

  /**
   * Core save function - calls PATCH endpoint
   */
  const performSave = useCallback(async (contentToSave: string): Promise<void> => {
    // Skip if content hasn't actually changed from last save
    if (contentToSave === lastSavedContentRef.current) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: contentToSave }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Save failed with status ${response.status}`);
      }

      const data = await response.json();

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        lastSavedContentRef.current = contentToSave;
        setLastSaved(new Date());
        setError(null);

        // Call success callback
        if (onSave && data.prompt) {
          onSave(data.prompt);
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');

      if (isMountedRef.current) {
        setError(error);

        // Call error callback
        if (onError) {
          onError(error);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [promptId, onSave, onError]);

  /**
   * Manual save function - bypasses debounce for immediate save
   */
  const save = useCallback(async (): Promise<void> => {
    // Clear any pending debounced save
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    await performSave(content);
  }, [content, performSave]);

  /**
   * Debounced auto-save effect
   * Triggers save after debounceMs of inactivity when content changes
   */
  useEffect(() => {
    // Don't auto-save if disabled or content hasn't changed
    if (!enabled || content === lastSavedContentRef.current) {
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      performSave(content);
    }, debounceMs);

    // Cleanup on unmount or dependency change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [content, enabled, debounceMs, performSave]);

  /**
   * Update lastSavedContentRef when originalContent changes
   * (e.g., when loading a new prompt)
   */
  useEffect(() => {
    lastSavedContentRef.current = originalContent;
  }, [originalContent]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    isDirty,
    isSaving,
    lastSaved,
    error,
    save,
  };
}

export default useAutoSave;
