/**
 * HeroCard — Central glass card with title, labeled textarea, primary & secondary CTAs.
 * Accessibility: explicit label & id for textarea, aria-describedby ties to helper note.
 * Animations: subtle hover/focus lifts, primary CTA glow pulse on hover.
 */
import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface Props {
  title: string;
  note: string;
  textareaLabel: string;
  maxLength: number;
  value: string;
  onChange: (v: string) => void;
  primaryLabel: string;
  primaryEnabled: boolean;
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
}

const HeroCard: React.FC<Props> = ({
  title,
  note,
  textareaLabel,
  maxLength,
  value,
  onChange,
  primaryLabel,
  primaryEnabled,
  onPrimary,
  secondaryLabel,
  onSecondary
}) => {
  const textId = React.useId();
  const helpId = React.useId();

  return (
    <motion.section
      role="region"
      aria-label="Create your 30 Day Challenge"
      className="rounded-glass border border-white/10 bg-white/5 backdrop-blur-xs p-6 sm:p-8 shadow-glass"
      initial={{ opacity: 0.98 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
    >
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">{title}</h1>

      <label htmlFor={textId} className="block text-sm text-white/80 mb-2">
        {textareaLabel}
      </label>
      <textarea
        id={textId}
        aria-label={textareaLabel}
        aria-describedby={helpId}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder=""
        className={clsx(
          "w-full min-h-[140px] rounded-lg bg-white/5 border border-white/10",
          "px-4 py-3 outline-none text-white/90 placeholder-white/30",
          "focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:border-accent-mint/50",
          "transition will-change-transform"
        )}
        data-testid="hero-textarea"
      />

      <div id={helpId} className="text-xs text-white/50 mt-2">
        {note}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <motion.button
          type="button"
          disabled={!primaryEnabled}
          onClick={onPrimary}
          className={clsx(
            "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium",
            "text-black bg-accent-mint/90 hover:bg-accent-mint",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint"
          )}
          data-track="hero_create"
          data-testid="hero-primary-cta"
          whileHover={primaryEnabled ? { scale: 1.02, boxShadow: "0 0 20px rgba(125,249,185,0.35)" } : {}}
          whileTap={primaryEnabled ? { scale: 0.98 } : {}}
        >
          {primaryLabel}
        </motion.button>

        <button
          type="button"
          onClick={onSecondary}
          className={clsx(
            "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium",
            "text-white/90 bg-white/5 hover:bg-white/10 border border-white/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint"
          )}
          data-track="hero_demo"
          data-testid="hero-secondary-cta"
        >
          {secondaryLabel}
        </button>
      </div>
    </motion.section>
  );
};

export default HeroCard;
