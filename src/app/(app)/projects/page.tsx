export const dynamic = "force-dynamic";
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProjects, duplicateProject, deleteProject } from "@/lib/projects";
import type { Project } from "@/types";
import { VERTICAL_LABELS, PAGE_TYPE_LABELS } from "@/types";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Copy,
  Trash2,
  Eye,
  Edit3,
  Layers,
  Grid,
  List,
} from "lucide-react";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "published":
    case "active":
      return <span className="badge-active">{status === "published" ? "Pubblicato" : "Attivo"}</span>;
    case "draft":
      return <span className="badge-draft">Bozza</span>;
    case "archived":
      return <span className="badge-draft">Archiviato</span>;
    default:
      return null;
  }
}

function ScoreBar({ score }: { score: number | null }) {
  if (!score) return <span style={{ color: "#4a5a6a", fontSize: "0.8rem" }}>—</span>;
  const color = score >= 70 ? "#3dffa0" : score >= 40 ? "#f5a623" : "#ff4d6d";
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-16 h-1.5 rounded-full overflow-hidden"
        style={{ background: "#1e2d3d" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

function ProjectActions({
  project,
  onDuplicate,
  onDelete,
}: {
  project: Project;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.preventDefault(); setOpen(!open); }}
        className="p-1.5 rounded-md transition-colors"
        style={{ color: "#4a5a6a" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#8899aa")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5a6a")}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 z-20 w-44 rounded-xl py-1 shadow-modal"
            style={{ background: "#141b24", border: "1px solid #1e2d3d", top: "100%" }}
          >
            <Link
              href={`/projects/${project.id}`}
              className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors"
              style={{ color: "#e8edf2" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a2330")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              onClick={() => setOpen(false)}
            >
              <Eye size={14} /> Visualizza
            </Link>
            <Link
              href={`/builder/${project.id}`}
              className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors"
              style={{ color: "#e8edf2" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a2330")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              onClick={() => setOpen(false)}
            >
              <Edit3 size={14} /> Modifica
            </Link>
            <button
              onClick={() => { onDuplicate(project.id); setOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2 text-sm w-full transition-colors"
              style={{ color: "#e8edf2" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a2330")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Copy size={14} /> Duplica
            </button>
            <div style={{ height: "1px", background: "#1e2d3d", margin: "4px 0" }} />
            <button
              onClick={() => { onDelete(project.id); setOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2 text-sm w-full transition-colors"
              style={{ color: "#ff4d6d" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,77,109,0.08)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Trash2 size={14} /> Elimina
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const newProject = await duplicateProject(id);
      setProjects((prev) => [newProject, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo progetto?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap animate-fade-up">
        <div>
          <p className="section-label mb-2">Gestione</p>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "#e8edf2", letterSpacing: "-0.02em" }}
          >
            Progetti
          </h1>
          <p style={{ color: "#8899aa", marginTop: "6px", fontSize: "0.9rem" }}>
            {projects.length} landing page nel tuo workspace
          </p>
        </div>
        <Link href="/builder/new" className="btn-primary">
          <Plus size={16} />
          Nuova Landing
        </Link>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-3 mb-6 animate-fade-up flex-wrap"
        style={{ animationDelay: "0.05s" }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2.5 flex-1 min-w-0 rounded-lg px-3 py-2.5"
          style={{
            background: "#141b24",
            border: "1px solid #1e2d3d",
            maxWidth: "320px",
          }}
        >
          <Search size={14} style={{ color: "#4a5a6a", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Cerca progetti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 min-w-0"
            style={{ color: "#e8edf2" }}
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1">
          {["all", "draft", "active", "published"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterStatus === status ? "#1a2330" : "transparent",
                color: filterStatus === status ? "#e8edf2" : "#8899aa",
                border: filterStatus === status ? "1px solid #1e2d3d" : "1px solid transparent",
              }}
            >
              {status === "all" ? "Tutti" : status === "draft" ? "Bozze" : status === "active" ? "Attivi" : "Pubblicati"}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setViewMode("table")}
            className="p-2 rounded-lg transition-colors"
            style={{ color: viewMode === "table" ? "#e8edf2" : "#4a5a6a", background: viewMode === "table" ? "#1a2330" : "transparent" }}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className="p-2 rounded-lg transition-colors"
            style={{ color: viewMode === "grid" ? "#e8edf2" : "#4a5a6a", background: viewMode === "grid" ? "#1a2330" : "transparent" }}
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl shimmer-loading" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl py-24 text-center animate-fade-up"
          style={{ border: "1px dashed #1e2d3d" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "rgba(61,255,160,0.06)",
              border: "1px solid rgba(61,255,160,0.12)",
            }}
          >
            <Layers size={22} style={{ color: "#3dffa0" }} />
          </div>
          <p className="text-base font-semibold mb-2" style={{ color: "#e8edf2" }}>
            {search ? "Nessun risultato trovato" : "Nessun progetto ancora"}
          </p>
          <p className="text-sm mb-8" style={{ color: "#8899aa" }}>
            {search
              ? "Prova a modificare i termini di ricerca"
              : "Crea la tua prima landing page professionale in pochi minuti"}
          </p>
          {!search && (
            <Link href="/builder/new" className="btn-primary">
              <Plus size={16} />
              Crea il primo progetto
            </Link>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* Table view */
        <div className="prisma-card overflow-hidden animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2d3d" }}>
                {["Nome progetto", "Verticale", "Tipo", "Score", "Stato", "Aggiornato", ""].map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-3.5 text-2xs font-semibold tracking-wider uppercase"
                    style={{ color: "#4a5a6a" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, i) => (
                <tr
                  key={project.id}
                  className="group transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid #0d1117" : "none" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#0d1117")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td className="px-5 py-4">
                    <Link href={`/projects/${project.id}`} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "#0d1117", border: "1px solid #1e2d3d" }}
                      >
                        <Layers size={15} style={{ color: "#8899aa" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#e8edf2" }}>
                          {project.name}
                        </p>
                        {project.brandName && project.brandName !== project.name && (
                          <p className="text-xs" style={{ color: "#4a5a6a" }}>
                            {project.brandName}
                          </p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs" style={{ color: "#8899aa" }}>
                      {VERTICAL_LABELS[project.vertical]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs" style={{ color: "#8899aa" }}>
                      {PAGE_TYPE_LABELS[project.pageType]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ScoreBar score={project.conversionScore} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs" style={{ color: "#4a5a6a" }}>
                      {formatDate(project.updatedAt)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ProjectActions
                      project={project}
                      onDuplicate={handleDuplicate}
                      onDelete={handleDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up">
          {filtered.map((project) => (
            <div key={project.id} className="prisma-card-hover p-5">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "#0d1117", border: "1px solid #1e2d3d" }}
                >
                  <Layers size={18} style={{ color: "#8899aa" }} />
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={project.status} />
                  <ProjectActions project={project} onDuplicate={handleDuplicate} onDelete={handleDelete} />
                </div>
              </div>
              <Link href={`/projects/${project.id}`}>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: "#e8edf2" }}>
                  {project.name}
                </h3>
                <p className="text-xs mb-3" style={{ color: "#4a5a6a" }}>
                  {VERTICAL_LABELS[project.vertical]} · {PAGE_TYPE_LABELS[project.pageType]}
                </p>
                <div className="flex items-center justify-between">
                  <ScoreBar score={project.conversionScore} />
                  <span className="text-xs" style={{ color: "#4a5a6a" }}>
                    {formatDate(project.updatedAt)}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
