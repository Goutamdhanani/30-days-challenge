import React from "react";
import { Day } from "../types";
import DayCard from "./DayCard";
import { getDayIcon } from "./IconSet";
import { dayPalette } from "../lib/palette";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle } from "./_icons";

/**
 * Full-fledged SLIDE deck (with mouse, drag, keys) and smooth pro animations.
 * - Center card is dominant.
 * - Left shows previous-day preview (with green tick if completed).
 * - Right shows next-day preview.
 * - Slide via buttons, arrow keys, mouse drag, or horizontal wheel/trackpad.
 * - Container is overflow-hidden, fixed-height: no page width/height expansion.
 */
interface Props {
  days: Day[];
  currentDayIndex: number;
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  onToggleTask: (dayIndex: number, taskId: string, nextCompleted: boolean) => void;
}

const spring = { type: "spring", stiffness: 240, damping: 28, mass: 1.05 };
const SWIPE_THRESHOLD = 120;

const DaySlider: React.FC<Props> = ({
  days,
  currentDayIndex,
  activeIndex,
  onActiveIndexChange,
  onToggleTask
}) => {
  const prev = Math.max(activeIndex - 1, 0);
  const next = Math.min(activeIndex + 1, days.length - 1);

  // Motion for drag on the active card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-380, 0, 380], [-5, 0, 5]);
  const scaleActive = useTransform(x, [-380, 0, 380], [0.995, 1, 0.995]);

  // Keyboard navigation
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") onActiveIndexChange(Math.max(activeIndex - 1, 0));
      if (e.key === "ArrowRight") onActiveIndexChange(Math.min(activeIndex + 1, days.length - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, days.length, onActiveIndexChange]);

  // Horizontal wheel/trackpad navigation (throttled)
  const wheelLock = React.useRef<number | null>(null);
  function onWheel(e: React.WheelEvent) {
    const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (!horizontal) return;
    if (wheelLock.current && Date.now() - wheelLock.current < 350) return;
    if (e.deltaX > 0) onActiveIndexChange(Math.min(activeIndex + 1, days.length - 1));
    if (e.deltaX < 0) onActiveIndexChange(Math.max(activeIndex - 1, 0));
    wheelLock.current = Date.now();
  }

  function onDragEnd(_: any, info: { offset: { x: number } }) {
    const dx = info.offset.x;
    if (dx > SWIPE_THRESHOLD && activeIndex > 0) {
      onActiveIndexChange(activeIndex - 1);
    } else if (dx < -SWIPE_THRESHOLD && activeIndex < days.length - 1) {
      onActiveIndexChange(activeIndex + 1);
    }
    x.set(0);
  }

  const previewBadge = (d: Day) => {
    const isCompleted = d.tasks.length > 0 && d.tasks.every((t) => t.completed);
    if (!isCompleted) return null;
    return (
      <div className="absolute -top-2 -right-2 bg-emerald-500 text-black rounded-full p-1 shadow-lg" title="Day completed">
        <CheckCircle className="w-5 h-5" />
      </div>
    );
  };

  const CardLayer: React.FC<{ i: number; variant: "prev" | "active" | "next" }> = ({ i, variant }) => {
    const palette = dayPalette(i);
    const isActive = variant === "active";

    // Positions are transform-only, layout doesn't expand.
    const baseX = variant === "prev" ? -280 : variant === "next" ? 280 : 0;
    const baseY = isActive ? 0 : 10;
    const baseScale = isActive ? 1 : 0.9;
    const baseOpacity = isActive ? 1 : 0.84;

    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ x: baseX, y: baseY, scale: baseScale, opacity: baseOpacity, filter: isActive ? "none" : "blur(1.2px)" }}
        transition={spring}
        style={{ pointerEvents: isActive ? "auto" : "none" }}
      >
        <div className="relative w-[min(92vw,900px)]">
          {/* Edge mask so previews are partially visible without expanding layout */}
          {!isActive && (
            <div
              className={`absolute inset-0 ${variant === "prev" ? "rounded-l-glass" : "rounded-r-glass"}`}
              aria-hidden="true"
              style={{
                WebkitMaskImage:
                  variant === "prev"
                    ? "linear-gradient(90deg, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 96%)"
                    : "linear-gradient(270deg, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 96%)",
                maskImage:
                  variant === "prev"
                    ? "linear-gradient(90deg, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 96%)"
                    : "linear-gradient(270deg, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 96%)"
              }}
            />
          )}

          <div className="relative">
            {isActive ? (
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x, rotate, scale: scaleActive, touchAction: "pan-y" as any }}
                onDragEnd={onDragEnd}
                className="cursor-grab active:cursor-grabbing select-none"
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
              <>
                <DayCard
                  day={days[i]}
                  index={i}
                  currentDayIndex={currentDayIndex}
                  onToggleTask={(taskId, next) => onToggleTask(i, taskId, next)}
                  icon={getDayIcon(i, "w-8 h-8 text-white/90")}
                  palette={palette}
                  dominant={false}
                />
                {previewBadge(days[i])}
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section
      aria-label="Day slider"
      className="relative mx-auto w-full max-w-[1100px] overflow-hidden"
      onWheel={onWheel}
    >
      {/* Vignette edges for pro feel; ensures soft bounds without layout expansion */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/40 to-transparent" />
      </div>

      <div className="relative h-[500px] sm:h-[540px] md:h-[560px]">
        <AnimatePresence initial={false} mode="popLayout">
          {prev !== activeIndex && <CardLayer i={prev} variant="prev" key={`prev-${prev}`} />}
          <CardLayer i={activeIndex} variant="active" key={`active-${activeIndex}`} />
          {next !== activeIndex && <CardLayer i={next} variant="next" key={`next-${next}`} />}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => onActiveIndexChange(Math.max(activeIndex - 1, 0))}
          className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm text-white/70">Day {activeIndex + 1} / {days.length}</div>
        <button
          onClick={() => onActiveIndexChange(Math.min(activeIndex + 1, days.length - 1))}
          className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default DaySlider;