import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { FadeIn } from '../components/FadeIn';

export const Scene2Why: React.FC = () => {
  const frame = useCurrentFrame();

  // PHP file icon lands at center at end
  const collapseStart = FPS * 11;
  const collapseProgress = interpolate(
    frame,
    [collapseStart, collapseStart + FPS * 1.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const sideOpacity = interpolate(collapseProgress, [0, 1], [1, 0]);
  const iconScale = interpolate(collapseProgress, [0, 0.5, 0.8, 1], [0, 0, 1.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Split screen */}
      <div
        style={{
          display: 'flex',
          gap: 76,
          opacity: sideOpacity,
          width: 1600,
        }}
      >
        {/* LEFT - functions.php (bad) */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <FadeIn startFrame={10} direction="left" distance={30}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px',
                border: '2px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <span style={{ fontSize: 60, color: COLORS.red }}>✕</span>
            </div>
          </FadeIn>
          <FadeIn startFrame={10} direction="left">
            <h2 style={{ fontFamily: FONTS.body, fontSize: 32, color: COLORS.text, fontWeight: 700, marginBottom: 8 }}>
              functions.php
            </h2>
          </FadeIn>
          <FadeIn startFrame={FPS * 2} direction="left">
            <p style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.comment, lineHeight: 1.6, marginTop: 24 }}>
              Married to your theme
            </p>
          </FadeIn>
          <FadeIn startFrame={FPS * 3.2} direction="left">
            <p style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.comment, lineHeight: 1.6, marginTop: 12 }}>
              Breaks on update
            </p>
          </FadeIn>
        </div>

        {/* RIGHT - Plugin (good) */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <FadeIn startFrame={10} direction="right" distance={30}>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px',
                border: '2px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <span style={{ fontSize: 72, color: COLORS.green }}>✓</span>
            </div>
          </FadeIn>
          <FadeIn startFrame={10} direction="right">
            <h2 style={{ fontFamily: FONTS.body, fontSize: 32, color: COLORS.text, fontWeight: 700, marginBottom: 8 }}>
              Plugin
            </h2>
          </FadeIn>
          <FadeIn startFrame={FPS * 2} direction="right">
            <p style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.text, lineHeight: 1.6, marginTop: 24 }}>
              Independent
            </p>
          </FadeIn>
          <FadeIn startFrame={FPS * 3.2} direction="right">
            <p style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.text, lineHeight: 1.6, marginTop: 12 }}>
              Portable everywhere
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Center PHP file icon */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${iconScale})`,
          opacity: iconScale > 0 ? 1 : 0,
        }}
      >
        <div
          style={{
            width: 150,
            height: 180,
            background: COLORS.editorBg,
            borderRadius: 12,
            border: `2px solid ${COLORS.accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 30px rgba(245, 158, 11, 0.2)`,
          }}
        >
          <span style={{ fontFamily: FONTS.code, fontSize: 36, color: COLORS.accent, fontWeight: 700 }}>
            .php
          </span>
        </div>
        <p style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.text, marginTop: 16, fontWeight: 600 }}>
          One file. That's it.
        </p>
      </div>
    </div>
  );
};
