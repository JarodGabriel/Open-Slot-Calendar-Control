// Central configuration, sourced from environment variables with sensible
// defaults. NEXT_PUBLIC_* values are inlined into the browser bundle and are
// safe to read on both client and server. The non-public values (working hours,
// calendar id) are only meaningful server-side; on the client they fall back to
// the defaults below, which is fine because the client never relies on them.

function num(v: string | undefined, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function list(v: string | undefined): string[] {
  return (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const calendarId = process.env.HOST_CALENDAR_ID || "primary";

// Conferencing options offered at booking. Comma-separated, first is default.
// "meet" auto-generates a Google Meet link; "zoom" uses ZOOM_MEETING_URL.
const ALL_MEETING_TYPES = ["meet", "zoom"] as const;
export type MeetingType = (typeof ALL_MEETING_TYPES)[number];
export const MEETING_LABELS: Record<MeetingType, string> = {
  meet: "Google Meet",
  zoom: "Zoom",
};
const requestedTypes = list(process.env.NEXT_PUBLIC_MEETING_OPTIONS).filter(
  (t): t is MeetingType => (ALL_MEETING_TYPES as readonly string[]).includes(t),
);

export const config = {
  // Public — display
  hostName: process.env.NEXT_PUBLIC_HOST_NAME || "Jarod Gabriel M.",
  hostInitials: process.env.NEXT_PUBLIC_HOST_INITIALS || "JM",
  // Optional: leave unset/empty to show no tagline at all.
  hostTagline: process.env.NEXT_PUBLIC_HOST_TAGLINE ?? "",
  allowWeekends: (process.env.NEXT_PUBLIC_ALLOW_WEEKENDS || "false") === "true",

  // Server — availability
  hostTz: process.env.HOST_TIMEZONE || "America/Los_Angeles",
  workStartHour: num(process.env.WORK_START_HOUR, 9),
  workEndHour: num(process.env.WORK_END_HOUR, 17),

  // The calendar new bookings are CREATED on.
  calendarId,
  // Every calendar checked for conflicts (free/busy). The booking calendar is
  // always included; HOST_BUSY_CALENDAR_IDS adds extra calendars (comma-
  // separated IDs) so a busy block on ANY of them removes the slot.
  busyCalendarIds: Array.from(new Set([calendarId, ...list(process.env.HOST_BUSY_CALENDAR_IDS)])),

  // Conferencing — which options the booker can pick (defaults to Google Meet).
  meetingOptions: (requestedTypes.length ? requestedTypes : ["meet"]) as MeetingType[],
  // Fixed Zoom link (Personal Meeting Room) used when "zoom" is chosen.
  zoomUrl: process.env.ZOOM_MEETING_URL || "",
} as const;
