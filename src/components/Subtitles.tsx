import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, palette, useSeries } from "../theme";
import { useEnter } from "../motion";

export type Word = { w: string; start: number; end: number; accent?: boolean };

type Props = { words: Word[]; maxWords?: number; windows?: [number, number][] };

const group = (words: Word[], maxWords: number) => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= maxWords || /[.?!,]$/.test(w.w)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
};

/** Word-by-word subtitles: 1 to 3 words at a time, active word white, the rest grey. Times in seconds. */
export const Subtitles: React.FC<Props> = ({ words, maxWords = 3, windows }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { accent } = useSeries();
  const t = frame / fps;

  const chunks = React.useMemo(() => group(words, maxWords), [words, maxWords]);
  const idx = chunks.findIndex((c, i) => {
    const next = chunks[i + 1];
    return t >= c[0].start && (next ? t < next[0].start : t < c[c.length - 1].end + 0.4);
  });
  const chunk = idx >= 0 ? chunks[idx] : null;
  const p = useEnter(chunk ? chunk[0].start : 0, { damping: 18, stiffness: 220, mass: 0.5 });
  if (!chunk || (windows && !windows.some(([a, b]) => t >= a && t < b))) return null;

  const active = chunk.reduce((a, w, i) => (t >= w.start ? i : a), 0);

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 430,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0 18px",
        opacity: Math.min(1, p),
        transform: `translateY(${(1 - p) * 18}px)`,
        fontFamily: fonts.sans,
        fontWeight: 900,
        fontSize: 64,
        letterSpacing: -1,
        textShadow: "0 3px 14px rgba(0,0,0,0.7)",
      }}
    >
      {chunk.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            transform: i === active ? `scale(${1 + 0.1 * Math.max(0, 1 - (t - w.start) / 0.16)})` : undefined,
            color: i === active ? (w.accent ? accent : palette.white) : "rgba(255,255,255,0.45)",
          }}
        >
          {w.w}
        </span>
      ))}
    </div>
  );
};
