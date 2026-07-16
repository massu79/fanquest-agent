import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#0f5132",
        ink: "#111827",
        sun: "#fbbf24",
        coral: "#fb7185",
        aqua: "#2dd4bf"
      },
      boxShadow: {
        panel: "0 20px 60px rgba(17, 24, 39, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
