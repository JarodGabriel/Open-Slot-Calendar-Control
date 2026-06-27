// Slot generation: slice the host's working hours into `durationMin` increments
// and drop any that fall in the past or overlap a busy range. Runs server-side.

import { instantFromHostWall } from "../timezone";
import type { BusyRange } from "./provider";

export interface GenerateSlotsArgs {
  /** Calendar day in the host's zone, "YYYY-MM-DD". */
  dateStr: string;
  durationMin: number;
  hostTz: string;
  workStartHour: number;
  workEndHour: number;
  busy: BusyRange[];
  /** Earliest instant a slot may start (ms). Defaults to now. Used to enforce
   *  minimum-notice rules in addition to dropping past slots. */
  minInstant?: number;
}

/** Returns open start instants (ms epoch), ascending. */
export function generateSlots(args: GenerateSlotsArgs): number[] {
  const { dateStr, durationMin, hostTz, workStartHour, workEndHour, busy } = args;
  const minInstant = args.minInstant ?? Date.now();

  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d || durationMin <= 0) return [];

  const busyMs = busy.map((b) => ({
    start: new Date(b.start).getTime(),
    end: new Date(b.end).getTime(),
  }));

  const startMin = workStartHour * 60;
  const endMin = workEndHour * 60;
  const out: number[] = [];

  for (let t = startMin; t + durationMin <= endMin; t += 30) {
    const inst = instantFromHostWall(y, m - 1, d, Math.floor(t / 60), t % 60, hostTz);
    const slotEnd = inst + durationMin * 60000;
    if (inst < minInstant) continue; // past slots + minimum-notice cutoff
    const overlaps = busyMs.some((b) => inst < b.end && slotEnd > b.start);
    if (overlaps) continue;
    out.push(inst);
  }
  return out;
}
