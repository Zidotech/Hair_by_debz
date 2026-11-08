"use client";

import { useSearchParams } from "next/navigation";
import { STYLES } from "@/shared/data/catalog";
import { BookingFlow } from "./booking-flow";

/** `/book?style=<id>` pre-selects a style and starts on the date step, like the gallery/home links in the design. */
export function BookingPage() {
  const requested = useSearchParams().get("style");
  const styleId = STYLES.some((s) => s.id === requested) ? requested : null;
  return <BookingFlow key={styleId ?? "none"} styleId={styleId} />;
}
