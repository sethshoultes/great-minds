import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { WPAdminSidebar } from "./scenes/WPAdminSidebar";
import { DashOverlay } from "./scenes/DashOverlay";
import { RapidSearch } from "./scenes/RapidSearch";
import { DeveloperAPI } from "./scenes/DeveloperAPI";
import { CTAScene } from "./scenes/CTAScene";
import { colors } from "./styles";

const FPS = 30;
const TOTAL_DURATION = 62 * FPS; // 1860 frames — extended to fit VO

// Scene timings (in frames at 30fps) — matched to actual audio durations
const SCENES = {
  wpAdmin: { from: 0, duration: 7 * FPS }, // 0:00 - 0:07 (audio 6.0s)
  dashOverlay: { from: 7 * FPS, duration: 12 * FPS }, // 0:07 - 0:19 (audio 10.8s)
  rapidSearch: { from: 19 * FPS, duration: 13 * FPS }, // 0:19 - 0:32 (audio 12.2s)
  developerAPI: { from: 32 * FPS, duration: 16 * FPS }, // 0:32 - 0:48 (audio 14.7s)
  cta: { from: 48 * FPS, duration: 14 * FPS }, // 0:48 - 1:02 (audio 13.3s)
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
