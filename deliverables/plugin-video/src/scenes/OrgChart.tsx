import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 3 (0:15 - 0:28): Org chart builds top-down
 * Board of Directors -> 3 tiers -> skill badges orbit -> cron pulses
 */

interface TierNode {
  label: string;
  color: string;
}

const TIERS: TierNode[][] = [
  [{ label: "Board of Directors", color: colors.accent }],
  [
    { label: "Strategy", color: colors.blue },
    { label: "Build", color: colors.green },
    { label: "Operations", color: colors.amber },
  ],
  [
    { label: "Jobs", color: colors.blue },
    { label: "Musk", color: colors.blue },
    { label: "Hamilton", color: colors.green },
    { label: "Ive", color: colors.green },
    { label: "Huang", color: colors.green },
    { label: "Aurelius", color: colors.amber },
  ],
  [
    { label: "Angelou", color: colors.blue },
    { label: "Sorkin", color: colors.blue },
    { label: "Blakely", color: colors.green },
    { label: "Buffett", color: colors.amber },
    { label: "Jackson", color: colors.amber },
    { label: "Rubin", color: colors.amber },
  ],
];

const SKILLS = [
  "brand-audit",
  "market-fit",
  "code-review",
  "qa-sweep",
  "copy-draft",
  "design-system",
  "growth-hack",
  "risk-model",
  "narrative",
  "team-build",
  "sound-check",
  "fundraise",
];

export const OrgChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 120ms per tier
  const framesPerTier = Math.ceil(0.12 * fps);

  // Cron pulse: concentric rings every 2 seconds
  const pulseInterval = 2 * fps;
  const pulseCount = Math.floor(frame / pulseInterval);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 80px",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 24,
          color: colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginBottom: 36,
          borderBottom: `1px solid ${colors.surfaceLight}`,
          paddingBottom: 18,
          width: "100%",
        }}
      >
        Agency Architecture
      </div>

      {/* Org chart tiers */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          width: "100%",
        }}
      >
        {TIERS.map((tier, tierIndex) => {
          const tierStart = tierIndex * framesPerTier * 8;
          const tierOpacity = interpolate(
            frame - tierStart,
            [0, 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const tierSlide = interpolate(
            frame - tierStart,
            [0, 12],
            [-30, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={tierIndex}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: tierIndex === 0 ? 0 : 20,
                opacity: tierOpacity,
                transform: `translateY(${tierSlide}px)`,
              }}
            >
              {tier.map((node) => (
                <div
                  key={node.label}
                  style={{
                    backgroundColor: colors.surface,
                    border: `2px solid ${node.color}`,
                    borderRadius: tierIndex === 0 ? 16 : 10,
                    padding: tierIndex === 0 ? "18px 48px" : "12px 22px",
                    fontFamily: fonts.body,
                    fontSize: tierIndex === 0 ? 32 : tierIndex === 1 ? 22 : 18,
                    fontWeight: tierIndex === 0 ? 800 : 600,
                    color: colors.text,
                    textAlign: "center",
                    boxShadow: `0 0 14px ${node.color}33`,
                  }}
                >
                  {node.label}
                </div>
              ))}
            </div>
          );
        })}

        {/* Connector lines (simplified vertical dashes) */}
        {TIERS.slice(0, -1).map((_, i) => {
          const lineStart = i * framesPerTier * 8 + 6;
          const lineOpacity = interpolate(
            frame - lineStart,
            [0, 8],
            [0, 0.4],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return null; // Lines are implicit via layout gap
        })}
      </div>

      {/* Skill badges - orbit-like row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          marginTop: 20,
          maxWidth: 1200,
        }}
      >
        {SKILLS.map((skill, i) => {
          const badgeStart = 140 + i * 6;
          const badgeOpacity = interpolate(
            frame - badgeStart,
            [0, 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          // Slight orbital drift
          const drift = Math.sin((frame + i * 20) * 0.03) * 4;

          return (
            <div
              key={skill}
              style={{
                fontFamily: fonts.code,
                fontSize: 16,
                color: colors.accent,
                backgroundColor: `${colors.accent}18`,
                border: `1px solid ${colors.accent}44`,
                borderRadius: 20,
                padding: "6px 16px",
                opacity: badgeOpacity,
                transform: `translateY(${drift}px)`,
              }}
            >
              {skill}
            </div>
          );
        })}
      </div>

      {/* Heartbeat cron pulse */}
      {Array.from({ length: Math.min(pulseCount + 1, 4) }).map((_, i) => {
        const pulseStart = i * pulseInterval;
        const pulseProgress = interpolate(
          frame - pulseStart,
          [0, pulseInterval],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              width: 60 + pulseProgress * 200,
              height: 60 + pulseProgress * 200,
              borderRadius: "50%",
              border: `2px solid ${colors.amber}`,
              opacity: 1 - pulseProgress,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Heartbeat label */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: fonts.code,
          fontSize: 16,
          color: colors.amber,
          backgroundColor: colors.bg,
          padding: "4px 14px",
          borderRadius: 8,
          border: `1px solid ${colors.amber}44`,
        }}
      >
        HEARTBEAT
      </div>
    </div>
  );
};
