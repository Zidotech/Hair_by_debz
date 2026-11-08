"use client";

import { gbp } from "@/shared/lib/format";
import { BOOKING_TYPES, type HairStyle } from "@/shared/data/catalog";
import { HBD_DEPOSIT } from "@/shared/data/site";
import { Img } from "@/shared/ui/img";
import { Logo } from "@/shared/ui/logo";
import { R } from "@/shared/lib/rs";
import { fmtDate } from "../lib/dates";

export function BookingSummary({ st, type, date, time }: { st?: HairStyle; type: string; date: Date | null; time: string }) {
  const dep = st && st.price != null ? st.price * HBD_DEPOSIT : null;
  const bt = BOOKING_TYPES.find((b) => b.id === type);
  return (
    <aside aria-label="Price summary" {...R({ pad: [28, 20] }, { display: "flex", flexDirection: "column", gap: 16, background: "var(--cream-2)", borderColor: "transparent" }, "hbd-card")}>
      {st ? (
        <div key={st.id} style={{ display: "flex", gap: 14, alignItems: "center", animation: "pFade .4s" }}>
          {st.imgs ? <Img k={st.imgs[0]} alt={st.name} h={64} sizes="64px" style={{ width: 52, borderRadius: 10, flexShrink: 0 }} /> : <div aria-hidden="true" style={{ width: 52, height: 64, borderRadius: 10, flexShrink: 0, background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}><Logo kind="icon" h={30} color="var(--clay)" /></div>}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", letterSpacing: ".12em", textTransform: "uppercase" }}>Your style</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--brown)" }}>{st.name}</div>
          </div>
        </div>
      ) : (
        <p style={{ color: "var(--ink-soft)" }}>Pick a style to see your price.</p>
      )}
      {(date || bt) && (
        <div style={{ fontSize: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {bt && <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span style={{ color: "var(--ink-soft)" }}>Booking type</span><span>{bt.name}</span></div>}
          {date && <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span style={{ color: "var(--ink-soft)" }}>Preferred</span><span style={{ textAlign: "right" }}>{fmtDate(date)}{time && " · " + time}</span></div>}
        </div>
      )}
      {st && (
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ink-soft)" }}>Service price</span><span>{gbp(st.price)}</span></div>
          {bt && bt.id !== "standard" && <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ink-soft)" }}>{bt.name} fee</span><span>+{gbp(bt.extra)}</span></div>}
          {dep != null && st.price != null && <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ink-soft)" }}>Balance in cash on the day</span><span>{gbp(st.price - dep)}</span></div>}
          <div style={{ paddingTop: 10, borderTop: "1px dashed var(--line)", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <span style={{ color: "var(--ink-soft)", fontWeight: 600 }}>Deposit due after Debz confirms (20%)</span>
            <span style={{ fontFamily: "var(--serif)", fontSize: 26, color: "var(--brown)" }}>{dep != null ? gbp(dep) : "Quoted"}</span>
          </div>
          <p className="hbd-note">Paid online through the link Debz emails once she confirms. The balance is paid in cash on the day.</p>
        </div>
      )}
    </aside>
  );
}
