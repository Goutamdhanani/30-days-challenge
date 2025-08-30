import React from "react";

const OverdueBadge: React.FC<{ fromDay?: number }> = ({ fromDay }) => {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-300/20">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-300" aria-hidden="true" />
      Overdue{typeof fromDay === "number" ? ` · Day ${fromDay}` : ""}
    </span>
  );
};

export default OverdueBadge;