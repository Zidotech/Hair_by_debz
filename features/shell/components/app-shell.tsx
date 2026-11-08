"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShellContext, type ShellCtx } from "../shell-context";
import { useReveal } from "../lib/use-reveal";
import { MobileMenu } from "./mobile-menu";
import { Splash } from "./splash";

/**
 * Interactive shell from the prototype: splash, page transitions, scroll reveal,
 * full-screen mobile menu and toast. Pages render inside `.pg`.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [outFrom, setOutFrom] = useState<string | null>(null);
  const out = outFrom === pathname; // exit animation applies only to the page that is leaving
  const [menu, setMenu] = useState(false);
  const [menuOut, setMenuOut] = useState(false);
  const [splash, setSplash] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const after = useRef<(() => void) | null>(null);

  const closeMenu = useCallback(() => {
    setMenuOut(true);
    setTimeout(() => {
      setMenu(false);
      setMenuOut(false);
    }, 280);
  }, []);
  const openMenu = useCallback(() => setMenu(true), []);
  const toast = useCallback((message: string) => setToastMsg(message), []);

  const go = useCallback<ShellCtx["go"]>(
    (href, opts = {}) => {
      setMenu(false);
      setMenuOut(false);
      after.current = opts.then ?? null;
      if (href === pathname) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (after.current) setTimeout(after.current, 400);
        return;
      }
      setOutFrom(pathname);
      setTimeout(() => {
        router.push(href);
        setTimeout(() => setOutFrom(null), 1200); // fallback if only the query string changes
      }, 260);
    },
    [pathname, router],
  );

  // New page mounted: reset scroll, run any follow-up (e.g. scroll to form)
  useEffect(() => {
    window.scrollTo(0, 0);
    if (after.current) {
      const f = after.current;
      after.current = null;
      const id = setTimeout(f, 500);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menu || splash ? "hidden" : "";
  }, [menu, splash]);
  useEffect(() => {
    if (!toastMsg) return;
    const id = setTimeout(() => setToastMsg(null), 2600);
    return () => clearTimeout(id);
  }, [toastMsg]);

  useReveal(pageRef, [pathname, splash], !splash && pathname !== "/book");

  const ctx = useMemo<ShellCtx>(() => ({ go, menu, openMenu, closeMenu, toast }), [go, menu, openMenu, closeMenu, toast]);

  return (
    <ShellContext.Provider value={ctx}>
      <a href="#main" className="skip-link">Skip to content</a>
      <div ref={pageRef} key={pathname} className={"pg" + (out ? " out" : "") + (splash ? "" : " ready")}>
        {children}
      </div>
      {menu && (
        <div className={"menu-ov" + (menuOut ? " out" : "")} role="dialog" aria-modal="true" aria-label="Menu">
          <MobileMenu />
        </div>
      )}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
      {splash && <Splash onDone={() => setSplash(false)} />}
    </ShellContext.Provider>
  );
}
