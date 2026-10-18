// Synthesizes the sound effects (no downloads). Deliberately few, short and quiet.
// The approved background music (public/music/mystery.mp3) came from an earlier version of this script and is kept as is.
// Usage: node scripts/make-audio.mjs   -> public/sfx/*.wav
import fs from "node:fs";

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
  // soft low thump for cards: short, no long sine tail
  thud: () => { const x = mk(0.55); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = Math.sin(TAU * (95 * Math.exp(-t * 14) + 42) * t) * env(t, 0.004, 0.11) + rnd() * env(t, 0.001, 0.02) * 0.12; } return lowpass(x, 420); },
  // breathy air swell
  whoosh: () => { const x = mk(0.7); let y = 0; for (let i = 0; i < x.length; i++) { const t = i / SR; const a = 1 - Math.exp((-TAU * (250 + 1800 * Math.sin((Math.PI * t) / 0.7))) / SR); y += a * (rnd() - y); x[i] = y * Math.sin((Math.PI * t) / 0.7) ** 2 * 0.9; } return x; },
  // wooden rubber-stamp clack: noise tick plus a short body
  stamp: () => { const x = mk(0.4); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = rnd() * env(t, 0.0005, 0.012) * 0.6 + Math.sin(TAU * (160 * Math.exp(-t * 20) + 70) * t) * env(t, 0.001, 0.07); } return lowpass(x, 2200); },
  // muted knock for notifications
  tap: () => { const x = mk(0.2); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = Math.sin(TAU * 330 * t) * env(t, 0.0008, 0.03) * 0.8 + rnd() * env(t, 0.0003, 0.006) * 0.25; } return lowpass(x, 1400); },
  // dull wooden knock on a door
  knock: () => { const x = mk(0.35); for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = Math.sin(TAU * (210 * Math.exp(-t * 25) + 95) * t) * env(t, 0.001, 0.06) + rnd() * env(t, 0.0005, 0.01) * 0.35; } return lowpass(x, 1100); },
};
for (const [name, fn] of Object.entries(sfx)) wav(`public/sfx/${name}.wav`, fn());
console.log("sfx ok");
