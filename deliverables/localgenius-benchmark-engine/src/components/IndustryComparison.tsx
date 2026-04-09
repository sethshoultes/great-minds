/**
 * IndustryComparison Component
 * Spec: REQ-010, REQ-020
 *
 * Displays 3-4 comparison charts showing how the business
 * performs against industry benchmarks across key metrics.
 *
 * Features:
 * - Bar chart visualization for each metric
 * - Percentile position indicator
 * - Metric explanations
 * - Responsive design
 */

"use client";

import React from "react";

export interface MetricComparison {
  /** Metric identifier */
  name: string;
  /** Display name for the metric */
  displayName: string;
  /** The business's actual value */
  value: number;
  /** Unit of measurement */
  unit: string;
  /** Percentile rank (0-100) */
  percentile: number;
  /** Interpretation text */
  interpretation: string;
}

export interface IndustryComparisonProps {
  /** Array of metrics to display (3-4 recommended) */
  metrics: MetricComparison[];
  /** Peer group description */
  peerGroupDescription: string;
  /** Number of businesses in peer group */
  peerGroupSize: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Optional className */
  className?: string;
}

/**
 * Get color based on percentile
 */
function getPercentileColor(percentile: number): {
  bar: string;
  text: string;
  bg: string;
} {
  if (percentile >= 75) {
    return { bar: "bg-green-500", text: "text-green-700", bg: "bg-green-50" };
  }
  if (percentile >= 50) {
    return { bar: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50" };
  }
  if (percentile >= 25) {
    return { bar: "bg-orange-500", text: "text-orange-700", bg: "bg-orange-50" };
  }
  return { bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50" };
}

/**
 * Format metric value with appropriate precision
 */
function formatValue(value: number, unit: string): string {
  if (unit === "%") return `${value.toFixed(1)}%`;
  if (unit === "hours") return `${value.toFixed(1)}h`;
  if (unit === "posts/week") return `${value.toFixed(1)}/wk`;
  if (unit.includes("week-over-week")) return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  return value.toFixed(1);
}

/**
 * Single metric comparison bar
 */
function MetricBar({ metric }: { metric: MetricComparison }) {
  const colors = getPercentileColor(metric.percentile);

  return (
    <div
      className={`${colors.bg} rounded-xl p-4 transition-all hover:shadow-md`}
      role="listitem"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-800">{metric.displayName}</h4>
          <p className="text-sm text-gray-500">
            {formatValue(metric.value, metric.unit)}
          </p>
        </div>
        <div className={`text-right ${colors.text}`}>
          <span className="text-2xl font-bold">{metric.percentile}</span>
          <span className="text-sm">%ile</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${colors.bar} rounded-full transition-all duration-500`}
          style={{ width: `${metric.percentile}%` }}
          role="progressbar"
          aria-valuenow={metric.percentile}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${metric.displayName}: ${metric.percentile}th percentile`}
        />
        {/* Median marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-400"
          style={{ left: "50%" }}
          aria-hidden="true"
        />
      </div>

      {/* Percentile scale labels */}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

      {/* Interpretation */}
      <p className="text-sm text-gray-600 mt-3">{metric.interpretation}</p>
    </div>
  );
}

/**
 * Loading skeleton for metric bar
 */
function MetricBarSkeleton() {
  return (
    <div className="bg-gray-100 rounded-xl p-4 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-3 bg-gray-200 rounded-full mb-4" />
      <div className="h-4 bg-gray-200 rounded w-48" />
    </div>
  );
}

/**
 * IndustryComparison - Multi-metric comparison visualization
 */
export function IndustryComparison({
  metrics,
  peerGroupDescription,
  peerGroupSize,
  isLoading = false,
  className = "",
}: IndustryComparisonProps) {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Industry Comparison
          </h3>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          role="list"
          aria-label="Loading metric comparisons"
        >
          {[1, 2, 3, 4].map((i) => (
            <MetricBarSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Display 3-4 metrics as specified in REQ-010
  const displayMetrics = metrics.slice(0, 4);

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Industry Comparison
        </h3>
        <p className="text-sm text-gray-500">
          vs. {peerGroupSize.toLocaleString()} {peerGroupDescription}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-600">Top 25%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-600">Above Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-gray-600">Below Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-600">Bottom 25%</span>
        </div>
      </div>

      {/* Metric Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        role="list"
        aria-label="Metric comparisons"
      >
        {displayMetrics.map((metric) => (
          <MetricBar key={metric.name} metric={metric} />
        ))}
      </div>

      {/* Transparency note */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Percentiles show where you rank among similar restaurants.
        50th percentile = median (average) performance.
      </p>
    </div>
  );
}

export default IndustryComparison;
