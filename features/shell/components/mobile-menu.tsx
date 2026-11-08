"use client";

import { usePathname } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { HBD_AREA, NAV } from "@/shared/data/site";
import { R } from "@/shared/lib/rs";
import { MobileHeader } from "./header";
import { NavLink } from "./nav-link";
import { SocialLinks } from "./social-links";

export function MobileMenu() {
  const current = usePathname();
  return (
    <div className="hbd m" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <MobileHeader open />
      <nav aria-label="Main" {...R({ pad: ["40px 48px", "40px 48px", "24px 20px"] }, { display: "flex", flexDirection: "column" })}>
        {NAV.map(([href, l]) => (
          <NavLink key={href} href={href} aria-current={href === current ? "page" : undefined} {...R({ fs: [40, 40, 30] }, { minHeight: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--line)", fontFamily: "var(--serif)", textDecoration: "none", color: "var(--brown)" })}>
            {l}
            {href === current ? <span className="hbd-tag">You’re here</span> : <ArrowRight size={22} aria-hidden="true" style={{ color: "var(--clay-text)" }} />}
          </NavLink>
        ))}
      </nav>
      <div {...R({ pad: ["8px 48px 48px", "8px 48px 48px", "8px 20px 32px"] }, { display: "flex", flexDirection: "column", gap: 16, marginTop: "auto" })}>
        <NavLink href="/book" className="hbd-btn lg" style={{ width: "100%" }}>Book now</NavLink>
        <p style={{ color: "var(--ink-soft)" }}>By appointment · {HBD_AREA}</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <SocialLinks border="1px solid var(--line)" />
          <span className="hbd-note">Portfolio only · no DMs</span>
        </div>
      </div>
    </div>
  );
}
