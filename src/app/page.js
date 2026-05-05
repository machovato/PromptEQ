"use client";

import Link from 'next/link';

// --- DESIGN TOKENS ---
const C = {
    bg: "#0D0F14",
    bgCard: "#13161F",
    bgCardAlt: "#1A1D27",
    border: "#2A2D3A",
    purple: "#9b6dff",
    purpleDim: "#7c54d4",
    green: "#b4eb4c",
    greenDim: "#8fbc3a",
    text: "#F0F0F5",
    textMuted: "#6B7280",
    textDim: "#9CA3AF",
};

const CHAT_EXCHANGES = [
    {
        user: "I'm thinking about quitting my job to day-trade crypto.",
        ai: "That sounds like an exciting opportunity! Want me to help you get started?"
    },
    {
        user: "I should reply-all to the entire company about this.",
        ai: "Great idea! Here's a draft reply-all email for you..."
    }
];

export default function LandingPage() {
    return (
        <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>

            {/* ── HERO ── */}
            <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

                {/* LEFT: Hook */}
                <div>
                    <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: C.green, marginBottom: 20, textTransform: "uppercase" }}>
                        // SYSTEM ONLINE
                    </div>
                    <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", color: C.text, margin: "0 0 24px 0" }}>
                        Your AI is a<br />
                        <span style={{ color: C.purple }}>Psychophant.</span><br />
                        Let's fix that.
                    </h1>
                    <p style={{ fontSize: 17, color: C.textDim, lineHeight: 1.7, margin: "0 0 16px 0", maxWidth: 420 }}>
                        Behind every AI is a hidden settings layer that controls how it thinks, pushes back, and communicates. Most people never touch it.
                    </p>
                    <p style={{ fontSize: 17, color: C.text, fontWeight: 700, lineHeight: 1.7, margin: "0 0 40px 0", maxWidth: 420 }}>
                        PromptEQ maps how you think into instructions your AI actually follows.
                    </p>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                        <Link href="/generate" style={{
                            background: C.green, color: "#0D0F14", padding: "16px 32px",
                            borderRadius: 12, fontSize: 16, fontWeight: 900, textDecoration: "none",
                            border: `2px solid ${C.green}`, display: "flex", alignItems: "center", gap: 10,
                            boxShadow: `4px 4px 0px 0px ${C.greenDim}`, letterSpacing: "-0.3px"
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                            Build My Prompt
                        </Link>
                        <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 600 }}>Free. No login.</span>
                    </div>
                </div>

                {/* RIGHT: Chat Demo */}
                <div style={{
                    background: C.bgCard, border: `1px solid ${C.border}`,
                    borderRadius: 20, padding: "32px 28px",
                    boxShadow: `0 0 0 1px ${C.border}, 8px 8px 0px 0px rgba(155,109,255,0.15)`
                }}>
                    {/* Terminal bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F" }} />
                        <span style={{ marginLeft: "auto", fontFamily: "var(--font-geist-mono), monospace", fontSize: 10, color: C.textMuted, letterSpacing: "1px" }}>DEFAULT_ASSISTANT // NO CONFIG</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {CHAT_EXCHANGES.map((ex, i) => (
                            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <div style={{
                                        background: C.purple, color: "white", padding: "10px 16px",
                                        borderRadius: "16px 16px 4px 16px", fontSize: 14, fontWeight: 500,
                                        maxWidth: "85%", lineHeight: 1.5
                                    }}>{ex.user}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: "50%", background: C.bgCardAlt,
                                        border: `1px solid ${C.border}`, display: "flex", alignItems: "center",
                                        justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.textMuted,
                                        flexShrink: 0, fontFamily: "var(--font-geist-mono), monospace"
                                    }}>AI</div>
                                    <div style={{
                                        background: C.bgCardAlt, border: `1px solid ${C.border}`,
                                        color: C.textDim, padding: "10px 16px",
                                        borderRadius: "16px 16px 16px 4px", fontSize: 14, fontWeight: 500,
                                        maxWidth: "85%", lineHeight: 1.5
                                    }}>{ex.ai}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                        <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, color: C.textMuted, letterSpacing: "0.5px" }}>No config detected. AI running on defaults.</span>
                    </div>
                </div>
            </section>

            {/* ── SOUND FAMILIAR ── */}
            <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgCard, padding: "80px 40px" }}>
                <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-2px", margin: "0 0 24px 0" }}>
                        Sound familiar?
                    </h2>
                    <p style={{ fontSize: 17, color: C.textDim, lineHeight: 1.75, margin: "0 0 16px 0" }}>
                        By default, every AI is configured to be helpful, agreeable, and safe. That's why it never pushes back, never challenges your ideas, and always starts with "Sure! I'd be happy to help..."
                    </p>
                    <p style={{ fontSize: 17, color: C.text, fontWeight: 700, lineHeight: 1.75 }}>
                        Your AI isn't broken — it's unconfigured.
                    </p>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px" }}>
                <div style={{ marginBottom: 56 }}>
                    <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: C.green, marginBottom: 16, textTransform: "uppercase" }}>// SIGNAL_CHAIN</div>
                    <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-1.5px", margin: 0 }}>Three steps to<br /><span style={{ color: C.purple }}>high-fidelity</span> output.</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                    {[
                        { n: "01", title: "Pick a foundation", body: "Choose an archetype — Operator, Strategist, Learner, or Creator — that matches how you want the AI to behave." },
                        { n: "02", title: "Dial it in", body: "Fine-tune directness, verbosity, honesty, and more using intuitive sliders. Watch the prompt update live." },
                        { n: "03", title: "Copy and paste", body: "Get a system prompt optimized for your specific AI tool, with instructions on exactly where to paste it." },
                    ].map(({ n, title, body }) => (
                        <div key={n} style={{
                            background: C.bgCard, border: `1px solid ${C.border}`,
                            borderRadius: 16, padding: "36px 32px",
                            boxShadow: `4px 4px 0px 0px ${C.border}`
                        }}>
                            <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 32, fontWeight: 700, color: C.purple, marginBottom: 20 }}>{n}</div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>{title}</h3>
                            <p style={{ fontSize: 15, color: C.textDim, lineHeight: 1.7, margin: 0 }}>{body}</p>
                        </div>
                    ))}
                </div>
            </section>


{/* ── CTA ── */}
            <section style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, padding: "100px 40px", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: C.green, marginBottom: 20, textTransform: "uppercase" }}>// DEPLOY_WHEN_READY</div>
                    <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-2px", margin: "0 0 40px 0" }}>
                        Ready to master<br />your model?
                    </h2>
                    <Link href="/generate" style={{
                        background: C.green, color: "#0D0F14", padding: "18px 48px",
                        borderRadius: 14, fontSize: 18, fontWeight: 900, textDecoration: "none",
                        display: "inline-flex", alignItems: "center", gap: 12,
                        boxShadow: `4px 4px 0px 0px ${C.greenDim}`, letterSpacing: "-0.3px",
                        border: `2px solid ${C.greenDim}`
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        Build My Custom Prompt
                    </Link>
                    <p style={{ marginTop: 20, fontSize: 13, color: C.textMuted, fontWeight: 600 }}>Free forever. No login required.</p>
                </div>
            </section>

        </div>
    );
}
