export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProject, updateProject, duplicateProject, deleteProject } from "@/lib/projects";
import { generateLandingPage } from "@/lib/generator";
import type { Project } from "@/types";
import { VERTICAL_LABELS, PAGE_TYPE_LABELS } from "@/types";
import {
  ChevronLeft,
  Edit3,
  Copy,
  Trash2,
  Download,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  ExternalLink,
  Clock,
  Globe,
  BarChart2,
  Zap,
  CheckCircle,
  AlertTriangle,
  Code,
} from "lucide-react";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("it-IT", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    published: { label: "Pubblicato", class: "badge-active" },
    active: { label: "Attivo", class: "badge-active" },
    draft: { label: "Bozza", class: "badge-draft" },
    archived: { label: "Archiviato", class: "badge-draft" },
  };
  const s = map[status] || map.draft;
  return <span className={s.class}>{s.label}</span>;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"preview" | "details" | "export">("preview");
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    const proj = await getProject(id);
    if (!proj) { router.push("/projects"); return; }
    setProject(proj);
    setLoading(false);
  };

  const handleRegenerate = async () => {
    if (!project) return;
    setRegenerating(true);
    const result = generateLandingPage(project.wizardData);
    const updated = await updateProject(id, {
      generatedHtml: result.html,
      generatedCss: result.css,
      conversionScore: result.score.total,
      status: "active",
    });
    setProject(updated);
    setRegenerating(false);
  };

  const handleDuplicate = async () => {
    const copy = await duplicateProject(id);
    router.push(`/projects/${copy.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Eliminare definitivamente questo progetto?")) return;
    await deleteProject(id);
    router.push("/projects");
  };

  const handleDownloadHtml = () => {
    if (!project?.generatedHtml) return;
    const blob = new Blob([project.generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    if (!project) return;
    const blob = new Blob([JSON.stringify(project.wizardData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewWidths: Record<string, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="h-10 w-48 rounded-xl shimmer-loading" />
          <div className="h-64 rounded-2xl shimmer-loading" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  const scoreColor = !project.conversionScore ? "#4a5a6a"
    : project.conversionScore >= 70 ? "#3dffa0"
    : project.conversionScore >= 40 ? "#f5a623"
    : "#ff4d6d";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm mb-5 transition-colors"
          style={{ color: "#8899aa" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e8edf2")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#8899aa")}
        >
          <ChevronLeft size={15} />
          Tutti i progetti
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#e8edf2", letterSpacing: "-0.02em" }}
              >
                {project.name}
              </h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm" style={{ color: "#8899aa" }}>
              {VERTICAL_LABELS[project.vertical]} · {PAGE_TYPE_LABELS[project.pageType]}
              {project.brandName && ` · ${project.brandName}`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handleDuplicate} className="btn-secondary text-sm">
              <Copy size={14} /> Duplica
            </button>
            <Link href={`/builder/${project.id}`} className="btn-secondary text-sm">
              <Edit3 size={14} /> Modifica
            </Link>
            <button onClick={handleDelete} className="btn-danger text-sm">
              <Trash2 size={14} /> Elimina
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
        {[
          {
            label: "Score CRO",
            value: project.conversionScore ? `${project.conversionScore}/100` : "—",
            icon: BarChart2,
            color: scoreColor,
          },
          {
            label: "Stato",
            value: project.status === "published" ? "Live" : project.status === "active" ? "Generato" : "Bozza",
            icon: Globe,
            color: project.status === "published" ? "#3dffa0" : "#8899aa",
          },
          {
            label: "Creato",
            value: new Date(project.createdAt).toLocaleDateString("it-IT"),
            icon: Clock,
            color: "#8899aa",
          },
          {
            label: "Aggiornato",
            value: new Date(project.updatedAt).toLocaleDateString("it-IT"),
            icon: RefreshCw,
            color: "#8899aa",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="prisma-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color: card.color }} />
                <span className="text-2xs uppercase tracking-wider" style={{ color: "#4a5a6a" }}>
                  {card.label}
                </span>
              </div>
              <p className="text-lg font-bold" style={{ color: card.color }}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 mb-6 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        {(["preview", "details", "export"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              background: activeTab === tab ? "#1a2330" : "transparent",
              color: activeTab === tab ? "#e8edf2" : "#8899aa",
              border: activeTab === tab ? "1px solid #1e2d3d" : "1px solid transparent",
            }}
          >
            {tab === "preview" ? "Anteprima" : tab === "details" ? "Dettagli" : "Export"}
          </button>
        ))}
      </div>

      {/* TAB: PREVIEW */}
      {activeTab === "preview" && (
        <div className="animate-fade-in">
          {project.generatedHtml ? (
            <div className="prisma-card overflow-hidden">
              {/* Toolbar */}
              <div
                className="flex items-center gap-3 px-5 py-3.5 flex-wrap"
                style={{ borderBottom: "1px solid #1e2d3d" }}
              >
                {/* Fake browser chrome */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
                </div>

                <div
                  className="flex-1 max-w-xs rounded-md px-3 py-1 text-xs text-center hidden sm:block"
                  style={{ background: "#0d1117", color: "#4a5a6a", border: "1px solid #1e2d3d" }}
                >
                  {project.name.toLowerCase().replace(/\s+/g, "")}.html
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
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
                          background: viewMode === mode ? "rgba(61,255,160,0.08)" : "transparent",
                        }}
                      >
                        <Icon size={15} />
                      </button>
                    ))}
                  </div>

                  <div style={{ width: "1px", height: "18px", background: "#1e2d3d" }} />

                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: "transparent",
                      border: "1px solid #1e2d3d",
                      color: "#8899aa",
                    }}
                  >
                    <RefreshCw size={12} className={regenerating ? "animate-spin" : ""} />
                    {regenerating ? "Rigenerando..." : "Rigenera"}
                  </button>

                  <button
                    onClick={handleDownloadHtml}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: "#3dffa0", color: "#080c0e" }}
                  >
                    <Download size={12} />
                    Scarica HTML
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div
                className="flex justify-center transition-all duration-300"
                style={{ background: "#050809", minHeight: "600px", padding: viewMode !== "desktop" ? "20px" : "0" }}
              >
                <div
                  style={{
                    width: previewWidths[viewMode],
                    maxWidth: "100%",
                    transition: "width 0.3s ease",
                  }}
                >
                  <iframe
                    srcDoc={project.generatedHtml}
                    title="Preview"
                    style={{ width: "100%", height: "700px", border: "none", display: "block" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* No generated HTML yet */
            <div
              className="rounded-2xl py-24 text-center"
              style={{ border: "1px dashed #1e2d3d" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(61,255,160,0.06)", border: "1px solid rgba(61,255,160,0.12)" }}
              >
                <Zap size={22} style={{ color: "#3dffa0" }} />
              </div>
              <p className="text-base font-semibold mb-2" style={{ color: "#e8edf2" }}>
                Landing page non ancora generata
              </p>
              <p className="text-sm mb-8" style={{ color: "#8899aa" }}>
                Completa il wizard per generare la pagina
              </p>
              <Link href={`/builder/${project.id}`} className="btn-primary">
                <Edit3 size={16} />
                Apri il Builder
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB: DETAILS */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Step 1 */}
          <div className="prisma-card p-6">
            <p className="section-label mb-5">Informazioni Progetto</p>
            <dl className="space-y-3">
              {[
                ["Brand", project.wizardData.step1?.brandName as string],
                ["Settore", VERTICAL_LABELS[project.vertical]],
                ["Tipo Pagina", PAGE_TYPE_LABELS[project.pageType]],
                ["Località", project.wizardData.step1?.location as string],
                ["CTA Primaria", project.wizardData.step1?.primaryCta as string],
                ["Target", project.wizardData.step1?.targetCustomer as string],
              ].map(([label, value]) => value ? (
                <div key={label} className="flex gap-4">
                  <dt className="text-xs w-28 flex-shrink-0 pt-0.5" style={{ color: "#4a5a6a" }}>{label}</dt>
                  <dd className="text-sm flex-1" style={{ color: "#e8edf2" }}>{value}</dd>
                </div>
              ) : null)}
            </dl>
          </div>

          {/* Step 2 */}
          <div className="prisma-card p-6">
            <p className="section-label mb-5">Offerta</p>
            <dl className="space-y-3">
              {[
                ["Prodotto/Servizio", project.wizardData.step2?.productService as string],
                ["Prezzo", project.wizardData.step2?.price as string],
                ["Promozione", project.wizardData.step2?.promotion as string],
                ["USP", project.wizardData.step2?.usp as string],
              ].map(([label, value]) => value ? (
                <div key={label} className="flex gap-4">
                  <dt className="text-xs w-28 flex-shrink-0 pt-0.5" style={{ color: "#4a5a6a" }}>{label}</dt>
                  <dd className="text-sm flex-1" style={{ color: "#e8edf2" }}>{value}</dd>
                </div>
              ) : null)}
              <div className="flex gap-2 flex-wrap pt-2">
                {[
                  { key: "hasGuarantee", label: "Garanzia" },
                  { key: "hasUrgency", label: "Urgenza" },
                  { key: "hasScarcity", label: "Scarsità" },
                  { key: "hasBonus", label: "Bonus" },
                ].map(({ key, label }) =>
                  (project.wizardData.step2 as Record<string, unknown>)?.[key] ? (
                    <span key={key} className="badge-active text-2xs">{label}</span>
                  ) : null
                )}
              </div>
            </dl>
          </div>

          {/* Benefits */}
          {(project.wizardData.step5?.benefits as string[] | undefined)?.length ? (
            <div className="prisma-card p-6">
              <p className="section-label mb-5">Benefit</p>
              <ul className="space-y-2">
                {(project.wizardData.step5?.benefits as string[]).map((b, i) => b ? (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#8899aa" }}>
                    <span style={{ color: "#3dffa0", marginTop: "3px", flexShrink: 0 }}>✓</span>
                    {b}
                  </li>
                ) : null)}
              </ul>
            </div>
          ) : null}

          {/* Contatti */}
          <div className="prisma-card p-6">
            <p className="section-label mb-5">Contatti</p>
            <dl className="space-y-3">
              {[
                ["Telefono", project.wizardData.step5?.phone as string],
                ["Email", project.wizardData.step5?.email as string],
                ["Indirizzo", project.wizardData.step5?.address as string],
              ].map(([label, value]) => value ? (
                <div key={label} className="flex gap-4">
                  <dt className="text-xs w-20 flex-shrink-0 pt-0.5" style={{ color: "#4a5a6a" }}>{label}</dt>
                  <dd className="text-sm" style={{ color: "#e8edf2" }}>{value}</dd>
                </div>
              ) : null)}
            </dl>
          </div>

          {/* Full timestamp */}
          <div className="md:col-span-2 prisma-card p-4 flex items-center gap-4">
            <Clock size={14} style={{ color: "#4a5a6a" }} />
            <span className="text-xs" style={{ color: "#4a5a6a" }}>
              Creato il {formatDate(project.createdAt)} · Aggiornato il {formatDate(project.updatedAt)}
            </span>
          </div>
        </div>
      )}

      {/* TAB: EXPORT */}
      {activeTab === "export" && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HTML Export */}
            <div className="prisma-card p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(61,255,160,0.1)", border: "1px solid rgba(61,255,160,0.2)" }}
                >
                  <Code size={18} style={{ color: "#3dffa0" }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "#e8edf2" }}>
                    HTML Standalone
                  </h3>
                  <p className="text-xs mb-4" style={{ color: "#8899aa" }}>
                    File HTML completo, pronto per essere caricato su qualsiasi hosting. Include CSS inline e tutto il necessario.
                  </p>
                  <button
                    onClick={handleDownloadHtml}
                    disabled={!project.generatedHtml}
                    className="btn-primary text-xs"
                    style={{ opacity: !project.generatedHtml ? 0.5 : 1 }}
                  >
                    <Download size={13} />
                    Scarica {project.name.toLowerCase().replace(/\s+/g, "-")}.html
                  </button>
                </div>
              </div>
            </div>

            {/* JSON Export */}
            <div className="prisma-card p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(77,166,255,0.1)", border: "1px solid rgba(77,166,255,0.2)" }}
                >
                  <ExternalLink size={18} style={{ color: "#4da6ff" }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "#e8edf2" }}>
                    Dati Progetto (JSON)
                  </h3>
                  <p className="text-xs mb-4" style={{ color: "#8899aa" }}>
                    Tutti i dati del wizard in formato JSON. Utile per backup, reimportazione o integrazione con altri tool.
                  </p>
                  <button onClick={handleDownloadJson} className="btn-secondary text-xs">
                    <Download size={13} />
                    Scarica dati.json
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Deploy instructions */}
          <div className="prisma-card p-6">
            <p className="section-label mb-4">Come pubblicare la pagina</p>
            <div className="space-y-3">
              {[
                {
                  n: "1",
                  title: "Scarica il file HTML",
                  desc: 'Clicca "Scarica HTML" sopra per ottenere il file completo standalone.',
                },
                {
                  n: "2",
                  title: "Carica sul tuo hosting",
                  desc: "Puoi caricare il file su qualsiasi hosting via FTP, cPanel, o direttamente su Netlify/Vercel drag & drop.",
                },
                {
                  n: "3",
                  title: "Collega il dominio",
                  desc: 'Rinomina il file come "index.html" oppure configuralo come pagina della campagna sul tuo dominio.',
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{
                      background: "rgba(61,255,160,0.1)",
                      border: "1px solid rgba(61,255,160,0.2)",
                      color: "#3dffa0",
                    }}
                  >
                    {step.n}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-0.5" style={{ color: "#e8edf2" }}>
                      {step.title}
                    </p>
                    <p className="text-xs" style={{ color: "#8899aa" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rigenera */}
          {project.generatedHtml && (
            <div
              className="p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap"
              style={{ background: "rgba(61,255,160,0.04)", border: "1px solid rgba(61,255,160,0.1)" }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={16} style={{ color: "#3dffa0" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#e8edf2" }}>
                    Landing page pronta
                  </p>
                  <p className="text-xs" style={{ color: "#8899aa" }}>
                    Score conversione: {project.conversionScore ?? "—"}/100
                  </p>
                </div>
              </div>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="btn-secondary text-sm"
              >
                <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
                {regenerating ? "Rigenerando..." : "Rigenera pagina"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
