"use client";

import { useState } from "react";
import { useWizard } from "./WizardContext";
import { computeConversionScore } from "@/lib/generator";
import { VERTICAL_LABELS, PAGE_TYPE_LABELS } from "@/types";
import {
  Zap,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 70 ? "#3dffa0" : score >= 40 ? "#f5a623" : "#ff4d6d";
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg width="96" height="96" className="-rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#1e2d3d"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-2xs" style={{ color: "#4a5a6a" }}>
          /100
        </span>
      </div>
    </div>
  );
}

export function WizardStep6() {
  const { state, prevStep, generate } = useWizard();
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isDownloading, setIsDownloading] = useState(false);

  const score = computeConversionScore(state.data);
  const s1 = state.data.step1 || {};
  const s2 = state.data.step2 || {};

  const handleDownload = () => {
    if (!state.generationResult) return;
    setIsDownloading(true);
    const blob = new Blob([state.generationResult.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(s1.projectName as string || "landing")?.toLowerCase().replace(/\s+/g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const previewWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#e8edf2", letterSpacing: "-0.01em" }}>
          Riepilogo & Generazione
        </h2>
        <p className="text-sm" style={{ color: "#8899aa" }}>
          Controlla i dati, verifica il punteggio e genera la tua landing page
        </p>
      </div>

      {/* Summary + Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summary */}
        <div className="md:col-span-2 prisma-card p-5">
          <p className="section-label mb-4">Riepilogo Progetto</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {[
              { label: "Progetto", value: s1.projectName as string },
              { label: "Brand", value: s1.brandName as string },
              { label: "Settore", value: s1.vertical ? VERTICAL_LABELS[s1.vertical as keyof typeof VERTICAL_LABELS] : "—" },
              { label: "Tipo Pagina", value: state.data.step4?.pageType ? PAGE_TYPE_LABELS[state.data.step4.pageType as keyof typeof PAGE_TYPE_LABELS] : "—" },
              { label: "Località", value: s1.location as string || "—" },
              { label: "CTA Primaria", value: s1.primaryCta as string || "—" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xs uppercase tracking-wider" style={{ color: "#4a5a6a" }}>
                  {item.label}
                </p>
                <p className="text-sm font-medium mt-0.5" style={{ color: "#e8edf2" }}>
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="prisma-card p-5 flex flex-col items-center justify-center text-center">
          <p className="section-label mb-4">Score Conversione</p>
          <ScoreCircle score={score.total} />
          <p className="text-xs mt-3" style={{ color: "#8899aa" }}>
            {score.total >= 70
              ? "Ottimo setup!"
              : score.total >= 40
              ? "Buono, può migliorare"
              : "Completa più campi"}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="prisma-card p-5">
        <p className="section-label mb-4">Breakdown Score</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(score.breakdown).map(([key, value]) => {
            const maxVal = 20;
            const pct = (value / maxVal) * 100;
            const color = pct >= 70 ? "#3dffa0" : pct >= 40 ? "#f5a623" : "#ff4d6d";
            const labels: Record<string, string> = {
              headline: "Headline",
              socialProof: "Prove Sociali",
              cta: "CTA",
              urgency: "Urgenza",
              trust: "Fiducia",
              clarity: "Chiarezza",
            };
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs" style={{ color: "#8899aa" }}>{labels[key]}</span>
                  <span className="text-xs font-semibold" style={{ color }}>{value}/{maxVal}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1e2d3d" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing elements / suggestions */}
      {score.suggestions.length > 0 && (
        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: "#f5a623" }} />
            <p className="text-xs font-semibold" style={{ color: "#f5a623" }}>
              Suggerimenti per migliorare le conversioni
            </p>
          </div>
          <ul className="space-y-1.5">
            {score.suggestions.map((s, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: "#8899aa" }}>
                <span style={{ color: "#f5a623", marginTop: "1px" }}>→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Generate button */}
      {!state.generationResult ? (
        <div className="text-center py-6">
          <button
            type="button"
            onClick={generate}
            disabled={state.isGenerating}
            className="btn-primary text-base px-8 py-4"
            style={{ height: "auto", fontSize: "1rem" }}
          >
            {state.isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Generazione in corso...
              </>
            ) : (
              <>
                <Zap size={18} />
                Genera Landing Page
              </>
            )}
          </button>
          <p className="text-xs mt-3" style={{ color: "#4a5a6a" }}>
            La generazione richiede pochi secondi
          </p>
        </div>
      ) : (
        /* Preview */
        <div>
          <div
            className="prisma-card overflow-hidden"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Preview toolbar */}
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: "1px solid #1e2d3d" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <div
                  className="ml-3 rounded-md px-3 py-1 text-xs flex-1 max-w-xs text-center"
                  style={{ background: "#0d1117", color: "#4a5a6a", border: "1px solid #1e2d3d" }}
                >
                  {(s1.brandName as string || "landing")?.toLowerCase().replace(/\s+/g, "")}.html
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Viewport controls */}
                <div className="flex items-center gap-1">
                  {([
                    { mode: "desktop", Icon: Monitor },
                    { mode: "tablet", Icon: Tablet },
                    { mode: "mobile", Icon: Smartphone },
                  ] as { mode: "desktop" | "tablet" | "mobile"; Icon: typeof Monitor }[]).map(({ mode, Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className="p-1.5 rounded-md transition-colors"
                      style={{
                        color: viewMode === mode ? "#3dffa0" : "#4a5a6a",
                        background: viewMode === mode ? "rgba(61,255,160,0.1)" : "transparent",
                      }}
                    >
                      <Icon size={15} />
                    </button>
                  ))}
                </div>

                <div style={{ width: "1px", height: "20px", background: "#1e2d3d" }} />

                <button
                  onClick={generate}
                  className="btn-ghost text-xs py-1.5 px-3"
                >
                  <RefreshCw size={13} />
                  Rigenera
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  <Download size={13} />
                  {isDownloading ? "Download..." : "Scarica HTML"}
                </button>
              </div>
            </div>

            {/* Preview iframe */}
            <div
              className="transition-all duration-300 overflow-auto flex justify-center"
              style={{
                background: "#050809",
                minHeight: "600px",
                padding: viewMode !== "desktop" ? "16px" : "0",
              }}
            >
              <div
                className="transition-all duration-300"
                style={{
                  width: previewWidths[viewMode],
                  maxWidth: "100%",
                  background: "#ffffff",
                }}
              >
                <iframe
                  srcDoc={state.generationResult.html}
                  title="Landing Page Preview"
                  className="w-full"
                  style={{ height: "700px", border: "none", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* Success message */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl mt-4"
            style={{
              background: "rgba(61,255,160,0.06)",
              border: "1px solid rgba(61,255,160,0.15)",
            }}
          >
            <CheckCircle size={16} style={{ color: "#3dffa0", flexShrink: 0 }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#3dffa0" }}>
                Landing page generata con successo
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#8899aa" }}>
                Progetto salvato nel database · Score: {score.total}/100 · {state.generationResult.sections.length} sezioni
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid #1e2d3d" }}>
        <button type="button" onClick={prevStep} className="btn-secondary">← Modifica Contenuto</button>
      </div>
    </div>
  );
}
