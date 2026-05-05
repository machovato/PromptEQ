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
  { id: "claude", name: "Claude", icon: "/claude-logo.png", note: "Settings > General > Profile > 'Custom Instructions'" },
  { id: "chatgpt", name: "ChatGPT", icon: "/chatgpt-logo.png", note: "Settings > Personalization > 'Custom Instructions'" },
  { id: "gemini", name: "Gemini", icon: "/gemini-logo.png", note: "Settings > Personal Intelligence > Instructions OR Explore Gems > New Gem" },
  { id: "grok", name: "Grok", icon: "/grok-logo.png", note: "Settings > Customize > 'How would you like Grok to respond?'" },
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
const C = {
  bg: "#FAFAFA",
  bgCard: "#FFFFFF",
  border: "#E5E5E5",
  borderDark: "#1C1C1C",
  purple: "#9b6dff",
  purpleHover: "#8b5cf6",
  green: "#b4eb4c",
  navy: "#131620",
  text: "#15151A",
  textMuted: "#6B7280",
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
          <span style={{ fontSize: 14, color: C.text, fontWeight: 800, fontFamily: "var(--font-geist-mono), monospace" }}>{config.label}</span>
          <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "var(--font-geist-mono), monospace", textTransform: "uppercase" }}>{config.left} → {config.right}</span>
        </div>
        <div style={{
          background: C.navy, color: "white", padding: "4px 8px",
          borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: "var(--font-geist-mono), monospace"
        }}>{Math.round(pct)}%</div>
      </div>
      <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", width: "100%", height: 6, background: "white", border: `2px solid ${C.navy}`, borderRadius: 4 }} />
        <div style={{ position: "absolute", width: `${pct}%`, height: 6, background: C.text, borderTop: `2px solid ${C.navy}`, borderBottom: `2px solid ${C.navy}`, borderLeft: `2px solid ${C.navy}`, borderRadius: "4px 0 0 4px" }} />
        <div style={{
          position: "absolute", left: `calc(${pct}% - 8px)`,
          width: 16, height: 16, background: C.purple,
          border: `2px solid ${C.navy}`, borderRadius: 4,
          zIndex: 2, cursor: "grab"
        }} />
        <input
          type="range" min={1} max={5} step={1} value={value}
          onChange={e => onChange(config.key, parseInt(e.target.value))}
          style={{ position: "absolute", width: "100%", height: 36, opacity: 0, cursor: "pointer", zIndex: 3 }}
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
        padding: "9px 18px", borderRadius: 24,
        border: `2px solid ${C.navy}`,
        background: active ? C.purple : "white",
        color: active ? "white" : C.text,
        fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif",
        cursor: "pointer", transition: "all 0.1s ease",
        boxShadow: active ? "none" : SHADOWS.hardSmall,
        transform: active ? "translate(2px, 2px)" : "none"
      }}
    >
      {label}
    </button>
  );
}

function BrutalistToggle({ checked, onChange, label, onText, offText }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: "'Inter', sans-serif" }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <div onClick={onChange} style={{
          width: 44, height: 24, borderRadius: 12, cursor: "pointer",
          background: checked ? C.green : "white",
          border: `2px solid ${C.navy}`,
          position: "relative", transition: "background 0.2s ease", flexShrink: 0
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: "50%", background: C.navy,
            position: "absolute", top: 2, left: checked ? 22 : 2,
            transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }} />
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, fontFamily: "var(--font-geist-mono), monospace", textAlign: "right" }}>{checked ? onText : offText}</div>
      </div>
    </div>
  );
}

function PresetCard({ preset, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, minWidth: 100, padding: "20px 12px", borderRadius: 12,
        border: `2px solid ${C.navy}`,
        background: active ? C.purple : "white",
        color: active ? "white" : C.text,
        cursor: "pointer", transition: "all 0.1s ease",
        boxShadow: active ? "none" : SHADOWS.hardSmall,
        transform: active ? "translate(2px, 2px)" : "none",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }}>{preset.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-geist-mono), monospace" }}>{preset.name}</div>
      <div style={{ fontSize: 10, opacity: 0.7, lineHeight: 1.4, textAlign: "center" }}>{preset.description}</div>
    </button>
  );
}

// --- SECTION LABEL ---
function SectionLabel({ step, title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: C.purple, marginBottom: 8, textTransform: "uppercase" }}>{step}</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 8px 0", color: C.text }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

function Divider() {
  return <div style={{ borderBottom: `2px dashed ${C.border}`, margin: "36px 0" }} />;
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

  const uncertaintyRule = s.uncertainty ? "When you're uncertain, say so explicitly. Flag confidence levels." : "When uncertain, give your best assessment. Don't hedge unless stakes are high.";
  const clarifyRule = s.clarify ? "Ask clarifying questions when a request is ambiguous before proceeding." : "When requests are ambiguous, make reasonable assumptions and proceed. Don't slow things down asking for clarification.";
  const emojiRule = { never: "Never use emoji.", sparingly: "Use emoji sparingly — only where they genuinely aid communication.", freely: "Feel free to use emoji to add personality and clarity." }[s.emoji];
  const useCaseNote = { writing: "Primary context: helping with writing and content creation.", coding: "Primary context: software development and coding assistance.", research: "Primary context: research, analysis, and information synthesis.", brainstorm: "Primary context: brainstorming, ideation, and creative problem-solving.", decision: "Primary context: decision-making support and strategic analysis." }[s.useCase];
  const expertiseNote = { new: "Assume I'm learning — explain concepts, define jargon, be patient.", peer: "Treat me as a knowledgeable peer — skip basics, engage at a professional level.", expert: "I'm an expert — be technical, skip fundamentals, go deep." }[s.expertise];
  const disagreeNote = { gentle: "If you disagree, raise it diplomatically — suggest alternatives rather than directly opposing.", argue: "If you disagree, say so directly and argue the other side forcefully. Don't soften dissent." }[s.disagreement];

  const customBullet = constraints ? `\n- CUSTOM CONSTRAINT: ${constraints}` : "";
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

// --- MAIN ---

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
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (!p.has("d")) return;
    setSettings({
      directness: parseInt(p.get("d") || 3),
      verbosity: parseInt(p.get("v") || 3),
      honesty: parseInt(p.get("h") || 3),
      abstraction: parseInt(p.get("a") || 3),
      structure: parseInt(p.get("s") || 3),
      answerOrder: parseInt(p.get("o") || 3),
      uncertainty: p.get("un") === "1",
      clarify: p.get("cl") === "1",
      emoji: p.get("em") || "never",
      useCase: p.get("uc") || "writing",
      expertise: p.get("ex") || "peer",
      disagreement: p.get("dg") || "gentle",
    });
    if (p.has("preset")) setActivePreset(p.get("preset"));
    if (p.has("plt")) setPlatform(p.get("plt"));
  }, []);

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
    if (preset) { setSettings(preset.settings); setActivePreset(presetId); }
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
      if (data.error) throw new Error(data.error);
      setOutput(data.text);
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_prompt", { platform, preset: activePreset });
      }
    } catch (e) {
      setOutput(`Error generating prompt:\n\n${e.message}\n\nPlease verify your environment variables.`);
    }
    setGenerating(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buildShareUrl = () => {
    const s = settings;
    const params = new URLSearchParams({
      d: s.directness, v: s.verbosity, h: s.honesty,
      a: s.abstraction, st: s.structure, o: s.answerOrder,
      un: s.uncertainty ? "1" : "0", cl: s.clarify ? "1" : "0",
      em: s.emoji, uc: s.useCase, ex: s.expertise, dg: s.disagreement,
      preset: activePreset, plt: platform,
    });
    return `${window.location.origin}/generate?${params.toString()}`;
  };

  const shareConfig = () => {
    navigator.clipboard.writeText(buildShareUrl());
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const shareOnX = () => {
    const tweet = encodeURIComponent(`Just built a custom AI system prompt with PEQ ⚡ — took 2 minutes.\n\nTry it free: https://prompteq.app\n\n#AI #SystemPrompt #PromptEngineering`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent("https://prompteq.app");
    const title = encodeURIComponent("PEQ — Build Your Custom AI System Prompt");
    const summary = encodeURIComponent("Just built a custom AI system prompt with PEQ — took 2 minutes. Free to use.");
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`, "_blank");
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "flex-start" }}>
      <style>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
        textarea:focus { outline: none; }
      `}</style>

        {/* ── LEFT: CONFIGURATION ── */}
        <div style={{
          width: 600, flexShrink: 0, padding: "40px 48px",
          borderRight: `2px solid ${C.border}`,
          overflowY: "auto", background: C.bg
        }}>

          <SectionLabel step="01_FOUNDATION" title="Foundation" subtitle="Select a starting archetype to pre-load a balanced mix, then customize with the faders below." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {PRESETS.map(p => (
              <PresetCard key={p.id} preset={p} active={activePreset === p.id} onClick={() => loadPreset(p.id)} />
            ))}
          </div>

          <Divider />

          <SectionLabel step="02_CONTEXT_VARS" title="Context Variables" subtitle="Tell the AI what you plan to use it for, and how much background knowledge to assume." />
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.text, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "1px", marginBottom: 10 }}>PRIMARY USE CASE</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PILL_GROUPS.useCase.map(p => (
                <BrutalistRadioPill key={p.value} label={p.label} active={settings.useCase === p.value} onClick={() => handleUpdate("useCase", p.value)} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.text, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "1px", marginBottom: 10 }}>MY EXPERTISE LEVEL</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PILL_GROUPS.expertise.map(p => (
                <BrutalistRadioPill key={p.value} label={p.label} active={settings.expertise === p.value} onClick={() => handleUpdate("expertise", p.value)} />
              ))}
            </div>
          </div>

          <Divider />

          <SectionLabel step="03_BEHAVIORAL_MATRIX" title="The Mix (Faders)" subtitle="The core personality matrix. Shift how the AI processes and delivers information." />
          <div>
            {SLIDERS.map((s, i) => (
              <div key={s.key}>
                {i === 3 && <div style={{ borderTop: `1px solid ${C.border}`, margin: "24px 0" }} />}
                <BrutalistSlider config={s} value={settings[s.key]} onChange={handleUpdate} />
              </div>
            ))}
          </div>

          <Divider />

          <SectionLabel step="04_BEHAVIORAL_RULES" title="Behavioral Rules" subtitle="Hard constraints — how the AI handles uncertainty, ambiguity, and disagreement." />
          <div style={{ background: "white", border: `2px solid ${C.navy}`, borderRadius: 16, padding: "8px 24px", marginBottom: 24, boxShadow: SHADOWS.hardSmall }}>
            {TOGGLES.map(t => (
              <BrutalistToggle key={t.key} checked={settings[t.key]} onChange={() => handleUpdate(t.key, !settings[t.key])} label={t.label} onText={t.on} offText={t.off} />
            ))}
            <div style={{ padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.text, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "1px", marginBottom: 10 }}>EMOJI USAGE</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PILL_GROUPS.emoji.map(p => (
                  <BrutalistRadioPill key={p.value} label={p.label} active={settings.emoji === p.value} onClick={() => handleUpdate("emoji", p.value)} />
                ))}
              </div>
            </div>
            <div style={{ padding: "16px 0" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.text, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "1px", marginBottom: 10 }}>DISAGREEMENT STYLE</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PILL_GROUPS.disagreement.map(p => (
                  <BrutalistRadioPill key={p.value} label={p.label} active={settings.disagreement === p.value} onClick={() => handleUpdate("disagreement", p.value)} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.text, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "1px", marginBottom: 6 }}>SPECIAL INSTRUCTIONS (Optional)</div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 10, lineHeight: 1.5 }}>Custom rules for your workflow — e.g. "Always reply in Spanish", "Never use the word 'delve'".</div>
            <textarea
              placeholder="Ex: Do not use technical jargon, focus on accessibility..."
              value={customConstraints}
              onChange={(e) => setCustomConstraints(e.target.value)}
              style={{
                width: "100%", height: 100, padding: 14,
                border: `2px solid ${C.navy}`, borderRadius: 12,
                fontFamily: "'Inter', sans-serif", fontSize: 13,
                resize: "vertical", boxSizing: "border-box",
                background: "white", color: C.text, lineHeight: 1.6,
                boxShadow: "inset 2px 2px 0px 0px rgba(0,0,0,0.05)"
              }}
            />
          </div>

        </div>

        {/* ── RIGHT: BOOTH ── */}
        <div style={{ flex: 1, padding: "40px 40px", display: "flex", flexDirection: "column", gap: 20, background: C.bg, position: "sticky", top: 0, height: "calc(100vh - 56px)", overflowY: "auto", boxSizing: "border-box" }}>

          {/* TERMINAL */}
          <div style={{
            flex: 1, background: C.navy, borderRadius: 24, padding: "24px 28px",
            display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden",
            boxShadow: SHADOWS.hard, border: `2px solid ${C.navy}`
          }}>
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 18, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 7 }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F56" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#27C93F" }} />
              </div>
              <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#6B7280", flex: 1, textAlign: "center" }}>
                CONTROL_BOOTH // {output ? "STREAM_ACTIVE" : "LIVE_VIBE_CHECK"}
              </div>
              {output && (
                <button onClick={copyOutput} style={{
                  background: copied ? C.green : "transparent",
                  color: copied ? C.navy : "#6B7280",
                  border: `1px solid ${copied ? C.green : "#6B7280"}`,
                  borderRadius: 6, padding: "4px 12px",
                  fontSize: 10, fontWeight: 700,
                  fontFamily: "var(--font-geist-mono), monospace",
                  cursor: "pointer", transition: "all 0.15s ease"
                }}>
                  {copied ? "COPIED!" : "COPY"}
                </button>
              )}
            </div>

            <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, lineHeight: 1.8, color: "#94A3B8", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {!output && !generating ? (
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#3B82F6", marginBottom: 6 }}># PROMPT_FOUNDATION: {activePreset.toUpperCase()}</div>
                  <div style={{ marginBottom: 20, fontStyle: "italic" }}>{getVibePreview()}</div>
                  <div style={{ color: "#3B82F6", marginBottom: 10 }}># PARAMETERS</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: 20 }}>
                    {[
                      ["DIRECTNESS", settings.directness], ["ABSTRACTION", settings.abstraction],
                      ["VERBOSITY", settings.verbosity], ["STRUCTURE", settings.structure],
                      ["HONESTY", settings.honesty], ["ANS_ORDER", settings.answerOrder]
                    ].map(([k, v]) => (
                      <div key={k}><span style={{ color: "#10B981" }}>{k}:</span> {((v - 1) / 4).toFixed(2)}</div>
                    ))}
                  </div>
                  <div style={{ color: "#3B82F6", marginBottom: 10 }}># ACTIVE_FLAGS</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {[
                      { label: `USE_CASE__${settings.useCase.toUpperCase()}`, color: "#10B981" },
                      { label: `EXP__${settings.expertise.toUpperCase()}`, color: "#10B981" },
                      ...(settings.uncertainty ? [{ label: "FLAG_UNCERTAINTY", color: C.purple }] : []),
                      ...(settings.clarify ? [{ label: "FORCE_CLARIFY", color: C.purple }] : []),
                    ].map(({ label, color }) => (
                      <span key={label} style={{
                        background: `${color}20`, color,
                        border: `1px solid ${color}50`,
                        padding: "2px 8px", borderRadius: 4, fontSize: 10
                      }}>{label}</span>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", marginTop: 24, paddingTop: 24, fontStyle: "italic", color: "#4B5563" }}>
                    _ Waiting for engine synchronization...
                  </div>
                </div>
              ) : generating ? (
                <div style={{ color: C.green, flex: 1 }}>
                  &gt; Booting synthesis engine...<br />
                  &gt; Ingesting 6-fader matrix...<br />
                  &gt; Applying constraints & toggles...<br />
                  <span style={{ animation: "pulse 1s infinite" }}>_ Generating output...</span>
                </div>
              ) : (
                <textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  style={{
                    flex: 1, width: "100%", minHeight: 280, padding: 0,
                    border: "none", fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 12, lineHeight: 1.8, color: "#E2E8F0",
                    background: "transparent", resize: "none",
                    outline: "none", boxSizing: "border-box"
                  }}
                />
              )}
            </div>
          </div>

          {/* PLATFORM + GENERATE */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "1px", marginBottom: 10 }}>TARGET PLATFORM</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setPlatform(p.id)} style={{
                    padding: p.icon ? "6px 14px 6px 6px" : "8px 14px",
                    borderRadius: 10, border: `2px solid ${C.navy}`,
                    background: platform === p.id ? C.green : "white",
                    color: C.navy, fontSize: 12, fontWeight: 700,
                    fontFamily: "var(--font-geist-mono), monospace",
                    cursor: "pointer", transition: "all 0.1s ease",
                    boxShadow: platform === p.id ? "none" : SHADOWS.hardSmall,
                    transform: platform === p.id ? "translate(2px, 2px)" : "none",
                    display: "flex", alignItems: "center", gap: 8
                  }}>
                    {p.icon && (
                      <div style={{ width: 20, height: 20, borderRadius: 5, background: "white", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={p.icon} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generatePrompt}
              disabled={generating}
              style={{
                width: "100%", padding: "18px 0", borderRadius: 14,
                border: `2px solid ${C.navy}`,
                background: generating ? "#9ca3af" : C.purple,
                color: "white", fontSize: 15, fontWeight: 800,
                fontFamily: "var(--font-geist-mono), monospace",
                cursor: generating ? "not-allowed" : "pointer",
                display: "flex", justifyContent: "center", alignItems: "center", gap: 10,
                boxShadow: generating ? "none" : SHADOWS.hard,
                transition: "all 0.1s ease", letterSpacing: "0.5px"
              }}
              onMouseDown={e => { if (!generating) { e.currentTarget.style.transform = "translate(4px, 4px)"; e.currentTarget.style.boxShadow = "none"; } }}
              onMouseUp={e => { if (!generating) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = SHADOWS.hard; } }}
            >
              {generating ? "SYNTHESIZING..." : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  GENERATE_PROMPT
                </>
              )}
            </button>
          </div>

          {output && (
            <div style={{
              background: "rgba(180,235,76,0.15)", border: `2px solid ${C.navy}`,
              borderRadius: 12, padding: "12px 18px", fontSize: 12, fontWeight: 600,
              color: C.navy, fontFamily: "var(--font-geist-mono), monospace",
              display: "flex", alignItems: "center", gap: 10
            }}>
              <span>💡</span>
              {PLATFORMS.find(p => p.id === platform)?.note}
            </div>
          )}

          {output && (
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: linkCopied ? "COPIED!" : "COPY_LINK", onClick: shareConfig, bg: linkCopied ? C.green : "white", color: C.navy },
                { label: "SHARE_X", onClick: shareOnX, bg: C.navy, color: "white" },
                { label: "SHARE_LI", onClick: shareOnLinkedIn, bg: "#0077B5", color: "white" },
              ].map(({ label, onClick, bg, color }) => (
                <button key={label} onClick={onClick} style={{
                  flex: 1, padding: "11px 0", borderRadius: 10,
                  border: `2px solid ${C.navy}`,
                  background: bg, color,
                  fontSize: 11, fontWeight: 700, cursor: "pointer",
                  fontFamily: "var(--font-geist-mono), monospace",
                  letterSpacing: "0.5px", boxShadow: SHADOWS.hardSmall,
                  transition: "all 0.15s ease"
                }}>{label}</button>
              ))}
            </div>
          )}

        </div>
    </div>
  );
}
