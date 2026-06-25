// GET /api/setup/events?key=<GOOGLE_CLIENT_SECRET>
// Diagnostic helper: shows recent events on the booking calendar with their
// attendees and invite/RSVP status, so we can see whether guests are being
// attached and notified. Gated behind the client secret. Read-only.

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { oauthClient } from "@/lib/calendar/google";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key");
  if (!process.env.GOOGLE_CLIENT_SECRET || key !== process.env.GOOGLE_CLIENT_SECRET) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    return NextResponse.json({ error: "Not connected to Google yet." }, { status: 400 });
  }

  try {
    const auth = oauthClient();
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      calendarId: config.calendarId,
      timeMin: new Date(Date.now() - 3 * 86400000).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = (res.data.items ?? []).map((e) => ({
      id: e.id,
      summary: e.summary,
      start: e.start?.dateTime ?? e.start?.date,
      status: e.status,
      organizer: e.organizer?.email,
      hangoutLink: e.hangoutLink ?? null,
      attendees: (e.attendees ?? []).map((a) => ({
        email: a.email,
        responseStatus: a.responseStatus,
        organizer: a.organizer ?? false,
        self: a.self ?? false,
      })),
    }));
    return NextResponse.json({ count: events.length, calendarId: config.calendarId, events });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
