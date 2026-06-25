# Handoff: Personal Scheduling Page ("Calendly, but yours")

## Overview
A single-page, Calendly-style personal booking page for **Jarod Gabriel M. (Paid Media Manager)**. A visitor:
1. Picks a meeting length (15 / 30 / 60 / custom minutes),
2. Picks a day on a real month calendar,
3. Picks a time (shown in **their own** auto-detected time zone),
4. Enters name / email / an optional note,
5. Confirms and lands on a "You are scheduled" screen with an **Add to calendar** (.ics) download.

The signature touch: **each meeting length has its own brand color**, and that color flows through the entire right-hand calendar — available days, the selected day, the time slots, the "Next" button, and the selected length row all recolor to match.

---

## About the Design Files
The file in this bundle — **`Scheduler.dc.html`** — is a **design reference created in HTML**. It is a working prototype that demonstrates the intended look, layout, copy, and interaction model. **It is not production code to copy directly.**

Your task is to **recreate this design in the target codebase's existing environment** (React, Vue, Svelte, SwiftUI, native, etc.) using that project's established component patterns, styling approach, and libraries. If no environment exists yet, choose the most appropriate framework (a React + TypeScript SPA, or Next.js if you want the calendar API calls to run server-side — recommended, see "Why a backend is required" below) and implement there.

> Note on the prototype's internals: the HTML file is authored in a small in-house "Design Component" runtime (`<x-dc>`, `support.js`, a `Component extends DCLogic` class). **Ignore that runtime entirely.** It is a prototyping harness, not part of the design. One quirk worth knowing: the prototype recolors the calendar by injecting a scoped `!important` stylesheet at runtime (a workaround for that harness). **In a real framework you do NOT need this hack** — just bind the accent color into your component styles normally (inline style, CSS variable, styled-components prop, etc.). The hack exists only because the prototype runtime froze inline style updates on list items.

---

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, and interactions are all specified below and should be recreated faithfully. Exact hex values, px sizes, and copy are given. Recreate pixel-close using the codebase's own primitives.

---

## Layout (overall)

A centered **card**, max-width **1060px**, min-height **660px**, on a page with background `#eef1f5` and `40px 24px` padding.

- Card: `background:#fff`, `border:1px solid #e7ebf0`, `border-radius:16px`, `box-shadow:0 1px 2px rgba(20,40,80,.04), 0 22px 60px rgba(20,40,80,.12)`, `overflow:hidden`, `display:flex`.
- **Left rail**: fixed width **336px**, `padding:30px 30px 26px`, `border-right:1px solid #eef1f4`, vertical flex column.
- **Right panel**: `flex:1`, `padding:30px 32px`, vertical flex column. This is where the step content (calendar / form / confirmation) renders.

Font family throughout: **`'Public Sans'`**, weights 300–700 (Google Fonts), fallback `-apple-system, 'Segoe UI', sans-serif`. `-webkit-font-smoothing:antialiased`.

---

## Screens / Views

There is **one route** with three sequential steps controlled by state (`step ∈ {'select','details','done'}`). The left rail persists; only its lower content and the right panel swap.

### Left rail (persistent)
- **Avatar**: 46×46 circle, `background:linear-gradient(135deg,#2563eb,#1a45c0)`, white initials "JM", 16px/600.
- **Name**: "Jarod Gabriel M." — 13px/500, color `#7a8794`.
- **Tagline**: *"I'm listening."* — 12px italic, color `#9aa3ad`.
- **Google Meet line** (directly under name): video icon + "Google Meet — link sent on confirmation", 12.5px, `#5a6573`.
- **Meeting title**: e.g. "30 Minute Meeting" — 25px/700, `#15233a`, `letter-spacing:-0.02em`. Text updates live with the chosen length ("Custom Minute Meeting" when custom).

**During `select` step**, the rail also shows the **Meeting length** chooser (see Components). **During `details`/`done`**, it instead shows a summary block: duration (clock icon), date+time range (calendar icon), and time zone (globe icon), each 14px/600 `#46505c`.

### Step 1 — `select`: Calendar + Times (right panel)
- Header row: title **"Select a Date & Time"** (21px/700, `#15233a`) on the left; **time-zone dropdown** on the right (see Components).
- Body is a 2-column flex (`gap:30px`):
  - **Calendar** (fixed 352px): month label (e.g. "June 2026", 16px/600) + prev/next chevron buttons; weekday header row (SUN…SAT, 11px/600 `#9aa3ad`); a 7-column grid of day cells.
  - **Times** (flex:1): shown only after a day is selected. Shows the long date ("Thursday, June 25", 15px/600) + an "N open times" caption (12.5px `#9aa3ad`), then a vertical scrolling list of time buttons. Before a day is picked, shows an empty-state (calendar icon + "Pick a day to see open times").
- Footer is omitted on this step; advancing happens via the **Next** button that appears next to a selected time.

### Step 2 — `details`: Form (right panel)
- Title "Enter Details" (21px/700).
- Fields (max-width 440px, `gap:18px`): **Name*** , **Email***, and a textarea "Please share anything that will help prepare for our meeting". Inputs: `border:1.5px solid #d4dae1`, `border-radius:9px`, `padding:12px 13px`, 14.5px.
- Helper line (12px `#9aa3ad`) about the Meet invite.
- **Schedule Event** button (full pattern below). Disabled until name is non-empty AND email matches `/.+@.+\..+/`.
- A **Back** button (circular, top-left of the rail) returns to `select`.

### Step 3 — `done`: Confirmation (right panel)
- Centered: green check badge (62px circle, `background:#eafaf0`, `border:1px solid #c9efd8`, check stroke `#22a35c`).
- "You are scheduled" (24px/700) + "A calendar invitation has been sent to **{email}**." (14px `#5a6573`).
- A bordered recap card (`border:1px solid #e6eaef`, `radius:13px`) listing: meeting title, date+time range, time zone, and "Google Meet".
- Buttons: **Add to calendar** (primary) and **Schedule another** (secondary).

---

## Components (exact specs)

### Meeting-length selector (radio rows)
Four rows, each a full-width button: `display:flex; align-items:center; gap:11px; padding:11px 13px; border-radius:10px; border:1.5px solid <border>; background:<bg>; transition:all .13s`.
- A radio ring (18px circle, `border:2px solid <option color>`) with an 8px inner dot filled with the option color when selected.
- Title (14.5px/600) + a right-aligned blurb (12.5px/500 `#8a96a3`): "Quick sync" / "Standard" / "Deep dive" / "Your call".
- **When selected**, the row uses the option's color for its border and the option's tint for its background. When not selected: `border:#e4e8ed; background:#fff`.
- Selecting "Custom length" reveals a number input (`width:72px`) + "minutes".

### The four meeting lengths and their colors  ← the core of the design
| Length | Title | Accent (hex) | Tint (hex) | Blurb |
|---|---|---|---|---|
| 15 min | "15 minutes" | `#6495ED` (cornflower blue) | `#eef3fd` | Quick sync |
| 30 min | "30 minutes" | `#9C4DC8` (royal orchid) | `#f5edfa` | Standard |
| 60 min | "60 minutes" | `#386641` (fir / dark green) | `#e8efea` | Deep dive |
| Custom | "Custom length" | `#B0623C` (pottery clay) | `#f7eee8` | Your call |

The **active length's accent + tint** is the theme for the entire calendar column (below). Default selected length on load: **30 minutes** (orchid).

### Day cell (calendar)
38×38, `border-radius:50%`, 14px/600, centered, `transition:all .12s`. Four visual states:
- **available**: `background:<active tint>`, `color:<active accent>`, clickable.
- **selected**: `background:<active accent>`, `color:#fff`, `box-shadow:0 0 0 3px <accent at 20% alpha>`.
- **disabled** (past days, weekends): `color:#c2cad3`, not clickable, 400 weight.
- **empty** (leading/trailing grid blanks): hidden.

Availability rule in the prototype: tomorrow onward, weekdays only (weekends disabled; configurable). Past months' prev-arrow is disabled.

### Time slot button
`padding:13px 4px; border-radius:10px; border:1.5px solid; 14.5px/600; text-align:center`.
- **open**: `background:#fff`, `color:<active accent>`, `border-color:<accent at 35% alpha>`.
- **selected**: `background:<active accent>`, `color:#fff`, `border-color:<active accent>`. When a slot is selected, a **Next** button slides in beside it (`flex:1`, `background:<active accent>`, white, `border-radius:10px`, "Next").

### Time-zone dropdown (custom, not native `<select>`)
Trigger: `display:flex; gap:8px; background:#f4f6f9; border:1px solid #e4e8ed; border-radius:10px; padding:9px 12px` with a globe icon, the zone label (13px/600), and a chevron that rotates 180° when open. Opens a panel (`width:272px`, `max-height:296px`, scrolling, `border-radius:12px`, `box-shadow:0 14px 38px rgba(20,40,80,.18)`) listing zones; the selected one shows a check (`#1a45c0`). A full-screen transparent overlay closes it on outside-click. Defaults to the visitor's auto-detected IANA zone; if it isn't in the curated list it's prepended as "(your time zone)".

### Buttons
- **Primary** (Schedule Event / Add to calendar): white text, `background:#1a45c0` (enabled) / `#aab8e0` (disabled), `border-radius:9–10px`, `padding:11–13px`, 14–15px/600.
- **Secondary** (Schedule another / Start over): `color:#5a6573; background:#fff; border:1px solid #d4dae1; radius:10px`.
- **Back**: 34px circle, `border:1px solid #e2e7ec`, chevron-left `#5a6573`.

---

## Interactions & Behavior
- **Pick length** → updates meeting title, recolors the whole calendar column, clears any selected time.
- **Pick day** → loads that day's time slots (converted to the active time zone), clears selected time.
- **Pick time** → highlights the slot and reveals **Next**. Next → `details`.
- **Schedule Event** → validates, fires the create-event call, → `done`.
- **Time-zone change** → re-renders every slot label in the new zone (the underlying instant is unchanged). Auto-detected on load via `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- **Add to calendar** → downloads an `.ics` (VEVENT with summary, start/end UTC, attendee, `LOCATION:Google Meet`, note as description).
- Transitions are subtle: `all .12–.13s` on cells, rows, slots; chevron rotate `.15s`.

## State Management
State variables: `step`, `duration` (number | `'custom'`), `customMins`, `viewYear`, `viewMonth`, `selDate` (Date | null), `selTime` ({inst:ms,label} | null), `tz` (IANA string), `name`, `email`, `note`.
- Times are stored as **absolute instants (ms epoch)** so time-zone display is just a formatting concern — keep this; it's what makes cross-zone conversion correct.
- `canNext` gating per step; email regex `/.+@.+\..+/`.

---

## Time-zone conversion (important, keep this logic)
Host availability is defined in the **host's** zone (default `America/Los_Angeles`, 09:00–17:00). For each candidate slot the prototype builds the **absolute UTC instant** for that host wall-clock time, then formats that instant in the **visitor's** zone for display. This makes a 9:00am PT slot correctly read as 12:00pm ET / 5:00pm London / 1:00am Tokyo. Helper approach (no library needed, but **Luxon/date-fns-tz is recommended in production**):
```
offsetMin(date, tz): use Intl.DateTimeFormat(..,{timeZone:tz,...}).formatToParts to get the
  wall-clock parts, rebuild as UTC, subtract from date.getTime() → minutes offset.
instantFromHostWall(y,m,d,hh,mm): guess = Date.UTC(...); correct twice using offsetMin(guess, HOST_TZ).
formatTime(inst, viewerTz): Intl.DateTimeFormat('en-US',{timeZone:viewerTz,hour:'numeric',minute:'2-digit',hour12:true}).
```

---

## Design Tokens
**Colors**
- Page bg `#eef1f5`; card `#fff`; card border `#e7ebf0`; hairlines `#eef1f4` / `#f0f2f5`.
- Ink: `#15233a` (headings), `#46505c`, `#5a6573`, `#7a8794`, `#8a96a3`, `#9aa3ad` (muted), `#c2cad3` (disabled).
- Primary action `#1a45c0` (disabled `#aab8e0`); accent-secondary blue `#2456c4`.
- Input border `#d4dae1`; required asterisk `#d04646`.
- Success `#22a35c` on `#eafaf0` / border `#c9efd8`.
- **Meeting accents** (see table): `#6495ED`, `#9C4DC8`, `#386641`, `#B0623C` + their tints.
- Avatar gradient `#2563eb → #1a45c0`.

**Type** — Public Sans. Sizes used: 25/24/21/20/19/16/15/14.5/14/13/12.5/12/11.5/11 px. Weights 400/500/600/700. Heading letter-spacing −0.01 to −0.02em.

**Radius** — 16 (card), 13 (recap), 12 (tz panel), 10 (rows/slots/buttons), 9 (inputs), 8, 50% (avatar/day cells).

**Shadows** — card `0 1px 2px rgba(20,40,80,.04), 0 22px 60px rgba(20,40,80,.12)`; tz panel `0 14px 38px rgba(20,40,80,.18)`; selected-day ring `0 0 0 3px <accent@20%>`.

**Spacing** — rail padding `30/30/26`; panel padding `30/32`; common gaps 8–18px; calendar grid gap 2px.

## Assets
- **Font**: Public Sans via Google Fonts. Use the codebase's font-loading convention.
- **Icons**: simple inline SVG strokes (calendar, clock, globe, video/Meet, check, chevrons). Replace with the codebase's icon library (Lucide/Heroicons/etc.) — shapes match Lucide closely.
- No raster images or logos. (No headshot yet — leave the "JM" monogram avatar or wire a real image later.)

## Files
- `Scheduler.dc.html` — the full hi-fi design reference (markup + logic + the four meeting-length color definitions live in `durOpts`).

---

# Backend & Calendar Integration

## Why a backend is required
The prototype's calendar sync is **stubbed** — availability is simulated and "create event" is a no-op. A real integration **cannot** be done from the browser alone:
- OAuth **client secrets** and **refresh tokens** must never ship to the client.
- Free/busy lookups and event creation should run server-side (a Node/Next.js API route, serverless function, or any backend).

Recommended shape: a small backend that (1) holds Jarod's OAuth tokens for **his** calendar, (2) exposes `GET /availability?from&to&durationMin&tz` returning open slots, and (3) exposes `POST /book` that creates the event + meeting link and emails the invite. The front-end calls these two endpoints; it never talks to Google/Microsoft directly.

The prototype already marks the three integration seams in `Scheduler.dc.html` (search for **"GOOGLE CALENDAR HOOKS"**): `connectGoogle()`, `fetchBusy()`, `createEvent()`. Map them to the endpoints above.

---

## Option A — Google Calendar

**APIs / scopes**
- Google Calendar API. Scopes: `https://www.googleapis.com/auth/calendar.events` (write) and `https://www.googleapis.com/auth/calendar.readonly` or `.../auth/calendar.freebusy` (read availability).
- Auth: Google Identity Services / OAuth 2.0. For a one-host scheduler, a **service account with domain-wide delegation** OR a stored **refresh token** for Jarod's account is typical, so visitors never sign in.

**Availability** — `POST https://www.googleapis.com/calendar/v3/freeBusy` with `{ timeMin, timeMax, items:[{id:'primary'}] }`. Subtract the returned `busy` ranges from Jarod's working hours (09:00–17:00 host tz) sliced into `durationMin` increments. Return the open instants to the client (which formats them in the visitor's tz).

**Create event** — `POST .../calendar/v3/calendars/primary/events?conferenceDataVersion=1`:
```json
{
  "summary": "30 Minute Meeting with Jarod Gabriel M.",
  "description": "<visitor note>",
  "start": { "dateTime": "<ISO>", "timeZone": "America/Los_Angeles" },
  "end":   { "dateTime": "<ISO>", "timeZone": "America/Los_Angeles" },
  "attendees": [{ "email": "<visitor email>" }],
  "conferenceData": { "createRequest": { "requestId": "<uuid>",
      "conferenceSolutionKey": { "type": "hangoutsMeet" } } },
  "reminders": { "useDefault": true }
}
```
Setting `conferenceData.createRequest` auto-generates the **Google Meet** link shown on the confirmation screen. Google emails the invite to the attendee automatically (`sendUpdates=all`).

**Libraries**: `googleapis` (Node) or `google-auth-library` + REST.

---

## Option B — Microsoft / Outlook ("Windows" calendar)

"Windows calendar" = the Outlook/Microsoft 365 calendar via **Microsoft Graph**.

**APIs / scopes**
- Microsoft Graph. Delegated/app scopes: `Calendars.ReadWrite` (+ `OnlineMeetings.ReadWrite` if you want a Teams link). Auth via **MSAL** / Azure AD app registration; store Jarod's tokens server-side.

**Availability** — `POST https://graph.microsoft.com/v1.0/me/calendar/getSchedule` with `{ schedules:["jarod@…"], startTime, endTime, availabilityViewInterval:30 }`, or `findMeetingTimes`. Subtract busy blocks from working hours, same as Google.

**Create event** — `POST https://graph.microsoft.com/v1.0/me/events`:
```json
{
  "subject": "30 Minute Meeting with Jarod Gabriel M.",
  "body": { "contentType": "text", "content": "<visitor note>" },
  "start": { "dateTime": "<ISO>", "timeZone": "Pacific Standard Time" },
  "end":   { "dateTime": "<ISO>", "timeZone": "Pacific Standard Time" },
  "attendees": [{ "emailAddress": { "address": "<visitor email>", "name": "<visitor>" },
                  "type": "required" }],
  "isOnlineMeeting": true,
  "onlineMeetingProvider": "teamsForBusiness"
}
```
`isOnlineMeeting:true` generates a **Teams** join link (swap the confirmation copy from "Google Meet" → "Microsoft Teams"). Note Graph uses **Windows time-zone names** ("Pacific Standard Time"), not IANA — convert with a small map or `@microsoft/microsoft-graph` helpers.

**Libraries**: `@azure/msal-node` + `@microsoft/microsoft-graph-client`.

---

## Option C — Both (recommended abstraction)
Define one provider interface and implement it twice:
```ts
interface CalendarProvider {
  getBusy(fromISO: string, toISO: string): Promise<{start:string; end:string}[]>;
  createEvent(input: {
    title: string; startISO: string; endISO: string; hostTz: string;
    attendeeEmail: string; attendeeName: string; note?: string;
  }): Promise<{ id: string; meetingUrl?: string }>;
}
```
`GoogleProvider` and `MicrosoftProvider` implement it; your `/availability` and `/book` routes are provider-agnostic. Let Jarod connect either (or both) account(s); the confirmation screen reads `meetingUrl` and labels it Meet or Teams accordingly. Everything in the front-end (the four color themes, the calendar, the tz conversion) stays identical regardless of provider.

---

## Implementation checklist
- [ ] Recreate the card layout + left rail + three steps in the target framework.
- [ ] Implement the four meeting-length color themes (table above) and thread the active accent/tint through day cells, time slots, Next button, and the selected length row — via normal styling (no runtime `!important` hack).
- [ ] Real month calendar with availability rules; custom time-zone dropdown; visitor-tz auto-detect.
- [ ] Keep instant-based time storage + the host-wall-clock → visitor-tz conversion.
- [ ] Stand up the backend: OAuth/token storage, `/availability` (free/busy), `/book` (create event + meeting link + email invite).
- [ ] Wire `connectGoogle` / `fetchBusy` / `createEvent` seams to the endpoints; choose Google, Microsoft, or both via the provider interface.
- [ ] Keep the `.ics` download as a provider-independent fallback.
- [ ] Replace inline SVGs with the codebase's icon set; load Public Sans via the codebase's convention.
