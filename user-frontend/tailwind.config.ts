import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#0071e3",
          dark: "#0077ed",
          light: "#d2e8ff",
          bar: "#000000"
        },
        navy: "#1d1d1f",
        banner: "#1d1d1f",
        secondhand: "#000000",
        ink: "#1d1d1f",
        apple: {
          black: "#000000",
          gray: "#f5f5f7",
          muted: "#86868b",
          blue: "#0071e3"
        }
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Inter", "Kantumruy Pro", "system-ui", "sans-serif"],
        khmer: ["Kantumruy Pro", "Inter", "sans-serif"]
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
