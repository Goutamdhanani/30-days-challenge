import React from "react";
import { loadScript } from "./script";

type User = {
  sub: string; // Google subject (user id)
  name?: string;
  email?: string;
  picture?: string;
};

type AuthState = {
  user: User | null;
  idToken: string | null; // Google ID token (server must verify)
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthState>({
  user: null,
  idToken: null,
  loading: true,
  signIn: () => {},
  signOut: () => {}
});

function decodeJwt(token: string): any | null {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

const LS_KEY = "auth.google.idToken.v1";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [idToken, setIdToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  React.useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      setIdToken(saved);
      const claims = decodeJwt(saved);
      if (claims?.sub) {
        setUser({
          sub: claims.sub,
          name: claims.name,
          email: claims.email,
          picture: claims.picture
        });
      }
    }
    setLoading(false);
  }, []);

  const ensureGis = React.useCallback(async () => {
    if (!clientId) throw new Error("Missing VITE_GOOGLE_CLIENT_ID");
    await loadScript("https://accounts.google.com/gsi/client", "google-gis");
  }, [clientId]);

  const signIn = React.useCallback(async () => {
    try {
      await ensureGis();
      if (!window.google?.accounts?.id) throw new Error("Google Identity Services unavailable");
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp: any) => {
          const token = resp?.credential as string | undefined;
          if (!token) return;
          localStorage.setItem(LS_KEY, token);
          setIdToken(token);
          const claims = decodeJwt(token);
          if (claims?.sub) {
            setUser({
              sub: claims.sub,
              name: claims.name,
              email: claims.email,
              picture: claims.picture
            });
          }
        }
      });
      window.google.accounts.id.prompt(); // shows One Tap; fallback button below if desired
    } catch (e) {
      console.error(e);
      alert("Sign-in failed. Check console for details.");
    }
  }, [ensureGis, clientId]);

  const signOut = React.useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setIdToken(null);
    setUser(null);
  }, []);

  const value: AuthState = { user, idToken, loading, signIn, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return React.useContext(AuthContext);
}