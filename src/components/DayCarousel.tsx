import React from "react";
import { Day } from "../types";
import DayCard from "./DayCard";
import { ChevronLeft, ChevronRight } from "./_icons";

interface Props {
  days: Day[];
  currentDayIndex: number;
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  onToggleTask: (dayIndex: number, taskId: string, nextCompleted: boolean) => void;
}

const DayCarousel: React.FC<Props> = ({
  days,
  currentDayIndex,
  activeIndex,
  onActiveIndexChange,
  onToggleTask
}) => {
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const child = el.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  function move(delta: number) {
    const next = Math.min(Math.max(activeIndex + delta, 0), days.length - 1);
    onActiveIndexChange(next);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    } else if (e.key === "Home") {
      e.preventDefault();
      onActiveIndexChange(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onActiveIndexChange(days.length - 1);
    }
  }

  return (
    <section aria-label="Day carousel" className="relative">
      <div className="flex items-center justify-between mb-2">
        <div className="text-white/70 text-sm">Swipe or use arrow keys</div>
        <div className="flex gap-2">
          <button
            className="rounded-md bg-white/5 border border-white/10 p-2 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
            onClick={() => move(-1)}
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="rounded-md bg-white/5 border border-white/10 p-2 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
            onClick={() => move(1)}
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={listRef}
        className="overflow-x-auto scroll-smooth snap-x snap-mandatory whitespace-nowrap py-1"
        tabIndex={0}
        onKeyDown={onKey}
        role="listbox"
        aria-label="Days"
        aria-activedescendant={`day-${activeIndex + 1}`}
      >
        <div className="inline-flex gap-4 min-w-full">
          {days.map((d, i) => (
            <div
              key={d.dayNumber}
              data-idx={i}
              id={`day-${i + 1}`}
              className="snap-center shrink-0 w-[min(92vw,900px)]"
              role="option"
              aria-selected={i === activeIndex}
            >
              <DayCard
                day={d}
                index={i}
                currentDayIndex={currentDayIndex}
                onToggleTask={(taskId, next) => onToggleTask(i, taskId, next)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DayCarousel;