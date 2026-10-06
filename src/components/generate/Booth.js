"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { C, MONO, CharCounter } from "./primitives";
import { SCENARIOS, composeVibe } from "../../lib/vibe";

const DIM = "#94A3B8";
const ACCENT = "#3B82F6";

function useCopy() {
  const [copied, setCopied] = useState(null);
  const copy = async (id, text) => {
    try { await navigator.clipboard.writeText(text); } catch { return; }
    setCopied(id);
    setTimeout(() => setCopied(c => (c === id ? null : c)), 2000);
  };
  return [copied, copy];
}

function SmallButton({ children, onClick, active, ...rest }) {
  return (
    <button type="button" onClick={onClick} {...rest} style={{
      background: active ? C.green : "transparent", color: active ? C.navy : "#CBD5E1",
      border: `1px solid ${active ? C.green : "#475569"}`, borderRadius: 6,
      padding: "6px 12px", minHeight: 32, fontSize: 10, fontWeight: 700, fontFamily: MONO,
      letterSpacing: "0.5px", cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap"
    }}>{children}</button>
  );
}

function VibeCheck({ settings, scenario, setScenario }) {
  const [compare, setCompare] = useState(false);
  const sc = SCENARIOS.find(s => s.id === scenario);
  const yours = composeVibe(settings, scenario);
  return (
    <section className="peq-booth-vibe" aria-label="Live vibe check">
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
        {SCENARIOS.map(s => (
          <button key={s.id} type="button" aria-pressed={s.id === scenario} onClick={() => setScenario(s.id)} style={{
            background: s.id === scenario ? C.purple : "transparent", color: s.id === scenario ? "white" : "#CBD5E1",
            border: `1px solid ${s.id === scenario ? C.purple : "#475569"}`, borderRadius: 20,
            padding: "5px 12px", minHeight: 30, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif"
          }}>{s.chip}</button>
        ))}
        <span className="peq-compare-btn" style={{ marginLeft: "auto" }}>
          <SmallButton onClick={() => setCompare(c => !c)} active={compare} aria-pressed={compare}>{compare ? "SHOW YOURS" : "VS DEFAULT"}</SmallButton>
        </span>
      </div>
      <div style={{ fontSize: 12, color: "#E2E8F0", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>
        <span style={{ color: DIM, fontFamily: MONO, fontSize: 10, marginRight: 8 }}>YOU</span>{sc.user}
      </div>
      <div className="peq-vibe-grid" data-compare={compare ? "1" : "0"}>
        <div className="peq-vibe-default" style={{ borderRadius: 10, border: "1px dashed #475569", padding: "10px 12px" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: "#F87171", marginBottom: 6 }}>DEFAULT AI</div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: DIM, fontFamily: "'Inter', sans-serif" }}>{sc.defaultReply}</div>
        </div>
        <div className="peq-vibe-yours" style={{ borderRadius: 10, border: `1px solid ${C.green}66`, background: "rgba(180,235,76,0.06)", padding: "10px 12px" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.green, marginBottom: 6 }}>YOUR AI</div>
          <div aria-live="polite" style={{ fontSize: 12, lineHeight: 1.6, color: "#F1F5F9", whiteSpace: "pre-line", fontFamily: "'Inter', sans-serif" }}>{yours}</div>
        </div>
      </div>
    </section>
  );
}

// Renders id-tagged draft lines; lines whose text changed re-mount (flash) and scroll into view.
function LiveLines({ sections, scrollRef }) {
  const current = {};
  sections.forEach(s => s.lines.forEach(l => { current[l.id] = l.text; }));

  // Derive "what changed" from the previous render's text (React's adjust-state-during-render pattern).
  const [track, setTrack] = useState({ texts: current, versions: {}, changed: [] });
  const diff = Object.keys(current).filter(id => track.texts[id] !== current[id]);
  const removed = Object.keys(track.texts).some(id => !(id in current));
  if (diff.length || removed) {
    const versions = { ...track.versions };
    diff.forEach(id => { versions[id] = (versions[id] || 0) + 1; });
    setTrack({ texts: current, versions, changed: diff });
  }

  useLayoutEffect(() => {
    const box = scrollRef.current;
    const first = track.changed.length && box?.querySelector(`[data-line="${track.changed[0]}"]`);
    if (first) {
      const fr = first.getBoundingClientRect(), br = box.getBoundingClientRect();
      if (fr.top < br.top || fr.bottom > br.bottom) box.scrollTop += fr.top - br.top - br.height / 3;
    }
  }, [track, scrollRef]);

  return sections.map(s => (
    <div key={s.heading || "lines"} style={{ marginBottom: 12 }}>
      {s.heading && <div style={{ color: ACCENT, marginBottom: 4 }}>{s.heading}:</div>}
      {s.lines.map(l => (
        <div
          key={`${l.id}-${track.versions[l.id] || 0}`}
          data-line={l.id}
          className={track.versions[l.id] ? "peq-flash" : undefined}
          style={{ padding: "1px 6px", margin: "0 -6px", borderRadius: 4, color: l.kind === "rule" ? "#E9D5FF" : "#E2E8F0" }}
        >
          - {l.text}
        </div>
      ))}
    </div>
  ));
}

function BlockHeader({ block, text, copied, onCopy, hard }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
      <div style={{ color: ACCENT, fontWeight: 700, flex: 1, minWidth: 0 }}># {block.title}</div>
      <CharCounter count={text.length} limit={block.limit} hard={hard} dark />
      <SmallButton onClick={() => onCopy(block.id, text)} active={copied === block.id}>{copied === block.id ? "COPIED!" : "COPY"}</SmallButton>
    </div>
  );
}

export function Booth({
  settings, scenario, setScenario, platform, draftBlocks, polished, stale, onEditPolished,
  status, onPolish, mobileTab, setMobileTab, shareActions,
}) {
  const [copied, copy] = useCopy();
  const scrollRef = useRef(null);
  const showPolished = polished && !stale;

  useEffect(() => { if (showPolished && scrollRef.current) scrollRef.current.scrollTop = 0; }, [showPolished]);

  return (
    <div className="peq-booth" data-mtab={mobileTab}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 12, marginBottom: 12 }}>
        <div className="peq-dots" style={{ display: "flex", gap: 7 }}>
          {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#6B7280", flex: 1 }}>
          <span className="peq-booth-prefix">CONTROL_BOOTH // </span>{status.kind === "polishing" ? "POLISHING" : showPolished ? "POLISHED" : "LIVE"}
        </div>
        <div className="peq-mobile-tabs" role="tablist" aria-label="Booth view">
          {[["preview", "Preview"], ["draft", "Instructions"]].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={mobileTab === id} onClick={() => setMobileTab(id)} style={{
              background: mobileTab === id ? C.green : "transparent", color: mobileTab === id ? C.navy : "#CBD5E1",
              border: `1px solid ${mobileTab === id ? C.green : "#475569"}`, borderRadius: 6, padding: "6px 10px", minHeight: 32,
              fontSize: 11, fontWeight: 700, fontFamily: MONO, cursor: "pointer"
            }}>{label}</button>
          ))}
        </div>
      </div>

      <VibeCheck settings={settings} scenario={scenario} setScenario={setScenario} />

      <section className="peq-booth-draft" aria-label="Custom instructions" aria-busy={status.kind === "polishing"}>
        {stale && (
          <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.5)", color: "#FCD34D", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 11, fontFamily: MONO }}>
            <span style={{ flex: 1, minWidth: 180 }}>Settings changed since you polished, so this is the live draft.</span>
            <SmallButton onClick={onPolish}>POLISH AGAIN</SmallButton>
          </div>
        )}
        {status.kind === "note" && !stale && (
          <div role="status" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.5)", color: "#BFDBFE", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 11, fontFamily: MONO }}>{status.message}</div>
        )}
        {status.kind === "error" && (
          <div role="alert" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.5)", color: "#FCA5A5", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 11, fontFamily: MONO }}>{status.message}</div>
        )}

        <div ref={scrollRef} className="peq-draft-scroll" style={{ position: "relative", fontFamily: MONO, fontSize: 12, lineHeight: 1.7, color: "#E2E8F0", opacity: status.kind === "polishing" ? 0.45 : 1, transition: "opacity 0.2s" }}>
          {(showPolished ? polished.blocks : draftBlocks).map(b => (
            <div key={b.id} style={{ marginBottom: 18 }}>
              <BlockHeader block={b} text={b.text} copied={copied} onCopy={copy} hard={platform.hard} />
              {showPolished ? (
                <textarea
                  aria-label={b.title}
                  value={b.text}
                  onChange={e => onEditPolished(b.id, e.target.value)}
                  rows={Math.max(6, b.text.split("\n").length + 1)}
                  style={{ width: "100%", border: "1px solid #334155", borderRadius: 8, padding: 10, fontFamily: MONO, fontSize: 12, lineHeight: 1.7, color: "#E2E8F0", background: "rgba(255,255,255,0.03)", resize: "vertical", boxSizing: "border-box" }}
                />
              ) : (
                <LiveLines sections={b.sections} scrollRef={scrollRef} />
              )}
            </div>
          ))}

          <div style={{ color: "#64748B", fontSize: 11, marginBottom: 12 }}>Paste into: {platform.note}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 4 }}>
            {shareActions.map(a => <SmallButton key={a.id} onClick={a.onClick} active={a.active}>{a.label}</SmallButton>)}
          </div>
        </div>

        {status.kind === "polishing" && (
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ background: C.navy, border: `1px solid ${C.green}`, color: C.green, borderRadius: 10, padding: "12px 18px", fontFamily: MONO, fontSize: 12, lineHeight: 1.8, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              &gt; Rewriting for {platform.name}…<br />
              &gt; Checking your rules survived…<br />
              <span className="peq-blink">_ usually 20–40s</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
