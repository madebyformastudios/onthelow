import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FPS, SeriesProvider, palette } from "./theme";
import { Layer, Phase } from "./components/Layer";
import { Shot } from "./components/Shot";
import { Hud, HudState } from "./components/Hud";
import { Subtitles, Word } from "./components/Subtitles";
import { DayCard, RuleCard, TitleCard } from "./components/Cards";
import { BarRow, BigText, InfographicBoard } from "./components/Board";
import { StatusBoard } from "./components/StatusBoard";
import { EndCard } from "./components/EndCard";
import { ChoiceButton } from "./components/ChoiceButton";
import { Calendar, ConceptCard, CountBadge, LabelTag, NoticeCard, SourceNote, YesGrid } from "./components/Extras";
import stateA from "../production/state-a.json";
import timing from "../episodes/a-part-1/timing.json";

type TWord = { w: string; start: number; end: number };
type Beat = { id: string; start: number; end: number; words: TWord[] };

const beats = Object.fromEntries((timing.beats as Beat[]).map((b) => [b.id, b])) as Record<string, Beat>;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9-]/g, "");

/** Absolute start time (s) of the nth occurrence of `word` in a beat. Re-run align-timing.py and this follows the voice-over. */
const at = (id: string, word: string, nth = 1) => {
  const hit = beats[id].words.filter((x) => norm(x.w) === norm(word))[nth - 1];
  if (!hit) throw new Error(`word "${word}" #${nth} not found in beat ${id}`);
  return hit.start;
};

export const EPISODE_A1_SECONDS = timing.duration;

/** One-shot sound effect at an absolute time (seconds). */
const Sfx: React.FC<{ at: number; src: "pop" | "tick" | "ding" | "stamp" | "boom" | "whoosh" | "count"; volume?: number }> = ({
  at: t,
  src,
  volume = 0.4,
}) => (
  <Sequence from={Math.round(t * FPS)} durationInFrames={Math.round(3 * FPS)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const MUSIC_VOLUME = 0.2;
const musicVolume = (f: number) =>
  MUSIC_VOLUME *
  interpolate(f, [0, 2 * FPS, (timing.duration - 4) * FPS, timing.duration * FPS], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const ACCENT_WORDS = /^(money|name|test|lie|nothing|zero|build|sell)$/;
const subtitleWords: Word[] = (timing.beats as Beat[]).flatMap((b) =>
  b.words.map((x) => ({ ...x, accent: ACCENT_WORDS.test(norm(x.w)) })),
);

const B = beats;
const frac = (b: Beat, f: number) => b.start + (b.end - b.start) * f;

// Beat 1 shot cuts follow the plan's proportions (3s, 2s, 2s of 7s).
const hookCut1 = frac(B.hook, 3 / 7);
const hookCut2 = frac(B.hook, 5 / 7);
const p2Cut1 = frac(B.p2, 0.33);
const p2Cut2 = frac(B.p2, 0.62);

const tHundred = at("p1", "hundred", 2);
const tFortyseven = at("d2a", "forty-seven");
const tDeveloper = at("d2a", "developer");
const tAsk2 = at("d2b", "ask", 2);
const tWork = at("d2c", "work");
const tCompany = at("d2c", "company");
const tFortysix = at("d3", "forty-six");
const tAgency = at("temptation", "agency");
const tYouCan = at("temptation", "you");
const tBuild = at("temptation", "build", 2);
const dayCardEnd = at("d2a", "you");

// Illustration windows: where subtitles show. Cards and boards carry their own text.
const subtitleWindows: [number, number][] = [
  [B.hook.start, B.hook.end],
  [B.p2.start, B.p2.end],
  [dayCardEnd, B.d2a.end],
  [B.d2c.start, B.d2c.end],
  [B.temptation.start, B.temptation.end],
];

const hudWindows: [number, number][] = [
  [tHundred - 0.2, B.p1.end + 0.3],
  [B.p2.start + 0.2, B.rule.start],
  [dayCardEnd, B.d3.start],
  [B.temptation.start, B.end.start],
];

const hudTags = [
  { text: "PROBLEM 1", from: tHundred - 0.2, to: B.p1.end + 0.3 },
  { text: "PROBLEM 2", from: B.p2.start, to: B.rule.start },
  { text: "DAY 2", from: dayCardEnd, to: B.d3.start },
  { text: "DAY 3", from: B.temptation.start, to: B.end.start },
];

const hudChanges = {
  cash: [{ at: at("d2a", "thirty-two"), value: 46800, over: 1.2 }],
  runway: [
    { at: tHundred, value: 100, over: 1.6 },
    { at: tFortysix, value: 94, over: 0.8 },
  ],
  burnout: [
    { at: at("d2b", "lie"), value: 10, over: 1 },
    { at: at("d2c", "raised"), value: 20, over: 1 },
  ],
};

export const EpisodeA1: React.FC = () => (
  <SeriesProvider series="a">
    <AbsoluteFill style={{ background: palette.ink }}>
      <Audio src={staticFile(timing.audio)} />
      <Audio src={staticFile("music/mystery.mp3")} volume={musicVolume} />

      {/* Sound design: light hits on cards, pops on board phases, counters on HUD changes */}
      <Sfx at={B.title.start} src="boom" volume={0.55} />
      <Sfx at={B.p1.start} src="whoosh" volume={0.25} />
      {[at("p1", "fifty"), at("p1", "eighty"), at("p1", "thirty-two"), at("p1", "rent"), at("p1", "rent") + 0.3, at("p1", "rent") + 0.6, at("p1", "fifteen"), at("p1", "that's", 2)].map((x) => (
        <Sfx key={x} at={x} src="pop" volume={0.3} />
      ))}
      <Sfx at={tHundred} src="stamp" volume={0.4} />
      <Sfx at={tHundred} src="count" volume={0.22} />
      <Sfx at={at("p2", "reason")} src="pop" volume={0.3} />
      <Sfx at={B.rule.start} src="boom" volume={0.4} />
      <Sfx at={B.d2a.start} src="boom" volume={0.35} />
      <Sfx at={at("d2a", "fifty")} src="count" volume={0.22} />
      <Sfx at={at("d2a", "thirty-two")} src="count" volume={0.22} />
      <Sfx at={B.d2b.start} src="whoosh" volume={0.3} />
      <Sfx at={at("d2b", "lie")} src="stamp" volume={0.55} />
      <Sfx at={at("d2b", "lie")} src="count" volume={0.2} />
      {Array.from({ length: 24 }).map((_, i) => (
        <Sfx key={i} at={at("d2b", "friend") + i * 0.14} src="tick" volume={0.12} />
      ))}
      <Sfx at={tWork} src="ding" volume={0.35} />
      <Sfx at={at("d2c", "raised")} src="count" volume={0.2} />
      <Sfx at={B.d3.start} src="boom" volume={0.35} />
      <Sfx at={tFortysix} src="whoosh" volume={0.25} />
      <Sfx at={tAgency} src="ding" volume={0.3} />
      <Sfx at={tBuild} src="pop" volume={0.4} />
      <Sfx at={B.end.start} src="whoosh" volume={0.3} />
      <Sfx at={B.end.start + 0.8} src="pop" volume={0.3} />
      <Sfx at={B.end.start + 0.95} src="pop" volume={0.3} />

      {/* 1 Hook */}
      <Layer from={B.hook.start} to={hookCut1} fade={0.01}><Shot file="A01_S01" /></Layer>
      <Layer from={hookCut1} to={hookCut2}><Shot file="A01_S02" /></Layer>
      <Layer from={hookCut2} to={B.hook.end}><Shot file="A01_S03" /></Layer>

      {/* 2 Title card */}
      <Layer from={B.title.start} to={B.title.end}>
        <TitleCard kicker="PART 1 · THE BURN" lead="EVERY DAY COSTS" accentWord="MONEY" />
      </Layer>

      {/* 3 Problem 1: cream board, build follows the words */}
      <Layer from={B.p1.start} to={B.p1.end}>
        <InfographicBoard kicker="PROBLEM 1 · THE BURN">
          <Phase from={at("p1", "fifty")} to={at("p1", "eighty")}>
            <BigText text="$50,000" size={190} />
          </Phase>
          <Phase from={at("p1", "eighty")} to={at("p1", "thirty-two")}>
            <BigText text="$80/hr × 40" size={130} />
          </Phase>
          <Phase from={at("p1", "thirty-two")} to={at("p1", "rent")}>
            <BigText text="= $3,200" accentWord="per week" size={110} />
          </Phase>
          <Phase from={at("p1", "rent")} to={at("p1", "that's", 2)}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 30 }}>
              <BarRow label="DEVELOPER" value={12800} max={15000} display="$12,800" at={0} />
              <BarRow label="RENT" value={1500} max={15000} display="$1,500" at={0.3} />
              <BarRow label="SOFTWARE" value={700} max={15000} display="$700" at={0.6} />
            </div>
            <BigText text="$15,000 / month" accentWord="" size={96} at={at("p1", "fifteen") - at("p1", "rent")} />
          </Phase>
          <Phase from={at("p1", "that's", 2)} to={tHundred}>
            <BigText text="$50,000 ÷ $15,000" size={100} />
          </Phase>
          <Phase from={tHundred} to={B.p1.end + 0.4}>
            <Calendar big="100" unit="DAYS" />
          </Phase>
        </InfographicBoard>
      </Layer>

      {/* 4 Problem 2: laptop graveyard */}
      <Layer from={B.p2.start} to={p2Cut1}><Shot file="A01_S04" /></Layer>
      <Layer from={p2Cut1} to={p2Cut2}><Shot file="A01_S05" /></Layer>
      <Layer from={p2Cut2} to={B.p2.end}><Shot file="A01_S06" focusX={0.5} /></Layer>
      <Layer from={at("p2", "reason")} to={B.p2.end} fade={0.25} overlay>
        <LabelTag text="#1 REASON STARTUPS DIE · NO MARKET NEED" top={430} />
      </Layer>
      <Layer from={at("p2", "cb")} to={B.p2.end} fade={0.25} overlay>
        <SourceNote text="Source: CB Insights" />
      </Layer>

      {/* 5 Rule card */}
      <Layer from={B.rule.start} to={B.rule.end}>
        <RuleCard rule={1} text="Sell it before you build it." />
      </Layer>

      {/* 6a Day 2: smart move */}
      <Layer from={B.d2a.start} to={tFortyseven}><Shot file="A01_S07" /></Layer>
      <Layer from={tFortyseven} to={tDeveloper}><Shot file="A01_S08" /></Layer>
      <Layer from={tDeveloper} to={B.d2a.end}><Shot file="A01_S09" /></Layer>
      <Layer from={at("d2a", "fifty")} to={tDeveloper} fade={0.25} overlay>
        <CountBadge label="YES" to={47} at={0} over={tFortyseven - at("d2a", "fifty") + 0.3} />
      </Layer>
      <Layer from={B.d2a.start} to={dayCardEnd} fade={0.5} overlay><DayCard day={2} /></Layer>

      {/* 6b Day 2: the trap */}
      <Layer from={B.d2b.start} to={tAsk2}>
        <ConceptCard
          lines={["THE MOM", "TEST"]}
          sub="Asking people if they like your idea gets you polite lies."
          stamp="FALSE SIGNAL"
          stampAt={at("d2b", "lie") - B.d2b.start}
        >
          <Shot file="A01_S08" />
        </ConceptCard>
      </Layer>
      <Layer from={tAsk2} to={B.d2b.end}>
        <YesGrid count={47} greyAt={at("d2b", "friend") - tAsk2} />
      </Layer>

      {/* 6c Day 2: the opponent */}
      <Layer from={B.d2c.start} to={tWork}><Shot file="A01_S10" /></Layer>
      <Layer from={tWork} to={tCompany}><Shot file="A01_S11" /></Layer>
      <Layer from={tCompany} to={B.d2c.end}><Shot file="A01_S12" /></Layer>
      <Layer from={tWork} to={tCompany} fade={0.25} overlay>
        <NoticeCard kicker="NEW SIGNUP" text="j.carter@…" top={1180} mark />
      </Layer>

      {/* 7 Day 3 */}
      <Layer from={B.d3.start} to={tFortysix}><DayCard day={3} /></Layer>
      <Layer from={tFortysix - 0.3} to={B.d3.end}>
        <StatusBoard
          kicker="DAY 3 · WHERE YOU STAND"
          rows={[
            { label: "CASH LEFT", value: "$46,800" },
            { label: "RUNWAY", value: "94 DAYS" },
            { label: "YESES THAT COUNT", value: "0" },
            { label: "BURNOUT", value: "20%", bar: 20 },
          ]}
        />
      </Layer>

      {/* 8 Temptation and choice */}
      <Layer from={B.temptation.start} to={tYouCan}><Shot file="A01_S13" bars={{ top: 170 / 1376, bottom: 146 / 1376 }} focusX={0.35} /></Layer>
      <Layer from={tYouCan} to={B.temptation.end}><Shot file="A01_S14" /></Layer>
      <Layer from={tAgency} to={tYouCan} fade={0.25} overlay>
        <NoticeCard kicker="EMAIL" text="Full app in 6 weeks · $30,000" top={560} />
      </Layer>
      <Layer from={tBuild} to={B.temptation.end} fade={0.25} overlay>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 640 }}>
          <ChoiceButton label="BUILD" large />
        </AbsoluteFill>
      </Layer>

      {/* 9 End card over the blurred last illustration */}
      <Layer from={B.end.start} to={B.end.end}>
        <EndCard nextPart={2} lines={["Comment BUILD or SELL.", "The majority writes Part 2."]} options={["BUILD", "SELL"]}>
          <Shot file="A01_S14" />
        </EndCard>
      </Layer>

      {/* HUD and subtitles run on the global timeline above all layers */}
      <Hud state={stateA as HudState} changes={hudChanges} hotAbove={{ burnout: 5 }} windows={hudWindows} tags={hudTags} />
      <Subtitles words={subtitleWords} windows={subtitleWindows} />
    </AbsoluteFill>
  </SeriesProvider>
);
