"use client";

import { useMemo, useSyncExternalStore } from "react";

export const TIMES = ["08:00", "10:00", "12:30", "15:00", "17:30"];
export const STEPS = ["Style", "Request a date", "Your details", "Review & send"];

export const fmtDate = (d: Date | null | undefined) =>
  d ? d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";

const noop = () => () => {};
const todayKey = () => {
  const n = new Date();
  return `${n.getFullYear()}-${n.getMonth()}-${n.getDate()}`;
};

/** Today at local midnight; null on the server so prerendered HTML never bakes in a stale date. */
export function useToday(): Date | null {
  const key = useSyncExternalStore(noop, todayKey, () => "");
  return useMemo(() => {
    if (!key) return null;
    const [y, mo, d] = key.split("-").map(Number);
    return new Date(y, mo, d);
  }, [key]);
}

/** The next 60 days, for the alternative-date selects. */
export const nextDays = (today: Date) =>
  Array.from({ length: 60 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
