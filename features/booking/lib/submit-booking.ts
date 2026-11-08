export interface BookingRequest {
  styleId: string;
  type: string;
  /** Human-readable preferred date, e.g. "Mon, 9 Nov 2026" (built in the browser so the timezone can't shift it) */
  dateLabel: string;
  time: string;
  /** Optional alternative, already formatted; empty when not chosen */
  altLabel: string;
  name: string;
  email: string;
  phone: string;
  hair: "own" | "source";
  woven: "yes" | "debz" | "natural";
  notes: string;
  /** Honeypot: real visitors never fill this in */
  website?: string;
}

/** Sends the request through /api/booking, which emails Debz and the customer. */
export async function submitBooking(req: BookingRequest): Promise<{ ref: string }> {
  const res = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req) });
  const data = (await res.json().catch(() => ({}))) as { ref?: string; error?: string };
  if (!res.ok || !data.ref) throw new Error(data.error ?? "We couldn't send your request. Please try again.");
  return { ref: data.ref };
}
