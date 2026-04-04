import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 4 (0:28 - 0:38): Terminal session — PRD intake, board convenes,
 * live progress feed, browser window scales up.
 */

const TERMINAL_LINES = [
  { text: "$ great-minds run --prd acme-redesign.md", color: colors.green, delay: 0 },
  { text: "", color: colors.textMuted, delay: 20 },
  { text: "Board convened. Strategy locked. Build phase initiated.", color: colors.accent, delay: 30 },
  { text: "", color: colors.textMuted, delay: 40 },
  { text: "[Jobs]       brand-strategy     \u2713 complete", color: colors.blue, delay: 55 },
  { text: "[Musk]       market-analysis    \u2713 complete", color: colors.blue, delay: 68 },
  { text: "[Hamilton]   code-scaffold      \u2713 complete", color: colors.green, delay: 80 },
  { text: "[Ive]        design-system      \u2713 complete", color: colors.green, delay: 92 },
  { text: "[Angelou]    copy-draft         \u2713 complete", color: colors.blue, delay: 104 },
  { text: "[Huang]      qa-sweep           \u2713 complete", color: colors.green, delay: 116 },
  { text: "[Aurelius]   risk-assessment    \u2713 complete", color: colors.amber, delay: 128 },
  { text: "", color: colors.textMuted, delay: 138 },
  { text: "All deliverables landed in /deliverables/final/", color: colors.accent, delay: 145 },
];

export const LiveBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser window scales up after frame 180
  const browserScale = interpolate(frame, [180, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const browserOpacity = interpolate(frame, [180, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        padding: 56,
        gap: 48,
        position: "relative",
      }}
    >
      {/* Left: Terminal session */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 24,
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 32,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 18,
          }}
        >
          Build Session
        </div>

        <div
          style={{
            backgroundColor: "#111111",
            borderRadius: 12,
            padding: "28px 32px",
            border: `1px solid ${colors.surfaceLight}`,
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Terminal dots */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
          </div>

          {TERMINAL_LINES.map((line, i) => {
            const lineOpacity = interpolate(
              frame - line.delay,
              [0, 6],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            if (frame < line.delay) return null;

            return (
              <div
                key={i}
                style={{
                  fontFamily: fonts.code,
                  fontSize: 20,
                  color: line.color,
                  opacity: lineOpacity,
                  marginBottom: line.text === "" ? 8 : 4,
                  lineHeight: 1.6,
                }}
              >
                {line.text || "\u00A0"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Browser preview (scales up) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          opacity: browserOpacity,
          transform: `scale(${0.6 + browserScale * 0.4})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 24,
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 32,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 18,
          }}
        >
          Live Preview
        </div>

        {/* Browser chrome */}
        <div
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 12,
            border: `1px solid ${colors.surfaceLight}`,
            overflow: "hidden",
          }}
        >
          {/* URL bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 22px",
              borderBottom: `1px solid ${colors.surfaceLight}`,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#febc2e" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#28c840" }} />
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: colors.surfaceLight,
                borderRadius: 6,
                padding: "6px 16px",
                fontFamily: fonts.code,
                fontSize: 18,
                color: colors.textMuted,
              }}
            >
              https://acme-redesign.preview.dev
            </div>
          </div>

          {/* Finished site preview */}
          <div style={{ padding: 34 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.accent,
                }}
              >
                Acme Co.
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {["Home", "About", "Services", "Contact"].map((nav) => (
                  <span
                    key={nav}
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 18,
                      color: colors.textMuted,
                    }}
                  >
                    {nav}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: 168,
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.blue})`,
                borderRadius: 12,
                marginBottom: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                Build Something Great
              </span>
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: 18,
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  padding: "8px 24px",
                  borderRadius: 4,
                }}
              >
                Get Started
              </span>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {["Services", "Portfolio", "Contact"].map((label) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    height: 112,
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    border: `1px solid ${colors.surfaceLight}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fonts.body,
                    fontSize: 20,
                    color: colors.text,
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
