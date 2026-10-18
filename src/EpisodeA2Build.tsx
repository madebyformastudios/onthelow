import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeProvider, SeriesProvider, palette } from "./theme";

// Instagram safe frame: side crop ~100px, top UI to ~250px, like column on the right (see theme.tsx).
const SAFE = { side: 110, rightBand: 210, hudTop: 280 };
import { Sfx, Timing, createTimeline } from "./episodeKit";
import { Layer, Phase } from "./components/Layer";
import { Shot } from "./components/Shot";
import { Hud, HudState } from "./components/Hud";
import { Subtitles } from "./components/Subtitles";
import { RuleCard } from "./components/Cards";
import { BarRow, BigText, InfographicBoard } from "./components/Board";
import { EndCard } from "./components/EndCard";
import { ChoiceButton } from "./components/ChoiceButton";
import { Calendar, ConceptCard, LabelTag, NoticeCard } from "./components/Extras";
import { Ticker, VersusBars, VoteTag } from "./components/Part2";
import state from "../production/state-a2.json";
import timing from "../episodes/a-part-2-build/timing.json";

const { B, at, subtitleWords, musicVolume } = createTimeline(
  timing as Timing,
  /^(agency|paid|cent|runway|scope|creep|payment|worry|launch|wait|free|broken|perfect)$/,
);

export const EPISODE_A2_BUILD_SECONDS = timing.duration;

const tThirty = at("hook", "thirty");
const tMost = at("hook", "most");
const tProblem = at("hook", "problem");
const tFifteen2 = at("burn", "fifteen", 2);
const tAdd = at("burn", "add");
const tRunway = at("burn", "runway");
const tTwelve = at("vest", "twelve");
const tShips = at("vest", "ships");
const t28 = at("vest", "twenty-eight");
const tScope = at("name", "scope");
const tAgency = at("fix", "agency");
const tNot = at("fix", "not");
const tCrashes = at("cliff", "crashes");
const tLaunch = at("cliff", "launch");

const subtitleWindows: [number, number][] = [
  [B.hook.start, B.hook.end],
  [B.vest.start, B.vest.end],
  [B.m1.start, B.m1.end],
  [B.m2.start, B.m2.end],
  [B.m3.start, B.m3.end],
  [B.name.start, tScope - 0.2],
  [B.fix.start, B.fix.end],
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
  { text: "DAY 4", from: B.fix.start, to: B.cliff.start },
  { text: "WEEK 5", from: B.cliff.start, to: B.end.start },
];

const hudChanges = {
  cash: [{ at: at("burn", "fifteen"), value: 31800, over: 1.2 }],
  runway: [{ at: at("burn", "sixty-three"), value: 63, over: 1.0 }],
  burnout: [
    { at: B.m1.start + 1.0, value: 27, over: 0.8 },
    { at: B.m2.start + 0.8, value: 31, over: 0.8 },
    { at: B.m3.start + 0.8, value: 36, over: 0.8 },
    { at: at("counter", "thirty-one"), value: 44, over: 0.8 },
    { at: tCrashes, value: 51, over: 0.8 },
  ],
};

export const EpisodeA2Build: React.FC = () => (
  <SeriesProvider series="a">
    <SafeProvider safe={SAFE}>
    <AbsoluteFill style={{ background: palette.ink }}>
      <Audio src={staticFile(timing.audio)} />
      <Audio src={staticFile("music/mystery.mp3")} volume={musicVolume} />

      <Sfx at={tMost} src="whoosh" volume={0.12} />
      <Sfx at={tThirty} src="tap" volume={0.15} />
      <Sfx at={tRunway} src="whoosh" volume={0.1} />
      <Sfx at={B.rule.start} src="thud" volume={0.2} />
      <Sfx at={at("name", "scope")} src="stamp" volume={0.3} />
      <Sfx at={at("m1", "change")} src="tap" volume={0.15} />
      <Sfx at={at("counter", "thirty-one")} src="tap" volume={0.15} />
      <Sfx at={tCrashes} src="thud" volume={0.2} />
      <Sfx at={B.end.start} src="whoosh" volume={0.1} />

      {/* 1 Hook: the vote recap lands on "Most of you voted for it" */}
      <Layer from={B.hook.start} to={tMost} fade={0.01}><Shot file="A02B_S01" /></Layer>
      <Layer from={tMost} to={tProblem}><Shot file="A02B_S02" /></Layer>
      <Layer from={tProblem} to={B.hook.end}><Shot file="A02B_S03" /></Layer>
      <Layer from={tThirty} to={tMost} fade={0.25} overlay>
        <NoticeCard kicker="AGENCY CONTRACT" text="$30,000 · 6 weeks" top={620} />
      </Layer>
      <Layer from={tMost} to={tProblem} fade={0.25} overlay><VoteTag word="BUILD" /></Layer>

      {/* 2 The numbers */}
      <Layer from={B.burn.start} to={B.burn.end}>
        <InfographicBoard kicker="DAY 4 · THE QUOTE" kickerTop={470}>
          <Phase from={B.burn.start} to={tAdd}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 34 }}>
              <BarRow label="DOWN TODAY" value={15000} max={15000} display="$15,000" at={0.2} />
              <BarRow label="ON DELIVERY" value={15000} max={15000} display="$15,000" at={tFifteen2 - B.burn.start} />
            </div>
          </Phase>
          <Phase from={tAdd} to={tRunway}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 30 }}>
              <BarRow label="AGENCY · $30K ÷ 1.5 MO" value={20000} max={22200} display="$20,000" at={0} />
              <BarRow label="RENT + SOFTWARE" value={2200} max={22200} display="$2,200" at={0.3} />
            </div>
            <BigText text="$22,200 / month" size={88} at={at("burn", "twenty-two") - tAdd} />
          </Phase>
          <Phase from={tRunway} to={B.burn.end + 0.4}>
            <Calendar big="63" unit="DAYS" />
          </Phase>
        </InfographicBoard>
      </Layer>

      {/* 3 The opponent */}
      <Layer from={B.vest.start} to={tShips}><Shot file="A02_V1" /></Layer>
      <Layer from={tShips} to={B.vest.end}><Shot file="A02_V2" /></Layer>
      <Layer from={tTwelve} to={tShips} fade={0.25} overlay>
        <LabelTag text="THE VEST · $2M RAISED · 12 ENGINEERS" top={500} />
      </Layer>
      <Layer from={t28} to={B.vest.end} fade={0.25} overlay>
        <VersusBars
          max={42}
          rows={[
            { label: "THE VEST SHIPS", value: 28, display: "28 DAYS" },
            { label: "YOUR AGENCY", value: 42, display: "42 DAYS", accent: true },
          ]}
        />
      </Layer>

      {/* 4 Three mistakes */}
      <Layer from={B.m1.start} to={B.m1.end}><Shot file="A02B_S04" /></Layer>
      <Layer from={B.m1.start} to={B.m1.end} fade={0.25} overlay><LabelTag text="MISTAKE 1 · SAY YES TO EVERY IDEA" top={500} /></Layer>
      <Layer from={at("m1", "change")} to={B.m1.end} fade={0.25} overlay>
        <NoticeCard kicker="CHANGE ORDER" text="$150 / hour" top={1000} />
      </Layer>
      <Layer from={B.m2.start} to={B.m2.end}><Shot file="A02B_S05" /></Layer>
      <Layer from={B.m2.start} to={B.m2.end} fade={0.25} overlay><LabelTag text="MISTAKE 2 · DISAPPEAR" top={500} /></Layer>
      <Layer from={B.m3.start} to={B.m3.end}><Shot file="A02B_S06" focusX={0.6} /></Layer>
      <Layer from={B.m3.start} to={B.m3.end} fade={0.25} overlay><LabelTag text="MISTAKE 3 · WAIT FOR PERFECT" top={500} /></Layer>
      <Layer from={at("m3", "eleven")} to={B.m3.end} fade={0.25} overlay>
        <NoticeCard kicker="PERFECT TAKES" text="11 weeks" top={1000} />
      </Layer>

      {/* 5 The name */}
      <Layer from={B.name.start} to={tScope - 0.1}><Shot file="A02B_S04" /></Layer>
      <Layer from={tScope - 0.1} to={B.name.end}>
        <ConceptCard
          lines={["SCOPE", "CREEP"]}
          sub="A fixed price locks the cost of their plan, not yours."
          subAt={at("name", "a", 2) - (tScope - 0.1)}
          stamp="CHANGE ORDER"
          stampAt={at("name", "plan") - (tScope - 0.1)}
        >
          <Shot file="A02B_S04" />
        </ConceptCard>
      </Layer>

      {/* 6 Rule */}
      <Layer from={B.rule.start} to={B.rule.end}>
        <RuleCard rule={2} text="Build the smallest thing that can take a payment." />
      </Layer>

      {/* 7 The fix and the red flag */}
      <Layer from={B.fix.start} to={tAgency}><Shot file="A02B_S07" /></Layer>
      <Layer from={tAgency} to={B.fix.end}><Shot file="A02B_S08" /></Layer>
      <Layer from={at("fix", "one")} to={tAgency} fade={0.25} overlay>
        <NoticeCard kicker="NEW SCOPE" text="1 feature + checkout" top={620} />
      </Layer>
      <Layer from={tNot} to={B.fix.end} fade={0.25} overlay>
        <NoticeCard kicker="QUESTIONS ABOUT YOUR CUSTOMERS" text="0" top={620} />
      </Layer>

      {/* 8 The opponent strikes */}
      <Layer from={B.counter.start} to={B.counter.end}><Shot file="A02_V3" /></Layer>
      <Layer from={at("counter", "thirty-one") - 0.4} to={B.counter.end} fade={0.25} overlay>
        <Ticker label="YOUR WAITLIST" from={204} to={173} at={0.4} top={620} />
      </Layer>

      {/* 9 Cliffhanger */}
      <Layer from={B.cliff.start} to={tCrashes}><Shot file="A02B_S10" /></Layer>
      <Layer from={tCrashes} to={tLaunch}><Shot file="A02B_S09" /></Layer>
      <Layer from={tLaunch} to={B.cliff.end}><Shot file="A02B_S10" /></Layer>
      <Layer from={tCrashes} to={tLaunch} fade={0.25} overlay>
        <NoticeCard kicker="LOGIN TEST" text="2 users = crash" top={620} />
      </Layer>
      <Layer from={at("cliff", "vest")} to={tLaunch} fade={0.25} overlay>
        <NoticeCard kicker="THE VEST" text="LIVE NOW" top={840} mark />
      </Layer>
      <Layer from={tLaunch} to={B.cliff.end} fade={0.25} overlay>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 600 }}>
          <div style={{ display: "flex", gap: 24, width: "100%", padding: "0 210px 0 110px" }}>
            <ChoiceButton label="LAUNCH" variant="ghost" at={0} />
            <ChoiceButton label="WAIT" variant="accent" at={at("cliff", "pay") - tLaunch} />
          </div>
        </AbsoluteFill>
      </Layer>

      {/* 10 End card */}
      <Layer from={B.end.start} to={B.end.end}>
        <EndCard nextPart={3} lines={["Comment LAUNCH or WAIT.", "The majority writes Part 3."]} options={["LAUNCH", "WAIT"]}>
          <Shot file="A02B_S10" />
        </EndCard>
      </Layer>

      <Hud state={state as HudState} changes={hudChanges} hotAbove={{ burnout: 5 }} windows={hudWindows} tags={hudTags} />
      <Subtitles words={subtitleWords} windows={subtitleWindows} />
    </AbsoluteFill>
    </SafeProvider>
  </SeriesProvider>
);
