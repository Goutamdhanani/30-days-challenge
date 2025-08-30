import React from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { Day } from "../types";
import DayCard from "./DayCard";
import { getDayIcon } from "./IconSet";
import { dayPalette } from "../lib/palette";
import { ChevronLeft, ChevronRight, CheckCircle } from "./_icons";

/**
 * Non-overlay triple-panel carousel slider:
 * - Grid with three columns (prev, center, next) so layout never expands and cards don't stack.
 * - Center card is dominant; left/right are smaller previews.
 * - Slide via buttons, arrow keys, horizontal wheel/trackpad, and mouse/touch drag on the center card.
 * - Smooth spring animations with directional enter/exit variants; no page width/height expansion.
 */

type Props = {
  days: Day[];
  currentDayIndex: number;
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  onToggleTask: (dayIndex: number, taskId: string, nextCompleted: boolean) => void;
};

const spring = { type: "spring", stiffness: 270, damping: 30, mass: 1.05 };
const SWIPE_THRESHOLD = 120;

const useKeyboardNav = (cbLeft: () => void, cbRight: () => void) => {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") cbLeft();
      if (e.key === "ArrowRight") cbRight();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cbLeft, cbRight]);
};

const PreviewTick: React.FC<{ day: Day }> = ({ day }) => {
  const isCompleted = day.tasks.length > 0 && day.tasks.every((t) => t.completed);
  if (!isCompleted) return null;
  return (
    <div className="absolute -top-2 -right-2 bg-emerald-500 text-black rounded-full p-1 shadow-lg" title="Day completed">
      <CheckCircle className="w-5 h-5" />
    </div>
  );
};

const PanelShell: React.FC<{
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
}> = ({ ariaLabel, children, className }) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`relative flex items-center justify-center px-2 ${className ?? ""}`}
      style={{ minWidth: 0 }}
    >
      {children}
    </div>
  );
};

const DayCarouselSlider: React.FC<Props> = ({
  days,
  currentDayIndex,
  activeIndex,
  onActiveIndexChange,
  onToggleTask
}) => {
  const prevIndex = activeIndex > 0 ? activeIndex - 1 : null;
  const nextIndex = activeIndex < days.length - 1 ? activeIndex + 1 : null;
  const [direction, setDirection] = React.useState<1 | -1>(1);

  const goLeft = React.useCallback(() => {
    setDirection(-1);
    onActiveIndexChange(Math.max(activeIndex - 1, 0));
  }, [activeIndex, onActiveIndexChange]);

  const goRight = React.useCallback(() => {
    setDirection(1);
    onActiveIndexChange(Math.min(activeIndex + 1, days.length - 1));
  }, [activeIndex, days.length, onActiveIndexChange]);

  useKeyboardNav(goLeft, goRight);

  // Horizontal wheel/trackpad
  const wheelLock = React.useRef<number | null>(null);
  const onWheel = (e: React.WheelEvent) => {
    const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (!horizontal) return;
    if (wheelLock.current && Date.now() - wheelLock.current < 350) return;
    if (e.deltaX > 0) goRight();
    if (e.deltaX < 0) goLeft();
    wheelLock.current = Date.now();
  };

  // Drag interaction on center card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-380, 0, 380], [-5, 0, 5]);
  const scaleActive = useTransform(x, [-380, 0, 380], [0.995, 1, 0.995]);

  const onDragEnd = (_: any, info: { offset: { x: number } }) => {
    const dx = info.offset.x;
    if (dx > SWIPE_THRESHOLD && activeIndex > 0) {
      setDirection(-1);
      onActiveIndexChange(activeIndex - 1);
    } else if (dx < -SWIPE_THRESHOLD && activeIndex < days.length - 1) {
      setDirection(1);
      onActiveIndexChange(activeIndex + 1);
    }
    x.set(0);
  };

  // Variants for card transitions inside each panel; we keep panels fixed in grid.
  const variantsCenter = {
    enter: (dir: 1 | -1) => ({
      x: dir === 1 ? 80 : -80,
      opacity: 0.0,
      scale: 0.96,
      filter: "blur(2px)"
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "none",
      transition: { ...spring }
    },
    exit: (dir: 1 | -1) => ({
      x: dir === 1 ? -80 : 80,
      opacity: 0.0,
      scale: 0.96,
      filter: "blur(2px)",
      transition: { ...spring }
    })
  };

  const variantsPreview = {
    enter: (dir: 1 | -1) => ({
      x: dir === 1 ? 40 : -40,
      opacity: 0.0,
      scale: 0.9,
      filter: "blur(3px)"
    }),
    center: {
      x: 0,
      opacity: 0.9,
      scale: 0.9,
      filter: "blur(1.2px)",
      transition: { ...spring }
    },
    exit: (dir: 1 | -1) => ({
      x: dir === 1 ? -40 : 40,
      opacity: 0.0,
      scale: 0.9,
      filter: "blur(3px)",
      transition: { ...spring }
    })
  };

  // Container grid: left (preview), center (dominant), right (preview)
  // Fixed heights; overflow hidden to avoid page growth.
  return (
    <section
      aria-label="Carousel slider"
      className="relative mx-auto w-full max-w-[1200px] overflow-hidden"
      onWheel={onWheel}
    >
      {/* Vignette edges for polish */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/40 to-transparent" />
      </div>

      <div
        className="grid gap-2 items-stretch"
        style={{
          gridTemplateColumns: "minmax(180px, 300px) minmax(380px, 1fr) minmax(180px, 300px)",
          minHeight: "500px",
          height: "clamp(480px, 56vh, 560px)",
          overflow: "hidden",
          contain: "layout paint size"
        } as React.CSSProperties}
      >
        {/* LEFT PREVIEW */}
        <PanelShell ariaLabel="Previous day preview" className="overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {prevIndex !== null ? (
              <motion.div
                key={prevIndex}
                className="relative w-full"
                custom={direction}
                variants={variantsPreview}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="relative">
                  <DayCard
                    day={days[prevIndex]}
                    index={prevIndex}
                    currentDayIndex={currentDayIndex}
                    onToggleTask={(taskId, next) => onToggleTask(prevIndex, taskId, next)}
                    icon={getDayIcon(prevIndex, "w-7 h-7 text-white/90")}
                    palette={dayPalette(prevIndex)}
                    dominant={false}
                  />
                  <PreviewTick day={days[prevIndex]} />
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full opacity-40 grid place-items-center text-white/40 text-sm">
                Start
              </div>
            )}
          </AnimatePresence>
        </PanelShell>

        {/* CENTER DOMINANT */}
        <PanelShell ariaLabel="Current day" className="overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activeIndex}
              className="relative w-full"
              custom={direction}
              variants={variantsCenter}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x, rotate, scale: scaleActive, touchAction: "pan-y" as any }}
                onDragEnd={onDragEnd}
                className="cursor-grab active:cursor-grabbing select-none"
              >
                <DayCard
                  day={days[activeIndex]}
                  index={activeIndex}
                  currentDayIndex={currentDayIndex}
                  onToggleTask={(taskId, next) => onToggleTask(activeIndex, taskId, next)}
                  icon={getDayIcon(activeIndex, "w-8 h-8 text-white")}
                  palette={dayPalette(activeIndex)}
                  dominant
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </PanelShell>

        {/* RIGHT PREVIEW */}
        <PanelShell ariaLabel="Next day preview" className="overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {nextIndex !== null ? (
              <motion.div
                key={nextIndex}
                className="relative w-full"
                custom={direction}
                variants={variantsPreview}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="relative">
                  <DayCard
                    day={days[nextIndex]}
                    index={nextIndex}
                    currentDayIndex={currentDayIndex}
                    onToggleTask={(taskId, next) => onToggleTask(nextIndex, taskId, next)}
                    icon={getDayIcon(nextIndex, "w-7 h-7 text-white/90")}
                    palette={dayPalette(nextIndex)}
                    dominant={false}
                  />
                  <PreviewTick day={days[nextIndex]} />
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full opacity-40 grid place-items-center text-white/40 text-sm">
                End
              </div>
            )}
          </AnimatePresence>
        </PanelShell>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={goLeft}
          className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm text-white/70">Day {activeIndex + 1} / {days.length}</div>
        <button
          onClick={goRight}
          className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default DayCarouselSlider;