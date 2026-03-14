"use client";

import { useWizard } from "./WizardContext";
import type { Vertical, PageType } from "@/types";
import { VERTICAL_LABELS, PAGE_TYPE_LABELS } from "@/types";

const AWARENESS_LEVELS = [
  { value: "cold", label: "Freddo", desc: "Non ci conosce ancora" },
  { value: "warm", label: "Tiepido", desc: "Ha sentito parlare di noi" },
  { value: "hot", label: "Caldo", desc: "Ci sta già cercando" },
];

export function WizardStep1() {
  const { state, updateStepData, nextStep } = useWizard();
  const data = state.data.step1 || {};

  const update = (field: string, value: unknown) => {
    updateStepData("step1", { [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#e8edf2", letterSpacing: "-0.01em" }}>
          Informazioni Progetto
        </h2>
        <p className="text-sm" style={{ color: "#8899aa" }}>
          Raccontaci il tuo brand e gli obiettivi di questa landing page
        </p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Nome Progetto *
          </label>
          <input
            type="text"
            value={data.projectName || ""}
            onChange={(e) => update("projectName", e.target.value)}
            placeholder="Es. Landing Ristrutturazioni Estate 2025"
            className="prisma-input"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Nome Brand / Azienda *
          </label>
          <input
            type="text"
            value={data.brandName || ""}
            onChange={(e) => update("brandName", e.target.value)}
            placeholder="Es. Rossi Costruzioni Srl"
            className="prisma-input"
            required
          />
        </div>
      </div>

      {/* Vertical */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Settore / Verticale *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {(Object.entries(VERTICAL_LABELS) as [Vertical, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => update("vertical", key)}
              className="px-3 py-2.5 rounded-lg text-xs font-medium text-center transition-all duration-150"
              style={{
                background: data.vertical === key ? "rgba(61,255,160,0.1)" : "#111820",
                border: data.vertical === key ? "1px solid rgba(61,255,160,0.3)" : "1px solid #1e2d3d",
                color: data.vertical === key ? "#3dffa0" : "#8899aa",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Page type */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Tipo di Pagina *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {(Object.entries(PAGE_TYPE_LABELS) as [PageType, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                update("pageType_selection", key);
                updateStepData("step4", { pageType: key });
              }}
              className="px-3 py-2.5 rounded-lg text-xs font-medium text-center transition-all duration-150"
              style={{
                background: (state.data.step4?.pageType === key) ? "rgba(61,255,160,0.1)" : "#111820",
                border: (state.data.step4?.pageType === key) ? "1px solid rgba(61,255,160,0.3)" : "1px solid #1e2d3d",
                color: (state.data.step4?.pageType === key) ? "#3dffa0" : "#8899aa",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Sotto-settore
          </label>
          <input
            type="text"
            value={data.subVertical || ""}
            onChange={(e) => update("subVertical", e.target.value)}
            placeholder="Es. Bagni, cucine, facciate..."
            className="prisma-input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            Località / Zona Operativa
          </label>
          <input
            type="text"
            value={data.location || ""}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Es. Milano e provincia"
            className="prisma-input"
          />
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            CTA Primaria *
          </label>
          <input
            type="text"
            value={data.primaryCta || ""}
            onChange={(e) => update("primaryCta", e.target.value)}
            placeholder="Es. Richiedi Preventivo Gratuito"
            className="prisma-input"
            required
          />
          <p className="mt-1.5 text-2xs" style={{ color: "#4a5a6a" }}>
            Il pulsante principale — deve essere action-oriented
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
            CTA Secondaria
          </label>
          <input
            type="text"
            value={data.secondaryCta || ""}
            onChange={(e) => update("secondaryCta", e.target.value)}
            placeholder="Es. Scopri i nostri lavori"
            className="prisma-input"
          />
        </div>
      </div>

      {/* Target */}
      <div>
        <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Target Cliente
        </label>
        <input
          type="text"
          value={data.targetCustomer || ""}
          onChange={(e) => update("targetCustomer", e.target.value)}
          placeholder="Es. Proprietari di casa tra 35-60 anni che vogliono ristrutturare"
          className="prisma-input"
        />
      </div>

      {/* Awareness */}
      <div>
        <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "#8899aa" }}>
          Livello di Awareness del Pubblico
        </label>
        <div className="grid grid-cols-3 gap-3">
          {AWARENESS_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => update("awarenessLevel", level.value)}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                background: data.awarenessLevel === level.value ? "rgba(61,255,160,0.08)" : "#111820",
                border: data.awarenessLevel === level.value ? "1px solid rgba(61,255,160,0.25)" : "1px solid #1e2d3d",
              }}
            >
              <p className="text-sm font-semibold mb-0.5" style={{ color: data.awarenessLevel === level.value ? "#3dffa0" : "#e8edf2" }}>
                {level.label}
              </p>
              <p className="text-xs" style={{ color: "#8899aa" }}>{level.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4" style={{ borderTop: "1px solid #1e2d3d" }}>
        <button type="submit" className="btn-primary">
          Continua
          <span>→</span>
        </button>
      </div>
    </form>
  );
}
