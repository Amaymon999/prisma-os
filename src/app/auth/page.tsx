"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setSuccess("Account creato! Controlla la tua email per confermare.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Errore di autenticazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#080c0e" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,255,160,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(61,255,160,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(61,255,160,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="relative w-full max-w-md mx-auto px-6 animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(61,255,160,0.12)", border: "1px solid rgba(61,255,160,0.2)" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 1L13.5 7H19L14.5 11.5L16.5 18L10 14L3.5 18L5.5 11.5L1 7H6.5L10 1Z"
                  fill="#3dffa0"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: "#e8edf2" }}>
              Prisma<span style={{ color: "#3dffa0" }}>OS</span>
            </span>
          </div>

          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "#e8edf2", letterSpacing: "-0.02em" }}
          >
            {mode === "login" ? "Bentornato" : "Inizia ora"}
          </h1>
          <p style={{ color: "#8899aa", fontSize: "0.875rem" }}>
            {mode === "login"
              ? "Accedi al tuo workspace Prisma OS"
              : "Crea il tuo account e genera landing page professionali"}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "#141b24",
            border: "1px solid #1e2d3d",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          }}
        >
          {/* Tab switcher */}
          <div
            className="flex rounded-lg p-1 mb-8"
            style={{ background: "#0d1117" }}
          >
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  background: mode === m ? "#1a2330" : "transparent",
                  color: mode === m ? "#e8edf2" : "#8899aa",
                  border: mode === m ? "1px solid #1e2d3d" : "1px solid transparent",
                }}
              >
                {m === "login" ? "Accedi" : "Registrati"}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth}>
            {mode === "register" && (
              <div className="mb-4">
                <label
                  className="block text-xs font-medium mb-2 uppercase tracking-wider"
                  style={{ color: "#8899aa" }}
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Mario Rossi"
                  className="prisma-input"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: "#8899aa" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@esempio.com"
                className="prisma-input"
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: "#8899aa" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="prisma-input"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-3 mb-4 text-sm"
                style={{
                  background: "rgba(255,77,109,0.08)",
                  border: "1px solid rgba(255,77,109,0.2)",
                  color: "#ff4d6d",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="rounded-lg px-4 py-3 mb-4 text-sm"
                style={{
                  background: "rgba(61,255,160,0.08)",
                  border: "1px solid rgba(61,255,160,0.2)",
                  color: "#3dffa0",
                }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{ height: "48px" }}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="20 10"
                    />
                  </svg>
                  {mode === "login" ? "Accesso..." : "Creazione account..."}
                </span>
              ) : mode === "login" ? (
                "Accedi al workspace"
              ) : (
                "Crea account gratuito"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: "#4a5a6a" }}>
          Prisma OS è uno strumento interno per agenzie.{" "}
          <a href="#" style={{ color: "#8899aa" }}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
