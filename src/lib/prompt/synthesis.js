import { getPlatform } from "./config.js";

export const SYSTEM_PROMPT = `You write custom instructions that people paste into their AI assistant's settings (ChatGPT custom instructions, Claude profile preferences, Gemini Gems, Grok customization). You'll get a draft built from the user's settings. Rewrite it so it reads like a thoughtful person wrote it for their own assistant.

What good custom instructions look like:
- Written from the user's point of view ("I prefer…", "Tell me when…") or as plain requests to the assistant.
- Calm, specific language that describes what to do. Avoid all-caps, words like CRITICAL or MUST, and stacks of "always"/"never" — current models follow instructions literally and over-apply absolutes.
- Each preference stated once. A few words of reason where it helps the assistant generalize ("Lead with the answer — I usually skim").
- When two settings pull against each other (say, a blunt tone with lots of analogies), reconcile them into one coherent instruction instead of listing both.
- No role-play or identity statements ("You are an expert…"). Describe behavior that holds in any conversation.
- Keep every preference in the draft. You may merge, reorder, and reword lines for flow.

Lines tagged [rule:<id>] were set explicitly by the user. Keep each one's meaning exactly: reword for flow if you like, but don't soften, weaken, or drop it. Lines tagged [style:<id>] are preferences you can blend more freely. The "accuracy" rule is the foundation of the whole set: the assistant should value being right over being agreeable.

Formatting: plain text, one instruction per line, each line starting with "- ". No headings, no markdown emphasis, no XML tags. Put facts about the user in about_me and behavior in how_to_respond.

For rule_coverage, map every rule id to the exact sentence in how_to_respond that carries it, copied character for character.

Example of the voice to aim for (style only — don't reuse its content):
- Give me the answer first, then the reasoning; I usually skim.
- If my plan has a flaw, say so plainly, even if I seem attached to it.
- When you're unsure, tell me how unsure, and separate what you know from what you're guessing.
- Skip openers and sign-offs; start with substance.`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    about_me: { type: "string" },
    how_to_respond: { type: "string" },
    rule_coverage: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, sentence: { type: "string" } },
        required: ["id", "sentence"],
        additionalProperties: false,
      },
    },
  },
  required: ["about_me", "how_to_respond", "rule_coverage"],
  additionalProperties: false,
};

export function buildUserMessage(draft, platformId) {
  const platform = getPlatform(platformId);
  const tag = (l) => `- [${l.kind === "rule" ? "rule" : "style"}:${l.id}] ${l.text}`;
  const lengthRule = platform.split
    ? `about_me and how_to_respond each have a hard limit of ${platform.limit} characters.`
    : `about_me and how_to_respond together should stay under ${platform.limit} characters (they're pasted as one block).`;
  return `Target platform: ${platform.name}. ${platform.guidance}
Length: ${lengthRule}

About the user (draft):
${draft.about.map(l => `- ${l.text}`).join("\n") || "- (nothing provided)"}

How to respond (draft):
${draft.respond.map(tag).join("\n")}`;
}

const SOFT_LIMIT_SLACK = 1.25;
const ATTEMPT_TIMEOUT_MS = 20_000;
const EMOJI_RE = /\p{Extended_Pictographic}/u;
const SHOUTING_RE = /\b(CRITICAL|MUST|NEVER|ALWAYS|IMPORTANT)\b/;
const normalize = (t) => t.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();

// Returns a list of problems; empty means the polished output is safe to show.
export function checkPolished(result, draft, settings, platformId) {
  const platform = getPlatform(platformId);
  const problems = [];
  const about = result.about_me || "";
  const respond = result.how_to_respond || "";

  if (!respond.trim()) problems.push("how_to_respond is empty.");
  if (platform.split) {
    if (about.length > platform.limit) problems.push(`about_me is ${about.length} characters; the limit is ${platform.limit}.`);
    if (respond.length > platform.limit) problems.push(`how_to_respond is ${respond.length} characters; the limit is ${platform.limit}.`);
  } else if (about.length + respond.length > platform.limit * (platform.hard ? 1 : SOFT_LIMIT_SLACK)) {
    // Suggested limits get slack: running a little long beats discarding a good rewrite.
    problems.push(`The two sections total ${about.length + respond.length} characters; keep them under ${platform.limit}.`);
  }

  const coverage = new Map((result.rule_coverage || []).map(c => [c.id, c.sentence || ""]));
  const haystack = normalize(respond);
  for (const l of draft.respond.filter(l => l.kind === "rule")) {
    const sentence = coverage.get(l.id);
    if (!sentence || sentence.trim().length < 8) problems.push(`Rule "${l.id}" is missing from rule_coverage.`);
    else if (!haystack.includes(normalize(sentence))) problems.push(`The sentence given for rule "${l.id}" doesn't appear verbatim in how_to_respond.`);
  }

  if (settings.emoji === "never" && EMOJI_RE.test(about + respond)) problems.push("The user chose no emoji, but the text contains emoji.");
  if (SHOUTING_RE.test(about + respond) && !SHOUTING_RE.test(settings.custom)) problems.push("Remove all-caps emphasis words (CRITICAL, MUST, NEVER, ALWAYS, IMPORTANT).");
  return problems;
}

const tidy = (t) => (t || "").replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim();

// Calls xAI, verifies the result, retries once with feedback. Returns null if it can't produce a valid result.
export async function synthesize({ draft, settings, platformId, apiKey, model, reasoningEffort, fetchImpl = fetch }) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserMessage(draft, platformId) },
  ];
  let lastProblems = [];

  for (let attempt = 0; attempt < 2; attempt++) {
    const resp = await fetchImpl("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      // Railway lets requests run for minutes, so cap each attempt here rather than relying on the host.
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        ...(reasoningEffort ? { reasoning_effort: reasoningEffort } : {}),
        // Reasoning models spend tokens before answering; leave room so output isn't cut off.
        max_tokens: 6000,
        response_format: { type: "json_schema", json_schema: { name: "custom_instructions", strict: true, schema: RESPONSE_SCHEMA } },
      }),
    });
    const data = await resp.json().catch(() => null);
    if (!resp.ok || !data || data.error) {
      throw new Error(data?.error?.message || data?.error || `xAI request failed (${resp.status})`);
    }

    const content = data.choices?.[0]?.message?.content || "";
    let parsed;
    try { parsed = JSON.parse(tidy(content)); } catch { parsed = null; }
    if (!parsed) {
      lastProblems = ["The response wasn't valid JSON."];
    } else {
      parsed.about_me = tidy(parsed.about_me);
      parsed.how_to_respond = tidy(parsed.how_to_respond);
      lastProblems = checkPolished(parsed, draft, settings, platformId);
      if (!lastProblems.length) return { aboutMe: parsed.about_me, howToRespond: parsed.how_to_respond, attempts: attempt + 1 };
    }
    messages.push({ role: "assistant", content });
    messages.push({ role: "user", content: `Please fix these problems and return the full JSON again:\n- ${lastProblems.join("\n- ")}` });
  }

  return { failed: true, problems: lastProblems };
}
