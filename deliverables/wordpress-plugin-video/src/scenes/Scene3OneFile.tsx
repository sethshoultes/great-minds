import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { CodeBlock } from '../components/CodeBlock';
import { FadeIn } from '../components/FadeIn';

const HEADER_LINES = [
  { text: '<?php', type: 'keyword' as const },
  { text: '/**', type: 'comment' as const },
  { text: ' * Plugin Name: My First Plugin', type: 'comment' as const },
  { text: ' * Description: A simple plugin that proves I can do this.', type: 'comment' as const },
  { text: ' * Version: 1.0', type: 'comment' as const },
  { text: ' * Author: Your Name', type: 'comment' as const },
  { text: ' */', type: 'comment' as const },
];

export const Scene3OneFile: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1: Code typing (0-18s)
  // Phase 2: WP Admin preview (18-28s)
  // Phase 3: Fear removal text (28-50s)

  const phase2Start = FPS * 18;
  const phase3Start = FPS * 28;

  // WP Admin mockup opacity
  const adminOpacity = interpolate(
    frame,
    [phase2Start, phase2Start + FPS * 0.4],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Fear removal opacity
  const fearOpacity = interpolate(
    frame,
    [phase3Start, phase3Start + FPS * 0.6],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Glow around the safe zone
  const safeGlow = interpolate(
    frame,
    [phase3Start + FPS * 2, phase3Start + FPS * 3, phase3Start + FPS * 5, phase3Start + FPS * 6],
    [0, 0.15, 0.15, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

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
      {/* Phase 1 & 2: Code editor */}
      {frame < phase3Start && (
        <div style={{ width: 1200 }}>
          {/* Editor title bar */}
          <div
            style={{
              background: '#2a2a2a',
              borderRadius: '12px 12px 0 0',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ color: COLORS.comment, fontFamily: FONTS.code, fontSize: 14, marginLeft: 12 }}>
              my-first-plugin.php
            </span>
          </div>
          <CodeBlock
            lines={HEADER_LINES}
            startFrame={FPS * 2}
            framesPerLine={60}
            fontSize={24}
            showLineNumbers={true}
            glowOnComplete={true}
            glowColor={COLORS.accent}
          />
        </div>
      )}

      {/* Phase 2: WP Admin preview */}
      {frame >= phase2Start && frame < phase3Start && (
        <FadeIn startFrame={phase2Start} direction="up" distance={20}>
          <div
            style={{
              marginTop: 40,
              background: '#f0f0f1',
              borderRadius: 8,
              padding: 24,
              width: 1200,
            }}
          >
            <div style={{ fontFamily: FONTS.body, fontSize: 14, color: '#1d2327', fontWeight: 600, marginBottom: 12 }}>
              Plugins
            </div>
            <div
              style={{
                background: 'white',
                border: '1px solid #c3c4c7',
                borderLeft: `4px solid ${COLORS.accent}`,
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontFamily: FONTS.body, fontSize: 18, color: '#2271b1', fontWeight: 600 }}>
                  My First Plugin
                </span>
                <p style={{ fontFamily: FONTS.body, fontSize: 14, color: '#646970', marginTop: 4 }}>
                  A simple plugin that proves I can do this.
                </p>
              </div>
              <span style={{ fontFamily: FONTS.body, fontSize: 13, color: '#2271b1', cursor: 'pointer' }}>
                Activate
              </span>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Phase 3: Fear removal */}
      {frame >= phase3Start && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 200px',
            opacity: fearOpacity,
            textAlign: 'center',
          }}
        >
          {/* Plugin icon with glow */}
          <div
            style={{
              width: 120,
              height: 150,
              background: COLORS.editorBg,
              borderRadius: 12,
              border: `2px solid ${COLORS.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 48,
              boxShadow: `0 0 ${40}px rgba(245, 158, 11, ${safeGlow})`,
            }}
          >
            <span style={{ fontFamily: FONTS.code, fontSize: 28, color: COLORS.accent, fontWeight: 700 }}>
              .php
            </span>
          </div>

          <FadeIn startFrame={phase3Start + FPS * 1} durationFrames={20}>
            <h2 style={{ fontFamily: FONTS.body, fontSize: 48, color: COLORS.text, fontWeight: 700, marginBottom: 32, lineHeight: 1.3 }}>
              You cannot break WordPress<br />by creating a plugin.
            </h2>
          </FadeIn>

          <FadeIn startFrame={phase3Start + FPS * 3} durationFrames={20}>
            <p style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.comment, lineHeight: 1.8, maxWidth: 900 }}>
              Your code is isolated. It has no access to the core.<br />
              If it crashes, WordPress keeps running.<br />
              If it's wrong, you deactivate it and move on.
            </p>
          </FadeIn>

          <FadeIn startFrame={phase3Start + FPS * 7} durationFrames={20}>
            <p style={{ fontFamily: FONTS.body, fontSize: 32, color: COLORS.accent, fontWeight: 600, marginTop: 48 }}>
              Stop being careful. Try something.
            </p>
          </FadeIn>
        </div>
      )}
    </div>
  );
};
