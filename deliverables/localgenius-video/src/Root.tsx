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
const TOTAL_DURATION = 60 * FPS; // 1800 frames — hard 60s cap

// Scene timings (in frames at 30fps)
const SCENES = {
  mainStreetOpen:       { from: 0,          duration: 6 * FPS },   // 0:00 - 0:06
  chatStrategy:         { from: 6 * FPS,    duration: 8 * FPS },   // 0:06 - 0:14
  contentGrid:          { from: 14 * FPS,   duration: 12 * FPS },  // 0:14 - 0:26
  dashboardReveal:      { from: 26 * FPS,   duration: 10 * FPS },  // 0:26 - 0:36
  multiBusinessCascade: { from: 36 * FPS,   duration: 14 * FPS },  // 0:36 - 0:50
  mainStreetClose:      { from: 50 * FPS,   duration: 10 * FPS },  // 0:50 - 1:00
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
