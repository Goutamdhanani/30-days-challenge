import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

/* Social icons used in FooterStrip */
export const TwitterXIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props} aria-hidden="true">
    <path d="M4 3h4.3l4.1 5.6L16.5 3H20l-6.9 9.2L20.4 21H16l-4.6-6.2L6.3 21H3l7.2-9.7L4 3z"/>
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props} aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.62 2 12.26c0 4.52 2.87 8.36 6.85 9.72.5.1.68-.22.68-.48v-1.86c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.64.07-.62.07-.62 1 .08 1.52 1.06 1.52 1.06.9 1.58 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.15-4.56-5.15 0-1.14.39-2.07 1.03-2.8-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.07a9.19 9.19 0 0 1 5 0c1.91-1.34 2.75-1.07 2.75-1.07.55 1.4.2 2.44.1 2.7.64.73 1.03 1.66 1.03 2.8 0 4.01-2.34 4.88-4.57 5.14.36.33.68.98.68 1.99v2.95c0 .27.18.59.69.48A10.03 10.03 0 0 0 22 12.26C22 6.62 17.52 2 12 2z"/>
  </svg>
);

export const DiscordIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props} aria-hidden="true">
    <path d="M20.3 5.4A17 17 0 0 0 15.9 4l-.2.4c1.7.4 2.6.9 3.6 1.6a12.3 12.3 0 0 0-10.6 0c1-.7 1.9-1.2 3.6-1.6l-.2-.4a17 17 0 0 0-4.4 1.4C6 7.6 5.3 9.8 5.1 12.1c1 1.5 3.7 2.3 3.7 2.3l.9-1.2c-.5-.2-1.1-.5-1.6-.8l.3-.2a9.6 9.6 0 0 0 8.2 0l.3.2c-.5.3-1 .6-1.6.8l.9 1.2s2.7-.8 3.7-2.3c-.2-2.3-.9-4.5-2.6-6.7zM9.5 12.3c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5zm5 0c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5z"/>
  </svg>
);

/* General UI + day icons (kept) */
export const KeyboardIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} {...p}>
    <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5" y="9" width="2" height="2" rx="0.5" fill="currentColor" />
    <rect x="8" y="9" width="2" height="2" rx="0.5" fill="currentColor" />
    <rect x="11" y="9" width="2" height="2" rx="0.5" fill="currentColor" />
    <rect x="14" y="9" width="2" height="2" rx="0.5" fill="currentColor" />
    <rect x="17" y="9" width="2" height="2" rx="0.5" fill="currentColor" />
    <rect x="5" y="12" width="10" height="2" rx="0.5" fill="currentColor" />
    <rect x="16.5" y="12" width="2.5" height="2" rx="0.5" fill="currentColor" />
  </svg>
);

export const LightningIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} {...p}>
    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
  </svg>
);

/* Fitness/day set + helper for per-day icons */
export const DumbbellIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" className={className} {...p} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 8v8M6 6v12M18 6v12M21 8v8M6 12h12"/>
  </svg>
);

export const HeartPulseIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" className={className} {...p} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 21s-7-4.35-9-8.5C1.8 8.9 4.2 6 7.3 6c1.9 0 3.1 1 4.7 2.7C13.6 7 14.8 6 16.7 6c3.1 0 5.5 2.9 4.3 6.5-2 4.15-9 8.5-9 8.5z"/>
    <path d="M3.5 12h3l2-3 3 6 2-3h6"/>
  </svg>
);

export const ShoeRunIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" className={className} {...p} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 14c4 0 6-4 8-4 2 0 2 2 4 2 1.5 0 3-1 6-1v4a3 3 0 0 1-3 3H8a5 5 0 0 1-5-4z"/>
    <path d="M12 10l-2-3"/>
  </svg>
);

export const WaterDropIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" className={className} {...p} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/>
  </svg>
);

export const YogaIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" className={className} {...p} fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v5m-4 7h8M6 19c1-2 3-3 6-3s5 1 6 3M7 14l3-2m7 2-3-2"/>
  </svg>
);

export const StopwatchIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" className={className} {...p} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M10 2h4M12 8v5l3 3"/>
    <circle cx="12" cy="14" r="7"/>
  </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" className={className} {...p} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 2s5 4 5 9a5 5 0 1 1-10 0c0-5 5-9 5-9z"/>
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" className={className} {...p} fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className, ...p }) => (
  <svg viewBox="0 0 24 24" className={className} {...p} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M21 12.8A8 8 0 1 1 11.2 3 6 6 0 0 0 21 12.8z"/>
  </svg>
);

/* Helper for per-day icons */
export function getDayIcon(i: number, className = "w-8 h-8 text-white"): JSX.Element {
  const icons = [
    DumbbellIcon, HeartPulseIcon, ShoeRunIcon, WaterDropIcon, YogaIcon,
    StopwatchIcon, FlameIcon, SunIcon, MoonIcon, LightningIcon
  ];
  const Comp = icons[i % icons.length];
  return <Comp className={className} aria-hidden="true" />;
}