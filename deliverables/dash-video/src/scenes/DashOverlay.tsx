import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

const SEARCH_TEXT = "plugin";

const RESULTS = [
  { label: "Plugins", type: "Setting" },
  { label: "Add New Plugin", type: "Setting" },
  { label: "Updates", type: "Setting" },
];

/**
 * Scene 2 (0:05 - 0:12): Dash overlay drops in, search types "plugin",
 * results appear instantly in a single frame.
 */
export const DashOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Overlay fades in over 200ms (~6 frames at 30fps)
  const overlayOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text types at 60ms per character, starts at frame 20
  const typingStart = 20;
  const charsPerFrame = 1 / (0.06 * fps); // ~0.56 chars/frame
  const charsVisible = Math.min(
    Math.max(0, Math.floor((frame - typingStart) * charsPerFrame)),
    SEARCH_TEXT.length
  );
  const displayedText = SEARCH_TEXT.slice(0, charsVisible);

  // Results appear instantly once all chars are typed
  const allTyped = charsVisible >= SEARCH_TEXT.length;

  // Cursor blink at ~530ms interval
  const cursorBlink = Math.floor(frame / (0.53 * fps)) % 2 === 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.overlay,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 220,
        opacity: overlayOpacity,
      }}
    >
      {/* Dash Search Container */}
      <div
        style={{
          width: 720,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Keyboard shortcut hint */}
        <div
          style={{
            fontFamily: fonts.code,
            fontSize: 20,
            color: colors.textMuted,
            marginBottom: 18,
            textAlign: "center",
          }}
        >
          Cmd+K
        </div>

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
          {/* Search icon */}
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
              flex: 1,
            }}
          >
            {displayedText}
            <span
              style={{
                opacity: cursorBlink ? 1 : 0,
                color: colors.accent,
              }}
            >
              |
            </span>
          </span>
        </div>

        {/* Results list — appears instantly (no stagger) */}
        {allTyped && (
          <div
            style={{
              marginTop: 8,
              backgroundColor: colors.surface,
              borderRadius: 12,
              border: `1px solid ${colors.surfaceLight}`,
              overflow: "hidden",
            }}
          >
            {RESULTS.map((result, i) => (
              <div
                key={result.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 32px",
                  backgroundColor:
                    i === 0 ? colors.accentHover : "transparent",
                  borderBottom:
                    i < RESULTS.length - 1
                      ? `1px solid ${colors.surfaceLight}`
                      : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 26,
                    fontWeight: i === 0 ? 600 : 400,
                    color: colors.text,
                  }}
                >
                  {result.label}
                </span>
                <span
                  style={{
                    fontFamily: fonts.code,
                    fontSize: 18,
                    color: colors.textMuted,
                    backgroundColor: colors.surfaceLight,
                    padding: "4px 12px",
                    borderRadius: 4,
                  }}
                >
                  {result.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
