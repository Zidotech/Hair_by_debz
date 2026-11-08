"use client";

import { useSyncExternalStore } from "react";

type Bp = "d" | "t" | "m";

const subscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const snapshot = (): Bp => {
  const w = window.innerWidth;
  return w < 700 ? "m" : w < 1100 ? "t" : "d";
};

/** m = phone or tablet layout, t = tablet only (as in the design's `m` / `t` flags). */
export function useBp() {
  const k = useSyncExternalStore(subscribe, snapshot, () => "d" as Bp);
  return { m: k !== "d", t: k === "t", k };
}
