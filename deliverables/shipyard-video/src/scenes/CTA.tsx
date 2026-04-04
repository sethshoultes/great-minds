import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 7 (1:02 - 1:12): Logo, URL, terminal prompt CTA
 */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo fade in over ~15 frames (500ms at 30fps)
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // URL types out starting at frame 30
  const url = "www.shipyard.company";
  const urlCharsPerFrame = 1 / (0.04 * fps);
  const urlCharsVisible = Math.min(
    Math.max(0, Math.floor((frame - 30) * urlCharsPerFrame)),
    url.length
  );
  const displayedUrl = url.slice(0, urlCharsVisible);

  // Terminal prompt appears at frame 120
  const promptText = "$ upload your PRD -->";
  const promptStart = 120;
  const promptCharsVisible = Math.min(
    Math.max(0, Math.floor((frame - promptStart) * urlCharsPerFrame)),
    promptText.length
  );
  const displayedPrompt = promptText.slice(0, promptCharsVisible);

  // Cursor blink
  const cursorBlink = Math.floor(frame / (0.53 * fps)) % 2 === 0;

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
        gap: 30,
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          opacity: logoOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Stylized logo mark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.blue})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.body,
            fontSize: 40,
            fontWeight: 900,
            color: colors.bg,
          }}
        >
          S
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 52,
            fontWeight: 800,
            color: colors.text,
            letterSpacing: -1,
          }}
        >
          Shipyard AI
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 18,
            color: colors.textMuted,
          }}
        >
          Upload your PRD. Meet your team. Ship by morning.
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          fontFamily: fonts.code,
          fontSize: 24,
          color: colors.accent,
          letterSpacing: 1,
        }}
      >
        {displayedUrl}
      </div>

      {/* Terminal prompt */}
      {frame >= promptStart && (
        <div
          style={{
            backgroundColor: "#111111",
            borderRadius: 8,
            padding: "16px 30px",
            border: `1px solid ${colors.surfaceLight}`,
            marginTop: 20,
          }}
        >
          <span
            style={{
              fontFamily: fonts.code,
              fontSize: 22,
              color: colors.green,
            }}
          >
            {displayedPrompt}
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
      )}
    </div>
  );
};
