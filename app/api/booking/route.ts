import { BOOKING_TYPES, STYLES } from "@/shared/data/catalog";
import { HBD_DEPOSIT } from "@/shared/data/site";
import { esc, INBOX, layout, limited, oneLine, row, sendMail } from "@/shared/server/email";

const gbp = (n: number) => "£" + (n % 1 ? n.toFixed(2) : n);
const WOVEN = { yes: "Already woven", debz: "Debz weaves it (+£25)", natural: "Natural hair (quoted)" } as const;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  if (limited(req, "booking")) return Response.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (str(b.website, 50)) return Response.json({ ref: "HBD-0000-000" }); // honeypot: bots fill this in

  const style = STYLES.find((s) => s.id === b.styleId);
  const type = BOOKING_TYPES.find((t) => t.id === b.type);
  const name = oneLine(str(b.name, 120));
  const email = oneLine(str(b.email, 200));
  const phone = oneLine(str(b.phone, 40));
  const dateLabel = oneLine(str(b.dateLabel, 60));
  const time = oneLine(str(b.time, 20));
  const altLabel = oneLine(str(b.altLabel, 80));
  const notes = str(b.notes, 2000);
  const hair = b.hair === "source" ? "Debz sources the hair" : "Own unit";
  const woven = WOVEN[b.woven as keyof typeof WOVEN];
  if (!style || !type || !name || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, "").length < 10 || !dateLabel || !time || !woven) {
    return Response.json({ error: "Some details are missing or invalid." }, { status: 400 });
  }

  const ref = "HBD-" + String(Math.floor(1000 + Math.random() * 9000)) + "-" + String(Math.floor(100 + Math.random() * 900));
  const price = style.price == null ? "Price on request (quoted)" : gbp(style.price) + (type.extra ? ` + ${gbp(type.extra)} ${type.name.toLowerCase()} fee` : "");
  const deposit = style.price == null ? "Quoted after confirmation" : gbp(style.price * HBD_DEPOSIT) + " (20%)";
  const rows: [string, string][] = [
    ["Reference", ref],
    ["Service", style.name],
    ["Price", price],
    ["Deposit", deposit],
    ["Booking type", type.name],
    ["Preferred", `${dateLabel} · ${time}`],
    ["Alternative", altLabel || "None"],
    ["Hair", `${hair} · ${woven}`],
  ];
  const table = `<table style="border-collapse:collapse;font-size:15px">${rows.map(([k, v]) => row(k, v)).join("")}</table>`;
  const plain = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    // To Debz: replying goes straight to the customer.
    await sendMail({
      to: INBOX,
      replyTo: email,
      subject: `New booking request: ${style.name} (${ref})`,
      html: layout("New booking request", `${table}<h2 style="font-size:16px;margin:20px 0 6px;color:#6b4a38">Customer</h2><table style="border-collapse:collapse;font-size:15px">${row("Name", name)}${row("Email", email)}${row("Phone", phone)}</table><h2 style="font-size:16px;margin:20px 0 6px;color:#6b4a38">Notes</h2><p style="white-space:pre-wrap;margin:0">${esc(notes) || "None"}</p><p style="font-size:13px;color:#8a7767;margin-top:20px">Reply to this email to answer the customer, then send the 20% deposit link.</p>`),
      text: `${plain}\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nNotes:\n${notes || "None"}\n\nReply to this email to answer the customer.`,
    });
    // Copy to the customer. Failing here must not lose the booking, Debz already has it.
    await sendMail({
      to: email,
      replyTo: INBOX,
      subject: `We got your booking request (${ref})`,
      html: layout(`Thanks, ${name.split(" ")[0] || "lovely"}`, `<p style="margin:0 0 14px">Debz has your request. Your slot is <strong>not confirmed yet</strong>. She will email you to confirm, with a link to pay the 20% deposit.</p>${table}<p style="font-size:13px;color:#8a7767;margin-top:18px">The balance is paid in cash on the day. Just reply to this email if you need to change anything.</p>`),
      text: `Thanks ${name}. Debz has your request. Your slot is not confirmed yet. She will email you to confirm, with a link to pay the 20% deposit.\n\n${plain}\n\nJust reply to this email if you need to change anything.`,
    }).catch((e) => console.error("[booking] customer copy failed", e));
  } catch (e) {
    console.error("[booking] send failed", e);
    return Response.json({ error: "We couldn't send your request. Please try again, or email hello@hairbydebz.co.uk." }, { status: 502 });
  }
  return Response.json({ ref });
}
