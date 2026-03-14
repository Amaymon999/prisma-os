// ============================================
// PRISMA OS — Landing Page Generation Engine
// ============================================

import type {
  WizardData,
  GenerationResult,
  ConversionScore,
  SectionType,
  Vertical,
  PageType,
  ToneOfVoice,
  ColorPalette,
  DEFAULT_PALETTES,
} from "@/types";

// ---- Vertical-specific section blueprints ----
const VERTICAL_SECTION_MAP: Record<string, SectionType[]> = {
  edilizia: [
    "hero_form",
    "proof_bar",
    "services",
    "how_it_works",
    "metrics",
    "testimonials",
    "why_choose_us",
    "gallery",
    "faq",
    "final_form",
    "footer",
  ],
  moda: [
    "hero_cta",
    "promo_banner",
    "services",
    "gallery",
    "benefits",
    "testimonials",
    "pricing",
    "faq",
    "footer",
  ],
  palestra: [
    "hero_cta",
    "pain_points",
    "benefits",
    "how_it_works",
    "metrics",
    "testimonials",
    "pricing",
    "faq",
    "final_form",
    "footer",
  ],
  estetica: [
    "hero_cta",
    "services",
    "benefits",
    "before_after",
    "testimonials",
    "gallery",
    "pricing",
    "contact",
    "footer",
  ],
  ristorazione: [
    "hero_cta",
    "services",
    "gallery",
    "metrics",
    "testimonials",
    "promo_banner",
    "contact",
    "map",
    "footer",
  ],
  professionisti: [
    "hero_cta",
    "proof_bar",
    "services",
    "how_it_works",
    "testimonials",
    "faq",
    "contact",
    "footer",
  ],
  formazione: [
    "hero_cta",
    "pain_points",
    "benefits",
    "how_it_works",
    "metrics",
    "case_studies",
    "testimonials",
    "pricing",
    "faq",
    "final_form",
    "footer",
  ],
  saas: [
    "hero_cta",
    "proof_bar",
    "pain_points",
    "benefits",
    "how_it_works",
    "metrics",
    "testimonials",
    "pricing",
    "faq",
    "contact",
    "footer",
  ],
  franchising: [
    "hero_cta",
    "proof_bar",
    "metrics",
    "services",
    "how_it_works",
    "case_studies",
    "testimonials",
    "faq",
    "contact",
    "footer",
  ],
  altro: [
    "hero_cta",
    "benefits",
    "services",
    "testimonials",
    "faq",
    "contact",
    "footer",
  ],
};

// ---- Page type section overrides ----
const PAGE_TYPE_OVERRIDES: Partial<Record<PageType, Partial<SectionType[]>>> = {
  prenota_call: [
    "hero_cta",
    "benefits",
    "how_it_works",
    "testimonials",
    "what_happens_next",
    "final_form",
    "footer",
  ],
  audit_gratuito: [
    "hero_form",
    "pain_points",
    "benefits",
    "what_happens_next",
    "testimonials",
    "faq",
    "footer",
  ],
  vsl: [
    "hero_cta",
    "vsl_video",
    "benefits",
    "testimonials",
    "pricing",
    "faq",
    "final_form",
    "footer",
  ],
};

// ---- Copy tone adjusters ----
interface ToneConfig {
  heroPrefix: string;
  ctaStyle: string;
  urgencyText: string;
  socialProofPrefix: string;
}

const TONE_CONFIG: Record<ToneOfVoice, ToneConfig> = {
  diretto: {
    heroPrefix: "",
    ctaStyle: "Inizia Ora",
    urgencyText: "Posti limitati. Agisci subito.",
    socialProofPrefix: "Già scelto da",
  },
  professionale: {
    heroPrefix: "La soluzione professionale per",
    ctaStyle: "Contattaci",
    urgencyText: "Disponibilità limitata.",
    socialProofPrefix: "Scelto da oltre",
  },
  premium: {
    heroPrefix: "L'eccellenza in",
    ctaStyle: "Scopri di Più",
    urgencyText: "Accesso esclusivo su invito.",
    socialProofPrefix: "Trusted by",
  },
  amichevole: {
    heroPrefix: "Ciao! Siamo qui per aiutarti con",
    ctaStyle: "Parliamone",
    urgencyText: "Non aspettare troppo!",
    socialProofPrefix: "Oltre",
  },
  tecnico: {
    heroPrefix: "Soluzione avanzata per",
    ctaStyle: "Richiedi Demo",
    urgencyText: "Capacità produttiva limitata.",
    socialProofPrefix: "Implementato da",
  },
  aggressivo: {
    heroPrefix: "SMETTILA DI PERDERE SOLDI CON",
    ctaStyle: "VOGLIO RISULTATI ORA",
    urgencyText: "⚠️ Offerta valida solo per 24 ore.",
    socialProofPrefix: "Già",
  },
  aspirazionale: {
    heroPrefix: "Trasforma la tua vita con",
    ctaStyle: "Inizia la Trasformazione",
    urgencyText: "Il momento perfetto è adesso.",
    socialProofPrefix: "Oltre",
  },
};

// ---- Compute conversion score ----
export function computeConversionScore(data: WizardData): ConversionScore {
  const s1 = data.step1 || {};
  const s2 = data.step2 || {};
  const s3 = data.step3 || {};
  const s5 = data.step5 || {};

  const headline = s5.headline ? 20 : 0;
  const socialProof =
    (s5.reviews?.length || 0) > 0
      ? 20
      : (s5.socialProof || "").length > 10
      ? 10
      : 0;
  const cta = s1.primaryCta ? 20 : 10;
  const urgency = s2.hasUrgency || s2.hasScarcity ? 15 : 0;
  const trust =
    (s2.hasGuarantee ? 5 : 0) +
    (s5.faqs?.length || 0 > 0 ? 5 : 0) +
    (s3.logoUrl ? 5 : 0);
  const clarity =
    (s2.usp || "").length > 20
      ? 10
      : (s2.productService || "").length > 10
      ? 5
      : 0;

  const total = Math.min(
    100,
    headline + socialProof + cta + urgency + trust + clarity
  );

  const suggestions: string[] = [];
  if (!s5.headline) suggestions.push("Aggiungi una headline forte");
  if ((s5.reviews?.length || 0) === 0)
    suggestions.push("Aggiungi almeno 2-3 recensioni");
  if (!s2.hasGuarantee) suggestions.push("Considera di aggiungere una garanzia");
  if (!s2.hasUrgency && !s2.hasScarcity)
    suggestions.push("Un elemento di urgenza aumenta le conversioni del 30%+");
  if ((s5.faqs?.length || 0) === 0)
    suggestions.push("Le FAQ riducono le obiezioni e aumentano la fiducia");
  if (!s3.logoUrl) suggestions.push("Carica il logo per aumentare la credibilità");

  return {
    total,
    breakdown: {
      headline,
      socialProof,
      cta,
      urgency,
      trust,
      clarity,
    },
    suggestions,
  };
}

// ---- Generate placeholder if data missing ----
function placeholder(text: string, fallback: string): string {
  return text && text.trim().length > 0 ? text : fallback;
}

// ---- Generate section HTML ----
function generateSection(
  type: SectionType,
  data: WizardData,
  palette: { primary: string; accent: string; background: string; text: string }
): string {
  const s1 = data.step1 || {};
  const s2 = data.step2 || {};
  const s4 = data.step4 || {};
  const s5 = data.step5 || {};
  const tone = TONE_CONFIG[s4.toneOfVoice || "diretto"];

  const headline = placeholder(s5.headline || "", "Il Titolo Più Convincente del Tuo Settore");
  const subheadline = placeholder(
    s5.subheadline || "",
    "Una proposta di valore chiara e irresistibile per il tuo cliente ideale."
  );
  const primaryCta = placeholder(s1.primaryCta || "", tone.ctaStyle);
  const secondaryCta = placeholder(s1.secondaryCta || "", "Scopri di più");
  const brandName = placeholder(s1.brandName || "", "Il Tuo Brand");
  const phone = placeholder(s5.phone || "", "+39 000 000 0000");
  const email = placeholder(s5.email || "", "info@tuobrand.it");

  switch (type) {
    case "hero_cta":
      return `
      <section class="po-hero" style="background: linear-gradient(135deg, ${palette.primary} 0%, ${palette.background} 100%); padding: 100px 0 80px; position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 40px 40px;"></div>
        <div style="max-width: 900px; margin: 0 auto; padding: 0 24px; text-align: center; position: relative;">
          <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 6px 16px; margin-bottom: 32px;">
            <span style="width: 6px; height: 6px; background: ${palette.accent}; border-radius: 50%; display: inline-block;"></span>
            <span style="color: ${palette.accent}; font-size: 13px; font-weight: 500; letter-spacing: 0.05em;">${placeholder(s1.location || "", "Milano & Provincia")}</span>
          </div>
          <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; color: ${palette.text}; line-height: 1.1; margin-bottom: 24px; letter-spacing: -0.02em;">${headline}</h1>
          <p style="font-size: 1.25rem; color: rgba(${hexToRgb(palette.text)}, 0.7); max-width: 640px; margin: 0 auto 40px; line-height: 1.6;">${subheadline}</p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <a href="#contact" style="display: inline-flex; align-items: center; gap: 8px; background: ${palette.accent}; color: ${palette.background}; font-weight: 700; font-size: 1rem; padding: 16px 32px; border-radius: 8px; text-decoration: none; transition: all 0.2s;">${primaryCta}</a>
            <a href="#info" style="display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.15); color: ${palette.text}; font-weight: 500; font-size: 1rem; padding: 16px 32px; border-radius: 8px; text-decoration: none;">${secondaryCta}</a>
          </div>
          ${s2.hasUrgency ? `<p style="margin-top: 24px; color: #f5a623; font-size: 0.875rem; font-weight: 500;">⚡ ${tone.urgencyText}</p>` : ""}
        </div>
      </section>`;

    case "hero_form":
      return `
      <section class="po-hero-form" style="background: linear-gradient(135deg, ${palette.primary} 0%, ${palette.background} 100%); padding: 80px 0; overflow: hidden;">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
          <div>
            <h1 style="font-size: clamp(2rem, 4vw, 3.25rem); font-weight: 800; color: ${palette.text}; line-height: 1.1; margin-bottom: 20px;">${headline}</h1>
            <p style="font-size: 1.1rem; color: rgba(${hexToRgb(palette.text)}, 0.7); margin-bottom: 32px; line-height: 1.6;">${subheadline}</p>
            ${(s5.benefits || []).slice(0, 3).map((b: string) => `<div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px;"><span style="color: ${palette.accent}; font-size: 1.1rem; margin-top: 2px;">✓</span><span style="color: rgba(${hexToRgb(palette.text)}, 0.85); font-size: 0.95rem;">${b}</span></div>`).join("")}
          </div>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
            <h3 style="color: ${palette.text}; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Richiedi Informazioni Gratuite</h3>
            <p style="color: rgba(${hexToRgb(palette.text)}, 0.6); font-size: 0.875rem; margin-bottom: 24px;">Risponderemo entro 24 ore lavorative</p>
            <form>
              <div style="margin-bottom: 16px;"><input type="text" placeholder="Nome e Cognome" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 14px 16px; color: ${palette.text}; font-size: 0.95rem; outline: none;" /></div>
              <div style="margin-bottom: 16px;"><input type="email" placeholder="Email" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 14px 16px; color: ${palette.text}; font-size: 0.95rem; outline: none;" /></div>
              <div style="margin-bottom: 24px;"><input type="tel" placeholder="Telefono" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 14px 16px; color: ${palette.text}; font-size: 0.95rem; outline: none;" /></div>
              <button type="submit" style="width: 100%; background: ${palette.accent}; color: ${palette.background}; font-weight: 700; font-size: 1rem; padding: 16px; border-radius: 8px; border: none; cursor: pointer;">${primaryCta}</button>
              <p style="text-align: center; color: rgba(${hexToRgb(palette.text)}, 0.4); font-size: 0.75rem; margin-top: 12px;">🔒 Nessuno spam. Dati trattati con riservatezza.</p>
            </form>
          </div>
        </div>
      </section>`;

    case "proof_bar":
      return `
      <section style="background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 24px 0;">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: wrap;">
          <span style="color: rgba(${hexToRgb(palette.text)}, 0.4); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;">Scelto da</span>
          ${["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"].map(b => `<span style="color: rgba(${hexToRgb(palette.text)}, 0.35); font-weight: 700; font-size: 1rem; letter-spacing: -0.01em;">${b}</span>`).join("")}
        </div>
      </section>`;

    case "metrics":
      const metrics = [
        { value: "500+", label: "Clienti Soddisfatti" },
        { value: "98%", label: "Tasso di Soddisfazione" },
        { value: "10+", label: "Anni di Esperienza" },
        { value: "24h", label: "Risposta Garantita" },
      ];
      return `
      <section style="padding: 80px 0; background: ${palette.background};">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center;">
          ${metrics.map(m => `
            <div style="padding: 32px 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;">
              <div style="font-size: 2.5rem; font-weight: 800; color: ${palette.accent}; margin-bottom: 8px;">${m.value}</div>
              <div style="color: rgba(${hexToRgb(palette.text)}, 0.6); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.08em;">${m.label}</div>
            </div>`).join("")}
        </div>
      </section>`;

    case "benefits":
      const benefits = (s5.benefits || []).length > 0
        ? s5.benefits!
        : ["Beneficio chiave 1", "Beneficio chiave 2", "Beneficio chiave 3", "Beneficio chiave 4", "Beneficio chiave 5", "Beneficio chiave 6"];
      return `
      <section id="benefits" style="padding: 100px 0; background: ${palette.primary};">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px;">
          <div style="text-align: center; margin-bottom: 64px;">
            <p style="color: ${palette.accent}; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">Perché Sceglierci</p>
            <h2 style="font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: ${palette.text}; margin-bottom: 16px; line-height: 1.2;">Tutto quello che ti serve, senza compromessi</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            ${benefits.slice(0, 6).map((b: string, i: number) => `
              <div style="padding: 32px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
                <div style="width: 44px; height: 44px; background: rgba(${hexToRgb(palette.accent)}, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                  <span style="color: ${palette.accent}; font-size: 1.25rem;">✦</span>
                </div>
                <p style="color: ${palette.text}; font-size: 1rem; line-height: 1.5;">${b}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "services":
      const services = (s5.services || []).length > 0
        ? s5.services!.map((s: { title: string; description: string }) => ({ title: s.title, desc: s.description }))
        : [
            { title: "Servizio Premium 1", desc: "Descrizione dettagliata del primo servizio offerto." },
            { title: "Servizio Premium 2", desc: "Descrizione dettagliata del secondo servizio offerto." },
            { title: "Servizio Premium 3", desc: "Descrizione dettagliata del terzo servizio offerto." },
          ];
      return `
      <section id="servizi" style="padding: 100px 0; background: ${palette.background};">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px;">
          <div style="text-align: center; margin-bottom: 64px;">
            <p style="color: ${palette.accent}; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">I Nostri Servizi</p>
            <h2 style="font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: ${palette.text}; margin-bottom: 16px; line-height: 1.2;">Cosa offriamo a ${placeholder(s1.targetCustomer || "", "te")}</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
            ${services.map((s: { title: string; desc: string }) => `
              <div style="padding: 36px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; transition: all 0.2s;">
                <div style="width: 48px; height: 48px; background: ${palette.accent}20; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                  <span style="font-size: 1.5rem;">◆</span>
                </div>
                <h3 style="color: ${palette.text}; font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">${s.title}</h3>
                <p style="color: rgba(${hexToRgb(palette.text)}, 0.6); font-size: 0.9rem; line-height: 1.6;">${s.desc}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "testimonials":
      const reviews = (s5.reviews || []).length > 0
        ? s5.reviews!
        : [
            { author: "Marco R.", text: "Esperienza fantastica. Risultati oltre le aspettative.", rating: 5 },
            { author: "Giulia M.", text: "Professionalità e competenza ai massimi livelli.", rating: 5 },
            { author: "Luca F.", text: "Consiglio a tutti. Servizio eccellente e team disponibile.", rating: 5 },
          ];
      return `
      <section id="recensioni" style="padding: 100px 0; background: ${palette.primary};">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px;">
          <div style="text-align: center; margin-bottom: 64px;">
            <p style="color: ${palette.accent}; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">Testimonial</p>
            <h2 style="font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: ${palette.text}; margin-bottom: 16px;">${tone.socialProofPrefix} ${Math.floor(Math.random() * 400) + 100} clienti soddisfatti</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            ${reviews.slice(0, 3).map((r: { author: string; text: string; rating: number }) => `
              <div style="padding: 32px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
                <div style="color: ${palette.accent}; font-size: 1.1rem; margin-bottom: 16px;">${"★".repeat(r.rating || 5)}</div>
                <p style="color: rgba(${hexToRgb(palette.text)}, 0.8); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px; font-style: italic;">"${r.text}"</p>
                <p style="color: ${palette.text}; font-weight: 600; font-size: 0.875rem;">— ${r.author}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "faq":
      const faqs = (s5.faqs || []).length > 0
        ? s5.faqs!
        : [
            { question: "Qual è il vostro tempo di risposta?", answer: "Rispondiamo entro 24 ore lavorative a tutte le richieste." },
            { question: "Come funziona il processo?", answer: "Contattaci, definiamo insieme le tue esigenze e procediamo rapidamente." },
            { question: "C'è una garanzia?", answer: s2.hasGuarantee ? "Sì, offriamo una garanzia soddisfatti o rimborsati." : "Offriamo la massima qualità in ogni progetto." },
          ];
      return `
      <section id="faq" style="padding: 100px 0; background: ${palette.background};">
        <div style="max-width: 760px; margin: 0 auto; padding: 0 24px;">
          <div style="text-align: center; margin-bottom: 64px;">
            <p style="color: ${palette.accent}; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">FAQ</p>
            <h2 style="font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: ${palette.text};">Domande Frequenti</h2>
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${faqs.slice(0, 6).map((f: { question: string; answer: string }) => `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px;">
                <h3 style="color: ${palette.text}; font-size: 1rem; font-weight: 600; margin-bottom: 12px;">${f.question}</h3>
                <p style="color: rgba(${hexToRgb(palette.text)}, 0.6); font-size: 0.9rem; line-height: 1.6;">${f.answer}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "final_form":
    case "contact":
      return `
      <section id="contact" style="padding: 100px 0; background: ${palette.primary};">
        <div style="max-width: 640px; margin: 0 auto; padding: 0 24px; text-align: center;">
          <p style="color: ${palette.accent}; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">Contattaci</p>
          <h2 style="font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: ${palette.text}; margin-bottom: 16px;">${primaryCta} — È Gratis</h2>
          <p style="color: rgba(${hexToRgb(palette.text)}, 0.6); margin-bottom: 40px;">Compila il modulo. Risponderemo entro poche ore.</p>
          <form style="text-align: left;">
            <div style="margin-bottom: 16px;"><input type="text" placeholder="Nome e Cognome *" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 14px 16px; color: ${palette.text}; font-size: 0.95rem; outline: none;" /></div>
            <div style="margin-bottom: 16px;"><input type="email" placeholder="Email *" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 14px 16px; color: ${palette.text}; font-size: 0.95rem; outline: none;" /></div>
            <div style="margin-bottom: 16px;"><input type="tel" placeholder="Telefono" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 14px 16px; color: ${palette.text}; font-size: 0.95rem; outline: none;" /></div>
            <div style="margin-bottom: 24px;"><textarea placeholder="Messaggio (opzionale)" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 14px 16px; color: ${palette.text}; font-size: 0.95rem; outline: none; min-height: 100px; resize: vertical;"></textarea></div>
            <button type="submit" style="width: 100%; background: ${palette.accent}; color: ${palette.background}; font-weight: 700; font-size: 1rem; padding: 16px; border-radius: 8px; border: none; cursor: pointer;">${primaryCta}</button>
            <p style="text-align: center; color: rgba(${hexToRgb(palette.text)}, 0.3); font-size: 0.75rem; margin-top: 12px;">🔒 ${placeholder(s5.privacyNote || "", "I tuoi dati sono al sicuro. Nessuno spam.")}</p>
          </form>
        </div>
      </section>`;

    case "how_it_works":
      return `
      <section style="padding: 100px 0; background: ${palette.background};">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px;">
          <div style="text-align: center; margin-bottom: 64px;">
            <p style="color: ${palette.accent}; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">Come Funziona</p>
            <h2 style="font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: ${palette.text};">3 passi per iniziare</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; position: relative;">
            ${[
              { n: "01", title: "Contattaci", desc: "Raccontaci le tue esigenze in pochi minuti." },
              { n: "02", title: "Analizziamo", desc: "Studiamo la soluzione migliore per il tuo caso specifico." },
              { n: "03", title: "Agiamo", desc: "Procediamo velocemente con risultati misurabili." }
            ].map(step => `
              <div style="text-align: center; padding: 40px 24px;">
                <div style="width: 56px; height: 56px; background: rgba(${hexToRgb(palette.accent)}, 0.12); border: 1px solid rgba(${hexToRgb(palette.accent)}, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 0.875rem; font-weight: 800; color: ${palette.accent};">${step.n}</div>
                <h3 style="color: ${palette.text}; font-weight: 700; font-size: 1.1rem; margin-bottom: 12px;">${step.title}</h3>
                <p style="color: rgba(${hexToRgb(palette.text)}, 0.55); font-size: 0.9rem; line-height: 1.6;">${step.desc}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "pain_points":
      return `
      <section style="padding: 100px 0; background: ${palette.primary};">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px;">
          <div style="text-align: center; margin-bottom: 64px;">
            <h2 style="font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: ${palette.text}; margin-bottom: 16px;">Stai affrontando questi problemi?</h2>
            <p style="color: rgba(${hexToRgb(palette.text)}, 0.6); max-width: 560px; margin: 0 auto;">${placeholder(s2.mainProblem || "", "Sappiamo cosa stai vivendo. Abbiamo la soluzione.")}</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 800px; margin: 0 auto;">
            ${[
              "Perdi tempo prezioso ogni giorno",
              "I risultati non arrivano mai come previsto",
              "Non sai da dove iniziare",
              "Hai già provato altre soluzioni senza successo"
            ].map(p => `
              <div style="display: flex; gap: 16px; padding: 24px; background: rgba(255,77,109,0.06); border: 1px solid rgba(255,77,109,0.12); border-radius: 12px;">
                <span style="color: #ff4d6d; font-size: 1.1rem; flex-shrink: 0; margin-top: 2px;">✗</span>
                <p style="color: rgba(${hexToRgb(palette.text)}, 0.75); font-size: 0.95rem; line-height: 1.5;">${p}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "footer":
      return `
      <footer style="background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.06); padding: 48px 0 32px;">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px;">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; margin-bottom: 48px;">
            <div>
              <h3 style="color: ${palette.text}; font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">${brandName}</h3>
              <p style="color: rgba(${hexToRgb(palette.text)}, 0.4); font-size: 0.875rem; line-height: 1.6; max-width: 320px;">${placeholder(s2.usp || "", "La migliore soluzione per le tue esigenze.")}</p>
            </div>
            <div>
              <h4 style="color: rgba(${hexToRgb(palette.text)}, 0.5); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px;">Contatti</h4>
              <p style="color: rgba(${hexToRgb(palette.text)}, 0.6); font-size: 0.875rem; margin-bottom: 8px;">${phone}</p>
              <p style="color: rgba(${hexToRgb(palette.text)}, 0.6); font-size: 0.875rem;">${email}</p>
            </div>
            <div>
              <h4 style="color: rgba(${hexToRgb(palette.text)}, 0.5); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px;">Link</h4>
              <p style="color: rgba(${hexToRgb(palette.text)}, 0.6); font-size: 0.875rem; margin-bottom: 8px;"><a href="#" style="color: inherit; text-decoration: none;">Privacy Policy</a></p>
              <p style="color: rgba(${hexToRgb(palette.text)}, 0.6); font-size: 0.875rem;"><a href="#" style="color: inherit; text-decoration: none;">Cookie Policy</a></p>
            </div>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <p style="color: rgba(${hexToRgb(palette.text)}, 0.3); font-size: 0.8rem;">© ${new Date().getFullYear()} ${brandName}. Tutti i diritti riservati.</p>
            <p style="color: rgba(${hexToRgb(palette.text)}, 0.2); font-size: 0.75rem;">${placeholder(s5.footerNote || "", "P.IVA 00000000000")}</p>
          </div>
        </div>
      </footer>`;

    case "promo_banner":
      return `
      <div style="background: ${palette.accent}; padding: 14px 24px; text-align: center;">
        <p style="color: ${palette.background}; font-weight: 700; font-size: 0.95rem;">${placeholder(s2.promotion || "", "🎉 Offerta Speciale — Scade a breve. Non perdere questa opportunità!")}</p>
      </div>`;

    case "what_happens_next":
      return `
      <section style="padding: 100px 0; background: ${palette.background};">
        <div style="max-width: 760px; margin: 0 auto; padding: 0 24px; text-align: center;">
          <p style="color: ${palette.accent}; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">Il Prossimo Passo</p>
          <h2 style="font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: ${palette.text}; margin-bottom: 48px;">Cosa succede dopo che ci contatti?</h2>
          <div style="display: flex; flex-direction: column; gap: 24px; text-align: left;">
            ${[
              { icon: "📞", title: "Chiamata conoscitiva", desc: "Ti contattiamo entro 24h per capire le tue esigenze specifiche." },
              { icon: "📋", title: "Proposta personalizzata", desc: "Prepariamo una soluzione su misura per la tua situazione." },
              { icon: "🚀", title: "Iniziamo", desc: "Partiamo subito, con obiettivi chiari e tempistiche definite." }
            ].map((step, i) => `
              <div style="display: flex; gap: 20px; padding: 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px;">
                <div style="font-size: 1.5rem; flex-shrink: 0;">${step.icon}</div>
                <div>
                  <h3 style="color: ${palette.text}; font-weight: 600; margin-bottom: 8px;">${step.title}</h3>
                  <p style="color: rgba(${hexToRgb(palette.text)}, 0.55); font-size: 0.9rem; line-height: 1.5;">${step.desc}</p>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "pricing":
      return `
      <section id="pricing" style="padding: 100px 0; background: ${palette.background};">
        <div style="max-width: 1100px; margin: 0 auto; padding: 0 24px; text-align: center;">
          <p style="color: ${palette.accent}; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">Prezzi</p>
          <h2 style="font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: ${palette.text}; margin-bottom: 48px;">${placeholder(s2.price || "", "Investimento accessibile, risultati concreti")}</h2>
          ${s2.promotion ? `<div style="display: inline-flex; background: rgba(${hexToRgb(palette.accent)}, 0.1); border: 1px solid rgba(${hexToRgb(palette.accent)}, 0.2); border-radius: 100px; padding: 8px 20px; margin-bottom: 40px;"><span style="color: ${palette.accent}; font-size: 0.875rem; font-weight: 600;">${s2.promotion}</span></div>` : ""}
          <div style="text-align: center; padding: 48px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; max-width: 480px; margin: 0 auto;">
            <h3 style="color: ${palette.text}; font-size: 1.25rem; font-weight: 700; margin-bottom: 24px;">Inizia Oggi</h3>
            <div style="font-size: 3rem; font-weight: 800; color: ${palette.accent}; margin-bottom: 8px;">${placeholder(s2.price || "", "Su Richiesta")}</div>
            <p style="color: rgba(${hexToRgb(palette.text)}, 0.5); font-size: 0.875rem; margin-bottom: 32px;">${s2.hasGuarantee ? "✓ Garanzia soddisfatti o rimborsati" : "Consulenza gratuita inclusa"}</p>
            <a href="#contact" style="display: inline-flex; background: ${palette.accent}; color: ${palette.background}; font-weight: 700; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-size: 1rem;">${primaryCta}</a>
          </div>
        </div>
      </section>`;

    default:
      return "";
  }
}

// ---- Helper: hex to RGB components ----
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255,255,255";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

// ---- Get palette from wizard data ----
function getPaletteColors(data: WizardData): { primary: string; accent: string; background: string; text: string } {
  const s3 = data.step3 || {};
  
  if (s3.customPrimary && s3.customAccent) {
    return {
      primary: s3.customPrimary,
      accent: s3.customAccent,
      background: "#080808",
      text: "#ffffff",
    };
  }

  // Default by vertical
  const vertical = data.step1?.vertical || "altro";
  const defaultPalettes: Record<string, { primary: string; accent: string; background: string; text: string }> = {
    edilizia: { primary: "#0d1a0d", accent: "#2ecc71", background: "#060f06", text: "#ffffff" },
    moda: { primary: "#0f0f0f", accent: "#ff3e3e", background: "#080808", text: "#ffffff" },
    palestra: { primary: "#0a0f1a", accent: "#00b4d8", background: "#050a12", text: "#ffffff" },
    estetica: { primary: "#1a0808", accent: "#e91e63", background: "#0d0404", text: "#fff5f5" },
    ristorazione: { primary: "#1a0e00", accent: "#ff8c00", background: "#0d0700", text: "#fff5e4" },
    professionisti: { primary: "#051525", accent: "#4da6ff", background: "#030d1a", text: "#e0f2fe" },
    formazione: { primary: "#0d0a1a", accent: "#7c3aed", background: "#07050f", text: "#f3f0ff" },
    franchising: { primary: "#1a1208", accent: "#c9a84c", background: "#0d0b06", text: "#f5e6c8" },
    saas: { primary: "#080c12", accent: "#3dffa0", background: "#050809", text: "#e8edf2" },
    altro: { primary: "#111111", accent: "#3dffa0", background: "#080808", text: "#ffffff" },
  };

  return defaultPalettes[vertical] || defaultPalettes.altro;
}

// ---- Main generation function ----
export function generateLandingPage(data: WizardData): GenerationResult {
  const vertical = (data.step1?.vertical || "altro") as string;
  const pageType = (data.step4?.pageType || "lead_generation") as PageType;
  
  // Determine sections to render
  let sections: SectionType[];
  
  if (data.step4?.enabledSections && data.step4.enabledSections.length > 0) {
    sections = data.step4.enabledSections;
  } else if (PAGE_TYPE_OVERRIDES[pageType]) {
    sections = PAGE_TYPE_OVERRIDES[pageType] as SectionType[];
  } else {
    sections = VERTICAL_SECTION_MAP[vertical] || VERTICAL_SECTION_MAP.altro;
  }

  const palette = getPaletteColors(data);
  const score = computeConversionScore(data);
  
  // Generate HTML for each section
  const generatedSections = sections.map((type, index) => ({
    type,
    html: generateSection(type, data, palette),
    order: index,
  }));

  const fontHeading = data.step3?.fontHeading || "Inter";
  const fontBody = data.step3?.fontBody || "Inter";
  const brandName = data.step1?.brandName || "Brand";

  const fullHtml = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} — ${data.step1?.mainGoal || "Landing Page"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=${fontHeading.replace(" ", "+")}:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
    body { font-family: '${fontHeading}', 'Inter', sans-serif; background: ${palette.background}; color: ${palette.text}; }
    @media (max-width: 768px) {
      [style*="grid-template-columns: repeat(3"], [style*="grid-template-columns: repeat(4"], [style*="grid-template-columns: 2fr 1fr 1fr"], [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
      [style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
      h1 { font-size: 2rem !important; }
    }
  </style>
</head>
<body>
${generatedSections.map(s => s.html).join("\n")}
</body>
</html>`;

  const missingElements: string[] = [];
  if (!data.step5?.headline) missingElements.push("Headline principale");
  if (!(data.step5?.reviews?.length)) missingElements.push("Recensioni clienti");
  if (!data.step5?.phone && !data.step5?.email) missingElements.push("Informazioni di contatto");
  if (!data.step3?.logoUrl) missingElements.push("Logo brand");

  return {
    html: fullHtml,
    css: "",
    sections: generatedSections,
    score,
    missingElements,
  };
}

export { VERTICAL_SECTION_MAP, PAGE_TYPE_OVERRIDES };
