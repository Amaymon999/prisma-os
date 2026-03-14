export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { WizardProvider, useWizard } from "@/components/wizard/WizardContext";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { WizardStep1 } from "@/components/wizard/Step1Project";
import { WizardStep2, WizardStep3, WizardStep4, WizardStep5 } from "@/components/wizard/WizardSteps";
import { WizardStep6 } from "@/components/wizard/Step6Generate";
import { createProject, getProject, updateProject } from "@/lib/projects";
import type { Vertical, PageType } from "@/types";
import { VERTICAL_LABELS, PAGE_TYPE_LABELS } from "@/types";
import { Save, X, ChevronLeft } from "lucide-react";
import Link from "next/link";

// ---- Inner wizard shell (needs WizardContext) ----
function WizardShell({ projectId }: { projectId: string }) {
  const { state, goToStep, saveProgress, setProjectId, updateStepData } = useWizard();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProjectId(projectId);
    // Load existing project data
    const load = async () => {
      const proj = await getProject(projectId);
      if (proj?.wizardData) {
        const wd = proj.wizardData;
        if (wd.step1) updateStepData("step1", wd.step1 as Record<string, unknown>);
        if (wd.step2) updateStepData("step2", wd.step2 as Record<string, unknown>);
        if (wd.step3) updateStepData("step3", wd.step3 as Record<string, unknown>);
        if (wd.step4) updateStepData("step4", wd.step4 as Record<string, unknown>);
        if (wd.step5) updateStepData("step5", wd.step5 as Record<string, unknown>);
      }
    };
    load();
  }, [projectId]);

  const handleSave = async () => {
    setSaving(true);
    await saveProgress();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const STEP_COMPONENTS = [
    WizardStep1,
    WizardStep2,
    WizardStep3,
    WizardStep4,
    WizardStep5,
    WizardStep6,
  ];
  const CurrentStep = STEP_COMPONENTS[state.currentStep - 1];

  return (
    <div className="min-h-screen" style={{ background: "#080c0e" }}>
      {/* Top bar */}
      <header
        className="h-14 flex items-center px-6 gap-4"
        style={{
          background: "rgba(13,17,23,0.95)",
          borderBottom: "1px solid #1e2d3d",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: "#8899aa" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e8edf2")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#8899aa")}
        >
          <ChevronLeft size={16} />
          Progetti
        </Link>

        <div style={{ width: "1px", height: "20px", background: "#1e2d3d" }} />

        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "rgba(61,255,160,0.12)", border: "1px solid rgba(61,255,160,0.2)" }}
          >
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L13 7.5H19L14.5 11.5L16.5 17.5L10 14L3.5 17.5L5.5 11.5L1 7.5H7L10 2Z" fill="#3dffa0" />
            </svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: "#e8edf2" }}>
            {state.data.step1?.projectName as string || "Nuovo Progetto"}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: saved ? "rgba(61,255,160,0.1)" : "transparent",
              border: "1px solid #1e2d3d",
              color: saved ? "#3dffa0" : "#8899aa",
            }}
          >
            <Save size={13} />
            {saving ? "Salvataggio..." : saved ? "Salvato ✓" : "Salva"}
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div
        className="px-8 py-5 overflow-x-auto"
        style={{ borderBottom: "1px solid #1e2d3d", background: "#0d1117" }}
      >
        <WizardProgress currentStep={state.currentStep} onStepClick={goToStep} />
      </div>

      {/* Step content */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="animate-fade-up" key={state.currentStep}>
          <CurrentStep />
        </div>
      </main>
    </div>
  );
}

// ---- Outer page: creates or loads project ----
export default function BuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isNew = params.id === "new";

  useEffect(() => {
    const init = async () => {
      if (isNew) {
        // Create a new project with defaults
        const pageType = (searchParams.get("type") || "lead_generation") as PageType;
        const proj = await createProject("Nuovo Progetto", "altro" as Vertical, pageType);
        setProjectId(proj.id);
        // Update URL without reload
        window.history.replaceState({}, "", `/builder/${proj.id}`);
      } else {
        setProjectId(params.id as string);
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#080c0e" }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 animate-glow-pulse"
            style={{ background: "rgba(61,255,160,0.12)", border: "1px solid rgba(61,255,160,0.2)" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L13 7.5H19L14.5 11.5L16.5 17.5L10 14L3.5 17.5L5.5 11.5L1 7.5H7L10 2Z" fill="#3dffa0" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: "#8899aa" }}>Inizializzazione workspace...</p>
        </div>
      </div>
    );
  }

  if (!projectId) return null;

  return (
    <WizardProvider>
      <WizardShell projectId={projectId} />
    </WizardProvider>
  );
}
