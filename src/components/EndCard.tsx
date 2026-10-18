import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts, palette, useSafe, useSeries } from "../theme";
import { Pop } from "../motion";
import { ChoiceButton } from "./ChoiceButton";

/** End card over a blurred, darkened illustration (children). Two choice buttons at the bottom. */
export const EndCard: React.FC<{
  nextPart: number;
  lines: [string, string];
  options: [string, string];
  children?: React.ReactNode;
}> = ({ nextPart, lines, options, children }) => {
  const { accent, tagline } = useSeries();
  const safe = useSafe();
  return (
    <AbsoluteFill style={{ background: palette.warmInk, }}>
      <AbsoluteFill style={{ filter: "blur(18px) brightness(0.5)", transform: "scale(1.12)" }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: safe ? `0 ${safe.rightBand}px 0 ${safe.side}px` : "0 70px", textAlign: "center" }}>
        <Pop y={16}>
          <div style={{ fontFamily: fonts.mono, fontSize: 26, letterSpacing: 6, color: "rgba(255,255,255,0.6)", marginBottom: 30 }}>
            {tagline.toUpperCase()}
          </div>
        </Pop>
        <Pop at={0.1}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 900, fontSize: 150, letterSpacing: -5, lineHeight: 0.95, color: palette.white }}>
            {`PART ${nextPart}`}
          </div>
        </Pop>
        <Pop at={0.25}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 900, fontSize: 150, letterSpacing: -5, lineHeight: 0.95, color: accent }}>
            TOMORROW
          </div>
        </Pop>
        <Pop at={0.45} style={{ marginTop: 44 }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 52, lineHeight: 1.15, color: palette.white }}>
            {lines[0]}
            <br />
            {lines[1]}
          </div>
        </Pop>
        <Pop at={0.65} style={{ marginTop: 70 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 26, letterSpacing: 6, color: "rgba(255,255,255,0.6)" }}>
            COMMENT ONE WORD
          </div>
        </Pop>
        <div style={{ display: "flex", gap: 24, width: "100%", marginTop: 28 }}>
          <ChoiceButton label={options[0]} variant="ghost" at={0.8} />
          <ChoiceButton label={options[1]} variant="accent" at={0.95} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
