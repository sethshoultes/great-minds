import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';

interface TypeWriterProps {
  text: string;
  startFrame: number;
  charsPerSecond?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  startFrame,
  charsPerSecond = 30,
  fontSize = 20,
  color = COLORS.text,
  fontFamily = FONTS.code,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  if (elapsed < 0) return null;

  const charsToShow = Math.min(
    Math.floor((elapsed / FPS) * charsPerSecond),
    text.length,
  );

  return (
    <span
      style={{
        fontSize,
        fontFamily,
        color,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {text.slice(0, charsToShow)}
      {charsToShow < text.length && (
        <span
          style={{
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            color: COLORS.accent,
          }}
        >
          |
        </span>
      )}
    </span>
  );
};
