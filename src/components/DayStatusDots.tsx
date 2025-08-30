import React from "react";
import { Day } from "../types";

interface Props {
  days: Day[];
  currentDayIndex: number;
  onOpenGrid: () => void;
}

function colorFor(status: Day["status"], isCurrent: boolean) {
  if (status === "completed") return "bg-emerald-400";
  if (status === "missed") return "bg-rose-400";
  if (isCurrent) return "bg-sky-400";
  return "bg-white/30";
}

/**
 * Compact 30-dot status cluster (top-right). Clicking the cluster opens the zoomed-out view.
 */
const DayStatusDots: React.FC<Props> = ({ days, currentDayIndex, onOpenGrid }) => {
  return (
    <button
      type="button"
      onClick={onOpenGrid}
      className="group inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 transition"
      aria-label="Open 30-day overview"
      title="Open 30-day overview"
    >
      <div className="grid grid-cols-10 gap-1">
        {days.map((d, i) => {
          const isCurrent = i === currentDayIndex;
          const color = colorFor(d.status, isCurrent);
          return (
            <span
              key={d.dayNumber}
              className={`h-1.5 w-1.5 rounded-full ${color}`}
              aria-label={`Day ${d.dayNumber} ${d.status}${isCurrent ? " (today)" : ""}`}
            />
          );
        })}
      </div>
      <span className="text-xs text-white/70 hidden sm:inline">Today: Day {currentDayIndex + 1}</span>
    </button>
  );
};

export default DayStatusDots;