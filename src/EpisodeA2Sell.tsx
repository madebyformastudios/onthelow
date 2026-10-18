import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SeriesProvider, palette } from "./theme";
import { Sfx, Timing, createTimeline } from "./episodeKit";
import { Layer, Phase } from "./components/Layer";
import { Shot } from "./components/Shot";
import { Hud, HudState } from "./components/Hud";
import { Subtitles } from "./components/Subtitles";
import { RuleCard } from "./components/Cards";
import { BigText, InfographicBoard } from "./components/Board";
import { EndCard } from "./components/EndCard";
import { ChoiceButton } from "./components/ChoiceButton";
import { Calendar, ConceptCard, CountBadge, LabelTag, NoticeCard } from "./components/Extras";
import { VoteTag } from "./components/Part2";
import state from "../production/state-a2.json";
import timing from "../episodes/a-part-2-sell/timing.json";

const { B, at, subtitleWords, musicVolume } = createTimeline(
  timing as Timing,
  /^(price|strangers|runway|time|likes|zero|card|refundable|paid|spy|intelligence|free|take|keep)$/,
);

export const EPISODE_A2_SELL_SECONDS = timing.duration;

const tFortynine = at("hook", "forty-nine");
const tMost = at("hook", "most");
const tProblem = at("hook", "problem");
const tBurn = at("burn", "burn");
const tSix = at("burn", "six");
const tVests = at("vest", "vest's");
const tCustomer = at("spy", "customer");
const tJcarter = at("spy", "j.carter");
const tCompetitive = at("spy", "competitive");
const tWell = at("cliff", "we'll");
const tTake = at("cliff", "take");

const subtitleWindows: [number, number][] = [
  [B.hook.start, B.hook.end],
  [B.burn.start, tBurn],
  [B.vest.start, B.vest.end],
  [B.o1.start, B.o1.end],
  [B.o2.start, B.o2.end],
  [B.o3.start, B.o3.end],
  [B.fix.start, B.fix.end],
  [B.results.start, B.results.end],
  [B.spy.start, tCompetitive - 0.2],
  [B.counter.start, B.counter.end],
  [B.cliff.start, B.cliff.end],
];

const hudWindows: [number, number][] = [
  [0.3, B.rule.start],
  [B.fix.start, B.end.start],
];

const hudTags = [
  { text: "PART 2", from: 0, to: tProblem },
  { text: "DAY 4", from: tProblem, to: B.rule.start },
  { text: "DAY 5", from: B.fix.start, to: B.results.start },
  { text: "DAY 8", from: B.results.start, to: B.cliff.start },
  { text: "DAY 9", from: B.cliff.start, to: B.end.start },
];

const hudChanges = {
  cash: [{ at: at("results", "hundred"), value: 46947, over: 1.0 }],
  runway: [{ at: tSix, value: 638, over: 1.4 }],
  burnout: [
    { at: B.o1.start + 1.2, value: 24, over: 0.8 },
    { at: B.o2.start + 0.8, value: 29, over: 0.8 },
    { at: B.o3.start + 0.8, value: 35, over: 0.8 },
    { at: at("spy", "competitors"), value: 41, over: 0.8 },
    { at: at("counter", "free"), value: 48, over: 0.8 },
  ],
};

export const EpisodeA2Sell: React.FC = () => (
  <SeriesProvider series="a">
    <AbsoluteFill style={{ background: palette.ink }}>
      <Audio src={staticFile(timing.audio)} />
      <Audio src={staticFile("music/mystery.mp3")} volume={musicVolume} />

      <Sfx at={tMost} src="whoosh" volume={0.12} />
      <Sfx at={tFortynine} src="tap" volume={0.15} />
      <Sfx at={tSix} src="whoosh" volume={0.1} />
      <Sfx at={B.rule.start} src="thud" volume={0.2} />
      <Sfx at={at("results", "three")} src="tap" volume={0.15} />
      <Sfx at={tCompetitive} src="stamp" volume={0.3} />
      <Sfx at={tWell} src="tap" volume={0.15} />
      <Sfx at={B.end.start} src="whoosh" volume={0.1} />

      {/* 1 Hook */}
      <Layer from={B.hook.start} to={tMost} fade={0.01}><Shot file="A02S_S01" /></Layer>
      <Layer from={tMost} to={tProblem}><Shot file="A02S_S02" /></Layer>
      <Layer from={tProblem} to={B.hook.end}><Shot file="A02S_S03" /></Layer>
      <Layer from={tFortynine} to={tMost} fade={0.25} overlay>
        <NoticeCard kicker="PRICE" text="$49 / month" top={560} />
      </Layer>
      <Layer from={tMost} to={tProblem} fade={0.25} overlay><VoteTag word="SELL" /></Layer>

      {/* 2 Burn drops */}
      <Layer from={B.burn.start} to={tBurn}><Shot file="A02S_S04" /></Layer>
      <Layer from={tBurn} to={B.burn.end}>
        <InfographicBoard kicker="DAY 4 · THE BURN" kickerTop={340}>
          <Phase from={tBurn} to={tSix}>
            <BigText text="$15,000" size={150} />
            <BigText text="↓" size={110} at={0.5} />
            <BigText text="$2,200" accentWord="/ month" size={150} at={at("burn", "twenty-two") - tBurn} />
          </Phase>
          <Phase from={tSix} to={B.burn.end + 0.4}>
            <Calendar big="638" unit="DAYS" />
          </Phase>
        </InfographicBoard>
      </Layer>

      {/* 3 Time, not cash */}
      <Layer from={B.vest.start} to={tVests}><Shot file="A02_V2" /></Layer>
      <Layer from={tVests} to={B.vest.end}><Shot file="A02_V1" /></Layer>
      <Layer from={tVests} to={B.vest.end} fade={0.25} overlay>
        <LabelTag text="THE VEST SHIPS IN 28 DAYS" top={430} />
      </Layer>

      {/* 4 Three options */}
      <Layer from={B.o1.start} to={B.o1.end}><Shot file="A02S_S05" /></Layer>
      <Layer from={B.o1.start} to={B.o1.end} fade={0.25} overlay><LabelTag text="OPTION 1 · POST IT EVERYWHERE" top={430} /></Layer>
      <Layer from={at("o1", "four")} to={B.o1.end} fade={0.25} overlay><CountBadge label="LIKES" to={400} at={0.1} over={1.0} top={560} /></Layer>
      <Layer from={at("o1", "zero")} to={B.o1.end} fade={0.25} overlay><NoticeCard kicker="REVENUE" text="$0" top={760} /></Layer>
      <Layer from={B.o2.start} to={B.o2.end}><Shot file="A02S_S06" /></Layer>
      <Layer from={B.o2.start} to={B.o2.end} fade={0.25} overlay><LabelTag text="OPTION 2 · ASK YOUR FRIENDS AGAIN" top={430} /></Layer>
      <Layer from={B.o3.start} to={B.o3.end}><Shot file="A02S_S07" /></Layer>
      <Layer from={B.o3.start} to={B.o3.end} fade={0.25} overlay><LabelTag text="OPTION 3 · ASK STRANGERS FOR MONEY" top={430} /></Layer>

      {/* 5 Rule */}
      <Layer from={B.rule.start} to={B.rule.end}>
        <RuleCard rule={2} text="A yes only counts if it comes with a credit card." />
      </Layer>

      {/* 6 The test */}
      <Layer from={B.fix.start} to={at("fix", "email")}><Shot file="A02S_S08" /></Layer>
      <Layer from={at("fix", "email")} to={B.fix.end}><Shot file="A02S_S09" /></Layer>
      <Layer from={at("fix", "forty-nine")} to={at("fix", "email")} fade={0.25} overlay>
        <NoticeCard kicker="PRE-ORDER" text="$49 · fully refundable" top={560} />
      </Layer>
      <Layer from={at("fix", "email")} to={B.fix.end} fade={0.25} overlay>
        <CountBadge label="EMAILS SENT" to={100} at={0.1} over={1.4} top={560} />
      </Layer>

      {/* 7 Results */}
      <Layer from={B.results.start} to={B.results.end}><Shot file="A02S_S10" /></Layer>
      <Layer from={at("results", "eleven")} to={B.results.end} fade={0.25} overlay><CountBadge label="REPLIES" to={11} at={0.1} over={0.8} top={470} /></Layer>
      <Layer from={at("results", "three")} to={B.results.end} fade={0.25} overlay><CountBadge label="PAID" to={3} at={0.1} over={0.6} top={640} /></Layer>
      <Layer from={at("results", "hundred")} to={B.results.end} fade={0.25} overlay><NoticeCard kicker="FIRST REVENUE" text="$147" top={860} /></Layer>

      {/* 8 The spy */}
      <Layer from={B.spy.start} to={tCustomer}><Shot file="A02S_S10" /></Layer>
      <Layer from={tCustomer} to={tCompetitive - 0.1}><Shot file="A02S_V4" /></Layer>
      <Layer from={tJcarter} to={tCompetitive - 0.1} fade={0.25} overlay>
        <NoticeCard kicker="CUSTOMER 3" text="j.carter@…" top={560} mark />
      </Layer>
      <Layer from={tCompetitive - 0.1} to={B.spy.end}>
        <ConceptCard
          lines={["COMPETITIVE", "INTELLIGENCE"]}
          size={118}
          sub="Competitors buy your product to copy it."
          subAt={0.3}
          stamp="NOT A CUSTOMER"
          stampAt={0.9}
        >
          <Shot file="A02S_V4" />
        </ConceptCard>
      </Layer>

      {/* 9 The Vest copies */}
      <Layer from={B.counter.start} to={B.counter.end}><Shot file="A02_V3" /></Layer>
      <Layer from={at("counter", "free")} to={B.counter.end} fade={0.25} overlay>
        <NoticeCard kicker="THE VEST · PRICING" text="FREE PLAN" top={560} mark />
      </Layer>

      {/* 10 Cliffhanger */}
      <Layer from={B.cliff.start} to={tWell}><Shot file="A02S_S11" /></Layer>
      <Layer from={tWell} to={tTake}><Shot file="A02S_S12" /></Layer>
      <Layer from={tTake} to={B.cliff.end}><Shot file="A02S_S11" /></Layer>
      <Layer from={tWell} to={tTake} fade={0.25} overlay>
        <NoticeCard kicker="EMAIL · 11:47 PM" text="$25,000 for your idea" top={560} />
      </Layer>
      <Layer from={at("cliff", "it's")} to={tTake} fade={0.25} overlay>
        <NoticeCard kicker="FROM" text="The Vest" top={900} mark />
      </Layer>
      <Layer from={tTake} to={B.cliff.end} fade={0.25} overlay>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 600 }}>
          <div style={{ display: "flex", gap: 24, width: "100%", padding: "0 60px" }}>
            <ChoiceButton label="TAKE" variant="ghost" at={0} />
            <ChoiceButton label="KEEP" variant="accent" at={at("cliff", "keep") - tTake} />
          </div>
        </AbsoluteFill>
      </Layer>

      {/* 11 End card */}
      <Layer from={B.end.start} to={B.end.end}>
        <EndCard nextPart={3} lines={["Comment TAKE or KEEP.", "The majority writes Part 3."]} options={["TAKE", "KEEP"]}>
          <Shot file="A02S_S11" />
        </EndCard>
      </Layer>

      <Hud state={state as HudState} changes={hudChanges} hotAbove={{ burnout: 5 }} windows={hudWindows} tags={hudTags} />
      <Subtitles words={subtitleWords} windows={subtitleWindows} />
    </AbsoluteFill>
  </SeriesProvider>
);
