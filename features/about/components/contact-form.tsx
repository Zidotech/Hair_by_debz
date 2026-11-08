"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "@phosphor-icons/react";
import { STYLES, TRAINING } from "@/shared/data/catalog";
import { HBD_RESPONSE } from "@/shared/data/site";
import { FieldError } from "@/shared/ui/field-error";
import { NavLink } from "@/features/shell/components/nav-link";
import { R } from "@/shared/lib/rs";
import { scrollToFirstError } from "@/shared/lib/scroll-to-error";
import { sendContactMessage } from "../lib/send-contact-message";

const subscribeNever = () => () => {};
type State = "default" | "error" | "submitting" | "success";
const TOPICS = ["Booking question", "Training", "Bridal / group", "Other"];

/** Only these topics get a follow-up select; Bridal / group and Other have none. */
const ABOUT_OPTIONS: Record<string, { label: string; options: string[] }> = {
  "Booking question": { label: "Style you’re asking about", options: STYLES.map((s) => s.name) },
  Training: { label: "Programme you’re asking about", options: TRAINING.map((p) => p.name) },
};

export function ContactForm() {
  const [state, setState] = useState<State>("default");
  // /about?topic=training&programme=<id> comes from the Training page buttons
  const params = useSearchParams();
  const [topic, setTopic] = useState(params.get("topic") === "training" ? "Training" : params.get("topic") === "other" ? "Other" : TOPICS[0]);
  const [about, setAbout] = useState<Record<string, string>>(() => ({
    "Booking question": STYLES[0].name,
    Training: TRAINING.find((p) => p.id === params.get("programme"))?.name ?? TRAINING[0].name,
  }));
  const [errs, setErrs] = useState<{ email?: boolean; msg?: boolean }>({});
  const [sentTo, setSentTo] = useState("");
  const [sendErr, setSendErr] = useState("");
  // The button stays inactive until the page is ready, so an early tap can't submit the form the old way (message in the URL).
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);
  const busy = state === "submitting";

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const next = { email: !email.includes("@") || !email.includes("."), msg: !message };
    if (next.email || next.msg) {
      setErrs(next);
      setState("error");
      scrollToFirstError();
      return;
    }
    setErrs({});
    setSendErr("");
    setState("submitting");
    try {
      await sendContactMessage({ topic, name: String(f.get("name") ?? ""), email, about: ABOUT_OPTIONS[topic] ? about[topic] : "", message, website: String(f.get("website") ?? "") });
    } catch (e) {
      setSendErr(e instanceof Error ? e.message : "We couldn’t send your message. Please try again.");
      setState("default");
      scrollToFirstError();
      return;
    }
    setSentTo(email);
    setState("success");
  };

  if (state === "success")
    return (
      <div role="status" {...R({ pad: [40, 24] }, { background: "var(--cream)", borderRadius: 20, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" })}>
        <span className="hbd-tag" style={{ background: "var(--ok-soft)", color: "var(--ok)" }}><Check size={14} weight="bold" aria-hidden="true" /> Sent</span>
        <h3 style={{ fontSize: 28 }}>Message sent to Debz’s inbox.</h3>
        <p style={{ color: "var(--ink-soft)" }}>A copy is on its way to <strong>{sentTo}</strong>. Debz replies by email ({HBD_RESPONSE}).</p>
        <button type="button" className="hbd-btn ghost sm" onClick={() => setState("default")}>Send another message</button>
      </div>
    );

  const count = Number(!!errs.email) + Number(!!errs.msg);
  const err = state === "error";
  return (
    <form noValidate onSubmit={send} aria-busy={busy || undefined} {...R({ pad: [36, 20] }, { background: "var(--cream)", borderRadius: 20, display: "flex", flexDirection: "column", gap: 18 })}>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {sendErr && <div role="alert" style={{ padding: 14, borderRadius: 12, background: "var(--error-soft)", color: "var(--error)", fontSize: 15, fontWeight: 600, border: "1px solid var(--error)" }}>{sendErr}</div>}
      {err && (
        <div role="alert" style={{ display: "flex", gap: 12, padding: 14, borderRadius: 12, background: "var(--error-soft)", color: "var(--error)", fontSize: 15, fontWeight: 600, border: "1px solid var(--error)" }}>
          <span aria-hidden="true">!</span>{count} {count === 1 ? "field needs" : "fields need"} attention before sending.
        </div>
      )}
      <p className="hbd-note"><span className="hbd-req" style={{ marginLeft: 0 }}>*</span> Required</p>
      <div>
        <span className="hbd-label">What’s this about?<span className="hbd-req" aria-hidden="true">*</span></span>
        <div role="radiogroup" aria-label="What’s this about?" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TOPICS.map((x) => (
            <button key={x} type="button" role="radio" aria-checked={topic === x} onClick={() => setTopic(x)} disabled={busy} className={"hbd-chip" + (topic === x ? " on" : "")} style={{ cursor: "pointer" }}>
              {topic === x && <Check size={14} weight="bold" aria-hidden="true" />}{x}
            </button>
          ))}
        </div>
      </div>
      <div {...R({ cols: ["1fr 1fr", "1fr 1fr", "1fr"] }, { display: "grid", gap: 18 })}>
        <div>
          <label className="hbd-label" htmlFor="ct-name">Name<span className="hbd-req" aria-hidden="true">*</span></label>
          <input id="ct-name" name="name" className="hbd-input" placeholder="Your name" autoComplete="name" disabled={busy} />
        </div>
        <div>
          <label className="hbd-label" htmlFor="ct-email">Email<span className="hbd-req" aria-hidden="true">*</span></label>
          <input id="ct-email" name="email" type="email" className={"hbd-input" + (errs.email ? " err" : "")} placeholder="you@email.com" autoComplete="email" aria-invalid={errs.email || undefined} aria-describedby={errs.email ? "e-email" : undefined} disabled={busy} />
          {errs.email && <FieldError id="e-email">Enter a full email, like name@example.com</FieldError>}
        </div>
      </div>
      {ABOUT_OPTIONS[topic] && (
        <div key={topic}>
          <label className="hbd-label" htmlFor="ct-about">{ABOUT_OPTIONS[topic].label} <span style={{ fontWeight: 400 }}>(optional)</span></label>
          {/* not name="style": a form control called "style" shadows form.style and breaks React's inline styles */}
          <select id="ct-about" className="hbd-input" value={about[topic]} onChange={(e) => setAbout((a) => ({ ...a, [topic]: e.target.value }))} disabled={busy}>
            {ABOUT_OPTIONS[topic].options.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="hbd-label" htmlFor="ct-msg">Message<span className="hbd-req" aria-hidden="true">*</span></label>
        <textarea id="ct-msg" name="message" className={"hbd-input" + (errs.msg ? " err" : "")} rows={4} placeholder="Tell Debz what you need…" aria-invalid={errs.msg || undefined} aria-describedby={errs.msg ? "e-msg" : undefined} disabled={busy} />
        {errs.msg && <FieldError id="e-msg">Add a short message so Debz can help.</FieldError>}
      </div>
      {busy ? (
        <button type="submit" className="hbd-btn" disabled aria-disabled="true" style={{ width: "100%", borderStyle: "solid", background: "var(--brown)", color: "var(--cream)", opacity: 0.85, cursor: "progress" }}>
          <span aria-hidden="true" style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,254,233,.4)", borderTopColor: "var(--cream)", animation: "hbdspin .8s linear infinite" }} />Sending…
        </button>
      ) : (
        <button type="submit" className="hbd-btn" disabled={!ready} style={{ width: "100%", opacity: ready ? 1 : 0.7 }}>Send to Debz’s inbox</button>
      )}
      <p className="hbd-note" style={{ textAlign: "center" }}>No DMs — this form is the only way to reach Debz. Ready to book? <NavLink href="/book">Go straight to booking</NavLink>.</p>
    </form>
  );
}
