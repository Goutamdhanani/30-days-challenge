import React from "react";

type NavItem = { label: string; href: string; type: "link" | "modal" };
export type ModalType = "signup" | "signin";

interface Props {
  brand: string;
  nav: NavItem[];
  onOpenModal: (type: ModalType) => void;
}

const TopNav: React.FC<Props> = ({ brand, nav, onOpenModal }) => {
  return (
    <div role="navigation" className="sticky top-0 z-20 bg-black/20 backdrop-blur border-b border-white/5">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="font-semibold tracking-tight text-white/90 hover:text-white rounded">
          {brand}
        </a>
        <nav className="flex items-center gap-2">
          {nav.map((item) =>
            item.type === "modal" ? (
              <button
                key={item.label}
                className="text-sm text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded focus-visible:ring-2 focus-visible:ring-accent-mint"
                onClick={() =>
                  onOpenModal(item.label.toLowerCase().includes("sign up") ? "signup" : "signin")
                }
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "")}`}
              >
                {item.label}
              </button>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.href !== "/") e.preventDefault();
                }}
                className="text-sm text-white/80 hover:text-white px-3 py-1.5 rounded focus-visible:ring-2 focus-visible:ring-accent-mint"
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "")}`}
              >
                {item.label}
              </a>
            )
          )}
        </nav>
      </div>
    </div>
  );
};
export default TopNav;