import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 1 (0:00 - 0:03): Terminal typing animation
 * Black screen, blinking cursor, types: $ shipyard deploy --from prd.md
 */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const command = "$ shipyard deploy --from prd.md";
  const charsPerFrame = 1 / (0.04 * fps); // 40ms per character
  const typingStartFrame = 15; // half-second pause before typing

  const charsVisible = Math.min(
    Math.max(0, Math.floor((frame - typingStartFrame) * charsPerFrame)),
    command.length
  );

  const displayedText = command.slice(0, charsVisible);

  // Cursor blink at ~530ms interval
  const cursorBlinkCycle = Math.floor(frame / (0.53 * fps));
  const showCursor = cursorBlinkCycle % 2 === 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#111111",
          borderRadius: 12,
          padding: "60px 80px",
          border: `1px solid ${colors.surfaceLight}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          minWidth: 900,
        }}
      >
        {/* Terminal dots */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ff5f57",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#febc2e",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#28c840",
            }}
          />
        </div>

        {/* Command text */}
        <div
          style={{
            fontFamily: fonts.code,
            fontSize: 42,
            color: colors.green,
            letterSpacing: 0.5,
          }}
        >
          {displayedText}
          <span
            style={{
              opacity: showCursor ? 1 : 0,
              color: colors.accent,
            }}
          >
            |
          </span>
        </div>
      </div>
    </div>
  );
};
