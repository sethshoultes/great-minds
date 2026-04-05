import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { Scene1Question } from "./scenes/Scene1Question";
import { Scene2Premise } from "./scenes/Scene2Premise";
import { Scene3Debate } from "./scenes/Scene3Debate";
import { Scene4Products } from "./scenes/Scene4Products";
import { Scene5Board } from "./scenes/Scene5Board";
import { Scene6Failures } from "./scenes/Scene6Failures";
import { Scene7Architecture } from "./scenes/Scene7Architecture";
import { Scene8CostModel } from "./scenes/Scene8CostModel";
import { Scene9Receipts } from "./scenes/Scene9Receipts";
import { Scene10Close } from "./scenes/Scene10Close";
import { colors } from "./styles";

const FPS = 30;

// Scene durations based on actual audio lengths (afinfo) + 1s breathing room
// scene1: 16.2s + 1s = 17.2s = 516 frames
// scene2: 14.376s + 1s = 15.376s = 462 frames
// scene3: 18.096s + 1s = 19.096s = 573 frames
// scene4: 17.568s + 1s = 18.568s = 558 frames
// scene5: 28.152s + 1s = 29.152s = 875 frames
// scene6: 30.312s + 1s = 31.312s = 940 frames
// scene7: 20.112s + 1s = 21.112s = 634 frames
// scene8: 19.248s + 1s = 20.248s = 608 frames
// scene9: 10.752s + 1s = 11.752s = 353 frames
// scene10: 4.224s + 1s + 6s hold = 11.224s = 337 frames

const SCENE_DURATIONS = [516, 462, 573, 558, 875, 940, 634, 608, 353, 337];

// Compute cumulative start frames
const SCENE_STARTS: number[] = [];
let cumulative = 0;
for (const d of SCENE_DURATIONS) {
  SCENE_STARTS.push(cumulative);
  cumulative += d;
}
const TOTAL_DURATION = cumulative; // 5856 frames = ~195.2s = ~3:15

const SCENES = SCENE_DURATIONS.map((duration, i) => ({
  from: SCENE_STARTS[i],
  duration,
}));

const SCENE_COMPONENTS = [
  Scene1Question,
  Scene2Premise,
  Scene3Debate,
  Scene4Products,
  Scene5Board,
  Scene6Failures,
  Scene7Architecture,
  Scene8CostModel,
  Scene9Receipts,
  Scene10Close,
];

const GreatMindsMovie: React.FC = () => {
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
      {SCENES.map((scene, i) => {
        const Component = SCENE_COMPONENTS[i];
        const sceneNum = i + 1;
        return (
          <React.Fragment key={sceneNum}>
            <Sequence
              from={scene.from}
              durationInFrames={scene.duration}
            >
              <Component />
            </Sequence>
            <Sequence
              from={scene.from}
              durationInFrames={scene.duration}
            >
              <Audio src={staticFile(`audio/scene${sceneNum}.mp3`)} />
            </Sequence>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GreatMindsMovie"
        component={GreatMindsMovie}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
