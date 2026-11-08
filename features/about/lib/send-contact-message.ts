export interface ContactMessage {
  topic: string;
  name: string;
  email: string;
  /** Style or programme the message is about; empty for Bridal / group and Other */
  about: string;
  message: string;
  /** Honeypot: real visitors never fill this in */
  website?: string;
}

/** Sends the message through /api/contact, which emails Debz and a copy to the sender. */
export async function sendContactMessage(msg: ContactMessage): Promise<void> {
  const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(msg) });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "We couldn't send your message. Please try again.");
  }
}
