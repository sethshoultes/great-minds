import React from "react";
import {
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { colors, fonts } from "../styles";

interface TableRow {
  role: string;
  model: string;
  cost: string;
  color: string;
}

const ROWS: TableRow[] = [
  {
    role: "Directors + Strategy",
    model: "Claude Sonnet",
    cost: "High",
    color: colors.accent,
  },
  {
    role: "Sub-agent execution",
    model: "Claude Haiku",
    cost: "~5x cheaper",
    color: colors.green,
  },
  {
    role: "Voice / Image / Sentiment",
    model: "Cloudflare Workers AI",
    cost: "Free",
    color: colors.blue,
  },
];

const STATS = [
  { label: "repos", value: 7 },
  { label: "agents", value: 14 },
  { label: "skills", value: 15 },
  { label: "live products", value: 3 },
  { label: "commits", value: 240 },
  { label: "PRs merged", value: 25 },
];

/**
 * Scene 8: The Cost Model
 * Animated table + stats overlay on homepage screenshot.
 */
export const Scene8CostModel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stats animate starting at frame 200
  const statsStart = 200;
  const statsProgress = interpolate(
    frame - statsStart,
    [0, 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        flexDirection: "column",
        padding: "56px 120px",
        gap: 40,
      }}
    >
      {/* Cost table */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 200px",
            gap: 4,
            opacity: interpolate(frame, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {["Role", "Model", "Cost"].map((h) => (
            <div
              key={h}
              style={{
                padding: "16px 24px",
                backgroundColor: colors.surfaceLight,
                fontFamily: fonts.body,
                fontSize: 22,
                fontWeight: 700,
                color: colors.textMuted,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {ROWS.map((row, i) => {
          const rowDelay = 20 + i * 10;
          const slideX = interpolate(
            frame - rowDelay,
            [0, 15],
            [-400, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const opacity = interpolate(
            frame - rowDelay,
            [0, 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={row.role}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 200px",
                gap: 4,
                opacity,
                transform: `translateX(${slideX}px)`,
              }}
            >
              <div
                style={{
                  padding: "18px 24px",
                  backgroundColor: colors.surface,
                  fontFamily: fonts.body,
                  fontSize: 24,
                  color: colors.text,
                }}
              >
                {row.role}
              </div>
              <div
                style={{
                  padding: "18px 24px",
                  backgroundColor: colors.surface,
                  fontFamily: fonts.code,
                  fontSize: 22,
                  color: row.color,
                }}
              >
                {row.model}
              </div>
              <div
                style={{
                  padding: "18px 24px",
                  backgroundColor: colors.surface,
                  fontFamily: fonts.body,
                  fontSize: 24,
                  fontWeight: 700,
                  color: row.color,
                }}
              >
                {row.cost}
              </div>
            </div>
          );
        })}
      </div>

      {/* Homepage screenshot + stats */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 48,
          alignItems: "center",
        }}
      >
        {/* Screenshot */}
        <div
          style={{
            flex: 1,
            borderRadius: 16,
            overflow: "hidden",
            border: `2px solid ${colors.surfaceLight}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Img
            src={staticFile("gm-homepage.png")}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            width: 500,
          }}
        >
          {STATS.map((stat, i) => {
            const statDelay = statsStart + i * 8;
            const statOpacity = interpolate(
              frame - statDelay,
              [0, 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={stat.label}
                style={{
                  opacity: statOpacity,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: "20px 24px",
                  border: `1px solid ${colors.surfaceLight}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.code,
                    fontSize: 42,
                    fontWeight: 800,
                    color: colors.accent,
                  }}
                >
                  {Math.round(stat.value * statsProgress)}
                  {stat.value >= 100 ? "+" : ""}
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 18,
                    color: colors.textMuted,
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
