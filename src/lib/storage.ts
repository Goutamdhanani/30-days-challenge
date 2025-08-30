import { Challenge, Day, Task } from "../types";
import { currentDayIndex, dueAtISO, ensureDueAt, toISO } from "./date";

const KEY = "challenges.v1";

type Store = {
  list: Challenge[];
  latestId?: string;
};

function readStore(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { list: [] };
    return JSON.parse(raw) as Store;
  } catch {
    return { list: [] };
  }
}

function writeStore(s: Store) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

export function saveChallenge(ch: Challenge) {
  const s = readStore();
  const i = s.list.findIndex((x) => x.id === ch.id);
  if (i >= 0) s.list[i] = ch;
  else s.list.push(ch);
  s.latestId = ch.id;
  writeStore(s);
}

export function getChallenge(id: string): Challenge | undefined {
  const s = readStore();
  const ch = s.list.find((x) => x.id === id);
  return ch ? ensureDueAt(structuredClone(ch)) : undefined;
}

export function getLatestChallengeId(): string | undefined {
  return readStore().latestId;
}

export function listChallenges(): Challenge[] {
  const s = readStore();
  return s.list.map((c) => ensureDueAt(structuredClone(c)));
}

export function deleteChallenge(id: string) {
  const s = readStore();
  s.list = s.list.filter((x) => x.id !== id);
  if (s.latestId === id) s.latestId = s.list.at(-1)?.id;
  writeStore(s);
}

/**
 * Immediate local challenge using user's input as Day 1 Task 1.
 * - No network calls.
 * - All 30 days are created with status: "pending".
 * - Day 1 tasks:
 *    1) <userInput>
 *    2) "Do one small step"
 *    3) "Reflect for 5 minutes"
 */
export function createLocalChallengeFromInput(userInput: string): Challenge {
  const input = userInput.trim() || "My goal for Day 1";
  const start = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const id = uid("ch");

  const days: Day[] = Array.from({ length: 30 }, (_, i) => ({
    dayNumber: i + 1,
    dueAt: dueAtISO(start.toISOString(), i + 1),
    tasks: [],
    status: "pending",
    xpReward: 100,
    estMinutes: 30
  }));

  const day1Tasks: Task[] = [
    { id: uid("t"), title: input, percent: 40, completed: false },
    { id: uid("t"), title: "Do one small step", percent: 40, completed: false },
    { id: uid("t"), title: "Reflect for 5 minutes", percent: 20, completed: false }
  ];
  days[0].tasks = day1Tasks;

  const ch: Challenge = {
    id,
    title: userInput.trim() || "My 30 Day Challenge",
    prompt: userInput,
    startAt: start.toISOString(),
    timezone: tz,
    days,
    xp: 0,
    createdAt: toISO(start),
    updatedAt: toISO(start)
  };

  saveChallenge(ch);
  return ch;
}

/**
 * Legacy/basic creators kept for other flows.
 */
export function createChallenge(title: string, prompt: string): Challenge {
  const start = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const id = uid("ch");
  const days: Day[] = Array.from({ length: 30 }, (_, i) => ({
    dayNumber: i + 1,
    dueAt: dueAtISO(start.toISOString(), i + 1),
    tasks: [],
    status: "pending",
    xpReward: 100,
    estMinutes: 30
  }));
  const baseTasks: Task[] = [
    { id: uid("t"), title: `Plan: ${title}`, percent: 40, completed: false },
    { id: uid("t"), title: "Do one small step", percent: 40, completed: false },
    { id: uid("t"), title: "Reflect for 5 minutes", percent: 20, completed: false }
  ];
  days[0].tasks = baseTasks;

  const ch: Challenge = {
    id,
    title,
    prompt,
    startAt: start.toISOString(),
    timezone: tz,
    days,
    xp: 0,
    createdAt: toISO(start),
    updatedAt: toISO(start)
  };
  saveChallenge(ch);
  return ch;
}

export function createDefaultFitnessChallenge(): Challenge {
  const start = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const id = uid("chfit");
  const title = "Daily Fitness (30 Days)";
  const prompt = "Default daily fitness plan: push-ups, squats, plank, walk, stretch.";

  const days: Day[] = Array.from({ length: 30 }, (_, i) => {
    const dayNo = i + 1;
    const pushUps = 10 + Math.floor(i * 0.8);
    const squats = 15 + Math.floor(i * 1.0);
    const plankSec = 30 + i * 3;
    const walkMin = 15 + Math.floor(i * 0.5);
    const tasks: Task[] = [
      { id: uid("t"), title: `${pushUps} push-ups`, percent: 25, completed: false },
      { id: uid("t"), title: `${squats} squats`, percent: 25, completed: false },
      { id: uid("t"), title: `Plank ${plankSec}s`, percent: 20, completed: false },
      { id: uid("t"), title: `Walk ${walkMin} min`, percent: 20, completed: false },
      { id: uid("t"), title: "Full-body stretch 5 min", percent: 10, completed: false }
    ].slice(0, 5);

    return {
      dayNumber: dayNo,
      dueAt: dueAtISO(start.toISOString(), dayNo),
      tasks,
      status: "pending",
      xpReward: 120,
      estMinutes: 25
    };
  });

  const ch: Challenge = {
    id,
    title,
    prompt,
    startAt: start.toISOString(),
    timezone: tz,
    days,
    xp: 0,
    createdAt: toISO(start),
    updatedAt: toISO(start)
  };
  saveChallenge(ch);
  return ch;
}

export function createChallengeFromPlan(
  title: string,
  prompt: string,
  dayPlans: Array<Pick<Day, "dayNumber" | "tasks" | "xpReward" | "estMinutes">>
): Challenge {
  const start = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const id = uid("ch");

  const days: Day[] = Array.from({ length: 30 }, (_, i) => {
    const plan = dayPlans.find((d) => d.dayNumber === i + 1);
    const tasks = (plan?.tasks ?? []).slice(0, 5).map((t) => ({ ...t, id: uid("t"), completed: false }));
    let sum = tasks.reduce((acc, t) => acc + (typeof (t as any).percent === "number" ? (t as any).percent : 0), 0);
    if (tasks.length && sum !== 100) {
      const even = Math.floor(100 / tasks.length);
      tasks.forEach((t, idx) => ((t as any).percent = idx === tasks.length - 1 ? 100 - even * (tasks.length - 1) : even));
    }
    return {
      dayNumber: i + 1,
      dueAt: dueAtISO(start.toISOString(), i + 1),
      tasks,
      status: "pending",
      xpReward: plan?.xpReward ?? 120,
      estMinutes: plan?.estMinutes ?? 25
    };
  });

  const ch: Challenge = {
    id,
    title,
    prompt,
    startAt: start.toISOString(),
    timezone: tz,
    days,
    xp: 0,
    createdAt: toISO(start),
    updatedAt: toISO(start)
  };
  saveChallenge(ch);
  return ch;
}

export function carryoverUpdate(ch: Challenge, now = new Date()): Challenge {
  const idxNow = currentDayIndex(ch.startAt, now);
  for (let i = 0; i < ch.days.length; i++) {
    const day = ch.days[i];
    const isExpired = now.getTime() > Date.parse(day.dueAt);
    if (isExpired && day.status !== "completed") {
      const incomplete = day.tasks.filter((t) => !t.completed);
      if (incomplete.length) {
        const targetIndex = Math.min(i + 1, ch.days.length - 1);
        const target = ch.days[targetIndex];
        const moved = incomplete.map<Task>((t) => ({
          ...t,
          carryover: true,
          fromDay: day.dayNumber
        }) as Task);
        day.tasks = day.tasks.filter((t) => t.completed);
        target.tasks = [...target.tasks, ...moved];
      }
      day.status = day.tasks.length && day.tasks.every((t) => t.completed) ? "completed" : "missed";
    }
  }
  ch.updatedAt = new Date().toISOString();
  saveChallenge(ch);
  return ch;
}

export function toggleTask(
  ch: Challenge,
  dayIndex: number,
  taskId: string,
  nextCompleted: boolean,
  when = new Date()
): Challenge {
  const idxNow = currentDayIndex(ch.startAt, when);
  if (dayIndex < idxNow) {
    return ch;
  }
  const day = ch.days[dayIndex];
  day.tasks = day.tasks.map((t) =>
    t.id === taskId
      ? { ...t, completed: nextCompleted, completedAt: nextCompleted ? when.toISOString() : undefined }
      : t
  );
  if (day.tasks.length && day.tasks.every((t) => t.completed)) {
    day.status = "completed";
  } else if (new Date(when).getTime() > Date.parse(day.dueAt)) {
    day.status = "missed";
  } else {
    day.status = "pending";
  }
  ch.updatedAt = new Date().toISOString();
  saveChallenge(ch);
  return ch;
}