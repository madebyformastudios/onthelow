import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SeriesProvider, palette } from "./theme";
import { Sfx, Timing, createTimeline } from "./episodeKit";
import { Layer, Phase } from "./components/Layer";
import { Shot } from "./components/Shot";
import { Hud, HudState } from "./components/Hud";
import { Subtitles } from "./components/Subtitles";
import { DayCard, RuleCard, TitleCard } from "./components/Cards";
import { BarRow, BigText, CountUp, InfographicBoard } from "./components/Board";
import { StatusBoard } from "./components/StatusBoard";
import { EndCard } from "./components/EndCard";
import { ChoiceButton } from "./components/ChoiceButton";
import { BottleRow, ConceptCard, FillGrid, Jerrycan, LabelTag, Shake } from "./components/Extras";
import stateB from "../production/state-b.json";
import timing from "../episodes/b-part-1/timing.json";

const { B, at, subtitleWords, musicVolume } = createTimeline(
  timing as Timing,
  /^(water|ration|never|knocks|dizzy|stay|go|coming|nobody)$/,
);

export const EPISODE_B1_SECONDS = timing.duration;

// Shot cuts land on the sentence they illustrate.
const hookRadioEnd = at("hook", "you're"); // radio while the broadcast is described
const hookDoor = at("hook", "and"); // "And the hard part? It starts now,"
const p2Cut1 = at("p2", "and"); // "And it goes wrong long before that."
const p2Cut2 = at("p2", "lose"); // "Lose just two percent..."

const tTwo = at("d2a", "two", 2); // "Two liters a day for all four of you."
const tEighteen = at("d2a", "eighteen");
const dayCardEnd = at("d2a", "you");
const tMorning = at("d2a", "morning");
const tNever = at("d2b", "never");
const tBecause = at("d2b", "because");
const tMara = at("d2b", "mara");
const knock0 = at("d2c", "three", 2); // "Three times."
const knocks = [knock0, knock0 + 0.5, knock0 + 1.0];
const tThen = at("d2c", "then");
const tEleven = at("d3", "eleven");
const tUpstairs = at("temptation", "upstairs");
const tBut = at("temptation", "but");
const tGo = at("temptation", "go");

const subtitleWindows: [number, number][] = [
  [B.hook.start, B.hook.end],
  [B.p2.start, B.p2.end],
  [dayCardEnd, tTwo],
  [B.d2b.start, B.d2c.end],
  [B.temptation.start, B.temptation.end],
];

const hudWindows: [number, number][] = [
  [B.p2.start + 0.2, B.rule.start],
  [dayCardEnd, tTwo],
  [B.d2b.start, B.d3.start],
  [B.temptation.start, B.end.start],
];

const hudTags = [
  { text: "PROBLEM 2", from: B.p2.start, to: B.rule.start },
  { text: "DAY 2", from: dayCardEnd, to: B.d3.start },
  { text: "DAY 3", from: B.temptation.start, to: B.end.start },
];

const hudChanges = {
  water: [{ at: tEleven, value: 11, over: 0.8 }],
  morale: [{ at: at("d2b", "dizzy"), value: 55, over: 1.4 }],
  danger: [
    { at: knocks[0], value: 12, over: 0.3 },
    { at: knocks[1], value: 24, over: 0.3 },
    { at: knocks[2], value: 35, over: 0.3 },
  ],
};

export const EpisodeB1: React.FC = () => (
  <SeriesProvider series="b">
    <AbsoluteFill style={{ background: palette.ink }}>
      <Audio src={staticFile(timing.audio)} />
      <Audio src={staticFile("music/mystery.mp3")} volume={musicVolume} />

      {/* Sound design: few, quiet and short */}
      <Sfx at={B.title.start} src="thud" volume={0.25} />
      <Sfx at={B.rule.start} src="thud" volume={0.2} />
      <Sfx at={B.d2a.start} src="thud" volume={0.2} />
      <Sfx at={tNever} src="whoosh" volume={0.12} />
      <Sfx at={at("d2b", "drink")} src="stamp" volume={0.3} />
      {knocks.map((k) => (
        <Sfx key={k} at={k} src="knock" volume={0.35} />
      ))}
      <Sfx at={B.d3.start} src="thud" volume={0.2} />
      <Sfx at={tEleven} src="whoosh" volume={0.1} />
      <Sfx at={B.end.start} src="whoosh" volume={0.1} />

      {/* 1 Hook */}
      <Layer from={B.hook.start} to={hookRadioEnd} fade={0.01}><Shot file="B01_S02" /></Layer>
      <Layer from={hookRadioEnd} to={hookDoor}><Shot file="B01_S01" /></Layer>
      <Layer from={hookDoor} to={B.hook.end}><Shot file="B01_S03" /></Layer>

      {/* 2 Title card */}
      <Layer from={B.title.start} to={B.title.end}>
        <TitleCard kicker="PART 1 · TWELVE BOTTLES" lead="NOBODY IS" accentWord="COMING" />
      </Layer>

      {/* 3 Problem 1: the water maths */}
      <Layer from={B.p1.start} to={B.p1.end}>
        <InfographicBoard kicker="PROBLEM 1 · THE WATER" source="Source: FEMA / Ready.gov">
          <Phase from={at("p1", "gallon")} to={at("p1", "four", 2)}>
            <Jerrycan label="3.8 L" />
          </Phase>
          <Phase from={at("p1", "four", 2)} to={at("p1", "more")}>
            <BigText text="3.8 L × 4 people" size={100} />
            <BigText text="× 30 days" accentWord="" size={130} at={at("p1", "thirty") - at("p1", "four", 2)} />
          </Phase>
          <Phase from={at("p1", "more")} to={at("p1", "twelve")}>
            <FillGrid cols={12} rows={10} over={Math.max(1, at("p1", "twelve") - at("p1", "more") - 0.5)} />
            <CountUp from={0} to={456} at={0} over={Math.max(1, at("p1", "twelve") - at("p1", "more") - 0.5)} format="liters" size={170} />
          </Phase>
          <Phase from={at("p1", "twelve")} to={B.p1.end + 0.4}>
            <BottleRow count={12} />
            <BigText text="18 L" size={170} at={at("p1", "eighteen") - at("p1", "twelve")} />
            <BigText text="=" accentWord="1.2 days" size={110} at={at("p1", "barely") - at("p1", "twelve")} />
          </Phase>
        </InfographicBoard>
      </Layer>

      {/* 4 Problem 2: Theo and the body's deadline */}
      <Layer from={B.p2.start} to={p2Cut1}><Shot file="B01_S04" /></Layer>
      <Layer from={p2Cut1} to={p2Cut2}><Shot file="B01_S05" /></Layer>
      <Layer from={p2Cut2} to={B.p2.end}><Shot file="B01_S06" /></Layer>
      <Layer from={at("p2", "three")} to={B.p2.end} fade={0.25} overlay>
        <LabelTag text="~3 DAYS · WITHOUT WATER" top={430} />
      </Layer>
      <Layer from={at("p2", "two", 2)} to={B.p2.end} fade={0.25} overlay>
        <LabelTag text="2% LOSS · SLOWER THINKING" top={520} />
      </Layer>

      {/* 5 Rule card */}
      <Layer from={B.rule.start} to={B.rule.end}>
        <RuleCard rule={1} text="Water first. Food can wait." />
      </Layer>

      {/* 6a Day 2: the smart move */}
      <Layer from={B.d2a.start} to={tMorning}><Shot file="B01_S07" /></Layer>
      <Layer from={tMorning} to={tTwo}><Shot file="B01_S08" /></Layer>
      <Layer from={B.d2a.start} to={dayCardEnd} fade={0.5} overlay><DayCard day={2} /></Layer>
      <Layer from={tTwo} to={B.d2a.end}>
        <InfographicBoard kicker="DAY 2 · THE RATION">
          <Phase from={tTwo} to={tEighteen}>
            <BigText text="1 cup × 2 × 4" size={120} />
            <BigText text="=" accentWord="2 L/day" size={120} at={0.5} />
          </Phase>
          <Phase from={tEighteen} to={B.d2a.end + 0.4}>
            <BigText text="18 L =" accentWord="9 days" size={130} />
            <div style={{ width: "100%" }}>
              <BarRow label="DAYS OF WATER" value={9} max={9} display="9" at={0.6} accent />
            </div>
            <CountUp from={1} to={9} at={at("d2a", "nine") - tEighteen} over={0.9} format="plain" size={200} />
          </Phase>
        </InfographicBoard>
      </Layer>

      {/* 6b Day 2: the trap */}
      <Layer from={B.d2b.start} to={tNever}><Shot file="B01_S08" /></Layer>
      <Layer from={tNever - 0.1} to={tBecause}>
        <ConceptCard
          lines={["NEVER RATION", "DRINKING", "WATER"]}
          size={140}
          sub="Drink what you need today. Find more for tomorrow."
          subAt={at("d2b", "drink") - (tNever - 0.1)}
          small="FEMA"
          smallAt={at("d2b", "fema's") - (tNever - 0.1)}
          stamp="DON'T"
          stampAt={at("d2b", "drink") + 0.3 - (tNever - 0.1)}
        >
          <Shot file="B01_S08" />
        </ConceptCard>
      </Layer>
      <Layer from={tBecause} to={tMara}><Shot file="B01_S09" /></Layer>
      <Layer from={tMara} to={B.d2b.end}><Shot file="B01_S10" /></Layer>

      {/* 6c Day 2: the threat. Three knocks, the picture shakes on each. */}
      <Layer from={B.d2c.start} to={tThen}>
        <Shake times={knocks}><Shot file="B01_S11" /></Shake>
      </Layer>
      <Layer from={tThen} to={B.d2c.end}><Shot file="B01_S12" /></Layer>

      {/* 7 Day 3 */}
      <Layer from={B.d3.start} to={tEleven}><DayCard day={3} /></Layer>
      <Layer from={tEleven - 0.3} to={B.d3.end}>
        <StatusBoard
          kicker="DAY 3 · WHERE YOU STAND"
          rows={[
            { label: "WATER LEFT", value: "11 L" },
            { label: "DAYS TO GO", value: "27" },
            { label: "MORALE", value: "55%", bar: 55 },
            { label: "DANGER", value: "35%", bar: 35 },
          ]}
        />
      </Layer>

      {/* 8 Temptation and choice */}
      <Layer from={B.temptation.start} to={tUpstairs}><Shot file="B01_S13" /></Layer>
      <Layer from={tUpstairs} to={tBut}><Shot file="B01_S14" /></Layer>
      <Layer from={tBut} to={B.temptation.end}><Shot file="B01_S15" /></Layer>
      <Layer from={at("temptation", "hundred")} to={tBut} fade={0.25} overlay>
        <LabelTag text="~150 L · WATER HEATER" top={430} />
      </Layer>
      <Layer from={tGo} to={B.temptation.end} fade={0.25} overlay>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 640 }}>
          <ChoiceButton label="GO" large />
        </AbsoluteFill>
      </Layer>

      {/* 9 End card over the blurred last illustration */}
      <Layer from={B.end.start} to={B.end.end}>
        <EndCard nextPart={2} lines={["Comment GO or STAY.", "The majority writes Part 2."]} options={["GO", "STAY"]}>
          <Shot file="B01_S15" />
        </EndCard>
      </Layer>

      {/* HUD and subtitles run on the global timeline above all layers */}
      <Hud state={stateB as HudState} changes={hudChanges} hotAbove={{ danger: 5 }} windows={hudWindows} tags={hudTags} />
      <Subtitles words={subtitleWords} windows={subtitleWindows} />
    </AbsoluteFill>
  </SeriesProvider>
);
