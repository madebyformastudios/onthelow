import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, palette, springs, useSeries } from "../theme";
import { Pop, useEnter } from "../motion";
import { useAbsTime } from "./Layer";
import { Change, ValueFormat, formatValue, valueAt } from "../format";

const mono = (size: number, color: string): React.CSSProperties => ({
  fontFamily: fonts.mono,
  fontWeight: 700,
  fontSize: size,
  letterSpacing: 4,
  color,
});

/** Small accent tag on an illustration, e.g. "#1 REASON STARTUPS DIE · NO MARKET NEED". */
export const LabelTag: React.FC<{ text: string; top?: number }> = ({ text, top = 420 }) => {
  const { accent } = useSeries();
  return (
    <div style={{ position: "absolute", top, left: 40, right: 40 }}>
      <Pop y={20}>
        <span
          style={{
            ...mono(28, palette.ink),
            display: "inline-block",
            background: accent,
            padding: "10px 18px",
            borderRadius: 8,
            lineHeight: 1.25,
          }}
        >
          {text}
        </span>
      </Pop>
    </div>
  );
};

/** Small grey source line near the bottom. */
export const SourceNote: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", bottom: 330, left: 0, right: 0, textAlign: "center" }}>
    <Pop y={10}>
      <span style={{ ...mono(24, "rgba(255,255,255,0.7)"), letterSpacing: 2, fontWeight: 500 }}>{text}</span>
    </Pop>
  </div>
);

/** Rubber stamp that slams in. */
export const Stamp: React.FC<{ text: string; at?: number }> = ({ text, at = 0 }) => {
  const { accent } = useSeries();
  const p = useEnter(at, { damping: 10, stiffness: 200, mass: 0.6 });
  return (
    <div
      style={{
        display: "inline-block",
        border: `8px solid ${accent}`,
        borderRadius: 14,
        padding: "10px 34px",
        color: accent,
        fontFamily: fonts.sans,
        fontWeight: 900,
        fontSize: 84,
        letterSpacing: 2,
        opacity: Math.min(1, p * 1.5),
        transform: `rotate(-7deg) scale(${1.7 - 0.7 * Math.min(p, 1.05)})`,
      }}
    >
      {text}
    </div>
  );
};

/** Big concept name over a darkened illustration (children), with a subline and a stamp. */
export const ConceptCard: React.FC<{
  lines: string[];
  sub: string;
  stamp: string;
  stampAt: number;
  /** Seconds after the card appears at which the subline shows. */
  subAt?: number;
  /** Headline size in px. */
  size?: number;
  /** Small mono source line under the subline, shown at `smallAt` seconds after the card appears. */
  small?: string;
  smallAt?: number;
  children?: React.ReactNode;
}> = ({ lines, sub, stamp, stampAt, subAt = 0.35, size = 190, small, smallAt = 0, children }) => {
  const { accent } = useSeries();
  return (
    <AbsoluteFill style={{ background: palette.warmInk }}>
      <AbsoluteFill style={{ filter: "blur(10px) brightness(0.35)", transform: "scale(1.1)" }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 70px" }}>
        {lines.map((l, i) => (
          <Pop key={l} at={i * 0.12}>
            <div style={{ fontFamily: fonts.sans, fontWeight: 900, fontSize: size, letterSpacing: -6, lineHeight: 0.95, color: accent }}>
              {l}
            </div>
          </Pop>
        ))}
        <Pop at={subAt} style={{ marginTop: 44 }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 52, lineHeight: 1.2, color: palette.cream }}>{sub}</div>
        </Pop>
        {small ? (
          <Pop at={smallAt} y={10} style={{ marginTop: 26 }}>
            <div style={{ ...mono(26, palette.grey), fontWeight: 500 }}>{small}</div>
          </Pop>
        ) : null}
        <div style={{ marginTop: 60 }}>
          <Stamp text={stamp} at={stampAt} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Counter badge ("YES: 47") that counts up. */
export const CountBadge: React.FC<{
  label: string;
  to: number;
  at?: number;
  over?: number;
  top?: number;
  /** Omit for a plain integer. */
  format?: ValueFormat;
}> = ({ label, to, at = 0, over = 1.5, top = 470, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const changes: Change[] = [{ at, value: to, over }];
  const v = Math.round(valueAt(0, changes, frame / fps) ?? 0);
  return (
    <div style={{ position: "absolute", top, right: 40 }}>
      <Pop y={20}>
        <div
          style={{
            background: "rgba(243,234,211,0.92)",
            borderRadius: 20,
            padding: "14px 30px",
            fontFamily: fonts.sans,
            fontWeight: 900,
            fontSize: 76,
            letterSpacing: -2,
            color: palette.ink,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {label}: {format ? formatValue(v, format) : v}
        </div>
      </Pop>
    </div>
  );
};

/** Email / notification card laid over an illustration. */
export const NoticeCard: React.FC<{ kicker: string; text: string; top: number; mark?: boolean }> = ({
  kicker,
  text,
  top,
  mark,
}) => {
  const { accent } = useSeries();
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60 }}>
      <Pop y={30}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            background: "rgba(243,234,211,0.96)",
            borderRadius: 28,
            padding: "28px 34px",
            boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
          }}
        >
          {mark ? <div style={{ width: 84, height: 84, borderRadius: 20, background: accent, border: `4px solid ${palette.ink}`, flex: "none" }} /> : null}
          <div>
            <div style={{ ...mono(24, palette.grey), fontWeight: 500, marginBottom: 6 }}>{kicker}</div>
            <div style={{ fontFamily: fonts.sans, fontWeight: 900, fontSize: 54, letterSpacing: -1, lineHeight: 1.1, color: palette.ink }}>{text}</div>
          </div>
        </div>
      </Pop>
    </div>
  );
};

/** Tear-off calendar page with a big number. */
export const Calendar: React.FC<{ big: string; unit: string }> = ({ big, unit }) => {
  const p = useEnter(0, springs.pop);
  return (
    <div
      style={{
        width: 560,
        borderRadius: 30,
        background: palette.white,
        border: `6px solid ${palette.ink}`,
        boxShadow: "0 24px 0 rgba(11,11,12,0.15)",
        overflow: "hidden",
        textAlign: "center",
        opacity: Math.min(1, p),
        transform: `rotate(${-5 + (1 - p) * 8}deg) scale(${0.85 + 0.15 * p})`,
      }}
    >
      <div style={{ background: palette.ink, height: 74 }} />
      <div style={{ fontFamily: fonts.sans, fontWeight: 900, fontSize: 300, letterSpacing: -10, lineHeight: 1.05, color: palette.ink }}>{big}</div>
      <div style={{ ...mono(40, palette.grey), paddingBottom: 36 }}>{unit}</div>
    </div>
  );
};

/** Grid of YES pills that turn grey one by one starting at `greyAt` seconds. */
export const YesGrid: React.FC<{ count: number; greyAt: number; step?: number }> = ({ count, greyAt, step = 0.07 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { accent } = useSeries();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: palette.warmInk, alignItems: "center", justifyContent: "center" }}>
      <Pop y={20}>
        <div style={{ ...mono(30, palette.grey), textAlign: "center", marginBottom: 40 }}>{count} YESES</div>
      </Pop>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, width: 960 }}>
        {Array.from({ length: count }).map((_, i) => {
          const grey = t >= greyAt + i * step;
          const born = Math.min(1, Math.max(0, (t - 0.25 - i * 0.02) / 0.18));
          return (
            <div
              key={i}
              style={{
                opacity: born,
                transform: `scale(${0.7 + 0.3 * born})`,
                borderRadius: 14,
                padding: "16px 0",
                textAlign: "center",
                background: grey ? "#3a3733" : accent,
                color: grey ? "#7a756c" : palette.ink,
                fontFamily: fonts.sans,
                fontWeight: 900,
                fontSize: 36,
              }}
            >
              YES
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Jerrycan with a label inside. */
export const Jerrycan: React.FC<{ label: string }> = ({ label }) => {
  const { accent } = useSeries();
  const p = useEnter(0, springs.pop);
  return (
    <div style={{ position: "relative", width: 340, height: 420, opacity: Math.min(1, p), transform: `scale(${0.85 + 0.15 * p})` }}>
      <div style={{ position: "absolute", left: 20, top: 0, width: 150, height: 90, border: `12px solid ${palette.ink}`, borderBottom: "none", borderRadius: "40px 40px 0 0" }} />
      <div style={{ position: "absolute", right: 36, top: 8, width: 70, height: 56, background: palette.ink, borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, bottom: 0, background: accent, border: `10px solid ${palette.ink}`, borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.sans, fontWeight: 900, fontSize: 110, letterSpacing: -3, color: palette.ink }}>
        {label}
      </div>
    </div>
  );
};

/** Row of small bottles that pop in one by one. */
export const BottleRow: React.FC<{ count: number; perRow?: number; step?: number }> = ({ count, perRow = 6, step = 0.08 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { accent } = useSeries();
  const t = frame / fps;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${perRow}, 1fr)`, gap: "22px 26px" }}>
      {Array.from({ length: count }).map((_, i) => {
        const born = Math.min(1, Math.max(0, (t - i * step) / 0.2));
        return (
          <div key={i} style={{ opacity: born, transform: `translateY(${(1 - born) * 20}px)`, textAlign: "center" }}>
            <div style={{ width: 30, height: 20, margin: "0 auto", background: accent, border: `4px solid ${palette.ink}`, borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
            <div style={{ width: 70, height: 150, border: `6px solid ${palette.ink}`, borderRadius: 18, background: "rgba(11,11,12,0.18)" }} />
          </div>
        );
      })}
    </div>
  );
};

/** Grid of squares that fills with the accent color over `over` seconds. */
export const FillGrid: React.FC<{ cols: number; rows: number; over: number }> = ({ cols, rows, over }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { accent } = useSeries();
  const filled = Math.min(1, frame / fps / over) * cols * rows;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, width: 900 }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} style={{ aspectRatio: "1", borderRadius: 8, background: i < filled ? accent : "rgba(11,11,12,0.12)", border: `3px solid ${i < filled ? palette.ink : "transparent"}`, boxSizing: "border-box" }} />
      ))}
    </div>
  );
};

/** Camera shake on impulses at the given absolute times (seconds), e.g. knocks on a door. */
export const Shake: React.FC<{ times: number[]; children: React.ReactNode }> = ({ times, children }) => {
  const t = useAbsTime();
  let x = 0;
  let y = 0;
  for (const k of times) {
    if (t < k) continue;
    const d = t - k;
    x += 16 * Math.exp(-d * 9) * Math.sin(d * 70);
    y += 10 * Math.exp(-d * 9) * Math.cos(d * 55);
  }
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>{children}</AbsoluteFill>;
};
