import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#0071e3",
          dark: "#0077ed"
        },
        navy: "#1d1d1f",
        apple: {
          gray: "#f5f5f7",
          muted: "#86868b"
        }
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
