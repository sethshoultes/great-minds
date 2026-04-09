'use client';

import { useState } from 'react';

interface RevertButtonProps {
  promptId: string;
  version: number;
  onRevert: () => void;
  disabled?: boolean;
}

/**
 * RevertButton - Button that shows a confirmation dialog before reverting to a previous version
 * The revert creates a NEW version with the old content (doesn't delete any versions)
 */
export function RevertButton({
  promptId,
  version,
  onRevert,
  disabled = false,
}: RevertButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRevertClick = () => {
    setShowDialog(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setError(null);
  };

  const handleConfirmRevert = async () => {
    setIsReverting(true);
    setError(null);

    try {
      const response = await fetch(`/api/prompts/${promptId}/revert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ version }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to revert');
      }

      setShowDialog(false);
      onRevert();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsReverting(false);
    }
  };

  return (
    <>
      {/* Revert Button */}
      <button
        onClick={handleRevertClick}
        disabled={disabled || isReverting}
        className={`
          px-4 py-2
          bg-amber-500 hover:bg-amber-600
          text-white font-medium
          rounded-md
          text-sm
          transition-colors
          disabled:bg-gray-300 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
        `}
      >
        Revert to v{version}
      </button>

      {/* Confirmation Dialog Overlay */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancel}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Revert to version {version}?
            </h3>

            <p className="text-gray-600 mb-6">
              This will create a new version with that content. No existing versions will be deleted.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={isReverting}
                className={`
                  px-4 py-2
                  bg-gray-100 hover:bg-gray-200
                  text-gray-700 font-medium
                  rounded-md
                  text-sm
                  transition-colors
                  disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                `}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevert}
                disabled={isReverting}
                className={`
                  px-4 py-2
                  bg-amber-500 hover:bg-amber-600
                  text-white font-medium
                  rounded-md
                  text-sm
                  transition-colors
                  disabled:bg-amber-300 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                `}
              >
                {isReverting ? 'Reverting...' : 'Revert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RevertButton;
