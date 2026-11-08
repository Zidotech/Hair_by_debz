"use client";

import { useSyncExternalStore } from "react";

export interface BookingResult {
  ref: string;
  styleId: string | null;
  name: string;
  email: string;
  /** ISO string of the preferred date */
  date: string;
  time: string;
}

const KEY = "hbd-booking";
const listeners = new Set<() => void>();
let raw: string | null = null;
let cached: BookingResult | null = null;

function read(): BookingResult | null {
  let next: string | null = null;
  try {
    next = sessionStorage.getItem(KEY);
  } catch {}
  if (next !== raw) {
    raw = next;
    try {
      cached = next ? (JSON.parse(next) as BookingResult) : null;
    } catch {
      cached = null;
    }
  }
  return cached;
}

export function saveBooking(b: BookingResult) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(b));
  } catch {}
  listeners.forEach((l) => l());
}

/** undefined until the client has hydrated, then the last booking request (or null). */
export function useBooking(): BookingResult | null | undefined {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => undefined,
  );
}
