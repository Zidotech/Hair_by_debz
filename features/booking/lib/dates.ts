"use client";

import { useMemo, useSyncExternalStore } from "react";

export const TIMES = ["10:00", "12:30", "15:00", "17:30"];
/** Debz works shorter hours on these two days, so only these start times are offered. */
const WEDNESDAY_TIMES = ["16:30", "17:30", "18:30", "19:30", "20:30"];
const FRIDAY_TIMES = ["19:00", "20:00", "21:00"];

/** Start times Debz offers on a given date. */
export const timesFor = (d: Date | null | undefined): string[] =>
  d?.getDay() === 3 ? WEDNESDAY_TIMES : d?.getDay() === 5 ? FRIDAY_TIMES : TIMES;

/** Short note shown when the chosen day has limited hours; null on normal days. */
export const hoursNote = (d: Date | null | undefined): string | null =>
  d?.getDay() === 3 ? "Wednesdays: Debz is available 4:30PM to 9PM." : d?.getDay() === 5 ? "Fridays: Debz is available 7PM to 10PM." : null;
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
