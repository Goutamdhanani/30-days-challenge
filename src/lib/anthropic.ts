/**
 * Anthropic Claude client for generating 30-day challenges (Anthropic-only).
 * Cheapest model default: claude-3-5-haiku-20241022
 */
import { createChallengeFromPlan } from "./storage";

export type GeneratedTask = { title: string; details?: string; percent?: number };
export type GeneratedDay = { dayNumber: number; tasks: GeneratedTask[]; xpReward?: number; estMinutes?: number };
export type GeneratedPlan = { title: string; days: GeneratedDay[] };

const MODEL = (import.meta.env.VITE_ANTHROPIC_MODEL as string) || "claude-3-5-haiku-20241022";

function useProxy(): boolean {
  const v = (import.meta.env.VITE_USE_ANTHROPIC_PROXY as string) || "";
  return String(v).toLowerCase() === "true";
}
function getBrowserKey(): string | undefined {
  return import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
}

function buildUserPrompt(userGoal: string): string {
  return [
    "You are designing a focused, actionable 30-day challenge.",
    "Output JSON only matching the provided shape. No markdown code fences, no commentary.",
    "",
    "Rules:",
    "- Exactly 30 entries in days[] with dayNumber from 1..30.",
    "- Each day has 1..5 tasks (short, concrete, measurable).",
    "- Prefer progressive overload across days.",
    "- If percent weights are omitted or don't sum to 100, the client will rebalance.",
    "- Keep xpReward ~120 and estMinutes ~20-40.",
    "",
    `User goal: "${userGoal.trim()}"`,
    "",
    "Return valid JSON only with top-level keys: { \"title\": string, \"days\": Array<Day> }",
    "Where Day = { dayNumber: 1..30, tasks: Array<{ title: string, details?: string, percent?: number }>, xpReward?: number, estMinutes?: number }"
  ].join("\n");
}

function extractJsonObject(text: string): string | null {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    const fenceEnd = cleaned.lastIndexOf("```");
    if (fenceEnd > 0) cleaned = cleaned.slice(cleaned.indexOf("\n") + 1, fenceEnd).trim();
  }
  const start = cleaned.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < cleaned.length; i++) {
    const c = cleaned[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return cleaned.slice(start, i + 1);
    }
  }
  return null;
}

async function postMessages(payload: any, timeoutMs = 60000): Promise<any> {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    if (useProxy()) {
      const res = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Anthropic (proxy) failed: ${res.status} ${res.statusText} ${text}`);
      }
      return await res.json();
    }

    const key = getBrowserKey();
    if (!key) throw new Error("Missing VITE_ANTHROPIC_API_KEY or enable VITE_USE_ANTHROPIC_PROXY");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        // Required when calling Anthropic directly from browser
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Anthropic request failed: ${res.status} ${res.statusText} ${text}`);
    }
    return await res.json();
  } catch (e: any) {
    if (e?.name === "AbortError") throw new Error("Claude request timed out. Please try again.");
    if (String(e?.message || "").includes("Failed to fetch")) {
      throw new Error("Network/CORS error calling Claude. Enable VITE_USE_ANTHROPIC_PROXY=true and set ANTHROPIC_API_KEY.");
    }
    throw e;
  } finally {
    clearTimeout(to);
  }
}

export async function aiGeneratePlan(userGoal: string): Promise<GeneratedPlan> {
  const payload = {
    model: MODEL,
    max_tokens: 3000,
    temperature: 0.5,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: buildUserPrompt(userGoal) }]
      }
    ]
  };

  const data = await postMessages(payload);

  const block = Array.isArray(data?.content) ? data.content.find((b: any) => b?.type === "text") : null;
  const text: string | undefined = block?.text || data?.content?.[0]?.text;
  if (!text) throw new Error("Anthropic response missing text content");

  const jsonText = extractJsonObject(text) || text;
  let json: GeneratedPlan;
  try {
    json = JSON.parse(jsonText);
  } catch {
    console.error("Claude raw output:", text);
    throw new Error("Claude returned non-JSON content or malformed JSON");
  }

  if (!json?.days || !Array.isArray(json.days) || json.days.length !== 30) {
    throw new Error("Invalid plan shape: expected days[30]");
  }
  return json;
}

export async function aiCreateChallengeFromClaude(userGoal: string) {
  const plan = await aiGeneratePlan(userGoal);
  const normalized = Array.from({ length: 30 }, (_, i) => {
    const d = plan.days.find((x) => x.dayNumber === i + 1);
    return d || { dayNumber: i + 1, tasks: [{ title: "Rest / Reflection" }] };
  });
  return createChallengeFromPlan(plan.title || "AI Challenge", userGoal, normalized as any);
}