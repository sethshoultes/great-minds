import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { TerminalInstall } from "./scenes/TerminalInstall";
import { OrgChart } from "./scenes/OrgChart";
import { LiveBuild } from "./scenes/LiveBuild";
import { CTA } from "./scenes/CTA";
import { colors } from "./styles";

const FPS = 30;
const TOTAL_DURATION = 53 * FPS; // matched to audio

// Scene timings — matched to actual audio durations (4 scenes, no tmux)
const SCENES = {
  terminalInstall: { from: 0, duration: 13 * FPS },            // 0:00 - 0:13 (audio 11.8s)
  orgChart: { from: 13 * FPS, duration: 19 * FPS },            // 0:13 - 0:32 (audio 17.6s)
  liveBuild: { from: 32 * FPS, duration: 17 * FPS },           // 0:32 - 0:49 (audio 15.8s)
  cta: { from: 49 * FPS, duration: 4 * FPS },                  // 0:49 - 0:53 (audio 3.1s)
} as const;

const GreatMindsPlugin: React.FC = () => {
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
      {/* Scene 1: "What if your IDE had a team?" + Install + Agent Cascade */}
      <Sequence from={SCENES.terminalInstall.from} durationInFrames={SCENES.terminalInstall.duration}>
        <TerminalInstall />
      </Sequence>
      <Sequence from={SCENES.terminalInstall.from} durationInFrames={SCENES.terminalInstall.duration}>
        <Audio src={staticFile("audio/scene1.mp3")} />
      </Sequence>

      {/* Scene 2: Org Chart + Board + Skills + Crons */}
      <Sequence from={SCENES.orgChart.from} durationInFrames={SCENES.orgChart.duration}>
        <OrgChart />
      </Sequence>
      <Sequence from={SCENES.orgChart.from} durationInFrames={SCENES.orgChart.duration}>
        <Audio src={staticFile("audio/scene2.mp3")} />
      </Sequence>

      {/* Scene 3: Live Build Session */}
      <Sequence from={SCENES.liveBuild.from} durationInFrames={SCENES.liveBuild.duration}>
        <LiveBuild />
      </Sequence>
      <Sequence from={SCENES.liveBuild.from} durationInFrames={SCENES.liveBuild.duration}>
        <Audio src={staticFile("audio/scene3.mp3")} />
      </Sequence>

      {/* Scene 4: CTA */}
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <CTA />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <Audio src={staticFile("audio/scene4.mp3")} />
      </Sequence>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GreatMindsPlugin"
        component={GreatMindsPlugin}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
