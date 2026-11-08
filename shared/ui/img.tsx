import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { IMG, IMG_ALT, type ImgKey } from "@/shared/data/media";
import { R, type RKey, type Tri } from "@/shared/lib/rs";

/** Real <img> with alt text (style name for style photos). */
export function Img({
  k,
  src,
  alt,
  h,
  ratio,
  r = 16,
  style = {},
  children,
  sizes = "(max-width: 700px) 90vw, (max-width: 1100px) 50vw, 40vw",
  priority,
  rsp,
}: {
  k?: ImgKey;
  src?: string;
  alt?: string;
  h?: number | Tri;
  ratio?: string | Tri;
  r?: number | Tri;
  style?: CSSProperties;
  children?: ReactNode;
  sizes?: string;
  priority?: boolean;
  /** extra responsive styles, see shared/lib/rs.ts */
  rsp?: Partial<Record<RKey, Tri>>;
}) {
  const url = src ?? (k ? IMG[k] : "");
  const spec: Parameters<typeof R>[0] = { ...rsp };
  if (Array.isArray(h)) spec.h = h;
  if (Array.isArray(r)) spec.r = r;
  if (Array.isArray(ratio)) spec.ar = ratio;
  const rs = R(spec, { height: Array.isArray(h) ? undefined : h, aspectRatio: Array.isArray(ratio) ? undefined : ratio, borderRadius: Array.isArray(r) ? undefined : r, ...style }, "hbd-img");
  return (
    <div className={rs.className} style={rs.style}>
      <Image src={url} alt={alt ?? (k ? IMG_ALT[k] : undefined) ?? ""} fill sizes={sizes} priority={priority} />
      {children}
    </div>
  );
}
