// GET /api/setup/calendars?key=<GOOGLE_CLIENT_SECRET>
// Setup helper: lists every calendar the connected Google account can see, so
// you can find the IDs to put in HOST_CALENDAR_ID / HOST_BUSY_CALENDAR_IDS.
// Gated behind GOOGLE_CLIENT_SECRET (a value only the operator knows) so the
// list isn't public. Read-only; returns nothing without the right key.

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { oauthClient } from "@/lib/calendar/google";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key");
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret || key !== secret) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    return NextResponse.json({ error: "Not connected to Google yet." }, { status: 400 });
  }

  try {
    const auth = oauthClient();
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.calendarList.list({ maxResults: 250, showHidden: true });
    const calendars = (res.data.items ?? []).map((c) => ({
      id: c.id,
      summary: c.summary,
      primary: c.primary ?? false,
      accessRole: c.accessRole,
    }));
    return NextResponse.json({ count: calendars.length, calendars });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
