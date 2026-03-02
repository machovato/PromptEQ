import { useState, useCallback } from "react";

const ARCHETYPES = [
  {
    id: "operator",
    name: "The Operator",
    icon: "⚡",
    desc: "Bottom-line answers. No fluff. Just results.",
    sample: "Revenue dropped 12% QoQ. Three root causes: churn in mid-market (−8%), delayed renewals (−3%), pricing compression (−1%). Recommended action: accelerate QBR cadence for accounts >$50K ARR.",
    presets: {
      directness: 5, verbosity: 1, honesty: 3, abstraction: 1, structure: 5,
      answerOrder: 5, uncertainty: false, clarify: false, emoji: "never",
      useCase: "decision", expertise: "expert", disagreement: "argue"
    }
  },
  {
    id: "strategist",
    name: "The Strategist",
    icon: "♟️",
    desc: "Pushback, tradeoffs, and nuance. A thinking partner.",
    sample: "Your instinct to consolidate platforms is sound, but I'd challenge the timeline. Migrating mid-quarter introduces risk you haven't priced in. Consider: what's the cost of waiting 6 weeks vs. the cost of a botched cutover?",
    presets: {
      directness: 3, verbosity: 3, honesty: 5, abstraction: 3, structure: 3,
      answerOrder: 3, uncertainty: true, clarify: true, emoji: "never",
      useCase: "decision", expertise: "peer", disagreement: "argue"
    }
  },
  {
    id: "learner",
    name: "The Learner",
    icon: "🔬",
    desc: "Patient explanations. Examples. Build understanding.",
    sample: "Think of an API like a restaurant waiter. You (the app) tell the waiter (API) what you want, the kitchen (server) prepares it, and the waiter brings it back. You never go into the kitchen yourself.",
    presets: {
      directness: 2, verbosity: 4, honesty: 2, abstraction: 4, structure: 3,
      answerOrder: 1, uncertainty: true, clarify: true, emoji: "sparingly",
      useCase: "research", expertise: "new", disagreement: "gentle"
    }
  },
  {
    id: "creator",
    name: "The Creator",
    icon: "🎨",
    desc: "Riff with me. Analogies, ideas, loose structure.",
    sample: "Your onboarding flow right now is like handing someone a dictionary when they asked for directions. What if the first screen wasn't 'configure your settings' but 'tell us one thing you're trying to do today'?",
    presets: {
      directness: 2, verbosity: 3, honesty: 4, abstraction: 5, structure: 2,
      answerOrder: 2, uncertainty: true, clarify: false, emoji: "sparingly",
      useCase: "brainstorm", expertise: "peer", disagreement: "argue"
    }
  }
];

const PLATFORMS = [
  { id: "claude", name: "Claude", note: "Paste into User Preferences or System Prompt" },
  { id: "chatgpt", name: "ChatGPT", note: "Paste into Custom Instructions" },
  { id: "generic", name: "Other / Generic", note: "Universal system prompt format" }
];

const SLIDER_LABELS = {
  directness: { label: "Directness", left: "Warm & Polite", right: "Blunt & Direct" },
  verbosity: { label: "Verbosity", left: "Concise", right: "Thorough" },
  honesty: { label: "Honesty Mode", left: "Supportive First", right: "Challenge First" },
  abstraction: { label: "Abstraction", left: "Literal / Technical", right: "Analogies & Metaphors" },
  structure: { label: "Structure", left: "Narrative Prose", right: "Bullets & Tables" },
  answerOrder: { label: "Answer Order", left: "Context First", right: "TL;DR First" }
};

const TOGGLE_OPTIONS = [
  { key: "uncertainty", label: "When uncertain...", on: "Admit it openly", off: "Give best guess" },
  { key: "clarify", label: "Ambiguous request...", on: "Ask clarifying questions", off: "Assume and go" }
];

const EMOJI_OPTIONS = [
  { value: "never", label: "Never" },
  { value: "sparingly", label: "Sparingly" },
  { value: "freely", label: "Freely" }
];

const USE_CASES = [
  { value: "writing", label: "Writing" },
  { value: "coding", label: "Coding" },
  { value: "research", label: "Research" },
  { value: "brainstorm", label: "Brainstorming" },
  { value: "decision", label: "Decision-Making" }
];

const EXPERTISE = [
  { value: "new", label: "Explain like I'm new" },
  { value: "peer", label: "Peer-level" },
  { value: "expert", label: "Expert-level" }
];

const DISAGREEMENT = [
  { value: "gentle", label: "Flag concerns gently" },
  { value: "argue", label: "Argue the other side hard" }
];

function SliderInput({ id, value, onChange, config }) {
  const pct = ((value - 1) / 4) * 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace" }}>{config.left}</span>
        <span style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600, fontFamily: "'IBM Plex Sans', sans-serif" }}>{config.label}</span>
        <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace" }}>{config.right}</span>
      </div>
      <div style={{ position: "relative", height: 36, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", width: "100%", height: 6, background: "#1e293b", borderRadius: 3 }} />
        <div style={{ position: "absolute", width: `${pct}%`, height: 6, background: "linear-gradient(90deg, #6366f1, #a78bfa)", borderRadius: 3, transition: "width 0.15s ease" }} />
        {[1,2,3,4,5].map(v => (
          <div key={v} style={{
            position: "absolute", left: `${((v-1)/4)*100}%`, transform: "translateX(-50%)",
            width: 8, height: 8, borderRadius: "50%",
            background: v <= value ? "#a78bfa" : "#334155",
            border: v === value ? "2px solid #e2e8f0" : "none",
            zIndex: 1, cursor: "pointer", transition: "all 0.15s ease"
          }} onClick={() => onChange(id, v)} />
        ))}
        <input
          type="range" min={1} max={5} step={1} value={value}
          onChange={e => onChange(id, parseInt(e.target.value))}
          style={{
            position: "absolute", width: "100%", height: 36, opacity: 0,
            cursor: "pointer", zIndex: 2
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {[1,2,3,4,5].map(v => (
          <span key={v} style={{
            fontSize: 11, color: v === value ? "#a78bfa" : "#475569",
            fontFamily: "'IBM Plex Mono', monospace", fontWeight: v === value ? 700 : 400,
            width: "20%", textAlign: "center"
          }}>{v}</span>
        ))}
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, cursor: "pointer",
      background: checked ? "#6366f1" : "#334155",
      position: "relative", transition: "background 0.2s ease", flexShrink: 0
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#e2e8f0",
        position: "absolute", top: 3, left: checked ? 23 : 3,
        transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
      }} />
    </div>
  );
}

function PillSelect({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          padding: "6px 14px", borderRadius: 20, border: "1px solid",
          borderColor: value === opt.value ? "#6366f1" : "#334155",
          background: value === opt.value ? "rgba(99,102,241,0.15)" : "transparent",
          color: value === opt.value ? "#a78bfa" : "#94a3b8",
          fontSize: 13, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
          transition: "all 0.15s ease"
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

function buildPromptForAPI(settings, platform) {
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

  const prompt = `## Communication Style
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
- ${disagreeNote}`;

  if (platform === "claude") {
    return prompt;
  } else if (platform === "chatgpt") {
    return `# Custom Instructions\n\n${prompt}`;
  }
  return `# System Prompt — Custom Personality\n\n${prompt}`;
}

export default function SystemPromptWizard() {
  const [step, setStep] = useState("archetype");
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [platform, setPlatform] = useState("claude");
  const [settings, setSettings] = useState({
    directness: 3, verbosity: 3, honesty: 3, abstraction: 3, structure: 3,
    answerOrder: 3, uncertainty: true, clarify: true, emoji: "never",
    useCase: "writing", expertise: "peer", disagreement: "gentle"
  });
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const handleSlider = useCallback((key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  }, []);

  const selectArchetype = (arch) => {
    setSelectedArchetype(arch.id);
    setSettings(prev => ({ ...prev, ...arch.presets }));
    setTimeout(() => setStep("configure"), 300);
  };

  const generate = async () => {
    setGenerating(true);
    setStep("output");
    const raw = buildPromptForAPI(settings, platform);

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a System Prompt optimization specialist. Below is a set of user preferences that were generated from slider inputs. Your job is to synthesize these into a polished, cohesive set of Custom Instructions that an AI should follow.

Rules:
- Do NOT just restate the inputs. BLEND them into a natural, unified voice description.
- Where settings create tension (e.g., blunt + analogies), resolve it creatively.
- Use strong, specific behavioral verbs ("always lead with...", "never pad with...").
- Define HOW the AI should behave, not WHAT the AI is. No role declarations ("you are my..."), relationship framing, or identity statements. Write behavioral rules that work across any type of conversation.
- Output ONLY the final instructions block in Markdown. No preamble, no explanation.
- Keep it under 300 words. Dense and usable.
- NEVER use numerical confidence scores or percentages (e.g., "~70% confident"). If expressing uncertainty, use plain language like "I'm less sure about this" or "this is speculative." No false precision.
- Target platform: ${platform === "claude" ? "Claude (Anthropic)" : platform === "chatgpt" ? "ChatGPT (OpenAI)" : "Generic AI assistant"}

Here are the raw preferences:

${raw}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "Error generating prompt. Here are your raw settings:\n\n" + raw;
      setOutput(text);
    } catch (e) {
      setOutput("Could not reach the API. Here are your raw preferences:\n\n" + raw);
    }
    setGenerating(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    { title: "Communication", icon: "💬" },
    { title: "Thinking", icon: "🧠" },
    { title: "Behavior", icon: "⚙️" },
    { title: "Situational", icon: "🎯" }
  ];

  const containerStyle = {
    minHeight: "100vh",
    background: "#0b0f1a",
    color: "#e2e8f0",
    fontFamily: "'IBM Plex Sans', sans-serif",
    padding: "0 16px"
  };

  return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: 720, margin: "0 auto", paddingTop: 40, paddingBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 28 }}>🎛️</span>
          <h1 style={{
            fontSize: 26, fontWeight: 700, margin: 0,
            background: "linear-gradient(135deg, #a78bfa, #6366f1)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>System Prompt Wizard</h1>
        </div>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0, marginLeft: 42 }}>
          Your AI's mixing board. Dial in the personality, get the instructions.
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 60 }}>

        {/* STEP 1: Archetype Selection */}
        {step === "archetype" && (
          <div>
            <p style={{ fontSize: 15, color: "#94a3b8", marginBottom: 24 }}>
              Pick a starting point. You'll fine-tune everything next.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {ARCHETYPES.map(arch => (
                <div key={arch.id} onClick={() => selectArchetype(arch)}
                  style={{
                    background: selectedArchetype === arch.id ? "rgba(99,102,241,0.12)" : "rgba(15,23,42,0.8)",
                    border: "1px solid",
                    borderColor: selectedArchetype === arch.id ? "#6366f1" : "#1e293b",
                    borderRadius: 12, padding: 20, cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { if (selectedArchetype !== arch.id) e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{arch.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 6px 0", color: "#e2e8f0" }}>{arch.name}</h3>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 14px 0" }}>{arch.desc}</p>
                  <div style={{
                    background: "#0f172a", borderRadius: 8, padding: 12,
                    fontSize: 12, color: "#cbd5e1", lineHeight: 1.5,
                    fontFamily: "'IBM Plex Mono', monospace", fontStyle: "italic",
                    borderLeft: "3px solid #6366f1"
                  }}>
                    "{arch.sample}"
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => setStep("configure")} style={{
                background: "none", border: "none", color: "#64748b",
                fontSize: 13, cursor: "pointer", textDecoration: "underline"
              }}>Skip — start from scratch</button>
            </div>
          </div>
        )}

        {/* STEP 2: Configuration */}
        {step === "configure" && (
          <div>
            {/* Section Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "#0f172a", borderRadius: 10, padding: 4 }}>
              {sections.map((sec, i) => (
                <button key={i} onClick={() => setActiveSection(i)} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 8, border: "none",
                  background: activeSection === i ? "rgba(99,102,241,0.15)" : "transparent",
                  color: activeSection === i ? "#a78bfa" : "#64748b",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  transition: "all 0.15s ease"
                }}>{sec.icon} {sec.title}</button>
              ))}
            </div>

            {/* Communication */}
            {activeSection === 0 && (
              <div>
                {["directness", "verbosity", "honesty"].map(key => (
                  <SliderInput key={key} id={key} value={settings[key]} onChange={handleSlider} config={SLIDER_LABELS[key]} />
                ))}
              </div>
            )}

            {/* Thinking */}
            {activeSection === 1 && (
              <div>
                {["abstraction", "structure", "answerOrder"].map(key => (
                  <SliderInput key={key} id={key} value={settings[key]} onChange={handleSlider} config={SLIDER_LABELS[key]} />
                ))}
              </div>
            )}

            {/* Behavior */}
            {activeSection === 2 && (
              <div>
                {TOGGLE_OPTIONS.map(opt => (
                  <div key={opt.key} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 0", borderBottom: "1px solid #1e293b"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0", marginBottom: 4 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {settings[opt.key] ? opt.on : opt.off}
                      </div>
                    </div>
                    <ToggleSwitch checked={settings[opt.key]} onChange={() => setSettings(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))} />
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0", marginBottom: 10 }}>Emoji usage</div>
                  <PillSelect options={EMOJI_OPTIONS} value={settings.emoji} onChange={v => setSettings(prev => ({ ...prev, emoji: v }))} />
                </div>
              </div>
            )}

            {/* Situational */}
            {activeSection === 3 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0", marginBottom: 10 }}>Primary use case</div>
                  <PillSelect options={USE_CASES} value={settings.useCase} onChange={v => setSettings(prev => ({ ...prev, useCase: v }))} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0", marginBottom: 10 }}>My expertise level</div>
                  <PillSelect options={EXPERTISE} value={settings.expertise} onChange={v => setSettings(prev => ({ ...prev, expertise: v }))} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0", marginBottom: 10 }}>Disagreement style</div>
                  <PillSelect options={DISAGREEMENT} value={settings.disagreement} onChange={v => setSettings(prev => ({ ...prev, disagreement: v }))} />
                </div>
              </div>
            )}

            {/* Platform & Generate */}
            <div style={{ marginTop: 32, padding: 20, background: "#0f172a", borderRadius: 12, border: "1px solid #1e293b" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0", marginBottom: 12 }}>Target platform</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setPlatform(p.id)} style={{
                    flex: 1, padding: "10px 12px", borderRadius: 8,
                    border: "1px solid", borderColor: platform === p.id ? "#6366f1" : "#1e293b",
                    background: platform === p.id ? "rgba(99,102,241,0.1)" : "transparent",
                    color: platform === p.id ? "#a78bfa" : "#94a3b8",
                    fontSize: 13, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif"
                  }}>{p.name}</button>
                ))}
              </div>
              <button onClick={generate} style={{
                width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
                fontFamily: "'IBM Plex Sans', sans-serif",
                boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
                transition: "transform 0.1s ease"
              }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              >Generate My System Prompt</button>
            </div>

            {/* Back link */}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button onClick={() => setStep("archetype")} style={{
                background: "none", border: "none", color: "#64748b",
                fontSize: 13, cursor: "pointer"
              }}>← Back to archetypes</button>
            </div>
          </div>
        )}

        {/* STEP 3: Output */}
        {step === "output" && (
          <div>
            {generating ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{
                  width: 40, height: 40, border: "3px solid #1e293b",
                  borderTopColor: "#6366f1", borderRadius: "50%",
                  margin: "0 auto 16px",
                  animation: "spin 0.8s linear infinite"
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>Generating your system prompt...</p>
              </div>
            ) : (
              <div>
                {/* Receipt Header */}
                <div style={{
                  textAlign: "center", padding: "28px 24px 24px", marginBottom: 24,
                  background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(167,139,250,0.06))",
                  borderRadius: 12, border: "1px solid rgba(99,102,241,0.15)"
                }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>✨</div>
                  <h2 style={{
                    fontSize: 20, fontWeight: 700, margin: "0 0 8px 0",
                    color: "#e2e8f0", fontFamily: "'IBM Plex Sans', sans-serif"
                  }}>Your prompt is ready.</h2>
                  <p style={{
                    fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.6,
                    maxWidth: 460, marginLeft: "auto", marginRight: "auto"
                  }}>
                    Read it. Tweak anything that doesn't sound like you. Then paste it into {PLATFORMS.find(p => p.id === platform)?.name || "your AI tool"}.
                  </p>
                </div>

                {/* Three step callout */}
                <div style={{
                  display: "flex", gap: 12, marginBottom: 24
                }}>
                  {[
                    { num: "1", label: "Read", desc: "Does it sound like you?" },
                    { num: "2", label: "Edit", desc: "Make it yours." },
                    { num: "3", label: "Paste", desc: PLATFORMS.find(p => p.id === platform)?.note || "Add to your AI tool." }
                  ].map(s => (
                    <div key={s.num} style={{
                      flex: 1, padding: "14px 16px", background: "#0f172a",
                      borderRadius: 10, border: "1px solid #1e293b", textAlign: "center"
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "rgba(99,102,241,0.15)", color: "#a78bfa",
                        fontSize: 14, fontWeight: 700, lineHeight: "28px",
                        margin: "0 auto 8px", fontFamily: "'IBM Plex Mono', monospace"
                      }}>{s.num}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{s.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Selections Report */}
                <div style={{
                  background: "rgba(99,102,241,0.06)", borderRadius: 12, border: "1px solid #1e293b",
                  padding: 20, marginBottom: 20
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 16 }}>📋</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", fontFamily: "'IBM Plex Sans', sans-serif" }}>Your Selections</span>
                    {selectedArchetype && (
                      <span style={{
                        marginLeft: "auto", fontSize: 12, color: "#64748b",
                        fontFamily: "'IBM Plex Mono', monospace",
                        background: "#1e293b", padding: "3px 10px", borderRadius: 10
                      }}>Archetype: {ARCHETYPES.find(a => a.id === selectedArchetype)?.name || "Custom"}</span>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {Object.entries(SLIDER_LABELS).map(([key, config]) => {
                      const val = settings[key];
                      const labels = [config.left, "", "Balanced", "", config.right];
                      const displayLabel = val === 1 ? config.left : val === 5 ? config.right : val === 3 ? "Balanced" : val === 2 ? `Lean ${config.left}` : `Lean ${config.right}`;
                      return (
                        <div key={key} style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3, fontFamily: "'IBM Plex Mono', monospace" }}>{config.label}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              fontSize: 14, fontWeight: 600, color: "#6366f1",
                              fontFamily: "'IBM Plex Mono', monospace", minWidth: 16
                            }}>{val}</span>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>{displayLabel}</span>
                          </div>
                        </div>
                      );
                    })}
                    {TOGGLE_OPTIONS.map(opt => (
                      <div key={opt.key} style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3, fontFamily: "'IBM Plex Mono', monospace" }}>{opt.label}</div>
                        <span style={{ fontSize: 12, color: settings[opt.key] ? "#6ee7b7" : "#fbbf24" }}>
                          {settings[opt.key] ? opt.on : opt.off}
                        </span>
                      </div>
                    ))}
                    <div style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3, fontFamily: "'IBM Plex Mono', monospace" }}>Emoji</div>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{settings.emoji.charAt(0).toUpperCase() + settings.emoji.slice(1)}</span>
                    </div>
                    <div style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3, fontFamily: "'IBM Plex Mono', monospace" }}>Use Case</div>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{USE_CASES.find(u => u.value === settings.useCase)?.label}</span>
                    </div>
                    <div style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3, fontFamily: "'IBM Plex Mono', monospace" }}>Expertise</div>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{EXPERTISE.find(e => e.value === settings.expertise)?.label}</span>
                    </div>
                    <div style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3, fontFamily: "'IBM Plex Mono', monospace" }}>Disagreement</div>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{DISAGREEMENT.find(d => d.value === settings.disagreement)?.label}</span>
                    </div>
                    <div style={{ padding: "8px 12px", background: "#0f172a", borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3, fontFamily: "'IBM Plex Mono', monospace" }}>Platform</div>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{PLATFORMS.find(p => p.id === platform)?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Generated Output */}
                <div style={{
                  background: "#0f172a", borderRadius: 12, border: "1px solid #1e293b",
                  padding: 24, marginBottom: 20
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{
                      fontSize: 13, fontWeight: 600, color: "#e2e8f0",
                      fontFamily: "'IBM Plex Sans', sans-serif"
                    }}>Your System Prompt</span>
                    <button onClick={copyOutput} style={{
                      padding: "6px 16px", borderRadius: 6, border: "1px solid #6366f1",
                      background: copied ? "#6366f1" : "transparent",
                      color: copied ? "#fff" : "#a78bfa",
                      fontSize: 13, cursor: "pointer", fontWeight: 500,
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      transition: "all 0.2s ease"
                    }}>{copied ? "Copied!" : "Copy"}</button>
                  </div>
                  <pre style={{
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                    fontSize: 13, lineHeight: 1.7, color: "#cbd5e1",
                    fontFamily: "'IBM Plex Mono', monospace",
                    margin: 0, maxHeight: 500, overflowY: "auto"
                  }}>{output}</pre>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep("configure")} style={{
                    flex: 1, padding: "12px 0", borderRadius: 8,
                    border: "1px solid #1e293b", background: "transparent",
                    color: "#94a3b8", fontSize: 14, cursor: "pointer",
                    fontFamily: "'IBM Plex Sans', sans-serif"
                  }}>← Adjust Settings</button>
                  <button onClick={() => { setStep("archetype"); setSelectedArchetype(null); }} style={{
                    flex: 1, padding: "12px 0", borderRadius: 8,
                    border: "1px solid #1e293b", background: "transparent",
                    color: "#94a3b8", fontSize: 14, cursor: "pointer",
                    fontFamily: "'IBM Plex Sans', sans-serif"
                  }}>Start Over</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
