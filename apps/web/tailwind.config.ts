import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        accent: "#F59E0B",
        success: "#10B981",
        danger: "#EF4444",
        background: "#F8FAFC",
        text: "#0F172A",
        muted: "#64748B",
        locked: "#CBD5E1",
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontSize: {
        base: ["1.125rem", { lineHeight: "1.75rem" }], // 18px base readable text
      },
      boxShadow: {
        soft: "0 10px 25px -5px rgba(79, 70, 229, 0.08), 0 8px 10px -6px rgba(79, 70, 229, 0.04)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
