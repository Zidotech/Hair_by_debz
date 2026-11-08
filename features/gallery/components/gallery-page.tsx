"use client";

import { useState, useSyncExternalStore } from "react";
import { Check } from "@phosphor-icons/react";
import { hc } from "@/shared/lib/layout";
import { R } from "@/shared/lib/rs";
import { SectionHead } from "@/shared/ui/section-head";
import { Header } from "@/features/shell/components/header";
import { Footer } from "@/features/shell/components/footer";
import { MobileBookBar } from "@/features/shell/components/mobile-book-bar";
import { GAL_CATS, GAL_ITEMS, type GalCat, type GalItem } from "../data/gallery-items";
import { GalleryTile } from "./gallery-tile";

const subscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
/** Masonry columns: 2 phone · 3 tablet · 4 laptop · 5 wide desktop. */
const columnCount = () => {
  const w = window.innerWidth;
  return w < 700 ? 2 : w < 1100 ? 3 : w < 1600 ? 4 : 5;
};

/** h / w of a tile, from its "w/h" ratio string. */
const tileHeight = (it: GalItem) => {
  const [w, h] = it[4].split("/").map(Number);
  return h / w;
};

/**
 * Height-balanced masonry: every tile goes to the currently shortest column, so column
 * bottoms stay level whatever mix of photos (3:4, 2:3) and videos (9:16) is showing,
 * while the reading order still runs left to right, top to bottom.
 */
function toColumns(items: GalItem[], n: number) {
  const cols: GalItem[][] = Array.from({ length: n }, () => []);
  const heights = new Array<number>(n).fill(0);
  for (const it of items) {
    let c = 0;
    for (let i = 1; i < n; i++) if (heights[i] < heights[c] - 1e-6) c = i;
    cols[c].push(it);
    heights[c] += tileHeight(it);
  }
  return cols;
}

export function GalleryPage() {
  const [cat, setCat] = useState<GalCat>("all");
  const items = GAL_ITEMS.filter((i) => cat === "all" || (cat === "video" ? i[0].startsWith("v:") : i[2] === cat));
  const n = useSyncExternalStore(subscribe, columnCount, () => 4);
  const cols = toColumns(items, n);
  return (
    <div className={hc()}>
      <Header />
      <main id="main">
      <section {...R({ pad: ["88px 80px 32px", "40px 48px 48px", "40px 20px 20px"], dir: ["row", "column"], ai: ["flex-end", "flex-start"] }, { display: "flex", justifyContent: "space-between", gap: 24 })}>
        <SectionHead eyebrow="Gallery" title="Real clients. Real hairlines." sub={<><span className="v-m">Tap any look to book it — the style is pre-selected for you.</span><span className="v-d">Every photo is Debz’s own work. Hover any look to see the style and book it — it’s pre-selected in the booking form.</span></>} />
        <span className="hbd-note v-d" style={{ fontSize: 13 }}>{items.length} looks</span>
      </section>
      <div role="tablist" aria-label="Filter by style" {...R({ pad: ["12px 80px 32px", "0 48px 48px", "0 20px 20px"], top: [0, 69] }, { display: "flex", gap: 8, overflowX: "auto", overflowY: "hidden", overscrollBehaviorX: "contain", scrollbarWidth: "none", position: "sticky", zIndex: 4, background: "var(--cream)" })}>
        {GAL_CATS.map(([id, l]) => (
          <button key={id} type="button" role="tab" aria-selected={cat === id} onClick={() => setCat(id)} className={"hbd-chip" + (cat === id ? " on" : "")} style={{ flexShrink: 0, cursor: "pointer" }}>
            {cat === id && <Check size={14} weight="bold" aria-hidden="true" />}{l}
          </button>
        ))}
      </div>
      <section key={cat} aria-live="polite" {...R({ pad: ["0 80px 112px", "0 12px 56px"], gap: [16, 8] }, { display: "grid", gridTemplateColumns: `repeat(${n}, minmax(0,1fr))`, alignItems: "start", maxWidth: 1760, margin: "0 auto", width: "100%" })}>
        {cols.map((c, ci) => (
          <div key={ci} {...R({ gap: [16, 8] }, { display: "flex", flexDirection: "column" })}>
            {c.map((it, i) => <GalleryTile key={it[0] + i} item={it} demo={ci === 1 && i === 0 && cat === "all" && n === 4} />)}
          </div>
        ))}
      </section>
      </main>
      <Footer />
      <MobileBookBar />
    </div>
  );
}
