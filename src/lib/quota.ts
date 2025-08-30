import { isoWeekKeyAndReset } from "./week";

const LIMIT = 5;
const NS = "ai.weeklyUsage.v1";

// This is client-side only for UX; the real limit must be enforced on the server.
export function getRemainingWeekly(userId: string): { remaining: number; limit: number; resetAt: string } {
  const { key, resetAt } = isoWeekKeyAndReset(new Date());
  const k = `${NS}.${userId}.${key}`;
  const used = Number(localStorage.getItem(k) || "0");
  const remaining = Math.max(0, LIMIT - used);
  return { remaining, limit: LIMIT, resetAt };
}

export function incrementWeekly(userId: string): void {
  const { key } = isoWeekKeyAndReset(new Date());
  const k = `${NS}.${userId}.${key}`;
  const used = Number(localStorage.getItem(k) || "0");
  localStorage.setItem(k, String(used + 1));
}