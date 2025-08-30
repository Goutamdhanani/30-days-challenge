# 30 Day Challenge — Landing Page (Frontend only)

Scope: Landing page only. No backend, no API, no AI, no additional pages.

## Run (when you add your build tooling)
- This repo lists Tailwind-style utility classes. Add your preferred Vite + Tailwind setup to run locally.
- Files included adhere strictly to the listed project structure.

## Project file list + component responsibilities
- package.json — dependencies/scripts (no server code).
- tailwind.config.cjs — Tailwind content paths and theme tokens.
- src/index.html — single mount point, lang="en".
- src/main.tsx — app bootstrap, no router beyond mounting App.
- src/App.tsx — mounts LandingPage with background gradients.
- src/pages/LandingPage.tsx — reads content JSON, composes TopNav, HeroSearchBar, quick links, Features row, FooterStrip, ModalSkeleton.
- src/components/TopNav.tsx — brand left, nav right; Sign up/Sign in open modal skeleton; Leaderboard is a dead link.
- src/components/HeroSearchBar.tsx — pill-shaped glass card; labeled textarea (empty by default); primary CTA disabled until input; demo CTA logs placeholder; Enter triggers primary CTA.
- src/components/FeatureCard.tsx — glass card with icon + copy.
- src/components/FooterStrip.tsx — social icons + copyright.
- src/components/ModalSkeleton.tsx — accessible dialog shell, focus trap, Esc/overlay close, title sourced from nav label.
- src/components/IconSet.tsx — SVG icons (keyboard, lightning, twitter, github, discord).
- src/styles/index.css — Tailwind directives + minimal helpers (no compiled CSS).
- src/data/landing.content.json — SOURCE OF ALL VISIBLE COPY.
- public/assets/brain-float.png — placeholder file; replace with provided brain artwork.
- public/assets/keyboard.svg — keyboard motif.

## UI/UX rules (summarized)
- Theme: dark, glassmorphism, neon gradient accent mint→purple, 18px corners.
- HeroSearchBar: centered pill card; label + textarea; primary CTA (gradient) disabled until non-empty; secondary demo CTA; Enter activates primary when focused in textarea.
- Background brain: centered behind hero, opacity 0.12–0.25, slow float and tiny rotation; respect reduced motion.
- Features: two cards side-by-side (desktop), stacked (mobile).
- Top nav: brand left; nav right; visible focus rings.
- Modal: role="dialog", aria-modal="true", focus trapped; Esc and overlay click close; title uses nav label.
- Responsiveness: desktop two-column features; tablet adaptive; mobile stacked, full-width hero and stacked CTAs.
- Accessibility: labeled textarea with id; tab focus order; primary CTA uses aria-disabled; social links have aria-label equal to social key from JSON.

## Acceptance criteria
- HeroSearchBar pill implemented, textarea empty by default; primary CTA disabled until input; Enter triggers primary action.
- Demo CTA triggers client-side-only placeholder (console log).
- Background brain image present and animated; respects reduced motion.
- Top nav shows Brand, Leaderboard, Sign up, Sign in; modals open as skeleton with focus trap.
- Two feature cards render with copy from JSON.
- All copy is sourced from src/data/landing.content.json.
- No backend/API/AI code; single landing route only.

## Manual testing checklist
- Desktop load: hero centered; brain visible behind; primary CTA disabled.
- Type into textarea: primary CTA enables; press Enter runs placeholder action.
- Click Preview demo schedule: logs placeholder.
- Open Sign up/Sign in: modal appears; Tab stays within dialog; Esc/overlay closes and returns focus.
- Resize to mobile: hero/CTAs stack; features stack; readable contrast retained.

