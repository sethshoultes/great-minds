import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { FadeIn } from '../components/FadeIn';

const HOOKS = [
  { name: 'init', y: 120 },
  { name: 'wp_head', y: 260, important: true },
  { name: 'the_content', y: 400 },
  { name: 'admin_notices', y: 540, important: true },
  { name: 'wp_footer', y: 680 },
];

export const Scene4Hooks: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1: Timeline appears (0-15s)
  // Phase 2: Carabiner attaches (15-25s)
  // Phase 3: Split into actions vs filters (25-45s)

  const splitStart = FPS * 25;
  const splitProgress = interpolate(
    frame,
    [splitStart, splitStart + FPS * 1.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Carabiner swing animation
  const carabinerFrame = FPS * 16;
  const carabinerSwing = interpolate(
    frame,
    [carabinerFrame, carabinerFrame + 24],
    [-30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const carabinerOpacity = interpolate(
    frame,
    [carabinerFrame, carabinerFrame + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <FadeIn startFrame={0} direction="down" style={{
        position: 'absolute',
        top: 40,
        width: '100%',
        textAlign: 'center',
      }}>
        <h2 style={{ fontFamily: FONTS.body, fontSize: 48, color: COLORS.text, fontWeight: 700 }}>
          The Secret — <span style={{ color: COLORS.accent }}>Hooks</span>
        </h2>
      </FadeIn>

      {/* Phase 1 & 2: Single timeline */}
      {splitProgress === 0 && (
        <div style={{ margin: '0 auto', paddingTop: 60 }}>
          {/* Timeline label */}
          <FadeIn startFrame={FPS * 1} direction="down">
            <p style={{
              fontFamily: FONTS.code,
              fontSize: 16,
              color: COLORS.comment,
              textAlign: 'center',
              marginBottom: 20,
              letterSpacing: '0.1em',
            }}>
              WordPress Loading...
            </p>
          </FadeIn>

          {/* Timeline line */}
          <div style={{ position: 'relative', width: 400, height: 700, margin: '0 auto' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 80,
              bottom: 40,
              width: 2,
              background: '#333',
              transform: 'translateX(-50%)',
            }} />

            {/* Hook dots */}
            {HOOKS.map((hook, i) => {
              const dotStart = FPS * 2 + i * FPS * 1.2;
              const dotOpacity = interpolate(
                frame,
                [dotStart, dotStart + 15],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              );
              const dotSize = hook.important ? 16 : 12;

              return (
                <div
                  key={hook.name}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: hook.y,
                    transform: 'translate(-50%, -50%)',
                    opacity: dotOpacity,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: '50%',
                    background: COLORS.accent,
                    boxShadow: hook.important ? `0 0 8px rgba(245, 158, 11, 0.4)` : 'none',
                  }} />
                  <span style={{
                    fontFamily: FONTS.code,
                    fontSize: hook.important ? 20 : 16,
                    color: hook.important ? COLORS.text : COLORS.comment,
                    fontWeight: hook.important ? 600 : 400,
                    position: 'absolute',
                    left: 30,
                    whiteSpace: 'nowrap',
                  }}>
                    {hook.name}
                  </span>
                </div>
              );
            })}

            {/* Carabiner plugin icon */}
            <div style={{
              position: 'absolute',
              left: 'calc(50% + 160px)',
              top: HOOKS[3].y - 20,
              opacity: carabinerOpacity,
              transform: `rotate(${carabinerSwing}deg)`,
              transformOrigin: 'left center',
            }}>
              <div style={{
                background: COLORS.editorBg,
                border: `2px solid ${COLORS.accent}`,
                borderRadius: 8,
                padding: '8px 16px',
                fontFamily: FONTS.code,
                fontSize: 14,
                color: COLORS.accent,
              }}>
                🔗 your_plugin()
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Split view - Actions vs Filters */}
      {splitProgress > 0 && (
        <div style={{
          display: 'flex',
          gap: 80,
          width: '100%',
          padding: '120px 100px 60px',
          opacity: splitProgress,
        }}>
          {/* Actions side */}
          <div style={{ flex: 1 }}>
            <FadeIn startFrame={splitStart} direction="left" distance={40}>
              <div style={{
                background: COLORS.editorBg,
                borderRadius: 12,
                padding: 40,
                border: `2px solid ${COLORS.accent}`,
                height: '100%',
              }}>
                <h3 style={{ fontFamily: FONTS.body, fontSize: 36, color: COLORS.accent, fontWeight: 700, marginBottom: 24 }}>
                  Actions
                </h3>
                <p style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.text, lineHeight: 1.6, marginBottom: 32 }}>
                  "Something is happening —<br />do you want to do something too?"
                </p>
                <div style={{
                  fontFamily: FONTS.code,
                  fontSize: 18,
                  color: COLORS.text,
                  background: '#111',
                  borderRadius: 8,
                  padding: 20,
                  marginBottom: 24,
                }}>
                  <span style={{ color: COLORS.keyword, fontWeight: 700 }}>add_action</span>
                  {'( '}
                  <span style={{ color: COLORS.string }}>'admin_notices'</span>
                  {', fn )'}
                </div>
                <p style={{ fontFamily: FONTS.body, fontSize: 20, color: COLORS.comment }}>
                  → Add behavior at a specific moment
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Filters side */}
          <div style={{ flex: 1 }}>
            <FadeIn startFrame={splitStart + FPS * 0.3} direction="right" distance={40}>
              <div style={{
                background: COLORS.editorBg,
                borderRadius: 12,
                padding: 40,
                border: '2px solid rgba(245, 158, 11, 0.3)',
                boxShadow: `0 0 20px rgba(245, 158, 11, 0.08)`,
                height: '100%',
              }}>
                <h3 style={{ fontFamily: FONTS.body, fontSize: 36, color: COLORS.accent, fontWeight: 700, marginBottom: 24 }}>
                  Filters
                </h3>
                <p style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.text, lineHeight: 1.6, marginBottom: 32 }}>
                  "Here's some data —<br />do you want to change it?"
                </p>
                <div style={{
                  fontFamily: FONTS.code,
                  fontSize: 18,
                  color: COLORS.text,
                  background: '#111',
                  borderRadius: 8,
                  padding: 20,
                  marginBottom: 24,
                }}>
                  <span style={{ color: COLORS.keyword, fontWeight: 700 }}>add_filter</span>
                  {'( '}
                  <span style={{ color: COLORS.string }}>'the_content'</span>
                  {', fn )'}
                </div>
                <p style={{ fontFamily: FONTS.body, fontSize: 20, color: COLORS.comment }}>
                  → Modify data before it's used
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      )}

      {/* Bottom label */}
      <FadeIn startFrame={splitStart + FPS * 2} style={{
        position: 'absolute',
        bottom: 40,
        width: '100%',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.comment }}>
          Actions let you <span style={{ color: COLORS.text, fontWeight: 600 }}>add</span>. Filters let you <span style={{ color: COLORS.text, fontWeight: 600 }}>modify</span>. That's the entire model.
        </p>
      </FadeIn>
    </div>
  );
};
