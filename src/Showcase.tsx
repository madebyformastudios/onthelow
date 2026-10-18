import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SeriesId, SeriesProvider, FPS, palette } from "./theme";
import { Hud } from "./components/Hud";
import { Subtitles, Word } from "./components/Subtitles";
import { DayCard, RuleCard, TitleCard } from "./components/Cards";
import { BarRow, BigText, CountUp, InfographicBoard } from "./components/Board";
import { StatusBoard } from "./components/StatusBoard";
import { EndCard } from "./components/EndCard";
import { ChoiceButton } from "./components/ChoiceButton";
import stateA from "../production/state-a.json";
import stateB from "../production/state-b.json";
import type { HudState } from "./components/Hud";

const s = (sec: number) => Math.round(sec * FPS);

// Gradient stand-in for an illustration; real Flow images arrive in step 4.
const Placeholder: React.FC<{ glow: string }> = ({ glow }) => (
  <AbsoluteFill
    style={{ background: `radial-gradient(ellipse at 50% 35%, ${glow}55 0%, #1a1410 60%, #0b0b0c 100%)` }}
  />
);

const words = (text: string, t0: number, per = 0.35): Word[] =>
  text.split(" ").map((w, i) => ({ w, start: t0 + i * per, end: t0 + (i + 1) * per, accent: i === 2 }));

const DATA = {
  a: {
    state: stateA as HudState,
    changes: { cash: [{ at: 1, value: 46800, over: 1.5 }], runway: [{ at: 1, value: 100, over: 1.5 }], burnout: [{ at: 1, value: 20, over: 1.5 }] },
    hot: { burnout: 10 },
    tag: "PROBLEM 1",
    title: { kicker: "PART 1 · THE BURN", lead: "EVERY DAY COSTS", accentWord: "MONEY" },
    rule: "Sell it before you build it.",
    board: { kicker: "PROBLEM 1 · THE BURN", big: "$3,200", bigAccent: "a week", bars: [["DEVELOPER", 3200, "$3,200"], ["RENT", 1100, "$1,100"], ["SOFTWARE", 700, "$700"]] as const },
    status: [
      { label: "CASH LEFT", value: "$46,800" },
      { label: "RUNWAY", value: "94 DAYS" },
      { label: "BURNOUT", value: "20%", bar: 20 },
    ],
    sub: "Here's what you don't know.",
    end: { lines: ["Comment BUILD or SELL.", "The majority writes Part 2."] as [string, string], options: ["BUILD", "SELL"] as [string, string] },
    glow: "#B5F23D",
    choice: "BUILD",
  },
  b: {
    state: stateB as HudState,
    changes: { water: [{ at: 1, value: 11, over: 1.5 }], morale: [{ at: 1, value: 55, over: 1.5 }], danger: [{ at: 1, value: 35, over: 1.5 }] },
    hot: { danger: 10 },
    tag: "PROBLEM 1",
    title: { kicker: "PART 1 · TWELVE BOTTLES", lead: "NOBODY IS", accentWord: "COMING" },
    rule: "Water first. Food can wait.",
    board: { kicker: "PROBLEM 1 · THE WATER", big: "456 L", bigAccent: "needed", bars: [["NEEDED", 456, "456 L"], ["YOU HAVE", 18, "18 L"]] as const },
    status: [
      { label: "WATER LEFT", value: "11 L" },
      { label: "DAYS TO GO", value: "27" },
      { label: "MORALE", value: "55%", bar: 55 },
      { label: "DANGER", value: "35%", bar: 35 },
    ],
    sub: "Here's what you don't know.",
    end: { lines: ["Comment GO or STAY.", "The majority writes Part 2."] as [string, string], options: ["GO", "STAY"] as [string, string] },
    glow: "#FF6A1A",
    choice: "GO",
  },
};

export const Showcase: React.FC<{ series: SeriesId }> = ({ series }) => {
  const d = DATA[series];
  return (
    <SeriesProvider series={series}>
      <AbsoluteFill style={{ background: palette.ink }}>
        {/* 0-4 s: illustration + HUD (values count at 1 s) + subtitles */}
        <Sequence from={0} durationInFrames={s(4)}>
          <Placeholder glow={d.glow} />
          <Hud state={d.state} changes={d.changes} hotAbove={d.hot} tag={d.tag} />
          <Subtitles words={words(d.sub, 0.3)} />
        </Sequence>
        <Sequence from={s(4)} durationInFrames={s(3)}>
          <TitleCard {...d.title} />
        </Sequence>
        <Sequence from={s(7)} durationInFrames={s(2)}>
          <RuleCard rule={1} text={d.rule} />
        </Sequence>
        <Sequence from={s(9)} durationInFrames={s(2)}>
          <DayCard day={2} />
        </Sequence>
        <Sequence from={s(11)} durationInFrames={s(4)}>
          <InfographicBoard kicker={d.board.kicker} source="Source: example">
            <BigText text={d.board.big} accentWord={d.board.bigAccent} at={0.3} />
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 34 }}>
              {d.board.bars.map(([label, value, display], i) => (
                <BarRow key={label} label={label} value={value} max={d.board.bars[0][1]} display={display} at={1 + i * 0.3} accent={i === 0} />
              ))}
            </div>
            <CountUp from={0} to={100} at={2} format="days" size={110} />
          </InfographicBoard>
        </Sequence>
        <Sequence from={s(15)} durationInFrames={s(4)}>
          <StatusBoard kicker="DAY 3 · WHERE YOU STAND" rows={d.status} />
        </Sequence>
        <Sequence from={s(19)} durationInFrames={s(2.5)}>
          <Placeholder glow={d.glow} />
          <Hud state={d.state} />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <ChoiceButton label={d.choice} large />
          </AbsoluteFill>
        </Sequence>
        <Sequence from={s(21.5)} durationInFrames={s(5)}>
          <EndCard nextPart={2} lines={d.end.lines} options={d.end.options}>
            <Placeholder glow={d.glow} />
          </EndCard>
        </Sequence>
      </AbsoluteFill>
    </SeriesProvider>
  );
};
