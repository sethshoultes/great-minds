import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { DashboardHook } from "./scenes/DashboardHook";
import { NotesCascade } from "./scenes/NotesCascade";
import { AcknowledgeAndExpire } from "./scenes/AcknowledgeAndExpire";
import { FullDashboard } from "./scenes/FullDashboard";
import { ClosingCTA } from "./scenes/ClosingCTA";
import { colors } from "./styles";

const FPS = 30;
const TOTAL_DURATION = 45 * FPS; // 1350 frames — 45 seconds hard cap

// Scene timings (in frames at 30fps)
const SCENES = {
  dashboardHook: { from: 0, duration: 5 * FPS }, // 0:00 - 0:05
  notesCascade: { from: 5 * FPS, duration: 10 * FPS }, // 0:05 - 0:15
  acknowledgeAndExpire: { from: 15 * FPS, duration: 13 * FPS }, // 0:15 - 0:28
  fullDashboard: { from: 28 * FPS, duration: 10 * FPS }, // 0:28 - 0:38
  closingCTA: { from: 38 * FPS, duration: 7 * FPS }, // 0:38 - 0:45
} as const;

const PinnedPromo: React.FC = () => {
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
      {/* Scene 1: Dashboard Hook */}
      <Sequence
        from={SCENES.dashboardHook.from}
        durationInFrames={SCENES.dashboardHook.duration}
      >
        <DashboardHook />
      </Sequence>
      <Sequence from={SCENES.dashboardHook.from} durationInFrames={SCENES.dashboardHook.duration}>
        <Audio src={staticFile("audio/scene1.mp3")} />
      </Sequence>

      {/* Scene 2: Notes Cascade */}
      <Sequence
        from={SCENES.notesCascade.from}
        durationInFrames={SCENES.notesCascade.duration}
      >
        <NotesCascade />
      </Sequence>
      <Sequence from={SCENES.notesCascade.from} durationInFrames={SCENES.notesCascade.duration}>
        <Audio src={staticFile("audio/scene2.mp3")} />
      </Sequence>

      {/* Scene 3: Acknowledge & Expire */}
      <Sequence
        from={SCENES.acknowledgeAndExpire.from}
        durationInFrames={SCENES.acknowledgeAndExpire.duration}
      >
        <AcknowledgeAndExpire />
      </Sequence>
      <Sequence from={SCENES.acknowledgeAndExpire.from} durationInFrames={SCENES.acknowledgeAndExpire.duration}>
        <Audio src={staticFile("audio/scene3.mp3")} />
      </Sequence>

      {/* Scene 4: Full Dashboard Pull-back */}
      <Sequence
        from={SCENES.fullDashboard.from}
        durationInFrames={SCENES.fullDashboard.duration}
      >
        <FullDashboard />
      </Sequence>
      <Sequence from={SCENES.fullDashboard.from} durationInFrames={SCENES.fullDashboard.duration}>
        <Audio src={staticFile("audio/scene4.mp3")} />
      </Sequence>

      {/* Scene 5: Closing CTA */}
      <Sequence
        from={SCENES.closingCTA.from}
        durationInFrames={SCENES.closingCTA.duration}
      >
        <ClosingCTA />
      </Sequence>
      <Sequence from={SCENES.closingCTA.from} durationInFrames={SCENES.closingCTA.duration}>
        <Audio src={staticFile("audio/scene5.mp3")} />
      </Sequence>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PinnedPromo"
        component={PinnedPromo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
