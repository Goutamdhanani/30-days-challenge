import React from "react";
import TopNav from "../components/TopNav";
import HeroSearchBar from "../components/HeroSearchBar";
import FeatureCard from "../components/FeatureCard";
import FooterStrip from "../components/FooterStrip";
import ModalSkeleton from "../components/ModalSkeleton";
import content from "../data/landing.content.json";
import { KeyboardIcon, LightningIcon } from "../components/IconSet";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ChallengeList from "../components/ChallengeList";
import { aiCreateChallengeFromClaude } from "../lib/anthropic";

type ModalKind = "signup" | "signin" | null;

const LandingPage: React.FC = () => {
  const [text, setText] = React.useState("");
  const [modal, setModal] = React.useState<ModalKind>(null);
  const shouldReduce = useReducedMotion();
  const navigate = useNavigate();
  const [loadingAI, setLoadingAI] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const bgAsset = "/" + content.theme.backgroundAsset.replace(/^public\//, "");
  const primaryEnabled = text.trim().length > 0;

  const hasClaude =
    Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY) ||
    String(import.meta.env.VITE_USE_ANTHROPIC_PROXY || "").toLowerCase() === "true";

  async function onPrimary() {
    setError(null);
    if (!hasClaude) {
      setError(
        "Claude is not configured. Set VITE_USE_ANTHROPIC_PROXY=true and ANTHROPIC_API_KEY in your environment (or set VITE_ANTHROPIC_API_KEY for direct dev)."
      );
      return;
    }
    const goal = text.trim() || "General 30-day improvement plan";
    try {
      setLoadingAI(true);
      const ch = await aiCreateChallengeFromClaude(goal);
      setLoadingAI(false);
      setRefreshKey((k) => k + 1);
      navigate(`/challenge/${ch.id}`, { replace: true });
    } catch (e: any) {
      setLoadingAI(false);
      setError(e?.message || "Failed to generate challenge with Claude. Try again.");
    }
  }

  const modalTitle =
    modal === "signup"
      ? content.site.nav.find((n) => n.type === "modal" && n.label.toLowerCase().includes("sign up"))?.label ?? ""
      : modal === "signin"
      ? content.site.nav.find((n) => n.type === "modal" && n.label.toLowerCase().includes("sign in"))?.label ?? ""
      : "";

  return (
    <>
      <motion.img
        src={bgAsset}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{ width: "120vmin", height: "auto", filter: "blur(0.2px)" }}
        initial={false}
        animate={shouldReduce ? {} : { y: [-6, 6, -6], rotate: [-2, 2, -2] }}
        transition={shouldReduce ? undefined : { duration: 14, ease: "easeInOut", repeat: Infinity }}
      />

      <header>
        <TopNav brand={content.site.brand} nav={content.site.nav} onOpenModal={(k) => setModal(k)} />
      </header>

      <main id="main" className="relative z-10">
        <section className="container mx-auto px-4 py-10 md:py-16">
          <div className="max-w-[1100px] mx-auto">
            <HeroSearchBar
              title={content.hero.title}
              note={content.hero.subtitle}
              label={content.hero.searchBar.label}
              placeholder={content.hero.searchBar.placeholder}
              value={text}
              onChange={setText}
              primaryLabel={loadingAI ? "Generating..." : "Generate with Claude"}
              secondaryLabel=""
              primaryEnabled={primaryEnabled && !loadingAI}
              onPrimary={onPrimary}
              onSecondary={() => {}}
            />

            {error && <div className="mt-3 text-sm text-rose-300">{error}</div>}

            <div className="mt-4 flex flex-wrap gap-2">
              {content.hero.featureQuickLinks.map((q) => (
                <a
                  key={q.id}
                  href={"#" + q.id}
                  className="text-xs md:text-sm text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full px-3 py-1 focus-visible:ring-2 focus-visible:ring-accent-mint"
                  data-testid={`ql-${q.id}`}
                >
                  {q.label}
                </a>
              ))}
            </div>
          </div>

          <ChallengeList key={refreshKey} />
        </section>
      </main>

      <footer>
        <FooterStrip social={content.site.footer.social} copyright={content.site.footer.copyright} />
      </footer>

      <ModalSkeleton open={modal !== null} title={modalTitle} onClose={() => setModal(null)} />
    </>
  );
};

export default LandingPage;