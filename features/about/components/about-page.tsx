import { Suspense } from "react";
import { hc } from "@/shared/lib/layout";
import { R } from "@/shared/lib/rs";
import { HBD_AREA, HBD_EMAIL, HBD_RESPONSE } from "@/shared/data/site";
import { Img } from "@/shared/ui/img";
import { Logo } from "@/shared/ui/logo";
import { SectionHead } from "@/shared/ui/section-head";
import { Header } from "@/features/shell/components/header";
import { Footer } from "@/features/shell/components/footer";
import { MobileBookBar } from "@/features/shell/components/mobile-book-bar";
import { ContactForm } from "./contact-form";

export function AboutPage() {
  return (
    <div className={hc()}>
      <Header />
      <main id="main">
      <section {...R({ pad: ["96px 80px 120px", "48px 48px 64px", "48px 20px 64px"], cols: ["1fr 1fr", "1fr 1fr", "1fr"], gap: [96, 32] }, { display: "grid", alignItems: "center" })}>
        <div style={{ position: "relative" }}>
          <Img k="sign" ratio="4/3" r={20} />
          <Img k="salonC" ratio="1/1" r={16} sizes="20vw" rsp={{ rt: [-40, -8], bt: [-48, -24] }} style={{ position: "absolute", width: "42%", border: "6px solid var(--cream)" }} />
        </div>
        <div {...R({ mt: [0, 24] }, { display: "flex", flexDirection: "column", gap: 24 })}>
          <SectionHead eyebrow="About Debz" title="Precision first. Then the glam." />
          <p style={{ color: "var(--ink-soft)" }}>Hair By Debz is a private, appointment-only studio. One client at a time, no rushing, no double-booking. Debz trained in Lagos and London and has taught over 200 stylists through the Academy.</p>
          <p style={{ color: "var(--ink-soft)" }}>Her rule: if the lace shows in daylight, it isn’t finished.</p>
        </div>
      </section>
      <section {...R({ pad: ["0 80px 120px", "0 48px 64px", "0 20px 64px"] })}>
        <div {...R({ pad: [72, "40px 48px", "40px 20px"], cols: ["5fr 6fr", "5fr 6fr", "1fr"], gap: [72, 32] }, { background: "var(--brown)", borderRadius: 28, display: "grid" })}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <SectionHead light eyebrow="Contact" title="One inbox. Every answer." sub={"Debz doesn’t take bookings or enquiries by Instagram or WhatsApp. Use this form — it lands in her email and she replies by email (" + HBD_RESPONSE + ")."} />
            <div {...R({ fs: [14, 15, 16] }, { display: "flex", flexDirection: "column", gap: 12, color: "var(--cream-2)" })}>
              <div>Studio · {HBD_AREA}, by appointment</div>
              <div>Days · Monday – Sunday, 10AM – 7PM (Wed 4:30PM – 9PM, Fri 7PM – 10PM)</div>
              <div>Email · {HBD_EMAIL}</div>
            </div>
            <Logo kind="tertiary" h={150} color="var(--cream)" className="v-d" style={{ marginTop: 16, opacity: 0.9 }} />
          </div>
          <Suspense fallback={null}><ContactForm /></Suspense>
        </div>
      </section>
      </main>
      <Footer />
      <MobileBookBar />
    </div>
  );
}
