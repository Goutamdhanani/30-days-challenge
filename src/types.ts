export type DayStatus = "pending" | "completed" | "missed";

export interface Task {
  id: string;
  title: string;
  details?: string;
  percent: number; // 0..100, "weight" or XP contribution
  completed: boolean;
  completedAt?: string; // ISO
  carryover?: boolean;
  fromDay?: number; // original day number if carried
}

export interface Day {
  dayNumber: number; // 1..30
  dueAt: string; // ISO
  tasks: Task[];
  status: DayStatus;
  xpReward?: number;
  estMinutes?: number;
}

export interface Challenge {
  id: string;
  title: string;
  prompt: string;
  startAt: string; // ISO
  timezone: string;
  days: Day[];
  xp: number;
  createdAt: string;
  updatedAt: string;
}