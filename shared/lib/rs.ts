import type { CSSProperties } from "react";

/**
 * CSS-driven responsive styles (no JavaScript breakpoint, so pages render the right layout
 * on the server). Each key sets three custom properties that `app/responsive.css` reads:
 * desktop (>=1100px), tablet (700–1099px) and phone (<700px). Tablet falls back to desktop,
 * phone to tablet.
 *
 *   <section {...R({ pad: ["96px 80px", "48px", "48px 20px"], gap: [64, 32] }, { display: "grid" })}>
 */
export type RV = string | number;
export type Tri = [d: RV, t?: RV, p?: RV];
export type RKey =
  | "pad" | "gap" | "cols" | "fs" | "ord" | "dir" | "ai" | "jc" | "ta" | "w" | "h" | "mt" | "mb" | "mar" | "r"
  | "maxw" | "minh" | "gr" | "gc" | "ml" | "mr" | "bt" | "rt" | "lt" | "pt" | "pb" | "fb" | "sz" | "lh" | "wd" | "disp" | "ox" | "pos" | "top" | "ar";

const PX = new Set<RKey>(["gap", "fs", "w", "h", "mt", "mb", "ml", "mr", "r", "maxw", "minh", "bt", "rt", "lt", "pt", "pb", "fb", "sz", "wd", "top"]);
const unit = (k: RKey, v: RV) => (typeof v === "number" && (PX.has(k) || k === "pad" || k === "mar") ? `${v}px` : v);

export function R(spec: Partial<Record<RKey, Tri>>, style: CSSProperties = {}, className = ""): { className: string; style: CSSProperties } {
  const s: Record<string, RV | undefined> = { ...(style as Record<string, RV | undefined>) };
  const cls: string[] = className ? [className] : [];
  for (const k of Object.keys(spec) as RKey[]) {
    const [d, t = d, p = t] = spec[k] as Tri;
    cls.push("r-" + k);
    s[`--${k}-d`] = unit(k, d);
    s[`--${k}-t`] = unit(k, t);
    s[`--${k}-p`] = unit(k, p);
  }
  return { className: cls.join(" "), style: s as CSSProperties };
}
