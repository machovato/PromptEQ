"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GlobalFooter() {
    const pathname = usePathname();
    if (pathname === '/generate') return null;
    return (
        <div style={{
            borderTop: "1px solid #2A2D3A", background: "#0D0F14",
            padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
            <div style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 12, color: "#4B5563", letterSpacing: "0.5px"
            }}>
                © {new Date().getFullYear()} PROMPTEQ — ENGINEERED FOR PRECISION
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <FooterLink href="/">Home</FooterLink>
                <FooterLink href="/generate">Generate</FooterLink>
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="https://linkedin.com/in/tonymelendez" external>
                    <span style={{ color: "#b4eb4c" }}>●</span> Built by Tony
                </FooterLink>
            </div>
        </div>
    );
}

function FooterLink({ href, external, children }) {
    const Component = external ? 'a' : Link;
    const props = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };

    return (
        <Component {...props} style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11, fontWeight: 700, letterSpacing: "1px",
            textDecoration: "none", textTransform: "uppercase",
            color: "#6B7280"
        }}>
            {children}
        </Component>
    );
}
