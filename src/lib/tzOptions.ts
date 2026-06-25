// The curated time-zone list shown in the dropdown. The visitor's auto-detected
// IANA zone is prepended (labelled "your time zone") if it isn't already listed.

export interface TzOption {
  tz: string;
  label: string;
}

const BASE: TzOption[] = [
  { tz: "America/Los_Angeles", label: "Pacific Time — US & Canada" },
  { tz: "America/Denver", label: "Mountain Time — US & Canada" },
  { tz: "America/Chicago", label: "Central Time — US & Canada" },
  { tz: "America/New_York", label: "Eastern Time — US & Canada" },
  { tz: "America/Sao_Paulo", label: "São Paulo" },
  { tz: "Europe/London", label: "London — GMT/BST" },
  { tz: "Europe/Paris", label: "Central European Time" },
  { tz: "Asia/Kolkata", label: "India Standard Time" },
  { tz: "Asia/Singapore", label: "Singapore Time" },
  { tz: "Asia/Tokyo", label: "Japan Standard Time" },
  { tz: "Australia/Sydney", label: "Sydney — AEST/AEDT" },
];

export function buildTzOptions(detected: string): TzOption[] {
  if (BASE.some((o) => o.tz === detected)) return BASE;
  const friendly = detected.split("/").pop()?.replace(/_/g, " ") ?? detected;
  return [{ tz: detected, label: `${friendly} (your time zone)` }, ...BASE];
}

export function tzLabelFor(options: TzOption[], tz: string): string {
  return options.find((o) => o.tz === tz)?.label ?? tz.replace(/_/g, " ");
}

export function detectTz(fallback = "America/New_York"): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || fallback;
  } catch {
    return fallback;
  }
}
