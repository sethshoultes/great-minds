import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { WPAdminSidebar } from "./scenes/WPAdminSidebar";
import { DashOverlay } from "./scenes/DashOverlay";
import { RapidSearch } from "./scenes/RapidSearch";
import { DeveloperAPI } from "./scenes/DeveloperAPI";
import { CTAScene } from "./scenes/CTAScene";
import { colors } from "./styles";

const FPS = 30;
const TOTAL_DURATION = 45 * FPS; // 1350 frames

// Scene timings (in frames at 30fps) — matches script breakdown
const SCENES = {
  wpAdmin: { from: 0, duration: 5 * FPS }, // 0:00 - 0:05
  dashOverlay: { from: 5 * FPS, duration: 7 * FPS }, // 0:05 - 0:12
  rapidSearch: { from: 12 * FPS, duration: 10 * FPS }, // 0:12 - 0:22
  developerAPI: { from: 22 * FPS, duration: 11 * FPS }, // 0:22 - 0:33
  cta: { from: 33 * FPS, duration: 12 * FPS }, // 0:33 - 0:45
} as const;

const DashPromo: React.FC = () => {
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
      {/* Scene 1 */}
      <Sequence from={SCENES.wpAdmin.from} durationInFrames={SCENES.wpAdmin.duration}>
        <WPAdminSidebar />
      </Sequence>
      <Sequence from={SCENES.wpAdmin.from} durationInFrames={SCENES.wpAdmin.duration}>
        <Audio src={staticFile("audio/scene1.mp3")} />
      </Sequence>

      {/* Scene 2 */}
      <Sequence from={SCENES.dashOverlay.from} durationInFrames={SCENES.dashOverlay.duration}>
        <DashOverlay />
      </Sequence>
      <Sequence from={SCENES.dashOverlay.from} durationInFrames={SCENES.dashOverlay.duration}>
        <Audio src={staticFile("audio/scene2.mp3")} />
      </Sequence>

      {/* Scene 3 */}
      <Sequence from={SCENES.rapidSearch.from} durationInFrames={SCENES.rapidSearch.duration}>
        <RapidSearch />
      </Sequence>
      <Sequence from={SCENES.rapidSearch.from} durationInFrames={SCENES.rapidSearch.duration}>
        <Audio src={staticFile("audio/scene3.mp3")} />
      </Sequence>

      {/* Scene 4 */}
      <Sequence from={SCENES.developerAPI.from} durationInFrames={SCENES.developerAPI.duration}>
        <DeveloperAPI />
      </Sequence>
      <Sequence from={SCENES.developerAPI.from} durationInFrames={SCENES.developerAPI.duration}>
        <Audio src={staticFile("audio/scene4.mp3")} />
      </Sequence>

      {/* Scene 5 */}
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <CTAScene />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <Audio src={staticFile("audio/scene5.mp3")} />
      </Sequence>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DashPromo"
        component={DashPromo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
