import React from "react";
import { Day } from "../types";

interface Props {
  days: Day[];
  xp: number;
  onFinish: () => void;
  onRecreate: () => void;
}

const ChallengeSummary: React.FC<Props> = ({ days, xp, onFinish, onRecreate }) => {
  const completedDays = days.filter((d) => d.tasks.length > 0 && d.tasks.every((t) => t.completed)).length;
  const totalDays = days.length;
  const canFinish = days[days.length - 1]?.tasks.length > 0 && days[days.length - 1].tasks.every((t) => t.completed);

  return (
    <section className="rounded-glass border border-white/10 bg-white/5 backdrop-blur p-4 shadow-glass">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-sm text-white/60">Progress</div>
          <div className="text-lg font-semibold">{completedDays} / {totalDays} days done</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
            onClick={onRecreate}
          >
            Recreate challenge
          </button>
          <button
            className="rounded-md px-3 py-2 bg-accent-mint/90 text-black hover:bg-accent-mint focus-visible:ring-2 focus-visible:ring-accent-mint disabled:opacity-50"
            onClick={onFinish}
            disabled={!canFinish}
            title={canFinish ? "Finish challenge" : "Finish becomes available when Day 30 is complete"}
          >
            Finish
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChallengeSummary;