import React from "react";
import { Composition } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { Showcase } from "./Showcase";
import { EPISODE_A1_SECONDS, EpisodeA1 } from "./EpisodeA1";

const SHOWCASE_SECONDS = 26.5;

export const Root: React.FC = () => (
  <>
    <Composition
      id="Showcase-A"
      component={Showcase}
      defaultProps={{ series: "a" as const }}
      durationInFrames={Math.round(SHOWCASE_SECONDS * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="Showcase-B"
      component={Showcase}
      defaultProps={{ series: "b" as const }}
      durationInFrames={Math.round(SHOWCASE_SECONDS * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="A01"
      component={EpisodeA1}
      durationInFrames={Math.ceil(EPISODE_A1_SECONDS * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
