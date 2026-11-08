"use client";

import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { R } from "@/shared/lib/rs";
import { fmtDate } from "../lib/dates";

export function BookingCalendar({ value, onPick, today }: { value: Date | null; onPick: (d: Date) => void; today: Date | null }) {
  const [mo, setMo] = useState(0);
  if (!today)
    return <div {...R({ pad: [28, 28, 16] }, { minHeight: 320 }, "hbd-card")} aria-busy="true" />;
  const first = new Date(today.getFullYear(), today.getMonth() + mo, 1);
  const n = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  return (
    <div {...R({ pad: [28, 28, 16] }, {}, "hbd-card")}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button type="button" className="hbd-chip" aria-label="Previous month" disabled={mo === 0} onClick={() => setMo(mo - 1)} style={{ cursor: mo ? "pointer" : "not-allowed", opacity: mo ? 1 : 0.35, borderStyle: mo ? "solid" : "dashed" }}><CaretLeft size={16} weight="bold" aria-hidden="true" /></button>
        <span key={mo} style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--brown)", animation: "pFade .35s" }}>{first.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
        <button type="button" className="hbd-chip" aria-label="Next month" disabled={mo === 1} onClick={() => setMo(mo + 1)} style={{ cursor: mo < 1 ? "pointer" : "not-allowed", opacity: mo < 1 ? 1 : 0.35, borderStyle: mo < 1 ? "solid" : "dashed" }}><CaretRight size={16} weight="bold" aria-hidden="true" /></button>
      </div>
      <div role="grid" key={"g" + mo} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, textAlign: "center", animation: "pFade .35s" }}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} style={{ fontSize: 12, color: "var(--ink-soft)", padding: 6 }}><span className="v-nop">{d}</span><span className="v-p">{d.slice(0, 2)}</span></div>)}
        {Array.from({ length: lead }).map((_, i) => <div key={"b" + i} />)}
        {Array.from({ length: n }, (_, i) => new Date(first.getFullYear(), first.getMonth(), i + 1)).map((d) => {
          const past = d < today;
          const on = !!value && d.toDateString() === value.toDateString();
          return (
            <button type="button" key={d.getDate()} disabled={past} aria-pressed={on} aria-label={fmtDate(d) + (past ? ", unavailable" : "")} onClick={() => onPick(d)} className="pb-day" style={{ minHeight: 44, borderRadius: 12, fontSize: 15, font: "inherit", cursor: past ? "not-allowed" : "pointer", background: on ? "var(--brown)" : past ? "repeating-linear-gradient(135deg, transparent 0 5px, rgba(92,74,61,.09) 5px 6px)" : "#fff", color: on ? "var(--cream)" : past ? "var(--ink-soft)" : "var(--ink)", textDecoration: past ? "line-through" : "none", border: on ? "1px solid var(--brown)" : past ? "1px solid transparent" : "1px solid var(--line)", fontWeight: on ? 600 : 400 }}>{d.getDate()}</button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 16, fontSize: 13, color: "var(--ink-soft)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 22, height: 22, borderRadius: 6, border: "1px solid var(--line)", background: "#fff" }} />Open · Mon–Sun</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 22, height: 22, borderRadius: 6, background: "repeating-linear-gradient(135deg, transparent 0 5px, rgba(92,74,61,.2) 5px 6px)", fontSize: 12, textDecoration: "line-through", display: "flex", alignItems: "center", justifyContent: "center" }}>1</span>Past</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 22, height: 22, borderRadius: 6, background: "var(--brown)" }} />Preferred</span>
      </div>
    </div>
  );
}
