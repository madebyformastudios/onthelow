import { Easing, interpolate } from "remotion";

export type ValueFormat = "usd" | "days" | "percent" | "liters" | "plain";

export const formatValue = (v: number | null, format: ValueFormat) => {
  if (v === null) return format === "days" ? "? DAYS" : "?";
  const n = Math.round(v);
  switch (format) {
    case "usd":
      return `$${n.toLocaleString("en-US")}`;
    case "days":
      return `${n} DAYS`;
    case "percent":
      return `${n}%`;
    case "liters":
      return `${n} L`;
    case "plain":
      return `${n}`;
  }
};

export type Change = { at: number; value: number; over?: number };

const ease = Easing.out(Easing.cubic);

/** Value at time `t` (seconds). Counts from the previous value to each change's value over `over` seconds. */
export const valueAt = (start: number | null, changes: Change[], t: number) => {
  let prev = start;
  for (const c of changes) {
    if (t < c.at) return prev;
    const over = c.over ?? 1;
    if (t < c.at + over) {
      return interpolate(t, [c.at, c.at + over], [prev ?? 0, c.value], {
        easing: ease,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    prev = c.value;
  }
  return prev;
};

export const isChanging = (changes: Change[], t: number) =>
  changes.some((c) => t >= c.at && t < c.at + (c.over ?? 1));
