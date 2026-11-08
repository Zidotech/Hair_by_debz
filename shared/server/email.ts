/**
 * Server-only email helper. Talks to Resend's HTTP API with fetch (no extra package).
 * Never import this from a client component: it reads the API key from the environment.
 *
 *   RESEND_API_KEY   required in production
 *   MAIL_FROM        e.g. "Hair By Debz <bookings@send.hairbydebz.co.uk>"
 *   MAIL_INBOX       where Debz receives requests, e.g. hello@hairbydebz.co.uk
 */
const FROM = process.env.MAIL_FROM ?? "Hair By Debz <bookings@send.hairbydebz.co.uk>";
export const INBOX = process.env.MAIL_INBOX ?? "hello@hairbydebz.co.uk";

export interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Header values must not contain line breaks (stops header injection). */
export const oneLine = (s: string, max = 200) => s.replace(/[\r\n]+/g, " ").trim().slice(0, max);

export async function sendMail(m: Mail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY is not set");
    console.log(`[email:dev] no RESEND_API_KEY, would send to ${m.to}: ${m.subject}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [m.to], subject: m.subject, html: m.html, text: m.text, reply_to: m.replyTo }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

/** Small best-effort per-IP limiter (per server instance). Stops casual abuse of the forms. */
const hits = new Map<string, number[]>();
export function limited(req: Request, bucket: string, max = 5, windowMs = 10 * 60_000): boolean {
  const ip = (req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const k = bucket + ":" + ip;
  const now = Date.now();
  const recent = (hits.get(k) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(k, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

/** Shared wrapper so every email looks like the brand. */
export function layout(title: string, body: string): string {
  return `<div style="background:#fffee9;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#2b1d14">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;border:1px solid #eadfcf">
<h1 style="font-family:Georgia,serif;font-size:22px;color:#6b4a38;margin:0 0 16px">${esc(title)}</h1>${body}
<p style="font-size:12px;color:#8a7767;margin:24px 0 0">Hair By Debz · Northwest London · by appointment only</p></div></div>`;
}

export const row = (k: string, v: string) =>
  `<tr><td style="padding:6px 12px 6px 0;color:#8a7767;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`;
