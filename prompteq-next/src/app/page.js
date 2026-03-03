"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';

// --- DATA STRUCTURES ---

const PRESETS = [
  {
    id: "operator", name: "Operator", icon: "⚡", description: "Direct, structured, matter-of-fact",
    settings: { directness: 5, verbosity: 1, honesty: 3, abstraction: 1, structure: 5, answerOrder: 5, uncertainty: false, clarify: false, emoji: "never", useCase: "decision", expertise: "expert", disagreement: "argue" }
  },
  {
    id: "strategist", name: "Strategist", icon: "♟️", description: "Balanced, analytical, big-picture",
    settings: { directness: 3, verbosity: 3, honesty: 5, abstraction: 3, structure: 3, answerOrder: 3, uncertainty: true, clarify: true, emoji: "never", useCase: "decision", expertise: "peer", disagreement: "argue" }
  },
  {
    id: "learner", name: "Learner", icon: "🔬", description: "Curious, thorough, patient",
    settings: { directness: 2, verbosity: 4, honesty: 2, abstraction: 4, structure: 3, answerOrder: 1, uncertainty: true, clarify: true, emoji: "sparingly", useCase: "research", expertise: "new", disagreement: "gentle" }
  },
  {
    id: "creator", name: "Creator", icon: "🎨", description: "Creative, unstructured, expressive",
    settings: { directness: 2, verbosity: 3, honesty: 4, abstraction: 5, structure: 2, answerOrder: 2, uncertainty: true, clarify: false, emoji: "sparingly", useCase: "brainstorm", expertise: "peer", disagreement: "argue" }
  }
];

const PLATFORMS = [
  { id: "claude", name: "Claude", note: "Settings > General > Profile > 'Custom Instructions'" },
  { id: "chatgpt", name: "ChatGPT", note: "Settings > Personalization > 'Custom Instructions'" },
  { id: "gemini", name: "Gemini", note: "Settings > Personal Intelligence > Instructions OR Explore Gems > New Gem" },
  { id: "grok", name: "Grok", note: "Settings > Customize > 'How would you like Grok to respond?'" },
  { id: "agent", name: "Custom Agent", note: "Add to the Agent's core system message config (e.g., system_prompt parameter)" },
  { id: "generic", name: "Other", note: "Universal configuration" }
];

const SLIDERS = [
  { category: "Communication", key: "directness", label: "DIRECTNESS", left: "Warm & Polite", right: "Blunt & Direct" },
  { category: "Communication", key: "verbosity", label: "VERBOSITY", left: "Concise", right: "Thorough" },
  { category: "Communication", key: "honesty", label: "RAW TRUTH (HONESTY)", left: "Supportive", right: "Challenge First" },
  { category: "Thinking", key: "abstraction", label: "ABSTRACTION", left: "Literal / Tech", right: "Analogies" },
  { category: "Thinking", key: "structure", label: "STRUCTURE", left: "Narrative Prose", right: "Bullets & Tables" },
  { category: "Thinking", key: "answerOrder", label: "ANSWER ORDER", left: "Context First", right: "TL;DR First" }
];

const TOGGLES = [
  { key: "uncertainty", label: "WHEN UNCERTAIN...", on: "Admit it openly", off: "Give best guess" },
  { key: "clarify", label: "AMBIGUOUS REQUEST...", on: "Ask clarifying questions", off: "Assume and go" }
];

const PILL_GROUPS = {
  useCase: [
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

// --- DESIGN TOKENS ---
const COLORS = {
  bg: "#FAFAFA",
  text: "#15151A",
  purple: "#9b6dff",
  purpleHover: "#8b5cf6",
  navy: "#131620",
  green: "#b4eb4c",
  border: "#1C1C1C",
  gray: "#E5E5E5",
  textMuted: "#6B7280"
};

const SHADOWS = {
  hard: "4px 4px 0px 0px rgba(0,0,0,1)",
  hardSmall: "2px 2px 0px 0px rgba(0,0,0,1)"
};

// --- HELPER COMPONENTS ---

function BrutalistSlider({ config, value, onChange }) {
  const pct = ((value - 1) / 4) * 100;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>{config.label}</span>
          <span style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{config.left} → {config.right}</span>
        </div>
        <div style={{
          background: COLORS.navy, color: "white", padding: "4px 8px",
          borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace"
        }}>{Math.round(pct)}%</div>
      </div>
      <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", width: "100%", height: 6, background: "white", border: `2px solid ${COLORS.navy}`, borderRadius: 4 }} />
        <div style={{ position: "absolute", width: `${pct}%`, height: 6, background: COLORS.text, borderTop: `2px solid ${COLORS.navy}`, borderBottom: `2px solid ${COLORS.navy}`, borderLeft: `2px solid ${COLORS.navy}`, borderRadius: "4px 0 0 4px" }} />
        <div
          style={{
            position: "absolute", left: `calc(${pct}% - 8px)`,
            width: 16, height: 16, background: COLORS.purple,
            border: `2px solid ${COLORS.navy}`, borderRadius: 4,
            zIndex: 2, cursor: "grab"
          }}
        />
        <input
          type="range" min={1} max={5} step={1} value={value}
          onChange={e => onChange(config.key, parseInt(e.target.value))}
          style={{
            position: "absolute", width: "100%", height: 36, opacity: 0,
            cursor: "pointer", zIndex: 3
          }}
        />
      </div>
    </div>
  );
}

function BrutalistRadioPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "8px 16px", borderRadius: 24,
        border: `2px solid ${COLORS.navy}`,
        background: active ? COLORS.purple : "white",
        color: active ? "white" : COLORS.text, fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif",
        cursor: "pointer", transition: "all 0.1s ease",
        boxShadow: active ? "none" : SHADOWS.hardSmall,
        transform: active ? "translate(2px, 2px)" : "none"
      }}
    >
      {label}
    </button>
  )
}

function BrutalistToggle({ checked, onChange, label, onText, offText }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${COLORS.gray}` }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <div onClick={onChange} style={{
          width: 44, height: 24, borderRadius: 12, cursor: "pointer",
          background: checked ? COLORS.green : "white",
          border: `2px solid ${COLORS.navy}`,
          position: "relative", transition: "background 0.2s ease", flexShrink: 0
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: "50%", background: COLORS.navy,
            position: "absolute", top: 2, left: checked ? 22 : 2,
            transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }} />
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{checked ? onText : offText}</div>
      </div>
    </div>
  );
}

function PresetCard({ preset, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, minWidth: 100,
        padding: "24px 16px", borderRadius: 12,
        border: `2px solid ${COLORS.navy}`,
        background: active ? COLORS.purple : "white",
        color: active ? "white" : COLORS.text,
        cursor: "pointer", transition: "all 0.1s ease",
        boxShadow: active ? "none" : SHADOWS.hardSmall,
        transform: active ? "translate(2px, 2px)" : "none",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 4 }}>{preset.icon}</div>
      <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{preset.name}</div>
      <div style={{ fontSize: 10, opacity: 0.8, lineHeight: 1.4 }}>{preset.description}</div>
    </button>
  )
}

// --- UTILS ---

function buildRawSettingsString(settings, constraints) {
  const s = settings;
  const directnessDesc = ["very warm, polite, and encouraging", "friendly and approachable", "balanced between warmth and directness", "direct and matter-of-fact", "blunt and terse — no pleasantries"][s.directness - 1];
  const verbosityDesc = ["extremely concise — shortest possible answer", "lean — include only what's essential", "moderate length — cover key points", "detailed — provide thorough coverage", "comprehensive — leave nothing out"][s.verbosity - 1];
  const honestyDesc = ["supportive and validating — lead with agreement", "encouraging with gentle suggestions", "balanced honesty — acknowledge then critique", "proactively challenge assumptions", "skeptical devil's advocate — stress-test everything"][s.honesty - 1];
  const abstractionDesc = ["strictly literal and technical — no figurative language", "mostly literal with occasional examples", "balanced — use analogies when they genuinely clarify", "lean heavily on analogies and metaphors", "think in analogies first — translate everything into vivid comparisons"][s.abstraction - 1];
  const structureDesc = ["flowing narrative prose — no bullets or tables", "mostly prose with occasional formatting", "mix of prose and structured elements", "prefer bullets, headers, and organized formatting", "maximum structure — tables, bullets, headers for everything"][s.structure - 1];
  const orderDesc = ["build context and reasoning before giving the answer", "provide some framing before conclusions", "balanced — brief context then answer", "lead with the answer, then explain", "TL;DR first always — answer in the first sentence, details after"][s.answerOrder - 1];

  const uncertaintyRule = s.uncertainty
    ? "When you're uncertain, say so explicitly. Flag confidence levels."
    : "When uncertain, give your best assessment. Don't hedge unless stakes are high.";
  const clarifyRule = s.clarify
    ? "Ask clarifying questions when a request is ambiguous before proceeding."
    : "When requests are ambiguous, make reasonable assumptions and proceed. Don't slow things down asking for clarification.";
  const emojiRule = { never: "Never use emoji.", sparingly: "Use emoji sparingly — only where they genuinely aid communication.", freely: "Feel free to use emoji to add personality and clarity." }[s.emoji];
  const useCaseNote = { writing: "Primary context: helping with writing and content creation.", coding: "Primary context: software development and coding assistance.", research: "Primary context: research, analysis, and information synthesis.", brainstorm: "Primary context: brainstorming, ideation, and creative problem-solving.", decision: "Primary context: decision-making support and strategic analysis." }[s.useCase];
  const expertiseNote = { new: "Assume I'm learning — explain concepts, define jargon, be patient.", peer: "Treat me as a knowledgeable peer — skip basics, engage at a professional level.", expert: "I'm an expert — be technical, skip fundamentals, go deep." }[s.expertise];
  const disagreeNote = { gentle: "If you disagree, raise it diplomatically — suggest alternatives rather than directly opposing.", argue: "If you disagree, say so directly and argue the other side forcefully. Don't soften dissent." }[s.disagreement];

  const customBullet = constraints ? `\n- CUSTOM CONSTRAINT: ${constraints}` : "";

  // The platform selection currently doesn't do much on the backend. This adds specific rules
  // so the AI formats the prompt differently based on the target engine.
  const platformRules = {
    claude: "\n\nCRITICAL INSTRUCTION: Format the final output using XML tags (e.g., <system_prompt>, <rules>, <context>). Claude performs best when instructions and context are strictly bounded by XML tags.",
    chatgpt: "\n\nCRITICAL INSTRUCTION: Format the final output using clear Markdown headers and bullet points. Do not use XML tags. ChatGPT prefers structured markdown.",
    gemini: "\n\nCRITICAL INSTRUCTION: Format the final output as a clear set of directives and context blocks. Emphasize multi-modal capabilities if relevant to the use case.",
    grok: "\n\nCRITICAL INSTRUCTION: Format the final output using direct, unvarnished rules. Emphasize factual accuracy and a slightly more conversational tone if the settings allow.",
    generic: ""
  };

  const platformRule = platformRules[settings.platform] || "";

  return `## Communication Style
- Tone: ${directnessDesc}
- Length: ${verbosityDesc}
- Honesty: ${honestyDesc}

## Thinking Style
- Abstraction: ${abstractionDesc}
- Structure: ${structureDesc}
- Answer order: ${orderDesc}

## Behavioral Rules
- ${uncertaintyRule}
- ${clarifyRule}
- ${emojiRule}

## Context
- ${useCaseNote}
- ${expertiseNote}
- ${disagreeNote}${customBullet}${platformRule}`;
}

export default function Home() {
  const [settings, setSettings] = useState({
    directness: 3, verbosity: 3, honesty: 3, abstraction: 3, structure: 3,
    answerOrder: 3, uncertainty: true, clarify: true, emoji: "never",
    useCase: "writing", expertise: "peer", disagreement: "gentle"
  });

  const [activePreset, setActivePreset] = useState("custom");
  const [customConstraints, setCustomConstraints] = useState("");
  const [platform, setPlatform] = useState("claude");

  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const getVibePreview = () => {
    let vibe = "";
    if (settings.directness >= 4) {
      if (settings.verbosity <= 2) vibe = "Sales fell 12%. Fix mid-market churn.";
      else vibe = "Revenue dropped 12% QoQ. The root cause is an 8% churn in the mid-market sector. Action required immediately.";
    } else {
      if (settings.verbosity <= 2) vibe = "It looks like revenue went down a bit. Let's look into mid-market retention!";
      else vibe = "Thanks for sharing this data. I noticed a 12% decline in revenue this quarter, which seems primarily driven by mid-market churn. Let's explore some strategies together to address this.";
    }
    if (settings.structure >= 4) return `• Revenue: -12%\n• Cause: Mid-market churn`;
    return vibe;
  };

  const handleUpdate = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setActivePreset("custom");
  };

  const loadPreset = (presetId) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSettings(preset.settings);
      setActivePreset(presetId);
    }
  };

  const generatePrompt = async () => {
    setGenerating(true);
    setOutput("");

    const raw = buildRawSettingsString(settings, customConstraints);

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw, platform })
      });

      const data = await resp.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setOutput(data.text);
    } catch (e) {
      console.error(e);
      setOutput(`Error generating prompt:\n\n${e.message}\n\nPlease verify your environment variables.`);
    }
    setGenerating(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'Inter', sans-serif"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white border-b border-[#E5E5E5] px-6 py-6 md:px-10 md:py-6 gap-4 md:gap-0">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="PromptEQ Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>PromptEQ</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/about" style={{ textDecoration: 'none', color: COLORS.textMuted, fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
            About PromptEQ
          </Link>
          <div style={{
            border: `2px solid ${COLORS.gray}`, borderRadius: 24, padding: "6px 16px",
            fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            display: "flex", alignItems: "center", gap: 8, background: "#FAFAFA",
            color: COLORS.textMuted
          }}>
            <span style={{ width: 6, height: 6, background: COLORS.purpleHover, borderRadius: "50%" }}></span>
            PUBLIC GENERATOR
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full h-auto lg:h-[calc(100vh-83px)] overflow-visible lg:overflow-hidden">

        {/* COLUMN 1: LEFT CONFIGURATION */}
        <div className="flex-1 w-full lg:max-w-[650px] p-6 lg:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-[#E5E5E5] overflow-y-visible lg:overflow-y-auto h-auto lg:h-full box-border">

          {/* STEP 01 */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#F3E8FE", color: COLORS.purpleHover, padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 800, letterSpacing: "1px", marginBottom: 12 }}>STEP 01</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px 0" }}>Foundation</h2>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24, lineHeight: 1.5 }}>Select a starting archetype to pre-load a balanced mix of settings, or select a preset and begin customizing the sliders below.</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PRESETS.map(p => (
                <PresetCard key={p.id} preset={p} active={activePreset === p.id} onClick={() => loadPreset(p.id)} />
              ))}
            </div>
          </div>

          <div style={{ borderBottom: `2px dashed ${COLORS.gray}`, margin: "0 0 48px 0" }}></div>

          {/* STEP 02 */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#F3E8FE", color: COLORS.purpleHover, padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 800, letterSpacing: "1px", marginBottom: 12 }}>STEP 02</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px 0" }}>Context Variables</h2>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24, lineHeight: 1.5 }}>Tell the AI what you plan to use it for, and how much base knowledge it should assume you have on the topic.</div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>PRIMARY USE CASE</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PILL_GROUPS.useCase.map(p => (
                  <BrutalistRadioPill key={p.value} label={p.label} active={settings.useCase === p.value} onClick={() => handleUpdate("useCase", p.value)} />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>MY EXPERTISE LEVEL</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PILL_GROUPS.expertise.map(p => (
                  <BrutalistRadioPill key={p.value} label={p.label} active={settings.expertise === p.value} onClick={() => handleUpdate("expertise", p.value)} />
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderBottom: `2px dashed ${COLORS.gray}`, margin: "0 0 48px 0" }}></div>

          {/* STEP 03 */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#F3E8FE", color: COLORS.purpleHover, padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 800, letterSpacing: "1px", marginBottom: 12 }}>STEP 03</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px 0" }}>The Mix (Faders)</h2>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 40, lineHeight: 1.5 }}>
              The core personality matrix. Adjusting these faders shifts the fundamental way the AI processes and delivers information.
            </div>
            <div>
              {SLIDERS.map((s, i) => (
                <div key={s.key}>
                  {i === 3 && <div style={{ borderTop: `1px solid ${COLORS.gray}`, marginTop: 40, paddingTop: 40 }}></div>}
                  <BrutalistSlider config={s} value={settings[s.key]} onChange={handleUpdate} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderBottom: `2px dashed ${COLORS.gray}`, margin: "0 0 48px 0" }}></div>

          {/* STEP 04 */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#F3E8FE", color: COLORS.purpleHover, padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 800, letterSpacing: "1px", marginBottom: 12 }}>STEP 04</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px 0" }}>Behavioral Rules</h2>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24, lineHeight: 1.5 }}>
              Hard constraints for edge cases. Should the AI argue with you? Should it use emojis? Should it guess when it doesn't know the answer?
            </div>

            <div style={{ background: "white", border: `2px solid ${COLORS.navy}`, borderRadius: 16, padding: "8px 24px", marginBottom: 32, boxShadow: SHADOWS.hardSmall }}>
              {TOGGLES.map(t => (
                <BrutalistToggle key={t.key} checked={settings[t.key]} onChange={() => handleUpdate(t.key, !settings[t.key])} label={t.label} onText={t.on} offText={t.off} />
              ))}
              <div style={{ padding: "20px 0", borderBottom: `1px solid ${COLORS.gray}` }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>EMOJI USAGE</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>How frequently should the AI use emojis in its responses?</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PILL_GROUPS.emoji.map(p => (
                    <BrutalistRadioPill key={p.value} label={p.label} active={settings.emoji === p.value} onClick={() => handleUpdate("emoji", p.value)} />
                  ))}
                </div>
              </div>
              <div style={{ padding: "20px 0" }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>DISAGREEMENT STYLE</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>When the AI spots a flaw in your logic, how should it push back?</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PILL_GROUPS.disagreement.map(p => (
                    <BrutalistRadioPill key={p.value} label={p.label} active={settings.disagreement === p.value} onClick={() => handleUpdate("disagreement", p.value)} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>SPECIAL INSTRUCTIONS (Optional)</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>Add any custom rules specific to your workflow (e.g. &quot;Always reply in Spanish&quot;, &quot;Never use the word &#39;delve&#39;&quot;, &quot;Format all code in Python&quot;).</div>
              <textarea
                placeholder="Ex: Do not use technical jargon, focus on accessibility..."
                value={customConstraints}
                onChange={(e) => setCustomConstraints(e.target.value)}
                style={{
                  width: "100%", height: 120, padding: 16,
                  border: `2px solid ${COLORS.navy}`, borderRadius: 12,
                  fontFamily: "'Inter', sans-serif", fontSize: 14, resize: "vertical",
                  outline: "none", boxSizing: "border-box", boxShadow: "inset 2px 2px 0px 0px rgba(0,0,0,0.05)"
                }}
              />
            </div>
          </div>

        </div>

        {/* COLUMN 2: RIGHT BOOTH */}
        <div className="flex-1 w-full p-6 lg:p-12 flex flex-col gap-6 h-auto lg:h-full overflow-visible lg:overflow-hidden box-border">

          {/* TERMINAL */}
          <div className="flex flex-col min-h-[500px] lg:min-h-0 flex-1 bg-[#131620] rounded-3xl p-6 lg:p-8"
            style={{
              boxShadow: SHADOWS.hard, border: `2px solid ${COLORS.navy}`
            }}>
            {/* Mac Dots / Header */}
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 24, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 8, marginRight: "auto" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }}></div>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }}></div>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }}></div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "1px", color: "#6B7280", flex: 1, textAlign: "center" }}>
                CONTROL BOOTH // {output ? "RESULT" : "LIVE VIBE CHECK"}
              </div>

              {output && (
                <button onClick={copyOutput} style={{
                  marginLeft: "auto", background: copied ? COLORS.green : "transparent", color: copied ? COLORS.navy : "#6B7280",
                  border: `1px solid ${copied ? COLORS.green : "#6B7280"}`, borderRadius: 6, padding: "4px 12px",
                  fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", transition: "all 0.1s ease"
                }}>
                  {copied ? "COPIED!" : "COPY"}
                </button>
              )}
            </div>

            {/* Content */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7, color: "#94A3B8", overflowY: "auto", flex: 1 }}>
              {!output && !generating ? (
                <>
                  <div style={{ color: "#3B82F6", marginBottom: 8 }}># PROMPT FOUNDATION: {activePreset.toUpperCase()}</div>
                  <div style={{ marginBottom: 24 }}>
                    {getVibePreview()}
                  </div>

                  <div style={{ color: "#3B82F6", marginBottom: 12 }}># PARAMETERS (Normalized)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", marginBottom: 24 }}>
                    <div><span style={{ color: "#10B981" }}>DIRECTNESS:</span> {((settings.directness - 1) / 4).toFixed(2)}</div>
                    <div><span style={{ color: "#10B981" }}>ABSTRACTION:</span> {((settings.abstraction - 1) / 4).toFixed(2)}</div>
                    <div><span style={{ color: "#10B981" }}>VERBOSITY:</span> {((settings.verbosity - 1) / 4).toFixed(2)}</div>
                    <div><span style={{ color: "#10B981" }}>STRUCTURE:</span> {((settings.structure - 1) / 4).toFixed(2)}</div>
                    <div><span style={{ color: "#10B981" }}>HONESTY:</span> {((settings.honesty - 1) / 4).toFixed(2)}</div>
                    <div><span style={{ color: "#10B981" }}>ANS_ORDER:</span> {((settings.answerOrder - 1) / 4).toFixed(2)}</div>
                  </div>

                  <div style={{ color: "#3B82F6", marginBottom: 12 }}># ACTIVE FLAGS</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                    <span style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid #10B981", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>USE_CASE__{settings.useCase.toUpperCase()}</span>
                    <span style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid #10B981", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>EXP__{settings.expertise.toUpperCase()}</span>
                    {settings.uncertainty && <span style={{ background: "rgba(155,109,255,0.1)", color: "#9b6dff", border: "1px solid #9b6dff", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>FLAG_UNCERTAINTY</span>}
                    {settings.clarify && <span style={{ background: "rgba(155,109,255,0.1)", color: "#9b6dff", border: "1px solid #9b6dff", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>FORCE_CLARIFY</span>}
                  </div>

                  <div style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", marginTop: 32, paddingTop: 32, fontStyle: "italic", color: "#4B5563" }}>
                    _ Waiting for engine synchronization...
                  </div>
                </>
              ) : generating ? (
                <div style={{ color: "#b4eb4c" }}>
                  &gt; Booting synthesis engine...<br />
                  &gt; Ingesting 6-fader matrix...<br />
                  &gt; Applying constraints & toggles...<br />
                  <span style={{ animation: "pulse 1s infinite" }}>_ Generating output...</span>
                  <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }`}</style>
                </div>
              ) : (
                <textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  style={{
                    width: "100%", height: "100%", minHeight: 300, padding: 16,
                    border: `2px solid ${COLORS.navy}`, borderRadius: 12,
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7,
                    color: COLORS.text, background: "white", resize: "none",
                    outline: "none", boxSizing: "border-box", boxShadow: "inset 2px 2px 0px 0px rgba(0,0,0,0.05)"
                  }}
                />
              )}
            </div>
          </div>

          {/* GENERATE SECTION */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.textMuted, marginBottom: 8 }}>TARGET PLATFORM</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    style={{
                      padding: "10px 16px", borderRadius: 12, border: `2px solid ${COLORS.navy}`,
                      background: platform === p.id ? COLORS.green : "white",
                      color: COLORS.navy, fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                      cursor: "pointer", transition: "all 0.1s ease",
                      boxShadow: platform === p.id ? "none" : SHADOWS.hardSmall,
                      transform: platform === p.id ? "translate(2px, 2px)" : "none",
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generatePrompt}
              disabled={generating}
              style={{
                width: "100%", padding: "20px 0", borderRadius: 16, border: `2px solid ${COLORS.navy}`,
                background: generating ? "#9ca3af" : COLORS.purple, color: "white", fontSize: 16, fontWeight: 800,
                cursor: generating ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 12,
                boxShadow: generating ? "none" : SHADOWS.hard, transition: "all 0.1s ease", marginTop: 8
              }}
              onMouseDown={e => { if (!generating) { e.currentTarget.style.transform = "translate(4px, 4px)"; e.currentTarget.style.boxShadow = "none"; } }}
              onMouseUp={e => { if (!generating) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = SHADOWS.hard; } }}
            >
              {generating ? (
                "Synthesizing..."
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  Generate Prompt
                </>
              )}
            </button>
          </div>

          {output && (
            <div style={{ background: "rgba(180,235,76, 0.2)", border: `2px solid ${COLORS.navy}`, borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 12, color: COLORS.navy }}>
              <span style={{ fontSize: 18 }}>💡</span>
              {PLATFORMS.find(p => p.id === platform)?.note}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
