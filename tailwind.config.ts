import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Prisma OS dark base
        bg: {
          base: "#080c0e",
          surface: "#0d1117",
          elevated: "#111820",
          card: "#141b24",
          hover: "#1a2330",
          border: "#1e2d3d",
          "border-soft": "#162030",
        },
        // Typography
        text: {
          primary: "#e8edf2",
          secondary: "#8899aa",
          muted: "#4a5a6a",
          inverse: "#080c0e",
        },
        // Prisma Green accent
        accent: {
          DEFAULT: "#3dffa0",
          50: "rgba(61,255,160,0.05)",
          100: "rgba(61,255,160,0.1)",
          200: "rgba(61,255,160,0.2)",
          300: "rgba(61,255,160,0.3)",
          400: "#2de88a",
          500: "#3dffa0",
          600: "#50ffac",
          glow: "0 0 20px rgba(61,255,160,0.25)",
          "glow-sm": "0 0 10px rgba(61,255,160,0.15)",
        },
        // Status colors
        status: {
          success: "#3dffa0",
          warning: "#f5a623",
          error: "#ff4d6d",
          info: "#4da6ff",
        },
        // Semantic aliases for shadcn compatibility
        background: "#080c0e",
        foreground: "#e8edf2",
        card: {
          DEFAULT: "#141b24",
          foreground: "#e8edf2",
        },
        popover: {
          DEFAULT: "#141b24",
          foreground: "#e8edf2",
        },
        primary: {
          DEFAULT: "#3dffa0",
          foreground: "#080c0e",
        },
        secondary: {
          DEFAULT: "#1a2330",
          foreground: "#e8edf2",
        },
        muted: {
          DEFAULT: "#111820",
          foreground: "#8899aa",
        },
        accent: {
          DEFAULT: "#3dffa0",
          foreground: "#080c0e",
        },
        destructive: {
          DEFAULT: "#ff4d6d",
          foreground: "#e8edf2",
        },
        border: "#1e2d3d",
        input: "#141b24",
        ring: "#3dffa0",
      },
      fontFamily: {
        sans: ["'Geist'", "'Inter'", "system-ui", "sans-serif"],
        mono: ["'Geist Mono'", "'JetBrains Mono'", "monospace"],
        display: ["'Geist'", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.16" }],
        "6xl": ["3.75rem", { lineHeight: "1.1" }],
        "7xl": ["4.5rem", { lineHeight: "1.05" }],
      },
      borderRadius: {
        none: "0",
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        "card-sm": "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(30,45,61,0.8)",
        card: "0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,45,61,0.8)",
        "card-lg": "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(30,45,61,0.8)",
        "accent-glow": "0 0 20px rgba(61,255,160,0.25), 0 0 40px rgba(61,255,160,0.1)",
        "accent-glow-sm": "0 0 10px rgba(61,255,160,0.2)",
        "inner-sm": "inset 0 1px 0 rgba(255,255,255,0.04)",
        modal: "0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(30,45,61,0.8)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(61,255,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(61,255,160,0.03) 1px, transparent 1px)",
        "grid-pattern-sm": "linear-gradient(rgba(61,255,160,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(61,255,160,0.02) 1px, transparent 1px)",
        "radial-accent": "radial-gradient(ellipse at top, rgba(61,255,160,0.08) 0%, transparent 60%)",
        "radial-dark": "radial-gradient(ellipse at center, rgba(13,17,23,0.8) 0%, rgba(8,12,14,1) 100%)",
        "surface-gradient": "linear-gradient(135deg, rgba(20,27,36,0.9) 0%, rgba(13,17,23,0.9) 100%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%)",
      },
      backgroundSize: {
        "grid": "32px 32px",
        "grid-sm": "16px 16px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(61,255,160,0.2)" },
          "50%": { boxShadow: "0 0 24px rgba(61,255,160,0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
