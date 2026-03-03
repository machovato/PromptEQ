"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Heart,
    Code,
    User,
    CheckCircle,
    SlidersHorizontal,
    TerminalWindow,
    Lightning,
    Brain,
    Layout,
    ArrowLeft
} from '@phosphor-icons/react';

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

const TABS = [
    { id: 'app', label: 'About the App' },
    { id: 'tech', label: 'Tech Stack' },
    { id: 'developer', label: 'The Developer' }
];

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('app');

    const getIcon = (tabId, isActive) => {
        const weight = isActive ? 'fill' : 'regular';
        switch (tabId) {
            case 'app': return <Heart size={16} weight={weight} />;
            case 'tech': return <Code size={16} weight={weight} />;
            case 'developer': return <User size={16} weight={weight} />;
        }
    };

    return (
        <div className="flex-1 flex flex-col font-['Inter'] w-full">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            {/* TAB SHELF */}
            <div style={{ background: "white", padding: "0 40px", display: "flex", alignItems: "flex-end", gap: 6, position: "relative" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: COLORS.navy, zIndex: 0 }} />

                {TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "12px 24px", borderRadius: "12px 12px 0 0",
                                fontSize: 13, fontWeight: isActive ? 800 : 600, fontFamily: "'Inter', sans-serif",
                                transition: "all 0.1s ease",
                                cursor: "pointer",
                                position: "relative", zIndex: 10,
                                background: isActive ? COLORS.purple : "#F3F4F6",
                                color: isActive ? "white" : COLORS.textMuted,
                                borderTop: `2px solid ${isActive ? COLORS.navy : "transparent"}`,
                                borderLeft: `2px solid ${isActive ? COLORS.navy : "transparent"}`,
                                borderRight: `2px solid ${isActive ? COLORS.navy : "transparent"}`,
                                borderBottom: isActive ? `2px solid ${COLORS.purple}` : "none",
                            }}
                        >
                            {/* Covers the bottom line when active */}
                            {isActive && (
                                <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 4, background: COLORS.purple }} />
                            )}
                            {getIcon(tab.id, isActive)}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* CONTENT AREA */}
            <div style={{ padding: "48px 40px", maxWidth: 900, margin: "0 auto" }}>
                {activeTab === 'app' && <AboutAppTab />}
                {activeTab === 'tech' && <TechStackTab />}
                {activeTab === 'developer' && <DeveloperTab />}
            </div>

        </div>
    );
}

// ============================================================================
// TAB 1: ABOUT THE APP
// ============================================================================

function AboutAppTab() {
    return (
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
                <img src="/logo.png" alt="PromptEQ Logo" style={{ width: 80, height: 80, borderRadius: 20, boxShadow: SHADOWS.hardSmall, border: `2px solid ${COLORS.navy}` }} />
                <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.purpleHover, letterSpacing: "1px", marginBottom: 4 }}>ABOUT PROMPTEQ</div>
                    <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>Mixing Console for AI</h2>
                </div>
            </div>
            <p style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.6, marginBottom: 24 }}>
                PromptEQ is a <strong>System Prompt and Custom Instructions generator</strong> designed
                to look and feel like an audio mixing console. Instead of trial-and-error prompting,
                you adjust sliders to mathematically shift how your AI behaves.
            </p>
            <p style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.6, marginBottom: 48 }}>
                AI models have a default "personality" (usually helpful, overly polite, and slightly verbose).
                PromptEQ allows you to dial in exact profiles—whether you need a blunt code reviewer, a
                patient tutor, or a creative brainstorming partner—and generates the optimal system
                prompt to load into Claude, ChatGPT, or Gemini.
            </p>

            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 24px 0", display: "flex", alignItems: "center", gap: 8 }}>
                <TerminalWindow size={28} weight="duotone" color={COLORS.purpleHover} /> How It Works
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 48 }}>
                {[
                    { step: 1, title: 'Choose a Preset', desc: 'Start with an archetype like "Operator" (blunt, fast, technical) or "Strategist" (analytical, thorough).' },
                    { step: 2, title: 'Adjust the Mix', desc: 'Fine-tune 6 core behavioral metrics: Directness, Verbosity, Honesty, Abstraction, Structure, and Answer Order.' },
                    { step: 3, title: 'Set Constraints', desc: 'Toggle explicit behavioral rules, such as forcing the AI to ask clarifying questions or restricting emoji usage.' },
                    { step: 4, title: 'Synthesize Prompt', desc: 'The app uses a dedicated LLM pipeline to process your preferences and output a mathematically compressed, hyper-optimized system prompt.' }
                ].map(item => (
                    <div key={item.step} style={{
                        display: "flex", gap: 16, background: "white", borderRadius: 16,
                        border: `2px solid ${COLORS.navy}`, padding: 24, boxShadow: SHADOWS.hardSmall
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 20, background: COLORS.green,
                            color: COLORS.navy, fontWeight: 800, display: "flex", alignItems: "center",
                            justifyContent: "center", flexShrink: 0, border: `2px solid ${COLORS.navy}`
                        }}>
                            {item.step}
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, margin: "0 0 4px 0" }}>{item.title}</h4>
                            <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ background: "white", padding: 32, borderRadius: 16, border: `2px solid ${COLORS.navy}`, boxShadow: SHADOWS.hard }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <SlidersHorizontal size={24} weight="bold" /> Why sliders?
                </h3>
                <p style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.6 }}>
                    Language is imprecise. "Be concise" means different things to different AI models.
                    By using a normalized 1-to-5 scale across distinct behavioral axes, PromptEQ provides
                    a standardized way to describe AI personality. Our translation layer then converts
                    those numeric values into the specific semantic instructions that models follow best.
                </p>
            </div>
        </div>
    );
}

// ============================================================================
// TAB 2: TECH STACK
// ============================================================================

function TechStackTab() {
    return (
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
            {/* Header / Intro */}
            <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 16px 0" }}>Under the Hood</h2>
                <p style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.6 }}>
                    PromptEQ is a modern web application leveraging serverless AI inference.
                    It demonstrates brutalist UI design principles while maintaining a highly
                    responsive, state-driven user experience.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>

                {/* Primary Showcase: Google Antigravity */}
                <div style={{
                    gridColumn: "1 / -1",
                    background: COLORS.navy, border: `2px solid ${COLORS.navy}`, borderRadius: 16,
                    padding: 40, boxShadow: SHADOWS.hard, display: "flex", flexDirection: "column",
                    color: "white"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                        <div style={{ width: 56, height: 56, background: COLORS.green, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src="/antigravity-logo.png" alt="Antigravity" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: 24, margin: 0 }}>Built with Google Antigravity</h3>
                            <p style={{ fontSize: 14, color: COLORS.gray, margin: "4px 0 0 0" }}>Agentic AI Development Assistant</p>
                        </div>
                    </div>

                    <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 24px 0" }}>
                        PromptEQ was entirely conceptualized, drafted, and engineered in partnership with
                        <strong> Google Antigravity</strong>. From the brutalist UI design choices to the Next.js
                        App Router architecture and intelligent API routes, the application is a showcase of
                        human-agent collaborative software development.
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        <Badge text="🚀 Rapid Prototyping" inverse />
                        <Badge text="🧠 Agentic Coding" inverse />
                        <Badge text="⚡ Seamless Refactoring" inverse />
                    </div>
                </div>

                {/* Frontend */}
                <div style={{
                    background: "white", border: `2px solid ${COLORS.navy}`, borderRadius: 16,
                    padding: 32, boxShadow: SHADOWS.hard, display: "flex", flexDirection: "column"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                        <div style={{ padding: 12, background: "#F3F4F6", borderRadius: 12, border: `2px solid ${COLORS.navy}` }}>
                            <Layout size={28} weight="duotone" color={COLORS.navy} />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: 18, color: COLORS.navy, margin: 0 }}>Frontend UI</h3>
                            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>Client Framework</p>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <StackItem title="Next.js App Router" desc="Full-stack React framework (v16)" />
                        <StackItem title="React" desc="v19 component library" />
                        <StackItem title="Phosphor Icons" desc="Consistent icon system" />
                    </div>
                </div>

                {/* Synthesis Engine */}
                <div style={{
                    background: "white", border: `2px solid ${COLORS.navy}`, borderRadius: 16,
                    padding: 32, boxShadow: SHADOWS.hard, display: "flex", flexDirection: "column"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                        <div style={{ width: 52, height: 52, background: "#F3E8FE", borderRadius: 12, border: `2px solid ${COLORS.navy}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src="/grok-logo.png" alt="Grok" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: 18, color: COLORS.navy, margin: 0 }}>AI Synthesis</h3>
                            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>Prompt Engine</p>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <StackItem title="Grok 4 Fast Reasoning" desc="xAI's fastest reasoning model" />
                        <StackItem title="Agentic Pipeline" desc="Takes matrix inputs & outputs rules" />
                        <StackItem title="xAI OpenAI-Compatible API" desc="No middleman SDK overhead" />
                    </div>
                </div>

                {/* Infrastructure */}
                <div style={{
                    background: "white", border: `2px solid ${COLORS.navy}`, borderRadius: 16,
                    padding: 32, boxShadow: SHADOWS.hard, display: "flex", flexDirection: "column"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                        <div style={{ padding: 12, background: "rgba(180,235,76, 0.3)", borderRadius: 12, border: `2px solid ${COLORS.navy}` }}>
                            <Lightning size={28} weight="duotone" color={COLORS.navy} />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: 18, color: COLORS.navy, margin: 0 }}>Infrastructure</h3>
                            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>Deployment Stack</p>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <StackItem title="Vercel & Node" desc="Serverless edge deployment" />
                        <StackItem title="Next.js API Routes" desc="Secure endpoint processing" />
                        <StackItem title="Tailwind CSS" desc="Atomic utility styling classes" />
                    </div>
                </div>

                {/* Supported Platforms */}
                <div style={{
                    gridColumn: "1 / -1",
                    background: "white", border: `2px solid ${COLORS.navy}`, borderRadius: 16,
                    padding: 32, boxShadow: SHADOWS.hard
                }}>
                    <h3 style={{ fontWeight: 800, fontSize: 18, color: COLORS.navy, margin: "0 0 8px 0" }}>Supported Platforms</h3>
                    <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 24px 0" }}>PEQ generates optimized prompts for each of these tools, with platform-specific formatting rules.</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {[
                            { name: "Claude", src: "/claude-logo.png" },
                            { name: "ChatGPT", src: "/chatgpt-logo.png" },
                            { name: "Gemini", src: "/gemini-logo.png" },
                            { name: "Grok", src: "/grok-logo.png" }
                        ].map(p => (
                            <div key={p.name} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                background: "#FAFAFA", border: `2px solid ${COLORS.gray}`,
                                borderRadius: 32, padding: "8px 16px 8px 8px"
                            }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, overflow: "hidden", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img src={p.src} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.navy }}>{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function StackItem({ title, desc }) {
    return (
        <div style={{ padding: "12px 16px", background: "#FAFAFA", borderRadius: 8, border: `1px solid ${COLORS.gray}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.navy, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>{desc}</div>
        </div>
    );
}

// ============================================================================
// TAB 3: THE DEVELOPER
// ============================================================================

function DeveloperTab() {
    return (
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
            <div style={{ background: "white", border: `2px solid ${COLORS.navy}`, borderRadius: 16, padding: 48, boxShadow: SHADOWS.hard }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>

                    {/* Placeholder for Profile Img, or a fun graphic */}
                    <img
                        src="/tony-profile-pic.jpg"
                        alt="Tony Melendez"
                        style={{
                            width: 120, height: 120, borderRadius: "50%", objectFit: "cover",
                            border: `4px solid ${COLORS.navy}`, flexShrink: 0, boxShadow: SHADOWS.hardSmall
                        }}
                    />

                    <div style={{ flex: 1, minWidth: 280 }}>
                        <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px 0", letterSpacing: "-1px" }}>Tony Melendez</h2>
                        <p style={{ fontSize: 16, color: COLORS.textMuted, fontWeight: 600, margin: "0 0 24px 0" }}>Director of Knowledge Strategy & Enablement</p>

                        <p style={{ fontSize: 16, lineHeight: 1.6, color: COLORS.text, marginBottom: 24 }}>
                            Knowledge management leader specializing in methodology, AI enablement, and
                            scalable support systems. Expert in building solutions that transform tribal
                            knowledge into structured content, fueling both human expertise and AI-powered tools.
                        </p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
                            <Badge text="🎓 Master's in Knowledge Management" />
                            <Badge text="🤖 Certified AI Manager (CAIM)" />
                            <Badge text="💡 AI Systems Builder" />
                        </div>

                        <div style={{ borderTop: `1px solid ${COLORS.gray}`, paddingTop: 24 }}>
                            <h4 style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>Why did I build PromptEQ?</h4>
                            <p style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.textMuted }}>
                                In studying how teams interact with Large Language Models, the barrier to entry isn't
                                "writing prompts"—it's managing the complex, unwritten personality controls of the model.
                                I wanted to build a UI that treated the LLM not as a chat box, but as an instrument with
                                equalizers (EQ) that could be precisely tuned for the perfect output.
                            </p>
                        </div>

                        <div style={{ marginTop: 32 }}>
                            <a
                                href="https://linkedin.com/in/tonymelendez"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 8,
                                    background: COLORS.navy, color: "white", padding: "12px 24px",
                                    borderRadius: 12, fontSize: 14, fontWeight: 800, textDecoration: "none",
                                    boxShadow: SHADOWS.hardSmall, transition: "transform 0.1s ease"
                                }}
                            >
                                <User size={18} weight="bold" />
                                Connect on LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ text, inverse = false }) {
    return (
        <span style={{
            background: inverse ? "rgba(255,255,255,0.1)" : "#F3E8FE",
            color: inverse ? "white" : COLORS.purpleHover,
            padding: "6px 16px",
            borderRadius: 24,
            fontSize: 12,
            fontWeight: 800,
            border: `2px solid ${inverse ? "white" : COLORS.purpleHover}`
        }}>
            {text}
        </span>
    );
}

