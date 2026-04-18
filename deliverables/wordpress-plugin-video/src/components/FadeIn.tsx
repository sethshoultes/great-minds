import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface FadeInProps {
  children: React.ReactNode;
  startFrame: number;
  durationFrames?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  style?: React.CSSProperties;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  startFrame,
  durationFrames = 15,
  direction = 'none',
  distance = 15,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  const opacity = interpolate(elapsed, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let translateX = 0;
  let translateY = 0;

  if (direction === 'up') {
    translateY = interpolate(elapsed, [0, durationFrames], [distance, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (direction === 'down') {
    translateY = interpolate(elapsed, [0, durationFrames], [-distance, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (direction === 'left') {
    translateX = interpolate(elapsed, [0, durationFrames], [distance, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (direction === 'right') {
    translateX = interpolate(elapsed, [0, durationFrames], [-distance, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  return (
    <div
      style={{
        opacity,
        transform: `translate(${translateX}px, ${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
