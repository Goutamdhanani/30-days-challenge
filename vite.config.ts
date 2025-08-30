import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { ProxyOptions } from "vite";

export default defineConfig(({ mode }) => {
  // Load unprefixed envs so we can read ANTHROPIC_API_KEY from .env
  const env = loadEnv(mode, process.cwd(), "");
  const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

  const proxy: Record<string, ProxyOptions> = {};
  if (ANTHROPIC_API_KEY) {
    proxy["/api/anthropic"] = {
      target: "https://api.anthropic.com",
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/api\/anthropic/, ""),
      configure: (proxyServer) => {
        proxyServer.on("proxyReq", (proxyReq) => {
          // Required headers for Anthropic
          proxyReq.setHeader("x-api-key", ANTHROPIC_API_KEY);
          proxyReq.setHeader("anthropic-version", "2023-06-01");
          // This header is REQUIRED if Anthropic sees an Origin header (browser-flow)
          proxyReq.setHeader("anthropic-dangerous-direct-browser-access", "true");

          // Optional: strip or normalize Origin to avoid strict checks
          try {
            // @ts-ignore Node ClientRequest supports removeHeader in modern Node
            proxyReq.removeHeader?.("origin");
          } catch {}
        });
      }
    };
  } else {
    console.warn("[vite] Anthropic proxy disabled: set ANTHROPIC_API_KEY in .env or your shell before `npm run dev`");
  }

  return {
    plugins: [react()],
    server: { proxy }
  };
});