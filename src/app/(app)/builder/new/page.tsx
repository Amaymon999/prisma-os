"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function BuilderNewPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Inizializzazione...");

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setStatus("Non autenticato, reindirizzamento...");
          router.push("/auth");
          return;
        }

        setStatus("Creazione progetto...");
        
        const { data, error } = await supabase
          .from("projects")
          .insert({
            user_id: user.id,
            name: "Nuovo Progetto",
            brand_name: "Nuovo Progetto",
            vertical: "altro",
            page_type: "lead_generation",
            status: "draft",
            wizard_data: { step1: {}, step2: {}, step3: {}, step4: {}, step5: {} },
          })
          .select()
          .single();

        if (error) {
          setStatus("Errore: " + error.message);
          return;
        }

        router.push(`/builder/${data.id}`);
      } catch (e: unknown) {
        setStatus("Errore: " + (e instanceof Error ? e.message : String(e)));
      }
    };
    init();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080c0e" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(61,255,160,0.12)", border: "1px solid rgba(61,255,160,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L13 7.5H19L14.5 11.5L16.5 17.5L10 14L3.5 17.5L5.5 11.5L1 7.5H7L10 2Z" fill="#3dffa0"/>
          </svg>
        </div>
        <p style={{ color: "#8899aa", fontSize: "14px" }}>{status}</p>
      </div>
    </div>
  );
}
