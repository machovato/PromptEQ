"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_SETTINGS, PRESETS, SLIDERS, TOGGLES, PILL_GROUPS, ABOUT_FIELDS, PLATFORMS, getPlatform } from "../../lib/prompt/config";
import { buildDraft, draftBlocks, polishedBlocks } from "../../lib/prompt/builder";
import { MAX_ABOUT_CHARS, MAX_CUSTOM_CHARS } from "../../lib/prompt/sanitize";
import { encodeShareParams, decodeShareParams } from "../../lib/prompt/share";
import { C, SHADOWS, MONO, RadioPill, Toggle, PresetCard, SectionLabel, FieldLabel, Divider } from "../../components/generate/primitives";
import { FaderStrip } from "../../components/generate/FaderStrip";
import { Booth } from "../../components/generate/Booth";
import { ActionBar } from "../../components/generate/ActionBar";

const inputStyle = {
  width: "100%", padding: "12px 14px", minHeight: 44,
  border: `2px solid ${C.navy}`, borderRadius: 12,
  fontFamily: "'Inter', sans-serif", fontSize: 14,
  boxSizing: "border-box", background: "white", color: C.text,
};

export default function Generate() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activePreset, setActivePreset] = useState("custom");
  const [platformId, setPlatformId] = useState("claude");
  const [scenario, setScenario] = useState("plan");
  const [mobileTab, setMobileTab] = useState("preview");
  const [motor, setMotor] = useState(false);
  const [polished, setPolished] = useState(null); // { key, blocks }
  const [status, setStatus] = useState({ kind: "idle" });
  const [linkCopied, setLinkCopied] = useState(false);
  const motorTimer = useRef(null);

  useEffect(() => {
    const shared = decodeShareParams(window.location.search);
    if (!shared) return;
    setSettings(shared.settings);
    setPlatformId(shared.platform);
    setActivePreset(shared.preset);
  }, []);

  const platform = getPlatform(platformId);
  const draft = useMemo(() => buildDraft(settings), [settings]);
  const liveBlocks = useMemo(() => draftBlocks(draft, platformId), [draft, platformId]);
  const settingsKey = JSON.stringify([settings, platformId]);
  const stale = !!polished && polished.key !== settingsKey;
  const visibleBlocks = polished && !stale ? polished.blocks : liveBlocks;

  const update = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setActivePreset("custom");
  };
  const updateAbout = (key, val) => setSettings(prev => ({ ...prev, about: { ...prev.about, [key]: val } }));
  const toggleUseCase = (val) => setSettings(prev => {
    const has = prev.useCases.includes(val);
    if (has && prev.useCases.length === 1) return prev;
    const useCases = has ? prev.useCases.filter(v => v !== val) : PILL_GROUPS.useCases.map(p => p.value).filter(v => v === val || prev.useCases.includes(v));
    return { ...prev, useCases };
  });

  const loadPreset = (presetId) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    clearTimeout(motorTimer.current);
    setMotor(true);
    motorTimer.current = setTimeout(() => setMotor(false), 900);
    // Presets set behavior only; keep what the user typed about themselves.
    setSettings(prev => ({ ...prev, ...preset.settings, about: prev.about, custom: prev.custom }));
    setActivePreset(presetId);
  };

  const polish = async () => {
    const key = settingsKey;
    setStatus({ kind: "polishing" });
    setMobileTab("draft");
    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, platform: platformId }),
      });
      const data = await resp.json().catch(() => null);
      if (!data) throw new Error(`The server returned an unexpected response (${resp.status}). Try again in a moment.`);
      if (data.error) throw new Error(data.error);
      if (data.fallback) {
        setPolished(null);
        setStatus({ kind: "note", message: "The AI rewrite didn't pass our checks (a rule went missing or it ran long), so we kept the draft. It's ready to paste as-is." });
        return;
      }
      setPolished({ key, blocks: polishedBlocks(data, platformId) });
      setStatus({ kind: "idle" });
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_prompt", { platform: platformId, preset: activePreset });
      }
    } catch (e) {
      setStatus({ kind: "error", message: `Couldn't polish: ${e.message} The live draft below still works.` });
    }
  };

  const editPolished = (id, text) => setPolished(p => ({ ...p, blocks: p.blocks.map(b => (b.id === id ? { ...b, text } : b)) }));

  const shareConfig = async () => {
    const url = `${window.location.origin}/generate?${encodeShareParams(settings, platformId, activePreset)}`;
    try { await navigator.clipboard.writeText(url); } catch { return; }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };
  const shareOnX = () => {
    const tweet = encodeURIComponent(`Just built a custom AI system prompt with PEQ ⚡ — took 2 minutes.\n\nTry it free: https://prompteq.app\n\n#AI #SystemPrompt #PromptEngineering`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, "_blank");
  };
  const shareOnLinkedIn = () => {
    const url = encodeURIComponent("https://prompteq.app");
    const title = encodeURIComponent("PEQ — Build Your Custom AI System Prompt");
    const summary = encodeURIComponent("Just built a custom AI system prompt with PEQ — took 2 minutes. Free to use.");
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`, "_blank");
  };
  const shareActions = [
    { id: "link", label: linkCopied ? "LINK COPIED!" : "COPY_LINK", onClick: shareConfig, active: linkCopied },
    { id: "x", label: "SHARE_X", onClick: shareOnX },
    { id: "li", label: "SHARE_LI", onClick: shareOnLinkedIn },
  ];

  return (
    <div className="peq-shell" style={{ background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT: CONFIGURATION (the only part that scrolls) ── */}
      <div className="peq-controls">

        <SectionLabel step="01_FOUNDATION" title="Foundation" subtitle="Pick a starting archetype, then fine-tune everything below." />
        <div className="peq-presets">
          {PRESETS.map(p => (
            <PresetCard key={p.id} preset={p} active={activePreset === p.id} onClick={() => loadPreset(p.id)} />
          ))}
        </div>

        <Divider />

        <SectionLabel step="02_THE_MIX" title="The Mix" subtitle="Drag a fader and watch your AI's reply change in the booth." />
        <FaderStrip sliders={SLIDERS} settings={settings} onChange={update} motor={motor} />

        <Divider />

        <SectionLabel step="03_ABOUT_YOU" title="About You" subtitle="Optional, but it makes the biggest difference. Never included in share links." />
        <div style={{ marginBottom: 20 }}>
          <FieldLabel>I mostly use AI for</FieldLabel>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PILL_GROUPS.useCases.map(p => (
              <RadioPill key={p.value} label={p.label} active={settings.useCases.includes(p.value)} onClick={() => { toggleUseCase(p.value); setActivePreset("custom"); }} />
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <FieldLabel>My expertise level</FieldLabel>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PILL_GROUPS.expertise.map(p => (
              <RadioPill key={p.value} label={p.label} active={settings.expertise === p.value} onClick={() => update("expertise", p.value)} />
            ))}
          </div>
        </div>
        <div className="peq-about-grid">
          {ABOUT_FIELDS.map(f => (
            <div key={f.key}>
              <FieldLabel htmlFor={`about-${f.key}`}>{f.label}</FieldLabel>
              <input id={`about-${f.key}`} type="text" maxLength={MAX_ABOUT_CHARS} placeholder={f.placeholder} value={settings.about[f.key]} onChange={e => updateAbout(f.key, e.target.value)} style={inputStyle} />
            </div>
          ))}
        </div>

        <Divider />

        <SectionLabel step="04_BEHAVIORAL_RULES" title="Behavioral Rules" subtitle="Hard rules. The AI polish is checked to make sure every one survives." />
        <div style={{ background: "white", border: `2px solid ${C.navy}`, borderRadius: 16, padding: "4px 20px", marginBottom: 24, boxShadow: SHADOWS.hardSmall }}>
          {TOGGLES.map(t => (
            <Toggle key={t.key} checked={settings[t.key]} onChange={() => update(t.key, !settings[t.key])} label={t.label} onText={t.on} offText={t.off} />
          ))}
          <div style={{ padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <FieldLabel>Emoji usage</FieldLabel>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PILL_GROUPS.emoji.map(p => (
                <RadioPill key={p.value} label={p.label} active={settings.emoji === p.value} onClick={() => update("emoji", p.value)} />
              ))}
            </div>
          </div>
          <div style={{ padding: "14px 0" }}>
            <FieldLabel>Disagreement style</FieldLabel>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PILL_GROUPS.disagreement.map(p => (
                <RadioPill key={p.value} label={p.label} active={settings.disagreement === p.value} onClick={() => update("disagreement", p.value)} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: 24 }}>
          <FieldLabel htmlFor="custom-rules">Special instructions (optional)</FieldLabel>
          <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 10, lineHeight: 1.5 }}>One rule per line, e.g. &quot;Reply in Spanish&quot; or &quot;Use metric units&quot;.</div>
          <textarea
            id="custom-rules"
            placeholder="Ex: Avoid jargon unless I use it first"
            maxLength={MAX_CUSTOM_CHARS}
            value={settings.custom}
            onChange={(e) => setSettings(prev => ({ ...prev, custom: e.target.value }))}
            style={{ ...inputStyle, height: 100, resize: "vertical", lineHeight: 1.6, fontSize: 13 }}
          />
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.textMuted, textAlign: "right", marginTop: 4 }}>{settings.custom.length} / {MAX_CUSTOM_CHARS}</div>
        </div>
      </div>

      {/* ── RIGHT: BOOTH (fixed; never scrolls with the page) ── */}
      <Booth
        settings={settings} scenario={scenario} setScenario={setScenario}
        platform={platform} draftBlocks={liveBlocks} polished={polished} stale={stale}
        onEditPolished={editPolished} status={status} onPolish={polish}
        mobileTab={mobileTab} setMobileTab={setMobileTab} shareActions={shareActions}
      />

      <ActionBar
        platforms={PLATFORMS} platform={platform} setPlatform={setPlatformId}
        blocks={visibleBlocks} polishing={status.kind === "polishing"} onPolish={polish}
      />
    </div>
  );
}
