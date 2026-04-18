import React from 'react';
import { Audio, Composition, Sequence, staticFile } from 'remotion';
import { SCENES, FPS, WIDTH, HEIGHT } from './styles';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Why } from './scenes/Scene2Why';
import { Scene3OneFile } from './scenes/Scene3OneFile';
import { Scene4Hooks } from './scenes/Scene4Hooks';
import { Scene5Insight } from './scenes/Scene5Insight';
import { Scene6aBuild } from './scenes/Scene6aBuild';
import { Scene6bShortcode } from './scenes/Scene6bShortcode';
import { Scene7Activate } from './scenes/Scene7Activate';
import { Scene8NextSteps } from './scenes/Scene8NextSteps';
import { Scene9Close } from './scenes/Scene9Close';

const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0) * FPS;

const AUDIO_FILES = [
  'scene1.mp3',
  'scene2.mp3',
  'scene3.mp3',
  'scene4.mp3',
  'scene5.mp3',
  'scene6a.mp3',
  'scene6b.mp3',
  'scene7.mp3',
  'scene8.mp3',
  'scene9.mp3',
];

const SCENE_CONFIGS = [
  { Component: Scene1Hook, duration: SCENES.scene1 },
  { Component: Scene2Why, duration: SCENES.scene2 },
  { Component: Scene3OneFile, duration: SCENES.scene3 },
  { Component: Scene4Hooks, duration: SCENES.scene4 },
  { Component: Scene5Insight, duration: SCENES.scene5 },
  { Component: Scene6aBuild, duration: SCENES.scene6a },
  { Component: Scene6bShortcode, duration: SCENES.scene6b },
  { Component: Scene7Activate, duration: SCENES.scene7 },
  { Component: Scene8NextSteps, duration: SCENES.scene8 },
  { Component: Scene9Close, duration: SCENES.scene9 },
];

const Tutorial: React.FC = () => {
  let offset = 0;

  return (
    <>
      {SCENE_CONFIGS.map(({ Component, duration }, i) => {
        const from = offset;
        const durationInFrames = duration * FPS;
        offset += durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <Component />
            <Audio src={staticFile(`audio/${AUDIO_FILES[i]}`)} volume={1} />
          </Sequence>
        );
      })}
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WordPressPluginTutorial"
        component={Tutorial}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* Individual scene previews */}
      <Composition id="Scene1" component={Scene1Hook} durationInFrames={SCENES.scene1 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene2" component={Scene2Why} durationInFrames={SCENES.scene2 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene3" component={Scene3OneFile} durationInFrames={SCENES.scene3 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene4" component={Scene4Hooks} durationInFrames={SCENES.scene4 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene5" component={Scene5Insight} durationInFrames={SCENES.scene5 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene6a" component={Scene6aBuild} durationInFrames={SCENES.scene6a * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene6b" component={Scene6bShortcode} durationInFrames={SCENES.scene6b * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene7" component={Scene7Activate} durationInFrames={SCENES.scene7 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene8" component={Scene8NextSteps} durationInFrames={SCENES.scene8 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene9" component={Scene9Close} durationInFrames={SCENES.scene9 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
    </>
  );
};
