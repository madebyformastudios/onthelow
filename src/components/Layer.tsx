import React, { createContext, useContext } from "react";
import { Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useExit } from "../motion";
import { useSafe } from "../theme";

const Base = createContext(0);

/** Absolute start (seconds) of the enclosing Layer, so Phase can use episode-absolute times. */
const useBase = () => useContext(Base);

/** Episode-absolute time (seconds) inside a Layer. */
export const useAbsTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return useBase() + frame / fps;
};

/**
 * Episode-timeline layer in absolute seconds. Dissolves in over `fade` seconds and keeps living `fade`
 * seconds past `to` so the next layer can dissolve over it. `overlay` layers dissolve out instead.
 */
export const Layer: React.FC<{
  from: number;
  to: number;
  fade?: number;
  overlay?: boolean;
  children: React.ReactNode;
}> = ({ from, to, fade = 0.35, overlay, children }) => {
  const { fps } = useVideoConfig();
  const dur = Math.max(1, Math.round((to - from + (overlay ? 0 : fade)) * fps));
  return (
    <Sequence from={Math.round(from * fps)} durationInFrames={dur} layout="none">
      <Base.Provider value={from}>
        <LayerFade fade={fade} out={overlay}>
          {children}
        </LayerFade>
      </Base.Provider>
    </Sequence>
  );
};

const LayerFade: React.FC<{ fade: number; out?: boolean; children: React.ReactNode }> = ({ fade, out, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fin = interpolate(frame, [0, fade * fps], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const fout = useExit(fade);
  return <div style={{ position: "absolute", inset: 0, opacity: fin * (out ? fout : 1) }}>{children}</div>;
};

/** A timed block inside a Layer (absolute seconds). Children animate relative to `from`; it fades out quickly. */
export const Phase: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const { fps } = useVideoConfig();
  const base = useBase();
  return (
    <Sequence
      from={Math.round((from - base) * fps)}
      durationInFrames={Math.max(1, Math.round((to - from) * fps))}
      layout="none"
    >
      <PhaseBody>{children}</PhaseBody>
    </Sequence>
  );
};

const PhaseBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const out = useExit(0.2);
  const safe = useSafe();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: out,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: safe ? `0 ${safe.rightBand}px 0 ${safe.side}px` : "0 80px",
      }}
    >
      {children}
    </div>
  );
};
