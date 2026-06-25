// Provider-independent .ics fallback. Generates a downloadable VEVENT so a
// visitor can add the meeting to any calendar app even if real sync is off.

import { config } from "./config";

export interface IcsInput {
  durationMin: number;
  startInst: number;
  name: string;
  email: string;
  note?: string;
}

function fmtUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/** URL/file-safe slug from a display name, e.g. "Jane Doe" -> "jane-doe". */
function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "host";
}

/** Download filename for the .ics, derived from the configured host name. */
export function icsFilename(): string {
  return `meeting-with-${slug(config.hostName)}.ics`;
}

/** Escape per RFC 5545 text rules. */
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(input: IcsInput): string {
  const start = new Date(input.startInst);
  const end = new Date(input.startInst + input.durationMin * 60000);
  const desc = input.note?.trim()
    ? input.note.replace(/\n/g, " ")
    : `Booked via ${config.hostName}’s scheduling page`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OpenSlot//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${input.startInst}-${Math.abs(hashCode(input.email))}@openslot`,
    `DTSTAMP:${fmtUtc(new Date(input.startInst))}`,
    `DTSTART:${fmtUtc(start)}`,
    `DTEND:${fmtUtc(end)}`,
    `SUMMARY:${esc(`${input.durationMin} Minute Meeting with ${config.hostName}`)}`,
    "LOCATION:Google Meet",
    `DESCRIPTION:${esc(desc)}`,
    `ATTENDEE;CN=${esc(input.name || "Guest")}:mailto:${input.email || ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

// Stable, dependency-free uid component (avoids Date.now() nondeterminism).
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}
