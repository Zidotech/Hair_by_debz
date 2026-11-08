"use client";

import type { ReactNode } from "react";
import { NavLink } from "./nav-link";

export function MobileBookBar({
  label = "Book now",
  note,
  href = "/book",
  then,
  onActivate,
}: {
  label?: string;
  note?: ReactNode;
  href?: string;
  then?: () => void;
  onActivate?: () => void;
}) {
  return (
    <div className="v-m" style={{ position: "sticky", bottom: 0, zIndex: 5, padding: "12px 20px 20px", background: "linear-gradient(transparent, var(--cream) 30%)" }}>
      <NavLink href={href} then={then} onClick={onActivate} className="hbd-btn" style={{ width: "100%" }}>{label}</NavLink>
      {note && <div className="hbd-note" style={{ textAlign: "center", marginTop: 8 }}>{note}</div>}
    </div>
  );
}
