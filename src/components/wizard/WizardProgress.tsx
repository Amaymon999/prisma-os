"use client";

import { WIZARD_STEPS } from "@/types";
import { Check } from "lucide-react";

interface WizardProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function WizardProgress({ currentStep, onStepClick }: WizardProgressProps) {
  return (
    <div className="flex items-center gap-0 w-full max-w-3xl">
      {WIZARD_STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isClickable = currentStep > step.id && onStepClick;

        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            {/* Step item */}
            <div
              className={`flex items-center gap-2.5 group ${isClickable ? "cursor-pointer" : ""}`}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              {/* Circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all duration-300"
                style={{
                  background: isCompleted
                    ? "rgba(61,255,160,0.12)"
                    : isActive
                    ? "#3dffa0"
                    : "#111820",
                  border: isCompleted
                    ? "1px solid rgba(61,255,160,0.3)"
                    : isActive
                    ? "1px solid #3dffa0"
                    : "1px solid #1e2d3d",
                  color: isCompleted ? "#3dffa0" : isActive ? "#080c0e" : "#4a5a6a",
                  boxShadow: isActive ? "0 0 16px rgba(61,255,160,0.25)" : "none",
                }}
              >
                {isCompleted ? <Check size={12} strokeWidth={2.5} /> : step.id}
              </div>

              {/* Label (hidden on small screens except active) */}
              <div className={`hidden sm:block ${isActive ? "" : "opacity-60"}`}>
                <p
                  className="text-xs font-semibold leading-none mb-0.5"
                  style={{ color: isActive ? "#e8edf2" : "#8899aa" }}
                >
                  {step.label}
                </p>
                <p
                  className="text-2xs leading-none"
                  style={{ color: "#4a5a6a" }}
                >
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector */}
            {index < WIZARD_STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-3 transition-all duration-500"
                style={{
                  background: currentStep > step.id
                    ? "rgba(61,255,160,0.3)"
                    : "#1e2d3d",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
