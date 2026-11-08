"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hc } from "@/shared/lib/layout";
import { R } from "@/shared/lib/rs";
import { gbp } from "@/shared/lib/format";
import { STYLES } from "@/shared/data/catalog";
import { HBD_DEPOSIT, HBD_RESPONSE } from "@/shared/data/site";
import { Header } from "@/features/shell/components/header";
import { Footer } from "@/features/shell/components/footer";
import { NavLink } from "@/features/shell/components/nav-link";
import { fmtDate } from "../lib/dates";
import { useBooking } from "../lib/booking-store";

export function ConfirmPage() {
  const router = useRouter();
  const b = useBooking();

  // No request in this session (e.g. the URL was opened directly): back to home, as in the prototype
  useEffect(() => {
    if (b === null) router.replace("/");
  }, [b, router]);
  if (!b) return null;

  const st = STYLES.find((x) => x.id === b.styleId);
  const dep = st && st.price != null ? gbp(st.price * HBD_DEPOSIT) + " (20%, paid online)" : "Quoted by email";
  const first = b.name.trim().split(" ")[0] || "lovely";
  return (
    <div className={hc()}>
      <Header />
      <main id="main">
      <section {...R({ pad: ["96px 80px 120px", "64px 48px", "48px 20px 64px"] }, { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24 })}>
        <div className="pc-check" aria-hidden="true">
          <svg viewBox="0 0 52 52" width="76" height="76"><circle cx="26" cy="26" r="24" fill="none" stroke="var(--brown)" strokeWidth="2" /><path d="M15 27l7 7 15-16" fill="none" stroke="var(--brown)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <span className="hbd-tag" style={{ background: "var(--brown)", color: "var(--cream)", animation: "pUp .5s .3s both" }}>✓ Request received</span>
        <h1 {...R({ fs: [56, 36] }, { lineHeight: 1.1, animation: "pUp .6s .4s both" })}>Request received, {first}.</h1>
        <p style={{ color: "var(--ink-soft)", maxWidth: 540, animation: "pUp .6s .5s both" }}>Debz has your request and notes in her inbox. A copy is on its way to <strong>{b.email}</strong>. Your slot isn’t confirmed yet.</p>
        <div {...R({ pad: [32, 20] }, { width: "100%", maxWidth: 580, textAlign: "left", display: "flex", flexDirection: "column", gap: 14, animation: "pUp .6s .6s both" }, "hbd-card")}>
          {[["Booking ref", b.ref], ["Style", st?.name], ["Preferred date and time", fmtDate(new Date(b.date)) + " · " + b.time], ["Deposit due after confirmation", dep]].map(([k, v], i) => (
            <div key={k} {...R({ dir: ["row", "row", "column"], gap: [16, 2], fs: [15, 16] }, { display: "flex", justifyContent: "space-between", paddingTop: i ? 14 : 0, borderTop: i ? "1px solid var(--line)" : "none" })}>
              <span style={{ color: "var(--ink-soft)" }}>{k}</span>
              <span {...R({ ta: ["right", "right", "left"] }, { fontWeight: 600 })}>{v}</span>
            </div>
          ))}
        </div>
        <div {...R({ pad: [32, 20] }, { width: "100%", maxWidth: 580, textAlign: "left", display: "flex", flexDirection: "column", gap: 16, borderRadius: 20, background: "var(--cream-2)", animation: "pUp .6s .7s both" })}>
          <span className="hbd-eyebrow">What happens next</span>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
            {["Debz reads your request.", "She emails you to confirm a time and send your online deposit link.", "Your slot is confirmed once the 20% deposit is paid. The balance is paid in cash on the day."].map((x, i) => (
              <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", fontSize: 16, animation: `pUp .5s ${0.85 + i * 0.12}s both` }}>
                <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--brown)", color: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ paddingTop: 3 }}>{x}</span>
              </li>
            ))}
          </ol>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", paddingTop: 12, borderTop: "1px solid var(--line)" }}>Usual response time: <strong>{HBD_RESPONSE}</strong></p>
        </div>
        <NavLink href="/" {...R({ w: ["auto", "auto", "100%"] }, {}, "hbd-btn ghost")}>Back to home</NavLink>
        <p className="hbd-note">Need to change something? Reply to the email with your booking ref.</p>
      </section>
      </main>
      <Footer />
    </div>
  );
}
