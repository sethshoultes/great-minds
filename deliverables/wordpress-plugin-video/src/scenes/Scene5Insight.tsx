import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, FPS } from '../styles';
import { FadeIn } from '../components/FadeIn';

export const Scene5Insight: React.FC = () => {
  const frame = useCurrentFrame();

  // Chaos side flickers
  const chaosFlicker = Math.sin(frame * 0.8) * 0.15 + 0.85;

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
          fontSize: 40,
          color: COLORS.text,
          fontWeight: 700,
          marginBottom: 60,
          textAlign: 'center',
        }}>
          Why This Design <span style={{ color: COLORS.accent }}>Matters</span>
        </h2>
      </FadeIn>

      <div style={{ display: 'flex', gap: 80, width: 1500, alignItems: 'center' }}>
        {/* Chaos side */}
        <FadeIn startFrame={FPS * 1} direction="left" distance={40} style={{ flex: 1 }}>
          <div style={{
            background: COLORS.editorBg,
            borderRadius: 12,
            padding: 40,
            border: '2px solid rgba(239, 68, 68, 0.3)',
            opacity: chaosFlicker,
          }}>
            <h3 style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.red, fontWeight: 600, marginBottom: 24 }}>
              Without Hooks
            </h3>
            {/* Tangled arrows */}
            <svg width="280" height="200" viewBox="0 0 280 200">
              {[0, 1, 2, 3, 4].map((i) => (
                <React.Fragment key={i}>
                  <circle cx={40 + i * 55} cy={40} r={8} fill={COLORS.red} opacity={0.6} />
                  <circle cx={40 + i * 55} cy={160} r={8} fill={COLORS.red} opacity={0.6} />
                  {/* Tangled crossing lines */}
                  <line
                    x1={40 + i * 55} y1={48}
                    x2={40 + ((i + 2) % 5) * 55} y2={152}
                    stroke={COLORS.red} strokeWidth={1.5} opacity={0.4}
                  />
                  <line
                    x1={40 + i * 55} y1={48}
                    x2={40 + ((i + 3) % 5) * 55} y2={152}
                    stroke={COLORS.red} strokeWidth={1} opacity={0.25}
                  />
                </React.Fragment>
              ))}
            </svg>
            <p style={{ fontFamily: FONTS.body, fontSize: 18, color: COLORS.comment, marginTop: 16 }}>
              Plugins collide. Order matters.<br />Nothing is predictable.
            </p>
          </div>
        </FadeIn>

        {/* VS */}
        <FadeIn startFrame={FPS * 2}>
          <span style={{ fontFamily: FONTS.body, fontSize: 32, color: COLORS.comment, fontWeight: 300 }}>vs</span>
        </FadeIn>

        {/* Order side */}
        <FadeIn startFrame={FPS * 2.5} direction="right" distance={40} style={{ flex: 1 }}>
          <div style={{
            background: COLORS.editorBg,
            borderRadius: 12,
            padding: 40,
            border: `2px solid rgba(34, 197, 94, 0.3)`,
          }}>
            <h3 style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.green, fontWeight: 600, marginBottom: 24 }}>
              With Hooks
            </h3>
            {/* Orderly queue */}
            <svg width="280" height="200" viewBox="0 0 280 200">
              {/* Central hook point */}
              <circle cx={140} cy={40} r={12} fill={COLORS.accent} />
              <text x={140} y={44} textAnchor="middle" fill={COLORS.bg} fontSize={10} fontWeight={700}>●</text>
              {/* Queue lines going down orderly */}
              {[0, 1, 2, 3].map((i) => {
                const y = 80 + i * 32;
                const showFrame = FPS * 3 + i * 10;
                const opacity = interpolate(frame, [showFrame, showFrame + 15], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                return (
                  <g key={i} opacity={opacity}>
                    <line x1={140} y1={y - 16} x2={140} y2={y} stroke={COLORS.green} strokeWidth={1.5} opacity={0.4} />
                    <rect x={60} y={y} width={160} height={24} rx={4} fill="rgba(34, 197, 94, 0.15)" stroke={COLORS.green} strokeWidth={1} opacity={0.6} />
                    <text x={140} y={y + 16} textAnchor="middle" fill={COLORS.green} fontSize={11} fontFamily={FONTS.code}>
                      plugin_{i + 1}_function()
                    </text>
                  </g>
                );
              })}
            </svg>
            <p style={{ fontFamily: FONTS.body, fontSize: 18, color: COLORS.comment, marginTop: 16 }}>
              Everyone listens to the same<br />announcements. No collisions.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Bottom insight */}
      <FadeIn startFrame={FPS * 6} style={{ position: 'absolute', bottom: 60, textAlign: 'center' }}>
        <p style={{ fontFamily: FONTS.body, fontSize: 26, color: COLORS.text, lineHeight: 1.6 }}>
          Millions of plugins. Millions of sites. <span style={{ color: COLORS.accent, fontWeight: 600 }}>One architecture.</span>
        </p>
      </FadeIn>
    </div>
  );
};
