"use client";

// ============================================
// WIZARD STEP 2 — Offer
// ============================================
import { useWizard } from "./WizardContext";

export function WizardStep2() {
  const { state, updateStepData, nextStep, prevStep } = useWizard();
  const data = state.data.step2 || {};
  const update = (field: string, value: unknown) =>
    updateStepData("step2", { [field]: value });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#e8edf2", letterSpacing: "-0.01em" }}>
          L&apos;Offerta
        </h2>
        <p className="text-sm" style={{ color: "#8899aa" }}>
          Definisci il prodotto/servizio e la proposta di valore
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Prodotto / Servizio *
          </label>
          <input
            type="text"
            value={data.productService || ""}
            onChange={(e) => update("productService", e.target.value)}
            placeholder="Es. Ristrutturazione bagni chiavi in mano"
            className="prisma-input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Prezzo / Range Prezzo
          </label>
          <input
            type="text"
            value={data.price || ""}
            onChange={(e) => update("price", e.target.value)}
            placeholder="Es. Da €2.500 oppure Su richiesta"
            className="prisma-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Promozione Attiva
        </label>
        <input
          type="text"
          value={data.promotion || ""}
          onChange={(e) => update("promotion", e.target.value)}
          placeholder="Es. Sconto 15% per cantieri iniziati entro maggio"
          className="prisma-input"
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          USP — Vantaggio Competitivo Principale
        </label>
        <textarea
          value={data.usp || ""}
          onChange={(e) => update("usp", e.target.value)}
          placeholder="Es. Unici nel territorio con garanzia 5 anni su tutti i lavori, sopralluogo gratuito entro 48h"
          className="prisma-textarea"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Problema Principale del Target
          </label>
          <textarea
            value={data.mainProblem || ""}
            onChange={(e) => update("mainProblem", e.target.value)}
            placeholder="Es. Difficoltà a trovare imprese affidabili, prezzi opachi, tempi infiniti"
            className="prisma-textarea"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Desiderio Principale del Target
          </label>
          <textarea
            value={data.mainDesire || ""}
            onChange={(e) => update("mainDesire", e.target.value)}
            placeholder="Es. Un bagno nuovo in poco tempo, senza stress e rispettando il budget"
            className="prisma-textarea"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Obiezioni Frequenti
          </label>
          <textarea
            value={data.objections || ""}
            onChange={(e) => update("objections", e.target.value)}
            placeholder="Es. 'Costa troppo', 'Ho già un'impresa', 'Non ho tempo'"
            className="prisma-textarea"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Risultati Promessi
          </label>
          <textarea
            value={data.promisedResults || ""}
            onChange={(e) => update("promisedResults", e.target.value)}
            placeholder="Es. Bagno rinnovato in 10 giorni, costo fisso garantito, zero pensieri"
            className="prisma-textarea"
            rows={3}
          />
        </div>
      </div>

      {/* Conversion elements */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Elementi di Conversione
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "hasBonus", label: "Bonus", desc: "Regalo aggiuntivo" },
            { key: "hasGuarantee", label: "Garanzia", desc: "Soddisfatti o rimborsati" },
            { key: "hasUrgency", label: "Urgenza", desc: "Offerta a tempo" },
            { key: "hasScarcity", label: "Scarsità", desc: "Posti/quantità limitate" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => update(item.key, !data[item.key as keyof typeof data])}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                background: data[item.key as keyof typeof data] ? "rgba(61,255,160,0.08)" : "#111820",
                border: data[item.key as keyof typeof data] ? "1px solid rgba(61,255,160,0.25)" : "1px solid #1e2d3d",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center text-xs"
                  style={{
                    background: data[item.key as keyof typeof data] ? "#3dffa0" : "#1e2d3d",
                    color: data[item.key as keyof typeof data] ? "#080c0e" : "#4a5a6a",
                  }}
                >
                  {data[item.key as keyof typeof data] ? "✓" : ""}
                </div>
                <span className="text-xs font-semibold" style={{ color: data[item.key as keyof typeof data] ? "#3dffa0" : "#e8edf2" }}>
                  {item.label}
                </span>
              </div>
              <p className="text-2xs" style={{ color: "#4a5a6a" }}>{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid #1e2d3d" }}>
        <button type="button" onClick={prevStep} className="btn-secondary">
          ← Indietro
        </button>
        <button type="button" onClick={nextStep} className="btn-primary">
          Continua →
        </button>
      </div>
    </div>
  );
}

// ============================================
// WIZARD STEP 3 — Branding
// ============================================
import { DEFAULT_PALETTES } from "@/types";
import type { VisualStyle } from "@/types";

const VISUAL_STYLES: { value: VisualStyle; label: string }[] = [
  { value: "premium", label: "Premium" },
  { value: "corporate", label: "Corporate" },
  { value: "bold", label: "Bold" },
  { value: "minimal", label: "Minimal" },
  { value: "aggressive", label: "Aggressive" },
  { value: "luxury", label: "Luxury" },
  { value: "street", label: "Street" },
  { value: "industrial", label: "Industrial" },
];

export function WizardStep3() {
  const { state, updateStepData, nextStep, prevStep } = useWizard();
  const data = state.data.step3 || {};
  const update = (field: string, value: unknown) =>
    updateStepData("step3", { [field]: value });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#e8edf2", letterSpacing: "-0.01em" }}>
          Branding & Visual Identity
        </h2>
        <p className="text-sm" style={{ color: "#8899aa" }}>
          Scegli la palette e lo stile visivo della landing
        </p>
      </div>

      {/* Palette presets */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Palette Predefinite
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DEFAULT_PALETTES.map((palette) => (
            <button
              key={palette.id}
              type="button"
              onClick={() => update("paletteId", palette.id)}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background: data.paletteId === palette.id ? "rgba(61,255,160,0.06)" : "#111820",
                border: data.paletteId === palette.id ? "1px solid rgba(61,255,160,0.25)" : "1px solid #1e2d3d",
              }}
            >
              {/* Color swatches */}
              <div className="flex gap-1.5 mb-3">
                {palette.preview.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-md"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: data.paletteId === palette.id ? "#3dffa0" : "#e8edf2" }}>
                {palette.name}
              </p>
              <p className="text-2xs" style={{ color: "#4a5a6a" }}>{palette.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom colors */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Colori Custom (opzionale)
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "customPrimary", label: "Primario" },
            { key: "customSecondary", label: "Secondario" },
            { key: "customAccent", label: "Accento" },
          ].map((c) => (
            <div key={c.key}>
              <label className="text-xs mb-2 block" style={{ color: "#8899aa" }}>{c.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={(data[c.key as keyof typeof data] as string) || "#080c0e"}
                  onChange={(e) => update(c.key, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  style={{ padding: "2px" }}
                />
                <input
                  type="text"
                  value={(data[c.key as keyof typeof data] as string) || ""}
                  onChange={(e) => update(c.key, e.target.value)}
                  placeholder="#000000"
                  className="prisma-input flex-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual style */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Stile Visual
        </label>
        <div className="grid grid-cols-4 gap-2">
          {VISUAL_STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => update("visualStyle", style.value)}
              className="py-2.5 px-3 rounded-lg text-xs font-medium transition-all"
              style={{
                background: data.visualStyle === style.value ? "rgba(61,255,160,0.1)" : "#111820",
                border: data.visualStyle === style.value ? "1px solid rgba(61,255,160,0.3)" : "1px solid #1e2d3d",
                color: data.visualStyle === style.value ? "#3dffa0" : "#8899aa",
              }}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logo URL */}
      <div>
        <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          URL Logo
        </label>
        <input
          type="url"
          value={data.logoUrl || ""}
          onChange={(e) => update("logoUrl", e.target.value)}
          placeholder="https://tuobrand.com/logo.png"
          className="prisma-input"
        />
        <p className="mt-1.5 text-2xs" style={{ color: "#4a5a6a" }}>
          Incolla l&apos;URL pubblico del tuo logo (PNG o SVG consigliato)
        </p>
      </div>

      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid #1e2d3d" }}>
        <button type="button" onClick={prevStep} className="btn-secondary">← Indietro</button>
        <button type="button" onClick={nextStep} className="btn-primary">Continua →</button>
      </div>
    </div>
  );
}

// ============================================
// WIZARD STEP 4 — Structure
// ============================================
import type { ToneOfVoice, CopyLength, SectionType } from "@/types";
import { VERTICAL_SECTION_MAP } from "@/lib/generator";

const TONE_OPTIONS: { value: ToneOfVoice; label: string; desc: string }[] = [
  { value: "diretto", label: "Diretto", desc: "Senza giri di parole" },
  { value: "professionale", label: "Professionale", desc: "Autorevole e formale" },
  { value: "premium", label: "Premium", desc: "Esclusivo e curato" },
  { value: "amichevole", label: "Amichevole", desc: "Caldo e vicino" },
  { value: "tecnico", label: "Tecnico", desc: "Preciso e dettagliato" },
  { value: "aggressivo", label: "Aggressivo", desc: "Push forte alle vendite" },
  { value: "aspirazionale", label: "Aspirazionale", desc: "Sogni e trasformazione" },
];

export function WizardStep4() {
  const { state, updateStepData, nextStep, prevStep } = useWizard();
  const data = state.data.step4 || {};
  const vertical = state.data.step1?.vertical || "altro";
  const update = (field: string, value: unknown) =>
    updateStepData("step4", { [field]: value });

  const defaultSections = (VERTICAL_SECTION_MAP[vertical] || VERTICAL_SECTION_MAP.altro) as SectionType[];
  const enabledSections = (data.enabledSections as SectionType[] | undefined) || defaultSections;

  const toggleSection = (section: SectionType) => {
    const current = enabledSections;
    const updated = current.includes(section)
      ? current.filter((s) => s !== section)
      : [...current, section];
    update("enabledSections", updated);
  };

  const SECTION_LABELS: Record<string, string> = {
    hero_cta: "Hero con CTA",
    hero_form: "Hero con Form",
    proof_bar: "Proof Bar",
    metrics: "Metriche / Numeri",
    pain_points: "Pain Points",
    benefits: "Benefici",
    how_it_works: "Come funziona",
    services: "Servizi",
    case_studies: "Case Studies",
    testimonials: "Testimonianze",
    before_after: "Before/After",
    gallery: "Galleria",
    vsl_video: "Video VSL",
    process: "Processo",
    pricing: "Prezzi",
    faq: "FAQ",
    contact: "Contatti",
    final_form: "Form Finale",
    map: "Mappa",
    footer: "Footer",
    promo_banner: "Banner Promo",
    why_choose_us: "Perché noi",
    how_we_work: "Come lavoriamo",
    what_happens_next: "Passo successivo",
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#e8edf2", letterSpacing: "-0.01em" }}>
          Struttura & Tone of Voice
        </h2>
        <p className="text-sm" style={{ color: "#8899aa" }}>
          Definisci lo stile comunicativo e le sezioni della tua landing
        </p>
      </div>

      {/* Tone of voice */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Tone of Voice
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TONE_OPTIONS.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => update("toneOfVoice", tone.value)}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                background: data.toneOfVoice === tone.value ? "rgba(61,255,160,0.08)" : "#111820",
                border: data.toneOfVoice === tone.value ? "1px solid rgba(61,255,160,0.25)" : "1px solid #1e2d3d",
              }}
            >
              <p className="text-xs font-semibold mb-0.5" style={{ color: data.toneOfVoice === tone.value ? "#3dffa0" : "#e8edf2" }}>
                {tone.label}
              </p>
              <p className="text-2xs" style={{ color: "#4a5a6a" }}>{tone.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Copy length */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Lunghezza Copy
        </label>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: "corto", label: "Corto", desc: "Diretto, meno sezioni" },
            { value: "medio", label: "Medio", desc: "Bilanciato, raccomandato" },
            { value: "lungo", label: "Lungo", desc: "Completo, più dettagli" },
          ] as { value: CopyLength; label: string; desc: string }[]).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("copyLength", opt.value)}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                background: data.copyLength === opt.value ? "rgba(61,255,160,0.08)" : "#111820",
                border: data.copyLength === opt.value ? "1px solid rgba(61,255,160,0.25)" : "1px solid #1e2d3d",
              }}
            >
              <p className="text-sm font-semibold mb-0.5" style={{ color: data.copyLength === opt.value ? "#3dffa0" : "#e8edf2" }}>
                {opt.label}
              </p>
              <p className="text-xs" style={{ color: "#4a5a6a" }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Hero layout */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Layout Hero
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { value: "centered", label: "Centrato" },
            { value: "split_left", label: "Split sx" },
            { value: "split_right", label: "Split dx" },
            { value: "fullscreen", label: "Full screen" },
            { value: "minimal", label: "Minimal" },
          ].map((layout) => (
            <button
              key={layout.value}
              type="button"
              onClick={() => update("heroLayout", layout.value)}
              className="py-2.5 px-3 rounded-lg text-xs font-medium text-center transition-all"
              style={{
                background: data.heroLayout === layout.value ? "rgba(61,255,160,0.1)" : "#111820",
                border: data.heroLayout === layout.value ? "1px solid rgba(61,255,160,0.3)" : "1px solid #1e2d3d",
                color: data.heroLayout === layout.value ? "#3dffa0" : "#8899aa",
              }}
            >
              {layout.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Sezioni da Includere
          </label>
          <button
            type="button"
            onClick={() => update("enabledSections", defaultSections)}
            className="text-xs font-medium"
            style={{ color: "#3dffa0" }}
          >
            Reset predefinito
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SECTION_LABELS).map(([key, label]) => {
            const isEnabled = enabledSections.includes(key as SectionType);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSection(key as SectionType)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: isEnabled ? "rgba(61,255,160,0.1)" : "#111820",
                  border: isEnabled ? "1px solid rgba(61,255,160,0.25)" : "1px solid #1e2d3d",
                  color: isEnabled ? "#3dffa0" : "#4a5a6a",
                }}
              >
                {isEnabled && <span className="mr-1">✓</span>}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid #1e2d3d" }}>
        <button type="button" onClick={prevStep} className="btn-secondary">← Indietro</button>
        <button type="button" onClick={nextStep} className="btn-primary">Continua →</button>
      </div>
    </div>
  );
}

// ============================================
// WIZARD STEP 5 — Content
// ============================================
export function WizardStep5() {
  const { state, updateStepData, nextStep, prevStep } = useWizard();
  const data = state.data.step5 || {};
  const update = (field: string, value: unknown) =>
    updateStepData("step5", { [field]: value });

  const benefits = (data.benefits as string[] | undefined) || ["", "", ""];
  const updateBenefit = (index: number, value: string) => {
    const updated = [...benefits];
    updated[index] = value;
    update("benefits", updated);
  };

  const faqs = (data.faqs as { question: string; answer: string }[] | undefined) || [];
  const addFaq = () => update("faqs", [...faqs, { question: "", answer: "" }]);
  const updateFaq = (index: number, field: string, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    update("faqs", updated);
  };
  const removeFaq = (index: number) => {
    update("faqs", faqs.filter((_: unknown, i: number) => i !== index));
  };

  const reviews = (data.reviews as { author: string; text: string; rating: number }[] | undefined) || [];
  const addReview = () => update("reviews", [...reviews, { author: "", text: "", rating: 5 }]);
  const updateReview = (index: number, field: string, value: string | number) => {
    const updated = [...reviews];
    updated[index] = { ...updated[index], [field]: value };
    update("reviews", updated);
  };
  const removeReview = (index: number) => {
    update("reviews", reviews.filter((_: unknown, i: number) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#e8edf2", letterSpacing: "-0.01em" }}>
          Contenuto & Testi
        </h2>
        <p className="text-sm" style={{ color: "#8899aa" }}>
          Inserisci i testi principali — se vuoi, i placeholder intelligenti completano il resto
        </p>
      </div>

      {/* Headline */}
      <div>
        <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Headline Principale
        </label>
        <input
          type="text"
          value={(data.headline as string) || ""}
          onChange={(e) => update("headline", e.target.value)}
          placeholder="Es. Il Bagno dei Tuoi Sogni in 10 Giorni. Garantito."
          className="prisma-input text-lg"
        />
        <p className="mt-1.5 text-2xs" style={{ color: "#4a5a6a" }}>
          Massimo impatto. Parla al beneficio finale o al problema risolto.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Subheadline
        </label>
        <textarea
          value={(data.subheadline as string) || ""}
          onChange={(e) => update("subheadline", e.target.value)}
          placeholder="Es. Ristrutturiamo bagni a Milano con materiali di qualità, tempi certi e prezzo fisso senza sorprese."
          className="prisma-textarea"
          rows={2}
        />
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Benefit Principali
        </label>
        <div className="space-y-2">
          {benefits.map((b: string, i: number) => (
            <input
              key={i}
              type="text"
              value={b}
              onChange={(e) => updateBenefit(i, e.target.value)}
              placeholder={`Benefit ${i + 1} — es. Sopralluogo gratuito entro 48h`}
              className="prisma-input"
            />
          ))}
          <button
            type="button"
            onClick={() => update("benefits", [...benefits, ""])}
            className="text-xs font-medium flex items-center gap-1.5 mt-1"
            style={{ color: "#3dffa0" }}
          >
            + Aggiungi benefit
          </button>
        </div>
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>Telefono</label>
          <input
            type="tel"
            value={(data.phone as string) || ""}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+39 02 1234567"
            className="prisma-input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>Email</label>
          <input
            type="email"
            value={(data.email as string) || ""}
            onChange={(e) => update("email", e.target.value)}
            placeholder="info@tuobrand.it"
            className="prisma-input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>Indirizzo</label>
          <input
            type="text"
            value={(data.address as string) || ""}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Via Roma 1, Milano"
            className="prisma-input"
          />
        </div>
      </div>

      {/* Reviews */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Recensioni / Testimonianze
          </label>
          <button type="button" onClick={addReview} className="text-xs font-medium" style={{ color: "#3dffa0" }}>
            + Aggiungi
          </button>
        </div>
        <div className="space-y-3">
          {reviews.map((r: { author: string; text: string; rating: number }, i: number) => (
            <div
              key={i}
              className="p-4 rounded-xl space-y-3"
              style={{ background: "#111820", border: "1px solid #1e2d3d" }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={r.author}
                  onChange={(e) => updateReview(i, "author", e.target.value)}
                  placeholder="Nome cliente"
                  className="prisma-input flex-1"
                />
                <select
                  value={r.rating}
                  onChange={(e) => updateReview(i, "rating", Number(e.target.value))}
                  className="prisma-input w-20"
                >
                  {[5, 4, 3].map((n) => (
                    <option key={n} value={n}>{n}⭐</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeReview(i)}
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ color: "#ff4d6d", background: "rgba(255,77,109,0.08)" }}
                >
                  ✕
                </button>
              </div>
              <textarea
                value={r.text}
                onChange={(e) => updateReview(i, "text", e.target.value)}
                placeholder="Testo della recensione..."
                className="prisma-textarea"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8899aa" }}>
            FAQ
          </label>
          <button type="button" onClick={addFaq} className="text-xs font-medium" style={{ color: "#3dffa0" }}>
            + Aggiungi domanda
          </button>
        </div>
        <div className="space-y-3">
          {faqs.map((f: { question: string; answer: string }, i: number) => (
            <div
              key={i}
              className="p-4 rounded-xl space-y-3"
              style={{ background: "#111820", border: "1px solid #1e2d3d" }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={f.question}
                  onChange={(e) => updateFaq(i, "question", e.target.value)}
                  placeholder="Domanda..."
                  className="prisma-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ color: "#ff4d6d", background: "rgba(255,77,109,0.08)" }}
                >
                  ✕
                </button>
              </div>
              <textarea
                value={f.answer}
                onChange={(e) => updateFaq(i, "answer", e.target.value)}
                placeholder="Risposta..."
                className="prisma-textarea"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid #1e2d3d" }}>
        <button type="button" onClick={prevStep} className="btn-secondary">← Indietro</button>
        <button type="button" onClick={nextStep} className="btn-primary">Genera Preview →</button>
      </div>
    </div>
  );
}
