"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GlobalHeader() {
    const pathname = usePathname();

    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "#0D0F14", borderBottom: "1px solid #2A2D3A",
            padding: "0 40px", height: 56
        }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <img src="/logo.png" alt="PromptEQ Logo" style={{ width: 28, height: 28, borderRadius: 8 }} />
                <span style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 15, fontWeight: 700, color: "#F0F0F5", letterSpacing: "-0.5px"
                }}>PROMPTEQ</span>
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <NavLink href="/" current={pathname}>Home</NavLink>
                <NavLink href="/generate" current={pathname}>Generate</NavLink>
                <NavLink href="/about" current={pathname}>About</NavLink>
            </div>

            <Link href="/generate" style={{
                background: "#b4eb4c", color: "#0D0F14",
                padding: "8px 20px", borderRadius: 8,
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 11, fontWeight: 700, letterSpacing: "1px",
                textDecoration: "none", border: "2px solid #8fbc3a"
            }}>
                DEPLOY_PROMPT
            </Link>
        </div>
    );
}

function NavLink({ href, current, children }) {
    const isActive = current === href;
    return (
        <Link href={href} style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11, fontWeight: 700, letterSpacing: "1px",
            textDecoration: "none", textTransform: "uppercase",
            color: isActive ? "#b4eb4c" : "#6B7280",
            borderBottom: isActive ? "2px solid #b4eb4c" : "2px solid transparent",
            paddingBottom: 2
        }}>
            {children}
        </Link>
    );
}
