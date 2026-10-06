import { buildDraft } from "../../../lib/prompt/builder";
import { sanitizeSettings, sanitizePlatform } from "../../../lib/prompt/sanitize";
import { synthesize } from "../../../lib/prompt/synthesis";
import { isRateLimited, clientIp } from "../../../lib/rateLimit";

// Benchmarked Oct 2026: the non-reasoning model polished in ~7s (median) and matched the
// reasoning models' output; grok-4.3 took ~16s, grok-4.7 ~20-30s, grok-4.20 reasoning ~60s.
// Override with XAI_MODEL (and XAI_REASONING_EFFORT for models that accept it).
const DEFAULT_MODEL = "grok-4.20-0309-non-reasoning";

// One polish plus one retry fits comfortably; this also caps runaway requests.
export const maxDuration = 30;

// Per-IP limit. Shared across instances when UPSTASH_REDIS_REST_URL/TOKEN (or Vercel KV's
// KV_REST_API_URL/TOKEN) are set; per-instance memory otherwise.
const RATE_LIMIT = { limit: 8, windowMs: 60_000 };
const MAX_BODY_BYTES = 8_000;

export async function POST(req) {
  try {
    if (await isRateLimited(clientIp(req.headers), RATE_LIMIT)) {
      return Response.json({ error: "Too many requests. Give it a minute and try again." }, { status: 429 });
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      console.error("Missing XAI_API_KEY environment variable");
      return Response.json({ error: "The polish service isn't configured." }, { status: 500 });
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ error: "Request too large." }, { status: 413 });
    }
    let body = null;
    try { body = JSON.parse(raw); } catch { /* handled below */ }
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
    // Upstream errors can include account details; log them, don't return them.
    console.error("API error:", error);
    return Response.json({ error: "The AI service had a problem. Try again in a moment." }, { status: 502 });
  }
}
