"use client";

import React, { useRef, useState } from "react";
import { C, MONO } from "./primitives";

const STEPS = 5;
const TRACK_H = 150;
const THUMB_H = 26;

const buzz = () => { try { navigator.vibrate?.(8); } catch { /* unsupported */ } };

function Fader({ config, value, onChange, motorDelay }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const pct = (value - 1) / (STEPS - 1);

  const set = (v) => {
    const next = Math.min(STEPS, Math.max(1, v));
    if (next !== value) { buzz(); onChange(config.key, next); }
  };

  const valueFromPointer = (e) => {
    const r = trackRef.current.getBoundingClientRect();
    const ratio = 1 - (e.clientY - r.top) / r.height;
    return Math.round(Math.min(1, Math.max(0, ratio)) * (STEPS - 1)) + 1;
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus();
    setDragging(true);
    set(valueFromPointer(e));
  };
  const onPointerMove = (e) => { if (dragging) set(valueFromPointer(e)); };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e) => {
    const map = { ArrowUp: value + 1, ArrowRight: value + 1, ArrowDown: value - 1, ArrowLeft: value - 1, Home: 1, End: STEPS, PageUp: STEPS, PageDown: 1 };
    if (e.key in map) { e.preventDefault(); set(map[e.key]); }
  };

  const levelLabel = config.levels[value - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
      <div className="peq-fader-label" style={{ fontFamily: MONO, fontSize: 10, fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase", color: C.text, textAlign: "center", minHeight: 26, lineHeight: 1.2 }}>
        {config.label}
      </div>
      <div
        ref={trackRef}
        role="slider" tabIndex={0}
        aria-label={config.label} aria-orientation="vertical"
        aria-valuemin={1} aria-valuemax={STEPS} aria-valuenow={value} aria-valuetext={levelLabel}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="peq-fader"
        style={{ position: "relative", width: 48, height: TRACK_H + THUMB_H, margin: "8px 0", cursor: dragging ? "grabbing" : "grab", touchAction: "none", borderRadius: 8 }}
      >
        {/* notches */}
        {Array.from({ length: STEPS }, (_, i) => (
          <div key={i} style={{
            position: "absolute", left: 6, right: 6, height: 2,
            bottom: THUMB_H / 2 + (i / (STEPS - 1)) * TRACK_H - 1,
            background: i + 1 <= value ? C.purple : C.border, opacity: i + 1 <= value ? 0.5 : 1
          }} />
        ))}
        {/* slot */}
        <div style={{ position: "absolute", left: "50%", top: THUMB_H / 2, bottom: THUMB_H / 2, width: 6, marginLeft: -3, background: "white", border: `2px solid ${C.navy}`, borderRadius: 4 }} />
        <div className="peq-anim" style={{
          position: "absolute", left: "50%", bottom: THUMB_H / 2, width: 6, marginLeft: -3,
          height: pct * TRACK_H, background: C.navy, borderRadius: 4,
          transition: dragging ? "height 90ms ease-out" : `height 420ms cubic-bezier(0.3, 1.2, 0.5, 1) ${motorDelay}ms`
        }} />
        {/* cap */}
        <div className="peq-anim" style={{
          position: "absolute", left: 2, right: 2, height: THUMB_H,
          bottom: pct * TRACK_H,
          background: C.purple, border: `2px solid ${C.navy}`, borderRadius: 6,
          boxShadow: dragging ? "none" : "2px 2px 0 0 rgba(0,0,0,1)",
          transition: dragging ? "bottom 90ms ease-out" : `bottom 420ms cubic-bezier(0.3, 1.2, 0.5, 1) ${motorDelay}ms`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ width: 22, height: 2, background: "white", borderRadius: 1 }} />
        </div>
      </div>
      <div aria-hidden="true" style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: "white", background: C.navy, borderRadius: 4, padding: "3px 6px", textAlign: "center", lineHeight: 1.2, maxWidth: "100%" }}>
        {levelLabel}
      </div>
    </div>
  );
}

// motor=true staggers the faders so a preset change sweeps across the strip like a motorized desk.
export function FaderStrip({ sliders, settings, onChange, motor }) {
  const groups = [...new Set(sliders.map(s => s.category))];
  return (
    <div className="peq-fader-strip" style={{ display: "grid", gridTemplateColumns: `repeat(${sliders.length}, minmax(0, 1fr))`, columnGap: 4, background: "white", border: `2px solid ${C.navy}`, borderRadius: 16, padding: "12px 6px 14px", boxShadow: "2px 2px 0 0 rgba(0,0,0,1)" }}>
      {groups.map(g => {
        const n = sliders.filter(s => s.category === g).length;
        return (
          <div key={g} style={{ gridColumn: `span ${n}`, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: "2px", color: C.purple, textTransform: "uppercase", textAlign: "center", borderBottom: `1px solid ${C.border}`, paddingBottom: 6, marginBottom: 10, marginInline: 6 }}>
            {g}
          </div>
        );
      })}
      {sliders.map((s, i) => (
        <Fader key={s.key} config={s} value={settings[s.key]} onChange={onChange} motorDelay={motor ? i * 60 : 0} />
      ))}
    </div>
  );
}
