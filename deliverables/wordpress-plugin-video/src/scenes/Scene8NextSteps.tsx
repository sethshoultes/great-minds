import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { FadeIn } from '../components/FadeIn';

const PATHS = [
  {
    title: 'Plugin Handbook',
    subtitle: 'developer.wordpress.org',
    angle: -40,
    delay: 0,
    glow: false,
  },
  {
    title: 'WordPress.org',
    subtitle: 'Free distribution to millions',
    angle: 0,
    delay: FPS * 2,
    glow: false,
  },
  {
    title: 'Settings API',
    subtitle: 'My first product',
    angle: 40,
    delay: FPS * 4,
    glow: true,
  },
];

export const Scene8NextSteps: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <FadeIn startFrame={0} direction="down">
        <h2 style={{
          fontFamily: FONTS.body,
          fontSize: 44,
          color: COLORS.text,
          fontWeight: 700,
          marginBottom: 80,
          textAlign: 'center',
        }}>
          Where You Go From Here
        </h2>
      </FadeIn>

      {/* Central node */}
      <div style={{ position: 'relative', width: 800, height: 400 }}>
        {/* Center icon */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: COLORS.editorBg,
          border: `2px solid ${COLORS.accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
          <span style={{ fontFamily: FONTS.code, fontSize: 20, color: COLORS.accent, fontWeight: 700 }}>WP</span>
        </div>

        {/* Three paths */}
        {PATHS.map((path, i) => {
          const pathStart = FPS * 2 + path.delay;
          const lineProgress = interpolate(
            frame,
            [pathStart, pathStart + FPS * 1],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          const iconOpacity = interpolate(
            frame,
            [pathStart + FPS * 1, pathStart + FPS * 1.2],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          const labelOpacity = interpolate(
            frame,
            [pathStart + FPS * 1, pathStart + FPS * 1.3],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          // Position cards to left, center-top, right
          const positions = [
            { x: -280, y: -100 },
            { x: 0, y: -160 },
            { x: 280, y: -100 },
          ];
          const pos = positions[i];

          return (
            <div key={i}>
              {/* Line from center to card */}
              <svg
                style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                width="800"
                height="400"
              >
                <line
                  x1={400}
                  y1={200}
                  x2={400 + pos.x * lineProgress}
                  y2={200 + pos.y * lineProgress}
                  stroke={path.glow ? COLORS.accent : '#444'}
                  strokeWidth={2}
                  opacity={path.glow ? 0.6 : 0.4}
                />
              </svg>

              {/* Card */}
              <div style={{
                position: 'absolute',
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: 'translate(-50%, -100%)',
                opacity: labelOpacity,
                zIndex: 3,
              }}>
                <div style={{
                  background: COLORS.editorBg,
                  borderRadius: 12,
                  padding: '20px 28px',
                  border: path.glow
                    ? `2px solid ${COLORS.accent}`
                    : '2px solid #333',
                  boxShadow: path.glow
                    ? `0 0 20px rgba(245, 158, 11, 0.2)`
                    : 'none',
                  textAlign: 'center',
                  minWidth: 200,
                }}>
                  <h3 style={{
                    fontFamily: FONTS.body,
                    fontSize: 22,
                    color: path.glow ? COLORS.accent : COLORS.text,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}>
                    {path.title}
                  </h3>
                  <p style={{
                    fontFamily: FONTS.body,
                    fontSize: 15,
                    color: COLORS.comment,
                  }}>
                    {path.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
