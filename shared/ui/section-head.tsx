import type { ReactNode } from "react";
import { R } from "@/shared/lib/rs";
import { Logo } from "./logo";

export function SectionHead({
  eyebrow,
  title,
  sub,
  center,
  light,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: center ? "center" : "flex-start", textAlign: center ? "center" : "left", maxWidth: 640, margin: center ? "0 auto" : 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Logo kind="icon" h={28} color={light ? "var(--cream)" : "var(--clay)"} />
        <span className="hbd-eyebrow" style={{ color: light ? "var(--cream-2)" : undefined }}>{eyebrow}</span>
      </div>
      <h2 {...R({ fs: [48, 40, 32] }, { lineHeight: 1.1, color: light ? "var(--cream)" : undefined })}>{title}</h2>
      {sub && <p {...R({ fs: [17, 17, 16] }, { color: light ? "var(--cream-2)" : "var(--ink-soft)" })}>{sub}</p>}
    </div>
  );
}
