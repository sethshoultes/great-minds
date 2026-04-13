/**
 * EmbeddableBadge Component
 * Spec: REQ-013, REQ-022, REQ-033, REQ-035
 *
 * Social-optimized badge for embedding on external sites.
 * Displays Pulse percentile with calculation date.
 *
 * Features:
 * - Social media optimized design (REQ-035)
 * - Calculation date display (REQ-033)
 * - Multiple themes (light/dark)
 * - Responsive sizing
 * - Self-contained styling
 */

"use client";

import React from "react";

/**
 * Base URL for Pulse service - configurable via environment variable
 * Falls back to production URL if not set
 */
const PULSE_BASE_URL = process.env.NEXT_PUBLIC_PULSE_BASE_URL || "https://pulse.localgenius.com";

export type BadgeTheme = "light" | "dark";
export type BadgeSize = "small" | "medium" | "large";

export interface EmbeddableBadgeProps {
  /** Percentile rank (0-100) */
  percentile: number;
  /** Business name */
  businessName: string;
  /** Date when benchmark was calculated (REQ-033) */
  calculatedAt: string;
  /** Badge theme */
  theme?: BadgeTheme;
  /** Badge size */
  size?: BadgeSize;
  /** Link to public report (optional) */
  reportUrl?: string;
  /** Insufficient data flag */
  insufficientData?: boolean;
  /** Optional className */
  className?: string;
}

/**
 * Get tier label based on percentile
 */
function getTierLabel(percentile: number): string {
  if (percentile >= 90) return "Top 10%";
  if (percentile >= 75) return "Top 25%";
  if (percentile >= 50) return "Above Average";
  return "Rising";
}

/**
 * Get tier color based on percentile
 */
function getTierColors(
  percentile: number,
  theme: BadgeTheme
): { accent: string; text: string } {
  const isLight = theme === "light";

  if (percentile >= 90) {
    return {
      accent: isLight ? "#059669" : "#34d399", // Emerald
      text: isLight ? "#065f46" : "#a7f3d0",
    };
  }
  if (percentile >= 75) {
    return {
      accent: isLight ? "#2563eb" : "#60a5fa", // Blue
      text: isLight ? "#1e40af" : "#bfdbfe",
    };
  }
  if (percentile >= 50) {
    return {
      accent: isLight ? "#d97706" : "#fbbf24", // Amber
      text: isLight ? "#92400e" : "#fde68a",
    };
  }
  return {
    accent: isLight ? "#6b7280" : "#9ca3af", // Gray
    text: isLight ? "#374151" : "#d1d5db",
  };
}

/**
 * Size configurations
 */
const sizeConfig: Record<
  BadgeSize,
  { width: number; height: number; fontSize: number; logoSize: number }
> = {
  small: { width: 180, height: 80, fontSize: 24, logoSize: 14 },
  medium: { width: 240, height: 100, fontSize: 32, logoSize: 16 },
  large: { width: 320, height: 130, fontSize: 42, logoSize: 20 },
};

/**
 * EmbeddableBadge - Social-optimized badge component
 */
export function EmbeddableBadge({
  percentile,
  businessName,
  calculatedAt,
  theme = "light",
  size = "medium",
  reportUrl,
  insufficientData = false,
  className = "",
}: EmbeddableBadgeProps) {
  const config = sizeConfig[size];
  const colors = getTierColors(percentile, theme);
  const tierLabel = getTierLabel(percentile);

  // Format calculation date (REQ-033)
  const formattedDate = new Date(calculatedAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  // Theme colors
  const bgColor = theme === "light" ? "#ffffff" : "#1f2937";
  const borderColor = theme === "light" ? "#e5e7eb" : "#374151";
  const textColor = theme === "light" ? "#374151" : "#e5e7eb";
  const subtextColor = theme === "light" ? "#6b7280" : "#9ca3af";

  // Render badge as SVG for social sharing optimization
  const badge = (
    <svg
      width={config.width}
      height={config.height}
      viewBox={`0 0 ${config.width} ${config.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Pulse Score: ${percentile}th percentile for ${businessName}`}
    >
      {/* Background */}
      <rect
        width={config.width}
        height={config.height}
        rx="12"
        fill={bgColor}
        stroke={borderColor}
        strokeWidth="2"
      />

      {/* Pulse logo */}
      <text
        x="16"
        y={config.logoSize + 12}
        fontSize={config.logoSize}
        fontWeight="700"
        fill={colors.accent}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        PULSE
      </text>

      {/* Verified checkmark */}
      <circle cx={config.width - 20} cy="20" r="10" fill={colors.accent} />
      <path
        d={`M${config.width - 24} 20l3 3 5-6`}
        stroke={bgColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {insufficientData ? (
        <>
          {/* Insufficient data display */}
          <text
            x={config.width / 2}
            y={config.height / 2 + 5}
            fontSize={config.fontSize * 0.5}
            fontWeight="600"
            fill={subtextColor}
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Benchmark Pending
          </text>
        </>
      ) : (
        <>
          {/* Percentile display */}
          <text
            x="16"
            y={config.height / 2 + config.fontSize / 3}
            fontSize={config.fontSize}
            fontWeight="700"
            fill={colors.accent}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {percentile}
            <tspan fontSize={config.fontSize * 0.5} dy="-8">
              th
            </tspan>
          </text>

          {/* Percentile label */}
          <text
            x={90 + (size === "small" ? -20 : size === "large" ? 30 : 0)}
            y={config.height / 2 + 5}
            fontSize={config.fontSize * 0.35}
            fontWeight="500"
            fill={textColor}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            percentile
          </text>

          {/* Tier badge */}
          <rect
            x={config.width - 80 - (size === "large" ? 20 : 0)}
            y={config.height / 2 - 12}
            width={70 + (size === "large" ? 20 : 0)}
            height="24"
            rx="12"
            fill={colors.accent}
            fillOpacity="0.15"
          />
          <text
            x={config.width - 45 - (size === "large" ? 10 : 0)}
            y={config.height / 2 + 5}
            fontSize={config.fontSize * 0.3}
            fontWeight="600"
            fill={colors.accent}
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {tierLabel}
          </text>
        </>
      )}

      {/* Business name */}
      <text
        x="16"
        y={config.height - 16}
        fontSize={config.fontSize * 0.3}
        fontWeight="500"
        fill={textColor}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {businessName.length > 25
          ? businessName.substring(0, 22) + "..."
          : businessName}
      </text>

      {/* Calculation date (REQ-033) */}
      <text
        x={config.width - 16}
        y={config.height - 16}
        fontSize={config.fontSize * 0.25}
        fill={subtextColor}
        textAnchor="end"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {formattedDate}
      </text>
    </svg>
  );

  // Wrap in link if reportUrl provided
  if (reportUrl) {
    return (
      <a
        href={reportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-90 transition-opacity"
        aria-label={`View full Pulse report for ${businessName}`}
      >
        {badge}
      </a>
    );
  }

  return badge;
}

/**
 * Generate embed code for external sites
 */
export function generateEmbedCode(
  embedId: string,
  options: {
    theme?: BadgeTheme;
    size?: BadgeSize;
  } = {}
): string {
  const { theme = "light", size = "medium" } = options;

  return `<script src="${PULSE_BASE_URL}/badges/badge-embed.js" data-pulse-id="${embedId}" data-theme="${theme}" data-size="${size}"></script>`;
}

/**
 * Generate static image URL for social sharing
 */
export function generateBadgeImageUrl(
  embedId: string,
  options: {
    theme?: BadgeTheme;
    size?: BadgeSize;
  } = {}
): string {
  const { theme = "light", size = "medium" } = options;

  return `${PULSE_BASE_URL}/api/badges/${embedId}.svg?theme=${theme}&size=${size}`;
}

export default EmbeddableBadge;
