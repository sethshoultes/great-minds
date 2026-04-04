import React from "react";
import { Composition, Sequence } from "remotion";
import { Hook } from "./scenes/Hook";
import { PRDIntake } from "./scenes/PRDIntake";
import { AgentDebate } from "./scenes/AgentDebate";
import { ParallelBuild } from "./scenes/ParallelBuild";
import { TokenCredits } from "./scenes/TokenCredits";
import { MorningDelivery } from "./scenes/MorningDelivery";
import { CTA } from "./scenes/CTA";
import { colors } from "./styles";

const FPS = 30;
const TOTAL_DURATION = 72 * FPS; // 2160 frames

// Scene timings (in frames at 30fps)
const SCENES = {
  hook: { from: 0, duration: 3 * FPS }, // 0:00 - 0:03
  prdIntake: { from: 3 * FPS, duration: 7 * FPS }, // 0:03 - 0:10
  agentDebate: { from: 10 * FPS, duration: 12 * FPS }, // 0:10 - 0:22
  parallelBuild: { from: 22 * FPS, duration: 16 * FPS }, // 0:22 - 0:38
  tokenCredits: { from: 38 * FPS, duration: 12 * FPS }, // 0:38 - 0:50
  morningDelivery: { from: 50 * FPS, duration: 12 * FPS }, // 0:50 - 1:02
  cta: { from: 62 * FPS, duration: 10 * FPS }, // 1:02 - 1:12
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
      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration}>
        <Hook />
      </Sequence>

      <Sequence
        from={SCENES.prdIntake.from}
        durationInFrames={SCENES.prdIntake.duration}
      >
        <PRDIntake />
      </Sequence>

      <Sequence
        from={SCENES.agentDebate.from}
        durationInFrames={SCENES.agentDebate.duration}
      >
        <AgentDebate />
      </Sequence>

      <Sequence
        from={SCENES.parallelBuild.from}
        durationInFrames={SCENES.parallelBuild.duration}
      >
        <ParallelBuild />
      </Sequence>

      <Sequence
        from={SCENES.tokenCredits.from}
        durationInFrames={SCENES.tokenCredits.duration}
      >
        <TokenCredits />
      </Sequence>

      <Sequence
        from={SCENES.morningDelivery.from}
        durationInFrames={SCENES.morningDelivery.duration}
      >
        <MorningDelivery />
      </Sequence>

      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <CTA />
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
