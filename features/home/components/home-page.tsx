import { ArrowRight } from "@phosphor-icons/react/ssr";
import { hc, PAD } from "@/shared/lib/layout";
import { R } from "@/shared/lib/rs";
import { gbp } from "@/shared/lib/format";
import { STYLES, TRAINING } from "@/shared/data/catalog";
import { VID } from "@/shared/data/media";
import { Img } from "@/shared/ui/img";
import { Logo } from "@/shared/ui/logo";
import { SectionHead } from "@/shared/ui/section-head";
import { Stars } from "@/shared/ui/stars";
import { Header } from "@/features/shell/components/header";
import { Footer } from "@/features/shell/components/footer";
import { MobileBookBar } from "@/features/shell/components/mobile-book-bar";
import { NavLink } from "@/features/shell/components/nav-link";

const REVIEWS = [
  ["My frontal survived a full week without lifting, and nobody could tell.", "Sassy", "Frontal install"],
  ["Love my hair so much, and I got so many compliments. Thanks so much!", "Ajay", "Hair By Debz client"],
  ["My bussdown was flawless — flat, sleek, and the part looked like it grew from my scalp.", "Jolade", "Bussdown"],
  ["Debz is so neat and gentle. My bussdown still looked fresh days later — I’m booking again.", "Nifemi", "Bussdown"],
] as const;

export function HomePage() {
  return (
    <div className={hc()}>
      <Header />
      <main id="main">
      <section {...R({ pad: ["72px 80px 120px", "24px 48px 56px", "24px 20px 56px"], cols: ["1fr 1fr", "1fr 1fr", "1fr"], gap: [64, 32] }, { display: "grid", alignItems: "center" })}>
        <div {...R({ gap: [36, 24], ai: ["flex-start", "center"], ta: ["left", "center"], ord: [1, 2] }, { display: "flex", flexDirection: "column" })}>
          <span className="hbd-eyebrow">Wig installs · Ponytails · Updos — <span className="v-d">Northwest London studio</span><span className="v-m">Northwest London</span></span>
          <h1 {...R({ fs: [84, 65, 46] }, { lineHeight: 1.02 })}>Hair that looks <em style={{ color: "var(--clay)" }}>born</em> that way.</h1>
          <p {...R({ fs: [19, 18, 16] }, { color: "var(--ink-soft)", maxWidth: 480 })}>Frontal installs, sleek ponytails and bridal updos. Finished so cleanly nobody will ever find the lace.</p>
          <div {...R({ jc: ["flex-start", "center"], w: ["auto", "100%"], dir: ["row", "column"] }, { display: "flex", gap: 12, flexWrap: "wrap" })}>
            <NavLink href="/book" className="hbd-btn lg">Book now</NavLink>
            <NavLink href="/services" className="hbd-btn ghost">See prices</NavLink>
          </div>
          <p className="hbd-note">Prices upfront · 20% deposit online to confirm · balance in cash on the day</p>
        </div>
        <div {...R({ ord: [2, 1] }, { position: "relative" })}>
          <Img k="curlsLong" priority h={[640, 600, 440]} r={[240, 200, 20]} style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} />
          <div {...R({ lt: [-48, -8], bt: [48, -24], w: [150, 100], h: [150, 100] }, { position: "absolute", borderRadius: "50%", background: "var(--brown)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(78,54,38,.3)" })}>
            <Logo kind="tertiary" h={[132, 132, 86]} color="var(--cream)" />
          </div>
        </div>
      </section>

      <section {...R({ pad: PAD }, { background: "var(--cream-2)" })}>
        <div {...R({ mb: [56, 32] }, { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" })}>
          <SectionHead eyebrow="Featured styles" title="Most-booked this season" />
          <NavLink href="/gallery" className="hbd-btn ghost sm v-d">Full gallery</NavLink>
        </div>
        <div {...R({ disp: ["grid", "flex"], gap: [24, 16], ox: ["visible", "auto"], mar: [0, "0 -20px"], pad: [0, "0 48px", "0 20px"] }, { gridTemplateColumns: "repeat(4,1fr)" })}>
          {STYLES.filter((s) => s.featured && s.imgs).map((s) => (
            <article key={s.id} {...R({ sz: [0, 220] }, { display: "flex", flexDirection: "column", gap: 12 })}>
              <Img k={s.imgs![0]} alt={s.name} ratio="3/4" sizes="(max-width: 1100px) 60vw, 22vw" />
              <h3 style={{ fontSize: 20 }}>{s.name}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--ink-soft)" }}>
                <span>{s.price == null ? "Price on request" : "from " + gbp(s.price)}</span>
                <span>{s.price == null ? "" : s.time}</span>
              </div>
              <NavLink href={`/book?style=${s.id}`} style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", minHeight: 44, display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                Book this style <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </NavLink>
            </article>
          ))}
        </div>
      </section>

      <section {...R({ pad: PAD, cols: ["5fr 6fr", "5fr 6fr", "1fr"], gap: [96, 32] }, { display: "grid", alignItems: "center" })}>
        <Img k="salonB" ratio="4/5" r={20} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <SectionHead eyebrow="Meet Debz" title="Ten years of hairlines nobody can find." />
          <p style={{ color: "var(--ink-soft)" }}>Debz started doing hair while still in school, juggling clients and classes side by side. She later moved to Lagos, where she built a loyal clientele and opened her own studio, and now brings that same finish to Northwest London. Every styling and installation is done by hand and tailored to you, so it looks flawless up close, not just in photos.</p>
          <div {...R({ gap: [48, 24] }, { display: "flex" })}>
            {[["10+", "years"], ["3k+", "installs"], ["200+", "students"]].map(([n, l]) => (
              <div key={l}>
                <div {...R({ fs: [44, 38, 32] }, { fontFamily: "var(--serif)", color: "var(--brown)" })}>{n}</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)", letterSpacing: ".1em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section {...R({ pad: PAD, cols: ["1fr 1fr", "1fr 1fr", "1fr"], gap: [80, 32] }, { background: "var(--brown)", display: "grid", alignItems: "center" })}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <SectionHead light eyebrow="The Academy" title="Learn the finish. Build the business." sub="A 2-week class, a beginner programme and one-to-one master classes." />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {TRAINING.map((p) => <span key={p.id} className="hbd-chip" style={{ background: "transparent", color: "var(--cream)", borderColor: "rgba(255,254,233,.5)" }}>{p.tag}</span>)}
          </div>
          <NavLink href="/training" className="hbd-btn light" style={{ alignSelf: "flex-start" }}>View programmes</NavLink>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Img src={VID["train-cert"].poster} alt="Hair By Debz students holding their certificates" ratio="3/4" r={20} />
          <Img src={VID["train-install"].poster} alt="A student doing her first install" ratio="3/4" r={20} style={{ marginTop: 40 }} />
        </div>
      </section>

      <section {...R({ pad: PAD })}>
        <SectionHead center eyebrow="Client words" title="What they say after the mirror" />
        <div {...R({ cols: ["repeat(4,1fr)", "repeat(2,minmax(0,1fr))", "1fr"], mt: [56, 32] }, { display: "grid", gap: 24 })}>
          {REVIEWS.map(([q, n, st]) => (
            <figure key={n} className="hbd-card" style={{ margin: 0, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
              <Stars />
              <blockquote style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.4, color: "var(--brown)", flex: 1 }}>“{q}”</blockquote>
              <figcaption style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 14, color: "var(--ink-soft)" }}>
                <strong style={{ color: "var(--ink)" }}>{n}</strong>{st}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      </main>
      <Footer />
      <MobileBookBar />
    </div>
  );
}
