import { getPlatform } from "./config.js";

// Wording follows current prompting guidance: calm, positive phrasing, a short reason where it
// helps the model generalize, and no all-caps "MUST"/"NEVER" (modern models over-apply absolutes).

const TONE = [
  "Use a warm, encouraging tone, with a little personality.",
  "Keep the tone friendly and approachable without overdoing the pleasantries.",
  "Keep a balanced tone: courteous, but get to the substance quickly.",
  "Be direct and matter-of-fact, and get to the point.",
  "Be blunt and economical: say it in the fewest words that stay clear. Courtesy is fine; padding isn't.",
];
const LENGTH = [
  "Keep answers as short as the question allows, often a sentence or two. I'll ask if I want more.",
  "Keep answers lean: cover what matters and leave out the rest.",
  "Aim for moderate length: the key points, with enough detail to act on.",
  "Give thorough answers that cover the important details, edge cases, and trade-offs.",
  "Go deep when the topic warrants it. I'd rather get depth than ask follow-ups, but cut repetition.",
];
const CANDOR = [
  "Deliver criticism gently: start with what works, then explain what to improve.",
  "Be encouraging, and offer improvements as concrete suggestions.",
  "Give a balanced assessment: what works and what doesn't, with equal candor.",
  "Proactively challenge my assumptions and point out weaknesses I haven't asked about.",
  "Stress-test my ideas by default: find the weakest points, likely failure modes, and the strongest counterargument.",
];
const ANALOGY = [
  "Stay literal and precise. Use technical terms correctly and skip metaphors.",
  "Be mostly literal; use a concrete example when it makes something clearer.",
  "Use an analogy or example when it genuinely helps understanding.",
  "Lean on analogies and concrete examples to explain ideas. I learn best that way.",
  "Explain ideas through vivid analogies or examples first, then give the precise version.",
];
const STRUCTURE = [
  "Write in flowing prose paragraphs. Use lists only when I ask for them.",
  "Write mostly in prose; use a short list only when items are genuinely parallel.",
  "Mix prose and structure, using lists or headings when they make content easier to scan.",
  "Favor scannable formatting: headings, bullet points, and tables for comparisons.",
  "Format for skimming: headings, bullets, and tables wherever they fit, with short paragraphs.",
];
const ORDER = [
  "Build up the context and reasoning first, then arrive at the conclusion.",
  "Give a little framing before the conclusion.",
  "Start with brief context, then give the answer.",
  "Lead with the answer, then explain.",
  "Put the answer or recommendation in the first sentence, since I usually skim. Details come after.",
];

const EXPERTISE = {
  new: "I'm new to a lot of these topics, so define jargon and explain the why behind things.",
  peer: "Treat me as a knowledgeable peer: skip the basics and engage at a professional level.",
  expert: "I'm an expert in my field. Be technical, skip fundamentals, and go deep.",
};
const EMOJI = {
  never: "Write without emoji.",
  sparingly: "Use emoji rarely, only where they add meaning.",
  freely: "Feel free to use emoji to add personality.",
};
const DISAGREE = {
  gentle: "When you disagree with me, say so tactfully and offer an alternative.",
  argue: "When you disagree with me, say so plainly and make the strongest case for the other side.",
};

const USE_CASE_PHRASES = {
  writing: "writing", coding: "coding", research: "research",
  brainstorm: "brainstorming", decision: "decision-making",
};

function listPhrase(items) {
  if (items.length <= 1) return items[0] || "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const line = (id, kind, source, text) => ({ id, kind, source, text });

// Returns the instructions as id-tagged lines so the UI can highlight exactly what changed,
// and the API can verify that each user-set rule survives the AI rewrite.
export function buildDraft(s) {
  const about = [];
  if (s.about.role) about.push(line("role", "about", "about", `My role: ${s.about.role}`.replace(/\.?$/, ".")));
  if (s.about.work) about.push(line("work", "about", "about", `Right now I'm working on: ${s.about.work}`.replace(/\.?$/, ".")));
  if (s.about.tools) about.push(line("tools", "about", "about", `Tools I use: ${s.about.tools}`.replace(/\.?$/, ".")));
  const uses = s.useCases.map(u => USE_CASE_PHRASES[u]).filter(Boolean);
  if (uses.length) about.push(line("useCases", "about", "useCases", `I mostly use you for ${listPhrase(uses)}.`));
  about.push(line("expertise", "about", "expertise", EXPERTISE[s.expertise]));

  const respond = [
    line("accuracy", "rule", "honesty", "Prioritize accuracy over agreement. If I'm wrong, tell me, and hold your position when I push back unless I give you a better argument."),
    line("answerOrder", "style", "answerOrder", ORDER[s.answerOrder - 1]),
    line("verbosity", "style", "verbosity", LENGTH[s.verbosity - 1]),
    line("directness", "style", "directness", TONE[s.directness - 1]),
    line("structure", "style", "structure", STRUCTURE[s.structure - 1]),
    line("abstraction", "style", "abstraction", ANALOGY[s.abstraction - 1]),
    line("honesty", "style", "honesty", CANDOR[s.honesty - 1]),
    line("disagreement", "rule", "disagreement", DISAGREE[s.disagreement]),
    line("uncertainty", "rule", "uncertainty", s.uncertainty
      ? "Tell me when you're unsure and how confident you are, and separate what you know from what you're inferring."
      : "When you're unsure, give your best assessment and keep going; flag uncertainty only when being wrong would be costly."),
    line("clarify", "rule", "clarify", s.clarify
      ? "If a request is ambiguous in a way that would change the answer, ask one short clarifying question first."
      : "If a request is ambiguous, make a reasonable assumption, state it in one line, and proceed."),
  ];
  if (s.noFiller) {
    respond.push(line("filler", "rule", "noFiller", "Start with substance. Skip openers like \"Great question!\", closing offers of more help, restating my question, and apologies unless you actually made a mistake."));
  }
  respond.push(line("emoji", "rule", "emoji", EMOJI[s.emoji]));
  s.custom.split("\n").filter(Boolean).forEach((c, i) => {
    respond.push(line(`custom${i + 1}`, "rule", "custom", c.replace(/\.?$/, ".")));
  });

  return { about, respond };
}

export const linesToText = (lines) => lines.map(l => `- ${l.text}`).join("\n");

// Splits into the blocks the user pastes: two boxes for ChatGPT, one block elsewhere.
export function draftBlocks(draft, platformId) {
  const platform = getPlatform(platformId);
  if (platform.split) {
    return [
      { id: "about", title: "Box 1 · What should ChatGPT know about you?", limit: platform.limit, sections: [{ heading: null, lines: draft.about }] },
      { id: "respond", title: "Box 2 · How would you like ChatGPT to respond?", limit: platform.limit, sections: [{ heading: null, lines: draft.respond }] },
    ].map(b => ({ ...b, text: sectionsToText(b.sections) }));
  }
  const sections = [{ heading: "About me", lines: draft.about }, { heading: "How to respond", lines: draft.respond }];
  return [{ id: "all", title: `${platform.name} custom instructions`, limit: platform.limit, sections, text: sectionsToText(sections) }];
}

function sectionsToText(sections) {
  return sections
    .filter(s => s.lines.length)
    .map(s => (s.heading ? `${s.heading}:\n` : "") + linesToText(s.lines))
    .join("\n\n");
}

// Same block shape for AI-polished text.
export function polishedBlocks(result, platformId) {
  const platform = getPlatform(platformId);
  if (platform.split) {
    return [
      { id: "about", title: "Box 1 · What should ChatGPT know about you?", limit: platform.limit, text: result.aboutMe },
      { id: "respond", title: "Box 2 · How would you like ChatGPT to respond?", limit: platform.limit, text: result.howToRespond },
    ];
  }
  const text = [result.aboutMe && `About me:\n${result.aboutMe}`, `How to respond:\n${result.howToRespond}`].filter(Boolean).join("\n\n");
  return [{ id: "all", title: `${platform.name} custom instructions`, limit: platform.limit, text }];
}

