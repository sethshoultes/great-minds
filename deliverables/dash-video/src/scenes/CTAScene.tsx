import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

const STATS = [
  "6KB gzipped",
  "Zero dependencies",
  "Works with any theme",
];

/**
 * Scene 5 (0:33 - 0:45): Stats bar, Dash logo, URL. Clean and final.
 * Stats appear one at a time (400ms spacing). Logo fades 600ms. URL types out. Hold 3s.
 */
export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stats appear one at a time with 400ms (12 frame) spacing, starting at frame 15
  const statSpacing = Math.round(0.4 * fps); // 12 frames

  // Logo fades in over 600ms (~18 frames) after stats
  const logoStart = 15 + STATS.length * statSpacing + 10;
  const logoOpacity = interpolate(frame, [logoStart, logoStart + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // URL types out after logo
  const url = "developer.emdash.agency/dash";
  const urlStart = logoStart + 30;
  const urlCharsPerFrame = 1 / (0.04 * fps);
  const urlCharsVisible = Math.min(
    Math.max(0, Math.floor((frame - urlStart) * urlCharsPerFrame)),
    url.length
  );
  const displayedUrl = url.slice(0, urlCharsVisible);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 42,
      }}
    >
      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          gap: 56,
          marginBottom: 28,
        }}
      >
        {STATS.map((stat, i) => {
          const statStart = 15 + i * statSpacing;
          const statOpacity = interpolate(
            frame,
            [statStart, statStart + 8],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={stat}
              style={{
                fontFamily: fonts.code,
                fontSize: 28,
                fontWeight: 600,
                color: colors.textMuted,
                opacity: statOpacity,
                padding: "12px 28px",
                border: `1px solid ${colors.surfaceLight}`,
                borderRadius: 8,
              }}
            >
              {stat}
            </div>
          );
        })}
      </div>

      {/* Logo: forward slash inside rounded square */}
      <div
        style={{
          opacity: logoOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 22,
            backgroundColor: colors.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.code,
            fontSize: 64,
            fontWeight: 900,
            color: colors.text,
          }}
        >
          /
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 78,
            fontWeight: 800,
            color: colors.text,
            letterSpacing: -1,
          }}
        >
          Dash
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 28,
            color: colors.textMuted,
          }}
        >
          A keyboard shortcut that makes WordPress feel modern.
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          fontFamily: fonts.code,
          fontSize: 36,
          color: colors.accent,
          letterSpacing: 1,
        }}
      >
        {displayedUrl}
      </div>
    </div>
  );
};
