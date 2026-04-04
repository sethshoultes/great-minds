import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 5 (0:38 - 0:45): Black. Install command centered. Tagline fades in.
 * Hold. Cut to black.
 */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Command fades in over 400ms (~12 frames at 30fps)
  const cmdOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline fades in 600ms later (~18 frames after command starts)
  const taglineOpacity = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo mark
  const logoOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cut to black in last 30 frames (1 second)
  const totalFrames = 7 * fps; // 210 frames for this scene
  const fadeOut = interpolate(frame, [totalFrames - 30, totalFrames], [1, 0], {
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 42,
        opacity: fadeOut,
      }}
    >
      {/* Logo mark */}
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
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.blue})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.body,
            fontSize: 56,
            fontWeight: 900,
            color: colors.bg,
          }}
        >
          GM
        </div>
      </div>

      {/* Install command */}
      <div
        style={{
          opacity: cmdOpacity,
          backgroundColor: "#111111",
          borderRadius: 12,
          padding: "28px 52px",
          border: `1px solid ${colors.surfaceLight}`,
        }}
      >
        <span
          style={{
            fontFamily: fonts.code,
            fontSize: 36,
            color: colors.green,
            letterSpacing: 0.5,
          }}
        >
          npx plugins add sethshoultes/great-minds-plugin
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          fontFamily: fonts.body,
          fontSize: 34,
          color: colors.textMuted,
          fontWeight: 400,
        }}
      >
        One install. A full AI agency.
      </div>
    </div>
  );
};
