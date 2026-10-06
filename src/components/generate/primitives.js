"use client";

// --- DESIGN TOKENS ---
export const C = {
  bg: "#FAFAFA",
  bgCard: "#FFFFFF",
  border: "#E5E5E5",
  purple: "#9b6dff",
  green: "#b4eb4c",
  navy: "#131620",
  text: "#15151A",
  textMuted: "#6B7280",
};

export const SHADOWS = {
  hard: "4px 4px 0px 0px rgba(0,0,0,1)",
  hardSmall: "2px 2px 0px 0px rgba(0,0,0,1)"
};

export const MONO = "var(--font-geist-mono), monospace";

const pressed = (active) => ({
  boxShadow: active ? "none" : SHADOWS.hardSmall,
  transform: active ? "translate(2px, 2px)" : "none",
});

export function RadioPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="peq-press"
      style={{
        padding: "10px 16px", minHeight: 40, borderRadius: 24,
        border: `2px solid ${C.navy}`,
        background: active ? C.purple : "white",
        color: active ? "white" : C.text,
        fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif",
        cursor: "pointer", transition: "all 0.1s ease", ...pressed(active)
      }}
    >
      {label}
    </button>
  );
}

export function Toggle({ checked, onChange, label, onText, offText }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{label}</div>
      <button
        type="button" role="switch" aria-checked={checked} aria-label={`${label} ${checked ? onText : offText}`}
        onClick={onChange}
        style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: "6px 0", minHeight: 44 }}
      >
        <span style={{ fontSize: 13, color: C.textMuted, fontFamily: MONO, textAlign: "right" }}>{checked ? onText : offText}</span>
        <span style={{
          width: 48, height: 28, borderRadius: 14, flexShrink: 0,
          background: checked ? C.green : "white", border: `2px solid ${C.navy}`,
          position: "relative", transition: "background 0.2s ease"
        }}>
          <span className="peq-anim" style={{
            width: 20, height: 20, borderRadius: "50%", background: C.navy,
            position: "absolute", top: 2, left: checked ? 22 : 2,
            transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }} />
        </span>
      </button>
    </div>
  );
}

export function PresetCard({ preset, active, onClick }) {
  return (
    <button
      type="button" aria-pressed={active}
      onClick={onClick}
      className="peq-press"
      style={{
        padding: "16px 8px", borderRadius: 12, minWidth: 0,
        border: `2px solid ${C.navy}`,
        background: active ? C.purple : "white",
        color: active ? "white" : C.text,
        cursor: "pointer", transition: "all 0.1s ease", ...pressed(active),
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6
      }}
    >
      <div style={{ fontSize: 22 }}>{preset.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", fontFamily: MONO }}>{preset.name}</div>
      <div className="peq-preset-desc" style={{ fontSize: 10, opacity: 0.75, lineHeight: 1.4, textAlign: "center" }}>{preset.description}</div>
    </button>
  );
}

export function SectionLabel({ step, title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: C.purple, marginBottom: 6, textTransform: "uppercase" }}>{step}</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 6px 0", color: C.text }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

export function FieldLabel({ children, htmlFor }) {
  const Tag = htmlFor ? "label" : "div";
  return <Tag htmlFor={htmlFor} style={{ display: "block", fontSize: 12, fontWeight: 800, color: C.text, fontFamily: MONO, letterSpacing: "1px", marginBottom: 10, textTransform: "uppercase" }}>{children}</Tag>;
}

export function Divider() {
  return <div style={{ borderBottom: `2px dashed ${C.border}`, margin: "32px 0" }} />;
}

export function CharCounter({ count, limit, hard, dark }) {
  const ratio = count / limit;
  const color = ratio > 1 ? "#EF4444" : ratio > 0.9 ? "#F59E0B" : dark ? C.green : "#15803D";
  return (
    <span title={hard ? "Platform limit" : "Suggested length"} style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color, whiteSpace: "nowrap" }}>
      {count.toLocaleString()} / {limit.toLocaleString()}{hard ? "" : " suggested"}
    </span>
  );
}
