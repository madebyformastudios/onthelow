import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { FPS } from "./theme";
import type { Word } from "./components/Subtitles";

export type TWord = { w: string; start: number; end: number };
export type Beat = { id: string; start: number; end: number; words: TWord[] };
export type Timing = { duration: number; audio: string; beats: Beat[] };

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9-]/g, "");

/** Beat lookup, word-anchored times, subtitle words and the music fade for one episode's timing.json. */
export const createTimeline = (timing: Timing, accentWords: RegExp) => {
  const B = Object.fromEntries(timing.beats.map((b) => [b.id, b])) as Record<string, Beat>;

  /** Absolute start (s) of the nth occurrence of `word` in a beat. Re-run align-timing.py and everything follows the voice-over. */
  const at = (id: string, word: string, nth = 1) => {
    const hit = B[id].words.filter((x) => norm(x.w) === norm(word))[nth - 1];
    if (!hit) throw new Error(`word "${word}" #${nth} not found in beat ${id}`);
    return hit.start;
  };

  const subtitleWords: Word[] = timing.beats.flatMap((b) =>
    b.words.map((x) => ({ ...x, accent: accentWords.test(norm(x.w)) })),
  );

  const musicVolume = (f: number) =>
    0.2 *
    interpolate(f, [0, 2 * FPS, (timing.duration - 4) * FPS, timing.duration * FPS], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return { B, at, subtitleWords, musicVolume };
};

/** One-shot sound effect at an absolute time (seconds). */
export const Sfx: React.FC<{ at: number; src: "thud" | "whoosh" | "stamp" | "tap" | "knock"; volume?: number }> = ({
  at: t,
  src,
  volume = 0.4,
}) => (
  <Sequence from={Math.round(t * FPS)} durationInFrames={Math.round(3 * FPS)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);
