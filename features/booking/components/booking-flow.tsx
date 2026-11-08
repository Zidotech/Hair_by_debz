"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, Check } from "@phosphor-icons/react";
import { hc } from "@/shared/lib/layout";
import { R } from "@/shared/lib/rs";
import { gbp } from "@/shared/lib/format";
import { isValidPhone, normalizeUkPhone } from "@/shared/lib/phone";
import { scrollToFirstError } from "@/shared/lib/scroll-to-error";
import { BOOKING_TYPES, STYLES } from "@/shared/data/catalog";
import { HBD_DEPOSIT } from "@/shared/data/site";
import { Img } from "@/shared/ui/img";
import { Logo } from "@/shared/ui/logo";
import { FieldError } from "@/shared/ui/field-error";
import { Header } from "@/features/shell/components/header";
import { NavLink } from "@/features/shell/components/nav-link";
import { scrollToForm } from "@/features/about/lib/scroll-to-form";
import { useShell } from "@/features/shell/shell-context";
import { fmtDate, hoursNote, nextDays, STEPS, timesFor, useToday } from "../lib/dates";
import { saveBooking } from "../lib/booking-store";
import { submitBooking } from "../lib/submit-booking";
import { BookingAlt, type AltValue } from "./booking-alt";
import { BookingCalendar } from "./booking-calendar";
import { BookingSummary } from "./booking-summary";

interface FormState {
  style: string | null;
  type: string;
  date: Date | null;
  time: string;
  alt1: AltValue;
  name: string;
  email: string;
  phone: string;
  hair: "own" | "source";
  woven: "yes" | "debz" | "natural";
  notes: string;
  agree: boolean;
}
type Errors = Partial<Record<keyof FormState, string | null>>;

const linkBtn: CSSProperties = { background: "none", border: 0, padding: 0, font: "inherit", color: "var(--brown)", textDecoration: "underline", cursor: "pointer" };

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick} className={"hbd-chip" + (on ? " on" : "")} style={{ cursor: "pointer" }}>
      {on && <Check size={14} weight="bold" aria-hidden="true" />}{children}
    </button>
  );
}

const WOVEN_LABEL = { yes: "already woven", debz: "Debz weaves (+£25)", natural: "natural hair (quoted)" } as const;

export function BookingFlow({ styleId }: { styleId: string | null }) {
  const { go } = useShell();
  const today = useToday();
  const [step, setStep] = useState(styleId ? 1 : 0);
  const [s, setS] = useState<FormState>({ style: styleId, type: "standard", date: null, time: "", alt1: { d: "", t: "" }, name: "", email: "", phone: "", hair: "own", woven: "yes", notes: "", agree: false });
  const [err, setErr] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState("");
  const honey = useRef<HTMLInputElement>(null);
  const top = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);

  // Coming from a "Book" link on the price list: bring the chosen service into view if the user steps back to the list.
  useEffect(() => {
    const box = list.current;
    const el = box?.querySelector<HTMLElement>(`[data-id="${s.style}"]`);
    if (box && el) box.scrollTop = Math.max(0, el.offsetTop - box.offsetTop - 6);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const up = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setS((p) => ({ ...p, [k]: v }));
    setErr((e) => ({ ...e, [k]: null }));
  };
  const st = STYLES.find((x) => x.id === s.style);
  const days = today ? nextDays(today) : [];

  const scrollUp = () => {
    const y = top.current ? top.current.getBoundingClientRect().top + window.scrollY - 90 : 0;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };
  const validate = () => {
    const e: Errors = {};
    if (step === 0 && !s.style) e.style = "Choose a style to continue.";
    if (step === 1) {
      if (!s.date) e.date = "Pick your preferred date.";
      if (!s.time) e.time = "Pick a start time.";
      if (!!s.alt1.d !== !!s.alt1.t) e.alt1 = "Pick both a date and a time, or leave both empty.";
    }
    if (step === 2) {
      if (!s.name.trim()) e.name = "Enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(s.email)) e.email = "Enter a full email, like name@example.com";
      if (!isValidPhone(s.phone)) e.phone = "Enter a UK mobile number, like 07700 900123";
    }
    if (step === 3 && !s.agree) e.agree = "Please tick to agree before sending.";
    setErr(e);
    return !Object.keys(e).length;
  };
  const next = async () => {
    if (sending) return;
    if (!validate()) {
      scrollToFirstError();
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      scrollUp();
      return;
    }
    setSending(true);
    setSendErr("");
    try {
      const { ref } = await submitBooking({ styleId: s.style!, type: s.type, dateLabel: fmtDate(s.date), time: s.time, altLabel: s.alt1.d ? fmtDate(new Date(s.alt1.d)) + " · " + s.alt1.t : "", name: s.name, email: s.email, phone: normalizeUkPhone(s.phone) ?? s.phone, hair: s.hair, woven: s.woven, notes: s.notes, website: honey.current?.value });
      saveBooking({ ref, styleId: s.style, name: s.name, email: s.email, date: s.date!.toISOString(), time: s.time });
      go("/book/confirmed");
    } catch (e) {
      setSendErr(e instanceof Error ? e.message : "We couldn’t send your request. Please try again.");
      setSending(false);
      scrollToFirstError();
    }
  };
  const back = () => {
    if (step) {
      setStep(step - 1);
      setErr({});
      scrollUp();
    }
  };
  const ctaLabel = (full: boolean) => (sending ? "Sending…" : step === 3 ? (full ? "Send booking request" : "Send request") : ["Continue to date & time", "Continue to your details", "Continue to review"][step]);

  const field = (k: "name" | "email" | "phone", l: string, type: string, ph: string, auto: string) => (
    <div>
      <label className="hbd-label" htmlFor={"pb-" + k}>{l}<span className="hbd-req" aria-hidden="true">*</span></label>
      <input id={"pb-" + k} className={"hbd-input" + (err[k] ? " err" : "")} type={type} placeholder={ph} autoComplete={auto} value={s[k]} aria-invalid={!!err[k] || undefined} aria-required="true" onChange={(e) => up(k, e.target.value)} />
      {err[k] && <FieldError>{err[k]}</FieldError>}
    </div>
  );

  const parseAlt = (a: AltValue) => (a.d ? fmtDate(new Date(a.d)) + " · " + a.t : "");

  const body = [
    <>
      <h2 {...R({ fs: [40, 28] })}>Which style are we doing?</h2>
      <p style={{ color: "var(--ink-soft)", marginTop: -12 }}>Scroll and tap a service. You can switch any time before you send your request.</p>
      {err.style && <FieldError>{err.style}</FieldError>}
      <div ref={list} tabIndex={-1} {...R({}, { maxHeight: "min(640px, 70vh)", overflowY: "auto", overscrollBehavior: "contain", scrollbarWidth: "none", padding: 6, margin: -6, borderRadius: 18 }, "pb-scroll")}>
        <div role="radiogroup" aria-label="Style" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[STYLES.filter((x) => x.imgs), STYLES.filter((x) => !x.imgs)].map((group, gi) => (
            <div key={gi} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {gi === 1 && group.length > 0 && <div className="hbd-label" style={{ marginBottom: 0 }}>More services</div>}
              <div {...R({ cols: ["repeat(3,minmax(0,1fr))", "repeat(3,minmax(0,1fr))", "repeat(2,minmax(0,1fr))"], gap: [16, 12, 10] }, { display: "grid" })}>
                {group.map((x) => {
                  const on = x.id === s.style;
                  return (
                    <button type="button" key={x.id} data-id={x.id} role="radio" aria-checked={on} onClick={() => up("style", x.id)} className="pb-style" style={{ textAlign: "left", padding: 0, border: "2px solid " + (on ? "var(--brown)" : "transparent"), borderRadius: 16, background: "#fff", overflow: "hidden", cursor: "pointer", boxShadow: on ? "0 10px 24px rgba(78,54,38,.2)" : "0 1px 0 var(--line)", position: "relative", font: "inherit", display: "flex", flexDirection: "column", minWidth: 0 }}>
                      {x.imgs && <Img k={x.imgs[0]} alt="" ratio="4/3" r={0} sizes="(max-width: 700px) 45vw, 25vw" />}
                      {on && <span style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "var(--brown)", color: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pPop .3s" }}><Check size={15} weight="bold" aria-label="Selected" /></span>}
                      <span {...R({ pad: [14, 12, 10] }, { display: "flex", flexDirection: "column", gap: 4, flex: 1, paddingRight: x.imgs ? undefined : 40 })}>
                        <span {...R({ fs: [17, 16, 15] }, { fontFamily: "var(--serif)", color: "var(--brown)", lineHeight: 1.25, overflowWrap: "anywhere" })}>{x.short ?? x.name}</span>
                        <span style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: "auto", paddingTop: 2 }}>{x.price == null ? "Price on request" : gbp(x.price)}{x.time && x.price != null ? " · " + x.time : ""}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="hbd-note" style={{ marginTop: -12 }}>{STYLES.length} services. Scroll the list to see them all.</p>
      <NavLink href="/about?topic=other" then={scrollToForm} style={{ fontSize: 14, fontWeight: 600, minHeight: 44, display: "flex", alignItems: "center" }}>Can’t find what you want? Send Debz a message →</NavLink>
    </>,
    <>
      <h2 {...R({ fs: [40, 28] })}>Request a date</h2>
      <p style={{ color: "var(--ink-soft)", marginTop: -12 }}>Any day, Monday to Sunday, 10AM to 7PM (Wednesdays 4:30PM to 9PM, Fridays 7PM to 10PM). Pick your preferred date and time, and add an alternative if you like. Debz confirms by email. Need a time outside these hours? Choose Emergency in the booking type.</p>
      <div>
        <div className="hbd-label">Booking type<span className="hbd-req" aria-hidden="true">*</span></div>
        <div role="radiogroup" aria-label="Booking type" {...R({ cols: ["repeat(3,1fr)", "repeat(3,1fr)", "1fr"] }, { display: "grid", gap: 10 })}>
          {BOOKING_TYPES.map((b) => {
            const on = s.type === b.id;
            return (
              <button type="button" key={b.id} role="radio" aria-checked={on} onClick={() => up("type", b.id)} style={{ textAlign: "left", font: "inherit", cursor: "pointer", minHeight: 44, padding: 16, borderRadius: 14, border: on ? "2px solid var(--brown)" : "1px solid var(--line)", background: on ? "var(--cream-2)" : "#fff", display: "flex", flexDirection: "column", gap: 4, transition: "all .2s" }}>
                <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <strong style={{ color: "var(--brown)", display: "inline-flex", alignItems: "center", gap: 6 }}>{on && <Check size={14} weight="bold" aria-hidden="true" />}{b.name}</strong>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{b.fee}</span>
                </span>
                <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>{b.d}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div><BookingCalendar today={today} value={s.date} onPick={(d) => { up("date", d); if (s.time && !timesFor(d).includes(s.time)) up("time", ""); }} />{err.date && <FieldError>{err.date}</FieldError>}</div>
      <div>
        <div className="hbd-label">Preferred start time{s.date ? " · " + fmtDate(s.date) : ""}<span className="hbd-req" aria-hidden="true">*</span></div>
        <div role="radiogroup" aria-label="Preferred start time" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{timesFor(s.date).map((x) => <Choice key={x} on={s.time === x} onClick={() => up("time", x)}>{x}</Choice>)}</div>
        {hoursNote(s.date) && <p className="hbd-note" style={{ marginTop: 8 }}>{hoursNote(s.date)}</p>}
        {err.time && <FieldError>{err.time}</FieldError>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="hbd-label" style={{ marginBottom: 0 }}>Another time that works for you, in case your first choice is taken (optional)</div>
        <BookingAlt days={days} v={s.alt1} set={(v) => up("alt1", v)} err={err.alt1} />{err.alt1 && <FieldError>{err.alt1}</FieldError>}
      </div>
    </>,
    <>
      <h2 {...R({ fs: [40, 28] })}>Your details</h2>
      <p className="hbd-note" style={{ marginTop: -12 }}><span className="hbd-req" style={{ marginLeft: 0 }}>*</span> Required</p>
      <div {...R({ pad: [32, 20], cols: ["1fr 1fr", "1fr 1fr", "1fr"] }, { display: "grid", gap: 20 }, "hbd-card")}>
        {field("name", "Full name", "text", "e.g. Adaeze Okafor", "name")}
        {field("email", "Email (Debz replies here)", "email", "you@email.com", "email")}
        {field("phone", "UK mobile number", "tel", "07700 900123", "tel")}
        <div>
          <span className="hbd-label">Bringing your own hair?<span className="hbd-req" aria-hidden="true">*</span></span>
          <div role="radiogroup" aria-label="Bringing your own hair?" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Choice on={s.hair === "own"} onClick={() => up("hair", "own")}>Yes, I have a unit</Choice>
            <Choice on={s.hair === "source"} onClick={() => up("hair", "source")}>Source for me</Choice>
          </div>
        </div>
        <div {...R({ gc: ["span 2", "span 2", "auto"] })}>
          <span className="hbd-label">Is your hair woven before arrival?<span className="hbd-req" aria-hidden="true">*</span></span>
          <div role="radiogroup" aria-label="Is your hair woven before arrival?" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Choice on={s.woven === "yes"} onClick={() => up("woven", "yes")}>Yes, already woven</Choice>
            <Choice on={s.woven === "debz"} onClick={() => up("woven", "debz")}>No, Debz weaves it (+£25)</Choice>
            <Choice on={s.woven === "natural"} onClick={() => up("woven", "natural")}>Natural hair (extra, quoted)</Choice>
          </div>
          <p className="hbd-note" style={{ marginTop: 8 }}>Frontals or wigs must be sent 3 days before your appointment.</p>
        </div>
        <div {...R({ gc: ["span 2", "span 2", "auto"] })}>
          <label className="hbd-label" htmlFor="pb-notes">Anything Debz should know? <span style={{ fontWeight: 400 }}>(optional)</span></label>
          <textarea id="pb-notes" className="hbd-input" rows={3} value={s.notes} onChange={(e) => up("notes", e.target.value)} placeholder="Event date, inspo, length, colour, sensitivities…" style={{ resize: "vertical" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 14, padding: 20, borderRadius: 16, background: "var(--clay-soft)", alignItems: "flex-start" }}>
        <Logo kind="icon" h={32} color="var(--brown)" />
        <p {...R({ fs: [15, 16] }, { color: "var(--brown-deep)" })}><strong>Questions go here, not in DMs.</strong> Everything you write goes straight to Debz’s email with your request.</p>
      </div>
    </>,
    <>
      <h2 {...R({ fs: [40, 28] })}>Review & send request</h2>
      <p style={{ color: "var(--ink-soft)", marginTop: -12 }}>Check everything below. Debz confirms by email and sends your 20% deposit link to pay online. The balance is paid in cash on the day.</p>
      {([
        ["Style", 0, [["Style", st?.name], ["Time needed", st && (st.time || "Confirmed by email")], ["Price", st && gbp(st.price)]]],
        ["Requested times", 1, [["Booking type", (() => { const b = BOOKING_TYPES.find((x) => x.id === s.type); return b && b.name + (b.extra ? " · +" + gbp(b.extra) : ""); })()], ["Preferred", fmtDate(s.date) + " · " + s.time], ["Alternative", parseAlt(s.alt1) || "None"]]],
        ["Your details", 2, [["Name", s.name], ["Email", s.email], ["Phone", s.phone], ["Hair", (s.hair === "own" ? "Own unit" : "Source for me") + " · " + WOVEN_LABEL[s.woven]], ["Notes for Debz", s.notes || "—"]]],
      ] as [string, number, [string, string | undefined][]][]).map(([title, to, rows]) => (
        <div key={title} {...R({ pad: [28, 20] }, { display: "flex", flexDirection: "column", gap: 12 }, "hbd-card")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 20 }}>{title}</h3>
            <button type="button" onClick={() => { setStep(to); scrollUp(); }} aria-label={"Edit " + title.toLowerCase()} style={{ ...linkBtn, fontSize: 13, fontWeight: 600, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>Edit</button>
          </div>
          {rows.map(([k, v]) => (
            <div key={k} {...R({ cols: ["180px 1fr", "180px 1fr", "1fr"], gap: [16, 2], fs: [15, 16] }, { display: "grid", paddingTop: 12, borderTop: "1px solid var(--line)" })}>
              <span style={{ color: "var(--ink-soft)" }}>{k}</span>
              <span style={{ fontWeight: 500, overflowWrap: "anywhere" }}>{v}</span>
            </div>
          ))}
        </div>
      ))}
      <input ref={honey} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {sendErr && <div role="alert" style={{ padding: 14, borderRadius: 12, background: "var(--error-soft)", color: "var(--error)", fontWeight: 600, border: "1px solid var(--error)" }}>{sendErr}</div>}
    </>,
  ][step];

  /** Policy tick, shown right above the send button so it can't be missed. */
  const agreeBox = (dark: boolean) => (
    <div style={{ flexBasis: "100%", width: "100%" }}>
      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", minHeight: 44, padding: dark ? "4px 0" : 14, borderRadius: 14, border: dark ? "0" : err.agree ? "2px solid var(--error)" : "1px solid var(--line)", background: dark ? "transparent" : "#fff", cursor: "pointer", fontSize: 14, lineHeight: 1.45, color: dark ? "var(--cream)" : "var(--ink)" }}>
        <input type="checkbox" className="hbd-check" checked={s.agree} onChange={(e) => up("agree", e.target.checked)} aria-invalid={!!err.agree || undefined} aria-describedby={err.agree ? "agree-err" : undefined} />
        <span>
          I agree to the{" "}
          <a href="/services#policy" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", fontWeight: 600 }}>booking policy</a>
          : the 20% deposit is non-refundable, the balance is paid in cash on the day, and late fees apply.
        </span>
      </label>
      {err.agree && <div id="agree-err" role="alert" style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: dark ? "#ffd7cf" : "var(--error)" }}>{err.agree}</div>}
    </div>
  );

  const btn = (full: boolean) => (
    <button type="button" className={"hbd-btn" + (full ? "" : " light sm")} onClick={next} disabled={sending} aria-busy={sending || undefined} style={{ width: full || step === 3 ? "100%" : undefined, flexShrink: 0, ...(sending ? { background: full ? "var(--brown)" : "var(--cream)", color: full ? "var(--cream)" : "var(--brown)", borderStyle: "solid", cursor: "progress" } : {}) }}>
      {sending && <span aria-hidden="true" style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid currentColor", borderTopColor: "transparent", animation: "hbdspin .8s linear infinite" }} />}
      {ctaLabel(full)}
    </button>
  );

  return (
    <div className={hc()}>
      <Header />
      <main id="main">
      <section ref={top} {...R({ pad: ["56px 80px 120px", "32px 48px 48px", "24px 20px 32px"] })}>
        <div {...R({ gap: [32, 20], mb: [48, 24] }, { display: "flex", flexDirection: "column" })}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo kind="icon" h={28} color="var(--clay)" /><span className="hbd-eyebrow">Booking request</span></div>
            {step > 0 && <button type="button" onClick={back} className="hbd-chip" style={{ cursor: "pointer" }}><ArrowLeft size={14} weight="bold" aria-hidden="true" /> Back</button>}
          </div>
          <ol aria-label="Booking steps" {...R({ gap: [12, 6] }, { display: "flex", alignItems: "center", listStyle: "none", margin: 0, padding: 0 })}>
            {STEPS.map((l, i) => (
              <li key={l} style={{ display: "contents" }}>
                <div aria-current={i === step ? "step" : undefined} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button type="button" disabled={i > step} onClick={() => { if (i < step) { setStep(i); setErr({}); } }} aria-label={"Step " + (i + 1) + ": " + l} style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, background: i <= step ? "var(--brown)" : "transparent", color: i <= step ? "var(--cream)" : "var(--ink-soft)", border: "1.5px solid " + (i <= step ? "var(--brown)" : "var(--ink-soft)"), cursor: i < step ? "pointer" : "default", padding: 0, transition: "all .3s" }}>{i < step ? <Check size={14} weight="bold" aria-hidden="true" /> : i + 1}</button>
                  <span className={i === step ? undefined : "v-nop"} style={{ fontSize: 13, fontWeight: i === step ? 600 : 500, color: i === step ? "var(--brown)" : "var(--ink-soft)" }}>{l}</span>
                </div>
                {i < 3 && (
                  <span aria-hidden="true" {...R({ sz: [24, 12] }, { flex: 1, height: 2, background: "var(--line)", position: "relative", overflow: "hidden", borderRadius: 2 })}>
                    <span style={{ position: "absolute", inset: 0, background: "var(--brown)", transform: i < step ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform .5s cubic-bezier(.2,.7,.2,1)" }} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
        <div {...R({ cols: ["minmax(0,1fr) 400px", "1fr"], gap: [56, 24] }, { display: "grid", alignItems: "start" })}>
          <div key={step} style={{ display: "flex", flexDirection: "column", gap: 24, animation: "pStep .45s cubic-bezier(.2,.7,.2,1)" }}>
            {body}
            <div className="v-m"><BookingSummary st={st} type={s.type} date={s.date} time={s.time} /></div>
          </div>
          {(
            <div className="v-d" style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 24 }}>
              <BookingSummary st={st} type={s.type} date={s.date} time={s.time} />
              {step === 3 && agreeBox(false)}
              {btn(true)}
              {step === 3 && <p className="hbd-note" style={{ textAlign: "center" }}>Sends to Debz’s inbox. You’ll get a copy by email.</p>}
            </div>
          )}
        </div>
      </section>
      </main>
      {(
        <div {...R({ pad: ["14px 20px 22px", "16px 48px 22px", "14px 20px 22px"] }, { position: "sticky", bottom: 0, background: "var(--brown)", color: "var(--cream)", display: "flex", flexWrap: "wrap", rowGap: 10, alignItems: "center", gap: 16, zIndex: 5 }, "v-m")}>
          <div style={{ flex: "1 1 0", minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontSize: 12, letterSpacing: ".08em", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", textTransform: "uppercase", color: "var(--clay-soft)" }}>Deposit</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22 }}>
              {st ? (st.price == null ? "Quoted" : gbp(st.price * HBD_DEPOSIT)) : "—"}{" "}
              {st && st.price != null && <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--cream-2)" }}>of {gbp(st.price)}</span>}
            </div>
          </div>
          {step === 3 && agreeBox(true)}
          {btn(false)}
        </div>
      )}
    </div>
  );
}
