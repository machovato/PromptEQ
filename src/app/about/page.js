"use client";

import React, { useState } from 'react';
import { Heart, Code, User, SlidersHorizontal, Lightning, Layout } from '@phosphor-icons/react';

// --- DESIGN TOKENS ---
const C = {
    bg: "#0D0F14",
    bgCard: "#13161F",
    bgCardAlt: "#1A1D27",
    border: "#2A2D3A",
    purple: "#9b6dff",
    green: "#b4eb4c",
    greenDim: "#8fbc3a",
    navy: "#131620",
    text: "#F0F0F5",
    textMuted: "#6B7280",
    textDim: "#9CA3AF",
};

const TABS = [
    { id: 'app', label: 'About the App', icon: Heart },
    { id: 'tech', label: 'Tech Stack', icon: Code },
    { id: 'developer', label: 'The Developer', icon: User },
];

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('app');

    return (
        <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", minHeight: "100%" }}>

            {/* TAB SHELF */}
            <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0 40px", display: "flex", gap: 4, background: C.bgCard }}>
                {TABS.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                        <button key={id} onClick={() => setActiveTab(id)} style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "16px 24px", fontSize: 13, fontWeight: 700,
                            fontFamily: "var(--font-geist-mono), monospace",
                            letterSpacing: "0.3px", cursor: "pointer",
                            background: "transparent", border: "none",
                            borderBottom: `2px solid ${isActive ? C.green : "transparent"}`,
                            color: isActive ? C.green : C.textMuted,
                            transition: "all 0.15s ease",
                        }}>
                            <Icon size={15} weight={isActive ? "fill" : "regular"} />
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* CONTENT */}
            <div style={{ padding: "56px 40px", maxWidth: 900, margin: "0 auto" }}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                {activeTab === 'app' && <AboutAppTab />}
                {activeTab === 'tech' && <TechStackTab />}
                {activeTab === 'developer' && <DeveloperTab />}
            </div>
        </div>
    );
}

// ── TAB 1: ABOUT ──

function AboutAppTab() {
    return (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
                <img src="/logo.png" alt="PromptEQ Logo" style={{ width: 72, height: 72, borderRadius: 16, border: `1px solid ${C.border}` }} />
                <div>
                    <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "2px", marginBottom: 6, textTransform: "uppercase" }}>// ABOUT PROMPTEQ</div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px", margin: 0 }}>Mixing Console for AI</h1>
                </div>
            </div>

            <p style={{ fontSize: 16, color: C.textDim, lineHeight: 1.75, marginBottom: 20 }}>
                PromptEQ is a <span style={{ color: C.text, fontWeight: 700 }}>system prompt and custom instructions generator</span> designed to feel like an audio mixing console. Instead of trial-and-error prompting, you adjust sliders to shift exactly how your AI behaves.
            </p>
            <p style={{ fontSize: 16, color: C.textDim, lineHeight: 1.75, marginBottom: 48 }}>
                AI models have a default personality — usually helpful, overly polite, and slightly verbose. PromptEQ lets you dial in exact profiles, whether you need a blunt code reviewer, a patient tutor, or a sharp thinking partner — and generates the optimized system prompt to load into Claude, ChatGPT, Gemini, or Grok.
            </p>

            <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "2px", marginBottom: 20, textTransform: "uppercase" }}>// HOW IT WORKS</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
                {[
                    { n: "01", title: "Choose a Foundation", desc: 'Start with an archetype like "Operator" (blunt, fast, technical) or "Strategist" (analytical, thorough, pushes back).' },
                    { n: "02", title: "Adjust the Mix", desc: "Fine-tune 6 core behavioral axes: Directness, Verbosity, Honesty, Abstraction, Structure, and Answer Order." },
                    { n: "03", title: "Set Constraints", desc: "Toggle explicit behavioral rules — force clarifying questions, restrict emoji, set disagreement style." },
                    { n: "04", title: "Generate & Deploy", desc: "An LLM pipeline processes your settings and outputs a compressed, optimized system prompt ready to paste." },
                ].map(({ n, title, desc }) => (
                    <div key={n} style={{
                        display: "flex", gap: 20, background: C.bgCard,
                        border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px",
                        boxShadow: `4px 4px 0px 0px ${C.border}`
                    }}>
                        <div style={{
                            fontFamily: "var(--font-geist-mono), monospace", fontSize: 20, fontWeight: 700,
                            color: C.purple, flexShrink: 0, lineHeight: 1, marginTop: 2
                        }}>{n}</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 6 }}>{title}</div>
                            <div style={{ fontSize: 14, color: C.textDim, lineHeight: 1.6 }}>{desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 32, boxShadow: `4px 4px 0px 0px ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <SlidersHorizontal size={22} weight="bold" color={C.purple} />
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Why sliders?</h3>
                </div>
                <p style={{ fontSize: 15, color: C.textDim, lineHeight: 1.75, margin: 0 }}>
                    Language is imprecise. "Be concise" means different things to different models. By using a normalized 1-to-5 scale across distinct behavioral axes, PromptEQ provides a standardized way to describe AI personality. The translation layer converts numeric values into the specific semantic instructions that models actually follow.
                </p>
            </div>
        </div>
    );
}

// ── TAB 2: TECH STACK ──

function TechStackTab() {
    return (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ marginBottom: 40 }}>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "2px", marginBottom: 12, textTransform: "uppercase" }}>// UNDER THE HOOD</div>
                <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1px", margin: "0 0 16px 0" }}>Tech Stack</h2>
                <p style={{ fontSize: 16, color: C.textDim, lineHeight: 1.75, margin: 0 }}>
                    A modern web application leveraging serverless AI inference, built with brutalist UI principles and a fully state-driven experience.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>

                {/* Antigravity — full width */}
                <div style={{
                    gridColumn: "1 / -1", background: C.bgCard,
                    border: `1px solid ${C.border}`, borderRadius: 16,
                    padding: 36, boxShadow: `4px 4px 0px 0px ${C.border}`
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                        <div style={{ width: 48, height: 48, background: C.green, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                            <img src="/antigravity-logo.png" alt="Antigravity" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} onError={e => e.target.style.display = 'none'} />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>Built with Antigravity</h3>
                            <p style={{ fontSize: 13, color: C.textMuted, margin: "4px 0 0 0" }}>Agentic AI Development Assistant</p>
                        </div>
                    </div>
                    <p style={{ fontSize: 15, color: C.textDim, lineHeight: 1.75, margin: "0 0 20px 0" }}>
                        The UI was designed in <span style={{ color: C.text, fontWeight: 700 }}>Google Stitch</span> and engineered in partnership with <span style={{ color: C.text, fontWeight: 700 }}>Antigravity</span> — from the Next.js App Router architecture to the AI API routes.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {["🚀 Rapid Prototyping", "🧠 Agentic Coding", "⚡ Seamless Refactoring"].map(t => (
                            <span key={t} style={{ background: `${C.green}15`, color: C.green, border: `1px solid ${C.green}40`, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{t}</span>
                        ))}
                    </div>
                </div>

                {/* Frontend */}
                <StackCard icon={<Layout size={24} weight="duotone" color={C.purple} />} title="Frontend UI" subtitle="Client Framework">
                    <StackItem title="Google Stitch" desc="UI design & mockup" />
                    <StackItem title="Next.js App Router" desc="Full-stack React framework" />
                    <StackItem title="React 19" desc="Component library" />
                    <StackItem title="Phosphor Icons" desc="Icon system" />
                </StackCard>

                {/* AI Engine */}
                <StackCard icon={<span style={{ fontSize: 24 }}>🤖</span>} title="AI Synthesis" subtitle="Prompt Engine">
                    <StackItem title="Grok Fast Reasoning" desc="xAI's reasoning model" />
                    <StackItem title="Agentic Pipeline" desc="Matrix inputs → optimized rules" />
                    <StackItem title="xAI OpenAI-Compatible API" desc="No middleman SDK overhead" />
                </StackCard>

                {/* Infrastructure */}
                <StackCard icon={<Lightning size={24} weight="duotone" color={C.green} />} title="Infrastructure" subtitle="Deployment Stack">
                    <StackItem title="Vercel" desc="Serverless edge deployment" />
                    <StackItem title="Next.js API Routes" desc="Secure endpoint processing" />
                    <StackItem title="Tailwind CSS" desc="Atomic utility styling" />
                </StackCard>

                {/* Platforms — full width */}
                <div style={{
                    gridColumn: "1 / -1", background: C.bgCard,
                    border: `1px solid ${C.border}`, borderRadius: 16,
                    padding: 28, boxShadow: `4px 4px 0px 0px ${C.border}`
                }}>
                    <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "1px", marginBottom: 8, textTransform: "uppercase" }}>Supported Platforms</div>
                    <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 20px 0" }}>Platform-specific prompt formatting for each tool.</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {[{ name: "Claude", src: "/claude-logo.png" }, { name: "ChatGPT", src: "/chatgpt-logo.png" }, { name: "Gemini", src: "/gemini-logo.png" }, { name: "Grok", src: "/grok-logo.png" }].map(p => (
                            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, background: C.bgCardAlt, border: `1px solid ${C.border}`, borderRadius: 32, padding: "8px 16px 8px 8px" }}>
                                <div style={{ width: 24, height: 24, borderRadius: 6, overflow: "hidden", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img src={p.src} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => e.target.style.display = 'none'} />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: C.textDim }}>{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StackCard({ icon, title, subtitle, children }) {
    return (
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, boxShadow: `4px 4px 0px 0px ${C.border}`, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, background: C.bgCardAlt, borderRadius: 10, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{title}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{subtitle}</div>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
        </div>
    );
}

function StackItem({ title, desc }) {
    return (
        <div style={{ padding: "10px 14px", background: C.bgCardAlt, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{desc}</div>
        </div>
    );
}

// ── TAB 3: DEVELOPER ──

function DeveloperTab() {
    return (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, boxShadow: `4px 4px 0px 0px ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>
                    <img src="/tony-profile-pic.jpg" alt="Tony Melendez" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.border}`, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />

                    <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "2px", marginBottom: 8, textTransform: "uppercase" }}>// THE_DEVELOPER</div>
                        <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 6px 0", letterSpacing: "-1px" }}>Tony Melendez</h2>
                        <p style={{ fontSize: 15, color: C.textMuted, fontWeight: 600, margin: "0 0 24px 0" }}>Director of Knowledge Strategy & Enablement</p>

                        <p style={{ fontSize: 15, lineHeight: 1.75, color: C.textDim, marginBottom: 24 }}>
                            Knowledge management leader specializing in methodology, AI enablement, and scalable support systems. Expert in building solutions that transform tribal knowledge into structured content, fueling both human expertise and AI-powered tools.
                        </p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
                            {["🎓 Master's in Knowledge Management", "🤖 Certified AI Manager (CAIM)", "💡 AI Systems Builder"].map(t => (
                                <span key={t} style={{ background: `${C.purple}15`, color: C.purple, border: `1px solid ${C.purple}40`, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{t}</span>
                            ))}
                        </div>

                        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginBottom: 28 }}>
                            <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "1px", marginBottom: 10, textTransform: "uppercase" }}>Why I built PromptEQ</div>
                            <p style={{ fontSize: 14, lineHeight: 1.75, color: C.textDim, margin: 0 }}>
                                In studying how teams interact with LLMs, the barrier to entry isn't "writing prompts" — it's managing the complex, unwritten personality controls of the model. I wanted to build a UI that treated the LLM not as a chat box, but as an instrument with equalizers that could be precisely tuned.
                            </p>
                        </div>

                        <a href="https://linkedin.com/in/tonymelendez" target="_blank" rel="noopener noreferrer" style={{
                            display: "inline-flex", alignItems: "center", gap: 10,
                            background: C.green, color: C.navy, padding: "12px 24px",
                            borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: "none",
                            border: `2px solid ${C.greenDim}`, boxShadow: `3px 3px 0px 0px ${C.greenDim}`
                        }}>
                            <User size={16} weight="bold" />
                            Connect on LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
