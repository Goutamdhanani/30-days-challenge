import React from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  note: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  primaryLabel: string;
  secondaryLabel: string;
  primaryEnabled: boolean;
  onPrimary: () => void;
  onSecondary: () => void;
}

const HeroSearchBar: React.FC<Props> = ({
  title,
  note,
  label,
  placeholder,
  value,
  onChange,
  primaryLabel,
  secondaryLabel,
  primaryEnabled,
  onPrimary,
  onSecondary
}) => {
  const textareaId = React.useId();

  return (
    <motion.section
      className="rounded-[999px] md:rounded-glass border border-white/10 bg-white/5 backdrop-blur p-5 md:p-8 shadow-glass"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 0.9, 0.35, 1] }}
      role="region"
      aria-label={title}
    >
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-white/60 mt-1">{note}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <label htmlFor={textareaId} className="block text-xs text-white/70 mb-2">
            {label}
          </label>
          <textarea
            id={textareaId}
            aria-label={label}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (primaryEnabled) onPrimary();
              }
            }}
            className="w-full min-h-[120px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none text-white/90 placeholder-white/30 focus-visible:ring-2 focus-visible:ring-accent-mint"
            data-testid="hero-textarea"
          />
        </div>

        <div className="flex md:flex-col gap-2 md:gap-3">
          <motion.button
            type="button"
            disabled={!primaryEnabled}
            aria-disabled={!primaryEnabled}
            onClick={onPrimary}
            className="inline-flex items-center justify-center rounded-full md:rounded-md px-4 py-2 font-medium text-black bg-[linear-gradient(90deg,#6EF9B6_0%,#9B7CFA_100%)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent-mint"
            whileHover={primaryEnabled ? { scale: 1.05 } : {}}
            whileTap={primaryEnabled ? { scale: 0.98 } : {}}
            data-testid="primary-cta"
          >
            {primaryLabel}
          </motion.button>

          <button
            type="button"
            onClick={onSecondary}
            className="inline-flex items-center justify-center rounded-full md:rounded-md px-4 py-2 font-medium text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
            data-testid="preview-demo"
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSearchBar;