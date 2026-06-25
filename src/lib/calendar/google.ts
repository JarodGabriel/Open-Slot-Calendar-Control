// Google Calendar provider. Reads free/busy and creates events with a Google
// Meet link, authenticating as the host via a stored OAuth refresh token (so
// visitors never sign in). Server-side only — never import from a client file.

import { google } from "googleapis";
import { config } from "../config";
import type {
  CalendarProvider,
  BusyRange,
  CreateEventInput,
  CreateEventResult,
} from "./provider";

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

export function googleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN,
  );
}

/** OAuth2 client. With no refresh token it can still build a consent URL. */
export function oauthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback",
  );
}

function calendarClient() {
  const auth = oauthClient();
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: "v3", auth });
}

export class GoogleProvider implements CalendarProvider {
  async getBusy(fromISO: string, toISO: string): Promise<BusyRange[]> {
    const calendar = calendarClient();
    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: fromISO,
        timeMax: toISO,
        items: [{ id: config.calendarId }],
      },
    });
    const cal = res.data.calendars?.[config.calendarId];
    const busy = cal?.busy ?? [];
    return busy
      .filter((b): b is { start: string; end: string } => Boolean(b.start && b.end))
      .map((b) => ({ start: b.start, end: b.end }));
  }

  async createEvent(input: CreateEventInput): Promise<CreateEventResult> {
    const calendar = calendarClient();
    const requestId = `${input.startISO}-${input.attendeeEmail}`.replace(/[^a-zA-Z0-9]/g, "").slice(0, 64);

    const res = await calendar.events.insert({
      calendarId: config.calendarId,
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary: input.title,
        description: input.note?.trim() || undefined,
        start: { dateTime: input.startISO, timeZone: input.hostTz },
        end: { dateTime: input.endISO, timeZone: input.hostTz },
        attendees: [{ email: input.attendeeEmail, displayName: input.attendeeName }],
        conferenceData: {
          createRequest: {
            requestId,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        reminders: { useDefault: true },
      },
    });

    return {
      id: res.data.id ?? "",
      meetingUrl: res.data.hangoutLink ?? undefined,
    };
  }
}
