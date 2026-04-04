import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { Hook } from "./scenes/Hook";
import { PRDIntake } from "./scenes/PRDIntake";
import { AgentDebate } from "./scenes/AgentDebate";
import { ParallelBuild } from "./scenes/ParallelBuild";
import { TokenCredits } from "./scenes/TokenCredits";
import { MorningDelivery } from "./scenes/MorningDelivery";
import { CTA } from "./scenes/CTA";
import { colors } from "./styles";

const FPS = 30;
const TOTAL_DURATION = 75 * FPS; // 2250 frames

// Scene timings (in frames at 30fps) — adjusted so audio never clips
const SCENES = {
  hook: { from: 0, duration: 6 * FPS }, // 0:00 - 0:06 (audio 4.6s + breathing room)
  prdIntake: { from: 6 * FPS, duration: 8 * FPS }, // 0:06 - 0:14
  agentDebate: { from: 14 * FPS, duration: 12 * FPS }, // 0:14 - 0:26
  parallelBuild: { from: 26 * FPS, duration: 13 * FPS }, // 0:26 - 0:39
  tokenCredits: { from: 39 * FPS, duration: 12 * FPS }, // 0:39 - 0:51
  morningDelivery: { from: 51 * FPS, duration: 10 * FPS }, // 0:51 - 1:01
  cta: { from: 61 * FPS, duration: 14 * FPS }, // 1:01 - 1:15 (hold on CTA longer)
} as const;

const ShipyardPromo: React.FC = () => {
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
      {/* Scene 1: Hook */}
      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration}>
        <Hook />
      </Sequence>
      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration}>
        <Audio src={staticFile("audio/scene1.mp3")} />
      </Sequence>

      {/* Scene 2: PRD Intake */}
      <Sequence from={SCENES.prdIntake.from} durationInFrames={SCENES.prdIntake.duration}>
        <PRDIntake />
      </Sequence>
      <Sequence from={SCENES.prdIntake.from} durationInFrames={SCENES.prdIntake.duration}>
        <Audio src={staticFile("audio/scene2.mp3")} />
      </Sequence>

      {/* Scene 3: Agent Debate */}
      <Sequence from={SCENES.agentDebate.from} durationInFrames={SCENES.agentDebate.duration}>
        <AgentDebate />
      </Sequence>
      <Sequence from={SCENES.agentDebate.from} durationInFrames={SCENES.agentDebate.duration}>
        <Audio src={staticFile("audio/scene3.mp3")} />
      </Sequence>

      {/* Scene 4: Parallel Build */}
      <Sequence from={SCENES.parallelBuild.from} durationInFrames={SCENES.parallelBuild.duration}>
        <ParallelBuild />
      </Sequence>
      <Sequence from={SCENES.parallelBuild.from} durationInFrames={SCENES.parallelBuild.duration}>
        <Audio src={staticFile("audio/scene4.mp3")} />
      </Sequence>

      {/* Scene 5: Token Credits */}
      <Sequence from={SCENES.tokenCredits.from} durationInFrames={SCENES.tokenCredits.duration}>
        <TokenCredits />
      </Sequence>
      <Sequence from={SCENES.tokenCredits.from} durationInFrames={SCENES.tokenCredits.duration}>
        <Audio src={staticFile("audio/scene5.mp3")} />
      </Sequence>

      {/* Scene 6: Morning Delivery */}
      <Sequence from={SCENES.morningDelivery.from} durationInFrames={SCENES.morningDelivery.duration}>
        <MorningDelivery />
      </Sequence>
      <Sequence from={SCENES.morningDelivery.from} durationInFrames={SCENES.morningDelivery.duration}>
        <Audio src={staticFile("audio/scene6.mp3")} />
      </Sequence>

      {/* Scene 7: CTA */}
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <CTA />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <Audio src={staticFile("audio/scene7.mp3")} />
      </Sequence>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShipyardPromo"
        component={ShipyardPromo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
