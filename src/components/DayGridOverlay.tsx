import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Day } from "../types";
import { cls } from "./_utils";

interface Props {
  open: boolean;
  days: Day[];
  activeIndex: number;
  currentDayIndex: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}

const DayTile: React.FC<{
  day: Day;
  index: number;
  isActive: boolean;
  isCurrent: boolean;
  onClick: () => void;
}> = ({ day, index, isActive, isCurrent, onClick }) => {
  const color =
    day.status === "completed"
      ? "ring-emerald-400/60 bg-emerald-400/15"
      : day.status === "missed"
      ? "ring-rose-400/60 bg-rose-400/15"
      : isCurrent
      ? "ring-sky-400/60 bg-sky-400/15"
      : "ring-white/15 bg-white/5";

  return (
    <button
      onClick={onClick}
      className={cls(
        "relative h-20 sm:h-24 rounded-lg border border-white/10",
        "hover:border-white/30 focus-visible:ring-2 focus-visible:ring-accent-mint",
        "flex items-center justify-center",
        color,
        isActive && "outline outline-2 outline-accent-mint/60"
      )}
      aria-label={`Open Day ${day.dayNumber}`}
      title={`Open Day ${day.dayNumber}`}
    >
      <span className="text-sm sm:text-base font-medium text-white/90">Day {day.dayNumber}</span>
      <span
        className={cls(
          "absolute top-2 right-2 h-2 w-2 rounded-full",
          day.status === "completed"
            ? "bg-emerald-400"
            : day.status === "missed"
            ? "bg-rose-400"
            : isCurrent
            ? "bg-sky-400"
            : "bg-white/30"
        )}
        aria-hidden="true"
      />
    </button>
  );
};

const DayGridOverlay: React.FC<Props> = ({
  open,
  days,
  activeIndex,
  currentDayIndex,
  onSelect,
  onClose
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-label="30-day overview"
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="absolute inset-0 grid place-items-center p-4">
            <motion.div
              className="w-full max-w-5xl rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-4 shadow-glass"
              initial={{ y: 16, opacity: 0.98 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">All days</h2>
                <button
                  onClick={onClose}
                  className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-10 gap-2">
                {days.map((d, i) => (
                  <DayTile
                    key={d.dayNumber}
                    day={d}
                    index={i}
                    isActive={i === activeIndex}
                    isCurrent={i === currentDayIndex}
                    onClick={() => {
                      onSelect(i);
                      onClose();
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DayGridOverlay;