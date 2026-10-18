import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, palette, useSeries, easeOut } from "../theme";
import { Pop, useEnter } from "../motion";
import { Change, ValueFormat, formatValue, valueAt } from "../format";

/** Cream infographic board: mono kicker on top, optional source at the bottom, children are the build. */
export const InfographicBoard: React.FC<{
  kicker: string;
  source?: string;
  /** Distance of the kicker from the top (px); push it below the HUD when the HUD is visible. */
  kickerTop?: number;
  children: React.ReactNode;
}> = ({ kicker, source, kickerTop = 200, children }) => {
  return (
    <AbsoluteFill style={{ background: palette.cream, backgroundImage: "linear-gradient(rgba(11,11,12,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,11,12,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }}>
      <div style={{ position: "absolute", top: kickerTop, left: 0, right: 0, textAlign: "center" }}>
        <Pop y={16}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontWeight: 500,
              fontSize: 34,
              letterSpacing: 6,
              color: palette.grey,
            }}
          >
            {kicker}
          </div>
        </Pop>
      </div>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", padding: "0 80px", gap: 40 }}
      >
        {children}
      </AbsoluteFill>
      {source ? (
        <div
          style={{
            position: "absolute",
            bottom: 400,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: fonts.mono,
            fontSize: 24,
            color: palette.grey,
          }}
        >
          {source}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Big number or phrase. `accentWord` gets an accent highlight block (accent text on cream is too faint). */
export const BigText: React.FC<{
  text: string;
  accentWord?: string;
  size?: number;
  at?: number;
}> = ({ text, accentWord, size = 120, at = 0 }) => {
  const { accent } = useSeries();
  return (
    <Pop at={at}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 900,
          fontSize: size,
          letterSpacing: -5,
          lineHeight: 0.95,
          color: palette.ink,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {text}
        {accentWord ? (
          <span style={{ background: accent, borderRadius: 16, padding: "0 18px", marginLeft: 20 }}>{accentWord}</span>
        ) : null}
      </div>
    </Pop>
  );
};

/** Number that counts from `from` to `to` starting at `at` seconds. */
export const CountUp: React.FC<{
  from: number;
  to: number;
  at?: number;
  over?: number;
  format: ValueFormat;
  size?: number;
}> = ({ from, to, at = 0, over = 1, format, size = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const changes: Change[] = [{ at, value: to, over }];
  const v = valueAt(from, changes, frame / fps);
  const p = useEnter(at - 0.2);
  return (
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -5,
        color: palette.ink,
        fontVariantNumeric: "tabular-nums",
        opacity: Math.min(1, p),
      }}
    >
      {formatValue(v, format)}
    </div>
  );
};

/** Horizontal bar that grows to `value / max` starting at `at` seconds. */
export const BarRow: React.FC<{
  label: string;
  value: number;
  max: number;
  display: string;
  at?: number;
  accent?: boolean;
}> = ({ label, value, max, display, at = 0, accent: isAccent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { accent } = useSeries();
  const grow = interpolate(frame / fps, [at, at + 0.6], [0, value / max], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Pop at={at} y={24} style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 2,
          color: palette.ink,
          marginBottom: 10,
        }}
      >
        <span>{label}</span>
        <span>{display}</span>
      </div>
      <div style={{ height: 40, borderRadius: 10, background: "rgba(11,11,12,0.12)" }}>
        <div
          style={{
            width: `${grow * 100}%`,
            height: "100%",
            borderRadius: 10,
            background: isAccent ? accent : palette.ink,
            border: isAccent ? `3px solid ${palette.ink}` : undefined,
            boxSizing: "border-box",
          }}
        />
      </div>
    </Pop>
  );
};
