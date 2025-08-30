import { Challenge, Day } from "../types";

const DAY_MS = 86_400_000;

export function toISO(d: Date): string {
  return new Date(d.getTime()).toISOString();
}

/**
 * Due date for a day is the END of that day window.
 * Day 1 expires at start + 1 day (NOT start + 0).
 */
export function dueAtISO(startAtISO: string, dayNumber: number): string {
  const startMs = Date.parse(startAtISO);
  const ms = startMs + dayNumber * DAY_MS; // fix: + dayNumber, not (dayNumber - 1)
  return new Date(ms).toISOString();
}

export function currentDayIndex(startAtISO: string, now: Date = new Date()): number {
  const elapsed = Math.floor((now.getTime() - Date.parse(startAtISO)) / DAY_MS);
  const day = Math.min(Math.max(elapsed + 1, 1), 30);
  return day - 1; // 0-based index
}

export function isPastDay(day: Day, now: Date = new Date()): boolean {
  return now.getTime() > Date.parse(day.dueAt);
}

export function ensureDueAt(ch: Challenge): Challenge {
  ch.days.forEach((d) => {
    if (!d.dueAt) d.dueAt = dueAtISO(ch.startAt, d.dayNumber);
  });
  return ch;
}