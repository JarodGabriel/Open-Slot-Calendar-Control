// The four meeting lengths and their colors — the core of the design.
// Each length owns an accent + tint that themes the entire calendar column.

export type DurationKey = 15 | 30 | 60 | "custom";

export interface DurationOption {
  k: DurationKey;
  title: string;
  blurb: string;
  /** Accent color — borders, selected fills, the Next button. */
  color: string;
  /** Tint — available-day backgrounds, selected length row background. */
  tint: string;
}

export const DURATIONS: DurationOption[] = [
  { k: 15, title: "15 minutes", blurb: "Quick sync", color: "#6495ED", tint: "#eef3fd" },
  { k: 30, title: "30 minutes", blurb: "Standard", color: "#9C4DC8", tint: "#f5edfa" },
  { k: 60, title: "60 minutes", blurb: "Deep dive", color: "#386641", tint: "#e8efea" },
  { k: "custom", title: "Custom length", blurb: "Your call", color: "#B0623C", tint: "#f7eee8" },
];

export const DEFAULT_DURATION: DurationKey = 30;

export function findDuration(k: DurationKey): DurationOption {
  return DURATIONS.find((d) => d.k === k) ?? DURATIONS[1];
}

/** Convert a hex color to an rgba() string at the given alpha. */
export function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
