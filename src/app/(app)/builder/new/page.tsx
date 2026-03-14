"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/projects";
import type { Vertical, PageType } from "@/types";

export default function BuilderNewPage() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const proj = await createProject(
          "Nuovo Progetto",
          "altro" as Vertical,
          "lead_generation" as PageType
        );
        router.push(`/builder/${proj.id}`);
      } catch (e) {
        console.error("Errore creazione progetto:", e);
      }
    };
    init();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080c0e",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "rgba(61,255,160,0.12)",
            border: "1px solid rgba(61,255,160,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L13 7.5H19L14.5 11.5L16.5 17.5L10 14L3.5 17.5L5.5 11.5L1 7.5H7L10 2Z"
              fill="#3dffa0"
            />
          </svg>
        </div>
        <p style={{ color: "#8899aa", fontSize: "14px" }}>
          Creazione progetto...
        </p>
      </div>
    </div>
  );
}
