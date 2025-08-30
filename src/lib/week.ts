function pad(n: number, w = 2) {
    return n.toString().padStart(w, "0");
  }
  
  // ISO week key "YYYY-Www" and reset date (start of next ISO week) in ISO string
  export function isoWeekKeyAndReset(date = new Date()): { key: string; resetAt: string } {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    // Thursday in current week decides the year
    const day = (d.getUTCDay() + 6) % 7; // 0..6 Mon..Sun
    d.setUTCDate(d.getUTCDate() + 3 - day);
    const week1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
    const week = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getUTCDay() + 6) % 7)) / 7);
    const year = d.getUTCFullYear();
  
    // Start of next ISO week (Monday 00:00 UTC)
    const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const day2 = (monday.getUTCDay() + 6) % 7;
    monday.setUTCDate(monday.getUTCDate() - day2 + 7);
    monday.setUTCHours(0, 0, 0, 0);
  
    return { key: `${year}-W${pad(week)}`, resetAt: monday.toISOString() };
  }