import { esc, INBOX, layout, limited, oneLine, row, sendMail } from "@/shared/server/email";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  if (limited(req, "contact")) return Response.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (str(b.website, 50)) return Response.json({ ok: true }); // honeypot
  const topic = oneLine(str(b.topic, 60));
  const name = oneLine(str(b.name, 120));
  const email = oneLine(str(b.email, 200));
  const about = oneLine(str(b.about, 120));
  const message = str(b.message, 4000);
  if (!/^\S+@\S+\.\S+$/.test(email) || !message || !topic) return Response.json({ error: "Some details are missing or invalid." }, { status: 400 });

  const table = `<table style="border-collapse:collapse;font-size:15px">${row("Topic", topic)}${about ? row("About", about) : ""}${row("Name", name || "Not given")}${row("Email", email)}</table>`;
  try {
    await sendMail({
      to: INBOX,
      replyTo: email,
      subject: `Website message: ${topic}${about ? " · " + about : ""}`,
      html: layout("New message from the website", `${table}<h2 style="font-size:16px;margin:20px 0 6px;color:#6b4a38">Message</h2><p style="white-space:pre-wrap;margin:0">${esc(message)}</p><p style="font-size:13px;color:#8a7767;margin-top:20px">Reply to this email to answer them.</p>`),
      text: `Topic: ${topic}\n${about ? "About: " + about + "\n" : ""}Name: ${name || "Not given"}\nEmail: ${email}\n\n${message}\n\nReply to this email to answer them.`,
    });
    await sendMail({
      to: email,
      replyTo: INBOX,
      subject: "We got your message",
      html: layout("Thanks for getting in touch", `<p style="margin:0 0 14px">Debz has your message and will reply by email.</p><p style="white-space:pre-wrap;margin:0;padding:12px;background:#fffee9;border-radius:10px;font-size:14px">${esc(message)}</p>`),
      text: `Debz has your message and will reply by email.\n\n${message}`,
    }).catch((e) => console.error("[contact] customer copy failed", e));
  } catch (e) {
    console.error("[contact] send failed", e);
    return Response.json({ error: "We couldn't send your message. Please try again, or email hello@hairbydebz.co.uk." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
