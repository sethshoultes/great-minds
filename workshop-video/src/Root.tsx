import React from 'react';
import { Composition } from 'remotion';
import { WorkshopOpening } from './WorkshopOpening';
import { TitleCard } from './TitleCard';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WorkshopOpening"
        component={WorkshopOpening}
        durationInFrames={120 * 30} // 2 minutes at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TitleCard"
        component={TitleCard}
        durationInFrames={10 * 30} // 10 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
