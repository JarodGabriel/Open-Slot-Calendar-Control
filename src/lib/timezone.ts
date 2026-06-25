// Time-zone conversion helpers. Times are stored as absolute instants (ms epoch)
// so cross-zone display is purely a formatting concern. No external library is
// required — everything here is built on Intl. (Luxon / date-fns-tz are fine
// drop-in replacements in production if you prefer.)
//
// This module is isomorphic: it runs identically on the server (slot generation)
// and in the browser (slot display).

/** Minutes that `tz` is offset from UTC at the given instant. */
export function offsetMin(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(date)) p[part.type] = part.value;
  let h = parseInt(p.hour, 10);
  if (h === 24) h = 0; // some engines emit "24" for midnight
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, h, +p.minute, +p.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}

/**
 * Absolute instant (ms epoch) for a wall-clock time in the host's zone.
 * Corrects twice to land cleanly across DST boundaries.
 */
export function instantFromHostWall(
  y: number,
  m: number, // 0-based month
  d: number,
  hh: number,
  mm: number,
  hostTz: string,
): number {
  const guess = Date.UTC(y, m, d, hh, mm);
  let inst = guess - offsetMin(new Date(guess), hostTz) * 60000;
  inst = guess - offsetMin(new Date(inst), hostTz) * 60000;
  return inst;
}

/** Format an instant as a time ("9:00am") in the viewer's zone. */
export function fmtTime(inst: number, tz: string): string {
  const s = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(inst));
  return s.replace(/\s?([AP])M/i, (_m, g: string) => g.toLowerCase() + "m");
}

/** Format a date as "Thursday, June 25" — optionally pinned to a zone. */
export function fmtDateFull(date: Date, tz?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(tz ? { timeZone: tz } : {}),
  }).format(date);
}
