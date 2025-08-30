import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
}

const focusableSelector =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ModalSkeleton: React.FC<Props> = ({ open, title, onClose }) => {
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
        if (nodes.length === 0) {
          e.preventDefault();
          (panelRef.current as HTMLDivElement).focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    setTimeout(() => panelRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/60"
            onClick={(e) => {
              if (e.target === overlayRef.current) onClose();
            }}
          />
          <div className="absolute inset-0 grid place-items-center px-4">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={0}
              className="w-full max-w-lg rounded-glass border border-white/10 bg-white/10 backdrop-blur p-6 shadow-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ModalSkeleton;