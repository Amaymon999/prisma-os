export const dynamic = "force-dynamic";
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProjects, getProjectStats } from "@/lib/projects";
import type { Project } from "@/types";
import { VERTICAL_LABELS, PAGE_TYPE_LABELS } from "@/types";
import {
  Plus,
  ArrowRight,
  Layers,
  TrendingUp,
  Clock,
  CheckCircle,
  Zap,
  ChevronRight,
  BarChart2,
  Globe,
} from "lucide-react";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Ora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m fa`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h fa`;
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "published": return <span className="badge-active">Pubblicato</span>;
    case "active": return <span className="badge-active">Attivo</span>;
    case "draft": return <span className="badge-draft">Bozza</span>;
    case "archived": return <span className="badge-draft">Archiviato</span>;
    default: return null;
  }
}

function ScoreRing({ score }: { score: number | null }) {
  if (!score) return <span style={{ color: "#4a5a6a", fontSize: "0.8rem" }}>—</span>;
  const color = score >= 70 ? "#3dffa0" : score >= 40 ? "#f5a623" : "#ff4d6d";
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: `${color}15`, border: `1.5px solid ${color}40` }}
      >
        <span style={{ color, fontSize: "0.6rem", fontWeight: "700" }}>
          {score}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projs, st] = await Promise.all([getProjects(), getProjectStats()]);
        setProjects(projs.slice(0, 5));
        setStats(st);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const STAT_CARDS = [
    {
      label: "Progetti Totali",
      value: stats.total,
      icon: Layers,
      color: "#3dffa0",
      suffix: "",
    },
    {
      label: "Pagine Attive",
      value: stats.active + stats.published,
      icon: Globe,
      color: "#4da6ff",
      suffix: "",
    },
    {
      label: "Bozze",
      value: stats.drafts,
      icon: Clock,
      color: "#f5a623",
      suffix: "",
    },
    {
      label: "Tasso Completamento",
      value: stats.total > 0 ? Math.round(((stats.active + stats.published) / stats.total) * 100) : 0,
      icon: TrendingUp,
      color: "#3dffa0",
      suffix: "%",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="section-label mb-2">Dashboard</p>
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: "#e8edf2", letterSpacing: "-0.02em" }}
            >
              Workspace
            </h1>
            <p style={{ color: "#8899aa", marginTop: "6px", fontSize: "0.9rem" }}>
              Gestisci i tuoi progetti e genera nuove landing page
            </p>
          </div>
          <Link href="/builder/new" className="btn-primary">
            <Plus size={16} />
            Nuova Landing
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="prisma-card p-6 animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${card.color}12`,
                    border: `1px solid ${card.color}20`,
                  }}
                >
                  <Icon size={18} style={{ color: card.color }} />
                </div>
              </div>
              {loading ? (
                <div className="h-8 w-16 rounded shimmer-loading mb-1" />
              ) : (
                <p
                  className="text-3xl font-bold mb-1 tabular-nums"
                  style={{ color: "#e8edf2", letterSpacing: "-0.03em" }}
                >
                  {card.value}
                  <span style={{ color: card.color, fontSize: "1.5rem" }}>{card.suffix}</span>
                </p>
              )}
              <p className="text-xs" style={{ color: "#8899aa" }}>{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div
            className="prisma-card overflow-hidden animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid #1e2d3d" }}
            >
              <div>
                <p className="section-label mb-0.5">Attività recente</p>
                <h2 className="text-sm font-semibold" style={{ color: "#e8edf2" }}>
                  Ultimi progetti
                </h2>
              </div>
              <Link
                href="/projects"
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{ color: "#3dffa0" }}
              >
                Vedi tutti
                <ChevronRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-lg shimmer-loading" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="py-16 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "rgba(61,255,160,0.08)",
                    border: "1px solid rgba(61,255,160,0.15)",
                  }}
                >
                  <Zap size={20} style={{ color: "#3dffa0" }} />
                </div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "#e8edf2" }}
                >
                  Nessun progetto ancora
                </p>
                <p className="text-xs mb-6" style={{ color: "#8899aa" }}>
                  Crea la tua prima landing page professionale
                </p>
                <Link href="/builder/new" className="btn-primary text-xs px-4 py-2">
                  <Plus size={14} />
                  Inizia ora
                </Link>
              </div>
            ) : (
              <div>
                {projects.map((project, i) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition-colors group"
                    style={{
                      borderBottom: i < projects.length - 1 ? "1px solid #111820" : "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#111820";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "#0d1117",
                        border: "1px solid #1e2d3d",
                      }}
                    >
                      <Layers size={16} style={{ color: "#8899aa" }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: "#e8edf2" }}
                        >
                          {project.name}
                        </p>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-xs truncate" style={{ color: "#4a5a6a" }}>
                        {VERTICAL_LABELS[project.vertical]} · {PAGE_TYPE_LABELS[project.pageType]}
                      </p>
                    </div>

                    {/* Score + date */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <ScoreRing score={project.conversionScore} />
                      <span className="text-xs" style={{ color: "#4a5a6a" }}>
                        {formatDate(project.updatedAt)}
                      </span>
                      <ArrowRight
                        size={14}
                        style={{ color: "#4a5a6a" }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div
            className="prisma-card p-5 animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <p className="section-label mb-4">Azioni rapide</p>
            <div className="space-y-2">
              {[
                {
                  label: "Lead Generation",
                  desc: "Landing per raccogliere contatti",
                  href: "/builder/new?type=lead_generation",
                  icon: "→",
                },
                {
                  label: "Richiedi Preventivo",
                  desc: "Per imprese e professionisti",
                  href: "/builder/new?type=preventivo",
                  icon: "→",
                },
                {
                  label: "Prenota una Call",
                  desc: "Calendario consulenza",
                  href: "/builder/new?type=prenota_call",
                  icon: "→",
                },
                {
                  label: "Sales Page",
                  desc: "Pagina di vendita servizio",
                  href: "/builder/new?type=sales_page",
                  icon: "→",
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors group"
                  style={{ border: "1px solid transparent" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#111820";
                    el.style.borderColor = "#1e2d3d";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent";
                    el.style.borderColor = "transparent";
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(61,255,160,0.08)",
                      border: "1px solid rgba(61,255,160,0.12)",
                    }}
                  >
                    <span style={{ color: "#3dffa0", fontSize: "0.8rem" }}>+</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: "#e8edf2" }}>
                      {action.label}
                    </p>
                    <p className="text-2xs" style={{ color: "#4a5a6a" }}>
                      {action.desc}
                    </p>
                  </div>
                  <ChevronRight
                    size={12}
                    style={{ color: "#4a5a6a" }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Tips card */}
          <div
            className="rounded-xl p-5 animate-fade-up"
            style={{
              background: "rgba(61,255,160,0.05)",
              border: "1px solid rgba(61,255,160,0.12)",
              animationDelay: "0.3s",
            }}
          >
            <div className="flex items-start gap-3">
              <Zap size={16} style={{ color: "#3dffa0", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <p className="text-xs font-semibold mb-1.5" style={{ color: "#3dffa0" }}>
                  Pro tip
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#8899aa" }}>
                  Le landing page con 3+ recensioni convertono il{" "}
                  <strong style={{ color: "#e8edf2" }}>58% in più</strong>. Aggiungi sempre prove
                  sociali nel wizard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
