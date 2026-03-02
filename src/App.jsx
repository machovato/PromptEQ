import React, { useState, useEffect, useCallback } from "react";

// --- DATA STRUCTURES ---

const PRESETS = [
  {
    id: "operator", name: "Operator", icon: "✉️",
    settings: { directness: 5, verbosity: 1, honesty: 3, abstraction: 1, structure: 5, answerOrder: 5, uncertainty: false, clarify: false, emoji: "never", useCase: "decision", expertise: "expert", disagreement: "argue" },
    toggles: ["CONCISE", "NO YAPPING"]
  },
  {
    id: "strategist", name: "Strategist", icon: "♟️",
    settings: { directness: 3, verbosity: 3, honesty: 5, abstraction: 3, structure: 3, answerOrder: 3, uncertainty: true, clarify: true, emoji: "never", useCase: "decision", expertise: "peer", disagreement: "argue" },
    toggles: ["CHAIN OF THOUGHT"]
  },
  {
    id: "learner", name: "Learner", icon: "🎓",
    settings: { directness: 2, verbosity: 4, honesty: 2, abstraction: 4, structure: 3, answerOrder: 1, uncertainty: true, clarify: true, emoji: "sparingly", useCase: "research", expertise: "new", disagreement: "gentle" },
    toggles: ["STEP-BY-STEP"]
  },
  {
    id: "creator", name: "Creator", icon: "🎨",
    settings: { directness: 2, verbosity: 3, honesty: 4, abstraction: 5, structure: 2, answerOrder: 2, uncertainty: true, clarify: false, emoji: "sparingly", useCase: "brainstorm", expertise: "peer", disagreement: "argue" },
    toggles: []
  }
];

const PLATFORMS = [
  { id: "claude", name: "Claude", note: "Paste into User Preferences" },
  { id: "chatgpt", name: "ChatGPT", note: "Paste into Custom Instructions" },
  { id: "generic", name: "Other", note: "Universal configuration" }
];

const SLIDERS = [
  { category: "Communication", key: "directness", label: "DIRECTNESS", left: "Warm & Polite", right: "Blunt & Direct" },
  { category: "Communication", key: "verbosity", label: "VERBOSITY", left: "Concise", right: "Thorough" },
  { category: "Communication", key: "honesty", label: "RAW TRUTH (HONESTY)", left: "Supportive", right: "Challenge First" },
  //   { category: "Thinking", key: "abstraction", label: "ABSTRACTION", left: "Literal / Tech", right: "Analogies" },
  //   { category: "Thinking", key: "structure", label: "STRUCTURE", left: "Narrative Prose", right: "Bullets & Tables" },
  //   { category: "Thinking", key: "answerOrder", label: "ANSWER ORDER", left: "Context First", right: "TL;DR First" }
];

const BEHAVIORAL_PILLS = [
  { id: "NO YAPPING", label: "NO YAPPING", icon: "✓" },
  { id: "STEP-BY-STEP", label: "STEP-BY-STEP", icon: "+" },
  { id: "CHAIN OF THOUGHT", label: "CHAIN OF THOUGHT", icon: "+" },
  { id: "CONCISE", label: "CONCISE", icon: "+" }
]

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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{config.label}</span>
        <div style={{
          background: COLORS.navy, color: "white", padding: "4px 8px",
          borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace"
        }}>{Math.round(pct)}%</div>
      </div>
      <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
        {/* Track */}
        <div style={{ position: "absolute", width: "100%", height: 6, background: "white", border: `2px solid ${COLORS.navy}`, borderRadius: 4 }} />
        {/* Fill */}
        <div style={{ position: "absolute", width: `${pct}%`, height: 6, background: COLORS.text, borderTop: `2px solid ${COLORS.navy}`, borderBottom: `2px solid ${COLORS.navy}`, borderLeft: `2px solid ${COLORS.navy}`, borderRadius: "4px 0 0 4px" }} />

        {/* Thumb */}
        <div
          style={{
            position: "absolute", left: `calc(${pct}% - 8px)`,
            width: 16, height: 16, background: COLORS.purple,
            border: `2px solid ${COLORS.navy}`, borderRadius: 4,
            zIndex: 2, cursor: "grab"
          }}
        />

        {/* Input for interaction */}
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

function BrutalistPill({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "8px 16px", borderRadius: 24,
        border: `2px solid ${COLORS.navy}`,
        background: active ? COLORS.green : "white",
        color: COLORS.text, fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif",
        cursor: "pointer", transition: "all 0.1s ease",
        boxShadow: active ? "none" : SHADOWS.hardSmall,
        transform: active ? "translate(2px, 2px)" : "none"
      }}
    >
      {active && <span style={{ width: 14, height: 14, background: COLORS.navy, color: COLORS.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span>}
      {!active && <span style={{ fontSize: 14 }}>{icon}</span>}
      {label}
    </button>
  )
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
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12
      }}
    >
      <div style={{ fontSize: 24 }}>{preset.icon}</div>
      <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{preset.name}</div>
    </button>
  )
}


export default function PromptEQ() {
  const [settings, setSettings] = useState({
    directness: 5, verbosity: 2, honesty: 4.5, abstraction: 3, structure: 3, answerOrder: 3
  });
  const [activePreset, setActivePreset] = useState("operator");
  const [activeToggles, setActiveToggles] = useState(["NO YAPPING"]);
  const [customConstraints, setCustomConstraints] = useState("");

  const handleUpdate = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setActivePreset("custom");
  };

  const togglePill = (id) => {
    setActiveToggles(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  const loadPreset = (presetId) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSettings(preset.settings);
      setActiveToggles(preset.toggles);
      setActivePreset(presetId);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'Inter', sans-serif"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <div style={{ borderBottom: `1px solid ${COLORS.gray}`, padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: COLORS.purple, borderRadius: 8, border: `2px solid ${COLORS.navy}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 12, height: 16, borderLeft: "3px solid white", borderRight: "3px solid white" }}></div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>PromptEQ</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            border: `2px solid ${COLORS.navy}`, borderRadius: 24, padding: "6px 16px",
            fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            display: "flex", alignItems: "center", gap: 8, background: "white"
          }}>
            <span style={{ width: 6, height: 6, background: "#10B981", borderRadius: "50%" }}></span>
            ACTIVE ENGINE: GPT-4O
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 8, border: "2px solid #E5E5E5", background: "#FFE4D6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>⚡</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 83px)" }}>

        {/* COLUMN 1: LEFT CONFIGURATION */}
        <div style={{ flex: 1, padding: "48px 40px", maxWidth: 600, borderRight: `1px solid ${COLORS.gray}` }}>

          {/* STEP 01 */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#F3E8FE", color: COLORS.purpleHover, padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 800, letterSpacing: "1px", marginBottom: 12 }}>STEP 01</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 24px 0" }}>Foundation</h2>
            <div style={{ display: "flex", gap: 16 }}>
              {PRESETS.map(p => (
                <PresetCard key={p.id} preset={p} active={activePreset === p.id} onClick={() => loadPreset(p.id)} />
              ))}
            </div>
          </div>

          <div style={{ borderBottom: `2px dashed ${COLORS.gray}`, margin: "0 0 48px 0" }}></div>

          {/* STEP 02 */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#F3E8FE", color: COLORS.purpleHover, padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 800, letterSpacing: "1px", marginBottom: 12 }}>STEP 02</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 40px 0" }}>The Mix (Faders)</h2>
            <div>
              {SLIDERS.map(s => (
                <BrutalistSlider key={s.key} config={s} value={settings[s.key]} onChange={handleUpdate} />
              ))}
            </div>
          </div>

          <div style={{ borderBottom: `2px dashed ${COLORS.gray}`, margin: "0 0 48px 0" }}></div>

          {/* STEP 03 */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#F3E8FE", color: COLORS.purpleHover, padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 800, letterSpacing: "1px", marginBottom: 12 }}>STEP 03</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 24px 0" }}>Behavioral Rules</h2>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Custom Constraints</div>
              <textarea
                placeholder="Ex: Do not use technical jargon, focus on accessibility..."
                value={customConstraints}
                onChange={(e) => setCustomConstraints(e.target.value)}
                style={{
                  width: "100%", height: 120, padding: 16,
                  border: `2px solid ${COLORS.navy}`, borderRadius: 12,
                  fontFamily: "'Inter', sans-serif", fontSize: 14, resize: "vertical",
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {BEHAVIORAL_PILLS.map(p => (
                <BrutalistPill key={p.id} label={p.label} icon={p.icon} active={activeToggles.includes(p.id)} onClick={() => togglePill(p.id)} />
              ))}
            </div>
          </div>

        </div>

        {/* COLUMN 2: RIGHT BOOTH */}
        <div style={{ flex: 1, padding: "48px 40px", display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 0, height: "100vh", boxSizing: "border-box" }}>

          {/* TERMINAL */}
          <div style={{
            flex: 1, background: COLORS.navy, borderRadius: 24, padding: "24px 32px",
            display: "flex", flexDirection: "column", boxShadow: SHADOWS.hard, border: `2px solid ${COLORS.navy}`
          }}>
            {/* Mac Dots / Header */}
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 24, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 8, marginRight: "auto" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }}></div>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }}></div>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }}></div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "1px", color: "#6B7280" }}>
                CONTROL BOOTH // LIVE VIBE CHECK
              </div>
              <div style={{ display: "flex", gap: 16, marginLeft: "auto", color: "#6B7280" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
            </div>

            {/* Content */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7, color: "#94A3B8", overflowY: "auto" }}>
              <div style={{ color: "#9b6dff", display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 11, fontWeight: 700, letterSpacing: "1px" }}>
                <span>✉️</span> SYSTEM PROMPT GENERATED
              </div>

              <div style={{ color: "#3B82F6", marginBottom: 8 }}># PROMPT FOUNDATION: {activePreset.toUpperCase()}</div>
              <div style={{ marginBottom: 24 }}>
                You are a highly efficient assistant focused on direct action and execution. Minimize preamble and metadata.
              </div>

              <div style={{ color: "#3B82F6", marginBottom: 12 }}># PARAMETERS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <div><span style={{ color: "#10B981" }}>DIRECTNESS:</span> {((settings.directness - 1) / 4).toFixed(2)}</div>
                <div><span style={{ color: "#10B981" }}>VERBOSITY:</span> {((settings.verbosity - 1) / 4).toFixed(2)}</div>
                <div><span style={{ color: "#10B981" }}>HONESTY:</span> {((settings.honesty - 1) / 4).toFixed(2)}</div>
                <div><span style={{ color: "#10B981" }}>MODE:</span> STRICT_LOGIC</div>
              </div>

              <div style={{ color: "#3B82F6", marginBottom: 12 }}># RULES</div>
              <div style={{ paddingLeft: 16 }}>
                <div style={{ marginBottom: 8, position: "relative" }}>
                  <span style={{ position: "absolute", left: -16 }}>•</span>
                  Apply "No Yapping" protocol: eliminate filler words like "Sure," "I can help with that."
                </div>
                <div style={{ marginBottom: 8, position: "relative" }}>
                  <span style={{ position: "absolute", left: -16 }}>•</span>
                  Priority on factual accuracy and raw truth over conversational comfort.
                </div>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: -16 }}>•</span>
                  Structure responses using technical schema when appropriate.
                </div>
                {customConstraints && (
                  <div style={{ position: "relative", marginTop: 8 }}>
                    <span style={{ position: "absolute", left: -16 }}>•</span>
                    CUSTOM: {customConstraints}
                  </div>
                )}
              </div>

              <div style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", marginTop: 32, paddingTop: 32, fontStyle: "italic", color: "#4B5563" }}>
                _ Waiting for engine synchronization...
              </div>
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button style={{
            width: "100%", padding: "20px 0", borderRadius: 16, border: `2px solid ${COLORS.navy}`,
            background: COLORS.purple, color: "white", fontSize: 18, fontWeight: 700,
            cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 12,
            boxShadow: SHADOWS.hard, transition: "all 0.1s ease"
          }}
            onMouseDown={e => { e.currentTarget.style.transform = "translate(4px, 4px)"; e.currentTarget.style.boxShadow = "none"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = SHADOWS.hard; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            Generate & Copy Prompt
          </button>
        </div>

      </div>
    </div>
  );
}
