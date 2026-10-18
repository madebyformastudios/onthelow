import React from "react";
import { AbsoluteFill } from "remotion";
import { SeriesId, SeriesProvider, fonts, palette, useSeries } from "./theme";
import { Shot } from "./components/Shot";

type Props = {
  series: SeriesId;
  shot: string;
  kicker: string;
  lead: string[];
  accentWord: string;
  size?: number;
  /** Moves the illustration up (px) so the face clears the headline. */
  lift?: number;
  sub: string;
  focusX?: number;
};

const Cover: React.FC<Props> = ({ shot, kicker, lead, accentWord, sub, focusX, size = 172, lift = 0 }) => {
  const { accent } = useSeries();
  const head: React.CSSProperties = {
    fontFamily: fonts.sans,
    fontWeight: 900,
    fontSize: size,
    letterSpacing: -6,
    lineHeight: 0.95,
    textShadow: "0 6px 30px rgba(0,0,0,0.6)",
  };
  return (
    <AbsoluteFill style={{ background: palette.ink }}>
      <AbsoluteFill style={{ transform: `translateY(${-lift}px)` }}>
        <Shot file={shot} focusX={focusX} />
      </AbsoluteFill>
      {/* darker lower half so the headline reads on any illustration */}
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 38%, rgba(0,0,0,0.78) 70%, rgba(0,0,0,0.9) 100%)" }} />
      {/* everything important sits inside the centered 4:5 area (y 285 to 1635) that survives the profile-grid crop */}
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 330, textAlign: "left" }}>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, letterSpacing: 7, color: accent, marginBottom: 26 }}>{kicker}</div>
        {lead.map((l) => (
          <div key={l} style={{ ...head, color: palette.cream, whiteSpace: "nowrap" }}>{l}</div>
        ))}
        <div style={{ ...head, color: accent }}>{accentWord}</div>
        <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 52, lineHeight: 1.2, color: palette.cream, marginTop: 34, opacity: 0.92 }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Thumbnail: React.FC<Props> = (p) => (
  <SeriesProvider series={p.series}>
    <Cover {...p} />
  </SeriesProvider>
);

export const thumbA: Props = {
  series: "a",
  shot: "A01_S02",
  kicker: "FOUNDER MODE · PART 1",
  lead: ["EVERY DAY", "COSTS"],
  accentWord: "MONEY",
  size: 150,
  lift: 90,
  sub: "$50,000. One idea. Your call.",
};

export const thumbB: Props = {
  series: "b",
  shot: "B01_S09",
  kicker: "DAY ZERO · PART 1",
  lead: ["NOBODY IS"],
  accentWord: "COMING",
  sub: "12 bottles. 30 days. Your call.",
};
