"use client";

import Link from 'next/link';

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
        <div className="flex-1 flex flex-col font-['Inter'] w-full min-h-0 bg-[#FAFAFA] text-[#15151A]">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            {/* SECTION 1: THE HOOK */}
            <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20 md:px-10 max-w-3xl mx-auto w-full">

                {/* Chat Exchanges */}
                <div className="flex flex-col gap-10 mb-16">
                    {CHAT_EXCHANGES.map((ex, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            {/* User bubble — right aligned */}
                            <div className="flex justify-end">
                                <div className="bg-[#9b6dff] text-white text-[15px] font-[500] leading-relaxed px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-[2px_2px_0px_0px_rgba(19,22,32,0.3)]">
                                    {ex.user}
                                </div>
                            </div>
                            {/* AI bubble — left aligned */}
                            <div className="flex justify-start items-end gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#E5E7EB] border border-[#D1D5DB] flex items-center justify-center flex-shrink-0 text-xs font-[800] text-[#6B7280]">
                                    AI
                                </div>
                                <div className="bg-white border-2 border-[#E5E7EB] text-[#374151] text-[15px] font-[500] leading-relaxed px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)]">
                                    {ex.ai}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Headline block — centered below the chats */}
                <div className="text-center flex flex-col items-center gap-6">
                    <h1 className="text-5xl md:text-6xl font-[900] tracking-[-2px] text-[#131620] leading-[1.05]">
                        Sound familiar?
                    </h1>
                    <p className="text-base md:text-lg text-[#6B7280] font-[500] leading-relaxed max-w-xl">
                        Behind every AI tool is a set of instructions that tell it how to respond to you. By default, those instructions say: be helpful, be agreeable, be safe. That's why every AI sounds the same — and why it never pushes back.
                    </p>
                    <p className="text-base md:text-lg text-[#6B7280] font-[500] leading-relaxed max-w-xl">
                        Your AI isn't broken — it's unconfigured. Every major AI tool has a hidden settings layer that controls how it thinks, pushes back, and communicates. Most people never touch it.
                    </p>
                    <p className="text-base md:text-lg text-[#131620] font-[700] leading-relaxed max-w-xl">
                        PEQ maps how you think into instructions your AI actually follows.
                    </p>
                    <Link
                        href="/generate"
                        className="mt-2 bg-[#9b6dff] text-white px-8 py-4 rounded-2xl text-base font-[800] tracking-[-0.5px] transition-all shadow-[4px_4px_0px_0px_rgba(19,22,32,1)] border-2 border-[#131620] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(19,22,32,1)] no-underline flex items-center gap-3"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        Open the Console
                    </Link>
                </div>
            </section>

            {/* SECTION 2: HOW IT WORKS */}
            <section className="px-6 py-20 md:py-24 md:px-10 max-w-6xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-[800] tracking-[-1px] text-[#131620]">How It Works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl border-2 border-[#131620] shadow-[4px_4px_0px_0px_rgba(19,22,32,1)]">
                        <div className="w-12 h-12 rounded-full bg-[#b4eb4c] border-2 border-[#131620] flex items-center justify-center text-xl font-[900] text-[#131620] mb-6">1</div>
                        <h3 className="text-xl font-[800] text-[#131620] mb-3">Pick a starting point</h3>
                        <p className="text-[#6B7280] font-[500] leading-relaxed">Choose an archetype (like Strategist or Operator) that functionally matches how you want the AI to behave.</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border-2 border-[#131620] shadow-[4px_4px_0px_0px_rgba(19,22,32,1)]">
                        <div className="w-12 h-12 rounded-full bg-[#b4eb4c] border-2 border-[#131620] flex items-center justify-center text-xl font-[900] text-[#131620] mb-6">2</div>
                        <h3 className="text-xl font-[800] text-[#131620] mb-3">Dial it in</h3>
                        <p className="text-[#6B7280] font-[500] leading-relaxed">Fine-tune 10+ settings across communication, reasoning, and behavior using intuitive sliders.</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border-2 border-[#131620] shadow-[4px_4px_0px_0px_rgba(19,22,32,1)]">
                        <div className="w-12 h-12 rounded-full bg-[#b4eb4c] border-2 border-[#131620] flex items-center justify-center text-xl font-[900] text-[#131620] mb-6">3</div>
                        <h3 className="text-xl font-[800] text-[#131620] mb-3">Copy and paste</h3>
                        <p className="text-[#6B7280] font-[500] leading-relaxed">Get a compressed, AI-translated system prompt optimized for your specific tool — and instructions on exactly where to paste it.</p>
                    </div>
                </div>
            </section>

            {/* SECTION 3: PLATFORM SUPPORT */}
            <section className="px-6 py-16 md:px-10 bg-[#131620] text-white">
                <div className="max-w-5xl mx-auto flex flex-col items-center">
                    <p className="text-[#9ca3af] font-mono text-sm uppercase tracking-[2px] mb-8 font-[700] text-center">
                        PEQ generates instructions tailored to your tool and shows you exactly where to paste them.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                        <PlatformBadge src="/claude-logo.png" name="Claude" />
                        <PlatformBadge src="/chatgpt-logo.png" name="ChatGPT" />
                        <PlatformBadge src="/gemini-logo.png" name="Gemini" />
                        <PlatformBadge src="/grok-logo.png" name="Grok" />
                    </div>
                </div>
            </section>

        </div>
    );
}

function PlatformBadge({ src, name }) {
    return (
        <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-5 py-2">
            <div className="w-6 h-6 rounded-md overflow-hidden bg-white flex items-center justify-center p-0.5">
                <img
                    src={src}
                    alt={`${name} Logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            </div>
            <span className="font-[700] tracking-[-0.5px]">{name}</span>
        </div>
    );
}
