import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { TerminalInstall } from "./scenes/TerminalInstall";
import { WorktreeRevolution } from "./scenes/WorktreeRevolution";
import { OrgChart } from "./scenes/OrgChart";
import { LiveBuild } from "./scenes/LiveBuild";
import { CTA } from "./scenes/CTA";
import { colors } from "./styles";

const FPS = 30;
const TOTAL_DURATION = 45 * FPS; // 1350 frames

// Scene timings (in frames at 30fps) — per script.md
const SCENES = {
  terminalInstall: { from: 0, duration: 5 * FPS },            // 0:00 - 0:05
  worktreeRevolution: { from: 5 * FPS, duration: 10 * FPS },  // 0:05 - 0:15
  orgChart: { from: 15 * FPS, duration: 13 * FPS },           // 0:15 - 0:28
  liveBuild: { from: 28 * FPS, duration: 10 * FPS },          // 0:28 - 0:38
  cta: { from: 38 * FPS, duration: 7 * FPS },                 // 0:38 - 0:45
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
      {/* Scene 1: Terminal Install + Agent Cascade */}
      <Sequence
        from={SCENES.terminalInstall.from}
        durationInFrames={SCENES.terminalInstall.duration}
      >
        <TerminalInstall />
      </Sequence>
      <Sequence from={SCENES.terminalInstall.from} durationInFrames={SCENES.terminalInstall.duration}>
        <Audio src={staticFile("audio/scene1.mp3")} />
      </Sequence>

      {/* Scene 2: Tmux Failure vs Worktree Success */}
      <Sequence
        from={SCENES.worktreeRevolution.from}
        durationInFrames={SCENES.worktreeRevolution.duration}
      >
        <WorktreeRevolution />
      </Sequence>
      <Sequence from={SCENES.worktreeRevolution.from} durationInFrames={SCENES.worktreeRevolution.duration}>
        <Audio src={staticFile("audio/scene2.mp3")} />
      </Sequence>

      {/* Scene 3: Org Chart + Skills + Cron */}
      <Sequence
        from={SCENES.orgChart.from}
        durationInFrames={SCENES.orgChart.duration}
      >
        <OrgChart />
      </Sequence>
      <Sequence from={SCENES.orgChart.from} durationInFrames={SCENES.orgChart.duration}>
        <Audio src={staticFile("audio/scene3.mp3")} />
      </Sequence>

      {/* Scene 4: Live Build Session */}
      <Sequence
        from={SCENES.liveBuild.from}
        durationInFrames={SCENES.liveBuild.duration}
      >
        <LiveBuild />
      </Sequence>
      <Sequence from={SCENES.liveBuild.from} durationInFrames={SCENES.liveBuild.duration}>
        <Audio src={staticFile("audio/scene4.mp3")} />
      </Sequence>

      {/* Scene 5: CTA */}
      <Sequence
        from={SCENES.cta.from}
        durationInFrames={SCENES.cta.duration}
      >
        <CTA />
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
