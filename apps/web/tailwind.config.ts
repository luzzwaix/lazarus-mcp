import type { Config } from "tailwindcss";

const config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#030504",
        ink: "#07100c",
        morgue: "#0b1510",
        bone: "#e8f6ec",
        ash: "#8ca096",
        rot: "#ff3b45",
        toxin: "#39ff88",
        amber: "#d6aa3f"
      },
      boxShadow: {
        terminal: "0 0 0 1px rgba(57,255,136,.18), 0 28px 120px rgba(57,255,136,.12)",
        redline: "0 0 0 1px rgba(255,59,69,.2), 0 24px 90px rgba(255,59,69,.12)",
        greenline: "0 0 0 1px rgba(57,255,136,.24), 0 24px 90px rgba(57,255,136,.16)"
      },
      animation: {
        scan: "scan 4.8s linear infinite",
        pulseGlow: "pulseGlow 3.2s ease-in-out infinite",
        crawl: "crawl 18s linear infinite"
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-12%)", opacity: ".08" },
          "45%": { opacity: ".55" },
          "100%": { transform: "translateY(112%)", opacity: ".08" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: ".55" },
          "50%": { opacity: "1" }
        },
        crawl: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" }
        }
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
