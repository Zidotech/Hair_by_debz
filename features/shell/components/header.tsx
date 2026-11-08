"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/shared/ui/logo";
import { NAV } from "@/shared/data/site";
import { R } from "@/shared/lib/rs";
import { useShell } from "../shell-context";
import { NavLink } from "./nav-link";

/** Phone + tablet header (menu button). Shown below 1100px; used on its own inside the menu overlay. */
export function MobileHeader({ open }: { open?: boolean }) {
  const { openMenu, closeMenu } = useShell();
  return (
      <header {...R({ pad: ["12px 20px", "14px 48px", "12px 20px"] }, { position: "sticky", top: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--cream)", borderBottom: "1px solid var(--line)" }, open ? "" : "v-m")}>
        <NavLink href="/" aria-label="Hair By Debz — home" style={{ display: "flex" }}>
          <Logo kind="secondary" h={[36, 36, 30]} />
        </NavLink>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={!!open}
          onClick={open ? closeMenu : openMenu}
          style={{ minHeight: 44, minWidth: 44, padding: "0 4px 0 12px", border: "1px solid var(--line)", borderRadius: 999, background: open ? "var(--brown)" : "#fff", color: open ? "var(--cream)" : "var(--brown)", display: "flex", alignItems: "center", gap: 10, font: "600 12px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer" }}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true" style={{ width: 36, height: 36, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5 }}>
            {open ? (
              <>
                <span style={{ position: "absolute", width: 18, height: 1.5, background: "currentColor", transform: "rotate(45deg)" }} />
                <span style={{ position: "absolute", width: 18, height: 1.5, background: "currentColor", transform: "rotate(-45deg)" }} />
              </>
            ) : (
              <>
                <span style={{ width: 18, height: 1.5, background: "currentColor" }} />
                <span style={{ width: 18, height: 1.5, background: "currentColor" }} />
                <span style={{ width: 18, height: 1.5, background: "currentColor" }} />
              </>
            )}
          </span>
        </button>
      </header>
  );
}

/** Desktop header (inline nav). Shown from 1100px up. */
function DesktopHeader() {
  const current = usePathname();
  return (
    <header className="v-d" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 80px", borderBottom: "1px solid var(--line)", background: "var(--cream)" }}>
      <NavLink href="/" aria-label="Hair By Debz — home" style={{ display: "flex" }}>
        <Logo kind="secondary" h={44} />
      </NavLink>
      <nav aria-label="Main" style={{ display: "flex", gap: 36 }}>
        {NAV.map(([href, l]) => (
          <NavLink key={href} href={href} aria-current={current === href ? "page" : undefined} style={{ fontSize: 13, fontWeight: current === href ? 600 : 500, letterSpacing: ".04em", textDecoration: "none", color: current === href ? "var(--brown)" : "var(--ink-soft)", borderBottom: current === href ? "1.5px solid var(--clay)" : "1.5px solid transparent", paddingBottom: 4 }}>
            {l}
          </NavLink>
        ))}
      </nav>
      <NavLink href="/book" className="hbd-btn sm">Book now</NavLink>
    </header>
  );
}

export function Header() {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
}
