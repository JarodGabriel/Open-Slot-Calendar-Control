// GET /api/availability?date=YYYY-MM-DD&durationMin=30
// Returns open start instants (ms epoch) for that host-zone calendar day.

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { instantFromHostWall } from "@/lib/timezone";
import { generateSlots } from "@/lib/calendar/slots";
import { getProvider, isDemoMode } from "@/lib/calendar";

export const dynamic = "force-dynamic"; // availability is never cacheable

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? "";
  const durationMin = Number(searchParams.get("durationMin") ?? "30");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing `date` (YYYY-MM-DD)." }, { status: 400 });
  }
  if (!Number.isFinite(durationMin) || durationMin <= 0 || durationMin > 24 * 60) {
    return NextResponse.json({ error: "Invalid `durationMin`." }, { status: 400 });
  }

  const [y, m, d] = date.split("-").map(Number);
  // Bound the free/busy query to the host's full calendar day.
  const fromISO = new Date(instantFromHostWall(y, m - 1, d, 0, 0, config.hostTz)).toISOString();
  const toISO = new Date(instantFromHostWall(y, m - 1, d, 23, 59, config.hostTz)).toISOString();

  try {
    const provider = getProvider();
    const busy = await provider.getBusy(fromISO, toISO);
    const slots = generateSlots({
      dateStr: date,
      durationMin,
      hostTz: config.hostTz,
      workStartHour: config.workStartHour,
      workEndHour: config.workEndHour,
      busy,
    });
    return NextResponse.json({ slots, demo: isDemoMode() });
  } catch (err) {
    console.error("availability error:", err);
    return NextResponse.json({ error: "Failed to load availability." }, { status: 502 });
  }
}
