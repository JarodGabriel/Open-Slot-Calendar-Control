// GET /api/auth/google/callback?code=...
// Exchanges the consent code for tokens and shows the refresh token so you can
// paste it into .env.local as GOOGLE_REFRESH_TOKEN. Shown once; not persisted.

import { NextRequest, NextResponse } from "next/server";
import { oauthClient } from "@/lib/calendar/google";

export const dynamic = "force-dynamic";

function page(body: string): NextResponse {
  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
     <title>Google Calendar — connect</title>
     <body style="font-family:'Public Sans',-apple-system,'Segoe UI',sans-serif;background:#eef1f5;margin:0;padding:48px 24px;color:#15233a;">
     <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e7ebf0;border-radius:16px;padding:32px;box-shadow:0 22px 60px rgba(20,40,80,.12);">${body}</div>
     </body>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const error = searchParams.get("error");
  const code = searchParams.get("code");

  if (error) return page(`<h1>Consent denied</h1><p>Google returned: <code>${error}</code></p>`);
  if (!code) return page(`<h1>Missing code</h1><p>Start the flow at <code>/api/auth/google</code>.</p>`);

  try {
    const { tokens } = await oauthClient().getToken(code);
    if (!tokens.refresh_token) {
      return page(
        `<h1>No refresh token returned</h1>
         <p>Google only issues one on the first consent. Revoke this app's access at
         <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>,
         then visit <code>/api/auth/google</code> again.</p>`,
      );
    }
    return page(
      `<h1>✅ Connected</h1>
       <p>Add this line to your <code>.env.local</code>, then restart the dev server:</p>
       <pre style="background:#f4f6f9;border:1px solid #e4e8ed;border-radius:10px;padding:14px;white-space:pre-wrap;word-break:break-all;font-size:13px;">GOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"</pre>
       <p style="color:#5a6573;font-size:14px;">Keep this secret. It grants access to your calendar. It is shown only once here and is not stored by the app.</p>`,
    );
  } catch (err) {
    console.error("oauth callback error:", err);
    return page(`<h1>Token exchange failed</h1><p>Check that your redirect URI exactly matches the one on your OAuth client.</p>`);
  }
}
