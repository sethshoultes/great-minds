'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { Prompt, PromptWithParsedTags } from '@/lib/types';
import { useAutoSave } from '@/lib/hooks/useAutoSave';

/**
 * Props for the Editor component
 */
export interface EditorProps {
  /** The prompt being edited */
  prompt: Prompt | PromptWithParsedTags;
  /** Callback fired when content changes */
  onUpdate: (content: string) => void;
  /** Callback fired when a new version is created (after auto-save) */
  onVersionCreated?: (version: number) => void;
}

/**
 * Editor - Full-screen prompt editor component
 *
 * A clean, focused editor for writing and editing prompts.
 * Features:
 * - Full-screen layout (100vh minus header)
 * - Monospace font for code-like editing
 * - Auto-save with debouncing via useAutoSave hook
 * - Auto-focus on mount
 * - Cursor position preservation
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Editor
 *   prompt={currentPrompt}
 *   onUpdate={(content) => setContent(content)}
 *   onVersionCreated={(version) => toast.success(`Saved v${version}`)}
 * />
 * ```
 */
export function Editor({ prompt, onUpdate, onVersionCreated }: EditorProps) {
  // Local state for editor content
  const [content, setContent] = useState(prompt.current_content);

  // Ref for the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Track cursor position for preservation
  const cursorPositionRef = useRef<{ start: number; end: number } | null>(null);

  // Integrate auto-save hook
  const { isDirty, isSaving, lastSaved, error, save } = useAutoSave({
    promptId: prompt.id,
    content,
    originalContent: prompt.current_content,
    onSave: (updatedPrompt) => {
      // Notify parent of version creation
      if (onVersionCreated && updatedPrompt.current_version > prompt.current_version) {
        onVersionCreated(updatedPrompt.current_version);
      }
    },
    onError: (err) => {
      console.error('Auto-save failed:', err.message);
    },
  });

  /**
   * Handle content changes in the textarea
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    // Save cursor position before state update
    cursorPositionRef.current = {
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    };

    // Update local state
    setContent(newContent);

    // Notify parent
    onUpdate(newContent);
  }, [onUpdate]);

  /**
   * Auto-focus on mount
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  /**
   * Preserve cursor position after re-render
   */
  useEffect(() => {
    if (textareaRef.current && cursorPositionRef.current) {
      const { start, end } = cursorPositionRef.current;
      textareaRef.current.setSelectionRange(start, end);
    }
  }, [content]);

  /**
   * Sync content when prompt changes (e.g., loading different prompt)
   */
  useEffect(() => {
    setContent(prompt.current_content);
  }, [prompt.id, prompt.current_content]);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + S to manually save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      save();
    }
  }, [save]);

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)]">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {isDirty && (
            <span className="text-amber-600 dark:text-amber-400">Unsaved changes</span>
          )}
          {isSaving && (
            <span className="text-blue-600 dark:text-blue-400">Saving...</span>
          )}
          {lastSaved && !isDirty && !isSaving && (
            <span className="text-green-600 dark:text-green-400">
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {error && (
            <span className="text-red-600 dark:text-red-400">
              Error: {error.message}
            </span>
          )}
        </div>
        <div className="text-gray-400 dark:text-gray-500">
          v{prompt.current_version}
        </div>
      </div>

      {/* Main editor area */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="
          flex-1
          w-full
          p-4
          font-mono
          text-base
          leading-relaxed
          resize-none
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none
        "
        placeholder="Start writing your prompt..."
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
}

export default Editor;
