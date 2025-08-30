import React from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<Props> = ({ title, subtitle, icon }) => {
  return (
    <motion.article
      className="rounded-glass border border-white/10 bg-white/5 backdrop-blur p-5 shadow-glass"
      initial={{ opacity: 0.96 }}
      whileHover={{ y: -6, boxShadow: "0 0 24px rgba(110,249,182,0.18)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <div aria-hidden="true" className="shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-sm text-white/70 mt-1">{subtitle}</p>
        </div>
      </div>
    </motion.article>
  );
};
export default FeatureCard;