/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1C1B19",
        cream: "#FBF7F0",
        paper: "#F2EEE4",
        ochre: "#E85D4E",
        "ochre-ink": "#A03A2E",
        rust: "#B33F2E",
        moss: "#4F6F52",
        teal: "#1B7F79",
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
        display: ["Fraunces", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
