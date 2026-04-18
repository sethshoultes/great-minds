import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { FadeIn } from '../components/FadeIn';

export const Scene7Activate: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1: Plugin list with Activate button (0-8s)
  // Phase 2: Admin notice appears (8-20s)
  // Phase 3: Shortcode test (20-32s)
  // Phase 4: Victory narration (32-40s)

  const activateClick = FPS * 5;
  const noticeAppear = FPS * 8;
  const shortcodeStart = FPS * 20;
  const outputStart = FPS * 26;
  const victoryStart = FPS * 32;

  // Activate button hover effect
  const isHovering = frame > FPS * 3 && frame < activateClick;
  // After click, show "Active" state
  const isActivated = frame >= noticeAppear;

  // Cursor position
  const cursorX = interpolate(frame, [0, FPS * 3], [400, 920], { extrapolateRight: 'clamp' });
  const cursorY = interpolate(frame, [0, FPS * 3], [300, 355], { extrapolateRight: 'clamp' });

  // Spotlight glow around cursor
  const spotlightOpacity = frame > FPS * 2 ? 0.08 : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#f0f0f1',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* WP Admin sidebar */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 200,
        background: '#1d2327',
        padding: '20px 0',
      }}>
        {['Dashboard', 'Posts', 'Pages', 'Plugins', 'Settings'].map((item, i) => (
          <div key={item} style={{
            padding: '8px 16px',
            fontFamily: FONTS.body,
            fontSize: 14,
            color: item === 'Plugins' ? '#fff' : '#c3c4c7',
            background: item === 'Plugins' ? '#2271b1' : 'transparent',
          }}>
            {item}
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div style={{ marginLeft: 200, padding: '20px 40px' }}>
        <h1 style={{ fontFamily: FONTS.body, fontSize: 24, color: '#1d2327', fontWeight: 400, marginBottom: 20 }}>
          Plugins
        </h1>

        {/* Admin notice (appears after activation) */}
        {frame >= noticeAppear && (
          <FadeIn startFrame={noticeAppear} direction="down" distance={10}>
            <div style={{
              background: '#fff',
              borderLeft: '4px solid #72aee6',
              padding: '12px 20px',
              marginBottom: 20,
              boxShadow: '0 1px 1px rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontFamily: FONTS.body, fontSize: 14, color: '#1d2327' }}>
                My First Plugin is active. <strong>You built this.</strong>
              </p>
            </div>
          </FadeIn>
        )}

        {/* Plugin table */}
        <div style={{ background: '#fff', border: '1px solid #c3c4c7' }}>
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid #c3c4c7',
            display: 'flex',
            justifyContent: 'space-between',
            borderLeft: isActivated ? '4px solid #72aee6' : '4px solid transparent',
          }}>
            <div>
              <span style={{ fontFamily: FONTS.body, fontSize: 16, color: '#2271b1', fontWeight: 600 }}>
                My First Plugin
              </span>
              <p style={{ fontFamily: FONTS.body, fontSize: 13, color: '#646970', marginTop: 2 }}>
                A simple plugin that proves I can do this.
              </p>
              <div style={{ marginTop: 6 }}>
                {isActivated ? (
                  <span style={{ fontFamily: FONTS.body, fontSize: 13, color: '#b32d2e' }}>Deactivate</span>
                ) : (
                  <span style={{
                    fontFamily: FONTS.body,
                    fontSize: 13,
                    color: '#2271b1',
                    textDecoration: isHovering ? 'underline' : 'none',
                  }}>
                    Activate
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shortcode test section */}
        {frame >= shortcodeStart && (
          <FadeIn startFrame={shortcodeStart} direction="up" distance={20}>
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontFamily: FONTS.body, fontSize: 18, color: '#1d2327', marginBottom: 12 }}>
                Page Editor — Testing the shortcode
              </h2>
              <div style={{
                background: '#fff',
                border: '1px solid #c3c4c7',
                borderRadius: 4,
                padding: 20,
                fontFamily: FONTS.code,
                fontSize: 16,
                color: '#1d2327',
              }}>
                [greeting name="Developer"]
              </div>
            </div>
          </FadeIn>
        )}

        {/* Shortcode output */}
        {frame >= outputStart && (
          <FadeIn startFrame={outputStart} direction="up" distance={10}>
            <div style={{ marginTop: 20 }}>
              <div style={{
                background: '#fff',
                border: '2px solid rgba(34, 197, 94, 0.4)',
                borderRadius: 8,
                padding: 24,
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.1)',
              }}>
                <p style={{ fontFamily: FONTS.body, fontSize: 24, color: '#1d2327' }}>
                  Hello, <strong>Developer</strong>!
                </p>
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      {/* Victory text overlay */}
      {frame >= victoryStart && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 10, 10, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <FadeIn startFrame={victoryStart} durationFrames={20}>
            <p style={{
              fontFamily: FONTS.body,
              fontSize: 36,
              color: COLORS.text,
              textAlign: 'center',
              lineHeight: 1.6,
              maxWidth: 900,
            }}>
              That message came from <span style={{ color: COLORS.accent, fontWeight: 700 }}>your code</span>.
              <br />
              Not WordPress. Not a downloaded plugin.
              <br />
              <span style={{ color: COLORS.comment }}>From thirty lines you wrote five minutes ago.</span>
            </p>
          </FadeIn>
          <FadeIn startFrame={victoryStart + FPS * 3} durationFrames={20}>
            <p style={{
              fontFamily: FONTS.body,
              fontSize: 28,
              color: COLORS.accent,
              fontWeight: 600,
              marginTop: 40,
            }}>
              Not a user. A builder.
            </p>
          </FadeIn>
        </div>
      )}

      {/* Cursor */}
      {frame < shortcodeStart && (
        <div style={{
          position: 'absolute',
          left: cursorX,
          top: cursorY,
          width: 20,
          height: 20,
          pointerEvents: 'none',
          zIndex: 100,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M0 0 L0 16 L4 12 L8 18 L10 17 L6 11 L12 11 Z" fill="white" stroke="black" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* Spotlight */}
      <div style={{
        position: 'absolute',
        left: cursorX - 60,
        top: cursorY - 60,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,255,255,${spotlightOpacity}) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
};
