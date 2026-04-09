/**
 * PulseScore Component
 * Spec: REQ-002, REQ-003, REQ-019
 *
 * Displays a single, prominent percentile rank as the hero metric.
 * Uses transparent percentile display (not proprietary score).
 *
 * Features:
 * - Large, visually prominent percentile display
 * - Color-coded indicator (green/yellow/red based on performance)
 * - Contextual interpretation text
 * - Accessible design with ARIA labels
 */

"use client";

import React from "react";

export interface PulseScoreProps {
  /** Percentile rank (0-100) */
  percentile: number;
  /** Business name for display */
  businessName: string;
  /** Date when benchmark was calculated (REQ-033) */
  calculatedAt: string;
  /** Whether data is still being calculated */
  isLoading?: boolean;
  /** Whether there's insufficient peer data */
  insufficientData?: boolean;
  /** Custom message for insufficient data (REQ-036) */
  insufficientDataMessage?: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * Get color class based on percentile tier
 */
function getPercentileColor(percentile: number): string {
  if (percentile >= 75) return "text-green-600";
  if (percentile >= 50) return "text-yellow-600";
  if (percentile >= 25) return "text-orange-500";
  return "text-red-500";
}

/**
 * Get background gradient based on percentile tier
 */
function getPercentileGradient(percentile: number): string {
  if (percentile >= 75) return "from-green-50 to-green-100";
  if (percentile >= 50) return "from-yellow-50 to-yellow-100";
  if (percentile >= 25) return "from-orange-50 to-orange-100";
  return "from-red-50 to-red-100";
}

/**
 * Get interpretation text for percentile (REQ-003 - transparent)
 */
function getInterpretation(percentile: number): string {
  if (percentile >= 90) return "Outstanding! You're in the top 10% of restaurants.";
  if (percentile >= 75) return "Great performance! You're outperforming most restaurants.";
  if (percentile >= 50) return "Good standing. You're performing above average.";
  if (percentile >= 25) return "Room to grow. You're performing below average.";
  return "Needs attention. Let's work on improving your metrics.";
}

/**
 * Get ordinal suffix for percentile display
 */
function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * PulseScore - Hero percentile display component
 */
export function PulseScore({
  percentile,
  businessName,
  calculatedAt,
  isLoading = false,
  insufficientData = false,
  insufficientDataMessage,
  className = "",
}: PulseScoreProps) {
  // Format calculation date
  const formattedDate = new Date(calculatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Handle insufficient data state (REQ-036)
  if (insufficientData) {
    return (
      <div
        className={`bg-gray-50 rounded-2xl p-8 text-center ${className}`}
        role="region"
        aria-label="Pulse Score"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Your Pulse Score
        </h2>
        <div className="text-6xl font-bold text-gray-300 mb-4">--</div>
        <p className="text-gray-500 max-w-md mx-auto">
          {insufficientDataMessage ||
            "We don't have enough data from similar restaurants in your area yet. Check back soon as more businesses join Pulse!"}
        </p>
        <p className="text-sm text-gray-400 mt-4">
          We need at least 10 similar restaurants to calculate your ranking.
        </p>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div
        className={`bg-gray-100 rounded-2xl p-8 text-center animate-pulse ${className}`}
        role="region"
        aria-label="Loading Pulse Score"
      >
        <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
        <div className="h-24 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
      </div>
    );
  }

  const colorClass = getPercentileColor(percentile);
  const gradientClass = getPercentileGradient(percentile);
  const interpretation = getInterpretation(percentile);

  return (
    <div
      className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-8 text-center shadow-lg ${className}`}
      role="region"
      aria-label={`Pulse Score: ${percentile}${getOrdinalSuffix(percentile)} percentile`}
    >
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Your Pulse Score
      </h2>
      <p className="text-sm text-gray-500 mb-6">{businessName}</p>

      {/* Hero Percentile Display (REQ-002, REQ-003) */}
      <div className="relative mb-6">
        <span
          className={`text-7xl font-bold ${colorClass} tabular-nums`}
          aria-hidden="true"
        >
          {percentile}
        </span>
        <span className={`text-3xl font-bold ${colorClass} align-top`}>
          {getOrdinalSuffix(percentile)}
        </span>
        <p className="text-lg text-gray-600 mt-2">percentile</p>
      </div>

      {/* Visual Progress Ring */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={colorClass}
            strokeDasharray={`${percentile * 2.83} 283`}
            style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass}`}>
            {percentile}%
          </span>
        </div>
      </div>

      {/* Interpretation (transparent - REQ-003) */}
      <p className="text-gray-700 font-medium mb-4">{interpretation}</p>

      {/* Transparency note */}
      <p className="text-sm text-gray-500">
        Compared to {percentile >= 50 ? "similar" : "other"} restaurants in your area
      </p>

      {/* Calculation date (REQ-033) */}
      <p className="text-xs text-gray-400 mt-4">
        Last updated: {formattedDate}
      </p>
    </div>
  );
}

export default PulseScore;
