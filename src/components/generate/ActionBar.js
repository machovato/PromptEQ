"use client";

import React from "react";
import { C, MONO, SHADOWS, CharCounter } from "./primitives";

export function ActionBar({ platforms, platform, setPlatform, blocks, polishing, onPolish }) {
  // Show the block closest to its limit — that's the one the user needs to watch.
  const worst = blocks.reduce((a, b) => (b.text.length / b.limit > a.text.length / a.limit ? b : a), blocks[0]);
  return (
    <div className="peq-actions">
      <div className="peq-actions-top">
        <div role="radiogroup" aria-label="Target platform" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {platforms.map(p => {
            const active = platform.id === p.id;
            return (
              <button key={p.id} type="button" role="radio" aria-checked={active} aria-label={p.name} onClick={() => setPlatform(p.id)} className="peq-platform" style={{
                padding: "6px 12px 6px 6px", minHeight: 40, borderRadius: 10, border: `2px solid ${C.navy}`,
                background: active ? C.green : "white", color: C.navy, fontSize: 12, fontWeight: 700, fontFamily: MONO,
                cursor: "pointer", transition: "all 0.1s ease",
                boxShadow: active ? "none" : SHADOWS.hardSmall, transform: active ? "translate(2px, 2px)" : "none",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, background: "white", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={p.icon} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
                </span>
                <span className="peq-platform-name">{p.name}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {blocks.length > 1 && <span style={{ fontFamily: MONO, fontSize: 10, color: C.textMuted }}>{worst.id === "about" ? "BOX 1" : "BOX 2"}</span>}
          <CharCounter count={worst.text.length} limit={worst.limit} hard={platform.hard} />
        </div>
      </div>

      <button
        type="button"
        onClick={onPolish}
        disabled={polishing}
        className="peq-polish peq-press"
        style={{
          width: "100%", padding: "16px 0", minHeight: 52, borderRadius: 14,
          border: `2px solid ${C.navy}`,
          background: polishing ? "#9ca3af" : C.purple,
          color: "white", fontSize: 15, fontWeight: 800, fontFamily: MONO,
          cursor: polishing ? "progress" : "pointer",
          display: "flex", justifyContent: "center", alignItems: "center", gap: 10,
          boxShadow: polishing ? "none" : SHADOWS.hard,
          transition: "all 0.1s ease", letterSpacing: "0.5px"
        }}
      >
        {polishing ? "POLISHING…" : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            POLISH_WITH_AI
          </>
        )}
      </button>
    </div>
  );
}
