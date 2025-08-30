const inflight = new Map<string, Promise<void>>();

function getCspNonce(): string | undefined {
  // If you set a CSP nonce, expose it via a meta tag in index.html:
  // <meta name="csp-nonce" content="YOUR_NONCE" />
  return (
    document.querySelector('meta[name="csp-nonce"]')?.getAttribute("content") ||
    document.querySelector('meta[name="nonce"]')?.getAttribute("content") ||
    undefined
  );
}

/**
 * Load an external script exactly once by id.
 * - Deduplicates concurrent calls.
 * - Supports CSP nonce (from meta[name="csp-nonce"]).
 * - Times out if the script never finishes loading.
 *
 * Usage: await loadScript("https://accounts.google.com/gsi/client", "google-gis")
 */
export function loadScript(
  src: string,
  id: string,
  opts: { timeoutMs?: number; nonce?: string } = {}
): Promise<void> {
  const { timeoutMs = 15000, nonce } = opts;

  // Return existing in-flight promise for this id
  const existingPromise = inflight.get(id);
  if (existingPromise) return existingPromise;

  const el = document.getElementById(id) as HTMLScriptElement | null;

  // If a script with this id already exists and has loaded, resolve immediately
  if (el && (el as any).dataset?.loaded === "true") {
    return Promise.resolve();
  }

  const p = new Promise<void>((resolve, reject) => {
    let script = el;

    const onLoad = () => {
      if (script) (script as any).dataset.loaded = "true";
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to load ${src}`));
    };

    let timeoutHandle: number | undefined;
    const startTimeout = () => {
      timeoutHandle = window.setTimeout(() => {
        cleanup();
        reject(new Error(`Timed out loading ${src}`));
      }, timeoutMs);
    };
    const clearTimeoutIfAny = () => {
      if (timeoutHandle) {
        window.clearTimeout(timeoutHandle);
        timeoutHandle = undefined;
      }
    };

    const cleanup = () => {
      clearTimeoutIfAny();
      if (script) {
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
      }
      inflight.delete(id);
    };

    // If an element exists but not yet loaded, attach listeners
    if (script) {
      script.addEventListener("load", onLoad);
      script.addEventListener("error", onError);
      startTimeout();
      return;
    }

    // Create and append the script
    script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    const n = nonce || getCspNonce();
    if (n) (script as any).nonce = n;

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    document.head.appendChild(script);
    startTimeout();
  });

  inflight.set(id, p);
  return p;
}

/**
 * Convenience helper: ensure Google Identity Services is loaded and available.
 * Resolves when window.google.accounts.id is ready.
 */
export async function ensureGoogleGis(id = "google-gis"): Promise<void> {
  await loadScript("https://accounts.google.com/gsi/client", id);
  // Wait until the API is attached
  const started = Date.now();
  while (!(window as any).google?.accounts?.id) {
    if (Date.now() - started > 5000) throw new Error("Google Identity Services not ready");
    await new Promise((r) => setTimeout(r, 50));
  }
}