"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/projects";
import type { Vertical, PageType } from "@/types";
import { Suspense } from "react";

function BuilderNewContent() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const pageType = "lead_generation" as PageType;
      const proj = await createProject("Nuovo Progetto", "altro" as Vertical, pageType);
      router.replace(`/builder/${proj.id}`);
    };
    init();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#080c0e" }}
    >
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: "rgba(61,255,160,0.12)",
            border: "1px solid rgba(61,255,160,0.2)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L13 7.5H19L14.5 11.5L16.5 17.5L10 14L3.5 17.5L5.5 11.5L1 7.5H7L10 2Z"
              fill="#3dffa0"
            />
          </svg>
        </div>
        <p className="text-sm" style={{ color: "#8899aa" }}>
          Creazione progetto...
        </p>
      </div>
    </div>
  );
}

export default function BuilderNewPage() {
  return (
    <Suspense>
      <BuilderNewContent />
    </Suspense>
  );
}
