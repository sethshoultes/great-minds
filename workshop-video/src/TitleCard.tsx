import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';

/**
 * Title Card — Final stats sequence
 *
 * Shows what the Great Minds Agency built:
 * - Lines of code
 * - Tests passing
 * - Services
 * - Time to build
 *
 * Design: dark background, warm white text, terracotta accents.
 * Matches the LocalGenius design system.
 */

const FPS = 30;
const DURATION = 10 * FPS; // 10 seconds

const STATS = [
  { label: 'Lines of Code', value: '23,335', delay: 0 },
  { label: 'Tests Passing', value: '761', delay: 6 },
  { label: 'Services Built', value: '24', delay: 12 },
  { label: 'API Routes', value: '40', delay: 18 },
  { label: 'Jensen Issues Fixed', value: '9/9', delay: 24 },
  { label: 'Build Time', value: '1 session', delay: 30 },
];

const Stat: React.FC<{
  label: string;
  value: string;
  delay: number;
}> = ({ label, value, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const translateY = interpolate(appear, [0, 1], [30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        textAlign: 'center',
        padding: '0 1rem',
      }}
    >
      <div
        style={{
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
          fontSize: 72,
          fontWeight: 700,
          color: '#C4704B', // terracotta
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
          fontSize: 24,
          fontWeight: 400,
          color: '#A8A29E', // warm gray
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Stats grid fade in (after title)
  const statsOpacity = interpolate(frame, [45, 75], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // "Built with Claude Code" fade in at the end
  const creditOpacity = interpolate(frame, [DURATION - 90, DURATION - 60], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Final fade out
  const fadeOut = interpolate(frame, [DURATION - 30, DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1C1917', // warm black
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          textAlign: 'center',
          marginBottom: 60,
        }}
      >
        <div
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 56,
            fontWeight: 700,
            color: '#FAF8F5', // warm white
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          What Nine Minds Built
        </div>
        <div
          style={{
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
            fontSize: 24,
            color: '#7A8B6F', // sage
            fontWeight: 400,
          }}
        >
          LocalGenius — in one session
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          opacity: statsOpacity,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '48px 64px',
          maxWidth: 900,
        }}
      >
        {STATS.map((stat) => (
          <Stat
            key={stat.label}
            label={stat.label}
            value={stat.value}
            delay={stat.delay + 45} // offset after title
          />
        ))}
      </div>

      {/* Credit */}
      <div
        style={{
          opacity: creditOpacity,
          position: 'absolute',
          bottom: 80,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
            fontSize: 20,
            color: '#78716C',
            marginBottom: 8,
          }}
        >
          Built with
        </div>
        <div
          style={{
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 600,
            color: '#FAF8F5',
          }}
        >
          Claude Code
        </div>
        <div
          style={{
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
            fontSize: 18,
            color: '#78716C',
            marginTop: 4,
          }}
        >
          Great Minds Agency
        </div>
      </div>
    </AbsoluteFill>
  );
};
