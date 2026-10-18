// Estimates word timing from episodes/<ep>/voiceover.md until the real voice-over exists.
// Usage: node scripts/estimate-timing.mjs a-part-1 [wpm]
import fs from "node:fs";

const [ep, wpmArg] = process.argv.slice(2);
const WPM = Number(wpmArg ?? 185);
const IDS = ["hook", "title", "p1", "p2", "rule", "d2a", "d2b", "d2c", "d3", "temptation", "end"];
const MIN = { title: 3, rule: 2.6, d3: 5.5, end: 5 }; // card beats need room beyond the speech
const LEAD = { title: 0.25, d3: 0.25 };

const md = fs.readFileSync(`episodes/${ep}/voiceover.md`, "utf8");
const body = md.split("## Per beat")[1].split("## Volledige tekst")[0];
const texts = [...body.matchAll(/\*\*[\d:]+-[\d:]+ · .+?\*\*\n\n(.+?)\n/g)].map((m) => m[1]);
if (texts.length !== IDS.length) throw new Error(`expected ${IDS.length} beats, got ${texts.length}`);

let cursor = 0;
const beats = texts.map((text, i) => {
  const id = IDS[i];
  const tokens = text.split(/\s+/);
  const lead = LEAD[id] ?? 0.15;
  const speech = (tokens.length * 60) / WPM;
  const dur = Math.max(MIN[id] ?? 0, lead + speech + 0.35);
  const weights = tokens.map((t) => t.length + 2 + (/[,.?!:]["”]?$/.test(t) ? 3 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let t = cursor + lead;
  const words = tokens.map((w, j) => {
    const d = (weights[j] / total) * speech;
    const out = { w, start: +t.toFixed(3), end: +(t + d).toFixed(3) };
    t += d;
    return out;
  });
  const beat = { id, start: +cursor.toFixed(3), end: +(cursor + dur).toFixed(3), words };
  cursor += dur;
  return beat;
});

fs.writeFileSync(`episodes/${ep}/timing.json`, JSON.stringify({ estimated: true, wpm: WPM, duration: +cursor.toFixed(3), beats }, null, 1));
console.log(`${ep}: ${cursor.toFixed(1)} s at ${WPM} wpm`);
