import { sanitizeSettings, sanitizePlatform } from "./sanitize.js";

// "About me" fields are deliberately left out of share links — they're personal.
export function encodeShareParams(settings, platform, preset) {
  const s = settings;
  const params = new URLSearchParams({
    d: s.directness, v: s.verbosity, h: s.honesty,
    a: s.abstraction, s: s.structure, o: s.answerOrder,
    un: s.uncertainty ? "1" : "0", cl: s.clarify ? "1" : "0", nf: s.noFiller ? "1" : "0",
    em: s.emoji, uc: s.useCases.join(","), ex: s.expertise, dg: s.disagreement,
    plt: platform,
  });
  if (preset && preset !== "custom") params.set("preset", preset);
  if (s.custom) params.set("cu", s.custom);
  return params;
}

// Returns null when the URL carries no settings.
export function decodeShareParams(search) {
  const p = new URLSearchParams(search);
  if (!p.has("d")) return null;
  const flag = (k) => (p.has(k) ? p.get(k) === "1" : undefined);
  const settings = sanitizeSettings({
    directness: p.get("d"), verbosity: p.get("v"), honesty: p.get("h"),
    abstraction: p.get("a"),
    structure: p.get("s") ?? p.get("st"), // older links wrote structure as "st"
    answerOrder: p.get("o"),
    uncertainty: flag("un"), clarify: flag("cl"), noFiller: flag("nf"),
    emoji: p.get("em"), expertise: p.get("ex"), disagreement: p.get("dg"),
    useCases: (p.get("uc") || "").split(","),
    custom: p.get("cu") || "",
  });
  return { settings, platform: sanitizePlatform(p.get("plt")), preset: p.get("preset") || "custom" };
}
