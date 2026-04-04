import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../styles";

interface ProgressBarProps {
  label: string;
  agent?: string;
  startFrame: number;
  endFrame: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  agent,
  startFrame,
  endFrame,
  color = colors.accent,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [startFrame, endFrame], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isComplete = progress >= 100;

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 22,
            color: colors.text,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: fonts.code,
            fontSize: 18,
            color: colors.textMuted,
          }}
        >
          {agent && `${agent} · `}
          {Math.round(progress)}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 12,
          backgroundColor: colors.surfaceLight,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: isComplete ? colors.green : color,
            borderRadius: 6,
            transition: "background-color 0.3s",
          }}
        />
      </div>
    </div>
  );
};
