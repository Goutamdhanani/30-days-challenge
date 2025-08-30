import React from "react";
import { Challenge } from "../types";
import { cls } from "./_utils";
import { useNavigate } from "react-router-dom";
import { deleteChallenge, listChallenges } from "../lib/storage";

function daysCompleted(ch: Challenge): number {
  return ch.days.filter((d) => d.tasks.length > 0 && d.tasks.every((t) => t.completed)).length;
}
function percentCompleted(ch: Challenge): number {
  const d = daysCompleted(ch);
  return Math.round((d / ch.days.length) * 100);
}

function seededRandom(id: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h % 1000) / 1000;
}
function gradientFor(id: string) {
  const t = seededRandom(id);
  const h1 = Math.floor(180 + t * 150) % 360;
  const h2 = (h1 + 40) % 360;
  const a = 0.9;
  return `radial-gradient(120% 120% at 20% 10%, hsla(${h1} 80% 55%/${a}), transparent 55%),
          radial-gradient(110% 110% at 80% 20%, hsla(${h2} 80% 60%/${a}), transparent 52%),
          radial-gradient(140% 100% at 50% 100%, hsla(${(h2 + 60) % 360} 80% 50%/${a}), transparent 62%)`;
}

const ChallengeCard: React.FC<{
  ch: Challenge;
  onDeleted: () => void;
}> = ({ ch, onDeleted }) => {
  const nav = useNavigate();
  const pct = percentCompleted(ch);

  return (
    <div
      className={cls(
        "relative rounded-2xl border border-white/10 overflow-hidden",
        "bg-white/3 backdrop-blur-sm transition hover:border-white/20"
      )}
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        boxShadow: "0 12px 28px rgba(0,0,0,0.45)"
      }}
    >
      {/* Fluid gradient fill proportional to completion */}
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: `${pct}%`,
          background: gradientFor(ch.id),
          filter: "saturate(1.05)",
          transition: "width 400ms cubic-bezier(.2,.8,.2,1)"
        }}
        aria-hidden="true"
      />
      {/* subtle noise on top */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 60 60\"><defs><filter id=\"n\"><feTurbulence baseFrequency=\"0.65\" numOctaves=\"2\"/></filter></defs><rect width=\"60\" height=\"60\" filter=\"url(%23n)\" opacity=\"0.3\"/></svg>')"
        }}
        aria-hidden="true"
      />

      <div className="relative p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold truncate">{ch.title || "30 Day Challenge"}</div>
            <div className="text-xs text-white/70">
              {pct}% complete • Started {new Date(ch.startAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => nav(`/challenge/${ch.id}`)}
              className="text-xs rounded-md px-3 py-1.5 bg-white/10 border border-white/15 hover:bg-white/15"
            >
              Open
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete "${ch.title}"? This cannot be undone.`)) {
                  deleteChallenge(ch.id);
                  onDeleted();
                }
              }}
              className="text-xs rounded-md px-3 py-1.5 bg-rose-500/15 border border-rose-400/30 text-rose-200 hover:bg-rose-500/25"
              title="Delete challenge"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-3 w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #6EF9B6, #9B7CFA)",
              boxShadow: "0 0 12px rgba(110,249,182,0.35)"
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ChallengeList: React.FC<{ refreshKey?: number }> = () => {
  const [items, setItems] = React.useState(() => listChallenges());
  const refresh = React.useCallback(() => setItems(listChallenges()), []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  if (!items.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold mb-3">Your challenges</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((ch) => (
          <ChallengeCard key={ch.id} ch={ch} onDeleted={refresh} />
        ))}
      </div>
    </section>
  );
};

export default ChallengeList;