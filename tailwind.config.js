/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./engine/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(187 100% 50%)",
          foreground: "hsl(222 47% 6%)",
        },
        background: "hsl(222 47% 6%)",
        foreground: "hsl(210 40% 92%)",
        card: "hsl(222 40% 9%)",
        muted: "hsl(222 30% 14%)",
        accent: "hsl(270 80% 65%)",
        success: "hsl(142 76% 36%)",
        warning: "hsl(38 92% 50%)",
        destructive: "hsl(0 72% 55%)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.15)',
        'glow-cyan-sm': '0 0 10px rgba(6, 182, 212, 0.1)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.15)',
        'glow-card': '0 0 30px rgba(6, 182, 212, 0.05)',
      }
    },
  },
  plugins: [],
}
