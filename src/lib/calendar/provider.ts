// One provider interface, implemented by Google (real) and Demo (simulated).
// The /availability and /book API routes are provider-agnostic — swapping in a
// Microsoft Graph provider later only means writing another implementation.

export interface BusyRange {
  start: string; // ISO 8601
  end: string; // ISO 8601
}

export interface CreateEventInput {
  title: string;
  startISO: string;
  endISO: string;
  hostTz: string;
  attendeeEmail: string;
  attendeeName: string;
  note?: string;
}

export interface CreateEventResult {
  id: string;
  /** Meet/Teams join link, if the provider generated one. */
  meetingUrl?: string;
}

export interface CalendarProvider {
  /** The busy ranges on the host's calendar within [fromISO, toISO]. */
  getBusy(fromISO: string, toISO: string): Promise<BusyRange[]>;
  /** Create the event (with conferencing) and email the invite. */
  createEvent(input: CreateEventInput): Promise<CreateEventResult>;
}
