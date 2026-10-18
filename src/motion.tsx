import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { springs } from "./theme";

/** Spring progress 0..1 starting at `atSec` (seconds inside the current Sequence). */
export const useEnter = (atSec = 0, config: Partial<typeof springs.pop> = springs.pop) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(atSec * fps), fps, config });
};

/** 1 until the last `sec` of the current Sequence, then fades to 0 (exits are faster than entrances). */
export const useExit = (sec = 0.25) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - sec * fps, durationInFrames], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Entrance with opacity + translateY + scale together, staggered via `at`. */
export const Pop: React.FC<{
  at?: number;
  y?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at = 0, y = 40, style, children }) => {
  const p = useEnter(at);
  return (
    <div
      style={{
        opacity: Math.min(1, p),
        transform: `translateY(${(1 - p) * y}px) scale(${0.94 + 0.06 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
