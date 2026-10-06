import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDraft, draftBlocks, polishedBlocks } from "../src/lib/prompt/builder.js";
import { sanitizeSettings } from "../src/lib/prompt/sanitize.js";
import { encodeShareParams, decodeShareParams } from "../src/lib/prompt/share.js";
import { checkPolished, buildUserMessage, synthesize } from "../src/lib/prompt/synthesis.js";
import { DEFAULT_SETTINGS, PRESETS } from "../src/lib/prompt/config.js";
import { composeVibe, SCENARIOS } from "../src/lib/vibe.js";

const custom = sanitizeSettings({
  ...DEFAULT_SETTINGS, directness: 5, verbosity: 1, structure: 4, honesty: 1, emoji: "never",
  useCases: ["coding", "research"], about: { role: "Data scientist", work: "", tools: "Python" },
  custom: "Reply in Spanish\nUse metric units",
});

test("sanitize clamps faders, drops unknown enums, caps text", () => {
  const s = sanitizeSettings({ directness: 99, verbosity: "2", emoji: "lots", useCases: ["coding", "hacking"], about: { role: "x".repeat(500) } });
  assert.equal(s.directness, 5);
  assert.equal(s.verbosity, 2);
  assert.equal(s.emoji, DEFAULT_SETTINGS.emoji);
  assert.deepEqual(s.useCases, ["coding"]);
  assert.equal(s.about.role.length, 200);
});

test("share link round-trips every setting except personal fields", () => {
  const params = encodeShareParams(custom, "gemini", "custom");
  const decoded = decodeShareParams(`?${params}`);
  assert.equal(decoded.platform, "gemini");
  assert.deepEqual(decoded.settings, { ...custom, about: DEFAULT_SETTINGS.about });
});

test("old share links that used 'st' for structure still load", () => {
  const decoded = decodeShareParams("?d=4&v=2&h=3&a=1&st=5&o=4&uc=writing");
  assert.equal(decoded.settings.structure, 5);
  assert.deepEqual(decoded.settings.useCases, ["writing"]);
});

test("draft always carries the accuracy floor, even at the gentlest candor", () => {
  const draft = buildDraft(custom);
  assert.ok(draft.respond.some(l => l.id === "accuracy" && /accuracy over agreement/i.test(l.text)));
  assert.ok(!draft.respond.some(l => /lead with agreement/i.test(l.text)));
});

test("draft includes custom rules, about-me lines, and no shouting", () => {
  const draft = buildDraft(custom);
  assert.deepEqual(draft.respond.filter(l => l.source === "custom").map(l => l.text), ["Reply in Spanish.", "Use metric units."]);
  assert.ok(draft.about.some(l => l.text === "My role: Data scientist."));
  assert.ok(draft.about.some(l => l.text === "I mostly use you for coding and research."));
  const all = [...draft.about, ...draft.respond].map(l => l.text).join(" ");
  assert.doesNotMatch(all, /\b(CRITICAL|MUST|NEVER|ALWAYS)\b/);
});

test("every preset builds a draft that fits ChatGPT's two 1,500-char boxes", () => {
  for (const p of PRESETS) {
    const blocks = draftBlocks(buildDraft(sanitizeSettings(p.settings)), "chatgpt");
    assert.equal(blocks.length, 2);
    for (const b of blocks) assert.ok(b.text.length <= 1500, `${p.id} ${b.id}: ${b.text.length}`);
  }
});

test("non-ChatGPT platforms get one combined block", () => {
  const draft = buildDraft(custom);
  const [block] = draftBlocks(draft, "claude");
  assert.match(block.text, /^About me:\n- /);
  assert.match(block.text, /How to respond:\n- Prioritize accuracy/);
  assert.equal(polishedBlocks({ aboutMe: "", howToRespond: "- x" }, "grok")[0].text, "How to respond:\n- x");
});

test("the platform reaches the model prompt", () => {
  assert.match(buildUserMessage(buildDraft(custom), "chatgpt"), /two separate boxes/);
  assert.match(buildUserMessage(buildDraft(custom), "claude"), /Target platform: Claude/);
});

function validResult(draft) {
  const rules = draft.respond.filter(l => l.kind === "rule");
  return {
    about_me: "- I work in data science.",
    how_to_respond: rules.map(r => `- ${r.text}`).join("\n"),
    rule_coverage: rules.map(r => ({ id: r.id, sentence: r.text })),
  };
}

test("checkPolished accepts a faithful rewrite", () => {
  const draft = buildDraft(custom);
  assert.deepEqual(checkPolished(validResult(draft), draft, custom, "chatgpt"), []);
});

test("checkPolished catches dropped rules, overlong boxes, emoji, and shouting", () => {
  const draft = buildDraft(custom);
  const r = validResult(draft);
  r.rule_coverage = r.rule_coverage.filter(c => c.id !== "clarify");
  r.about_me = "x".repeat(1600);
  r.how_to_respond += "\n- You MUST be fun 🎉";
  const problems = checkPolished(r, draft, custom, "chatgpt").join(" | ");
  assert.match(problems, /"clarify" is missing/);
  assert.match(problems, /about_me is 1600 characters/);
  assert.match(problems, /no emoji/);
  assert.match(problems, /all-caps/);
});

test("synthesize retries once with feedback, then reports failure", async () => {
  const draft = buildDraft(custom);
  const bodies = [];
  const fetchImpl = async (_url, init) => {
    bodies.push(JSON.parse(init.body));
    const content = JSON.stringify({ about_me: "", how_to_respond: "- Be nice.", rule_coverage: [] });
    return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content } }] }) };
  };
  const r = await synthesize({ draft, settings: custom, platformId: "claude", apiKey: "k", model: "m", fetchImpl });
  assert.equal(r.failed, true);
  assert.equal(bodies.length, 2);
  assert.match(bodies[1].messages.at(-1).content, /fix these problems/);
});

test("vibe preview responds to faders", () => {
  for (const sc of SCENARIOS) {
    const terse = composeVibe({ ...DEFAULT_SETTINGS, verbosity: 1, directness: 5 }, sc.id);
    const deep = composeVibe({ ...DEFAULT_SETTINGS, verbosity: 5 }, sc.id);
    assert.ok(deep.length > terse.length, sc.id);
    assert.match(composeVibe({ ...DEFAULT_SETTINGS, structure: 5, verbosity: 4 }, sc.id), /• /);
    assert.doesNotMatch(composeVibe({ ...DEFAULT_SETTINGS, structure: 1, verbosity: 4 }, sc.id), /• /);
  }
  const filler = composeVibe({ ...DEFAULT_SETTINGS, noFiller: false, directness: 1 }, "plan");
  assert.match(filler, /Hope that helps/);
});

import { isRateLimited, clientIp } from "../src/lib/rateLimit.js";

test("memory rate limiter blocks after the limit within a window", async () => {
  const opts = { limit: 2, windowMs: 1000, env: {}, now: 5000 };
  assert.equal(await isRateLimited("a", opts), false);
  assert.equal(await isRateLimited("a", opts), false);
  assert.equal(await isRateLimited("a", opts), true);
  assert.equal(await isRateLimited("b", opts), false);
  assert.equal(await isRateLimited("a", { ...opts, now: 7000 }), false);
});

test("shared rate limiter uses Upstash REST and fails over to memory", async () => {
  const env = { UPSTASH_REDIS_REST_URL: "https://redis.example/", UPSTASH_REDIS_REST_TOKEN: "t" };
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body), auth: init.headers.Authorization });
    return { ok: true, json: async () => [{ result: 9 }, { result: 1 }] };
  };
  assert.equal(await isRateLimited("ip1", { limit: 8, windowMs: 60000, env, fetchImpl, now: 120000 }), true);
  assert.equal(calls[0].url, "https://redis.example/pipeline");
  assert.equal(calls[0].auth, "Bearer t");
  assert.deepEqual(calls[0].body[0], ["INCR", "peq:rl:ip1:2"]);

  const down = async () => { throw new Error("offline"); };
  const origError = console.error; console.error = () => {};
  try {
    assert.equal(await isRateLimited("ip2", { limit: 8, windowMs: 60000, env, fetchImpl: down, now: 1 }), false);
  } finally { console.error = origError; }
});

test("clientIp prefers x-real-ip, then the first forwarded address", () => {
  assert.equal(clientIp(new Headers({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" })), "1.1.1.1");
  assert.equal(clientIp(new Headers({ "x-forwarded-for": "3.3.3.3, 10.0.0.1" })), "3.3.3.3");
  assert.equal(clientIp(new Headers()), "local");
});

test("suggested limits get slack; hard limits don't", () => {
  const draft = buildDraft(custom);
  const r = validResult(draft);
  r.about_me = "x".repeat(1700 - r.how_to_respond.length);
  assert.deepEqual(checkPolished(r, draft, custom, "claude"), []);
  r.about_me = "x".repeat(2000 - r.how_to_respond.length);
  assert.match(checkPolished(r, draft, custom, "claude").join(), /keep them under 1500/);
});
