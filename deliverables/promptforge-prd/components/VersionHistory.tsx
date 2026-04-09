'use client';

import { useState, useEffect } from 'react';
import { Version } from '@/lib/types';

/**
 * Props for the VersionHistory component
 */
interface VersionHistoryProps {
  promptId: string;
  currentVersion: number;
  onVersionSelect: (version: Version) => void;
}

/**
 * Format a timestamp to relative time (e.g., "2 hours ago")
 */
function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
}

/**
 * Loading skeleton for version list items
 */
function VersionSkeleton() {
  return (
    <div className="animate-pulse p-3 border-b border-gray-200">
      <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-24"></div>
    </div>
  );
}

/**
 * VersionHistory - Right sidebar showing all versions of a prompt
 *
 * Displays a scrollable list of versions with:
 * - Version number (v1, v2, etc.)
 * - Relative timestamp
 * - Current version highlighted with accent color
 */
export default function VersionHistory({
  promptId,
  currentVersion,
  onVersionSelect,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVersions() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/prompts/${promptId}/versions`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch versions');
        }

        const data = await response.json();
        // API returns versions in ascending order, reverse for newest first
        const sortedVersions = [...data.versions].reverse();
        setVersions(sortedVersions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch versions');
      } finally {
        setLoading(false);
      }
    }

    if (promptId) {
      fetchVersions();
    }
  }, [promptId]);

  return (
    <aside className="w-64 h-full border-l border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Version History</h2>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Loading skeleton
          <>
            <VersionSkeleton />
            <VersionSkeleton />
            <VersionSkeleton />
          </>
        ) : error ? (
          // Error state
          <div className="p-4 text-sm text-red-600">
            {error}
          </div>
        ) : versions.length === 0 ? (
          // Empty state
          <div className="p-4 text-sm text-gray-500">
            No versions found
          </div>
        ) : (
          // Version list
          <ul className="divide-y divide-gray-100">
            {versions.map((version) => {
              const isCurrentVersion = version.version_number === currentVersion;

              return (
                <li key={version.id}>
                  <button
                    onClick={() => onVersionSelect(version)}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                      isCurrentVersion
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          isCurrentVersion ? 'text-blue-700' : 'text-gray-900'
                        }`}
                      >
                        v{version.version_number}
                      </span>
                      {isCurrentVersion && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          current
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {getRelativeTime(version.created_at)}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
