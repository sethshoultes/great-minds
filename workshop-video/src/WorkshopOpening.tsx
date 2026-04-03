import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
  staticFile,
} from 'remotion';

/**
 * Workshop Opening — 2-minute cinematic sequence
 *
 * 9 persona reveals with accelerating dissolves.
 * Per the script: "darkness, then light, then motion."
 *
 * At 30fps, 2 minutes = 3600 frames.
 */

const FPS = 30;

// Persona data with timing from the script
const personas = [
  {
    name: 'Marcus Aurelius',
    image: 'personas/marcus-aurelius.webp',
    startSec: 8,
    holdSec: 5,       // 5 seconds visible (including dissolve in)
    dissolveInSec: 2,  // 2-second fade from black
    dissolveOutSec: 1.5,
    subtitle: null,
    sethLine: null,  // "While I slept... nine minds went to work." is at 0:08 over void
  },
  {
    name: 'Steve Jobs',
    image: 'personas/steve-jobs.webp',
    startSec: 18,
    holdSec: 5,
    dissolveInSec: 1.5,
    dissolveOutSec: 1,
    subtitle: null,
  },
  {
    name: 'Elon Musk',
    image: 'personas/elon-musk.webp',
    startSec: 28,
    holdSec: 5,
    dissolveInSec: 1,
    dissolveOutSec: 1,
    subtitle: 'Someone to push past what\'s possible.',
  },
  {
    name: 'Jensen Huang',
    image: 'personas/jensen-huang.webp',
    startSec: 38,
    holdSec: 4,
    dissolveInSec: 0.8,
    dissolveOutSec: 0.8,
    subtitle: 'Someone who understands what\'s underneath.',
  },
  {
    name: 'Margaret Hamilton',
    image: 'personas/margaret-hamilton.webp',
    startSec: 46,
    holdSec: 4,
    dissolveInSec: 0.8,
    dissolveOutSec: 0.8,
    subtitle: 'Someone who makes sure it doesn\'t fail.',
  },
  {
    name: 'Rick Rubin',
    image: 'personas/rick-rubin.webp',
    startSec: 54,
    holdSec: 4,
    dissolveInSec: 0.7,
    dissolveOutSec: 0.7,
    subtitle: 'Someone to find the signal in the noise.',
  },
  {
    name: 'Jony Ive',
    image: 'personas/jony-ive.webp',
    startSec: 62,
    holdSec: 4,
    dissolveInSec: 0.7,
    dissolveOutSec: 0.7,
    subtitle: 'Someone to make it beautiful.',
  },
  {
    name: 'Maya Angelou',
    image: 'personas/maya-angelou.webp',
    startSec: 70,
    holdSec: 3.5,
    dissolveInSec: 0.6,
    dissolveOutSec: 0.6,
    subtitle: 'Someone to give it a voice.',
  },
  {
    name: 'Sara Blakely',
    image: 'personas/sara-blakely.webp',
    startSec: 77,
    holdSec: 3.5,
    dissolveInSec: 0.6,
    dissolveOutSec: 0,  // Hard cut to black
    subtitle: 'And someone to put it in front of the world.',
  },
];

// Text overlay timing
const textOverlays = [
  { text: 'Last Tuesday night, I went to sleep with an idea.', startSec: 0, endSec: 4 },
  { text: 'I woke up with a product.', startSec: 5, endSec: 8 },
  { text: 'While I slept... nine minds went to work.', startSec: 9, endSec: 16 },
  { text: 'Someone to push past what\'s possible.', startSec: 30, endSec: 36 },
  { text: 'Someone who understands what\'s underneath.', startSec: 40, endSec: 44 },
  { text: 'Someone who makes sure it doesn\'t fail.', startSec: 48, endSec: 52 },
  { text: 'Someone to find the signal in the noise.', startSec: 56, endSec: 60 },
  { text: 'Someone to make it beautiful.', startSec: 64, endSec: 68 },
  { text: 'Someone to give it a voice.', startSec: 72, endSec: 75 },
  { text: 'And someone to put it in front of the world.', startSec: 78, endSec: 82 },
];

// Title card timing
const TITLE_START = 84;  // 1:24
const TITLE_HOLD = 6;
const HOW_START = 98;    // 1:38
const END_SEC = 120;     // 2:00

/**
 * Persona reveal — fades from transparent to opaque, holds, then fades out
 */
function PersonaReveal({
  image,
  startFrame,
  holdFrames,
  dissolveInFrames,
  dissolveOutFrames,
}: {
  image: string;
  startFrame: number;
  holdFrames: number;
  dissolveInFrames: number;
  dissolveOutFrames: number;
}) {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame > holdFrames) return null;

  const opacity = interpolate(
    relFrame,
    [0, dissolveInFrames, holdFrames - dissolveOutFrames, holdFrames],
    [0, 1, 1, dissolveOutFrames > 0 ? 0 : 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Subtle Ken Burns — slow zoom in
  const scale = interpolate(relFrame, [0, holdFrames], [1, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(image)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
}

/**
 * Text overlay — fades in and out
 */
function TextOverlay({
  text,
  startFrame,
  endFrame,
}: {
  text: string;
  startFrame: number;
  endFrame: number;
}) {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;
  const duration = endFrame - startFrame;

  if (relFrame < 0 || relFrame > duration) return null;

  const fadeInFrames = Math.min(15, duration / 3);
  const fadeOutFrames = Math.min(15, duration / 3);

  const opacity = interpolate(
    relFrame,
    [0, fadeInFrames, duration - fadeOutFrames, duration],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '12%',
        opacity,
      }}
    >
      <p
        style={{
          color: 'rgba(255,255,255,0.92)',
          fontSize: 32,
          fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif",
          fontWeight: 400,
          textAlign: 'center',
          maxWidth: '70%',
          lineHeight: 1.5,
          textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          letterSpacing: '0.01em',
        }}
      >
        {text}
      </p>
    </AbsoluteFill>
  );
}

/**
 * Title card — "262 files. One night. Nine minds."
 */
function TitleCard({ startFrame, holdFrames }: { startFrame: number; holdFrames: number }) {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame > holdFrames) return null;

  const line1Opacity = interpolate(relFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const line2Opacity = interpolate(relFrame, [15, 35], [0, 1], { extrapolateRight: 'clamp' });
  const line3Opacity = interpolate(relFrame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

  const fadeOut = interpolate(relFrame, [holdFrames - 20, holdFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeOut,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            color: '#fff',
            fontSize: 52,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
            fontWeight: 700,
            opacity: line1Opacity,
            marginBottom: 8,
            letterSpacing: '-0.02em',
          }}
        >
          262 files.
        </p>
        <p
          style={{
            color: '#fff',
            fontSize: 52,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
            fontWeight: 700,
            opacity: line2Opacity,
            marginBottom: 8,
            letterSpacing: '-0.02em',
          }}
        >
          One night.
        </p>
        <p
          style={{
            color: '#F59E0B',
            fontSize: 52,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
            fontWeight: 700,
            opacity: line3Opacity,
            letterSpacing: '-0.02em',
          }}
        >
          Nine minds.
        </p>
      </div>
    </AbsoluteFill>
  );
}

/**
 * "How?" card
 */
function HowCard({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  if (relFrame < 0) return null;

  const opacity = interpolate(relFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
      <p
        style={{
          color: '#F59E0B',
          fontSize: 72,
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
          fontWeight: 700,
          letterSpacing: '-0.03em',
        }}
      >
        How?
      </p>
    </AbsoluteFill>
  );
}

/**
 * Main composition
 */
export const WorkshopOpening: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Persona reveals */}
      {personas.map((p) => (
        <PersonaReveal
          key={p.name}
          image={p.image}
          startFrame={p.startSec * FPS}
          holdFrames={p.holdSec * FPS}
          dissolveInFrames={p.dissolveInSec * FPS}
          dissolveOutFrames={p.dissolveOutSec * FPS}
        />
      ))}

      {/* Text overlays */}
      {textOverlays.map((t) => (
        <TextOverlay
          key={t.text}
          text={t.text}
          startFrame={t.startSec * FPS}
          endFrame={t.endSec * FPS}
        />
      ))}

      {/* Title card: 262 files. One night. Nine minds. */}
      <TitleCard
        startFrame={TITLE_START * FPS}
        holdFrames={TITLE_HOLD * FPS}
      />

      {/* "How?" card */}
      <HowCard startFrame={HOW_START * FPS} />
    </AbsoluteFill>
  );
};
