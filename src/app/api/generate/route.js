import { buildDraft } from "../../../lib/prompt/builder";
import { sanitizeSettings, sanitizePlatform } from "../../../lib/prompt/sanitize";
import { synthesize } from "../../../lib/prompt/synthesis";

// Benchmarked Oct 2026: the non-reasoning model polished in ~7s (median) and matched the
// reasoning models' output; grok-4.3 took ~16s, grok-4.7 ~20-30s, grok-4.20 reasoning ~60s.
// Override with XAI_MODEL (and XAI_REASONING_EFFORT for models that accept it).
const DEFAULT_MODEL = "grok-4.20-0309-non-reasoning";

// One polish plus one retry fits comfortably; this also caps runaway requests.
export const maxDuration = 30;

// Best-effort per-IP limiter. Serverless instances don't share memory, so this slows abuse
// rather than stopping it; swap in a shared store (e.g. Upstash/Vercel KV) for a hard limit.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
    if (rateLimited(ip)) {
      return Response.json({ error: "Too many requests. Give it a minute and try again." }, { status: 429 });
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Missing XAI_API_KEY environment variable" }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    // The prompt is built here from validated settings, so the endpoint can't be used as an open LLM proxy.
    const settings = sanitizeSettings(body.settings);
    const platform = sanitizePlatform(body.platform);
    const draft = buildDraft(settings);

    const result = await synthesize({
      draft, settings, platformId: platform, apiKey,
      model: process.env.XAI_MODEL || DEFAULT_MODEL,
      reasoningEffort: process.env.XAI_REASONING_EFFORT || undefined,
    });

    if (result.failed) {
      console.error("Polish failed validation:", result.problems);
      return Response.json({ fallback: true, problems: result.problems });
    }
    return Response.json({ aboutMe: result.aboutMe, howToRespond: result.howToRespond });

  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
