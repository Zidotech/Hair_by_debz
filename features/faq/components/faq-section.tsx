import { R } from "@/shared/lib/rs";
import { FAQS, FAQ_NOTICE } from "@/shared/data/catalog";
import { SectionHead } from "@/shared/ui/section-head";

export function FaqSection() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <section id="faq" {...R({ pad: ["0 80px 120px", "0 48px 64px", "0 20px 64px"] })}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        <SectionHead eyebrow="FAQ" title="Frequently asked questions" center />
        <div className="hbd-card" style={{ overflow: "hidden" }}>
          {FAQS.map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <div style={{ background: "var(--brown)", color: "var(--cream)", borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="hbd-tag" style={{ alignSelf: "flex-start", background: "var(--cream)" }}>Notice</span>
          {FAQ_NOTICE.map(([a, b]) => (
            <p key={a} style={{ color: "var(--cream)" }}>{a}: <strong>{b}</strong></p>
          ))}
        </div>
      </div>
    </section>
  );
}
