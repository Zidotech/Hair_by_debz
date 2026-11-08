import type { CSSProperties } from "react";
import { R, type Tri } from "@/shared/lib/rs";

export const LOGO_SRC = {
  primary: "/brand/primary.webp",
  secondary: "/brand/secondary.webp",
  tertiary: "/brand/tertiary.webp",
  icon: "/brand/icon.webp",
} as const;

const LOGO_RATIO = { primary: 700 / 405, secondary: 800 / 164, tertiary: 1, icon: 300 / 329 };

/** White-alpha PNG recoloured via CSS mask → any brand colour. */
export function Logo({
  kind = "secondary",
  h = 40,
  color = "var(--brown)",
  style = {},
  className,
}: {
  kind?: keyof typeof LOGO_SRC;
  h?: number | Tri;
  color?: string;
  style?: CSSProperties;
  className?: string;
}) {
  const url = `url("${LOGO_SRC[kind]}")`;
  const ratio = LOGO_RATIO[kind];
  // h as [desktop, tablet, phone] sizes the logo per breakpoint in CSS
  const size = Array.isArray(h)
    ? R({ h: h as Tri, w: (h as Tri).map((x) => (typeof x === "number" ? x * ratio : x)) as Tri })
    : { className: "", style: { height: h, width: h * ratio } as CSSProperties };
  return (
    <div
      role="img"
      aria-label="Hair By Debz"
      className={[size.className, className].filter(Boolean).join(" ") || undefined}
      style={{
        ...size.style,
        background: color,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
