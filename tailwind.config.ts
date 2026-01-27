import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import lineClamp from "@tailwindcss/line-clamp";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#1e3a8a"
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b"
        }
      },
      boxShadow: {
        soft: "0 8px 24px rgba(15, 23, 42, 0.08)",
        "soft-lg": "0 12px 32px rgba(15, 23, 42, 0.12)",
        "primary": "0 4px 14px rgba(37, 99, 235, 0.25)",
        "accent": "0 4px 14px rgba(5, 150, 105, 0.25)"
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #2563eb, #1e40af)",
        "gradient-accent": "linear-gradient(to right, #10b981, #059669)",
        "gradient-warm": "linear-gradient(to right, #f59e0b, #d97706)"
      },
      transitionDuration: {
        "400": "400ms"
      }
    }
  },
  plugins: [animate, lineClamp]
};

export default config;
