import React from "react";
import { loadScript } from "../lib/script";
import { useAuth } from "../lib/auth";

const GoogleSignInButton: React.FC<{ text?: "signin" | "signup" }> = ({ text = "signin" }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { user, signIn, signOut } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  React.useEffect(() => {
    if (!ref.current || !clientId) return;
    let cancelled = false;
    (async () => {
      try {
        await loadScript("https://accounts.google.com/gsi/client", "google-gis");
        if (cancelled) return;
        if (!window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: () => {
            // AuthProvider handles token via One Tap; this is a button path fallback
            // We’ll just reload to let provider pick it up from storage if needed
            setTimeout(() => window.location.reload(), 100);
          }
        });
        window.google.accounts.id.renderButton(ref.current, {
          theme: "outline",
          size: "large",
          text: text === "signup" ? "signup_with" : "signin_with",
          shape: "pill"
        });
      } catch (e) {
        console.warn("GIS button init failed", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientId, text]);

  if (user) {
    return (
      <button
        onClick={signOut}
        className="inline-flex items-center gap-2 rounded-md bg-white/10 border border-white/20 px-3 py-2 hover:bg-white/15"
        aria-label="Sign out"
      >
        {user.picture ? <img src={user.picture} alt="" className="w-5 h-5 rounded-full" /> : null}
        <span>Sign out</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={signIn}
        className="inline-flex items-center gap-2 rounded-md bg-white/10 border border-white/20 px-3 py-2 hover:bg-white/15"
      >
        Sign in with Google
      </button>
      <div ref={ref} aria-hidden className="hidden md:block" />
    </div>
  );
};

export default GoogleSignInButton;