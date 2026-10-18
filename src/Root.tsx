import React from "react";
import { Composition, Still } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { Showcase } from "./Showcase";
import { EPISODE_A1_SECONDS, EpisodeA1 } from "./EpisodeA1";
import { EPISODE_B1_SECONDS, EpisodeB1 } from "./EpisodeB1";
import { EPISODE_A2_BUILD_SECONDS, EpisodeA2Build } from "./EpisodeA2Build";
import { EPISODE_A2_SELL_SECONDS, EpisodeA2Sell } from "./EpisodeA2Sell";
import { Thumbnail, thumbA, thumbB } from "./Thumbnail";

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
    <Composition
      id="A02-BUILD"
      component={EpisodeA2Build}
      durationInFrames={Math.ceil(EPISODE_A2_BUILD_SECONDS * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="A02-SELL"
      component={EpisodeA2Sell}
      durationInFrames={Math.ceil(EPISODE_A2_SELL_SECONDS * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="B01"
      component={EpisodeB1}
      durationInFrames={Math.ceil(EPISODE_B1_SECONDS * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Still id="Thumb-A" component={Thumbnail} defaultProps={thumbA} width={WIDTH} height={HEIGHT} />
    <Still id="Thumb-B" component={Thumbnail} defaultProps={thumbB} width={WIDTH} height={HEIGHT} />
  </>
);
