import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

/**
 * Scene 1: The Question
 * Black screen, then centered monospaced text fades in with a horizontal rule drawing.
 */
export const Scene1Question: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 2-second silence, then text fades in
  const silenceFrames = 2 * fps;
  const textOpacity = interpolate(
    frame - silenceFrames,
    [0, 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Horizontal rule draws left-to-right after text appears
  const ruleStart = silenceFrames + 30;
  const ruleWidth = interpolate(
    frame - ruleStart,
    [0, 40],
    [0, 100],
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
        justifyContent: "center",
        alignItems: "center",
        padding: "0 160px",
      }}
    >
      <div
        style={{
          opacity: textOpacity,
          fontFamily: fonts.code,
          fontSize: 52,
          color: colors.text,
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 1400,
        }}
      >
        What happens when Steve Jobs and Elon Musk
        <br />
        disagree about your product?
      </div>

      {/* Horizontal rule */}
      <div
        style={{
          marginTop: 48,
          height: 2,
          backgroundColor: colors.accent,
          width: `${ruleWidth}%`,
          maxWidth: 800,
          opacity: textOpacity,
        }}
      />
    </div>
  );
};
