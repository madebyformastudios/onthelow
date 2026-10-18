import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts, palette, useSafe, useSeries } from "../theme";
import { Pop } from "../motion";

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const safe = useSafe();
  return (
    <AbsoluteFill
      style={{
        background: palette.warmInk,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: safe ? `0 ${safe.rightBand}px 0 ${safe.side}px` : "0 80px",
        
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; at?: number }> = ({
  children,
  color,
  at = 0,
}) => {
  const { accent } = useSeries();
  return (
    <Pop at={at} y={20}>
      <div
        style={{
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 6,
          color: color ?? accent,
          marginBottom: 36,
        }}
      >
        {children}
      </div>
    </Pop>
  );
};

const big: React.CSSProperties = {
  fontFamily: fonts.sans,
  fontWeight: 900,
  letterSpacing: -4,
  lineHeight: 0.98,
  color: palette.cream,
};

/** Black title card: small kicker above, one accent word. */
export const TitleCard: React.FC<{ kicker: string; lead: string; accentWord: string }> = ({
  kicker,
  lead,
  accentWord,
}) => {
  const { accent } = useSeries();
  return (
    <Frame>
      <Kicker color={palette.grey}>{kicker}</Kicker>
      <Pop at={0.1}>
        <div style={{ ...big, fontSize: 130 }}>{lead}</div>
      </Pop>
      <Pop at={0.3}>
        <div style={{ ...big, fontSize: 190, color: accent }}>{accentWord}</div>
      </Pop>
      <Pop at={0.55} y={0} style={{ marginTop: 34 }}>
        <div style={{ width: 240, height: 10, borderRadius: 5, background: accent }} />
      </Pop>
    </Frame>
  );
};

/** Black rule card: small "RULE 1" kicker, one sentence. */
export const RuleCard: React.FC<{ rule: number; text: string }> = ({ rule, text }) => (
  <Frame>
    <Kicker>{`RULE ${rule}`}</Kicker>
    <Pop at={0.15}>
      <div style={{ ...big, fontSize: 112 }}>{text}</div>
    </Pop>
  </Frame>
);

/** Black day card: "DAY 2". */
export const DayCard: React.FC<{ day: number }> = ({ day }) => (
  <Frame>
    <Pop at={0}>
      <div style={{ ...big, fontSize: 220, letterSpacing: -6 }}>{`DAY ${day}`}</div>
    </Pop>
  </Frame>
);
