import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import content from "../data/landing.content.json";
import TopNav from "../components/TopNav";
import FooterStrip from "../components/FooterStrip";
import ChallengeSummary from "../components/ChallengeSummary";
import DayStatusDots from "../components/DayStatusDots";
import DayGridOverlay from "../components/DayGridOverlay";
import DayCarouselSlider from "../components/DayCarouselSlider";
import { getChallenge, carryoverUpdate, toggleTask } from "../lib/storage";
import { currentDayIndex } from "../lib/date";
import { Challenge } from "../types";
import ModalSkeleton from "../components/ModalSkeleton";

type ModalKind = "signup" | "signin" | null;

const DashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = React.useState<Challenge | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [gridOpen, setGridOpen] = React.useState(false);
  const [modal, setModal] = React.useState<ModalKind>(null);

  React.useEffect(() => {
    if (!id) return;
    const ch = getChallenge(id);
    if (!ch) {
      navigate("/", { replace: true });
      return;
    }
    const updated = carryoverUpdate(ch);
    const nowIdx = currentDayIndex(updated.startAt);
    setChallenge(updated);
    setActiveIndex(nowIdx);
  }, [id, navigate]);

  if (!challenge) return null;

  const idxNow = currentDayIndex(challenge.startAt);

  function handleToggle(dayIndex: number, taskId: string, nextCompleted: boolean) {
    const updated = toggleTask(challenge, dayIndex, taskId, nextCompleted, new Date());
    setChallenge({ ...updated });
  }

  const modalTitle =
    modal === "signup"
      ? content.site.nav.find((n) => n.type === "modal" && n.label.toLowerCase().includes("sign up"))?.label ?? ""
      : modal === "signin"
      ? content.site.nav.find((n) => n.type === "modal" && n.label.toLowerCase().includes("sign in"))?.label ?? ""
      : "";

  return (
    <>
      <header className="overflow-hidden">
        <TopNav brand={content.site.brand} nav={content.site.nav} onOpenModal={(k) => setModal(k)} />
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6 overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              {challenge.title || "30 Day Challenge"}
            </h1>
            <div className="text-white/70 text-sm">Daily Fitness (30 Days)</div>
          </div>
          <DayStatusDots days={challenge.days} currentDayIndex={idxNow} onOpenGrid={() => setGridOpen(true)} />
        </div>

        <DayCarouselSlider
          days={challenge.days}
          currentDayIndex={idxNow}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          onToggleTask={handleToggle}
        />

        <div className="mt-6">
          <ChallengeSummary
            days={challenge.days}
            xp={challenge.xp}
            onFinish={() => alert("Finish flow coming soon")}
            onRecreate={() => navigate("/")}
          />
        </div>
      </main>

      <footer className="mt-10 overflow-hidden">
        <FooterStrip
          social={content.site.footer.social}
          copyright={content.site.footer.copyright}
        />
      </footer>

      <DayGridOverlay
        open={gridOpen}
        days={challenge.days}
        activeIndex={activeIndex}
        currentDayIndex={idxNow}
        onSelect={setActiveIndex}
        onClose={() => setGridOpen(false)}
      />

      <ModalSkeleton open={modal !== null} title={modalTitle} onClose={() => setModal(null)} />
    </>
  );
};

export default DashboardPage;