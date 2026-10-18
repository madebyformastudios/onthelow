import React, { createContext, useContext } from "react";
import { Easing } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const inter = loadInter("normal", { weights: ["500", "700", "900"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const fonts = { sans: inter.fontFamily, mono: mono.fontFamily };

export const palette = {
  ink: "#0B0B0C",
  warmInk: "#16110D",
  cream: "#F3EAD3",
  white: "#FFFFFF",
  grey: "#8A8A8A",
  hud: "rgba(11,11,12,0.68)",
};

export type SeriesId = "a" | "b";

export type SeriesTheme = {
  id: SeriesId;
  title: string;
  tagline: string;
  accent: string;
};

// Accent hex values come from production/bible-a.md and bible-b.md.
export const SERIES: Record<SeriesId, SeriesTheme> = {
  a: { id: "a", title: "Founder Mode", tagline: "Every day costs money", accent: "#B5F23D" },
  b: { id: "b", title: "Day Zero", tagline: "Nobody is coming", accent: "#FF6A1A" },
};

export const springs = {
  pop: { damping: 14, stiffness: 140, mass: 0.7 },
  soft: { damping: 200 },
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const SeriesContext = createContext<SeriesTheme>(SERIES.a);

export const SeriesProvider: React.FC<{ series: SeriesId; children: React.ReactNode }> = ({
  series,
  children,
}) => <SeriesContext.Provider value={SERIES[series]}>{children}</SeriesContext.Provider>;

export const useSeries = () => useContext(SeriesContext);
