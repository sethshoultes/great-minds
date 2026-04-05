import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { MainStreetOpen } from "./scenes/MainStreetOpen";
import { ChatStrategy } from "./scenes/ChatStrategy";
import { ContentGrid } from "./scenes/ContentGrid";
import { DashboardReveal } from "./scenes/DashboardReveal";
import { MultiBusinessCascade } from "./scenes/MultiBusinessCascade";
import { MainStreetClose } from "./scenes/MainStreetClose";
import { colors } from "./styles";

const FPS = 30;
const TOTAL_DURATION = 68 * FPS; // 2040 frames — matched to audio

// Scene timings (in frames at 30fps) — matched to actual audio durations
const SCENES = {
  mainStreetOpen:       { from: 0,          duration: 8 * FPS },   // 0:00 - 0:08 (audio 6.9s)
  chatStrategy:         { from: 8 * FPS,    duration: 8 * FPS },   // 0:08 - 0:16 (audio 6.9s)
  contentGrid:          { from: 16 * FPS,   duration: 14 * FPS },  // 0:16 - 0:30 (audio 13.1s)
  dashboardReveal:      { from: 30 * FPS,   duration: 16 * FPS },  // 0:30 - 0:46 (audio 14.4s)
  multiBusinessCascade: { from: 46 * FPS,   duration: 15 * FPS },  // 0:46 - 1:01 (audio 13.7s)
  mainStreetClose:      { from: 61 * FPS,   duration: 7 * FPS },   // 1:01 - 1:08 (audio 4.1s)
} as const;

const LocalGeniusPromo: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Scene 1: Main Street — dolly in */}
      <Sequence from={SCENES.mainStreetOpen.from} durationInFrames={SCENES.mainStreetOpen.duration}>
        <MainStreetOpen />
      </Sequence>
      <Sequence from={SCENES.mainStreetOpen.from} durationInFrames={SCENES.mainStreetOpen.duration}>
        <Audio src={staticFile("audio/scene1.mp3")} />
      </Sequence>

      {/* Scene 2: Chat strategy interface */}
      <Sequence from={SCENES.chatStrategy.from} durationInFrames={SCENES.chatStrategy.duration}>
        <ChatStrategy />
      </Sequence>
      <Sequence from={SCENES.chatStrategy.from} durationInFrames={SCENES.chatStrategy.duration}>
        <Audio src={staticFile("audio/scene2.mp3")} />
      </Sequence>

      {/* Scene 3: 2x3 content grid */}
      <Sequence from={SCENES.contentGrid.from} durationInFrames={SCENES.contentGrid.duration}>
        <ContentGrid />
      </Sequence>
      <Sequence from={SCENES.contentGrid.from} durationInFrames={SCENES.contentGrid.duration}>
        <Audio src={staticFile("audio/scene3.mp3")} />
      </Sequence>

      {/* Scene 4: Full dashboard with sidebar */}
      <Sequence from={SCENES.dashboardReveal.from} durationInFrames={SCENES.dashboardReveal.duration}>
        <DashboardReveal />
      </Sequence>
      <Sequence from={SCENES.dashboardReveal.from} durationInFrames={SCENES.dashboardReveal.duration}>
        <Audio src={staticFile("audio/scene4.mp3")} />
      </Sequence>

      {/* Scene 5: Multi-business cascade + deploy */}
      <Sequence from={SCENES.multiBusinessCascade.from} durationInFrames={SCENES.multiBusinessCascade.duration}>
        <MultiBusinessCascade />
      </Sequence>
      <Sequence from={SCENES.multiBusinessCascade.from} durationInFrames={SCENES.multiBusinessCascade.duration}>
        <Audio src={staticFile("audio/scene5.mp3")} />
      </Sequence>

      {/* Scene 6: Main Street — pull back + CTA */}
      <Sequence from={SCENES.mainStreetClose.from} durationInFrames={SCENES.mainStreetClose.duration}>
        <MainStreetClose />
      </Sequence>
      <Sequence from={SCENES.mainStreetClose.from} durationInFrames={SCENES.mainStreetClose.duration}>
        <Audio src={staticFile("audio/scene6.mp3")} />
      </Sequence>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LocalGeniusPromo"
        component={LocalGeniusPromo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
