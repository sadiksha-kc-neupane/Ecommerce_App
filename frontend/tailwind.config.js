/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#14213D",
        cream: "#FBF7F0",
        paper: "#F2EEE4",
        ochre: "#E8A33D",
        "ochre-ink": "#9A6210",
        rust: "#B33F2E",
        moss: "#4F6F52",
        category: {
          electronics: "#3B6EA5",
          materials: "#8C7853",
          agriculture: "#4F6F52",
          cosmetics: "#C77DA0",
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
