'use client';

/**
 * DiffViewer Component - The SOUL of PromptForge
 *
 * "This is a craft tool, not a deployment pipeline."
 * "The diff viewer is the soul of the product. Green additions, red deletions, clean typography."
 * - Decision 6, decisions.md
 *
 * Beautiful side-by-side diff comparison with custom styling.
 */

import React, { useState, useEffect, useMemo } from 'react';
import ReactDiffViewer, { DiffMethod, ReactDiffViewerStylesOverride } from 'react-diff-viewer';

// ============================================
// PROPS INTERFACE
// ============================================

export interface DiffViewerProps {
  /** The original/old content to compare */
  oldContent: string;
  /** The new/updated content to compare */
  newContent: string;
  /** Version number of the old content */
  oldVersion: number;
  /** Version number of the new content */
  newVersion: number;
  /** Callback when the diff viewer is closed */
  onClose?: () => void;
}

// ============================================
// BEAUTIFUL CUSTOM STYLES
// ============================================

/**
 * Custom styles that make the diff viewer beautiful.
 * Carefully crafted color palette with:
 * - Soft green backgrounds for additions
 * - Soft red backgrounds for deletions
 * - Clean typography with proper spacing
 * - Word-level highlighting for precise changes
 */
const beautifulStyles: ReactDiffViewerStylesOverride = {
  variables: {
    light: {
      // Main backgrounds
      diffViewerBackground: '#FFFFFF',
      diffViewerTitleBackground: '#F8FAFC',
      diffViewerColor: '#1E293B',
      diffViewerTitleColor: '#334155',
      diffViewerTitleBorderColor: '#E2E8F0',

      // Addition styles (green palette)
      addedBackground: '#ECFDF5',
      addedColor: '#065F46',
      addedGutterBackground: '#D1FAE5',
      addedGutterColor: '#047857',
      wordAddedBackground: '#A7F3D0',

      // Removal styles (red palette)
      removedBackground: '#FEF2F2',
      removedColor: '#991B1B',
      removedGutterBackground: '#FECACA',
      removedGutterColor: '#B91C1C',
      wordRemovedBackground: '#FCA5A5',

      // Gutter styles
      gutterBackground: '#F8FAFC',
      gutterBackgroundDark: '#F1F5F9',
      gutterColor: '#94A3B8',

      // Highlight styles
      highlightBackground: '#FEF3C7',
      highlightGutterBackground: '#FDE68A',

      // Code fold styles
      codeFoldGutterBackground: '#E2E8F0',
      codeFoldBackground: '#F1F5F9',
      codeFoldContentColor: '#64748B',

      // Empty line
      emptyLineBackground: '#F8FAFC',
    },
    dark: {
      // Dark mode variants (using slightly muted tones)
      diffViewerBackground: '#0F172A',
      diffViewerTitleBackground: '#1E293B',
      diffViewerColor: '#E2E8F0',
      diffViewerTitleColor: '#CBD5E1',
      diffViewerTitleBorderColor: '#334155',

      addedBackground: '#064E3B',
      addedColor: '#A7F3D0',
      addedGutterBackground: '#065F46',
      addedGutterColor: '#6EE7B7',
      wordAddedBackground: '#047857',

      removedBackground: '#7F1D1D',
      removedColor: '#FECACA',
      removedGutterBackground: '#991B1B',
      removedGutterColor: '#FCA5A5',
      wordRemovedBackground: '#B91C1C',

      gutterBackground: '#1E293B',
      gutterBackgroundDark: '#334155',
      gutterColor: '#64748B',

      highlightBackground: '#78350F',
      highlightGutterBackground: '#92400E',

      codeFoldGutterBackground: '#334155',
      codeFoldBackground: '#1E293B',
      codeFoldContentColor: '#94A3B8',

      emptyLineBackground: '#1E293B',
    },
  },
  // Container styling
  diffContainer: {
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  // Title block styling
  titleBlock: {
    padding: '12px 16px',
    fontWeight: 600,
    fontSize: '14px',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderBottom: '1px solid #E2E8F0',
  },
  // Content styling
  content: {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
  },
  contentText: {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    padding: '0 12px',
  },
  // Line styling
  line: {
    '&:hover': {
      background: '#F1F5F9',
    },
  },
  // Line number styling
  lineNumber: {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    fontSize: '12px',
    fontWeight: 500,
    padding: '0 12px',
    userSelect: 'none' as const,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  // Gutter styling
  gutter: {
    padding: '0 8px',
    minWidth: '40px',
  },
  // Word diff styling for precise highlighting
  wordDiff: {
    padding: '2px 0',
  },
  wordAdded: {
    borderRadius: '3px',
    padding: '1px 4px',
    fontWeight: 500,
  },
  wordRemoved: {
    borderRadius: '3px',
    padding: '1px 4px',
    fontWeight: 500,
    textDecoration: 'line-through' as const,
    textDecorationColor: 'currentColor',
  },
  // Diff added/removed styling
  diffAdded: {
    borderLeft: '4px solid #10B981',
  },
  diffRemoved: {
    borderLeft: '4px solid #EF4444',
  },
  // Split view
  splitView: {
    '& > tbody > tr': {
      borderBottom: '1px solid #F1F5F9',
    },
  },
  // Marker (+ / - symbols)
  marker: {
    fontWeight: 700,
    padding: '0 8px',
    userSelect: 'none' as const,
  },
  // Empty gutter
  emptyGutter: {
    background: '#F8FAFC',
  },
  // Highlighted line
  highlightedLine: {
    background: '#FEF3C7 !important',
  },
  highlightedGutter: {
    background: '#FDE68A !important',
  },
};

// ============================================
// LOADING COMPONENT
// ============================================

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-16">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
        {/* Inner pulse */}
        <div className="absolute inset-2 rounded-full bg-emerald-100 animate-pulse" />
      </div>
      <p className="text-sm text-slate-500 font-medium">Computing diff...</p>
    </div>
  </div>
);

// ============================================
// HEADER COMPONENT
// ============================================

interface DiffHeaderProps {
  oldVersion: number;
  newVersion: number;
  onClose?: () => void;
}

const DiffHeader: React.FC<DiffHeaderProps> = ({ oldVersion, newVersion, onClose }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
          {oldVersion}
        </span>
        <span className="text-sm text-slate-600 font-medium">Original</span>
      </div>

      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
          {newVersion}
        </span>
        <span className="text-sm text-slate-600 font-medium">Updated</span>
      </div>
    </div>

    {onClose && (
      <button
        onClick={onClose}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Close diff viewer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

// ============================================
// SUMMARY COMPONENT
// ============================================

interface DiffSummaryProps {
  additions: number;
  deletions: number;
  changes: number;
}

const DiffSummary: React.FC<DiffSummaryProps> = ({ additions, deletions, changes }) => (
  <div className="flex items-center gap-4 px-4 py-2 bg-white border-b border-slate-200">
    <span className="text-xs text-slate-500 font-medium">Summary:</span>
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        {additions} additions
      </span>
      <span className="flex items-center gap-1 text-xs font-medium text-red-700">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        {deletions} deletions
      </span>
      <span className="text-xs text-slate-500">
        ({changes} lines changed)
      </span>
    </div>
  </div>
);

// ============================================
// DIFF STATISTICS HELPER
// ============================================

interface DiffStats {
  additions: number;
  deletions: number;
  changes: number;
}

function computeDiffStats(oldContent: string, newContent: string): DiffStats {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  let additions = 0;
  let deletions = 0;

  // Simple line-by-line comparison
  const maxLen = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined && newLine !== undefined) {
      additions++;
    } else if (oldLine !== undefined && newLine === undefined) {
      deletions++;
    } else if (oldLine !== newLine) {
      additions++;
      deletions++;
    }
  }

  return {
    additions,
    deletions,
    changes: additions + deletions,
  };
}

// ============================================
// MAIN COMPONENT
// ============================================

export const DiffViewer: React.FC<DiffViewerProps> = ({
  oldContent,
  newContent,
  oldVersion,
  newVersion,
  onClose,
}) => {
  // Loading state while computing diff
  const [isLoading, setIsLoading] = useState(true);

  // Compute diff stats
  const stats = useMemo(() => computeDiffStats(oldContent, newContent), [oldContent, newContent]);

  // Simulate brief loading for large diffs (provides visual feedback)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [oldContent, newContent]);

  // Check if there are any differences
  const hasDifferences = oldContent !== newContent;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      {/* Header with version labels */}
      <DiffHeader
        oldVersion={oldVersion}
        newVersion={newVersion}
        onClose={onClose}
      />

      {/* Diff summary */}
      {!isLoading && hasDifferences && (
        <DiffSummary
          additions={stats.additions}
          deletions={stats.deletions}
          changes={stats.changes}
        />
      )}

      {/* Main diff content */}
      <div className="relative">
        {isLoading ? (
          <LoadingSpinner />
        ) : !hasDifferences ? (
          <div className="flex items-center justify-center py-16 px-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">No differences</p>
              <p className="text-sm text-slate-400 mt-1">
                Version {oldVersion} and Version {newVersion} are identical
              </p>
            </div>
          </div>
        ) : (
          <ReactDiffViewer
            oldValue={oldContent}
            newValue={newContent}
            splitView={true}
            showDiffOnly={false}
            compareMethod={DiffMethod.WORDS}
            styles={beautifulStyles}
            leftTitle={
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold">
                  v{oldVersion}
                </span>
                <span>Previous</span>
              </span>
            }
            rightTitle={
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">
                  v{newVersion}
                </span>
                <span>Current</span>
              </span>
            }
            codeFoldMessageRenderer={(totalFoldedLines) => (
              <span className="text-slate-500">
                ... {totalFoldedLines} unchanged lines
              </span>
            )}
          />
        )}
      </div>

      {/* Footer with keyboard hint */}
      {!isLoading && hasDifferences && onClose && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-600 font-mono">Esc</kbd> to close
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default DiffViewer;
