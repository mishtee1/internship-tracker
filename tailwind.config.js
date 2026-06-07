/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f11",
        bg2: "#17171a",
        bg3: "#1e1e23",
        bg4: "#26262d",
        border: "#2e2e38",
        border2: "#3a3a46",
        purple: "#8b7cf8",
        purple2: "#6d5ce8",
        teal: "#2dd4bf",
        amber: "#f59e0b",
        green: "#4ade80",
        red: "#f87171",
        blue: "#60a5fa",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}