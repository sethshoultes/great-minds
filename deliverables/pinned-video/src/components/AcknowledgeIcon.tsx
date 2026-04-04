import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface AcknowledgeIconProps {
  fillFrame: number;
  size?: number;
}

/**
 * Checkmark icon that fills with an ink-spread effect at the given frame.
 */
export const AcknowledgeIcon: React.FC<AcknowledgeIconProps> = ({
  fillFrame,
  size = 32,
}) => {
  const frame = useCurrentFrame();

  const fillProgress = interpolate(frame - fillFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isFilled = frame >= fillFrame;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        border: `2px solid ${isFilled ? "#22c55e" : "#999"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Ink spread background */}
      <div
        style={{
          position: "absolute",
          width: size * 2,
          height: size * 2,
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          transform: `scale(${fillProgress})`,
          opacity: fillProgress * 0.3,
        }}
      />
      {/* Checkmark */}
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke={isFilled ? "#fff" : "#999"}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M5 13l4 4L19 7"
          strokeDasharray={24}
          strokeDashoffset={isFilled ? 0 : 24}
        />
      </svg>
    </div>
  );
};
