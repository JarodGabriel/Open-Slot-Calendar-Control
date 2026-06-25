// One provider interface, implemented by Google (real) and Demo (simulated).
// The /availability and /book API routes are provider-agnostic — swapping in a
// Microsoft Graph provider later only means writing another implementation.

export interface BusyRange {
  start: string; // ISO 8601
  end: string; // ISO 8601
}

/** How the meeting is held. "meet" auto-generates a Google Meet link; "zoom"
 *  attaches a fixed Zoom URL; "none" adds no video link. */
export type Conferencing = { type: "meet" } | { type: "zoom"; url: string } | { type: "none" };

export interface CreateEventInput {
  /** Optional caller-chosen event id (so reschedule/cancel links can be built
   *  up front). Must be a valid Google event id ([a-v0-9], 5–1024 chars). */
  id?: string;
  title: string;
  startISO: string;
  endISO: string;
  hostTz: string;
  attendeeEmail: string;
  attendeeName: string;
  note?: string;
  /** Defaults to Google Meet when omitted. */
  conferencing?: Conferencing;
}

export interface CreateEventResult {
  id: string;
  /** Meet/Teams join link, if the provider generated one. */
  meetingUrl?: string;
}

export interface EventInfo {
  id: string;
  title: string;
  startISO: string;
  endISO: string;
  attendeeEmail?: string;
  meetingUrl?: string;
}

export interface CalendarProvider {
  /** The busy ranges on the host's calendar within [fromISO, toISO]. */
  getBusy(fromISO: string, toISO: string): Promise<BusyRange[]>;
  /** Create the event (with conferencing) and email the invite. */
  createEvent(input: CreateEventInput): Promise<CreateEventResult>;
  /** Fetch a single event, or null if missing/cancelled. */
  getEvent(eventId: string): Promise<EventInfo | null>;
  /** Move an event to a new time and notify the guest. */
  updateEventTime(eventId: string, startISO: string, endISO: string, hostTz: string): Promise<void>;
  /** Cancel/delete an event and notify the guest. */
  cancelEvent(eventId: string): Promise<void>;
}
