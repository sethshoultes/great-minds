import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { DashboardHook } from "./scenes/DashboardHook";
import { NotesCascade } from "./scenes/NotesCascade";
import { AcknowledgeAndExpire } from "./scenes/AcknowledgeAndExpire";
import { FullDashboard } from "./scenes/FullDashboard";
import { ClosingCTA } from "./scenes/ClosingCTA";
import { colors } from "./styles";

const FPS = 30;
const TOTAL_DURATION = 42 * FPS; // 1260 frames — matched to actual audio

// Scene timings (in frames at 30fps) — matched to audio durations
const SCENES = {
  dashboardHook: { from: 0, duration: 8 * FPS }, // 0:00 - 0:08 (audio 6.4s)
  notesCascade: { from: 8 * FPS, duration: 11 * FPS }, // 0:08 - 0:19 (audio 10.4s)
  acknowledgeAndExpire: { from: 19 * FPS, duration: 10 * FPS }, // 0:19 - 0:29 (audio 9.5s)
  fullDashboard: { from: 29 * FPS, duration: 8 * FPS }, // 0:29 - 0:37 (audio 7.2s)
  closingCTA: { from: 37 * FPS, duration: 5 * FPS }, // 0:37 - 0:42 (audio 3.3s)
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
