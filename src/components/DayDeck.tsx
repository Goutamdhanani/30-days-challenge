import React from "react";
import { Day } from "../types";
import DayCard from "./DayCard";
import { getDayIcon } from "./IconSet";
import { dayPalette } from "../lib/palette";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

interface Props {
  days: Day[];
  currentDayIndex: number;
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  onToggleTask: (dayIndex: number, taskId: string, nextCompleted: boolean) => void;
}

const SWIPE_THRESHOLD = 110;

const DayDeck: React.FC<Props> = ({
  days,
  currentDayIndex,
  activeIndex,
  onActiveIndexChange,
  onToggleTask
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-320, 0, 320], [-6, 0, 6]);
  const shadow = useTransform(x, [-320, 0, 320], [0.2, 0.35, 0.2]);

  function handleEnd(_: any, info: { offset: { x: number } }) {
    const dx = info.offset.x;
    if (dx > SWIPE_THRESHOLD && activeIndex > 0) {
      onActiveIndexChange(activeIndex - 1);
      x.set(0);
    } else if (dx < -SWIPE_THRESHOLD && activeIndex < days.length - 1) {
      onActiveIndexChange(activeIndex + 1);
      x.set(0);
    }
  }

  const indices = [activeIndex - 1, activeIndex, activeIndex + 1].filter(
    (i) => i >= 0 && i < days.length
  );

  return (
    <section aria-label="Day deck" className="relative h-[620px] md:h-[560px]">
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-[min(92vw,900px)] h-[540px]">
          <AnimatePresence initial={false} mode="popLayout">
            {indices.map((i) => {
              const order = i - activeIndex; // -1,0,1
              const palette = dayPalette(i);
              const isActive = i === activeIndex;
              const z = 100 - Math.abs(order);
              const scale = isActive ? 1 : order < 0 ? 0.955 : 0.93;
              const y = isActive ? 0 : order < 0 ? -12 : 12;

              return (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  style={{ zIndex: z }}
                  initial={{ opacity: 0, scale: 0.985, y: 8 }}
                  animate={{ opacity: 1, scale, y }}
                  exit={{ opacity: 0, scale: 0.985, y: order < 0 ? -16 : 16 }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                >
                  {isActive ? (
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      style={{ x, rotate, boxShadow: shadow.get() }}
                      onDragEnd={handleEnd}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <DayCard
                        day={days[i]}
                        index={i}
                        currentDayIndex={currentDayIndex}
                        onToggleTask={(taskId, next) => onToggleTask(i, taskId, next)}
                        icon={getDayIcon(i, "w-8 h-8 text-white")}
                        palette={palette}
                        dominant
                      />
                    </motion.div>
                  ) : (
                    <DayCard
                      day={days[i]}
                      index={i}
                      currentDayIndex={currentDayIndex}
                      onToggleTask={(taskId, next) => onToggleTask(i, taskId, next)}
                      icon={getDayIcon(i, "w-8 h-8 text-white/90")}
                      palette={palette}
                      dominant={false}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => onActiveIndexChange(Math.max(activeIndex - 1, 0))}
          className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
          aria-label="Previous day"
        >
          ◀
        </button>
        <div className="text-sm text-white/70">Day {activeIndex + 1} / {days.length}</div>
        <button
          onClick={() => onActiveIndexChange(Math.min(activeIndex + 1, days.length - 1))}
          className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
          aria-label="Next day"
        >
          ▶
        </button>
      </div>
    </section>
  );
};

export default DayDeck;