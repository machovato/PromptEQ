import { DEFAULT_SETTINGS, PILL_GROUPS, PLATFORMS } from "./config.js";

export const MAX_ABOUT_CHARS = 200;
export const MAX_CUSTOM_CHARS = 600;

const FADERS = ["directness", "verbosity", "honesty", "abstraction", "structure", "answerOrder"];
const BOOLS = ["uncertainty", "clarify", "noFiller"];

const allowed = (group) => PILL_GROUPS[group].map(p => p.value);

function fader(v, fallback) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(5, Math.max(1, n)) : fallback;
}

function text(v, max) {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

// Coerces untrusted input (request bodies, share links) into a valid settings object.
export function sanitizeSettings(input) {
  const src = input && typeof input === "object" ? input : {};
  const out = { ...DEFAULT_SETTINGS, about: { ...DEFAULT_SETTINGS.about } };

  for (const k of FADERS) out[k] = fader(src[k], DEFAULT_SETTINGS[k]);
  for (const k of BOOLS) if (typeof src[k] === "boolean") out[k] = src[k];

  if (allowed("emoji").includes(src.emoji)) out.emoji = src.emoji;
  if (allowed("disagreement").includes(src.disagreement)) out.disagreement = src.disagreement;
  if (allowed("expertise").includes(src.expertise)) out.expertise = src.expertise;

  if (Array.isArray(src.useCases)) {
    const picked = allowed("useCases").filter(v => src.useCases.includes(v));
    if (picked.length) out.useCases = picked;
  }

  const about = src.about && typeof src.about === "object" ? src.about : {};
  for (const k of Object.keys(out.about)) out.about[k] = text(about[k], MAX_ABOUT_CHARS);

  // Custom instructions keep their line breaks so users can list several rules.
  out.custom = typeof src.custom === "string"
    ? src.custom.replace(/\r/g, "").split("\n").map(l => l.trim()).filter(Boolean).join("\n").slice(0, MAX_CUSTOM_CHARS)
    : "";

  return out;
}

export function sanitizePlatform(id) {
  return PLATFORMS.some(p => p.id === id) ? id : PLATFORMS[0].id;
}
