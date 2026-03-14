"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  Bell,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderOpen, label: "Progetti" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; full_name?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser({
        email: user.email || "",
        full_name: user.user_metadata?.full_name,
      });
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080c0e" }}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30 h-full flex flex-col transition-all duration-300
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarOpen ? "w-64" : "w-16"}
        `}
        style={{
          background: "#0d1117",
          borderRight: "1px solid #1e2d3d",
          minWidth: sidebarOpen ? "256px" : "64px",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-16 px-4"
          style={{ borderBottom: "1px solid #1e2d3d" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(61,255,160,0.12)",
                border: "1px solid rgba(61,255,160,0.2)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L13 7.5H19L14.5 11.5L16.5 17.5L10 14L3.5 17.5L5.5 11.5L1 7.5H7L10 2Z"
                  fill="#3dffa0"
                />
              </svg>
            </div>
            {sidebarOpen && (
              <span
                className="text-base font-bold tracking-tight truncate"
                style={{ color: "#e8edf2" }}
              >
                Prisma<span style={{ color: "#3dffa0" }}>OS</span>
              </span>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-1.5 rounded-md hidden lg:flex"
              style={{ color: "#4a5a6a" }}
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* New Project CTA */}
        <div className="px-3 py-4">
          <Link
            href="/builder/new"
            className={`flex items-center gap-2.5 rounded-lg font-semibold text-sm transition-all ${
              sidebarOpen ? "px-4 py-2.5" : "px-0 py-2.5 justify-center"
            }`}
            style={{
              background: "#3dffa0",
              color: "#080c0e",
              boxShadow: "0 0 16px rgba(61,255,160,0.2)",
            }}
          >
            <Plus size={16} />
            {sidebarOpen && "Nuova Landing"}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "active" : ""} ${
                  !sidebarOpen ? "justify-center px-0" : ""
                }`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar expand button when collapsed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex items-center justify-center py-3 transition-colors"
            style={{ color: "#4a5a6a", borderTop: "1px solid #1e2d3d" }}
          >
            <ChevronRight size={14} className="rotate-180" />
          </button>
        )}

        {/* User section */}
        <div
          className={`p-3 ${sidebarOpen ? "" : "flex flex-col items-center gap-2"}`}
          style={{ borderTop: "1px solid #1e2d3d" }}
        >
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "#111820" }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: "rgba(61,255,160,0.15)", color: "#3dffa0" }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "#e8edf2" }}>
                  {user?.full_name || "Utente"}
                </p>
                <p className="text-2xs truncate" style={{ color: "#4a5a6a" }}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-md transition-colors"
                style={{ color: "#4a5a6a" }}
                title="Esci"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#4a5a6a" }}
              title="Esci"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header
          className="h-16 flex items-center px-6 gap-4 flex-shrink-0"
          style={{
            background: "rgba(13,17,23,0.8)",
            borderBottom: "1px solid #1e2d3d",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: "#8899aa" }}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
            <span style={{ color: "#4a5a6a" }}>Prisma OS</span>
            <ChevronRight size={12} style={{ color: "#4a5a6a" }} />
            <span style={{ color: "#e8edf2" }} className="truncate">
              {pathname === "/dashboard" && "Dashboard"}
              {pathname.startsWith("/projects") && "Progetti"}
              {pathname.startsWith("/builder") && "Nuovo Progetto"}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg transition-colors relative"
              style={{ color: "#8899aa" }}
            >
              <Bell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "#3dffa0" }}
              />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-1"
              style={{ background: "rgba(61,255,160,0.15)", color: "#3dffa0" }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
