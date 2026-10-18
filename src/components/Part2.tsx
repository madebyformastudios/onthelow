import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, palette, useSeries } from "../theme";
import { Pop } from "../motion";
import { Change, valueAt } from "../format";
import { BarRow } from "./Board";

/** "Part 1 · you voted" recap over an illustration: the winning word, no made-up percentages. */
export const VoteTag: React.FC<{ word: string }> = ({ word }) => {
  const { accent } = useSeries();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Pop y={30}>
        <div style={{ background: "rgba(243,234,211,0.96)", borderRadius: 32, padding: "34px 70px 40px", textAlign: "center", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 500, fontSize: 28, letterSpacing: 5, color: palette.grey }}>PART 1 · YOU VOTED</div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 900, fontSize: 150, letterSpacing: -5, lineHeight: 1.05, color: palette.ink, marginTop: 8 }}>
            <span style={{ background: accent, borderRadius: 16, padding: "0 22px" }}>{word}</span>
          </div>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: palette.ink, marginTop: 14 }}>THE MAJORITY PICKED</div>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

/** Counter that moves from `from` to `to` starting at `at` seconds (Layer-relative), e.g. a waitlist losing people. */
export const Ticker: React.FC<{ label: string; from: number; to: number; at?: number; over?: number; top?: number }> = ({
  label, from, to, at = 0, over = 1.5, top = 520,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const changes: Change[] = [{ at, value: to, over }];
  const v = Math.round(valueAt(from, changes, frame / fps) ?? from);
  const down = to < from;
  const { accent } = useSeries();
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60 }}>
      <Pop y={30}>
        <div style={{ background: "rgba(243,234,211,0.96)", borderRadius: 28, padding: "26px 40px", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: palette.grey }}>{label}</div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 900, fontSize: 120, letterSpacing: -4, lineHeight: 1.05, color: palette.ink, fontVariantNumeric: "tabular-nums", marginTop: 12 }}>
            <span style={{ background: v !== from && down ? "#FF5A4F" : v !== from ? accent : "transparent", borderRadius: 12, padding: "0 14px", marginLeft: -14 }}>{v}</span>
          </div>
        </div>
      </Pop>
    </div>
  );
};

/** Two bars on a cream panel over an illustration, e.g. days until someone ships. */
export const VersusBars: React.FC<{ rows: { label: string; value: number; display: string; accent?: boolean }[]; max: number; top?: number }> = ({ rows, max, top = 520 }) => (
  <div style={{ position: "absolute", top, left: 60, right: 60 }}>
    <Pop y={30}>
      <div style={{ background: "rgba(243,234,211,0.96)", borderRadius: 28, padding: "34px 40px 40px", boxShadow: "0 14px 40px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", gap: 28 }}>
        {rows.map((r, i) => (
          <BarRow key={r.label} label={r.label} value={r.value} max={max} display={r.display} at={0.2 + i * 0.35} accent={r.accent} />
        ))}
      </div>
    </Pop>
  </div>
);
