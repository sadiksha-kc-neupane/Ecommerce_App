/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Warm Dipti&Suppliers brand foundation (modernised, not pale/beige).
        // Keep these token names — existing utility classes (bg-navy, text-ochre…)
        // pick them up automatically.
        navy: "#1C1B19", // warm near-black ink / dark surfaces
        cream: "#FFFFFF", // clean white surfaces & page background
        paper: "#F7F3EC", // warm off-white secondary surface / cards
        ochre: "#D97706", // signature terracotta/amber accent (CTA, highlights)
        "ochre-ink": "#B45309", // readable dark-ochre text on light bg
        rust: "#C2410C", // destructive / negative
        moss: "#3F6212", // positive / in stock
        teal: "#0F766E", // low-stock alert
        category: {
          laptop: "#3D7CA6",
          desktop: "#A68A5B",
          components: "#A75A7E",
          cctv: "#546166",
          "printer_scanner": "#B07A3C",
          networking: "#5751A0",
          smartboard: "#8A63B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "ui-serif", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,27,25,0.05), 0 1px 3px rgba(28,27,25,0.06)",
        lift: "0 14px 34px -14px rgba(28,27,25,0.28)",
      },
      borderRadius: {
        xl: "0.85rem",
      },
    },
  },
  plugins: [],
};
