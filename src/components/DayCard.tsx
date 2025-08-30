import React from "react";
// If you already import Day from somewhere else, keep that import.
// import type { Day } from "../lib/types";

type Task = { id: string; title: string; details?: string; completed?: boolean };
type Day = { dayNumber: number; tasks: Task[] };

type Props = {
  day: Day;
  index: number;
  currentDayIndex: number;
  onToggleTask: (taskId: string, next: boolean) => void;
  icon?: React.ReactNode; // made optional
};

const defaultIcon = (
  <span aria-hidden style={{ display: "inline-block", width: 16, height: 16, borderRadius: 9999, background: "rgba(255,255,255,0.3)" }} />
);

const DayCard: React.FC<Props> = ({ day, index, currentDayIndex, onToggleTask, icon }) => {
  const isToday = index === currentDayIndex;
  const Icon = icon ?? defaultIcon;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-sm text-white/80">
        {Icon}
        <strong>Day {day.dayNumber}</strong>
        {isToday && <span className="text-accent-mint">Today</span>}
      </div>
      <ul className="mt-3 space-y-2">
        {day.tasks.map((t) => (
          <li key={t.id} className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={!!t.completed}
              onChange={(e) => onToggleTask(t.id, e.currentTarget.checked)}
            />
            <div>
              <div className="font-medium text-white">{t.title}</div>
              {t.details && <div className="text-white/70 text-sm">{t.details}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DayCard;