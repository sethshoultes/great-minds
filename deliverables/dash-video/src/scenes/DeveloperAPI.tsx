import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

const CODE_LINES = [
  "add_filter( 'dash_commands', function( $cmds ) {",
  "  $cmds[] = [",
  "    'label'  => 'Deploy Staging',",
  "    'icon'   => 'rocket',",
  "    'action' => 'deploy_staging',",
  "  ];",
  "  return $cmds;",
  "} );",
];

/**
 * Scene 4 (0:22 - 0:33): Split screen — code editor left, Dash overlay right.
 * Code appears line by line with subtle pulse. Custom command appears on right.
 */
export const DeveloperAPI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Code lines appear one at a time, ~20 frames apart
  const framesPerLine = 20;

  // Right side: custom command appears after all code lines
  const allCodeDone = frame >= CODE_LINES.length * framesPerLine + 30;

  // Search typing on right side
  const searchText = "deploy";
  const typingStart = CODE_LINES.length * framesPerLine + 40;
  const charsPerFrame = 1 / (0.06 * fps);
  const charsVisible = Math.min(
    Math.max(0, Math.floor((frame - typingStart) * charsPerFrame)),
    searchText.length
  );
  const displayedSearch = searchText.slice(0, charsVisible);
  const allSearchTyped = charsVisible >= searchText.length;

  // Enter key flash at the end
  const enterFrame = typingStart + Math.ceil(searchText.length / charsPerFrame) + 20;
  const showEnter = frame >= enterFrame;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
      }}
    >
      {/* Left: Code Editor */}
      <div
        style={{
          flex: 1,
          padding: "56px 48px",
          borderRight: `1px solid ${colors.surfaceLight}`,
          display: "flex",
          flexDirection: "column",
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
            marginBottom: 42,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 22,
          }}
        >
          functions.php
        </div>

        {/* Code block */}
        <div
          style={{
            backgroundColor: "#111111",
            borderRadius: 12,
            padding: "40px 36px",
            flex: 1,
            border: `1px solid ${colors.surfaceLight}`,
            overflow: "hidden",
          }}
        >
          {/* Terminal dots */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
          </div>

          {CODE_LINES.map((line, i) => {
            const lineFrame = i * framesPerLine;
            const lineOpacity = interpolate(
              frame - lineFrame,
              [0, 8],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Subtle pulse: line glows accent on appearance
            const pulseOpacity = interpolate(
              frame - lineFrame,
              [0, 5, 15],
              [0, 0.3, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div key={i} style={{ position: "relative", marginBottom: 4 }}>
                {/* Pulse glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: "-2px -8px",
                    backgroundColor: colors.accent,
                    opacity: pulseOpacity,
                    borderRadius: 4,
                  }}
                />
                <div
                  style={{
                    fontFamily: fonts.code,
                    fontSize: 22,
                    color: line.includes("'dash_commands'")
                      ? colors.accent
                      : line.includes("'Deploy Staging'") ||
                        line.includes("'rocket'") ||
                        line.includes("'deploy_staging'")
                      ? colors.green
                      : line.includes("=>")
                      ? "#c084fc"
                      : colors.text,
                    opacity: lineOpacity,
                    position: "relative",
                    lineHeight: 1.8,
                  }}
                >
                  <span style={{ color: colors.textMuted, marginRight: 16, userSelect: "none" }}>
                    {String(i + 1).padStart(2, " ")}
                  </span>
                  {line}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Dash Overlay with custom command */}
      <div
        style={{
          flex: 1,
          padding: "56px 48px",
          display: "flex",
          flexDirection: "column",
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
            marginBottom: 42,
            borderBottom: `1px solid ${colors.surfaceLight}`,
            paddingBottom: 22,
          }}
        >
          Dash Overlay
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 80,
          }}
        >
          <div style={{ width: "100%", maxWidth: 600 }}>
            {/* Search field */}
            <div
              style={{
                backgroundColor: colors.surface,
                border: `2px solid ${colors.accent}`,
                borderRadius: 12,
                padding: "24px 32px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: 28,
                  color: colors.textMuted,
                  marginRight: 16,
                }}
              >
                /
              </span>
              <span
                style={{
                  fontFamily: fonts.code,
                  fontSize: 32,
                  color: colors.text,
                }}
              >
                {displayedSearch}
                <span
                  style={{
                    opacity:
                      Math.floor(frame / (0.53 * fps)) % 2 === 0 ? 1 : 0,
                    color: colors.accent,
                  }}
                >
                  |
                </span>
              </span>
            </div>

            {/* Custom command result */}
            {allSearchTyped && (
              <div
                style={{
                  marginTop: 8,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  border: `1px solid ${colors.surfaceLight}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 32px",
                    backgroundColor: showEnter
                      ? colors.accent
                      : colors.accentHover,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 28 }}>{"\u{1F680}"}</span>
                    <span
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 26,
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      Deploy Staging
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: fonts.code,
                      fontSize: 18,
                      color: showEnter ? colors.text : colors.textMuted,
                      backgroundColor: showEnter
                        ? "rgba(255,255,255,0.2)"
                        : colors.surfaceLight,
                      padding: "4px 12px",
                      borderRadius: 4,
                    }}
                  >
                    Custom
                  </span>
                </div>
              </div>
            )}

            {/* Enter keystroke indicator */}
            {showEnter && (
              <div
                style={{
                  marginTop: 24,
                  textAlign: "center",
                  fontFamily: fonts.code,
                  fontSize: 20,
                  color: colors.green,
                }}
              >
                {"\u21B5"} Enter
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
