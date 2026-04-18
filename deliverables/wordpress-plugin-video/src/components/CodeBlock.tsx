import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';

interface CodeLine {
  text: string;
  type: 'keyword' | 'string' | 'comment' | 'normal' | 'function' | 'highlight';
}

interface CodeBlockProps {
  lines: CodeLine[];
  startFrame: number;
  framesPerLine?: number;
  fontSize?: number;
  showLineNumbers?: boolean;
  glowOnComplete?: boolean;
  glowColor?: string;
}

const colorForType = (type: CodeLine['type']): string => {
  switch (type) {
    case 'keyword': return COLORS.keyword;
    case 'string': return COLORS.string;
    case 'comment': return COLORS.comment;
    case 'function': return COLORS.text;
    case 'highlight': return COLORS.accent;
    default: return COLORS.text;
  }
};

const fontWeightForType = (type: CodeLine['type']): number => {
  switch (type) {
    case 'keyword': return 700;
    case 'function': return 700;
    case 'highlight': return 700;
    default: return 400;
  }
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  lines,
  startFrame,
  framesPerLine = 45,
  fontSize = 20,
  showLineNumbers = false,
  glowOnComplete = false,
  glowColor = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  if (elapsed < 0) return null;

  const totalLines = lines.length;
  const allDoneFrame = totalLines * framesPerLine;
  const glowOpacity = glowOnComplete
    ? interpolate(
        elapsed - allDoneFrame,
        [0, 12, 48, 60],
        [0, 0.3, 0.3, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    : 0;

  return (
    <div
      style={{
        position: 'relative',
        background: COLORS.editorBg,
        borderRadius: 12,
        padding: '48px 32px',
        fontFamily: FONTS.code,
        fontSize,
        lineHeight: 1.6,
        border: glowOpacity > 0
          ? `2px solid rgba(245, 158, 11, ${glowOpacity})`
          : '2px solid transparent',
        boxShadow: glowOpacity > 0
          ? `0 0 ${8}px rgba(245, 158, 11, ${glowOpacity * 0.5})`
          : 'none',
        transition: 'border 0.3s, box-shadow 0.3s',
      }}
    >
      {lines.map((line, i) => {
        const lineStart = i * framesPerLine;
        const lineElapsed = elapsed - lineStart;
        if (lineElapsed < 0) return null;

        const charsToShow = Math.min(
          Math.floor((lineElapsed / framesPerLine) * line.text.length),
          line.text.length,
        );

        const opacity = interpolate(lineElapsed, [0, 10], [0, 1], {
          extrapolateRight: 'clamp',
        });

        return (
          <div key={i} style={{ opacity, display: 'flex' }}>
            {showLineNumbers && (
              <span
                style={{
                  color: COLORS.comment,
                  minWidth: 40,
                  textAlign: 'right',
                  marginRight: 16,
                  userSelect: 'none',
                }}
              >
                {i + 1}
              </span>
            )}
            <span
              style={{
                color: colorForType(line.type),
                fontWeight: fontWeightForType(line.type),
                whiteSpace: 'pre',
              }}
            >
              {line.text.slice(0, charsToShow)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
