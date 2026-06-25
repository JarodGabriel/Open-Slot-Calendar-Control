// Picks the real provider when Google is configured, the demo otherwise.

import type { CalendarProvider } from "./provider";
import { GoogleProvider, googleConfigured } from "./google";
import { DemoProvider } from "./demo";

export function getProvider(): CalendarProvider {
  return googleConfigured() ? new GoogleProvider() : new DemoProvider();
}

export function isDemoMode(): boolean {
  return !googleConfigured();
}

export type { CalendarProvider } from "./provider";
