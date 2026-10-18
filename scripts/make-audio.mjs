// Synthesizes the background music and the sound effects (no downloads, deterministic).
// Usage: node scripts/make-audio.mjs   -> public/sfx/*.wav and public/music/mystery.mp3 (needs ffmpeg for the mp3)
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SR = 44100;
const TAU = Math.PI * 2;
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const wav = (file, L, R = L) => {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak > 0.85 ? 0.85 / peak : 1;
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
};

const mk = (sec) => new Float32Array(Math.round(sec * SR));
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t / d);
const lowpass = (x, hz) => { const a = 1 - Math.exp((-TAU * hz) / SR); let y = 0; for (let i = 0; i < x.length; i++) { y += a * (x[i] - y); x[i] = y; } return x; };

// ---- SFX ----
const sfx = {
  pop: () => { const x = mk(0.25); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = Math.sin(TAU * (900 * Math.exp(-t * 18) + 220) * t) * env(t, 0.002, 0.05); } return x; },
  tick: () => { const x = mk(0.06); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = Math.sin(TAU * 2400 * t) * env(t, 0.0005, 0.008); } return x; },
  ding: () => { const x = mk(1.6); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = (Math.sin(TAU * 1318 * t) + 0.4 * Math.sin(TAU * 1318 * 2.76 * t)) * env(t, 0.002, 0.35) * 0.6; } return x; },
  stamp: () => { const x = mk(0.7); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = Math.sin(TAU * (120 * Math.exp(-t * 6) + 48) * t) * env(t, 0.001, 0.16) + rnd() * env(t, 0.001, 0.025) * 0.5; } return lowpass(x, 2500); },
  boom: () => { const x = mk(2.2); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = Math.sin(TAU * (70 * Math.exp(-t * 1.2) + 32) * t) * env(t, 0.01, 0.7) + rnd() * env(t, 0.002, 0.08) * 0.25; } return lowpass(x, 700); },
  whoosh: () => { const x = mk(0.9); const n = new Float32Array(x.length); for (let i = 0; i < n.length; i++) n[i] = rnd(); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = n[i] * Math.sin((Math.PI * t) / 0.9) ** 2 * 0.5; } // sweep via two lowpass passes with rising cutoff
    let y = 0; for (let i = 0; i < x.length; i++) { const t = i / SR; const a = 1 - Math.exp((-TAU * (300 + 3500 * (t / 0.9))) / SR); y += a * (x[i] - y); x[i] = y; } return x; },
  count: () => { const x = mk(1.4); for (let k = 0; k < 18; k++) { const t0 = k * 0.07; const f = 900 + k * 70; for (let i = Math.round(t0 * SR); i < Math.min(x.length, Math.round((t0 + 0.05) * SR)); i++) { const t = i / SR - t0; x[i] += Math.sin(TAU * f * t) * env(t, 0.0005, 0.01) * 0.8; } } return x; },
};
for (const [name, fn] of Object.entries(sfx)) wav(`public/sfx/${name}.wav`, fn());

// ---- Music: dark minor drone, slow pad, sparse bells with ping-pong echo ----
const DUR = 125;
const L = mk(DUR), R = mk(DUR);
const chords = [
  [55, 110, 130.81, 164.81], // Am
  [43.65, 87.31, 130.81, 174.61], // Fmaj7 (shadowed)
  [36.71, 73.42, 110, 146.83], // Dm
  [41.2, 82.41, 123.47, 155.56], // E (G# for tension)
];
const CH = 15; // seconds per chord, 4 s crossfade
for (let i = 0; i < L.length; i++) {
  const t = i / SR;
  const idx = Math.floor(t / CH);
  const local = t - idx * CH;
  const mix = (c, w) => chords[c % chords.length].reduce((s, f, k) => s + Math.sin(TAU * f * t + 0.6 * Math.sin(TAU * (0.07 + k * 0.013) * t)) * (k === 0 ? 0.5 : 0.18) * w + Math.sin(TAU * f * 2.003 * t) * 0.03 * w, 0);
  const xf = Math.min(1, local / 4);
  const s = (idx > 0 ? mix(idx - 1, 1 - xf) : 0) + mix(idx, idx > 0 ? xf : 1);
  const swell = 0.75 + 0.25 * Math.sin(TAU * t / 9.5);
  const fadeIn = Math.min(1, t / 3), fadeOut = Math.min(1, (DUR - t) / 4);
  const v = s * swell * fadeIn * fadeOut * 0.33;
  L[i] = v; R[i] = v * 0.96;
}
// bells: pentatonic A minor, deterministic gaps
const notes = [440, 523.25, 659.25, 783.99, 880, 659.25, 523.25];
let t0 = 6, ni = 0;
const echoL = new Float32Array(L.length), echoR = new Float32Array(L.length);
while (t0 < DUR - 6) {
  const f = notes[ni++ % notes.length] * (ni % 5 === 0 ? 0.5 : 1);
  for (let i = Math.round(t0 * SR); i < Math.min(L.length, Math.round((t0 + 3) * SR)); i++) {
    const t = i / SR - t0;
    const m = Math.sin(TAU * f * t + 1.8 * Math.sin(TAU * f * 3.5 * t) * Math.exp(-t * 4)) * env(t, 0.004, 0.55) * 0.09;
    echoL[i] += m; echoR[i] += m * 0.6;
  }
  t0 += 5 + (Math.abs(rnd()) * 6);
}
const d1 = Math.round(0.43 * SR), d2 = Math.round(0.61 * SR);
for (let i = 0; i < L.length; i++) {
  if (i >= d1) echoR[i] += echoL[i - d1] * 0.5;
  if (i >= d2) echoL[i] += echoR[i - d2] * 0.5;
  L[i] += echoL[i]; R[i] += echoR[i];
}
// quiet low pulse, like a slow heartbeat under the tension
for (let b = 8; b < DUR - 5; b += 2.4) for (const off of [0, 0.32]) for (let i = Math.round((b + off) * SR); i < Math.round((b + off + 0.5) * SR); i++) { const t = i / SR - b - off; const v = Math.sin(TAU * 48 * t) * env(t, 0.01, 0.1) * 0.12; L[i] += v; R[i] += v; }
wav("/tmp/mystery.wav", lowpass(L, 5000), lowpass(R, 5000));
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", "/tmp/mystery.wav", "-b:a", "160k", "public/music/mystery.mp3"]);
fs.unlinkSync("/tmp/mystery.wav");
console.log("audio ok");
