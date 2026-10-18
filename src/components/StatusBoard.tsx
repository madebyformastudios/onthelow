import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts, palette, useSeries } from "../theme";
import { Pop } from "../motion";

export type StatusRow = {
  label: string;
  value: string;
  /** 0..100: draws a thin accent progress bar under the value. */
  bar?: number;
};

/** Cream status board that replaces the HUD on the "DAY 3" beat. */
export const StatusBoard: React.FC<{ kicker: string; rows: StatusRow[] }> = ({ kicker, rows }) => {
  const { accent } = useSeries();
  return (
    <AbsoluteFill style={{ background: palette.cream, backgroundImage: "linear-gradient(rgba(11,11,12,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,11,12,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }}>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center" }}>
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
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px", gap: 54 }}>
        {rows.map((r, i) => (
          <Pop key={r.label} at={0.3 + i * 0.25} y={30}>
            <div
              style={{
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: 4,
                color: palette.grey,
              }}
            >
              {r.label}
            </div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontWeight: 900,
                fontSize: 104,
                letterSpacing: -4,
                color: palette.ink,
                borderBottom: "2px solid rgba(11,11,12,0.15)",
                paddingBottom: 14,
              }}
            >
              {r.value}
            </div>
            {r.bar !== undefined ? (
              <div style={{ height: 12, marginTop: 14, background: "rgba(11,11,12,0.12)", borderRadius: 6 }}>
                <div
                  style={{
                    width: `${r.bar}%`,
                    height: "100%",
                    borderRadius: 6,
                    background: accent,
                    border: `2px solid ${palette.ink}`,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ) : null}
          </Pop>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
