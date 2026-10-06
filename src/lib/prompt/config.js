// Shared settings schema — used by the generator UI, the share-link codec, and the API route.

export const DEFAULT_SETTINGS = {
  directness: 3, verbosity: 3, honesty: 3, abstraction: 3, structure: 3, answerOrder: 3,
  uncertainty: true, clarify: true, noFiller: true,
  emoji: "never", disagreement: "gentle",
  useCases: ["writing"], expertise: "peer",
  about: { role: "", work: "", tools: "" },
  custom: "",
};

export const PRESETS = [
  {
    id: "operator", name: "Operator", icon: "⚡", description: "Direct, structured, matter-of-fact",
    settings: { directness: 5, verbosity: 1, honesty: 3, abstraction: 1, structure: 5, answerOrder: 5, uncertainty: false, clarify: false, noFiller: true, emoji: "never", useCases: ["decision"], expertise: "expert", disagreement: "argue" }
  },
  {
    id: "strategist", name: "Strategist", icon: "♟️", description: "Balanced, analytical, big-picture",
    settings: { directness: 3, verbosity: 3, honesty: 5, abstraction: 3, structure: 3, answerOrder: 3, uncertainty: true, clarify: true, noFiller: true, emoji: "never", useCases: ["decision"], expertise: "peer", disagreement: "argue" }
  },
  {
    id: "learner", name: "Learner", icon: "🔬", description: "Curious, thorough, patient",
    settings: { directness: 2, verbosity: 4, honesty: 2, abstraction: 4, structure: 3, answerOrder: 1, uncertainty: true, clarify: true, noFiller: false, emoji: "sparingly", useCases: ["research"], expertise: "new", disagreement: "gentle" }
  },
  {
    id: "creator", name: "Creator", icon: "🎨", description: "Creative, unstructured, expressive",
    settings: { directness: 2, verbosity: 3, honesty: 4, abstraction: 5, structure: 2, answerOrder: 2, uncertainty: true, clarify: false, noFiller: false, emoji: "sparingly", useCases: ["brainstorm"], expertise: "peer", disagreement: "argue" }
  }
];

// `levels` are the short labels shown under each fader notch (1–5).
export const SLIDERS = [
  { category: "Communication", key: "directness", label: "Directness", levels: ["Warm", "Friendly", "Balanced", "Direct", "Blunt"] },
  { category: "Communication", key: "verbosity", label: "Length", levels: ["Minimal", "Lean", "Moderate", "Detailed", "Deep"] },
  { category: "Communication", key: "honesty", label: "Candor", levels: ["Gentle", "Encouraging", "Balanced", "Challenging", "Stress-test"] },
  { category: "Thinking", key: "abstraction", label: "Analogies", levels: ["Literal", "Mostly literal", "Balanced", "Analogies", "Analogy-first"] },
  { category: "Thinking", key: "structure", label: "Structure", levels: ["Prose", "Mostly prose", "Mixed", "Structured", "Max"] },
  { category: "Thinking", key: "answerOrder", label: "Answer order", levels: ["Context first", "Some framing", "Balanced", "Answer first", "TL;DR first"] }
];

export const TOGGLES = [
  { key: "uncertainty", label: "When uncertain…", on: "Admit it openly", off: "Give best guess" },
  { key: "clarify", label: "Ambiguous request…", on: "Ask a quick question", off: "Assume and go" },
  { key: "noFiller", label: "Filler & pleasantries", on: "Cut them", off: "Allow them" }
];

export const PILL_GROUPS = {
  useCases: [
    { value: "writing", label: "Writing" }, { value: "coding", label: "Coding" },
    { value: "research", label: "Research" }, { value: "brainstorm", label: "Brainstorming" },
    { value: "decision", label: "Decision-Making" }
  ],
  expertise: [
    { value: "new", label: "Explain like I'm new" }, { value: "peer", label: "Peer-level" },
    { value: "expert", label: "Expert-level" }
  ],
  emoji: [
    { value: "never", label: "Never" }, { value: "sparingly", label: "Sparingly" },
    { value: "freely", label: "Freely" }
  ],
  disagreement: [
    { value: "gentle", label: "Flag concerns gently" }, { value: "argue", label: "Argue the other side hard" }
  ]
};

export const ABOUT_FIELDS = [
  { key: "role", label: "Role", placeholder: "e.g. Product manager at a fintech startup" },
  { key: "work", label: "Working on", placeholder: "e.g. Launching a B2B onboarding flow" },
  { key: "tools", label: "Tools / stack", placeholder: "e.g. Figma, SQL, Python, Notion" }
];

// `hard` limits are enforced by the platform; the others are suggested lengths that keep instructions focused.
export const PLATFORMS = [
  {
    id: "claude", name: "Claude", icon: "/claude-logo.png", limit: 2000, hard: false, split: false,
    note: "Settings > General > Profile > 'Custom Instructions'",
    guidance: "Pasted into Claude's profile preferences. Plain sentences or short bullets work best here; XML tags and headings add nothing in this field."
  },
  {
    id: "chatgpt", name: "ChatGPT", icon: "/chatgpt-logo.png", limit: 1500, hard: true, split: true,
    note: "Settings > Personalization > 'Custom Instructions' — box 1 and box 2",
    guidance: "ChatGPT has two separate boxes: 'What should ChatGPT know about you?' (about_me) and 'How would you like ChatGPT to respond?' (how_to_respond). Each box has a hard 1,500-character limit."
  },
  {
    id: "gemini", name: "Gemini", icon: "/gemini-logo.png", limit: 3000, hard: false, split: false,
    note: "Settings > Personal Intelligence > Instructions OR Explore Gems > New Gem",
    guidance: "Pasted into Gemini's saved instructions or a Gem. Gems allow longer instructions, so a little more specificity is welcome."
  },
  {
    id: "grok", name: "Grok", icon: "/grok-logo.png", limit: 1500, hard: false, split: false,
    note: "Settings > Customize > 'How would you like Grok to respond?'",
    guidance: "Pasted into Grok's customization field. Keep it compact."
  }
];

export const getPlatform = (id) => PLATFORMS.find(p => p.id === id) || PLATFORMS[0];
