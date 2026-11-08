"use client";

import { R } from "@/shared/lib/rs";
import { fmtDate, timesFor } from "../lib/dates";

export interface AltValue {
  d: string;
  t: string;
}

export function BookingAlt({ v, set, err, days }: { v: AltValue; set: (v: AltValue) => void; err?: string | null; days: Date[] }) {
  return (
    <div {...R({ pad: [20, 20, 16], cols: ["140px 1fr 1fr", "140px 1fr 1fr", "1fr 1fr"] }, { display: "grid", gap: 12, alignItems: "end", border: err ? "2px solid var(--error)" : undefined }, "hbd-card")}>
      <div {...R({ gc: ["auto", "auto", "span 2"] }, { fontWeight: 600, color: "var(--brown)", alignSelf: "center" })}>Alternative <span style={{ fontWeight: 400 }}>(optional)</span></div>
      <div>
        <label className="hbd-label" htmlFor={"alt-d"}>Date</label>
        <select id={"alt-d"} className="hbd-input" value={v.d} onChange={(e) => { const d = e.target.value; set({ d, t: d && v.t && !timesFor(new Date(d)).includes(v.t) ? "" : v.t }); }}>
          <option value="">Choose…</option>
          {days.map((d) => <option key={+d} value={d.toDateString()}>{fmtDate(d)}</option>)}
        </select>
      </div>
      <div>
        <label className="hbd-label" htmlFor={"alt-t"}>Time</label>
        <select id={"alt-t"} className="hbd-input" value={v.t} onChange={(e) => set({ ...v, t: e.target.value })}>
          <option value="">Choose…</option>
          {timesFor(v.d ? new Date(v.d) : null).map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
    </div>
  );
}
