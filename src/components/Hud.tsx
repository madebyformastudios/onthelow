import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, palette, useSafe, useSeries } from "../theme";
import { Change, ValueFormat, formatValue, isChanging, valueAt } from "../format";
import { useEnter } from "../motion";

export type HudState = {
  hud: { key: string; label: string; value: number | null; format: ValueFormat }[];
};

type Props = {
  /** Contents of production/state-*.json */
  state: HudState;
  /** Per HUD key: when the value changes (seconds in the Sequence) and to what. */
  changes?: Record<string, Change[]>;
  /** Per HUD key: value above which the number turns accent colored. */
  hotAbove?: Record<string, number>;
  /** Small accent label under the first box, e.g. "PROBLEM 1" or "DAY 3". */
  tag?: string;
  /** Episode mode: time windows (seconds) in which the HUD is visible. Omit to show it from the start. */
  windows?: [number, number][];
  /** Episode mode: tag text per time window. */
  tags?: { text: string; from: number; to: number }[];
};

export const Hud: React.FC<Props> = ({ state, changes = {}, hotAbove = {}, tag: tagProp, windows, tags }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { accent } = useSeries();
  const safe = useSafe();
  const t = frame / fps;
  const enterSpring = useEnter(0, { damping: 200 });
  const enter = windows
    ? Math.max(0, ...windows.map(([a, b]) => Math.min(1, Math.max(0, (t - a) / 0.3), Math.max(0, (b - t) / 0.3))))
    : enterSpring;
  const tag = tagProp ?? tags?.find((x) => t >= x.from && t < x.to)?.text;

  return (
    <div
      style={{
        position: "absolute",
        top: safe?.hudTop ?? 190,
        left: safe?.side ?? 40,
        right: safe?.side ?? 40,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -20}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        {state.hud.map((f) => {
          const ch = changes[f.key] ?? [];
          const v = valueAt(f.value, ch, t);
          const hot = v !== null && f.key in hotAbove && v > hotAbove[f.key];
          const color = hot || isChanging(ch, t) ? accent : palette.white;
          const live = ch.find((c) => t >= c.at && t < c.at + (c.over ?? 1));
          const pulse = live ? 1 + 0.06 * Math.sin((Math.PI * (t - live.at)) / (live.over ?? 1)) : 1;
          return (
            <div
              key={f.key}
              style={{
                flex: f.format === "usd" ? 1.45 : 1,
                background: palette.hud,
                borderRadius: 22,
                padding: "16px 22px 18px",
                transform: `scale(${pulse})`,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontWeight: 500,
                  fontSize: 22,
                  letterSpacing: 2,
                  color: palette.grey,
                }}
              >
                {f.label}
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontWeight: 700,
                  fontSize: 44,
                  color,
                  marginTop: 4,
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {formatValue(v, f.format)}
              </div>
            </div>
          );
        })}
      </div>
      {tag ? (
        <div
          style={{
            display: "inline-block",
            marginTop: 14,
            padding: "6px 14px",
            borderRadius: 8,
            background: accent,
            color: palette.ink,
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 2,
          }}
        >
          {tag}
        </div>
      ) : null}
    </div>
  );
};
