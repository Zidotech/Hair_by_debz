"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "@phosphor-icons/react";
import { gbp } from "@/shared/lib/format";
import { STYLES } from "@/shared/data/catalog";
import { IMG, VID, type VidName } from "@/shared/data/media";
import { R } from "@/shared/lib/rs";
import { NavLink } from "@/features/shell/components/nav-link";
import type { GalItem } from "../data/gallery-items";

export function GalleryTile({ item, demo }: { item: GalItem; demo?: boolean }) {
  const [key, label, , sid, ratio] = item;
  const st = STYLES.find((s) => s.id === sid);
  const isVid = key.startsWith("v:");
  const V = isVid ? VID[key.slice(2) as VidName] : null;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };
  return (
    <figure className={"hbd-tile" + (demo ? " on" : "")} style={{ aspectRatio: ratio, margin: 0 }}>
      {V ? (
        <video ref={ref} src={V.src} poster={V.poster} muted loop playsInline preload="none" aria-label={label + " — video"} onEnded={() => setPlaying(false)} />
      ) : (
        <Image src={IMG[key as keyof typeof IMG]} alt={label} fill sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, (max-width: 1600px) 25vw, 20vw" />
      )}
      {V && (
        <>
          <span className="hbd-tag" style={{ position: "absolute", left: 10, top: 10, background: "rgba(255,254,233,.94)", zIndex: 2 }}>Video</span>
          {!playing && (
            <button type="button" onClick={toggle} aria-label={"Play " + label} {...R({ w: [68, 56], h: [68, 56], fs: [26, 22] }, { position: "absolute", left: "50%", top: "42%", transform: "translate(-50%,-50%)", borderRadius: "50%", border: "1.5px solid var(--cream)", background: "rgba(26,16,10,.35)", backdropFilter: "blur(6px)", color: "var(--cream)", paddingLeft: 4, cursor: "pointer", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" })}>
              <Play size="1em" weight="fill" aria-hidden="true" />
            </button>
          )}
          {playing && (
            <button type="button" onClick={toggle} aria-label="Pause video" style={{ position: "absolute", right: 10, top: 10, height: 44, padding: "0 14px", borderRadius: 999, border: "1px solid rgba(255,254,233,.6)", background: "rgba(26,16,10,.6)", color: "var(--cream)", font: "600 12px var(--sans)", letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer", zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>
              <Pause size={14} weight="fill" aria-hidden="true" /> Pause
            </button>
          )}
        </>
      )}
      <figcaption className="ov">
        <div style={{ minWidth: 0 }}>
          <div className="lbl">{label}</div>
          {st && <div className="meta v-d">{st.price == null ? "Price on request" : "From " + gbp(st.price)}</div>}
        </div>
        <NavLink href={`/book?style=${sid}`} className="bk" aria-label={"Book " + label}>
          Book now <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </NavLink>
      </figcaption>
    </figure>
  );
}
