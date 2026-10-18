import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HEIGHT, WIDTH } from "../theme";

const IMG_RATIO = 768 / 1376;

/**
 * Illustration with slow Ken Burns push-in and a soft top/bottom shade for HUD and subtitles.
 * `bars` crops baked-in black bars (fractions of the image height) and zooms to fill the frame.
 */
export const Shot: React.FC<{
  file: string;
  bars?: { top: number; bottom: number };
  focusX?: number;
  blur?: number;
}> = ({ file, bars, focusX = 0.5, blur = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / Math.max(1, durationInFrames);
  const scale = 1 + 0.08 * p;
  const dir = file.charCodeAt(file.length - 1) % 2 ? 1 : -1;
  const drift = dir * 24 * (p - 0.5);
  const visible = bars ? 1 - bars.top - bars.bottom : 1;
  const imgH = HEIGHT / visible;
  const imgW = Math.max(WIDTH, imgH * IMG_RATIO);
  const left = -(imgW - WIDTH) * focusX;
  const top = bars ? -bars.top * imgH : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${drift}px) scale(${scale})`, transformOrigin: `${focusX * 100}% 45%` }}>
        <Img
          src={staticFile(`shots/${file}.jpg`)}
          style={{
            position: "absolute",
            left,
            top,
            width: imgW,
            height: bars ? imgH : HEIGHT,
            objectFit: "cover",
            filter: blur ? `blur(${blur}px)` : undefined,
          }}
        />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%)" }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
