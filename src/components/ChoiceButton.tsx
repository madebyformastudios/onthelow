import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, palette, useSeries } from "../theme";
import { useEnter } from "../motion";

/** Choice word as a button. `ghost` is the neutral option, `accent` the series-colored one. */
export const ChoiceButton: React.FC<{
  label: string;
  variant?: "ghost" | "accent";
  at?: number;
  /** Fixed size for the big single-button beat; omit inside a row. */
  large?: boolean;
}> = ({ label, variant = "accent", at = 0, large }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { accent } = useSeries();
  const p = useEnter(at);
  const breathe = 1 + 0.015 * Math.sin((frame / fps) * Math.PI * 2 * 0.8);
  return (
    <div
      style={{
        flex: large ? undefined : 1,
        minWidth: large ? 520 : undefined,
        padding: large ? "44px 90px" : "36px 20px",
        borderRadius: 28,
        textAlign: "center",
        background: variant === "accent" ? accent : "#B9B3A6",
        color: palette.ink,
        fontFamily: fonts.sans,
        fontWeight: 900,
        fontSize: large ? 120 : 76,
        letterSpacing: -2,
        opacity: Math.min(1, p),
        transform: `translateY(${(1 - p) * 40}px) scale(${(0.9 + 0.1 * p) * breathe})`,
      }}
    >
      {label}
    </div>
  );
};
