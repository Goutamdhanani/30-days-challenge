/**
 * Anthropic Claude client replacement for your 30-day challenge generator.
 *
 * - Uses Anthropic Messages API instead of OpenAI or Gemini.
 * - Cheapest: defaults to Claude 3.5 Haiku (very low per-request cost).
 * - Sends exactly one request per generation.
 *
 * IMPORTANT:
 * - Set VITE_ANTHROPIC_API_KEY in your .env.
 * - For browser apps, proxy this call via your backend (to keep your key secret and avoid CORS issues).
 */

import { Challenge } from "../types";
import { createChallengeFromPlan } from "./storage";

export type GeneratedTask = {
  title: string;
  details?: string;
  percent?: number;
};
export type GeneratedDay = {
  dayNumber: number;
  tasks: GeneratedTask[];
  xpReward?: number;
  estMinutes?: number;
};
export type GeneratedPlan = {
  title: string;
  days: GeneratedDay[];
};

function getKey(): string | undefined {
  return import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
}

// Use cheapest Claude model by default
const MODEL = (import.meta.env.VITE_ANTHROPIC_MODEL as string) || "claude-3-5-haiku-20241022";

function buildUserPrompt(userGoal: string): string {
  return [
    "You are designing a focused, actionable 30-day challenge.",
    "Output JSON only matching the provided schema. No markdown, no commentary.",
    "",
    "Rules:",
    "- Exactly 30 entries in days[] with dayNumber from 1..30.",
    "- Each day has 1..5 tasks. Keep tasks concrete, short, and measurable.",
    "- Prefer progressive overload across days.",
    "- If percent weights are omitted or do not sum to 100, the client will rebalance.",
    "- Keep xpReward around 120 and estMinutes around 20-40, adjust as needed.",
    "",
    `User goal/prompt: "${userGoal.trim()}"`,
    "",
    "Important: return valid JSON only. The top-level object should be { title, days }.",
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

export async function aiGeneratePlan(userGoal: string): Promise<GeneratedPlan> {
  const key = getKey();
  if (!key) throw new Error("Missing VITE_ANTHROPIC_API_KEY in environment");

  const url = "https://api.anthropic.com/v1/messages";

  const body = {
    model: MODEL,
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(userGoal)
      }
    ]
  } as any;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Anthropic request failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();

  const text = data?.content?.[0]?.text;
  if (!text) throw new Error("Anthropic response missing text");

  const jsonText = extractJsonObject(text) || text;
  let json: GeneratedPlan;
  try {
    json = JSON.parse(jsonText);
  } catch (e) {
    console.error("Failed to parse JSON from Claude output:", text);
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
    return (
      d || {
        dayNumber: i + 1,
        tasks: [{ title: "Rest / Reflection" }]
      }
    );
  });
  const ch = createChallengeFromPlan(plan.title || "AI Challenge", userGoal, normalized as any);
  return ch;
}
