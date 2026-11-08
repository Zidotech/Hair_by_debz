"use client";

import { useEffect, type DependencyList, type RefObject } from "react";

/**
 * Scroll reveal: elements fade/slide in when entering, and back out when leaving
 * (above → up, below → down). The first section (hero) has its own intro.
 */
export function useReveal(rootRef: RefObject<HTMLElement | null>, deps: DependencyList, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    // Elements are only hidden once the visitor first scrolls/taps/types, so the page is fully
    // visible (and auditable) on load; below-the-fold content still reveals as it enters.
    // State lives on the DOM so it survives this effect re-running (breakpoint change etc.).
    const isArmed = () => root.dataset.armed === "1";
    const arm = () => {
      if (isArmed()) return;
      root.dataset.armed = "1";
      root.querySelectorAll<HTMLElement>("[data-rvel]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const inView = r.top < window.innerHeight * 0.94 && r.bottom > 0;
        el.classList.add("rv");
        if (inView) el.classList.add("in");
        else el.classList.toggle("up", r.top < 0);
      });
    };
    const evts = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"] as const;
    evts.forEach((e) => window.addEventListener(e, arm, { once: true, passive: true }));
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const el = e.target;
          if (e.isIntersecting) {
            el.classList.add("in");
            el.classList.remove("up");
          } else {
            el.classList.remove("in");
            el.classList.toggle("up", e.boundingClientRect.top < 0);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const scan = () => {
      root.querySelectorAll("section").forEach((sec, si) => {
        if (si === 0) return;
        [...sec.children].forEach((kid) => {
          const k = kid as HTMLElement;
          if (k.dataset.rv || k.matches("[role=tablist],aside")) return;
          const kids = [...k.children] as HTMLElement[];
          const cs = getComputedStyle(k);
          if (kids.length >= 3 && (cs.display === "grid" || cs.display === "flex") && k.offsetHeight < window.innerHeight * 2.5) {
            k.dataset.rv = "g";
            kids.forEach((g, i) => {
              if (g.dataset.rv) return;
              g.dataset.rv = "1";
              g.dataset.rvel = "1";
              if (isArmed()) g.classList.add("rv");
              g.style.setProperty("--d", (i % 4) * 90 + "ms");
              io.observe(g);
            });
          } else if (k.offsetHeight > window.innerHeight * 2.5) {
            k.dataset.rv = "g";
            kids.forEach((g) => {
              ([...g.children] as HTMLElement[]).forEach((x, i) => {
                if (x.dataset.rv) return;
                x.dataset.rv = "1";
                x.dataset.rvel = "1";
                if (isArmed()) x.classList.add("rv");
                x.style.setProperty("--d", (i % 3) * 80 + "ms");
                io.observe(x);
              });
            });
          } else {
            k.dataset.rv = "1";
            k.dataset.rvel = "1";
            if (isArmed()) k.classList.add("rv");
            io.observe(k);
          }
        });
      });
    };
    scan();
    let tm: ReturnType<typeof setTimeout>;
    const mo = new MutationObserver(() => {
      clearTimeout(tm);
      tm = setTimeout(scan, 60);
    });
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      evts.forEach((e) => window.removeEventListener(e, arm));
      io.disconnect();
      mo.disconnect();
      clearTimeout(tm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
