/**
 * ProgressTracking Component (PRE-LAUNCH BLOCKER #1)
 * Spec: Board Condition #1 — "Last Week vs. This Week" comparison
 *
 * Displays percentile change over time with:
 * - Side-by-side week comparison
 * - Sparkline trend visualization
 * - Milestone celebrations for significant gains
 * - Full accessibility support (icons alongside colors)
 */

"use client";

import React, { useMemo } from "react";

export interface HistoryPoint {
  date: string;
  percentile: number;
}

export interface ProgressTrackingProps {
  /** Current percentile rank (0-100) */
  currentPercentile: number;
  /** Previous week's percentile rank (0-100) */
  previousPercentile: number;
  /** Historical percentile data (30 days) */
  history: HistoryPoint[];
  /** Optional className for styling */
  className?: string;
  /** Whether data is loading */
  isLoading?: boolean;
}

/**
 * Arrow icon component for direction indication
 */
function DirectionIcon({
  direction,
  className = "",
}: {
  direction: "up" | "down" | "flat";
  className?: string;
}) {
  const iconPaths = {
    up: "M5 15l7-7 7 7",
    down: "M19 9l-7 7-7-7",
    flat: "M4 12h16",
  };

  const colors = {
    up: "text-green-600",
    down: "text-red-500",
    flat: "text-gray-500",
  };

  return (
    <svg
      className={`w-5 h-5 ${colors[direction]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[direction]} />
    </svg>
  );
}

/**
 * Status icon for accessibility (checkmark, warning, etc.)
 */
function StatusIcon({
  status,
  className = "",
}: {
  status: "good" | "caution" | "needs-attention";
  className?: string;
}) {
  if (status === "good") {
    return (
      <svg
        className={`w-5 h-5 text-green-600 ${className}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-label="Good standing"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  if (status === "caution") {
    return (
      <svg
        className={`w-5 h-5 text-yellow-600 ${className}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-label="Caution"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`w-5 h-5 text-red-500 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-label="Needs attention"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

/**
 * Sparkline component for 30-day trend visualization
 */
function Sparkline({
  data,
  width = 200,
  height = 40,
}: {
  data: number[];
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Create SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const pathD = `M${points.join(" L")}`;

  // Determine trend color
  const isPositive = data[data.length - 1] >= data[0];
  const strokeColor = isPositive ? "#16a34a" : "#dc2626";
  const fillColor = isPositive ? "rgba(22, 163, 74, 0.1)" : "rgba(220, 38, 38, 0.1)";

  // Create area fill path
  const areaD = `${pathD} L${width},${height} L0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      className="inline-block"
      role="img"
      aria-label={`30-day trend: ${isPositive ? "improving" : "declining"}`}
    >
      {/* Area fill with pattern for accessibility */}
      <defs>
        <pattern
          id="trend-pattern"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <path
            d="M0,0 L4,4 M-1,3 L1,5 M3,-1 L5,1"
            stroke={strokeColor}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <path d={areaD} fill={fillColor} />
      <path d={areaD} fill="url(#trend-pattern)" />

      {/* Trend line */}
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" />

      {/* End point marker */}
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="3"
        fill={strokeColor}
      />
    </svg>
  );
}

/**
 * Calculate milestone achievements
 */
function getMilestone(
  currentPercentile: number,
  history: HistoryPoint[]
): string | null {
  if (history.length < 7) return null;

  // Find the oldest point in history
  const oldestPoint = history[0];
  const totalGain = currentPercentile - oldestPoint.percentile;

  // Milestone thresholds
  if (totalGain >= 20) {
    return `Amazing! You've gained ${totalGain} percentile points since ${new Date(oldestPoint.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}!`;
  }
  if (totalGain >= 10) {
    return `Great progress! You've improved ${totalGain} points since ${new Date(oldestPoint.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}!`;
  }

  // Check for tier crossings
  const oldTier = Math.floor(oldestPoint.percentile / 25);
  const newTier = Math.floor(currentPercentile / 25);

  if (newTier > oldTier && currentPercentile >= 75) {
    return "You've reached the top 25%! Keep up the great work!";
  }
  if (newTier > oldTier && currentPercentile >= 50) {
    return "You've crossed into the top half! Your efforts are paying off.";
  }

  return null;
}

/**
 * Get status based on percentile
 */
function getStatus(
  percentile: number
): "good" | "caution" | "needs-attention" {
  if (percentile >= 50) return "good";
  if (percentile >= 25) return "caution";
  return "needs-attention";
}

/**
 * ProgressTracking Component
 */
export function ProgressTracking({
  currentPercentile,
  previousPercentile,
  history,
  className = "",
  isLoading = false,
}: ProgressTrackingProps) {
  // Calculate delta
  const delta = currentPercentile - previousPercentile;
  const direction: "up" | "down" | "flat" =
    delta > 0 ? "up" : delta < 0 ? "down" : "flat";

  // Extract percentile values for sparkline
  const sparklineData = useMemo(
    () => history.map((h) => h.percentile),
    [history]
  );

  // Check for milestone
  const milestone = useMemo(
    () => getMilestone(currentPercentile, history),
    [currentPercentile, history]
  );

  // Format delta for display
  const deltaDisplay = delta > 0 ? `+${delta}` : delta.toString();

  // Handle loading state
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-xl p-6 shadow-md animate-pulse ${className}`}
        role="region"
        aria-label="Loading progress tracking"
      >
        <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="flex justify-between mb-6">
          <div className="h-20 bg-gray-200 rounded w-32"></div>
          <div className="h-20 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-md ${className}`}
      role="region"
      aria-label="Progress tracking: week-over-week comparison"
    >
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        Your Progress
        <StatusIcon status={getStatus(currentPercentile)} />
      </h3>

      {/* Side-by-side comparison */}
      <div className="flex justify-between items-start mb-6">
        {/* Last Week */}
        <div className="text-center flex-1">
          <p className="text-sm text-gray-500 mb-2">Last Week</p>
          <p className="text-3xl font-bold text-gray-600 tabular-nums">
            {previousPercentile}
            <span className="text-lg align-top">th</span>
          </p>
          <p className="text-xs text-gray-400">percentile</p>
        </div>

        {/* Delta indicator */}
        <div className="flex flex-col items-center justify-center px-4 py-2">
          <DirectionIcon direction={direction} className="mb-1" />
          <span
            className={`text-lg font-bold tabular-nums ${
              delta > 0
                ? "text-green-600"
                : delta < 0
                  ? "text-red-500"
                  : "text-gray-500"
            }`}
            aria-label={`Change: ${deltaDisplay} points`}
          >
            {deltaDisplay}
          </span>
          <span className="text-xs text-gray-400">points</span>
        </div>

        {/* This Week */}
        <div className="text-center flex-1">
          <p className="text-sm text-gray-500 mb-2">This Week</p>
          <p
            className={`text-3xl font-bold tabular-nums ${
              currentPercentile >= 50 ? "text-green-600" : "text-gray-800"
            }`}
          >
            {currentPercentile}
            <span className="text-lg align-top">th</span>
          </p>
          <p className="text-xs text-gray-400">percentile</p>
        </div>
      </div>

      {/* 30-day sparkline */}
      {sparklineData.length > 1 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">30-Day Trend</p>
          <Sparkline data={sparklineData} width={280} height={40} />
        </div>
      )}

      {/* Milestone celebration */}
      {milestone && (
        <div
          className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Celebration">
              🎉
            </span>
            <p className="text-sm font-medium text-green-800">{milestone}</p>
          </div>
        </div>
      )}

      {/* Accessibility note */}
      <p className="sr-only">
        Your percentile ranking changed from {previousPercentile} to{" "}
        {currentPercentile}, a change of {deltaDisplay} points.
        {milestone && ` ${milestone}`}
      </p>
    </div>
  );
}

export default ProgressTracking;
