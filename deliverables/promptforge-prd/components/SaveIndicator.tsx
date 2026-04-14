'use client';

import { useCallback } from 'react';

/**
 * Props for the SaveIndicator component
 */
export interface SaveIndicatorProps {
  /** Whether a save is currently in progress */
  isSaving: boolean;
  /** Whether there are unsaved changes */
  isDirty: boolean;
  /** Current version number of the prompt */
  version: number;
  /** Timestamp of last successful save */
  lastSaved: Date | null;
  /** Error message from failed save attempt */
  error?: string;
  /** Callback to retry saving after an error */
  onRetry?: () => void;
}

/**
 * Subtle spinner component for saving state
 */
function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Version badge component
 */
function VersionBadge({ version }: { version: number }) {
  return (
    <span className="bg-gray-100 rounded-full px-2 py-0.5 text-xs font-medium text-gray-600">
      v{version}
    </span>
  );
}

/**
 * SaveIndicator - Displays save state and version number
 *
 * Shows the current save status to build user trust through transparency.
 * Users always know whether their work is saved, saving, or has unsaved changes.
 *
 * States:
 * - Saving: Shows "Saving..." with a spinner
 * - Saved: Shows "Saved" with version badge
 * - Dirty (unsaved): Shows "Unsaved changes"
 * - Error: Shows "Save failed" with retry button
 *
 * Designed for fixed top-right placement in the header.
 *
 * @example
 * ```tsx
 * <SaveIndicator
 *   isSaving={false}
 *   isDirty={false}
 *   version={3}
 *   lastSaved={new Date()}
 * />
 * ```
 */
export function SaveIndicator({
  isSaving,
  isDirty,
  version,
  lastSaved,
  error,
  onRetry,
}: SaveIndicatorProps) {
  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  // Error state takes priority
  if (error) {
    return (
      <div className="flex items-center gap-2" role="status" aria-live="polite">
        <span className="text-sm text-red-600 font-medium">Save failed</span>
        {onRetry && (
          <button
            onClick={handleRetry}
            className="text-xs text-red-600 hover:text-red-700 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
            aria-label="Retry saving"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  // Saving state
  if (isSaving) {
    return (
      <div className="flex items-center gap-2" role="status" aria-live="polite">
        <Spinner />
        <span className="text-sm text-gray-500">Saving...</span>
      </div>
    );
  }

  // Dirty state (unsaved changes)
  if (isDirty) {
    return (
      <div className="flex items-center gap-2" role="status" aria-live="polite">
        <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>
      </div>
    );
  }

  // Saved state (default when not dirty, not saving, and no error)
  return (
    <div className="flex items-center gap-2" role="status" aria-live="polite">
      <span className="text-sm text-green-600">Saved</span>
      <VersionBadge version={version} />
      {lastSaved && (
        <span className="text-xs text-gray-400 hidden sm:inline">
          {formatLastSaved(lastSaved)}
        </span>
      )}
    </div>
  );
}

/**
 * Formats the last saved timestamp for display
 */
function formatLastSaved(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 10) {
    return 'just now';
  }
  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  // For older saves, show the time
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default SaveIndicator;
