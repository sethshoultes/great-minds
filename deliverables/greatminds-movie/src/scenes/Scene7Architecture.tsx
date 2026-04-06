import React from "react";
import {
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { colors, fonts } from "../styles";

interface ArchNode {
  label: string;
  indent: number;
  frameIn: number;
  highlight?: boolean;
}

const NODES: ArchNode[] = [
  { label: "Daemon (Agent SDK)", indent: 0, frameIn: 10 },
  {
    label: "Pipeline: PRD \u2192 Debate \u2192 Plan \u2192 Build \u2192 QA \u2192 Board \u2192 Ship",
    indent: 1,
    frameIn: 30,
  },
  { label: "Health Tick: every 5 minutes", indent: 1, frameIn: 50 },
  {
    label: "featureDream: brainstorm + board vote when idle",
    indent: 1,
    frameIn: 70,
    highlight: true,
  },
  { label: "Memory: SQLite + TF-IDF (155 memories)", indent: 1, frameIn: 90 },
  {
    label: "Dispatch: Agent tool + worktree isolation",
    indent: 1,
    frameIn: 110,
  },
  {
    label: "Directors (Sonnet) \u2192 Sub-agents (Haiku, ~5x cheaper)",
    indent: 1,
    frameIn: 130,
  },
  {
    label: "Commodity tasks \u2192 Cloudflare Workers AI (free)",
    indent: 1,
    frameIn: 150,
  },
];

/**
 * Scene 7: The Architecture
 * Architecture diagram builds top-down, featureDream pulses, Shipyard screenshot.
 */
export const Scene7Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Shipyard screenshot slides in from right at ~frame 350
  const shipyardStart = 350;
  const shipyardSlide = interpolate(
    frame - shipyardStart,
    [0, 25],
    [400, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shipyardOpacity = interpolate(
    frame - shipyardStart,
    [0, 15],
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
        padding: "60px 80px",
        gap: 40,
      }}
    >
      {/* Architecture diagram */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {NODES.map((node, i) => {
          const opacity = interpolate(
            frame - node.frameIn,
            [0, 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const translateY = interpolate(
            frame - node.frameIn,
            [0, 12],
            [20, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // featureDream pulse
          const pulse = node.highlight
            ? 1 + 0.03 * Math.sin(frame / 15)
            : 1;
          const glowColor = node.highlight ? colors.blue : "transparent";

          return (
            <div
              key={node.label}
              style={{
                opacity,
                transform: `translateY(${translateY}px) scale(${pulse})`,
                marginLeft: node.indent * 40,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {node.indent > 0 && (
                <div
                  style={{
                    width: 20,
                    height: 2,
                    backgroundColor: colors.surfaceLight,
                  }}
                />
              )}
              <div
                style={{
                  padding: "18px 28px",
                  borderRadius: 12,
                  backgroundColor: node.highlight
                    ? `${colors.blue}22`
                    : colors.surface,
                  border: `1px solid ${
                    node.highlight ? colors.blue : colors.surfaceLight
                  }`,
                  fontFamily: node.indent === 0 ? fonts.body : fonts.code,
                  fontSize: node.indent === 0 ? 38 : 28,
                  fontWeight: node.indent === 0 ? 800 : 500,
                  color: node.highlight
                    ? colors.blue
                    : node.indent === 0
                    ? colors.accent
                    : colors.text,
                  boxShadow: node.highlight
                    ? `0 0 20px ${colors.blue}33`
                    : "none",
                }}
              >
                {node.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipyard screenshot */}
      <div
        style={{
          width: 700,
          opacity: shipyardOpacity,
          transform: `translateX(${shipyardSlide}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: `2px solid ${colors.surfaceLight}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <Img
            src={staticFile("shipyard-homepage.png")}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 28,
            color: colors.accent,
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          Shipyard AI -- a company the daemon invented while we slept.
        </div>
      </div>
    </div>
  );
};
