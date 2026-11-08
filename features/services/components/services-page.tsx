import { hc } from "@/shared/lib/layout";
import { R } from "@/shared/lib/rs";
import { gbp } from "@/shared/lib/format";
import { BOOKING_TYPES, LATE, POLICY, SERVICES } from "@/shared/data/catalog";
import { Logo } from "@/shared/ui/logo";
import { SectionHead } from "@/shared/ui/section-head";
import { Header } from "@/features/shell/components/header";
import { FaqSection } from "@/features/faq/components/faq-section";
import { Footer } from "@/features/shell/components/footer";
import { MobileBookBar } from "@/features/shell/components/mobile-book-bar";
import { NavLink } from "@/features/shell/components/nav-link";

export function ServicesPage() {
  return (
    <div className={hc()}>
      <Header />
      <main id="main">
      <section {...R({ pad: ["96px 80px 56px", "48px 48px 32px", "48px 20px 32px"] }, { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap" })}>
        <SectionHead eyebrow="Services & prices" title="Every service. Every price. Upfront." sub="A 20% payment confirms and validates your booking." />
        <div className="hbd-card" style={{ padding: 24, display: "flex", gap: 16, alignItems: "center", maxWidth: 380 }}>
          <Logo kind="icon" h={44} color="var(--clay)" />
          <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>Prices are from Debz’s current price list.</p>
        </div>
      </section>

      <section {...R({ pad: ["0 80px 96px", "0 48px 64px", "0 20px 64px"] })}>
        <div {...R({ pad: [48, 32, 20] }, { background: "var(--cream-2)", borderRadius: 24, maxWidth: 960, margin: "0 auto" })}>
          <h2 style={{ textAlign: "center", fontSize: 40, marginBottom: 24 }}>Price list</h2>
          {SERVICES.filter((x) => x.list !== false).map((x) => {
            const l = x.list || {};
            const sub = l.sub ?? (x.price == null ? "Quoted by email" : x.time);
            return (
              <div key={x.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: "4px 20px", padding: "16px 0", borderTop: "1px solid var(--line)", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>{l.name ?? x.name}{sub && <span style={{ display: "block", fontSize: 13, color: "var(--ink-soft)", fontWeight: 400, marginTop: 2 }}>{sub}</span>}</span>
                <span style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--brown)", whiteSpace: "nowrap" }}>{l.priceText ?? gbp(x.price)}</span>
                <NavLink href={`/book?style=${x.id}`} aria-label={"Book " + (l.name ?? x.name)} style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>Book</NavLink>
              </div>
            );
          })}
          <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Logo kind="icon" h={28} color="var(--clay)" />
            <p style={{ fontSize: 15, color: "var(--ink-soft)" }}><strong style={{ color: "var(--brown)" }}>Want a style that isn’t listed?</strong> Any other style is priced separately and may cost extra, depending on your hair condition, how long it takes and the detail involved. Mention it in the notes when you book and Debz will confirm the price by email.</p>
          </div>
          <p className="hbd-note" style={{ paddingTop: 16, borderTop: "1px solid var(--line)" }}>Styling doesn’t include installation. Natural hair attracts an extra charge depending on length and fullness.</p>
        </div>
      </section>

      <section {...R({ pad: ["0 80px 64px", "0 48px 48px", "0 20px 48px"] }, { display: "flex", flexDirection: "column", gap: 24 })}>
        <h3 {...R({ fs: [32, 29, 26] })}>Booking types</h3>
        <div {...R({ cols: ["repeat(3,1fr)", "repeat(2,minmax(0,1fr))", "1fr"] }, { display: "grid", gap: 16 })}>
          {BOOKING_TYPES.map((b, i) => (
            <div key={b.id} className="hbd-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8, background: i ? "var(--brown)" : "#fff", borderColor: i ? "var(--brown)" : undefined, color: i ? "var(--cream)" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <h3 style={{ fontSize: 22, color: i ? "var(--cream)" : undefined }}>{b.name}</h3>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{b.fee}</span>
              </div>
              <p style={{ fontSize: 15, color: i ? "var(--cream-2)" : "var(--ink-soft)" }}>{b.d}</p>
            </div>
          ))}
        </div>
        <p className="hbd-note">Same-day bookings add £20 and emergency bookings add £40 to the standard price.</p>
      </section>

      <section id="policy" {...R({ pad: ["0 80px 120px", "0 48px 64px", "0 20px 64px"] }, { scrollMarginTop: 90 })}>
        <div {...R({ pad: [48, 24] }, { background: "var(--cream-2)", borderRadius: 24, display: "flex", flexDirection: "column", gap: 32 })}>
          <SectionHead eyebrow="Booking policy" title="Please read before payment" />
          <div {...R({ cols: ["repeat(4,1fr)", "repeat(2,minmax(0,1fr))", "1fr"], gap: [32, 24] }, { display: "grid" })}>
            <div {...R({ gr: ["span 2", "auto"] }, { padding: 20, display: "flex", flexDirection: "column", gap: 12 }, "hbd-card")}>
              <h3 style={{ fontSize: 20 }}>Lateness</h3>
              {LATE.map(([a, b]) => (
                <div key={a} style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                  <span>{a}</span><strong style={{ color: "var(--brown)" }}>{b}</strong>
                </div>
              ))}
                          </div>
            {POLICY.map(([title, d]) => (
              <div key={title}>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>{title}</h3>
                <p {...R({ fs: [15, 16] }, { color: "var(--ink-soft)" })}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FaqSection />
      </main>
      <Footer />
      <MobileBookBar />
    </div>
  );
}
