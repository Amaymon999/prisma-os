"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { WizardData, WizardState } from "@/types";
import { generateLandingPage } from "@/lib/generator";
import { updateProject } from "@/lib/projects";

const defaultWizardData: WizardData = {
  step1: {},
  step2: {},
  step3: {},
  step4: {},
  step5: {},
};

interface WizardContextType {
  state: WizardState;
  projectId: string | null;
  setProjectId: (id: string) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateStepData: (step: keyof WizardData, data: Record<string, unknown>) => void;
  generate: () => Promise<void>;
  saveProgress: () => Promise<void>;
}

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    totalSteps: 6,
    data: defaultWizardData,
    isGenerating: false,
    generationResult: null,
  });

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, currentStep: Math.max(1, Math.min(6, step)) }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.totalSteps, prev.currentStep + 1),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }));
  }, []);

  const updateStepData = useCallback(
    (step: keyof WizardData, data: Record<string, unknown>) => {
      setState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [step]: { ...(prev.data[step] as Record<string, unknown>), ...data },
        },
      }));
    },
    []
  );

  const generate = useCallback(async () => {
    setState((prev) => ({ ...prev, isGenerating: true }));
    try {
      // Generate landing page
      const result = generateLandingPage(state.data);
      setState((prev) => ({ ...prev, generationResult: result, isGenerating: false }));

      // Save to database if we have a project
      if (projectId) {
        await updateProject(projectId, {
          wizardData: state.data,
          generatedHtml: result.html,
          generatedCss: result.css,
          conversionScore: result.score.total,
          status: "active",
        });
      }
    } catch (error) {
      console.error("Generation error:", error);
      setState((prev) => ({ ...prev, isGenerating: false }));
    }
  }, [state.data, projectId]);

  const saveProgress = useCallback(async () => {
    if (!projectId) return;
    try {
      await updateProject(projectId, {
        wizardData: state.data,
        brandName: (state.data.step1?.brandName as string) || undefined,
        vertical: state.data.step1?.vertical,
        pageType: state.data.step4?.pageType,
      });
    } catch (error) {
      console.error("Save error:", error);
    }
  }, [projectId, state.data]);

  return (
    <WizardContext.Provider
      value={{
        state,
        projectId,
        setProjectId,
        goToStep,
        nextStep,
        prevStep,
        updateStepData,
        generate,
        saveProgress,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
