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
        bg: {
          base: "#080c0e",
          surface: "#0d1117",
          elevated: "#111820",
          card: "#141b24",
          hover: "#1a2330",
          border: "#1e2d3d",
          "border-soft": "#162030",
        },
        text: {
          primary: "#e8edf2",
          secondary: "#8899aa",
          muted: "#4a5a6a",
          inverse: "#080c0e",
        },
        accent: {
          DEFAULT: "#3dffa0",
          hover: "#50ffac",
          foreground: "#080c0e",
        },
        status: {
          success: "#3dffa0",
          warning: "#f5a623",
          error: "#ff4d6d",
          info: "#4da6ff",
        },
        background: "#080c0e",
        foreground: "#e8edf2",
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
        destructive: {
          DEFAULT: "#ff4d6d",
          foreground: "#e8edf2",
        },
        border: "#1e2d3d",
        input: "#141b24",
        ring: "#3dffa0",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
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
