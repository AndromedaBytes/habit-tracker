import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-0": "#07070f",
        glass: "rgba(255,255,255,.033)",
        "glass-b": "rgba(255,255,255,.08)",
        "glass-h": "rgba(255,255,255,.055)",
        ab: "#4fc3f7",
        ai: "#7c6fcd",
        abad: "#ff5c5c",
        aw: "#ffb347",
        ag: "#4ade80",
        tp: "rgba(255,255,255,.92)",
        ts: "rgba(255,255,255,.45)",
        td: "rgba(255,255,255,.2)"
      },
      boxShadow: {
        sglow: "0 0 12px rgba(79,195,247,.6),0 0 24px rgba(79,195,247,.2)",
        bglow: "0 0 12px rgba(255,92,92,.5)"
      },
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        mono: ["DM Mono", "monospace"],
        syne: ["Syne", "sans-serif"]
      },
      keyframes: {
        drift: {
          from: { transform: "translate(0,0) scale(1)" },
          to: { transform: "translate(55px,38px) scale(1.14)" }
        }
      },
      animation: {
        drift: "drift 20s ease-in-out infinite alternate",
        "drift-slow": "drift 28s ease-in-out infinite alternate",
        "drift-xslow": "drift 33s ease-in-out infinite alternate"
      }
    }
  },
  plugins: []
} satisfies Config;
