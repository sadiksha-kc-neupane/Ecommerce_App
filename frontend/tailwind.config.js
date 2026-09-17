/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Teal and Coral brand foundation
        teal: {
          DEFAULT: "#0F766E",
          dark: "#0D655E",
          light: "#14B8A6",
        },
        coral: {
          DEFAULT: "#FF7F50",
          hover: "#E86C3E",
          dark: "#D45627",
          light: "#FFA07A",
        },
        // Existing token names mapped to Teal & Coral palette
        navy: "#333333", // standard dark gray for text
        cream: "#FAFAFA", // Pearl White page background
        paper: "#FAFAFA", // Pearl White page background
        ochre: "#FF7F50", // Warm Coral accent (CTA, highlights, badges)
        "ochre-ink": "#D45627", // readable dark coral on light background
        rust: "#C2410C", // destructive / negative
        moss: "#16A34A", // positive / in stock
        muted: {
          DEFAULT: "#E2E8F0",
          foreground: "#64748B",
        },
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
        sans: ["Satoshi", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Satoshi", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Satoshi", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 118, 110, 0.06), 0 1px 2px rgba(0,0,0,0.04)",
        lift: "0 14px 34px -14px rgba(15, 118, 110, 0.22)",
      },
      borderRadius: {
        xl: "0.85rem",
      },
    },
  },
  plugins: [],
};
