/**
 * PeerGroupSelector Component
 * Spec: REQ-021
 *
 * Displays the current peer group criteria (read-only).
 * Shows which restaurants the business is being compared against.
 *
 * Features:
 * - Read-only display of peer criteria
 * - Shows region, size bracket, and industry
 * - Indicates if using fallback (state vs MSA)
 * - Transparency about comparison methodology
 */

"use client";

import React from "react";

export interface PeerGroupCriteria {
  /** Geographic region name */
  region: string;
  /** Region type: 'msa' (metro area) or 'state' */
  regionType: "msa" | "state";
  /** Business size bucket */
  sizeBucket: string;
  /** Number of businesses in peer group */
  memberCount: number;
  /** Whether using optimal peer group or fallback */
  isOptimal: boolean;
  /** Any warnings about the peer group */
  warnings: string[];
}

export interface PeerGroupSelectorProps {
  /** Peer group criteria */
  criteria: PeerGroupCriteria;
  /** Industry name (always "Restaurants" for v1) */
  industry?: string;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Optional className */
  className?: string;
}

/**
 * Format size bucket for display
 */
function formatSizeBucket(bucket: string): string {
  const labels: Record<string, string> = {
    MICRO: "1-5 employees",
    SMALL: "6-15 employees",
    MEDIUM: "16-50 employees",
    LARGE: "51+ employees",
  };
  return labels[bucket] || bucket;
}

/**
 * Get icon for region type
 */
function RegionIcon({ type }: { type: "msa" | "state" }) {
  if (type === "msa") {
    // City/metro icon
    return (
      <svg
        className="w-5 h-5 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    );
  }
  // State/map icon
  return (
    <svg
      className="w-5 h-5 text-purple-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  );
}

/**
 * PeerGroupSelector - Read-only peer group display
 */
export function PeerGroupSelector({
  criteria,
  industry = "Restaurants",
  isLoading = false,
  className = "",
}: PeerGroupSelectorProps) {
  if (isLoading) {
    return (
      <div
        className={`bg-gray-50 rounded-xl p-6 animate-pulse ${className}`}
        role="region"
        aria-label="Loading peer group information"
      >
        <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-36" />
          <div className="h-4 bg-gray-200 rounded w-52" />
        </div>
      </div>
    );
  }

  const regionLabel =
    criteria.regionType === "msa"
      ? `${criteria.region} Metro Area`
      : `${criteria.region} (Statewide)`;

  return (
    <div
      className={`bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 ${className}`}
      role="region"
      aria-label="Your peer group"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-slate-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-slate-800">Your Peer Group</h3>
      </div>

      {/* Criteria list */}
      <div className="space-y-3">
        {/* Industry */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500">Industry</p>
            <p className="font-medium text-slate-800">{industry}</p>
          </div>
        </div>

        {/* Region */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full ${
              criteria.regionType === "msa" ? "bg-blue-100" : "bg-purple-100"
            } flex items-center justify-center`}
          >
            <RegionIcon type={criteria.regionType} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Location</p>
            <p className="font-medium text-slate-800">{regionLabel}</p>
          </div>
        </div>

        {/* Size */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500">Business Size</p>
            <p className="font-medium text-slate-800">
              {formatSizeBucket(criteria.sizeBucket)}
            </p>
          </div>
        </div>

        {/* Peer count */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500">Compared Against</p>
            <p className="font-medium text-slate-800">
              {criteria.memberCount.toLocaleString()} similar restaurants
            </p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {criteria.warnings.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex gap-2">
            <svg
              className="w-5 h-5 text-amber-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              {criteria.warnings.map((warning, idx) => (
                <p key={idx} className="text-sm text-amber-700">
                  {warning}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fallback indicator */}
      {criteria.regionType === "state" && (
        <p className="text-xs text-slate-500 mt-4">
          Using statewide comparison because fewer than 50 similar restaurants
          are in your metro area.
        </p>
      )}

      {/* Transparency note */}
      <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-200">
        Your percentile shows where you rank among these peers. We don't use
        proprietary scoring - just transparent, straightforward percentiles.
      </p>
    </div>
  );
}

export default PeerGroupSelector;
