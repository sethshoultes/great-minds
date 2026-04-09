'use client';

import { Version } from '@/lib/types';

interface VersionSelectorProps {
  versions: Version[];
  selectedVersion: number | null;
  onSelect: (versionNumber: number) => void;
  label?: string;
  disabled?: boolean;
}

/**
 * VersionSelector - Dropdown component to select a prompt version
 * Displays versions in format "v{N} - {timestamp}"
 */
export function VersionSelector({
  versions,
  selectedVersion,
  onSelect,
  label,
  disabled = false,
}: VersionSelectorProps) {
  /**
   * Format timestamp for display
   * Converts ISO string to readable format: "Apr 9, 2024 2:30 PM"
   */
  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        value={selectedVersion ?? ''}
        onChange={(e) => onSelect(Number(e.target.value))}
        disabled={disabled}
        className={`
          px-3 py-2
          border border-gray-300 rounded-md
          bg-white text-gray-900
          text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
          transition-colors
        `}
      >
        <option value="" disabled>
          Select version...
        </option>
        {versions.map((version) => (
          <option key={version.id} value={version.version_number}>
            v{version.version_number} - {formatTimestamp(version.created_at)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default VersionSelector;
