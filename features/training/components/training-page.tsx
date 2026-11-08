"use client";

import Image from "next/image";
import { hc, PAD } from "@/shared/lib/layout";
import { R } from "@/shared/lib/rs";
import { gbp } from "@/shared/lib/format";
import { TRAINING } from "@/shared/data/catalog";
import { HBD_DEPOSIT } from "@/shared/data/site";
import { IMG } from "@/shared/data/media";
import { SectionHead } from "@/shared/ui/section-head";
import { VideoTile } from "@/shared/ui/video-tile";
import { Header } from "@/features/shell/components/header";
import { Footer } from "@/features/shell/components/footer";
import { MobileBookBar } from "@/features/shell/components/mobile-book-bar";
import { NavLink } from "@/features/shell/components/nav-link";
import { useShell } from "@/features/shell/shell-context";
import { APPLY_TOAST, scrollToForm } from "@/features/about/lib/scroll-to-form";

const STEPS = [
  ["01", "Apply through the form", "Pick a programme and preferred start month."],
  ["02", "Debz confirms by email", "She replies with your deposit link. Your seat is secured once it’s paid."],
  ["03", "Get your kit list", "Sent to your email a week before you start."],
] as const;

export function TrainingPage() {
  const { toast } = useShell();
  const apply = () => toast(APPLY_TOAST);
  return (
    <div className={hc()}>
      <Header />
      <main id="main">
      <section {...R({ minh: [520, 420], pad: ["64px 80px", "32px 48px", "32px 20px"] }, { position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" })}>
        <Image src={IMG.salonA} alt="Hair By Debz studio interior" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(43,30,22,.15), rgba(43,30,22,.82))" }} />
        <div style={{ maxWidth: 640, position: "relative" }}>
          <SectionHead light eyebrow="Hair By Debz Academy" title="Train in a working studio, not a classroom." sub="Small classes of six. Real clients from week three." />
        </div>
      </section>

      <section {...R({ pad: PAD, cols: ["repeat(3,1fr)", "repeat(2,minmax(0,1fr))", "1fr"] }, { display: "grid", gap: 20 })}>
        {TRAINING.map((p) => (
          <article key={p.id} className="hbd-card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16, background: p.featured ? "var(--brown)" : "#fff", color: p.featured ? "var(--cream)" : undefined, borderColor: p.featured ? "var(--brown)" : undefined }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="hbd-tag">{p.tag}</span>
              {p.featured && <span style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--clay-soft)" }}>Most chosen</span>}
            </div>
            <h3 style={{ fontSize: 26, color: p.featured ? "var(--cream)" : undefined }}>{p.name}</h3>
            <div style={{ fontFamily: "var(--serif)", fontSize: p.price == null ? 26 : 32, lineHeight: 1.25, color: p.featured ? "var(--cream)" : "var(--brown)" }}>{p.price == null ? "Enquire for price" : gbp(p.price)}</div>
            <ul {...R({ fs: [14, 15, 16] }, { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, flex: 1 })}>
              {p.pts.map((pt) => (
                <li key={pt} style={{ display: "flex", gap: 10 }}>
                  <span aria-hidden="true" style={{ color: p.featured ? "var(--clay-soft)" : "var(--clay-text)" }}>—</span>{pt}
                </li>
              ))}
            </ul>
            <div style={{ fontSize: 13 }}>{p.price == null ? "Send an enquiry — Debz replies by email with price and dates" : "Deposit " + gbp(p.price * HBD_DEPOSIT)}</div>
            <NavLink href={`/about?topic=training&programme=${p.id}`} then={scrollToForm} onClick={apply} className={"hbd-btn sm " + (p.featured ? "light" : "ghost")}>{p.price == null ? "Send an enquiry" : "Apply for a seat"}</NavLink>
          </article>
        ))}
      </section>

      <section {...R({ pad: ["0 80px 120px", "0 48px 64px", "0 20px 64px"], cols: ["1fr 1fr", "1fr 1fr", "1fr"], gap: [80, 32] }, { display: "grid", alignItems: "center" })}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <VideoTile v="train-install" name="A student’s first install" style={{ aspectRatio: "9/16" }} />
          <VideoTile v="train-cert" name="Students with their certificates" style={{ aspectRatio: "9/16" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionHead eyebrow="How it works" title="Apply, confirm, start." />
          {STEPS.map(([n, title, d]) => (
            <div key={n} style={{ display: "flex", gap: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--clay-text)" }}>{n}</span>
              <div><div style={{ fontWeight: 600 }}>{title}</div><p style={{ fontSize: 15, color: "var(--ink-soft)" }}>{d}</p></div>
            </div>
          ))}
        </div>
      </section>
      </main>
      <Footer />
      <MobileBookBar label="Apply now" href="/about?topic=training" then={scrollToForm} onActivate={apply} />
    </div>
  );
}
