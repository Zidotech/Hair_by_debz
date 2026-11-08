"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { VID, type VidName } from "@/shared/data/media";

/** Poster + tap-to-play, with a pause control. No autoplay. */
export function VideoTile({ v, name, style }: { v: VidName; name: string; style?: CSSProperties }) {
  const V = VID[v];
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };
  return (
    <div className="hbd-img" style={{ background: "var(--ink)", ...style }}>
      <video ref={ref} src={V.src} poster={V.poster} muted loop playsInline preload="none" aria-label={name + " — short video"} onEnded={() => setPlaying(false)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <span className="hbd-tag" style={{ position: "absolute", left: 12, top: 12, background: "rgba(255,254,233,.94)" }}>Video</span>
      {!playing && (
        <button type="button" onClick={toggle} aria-label={"Play " + name + " video"} style={{ position: "absolute", inset: 0, margin: "auto", width: 72, height: 72, borderRadius: "50%", border: "none", background: "rgba(255,254,233,.94)", color: "var(--brown)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 5, boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>
          <Play size={28} weight="fill" aria-hidden="true" />
        </button>
      )}
      <button type="button" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"} style={{ position: "absolute", right: 12, bottom: 12, minWidth: 44, height: 44, padding: "0 14px", borderRadius: 999, border: "none", background: "rgba(43,30,22,.8)", color: "var(--cream)", font: "600 12px var(--sans)", letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        {playing ? <><Pause size={14} weight="fill" aria-hidden="true" />Pause</> : <><Play size={14} weight="fill" aria-hidden="true" />Play</>}
      </button>
    </div>
  );
}
