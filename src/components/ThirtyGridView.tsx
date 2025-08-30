import React from "react";
import { Day } from "../types";
import { cls } from "./_utils";

interface Props {
  days: Day[];
  currentDayIndex: number;
  activeIndex: number;
  onSelect: (i: number) => void;
}

const ThirtyGridView: React.FC<Props> = ({ days, currentDayIndex, activeIndex, onSelect }) => {
  return (
    <div role="grid" aria-label="30-day overview" className="grid grid-cols-10 sm:grid-cols-12 gap-1">
      {days.map((d, i) => {
        const isPast = i < currentDayIndex;
        const isActive = i === activeIndex;
        const status = d.status;
        const bg =
          status === "completed"
            ? "bg-emerald-400/40"
            : status === "missed"
            ? "bg-rose-400/40"
            : "bg-white/10";
        return (
          <button
            key={d.dayNumber}
            role="gridcell"
            aria-label={`Day ${d.dayNumber} ${status}`}
            onClick={() => onSelect(i)}
            className={cls(
              "h-6 w-6 rounded-sm border border-white/10 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-accent-mint",
              bg,
              isActive && "outline outline-2 outline-accent-mint/60",
              isPast && "cursor-pointer"
            )}
            title={`Day ${d.dayNumber} — ${status}`}
          />
        );
      })}
    </div>
  );
};

export default ThirtyGridView;