import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../styles";

export type NoteColor = "yellow" | "blue" | "pink" | "green" | "peach";

const COLOR_MAP: Record<NoteColor, string> = {
  yellow: colors.noteYellow,
  blue: colors.noteBlue,
  pink: colors.notePink,
  green: colors.noteGreen,
  peach: colors.notePeach,
};

// Slightly darker for aged notes
const AGED_COLOR_MAP: Record<NoteColor, string> = {
  yellow: "#f5f0b0",
  blue: "#a8cfe8",
  pink: "#e5a8bd",
  green: "#b5d3b6",
  peach: "#ebd0a0",
};

interface StickyNoteProps {
  color: NoteColor;
  text: string;
  rotation?: number;
  aged?: boolean;
  width?: number;
  height?: number;
  fontSize?: number;
  enterFrame?: number;
  children?: React.ReactNode;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  color,
  text,
  rotation = -2,
  aged = false,
  width = 240,
  height = 200,
  fontSize = 22,
  enterFrame = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bg = aged ? AGED_COLOR_MAP[color] : COLOR_MAP[color];

  // Paper-unfold entrance animation
  const scaleY = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
  });

  const opacity = interpolate(frame - enterFrame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < enterFrame) return null;

  return (
    <div
      style={{
        width,
        minHeight: height,
        backgroundColor: bg,
        transform: `rotate(${rotation}deg) scaleY(${scaleY})`,
        transformOrigin: "top center",
        opacity,
        padding: "20px 18px",
        borderRadius: 4,
        boxShadow: "2px 4px 12px rgba(0,0,0,0.25)",
        fontFamily: fonts.handwritten,
        fontSize,
        color: "#333",
        lineHeight: 1.4,
        position: "relative",
      }}
    >
      {/* Tape strip at top */}
      <div
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 16,
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: 2,
        }}
      />
      {text}
      {children}
    </div>
  );
};
