import React from "react";
import {
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { colors, fonts } from "../styles";

const PIPELINE_NODES = [
  "PRD",
  "Debate",
  "Plan",
  "Build",
  "QA x2",
  "Board",
  "Ship",
];

/**
 * Scene 3: The Debate Framework
 * Animated pipeline, Steve vs Elon quote bubbles, Rick Rubin appearance.
 */
export const Scene3Debate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        flexDirection: "column",
        padding: "64px 120px",
      }}
    >
      {/* Pipeline */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {PIPELINE_NODES.map((node, i) => {
          const nodeDelay = i * 15;
          const nodeOpacity = interpolate(
            frame - nodeDelay,
            [0, 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const isActive = node === "Debate";
          return (
            <React.Fragment key={node}>
              <div
                style={{
                  opacity: nodeOpacity,
                  padding: "16px 28px",
                  borderRadius: 12,
                  backgroundColor: isActive
                    ? colors.accent
                    : colors.surface,
                  border: `2px solid ${
                    isActive ? colors.accent : colors.surfaceLight
                  }`,
                  fontFamily: fonts.body,
                  fontSize: 22,
                  fontWeight: 700,
                  color: isActive ? colors.bg : colors.text,
                  whiteSpace: "nowrap",
                }}
              >
                {node}
              </div>
              {i < PIPELINE_NODES.length - 1 && (
                <div
                  style={{
                    opacity: nodeOpacity,
                    fontFamily: fonts.code,
                    fontSize: 24,
                    color: colors.textMuted,
                  }}
                >
                  {"\u2192"}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Steve vs Elon debate */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 120,
          flex: 1,
          alignItems: "center",
        }}
      >
        {/* Steve side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            opacity: interpolate(frame, [60, 80], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              overflow: "hidden",
              border: `4px solid ${colors.blue}`,
            }}
          >
            <Img
              src={staticFile("personas/steve-jobs.webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          {/* Quote bubble */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `2px solid ${colors.blue}`,
              borderRadius: 16,
              padding: "20px 28px",
              maxWidth: 380,
              fontFamily: fonts.body,
              fontSize: 28,
              color: colors.text,
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            {'"Is this insanely great?"'}
          </div>
        </div>

        {/* Elon side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              overflow: "hidden",
              border: `4px solid ${colors.green}`,
            }}
          >
            <Img
              src={staticFile("personas/elon-musk.webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: colors.surface,
              border: `2px solid ${colors.green}`,
              borderRadius: 16,
              padding: "20px 28px",
              maxWidth: 380,
              fontFamily: fonts.body,
              fontSize: 28,
              color: colors.text,
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            {'"Does physics allow this?"'}
          </div>
        </div>
      </div>

      {/* Phil Jackson + Rick Rubin — side by side */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 80,
          marginTop: 20,
        }}
      >
        {/* Phil */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: interpolate(frame, [100, 120], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: `3px solid ${colors.accent}` }}>
            <Img src={staticFile("personas/phil-jackson.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 22, color: colors.accent, fontWeight: 600 }}>
            Phil Jackson<br /><span style={{ fontSize: 16, color: colors.textMuted }}>orchestrates</span>
          </div>
        </div>

        {/* Rick */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: interpolate(frame, [120, 140], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: `3px solid ${colors.purple}` }}>
            <Img src={staticFile("personas/rick-rubin.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 22, color: colors.purple, fontWeight: 600 }}>
            Rick Rubin<br /><span style={{ fontSize: 16, color: colors.textMuted }}>strips to essence</span>
          </div>
        </div>
      </div>
    </div>
  );
};
