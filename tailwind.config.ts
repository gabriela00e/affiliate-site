import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: "#FAF8F5",
        onyx: "#14110F",
        onyx2: "#1E1A16",
        gold: {
          DEFAULT: "#C9A227",
          light: "#E4C766",
          dark: "#A9821C",
        },
        blush: {
          DEFAULT: "#F2C9CE",
          soft: "#F8E3E6",
        },
        champagne: "#EFE6D8",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        lux: "0 8px 30px -8px rgba(20,17,15,0.15)",
        "gold-glow": "0 0 0 1px rgba(201,162,39,0.35)",
      },
      backgroundImage: {
        "gold-foil":
          "linear-gradient(135deg,#E4C766 0%,#C9A227 45%,#A9821C 100%)",
      },
      keyframes: {
        underline: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        underline: "underline 0.3s ease forwards",
        fadeUp: "fadeUp 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
