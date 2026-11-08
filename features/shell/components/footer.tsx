import { Logo } from "@/shared/ui/logo";
import { HBD_AREA, HBD_EMAIL, NAV } from "@/shared/data/site";
import { R } from "@/shared/lib/rs";
import { NavLink } from "./nav-link";
import { SocialLinks } from "./social-links";

export function Footer() {
  return (
    <footer {...R({ pad: ["80px 80px 40px", "56px 24px 32px"] }, { background: "var(--brown)", color: "var(--cream-2)" })}>
      <div {...R({ cols: ["220px 1fr 1fr 1fr", "repeat(2,minmax(0,1fr))", "1fr"], gap: [56, 40] }, { display: "grid", alignItems: "start" })}>
        <div {...R({ jc: ["flex-start", "flex-start", "center"] }, { display: "flex" })}><Logo kind="tertiary" h={[180, 140]} color="var(--cream)" /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="hbd-eyebrow" style={{ color: "var(--clay-soft)" }}>Visit</span>
          <p>By appointment only<br />{HBD_AREA}</p>
          <p>Monday – Sunday, 10AM – 7PM<br />Wed 4:30PM – 9PM · Fri 7PM – 10PM</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="hbd-eyebrow" style={{ color: "var(--clay-soft)" }}>Explore</span>
          {NAV.slice(1).map(([href, l]) => (
            <NavLink key={href} href={href} style={{ color: "var(--cream)", textDecoration: "none", minHeight: 32 }}>{l}</NavLink>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span className="hbd-eyebrow" style={{ color: "var(--clay-soft)" }}>Book & enquire</span>
          <p>All bookings and questions go through the booking form. Debz replies from <a href={`mailto:${HBD_EMAIL}`} style={{ color: "var(--cream)" }}>{HBD_EMAIL}</a></p>
          <NavLink href="/book" className="hbd-btn light sm" style={{ alignSelf: "flex-start" }}>Book now</NavLink>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <SocialLinks border="1px solid rgba(255,254,233,.5)" color="var(--cream)" />
            <span style={{ fontSize: 12, color: "var(--cream-2)" }}>Portfolio only · no DMs</span>
          </div>
        </div>
      </div>
      <div {...R({ dir: ["row", "column"] }, { marginTop: 56, paddingTop: 24, borderTop: "1px solid rgba(255,254,233,.25)", display: "flex", gap: 8, justifyContent: "space-between", fontSize: 12, color: "var(--cream-2)" })}>
        <span>© 2026 Hair By Debz · The art of a flawless finish</span>
        <span>All prices are already discounted</span>
      </div>
    </footer>
  );
}
