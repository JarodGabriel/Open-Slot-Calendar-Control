// GET /api/auth/google
// One-time setup: redirects the HOST (you) to Google's consent screen to grant
// calendar access. The callback then hands back a long-lived refresh token to
// paste into .env.local. Visitors never hit this — only you, once.

import { NextResponse } from "next/server";
import { oauthClient, GOOGLE_SCOPES } from "@/lib/calendar/google";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first." },
      { status: 400 },
    );
  }
  const url = oauthClient().generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // force a refresh_token every time
    scope: GOOGLE_SCOPES,
  });
  return NextResponse.redirect(url);
}
