import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        magenta: {
          DEFAULT: "hsl(var(--magenta))",
          foreground: "hsl(var(--magenta-foreground))",
        },
        /* African-inspired game color palette */
        indigo: {
          DEFAULT: "#4B0082", // Deep Indigo
          50: "#F5F0FF",
          100: "#E6D9FF",
          200: "#C9B3FF",
          300: "#AC8CFF",
          400: "#8F66FF",
          500: "#7240FF",
          600: "#5519FF",
          700: "#4B0082", // Deep Indigo
          800: "#380061",
          900: "#240040",
        },
        sunset: {
          DEFAULT: "#FF4500", // Sunset Orange
          50: "#FFF0EB",
          100: "#FFE1D6",
          200: "#FFC3AD",
          300: "#FFA585",
          400: "#FF875C",
          500: "#FF6933",
          600: "#FF4500", // Sunset Orange
          700: "#CC3700",
          800: "#992900",
          900: "#661C00",
        },
        gold: {
          DEFAULT: "#FFD700", // Golden Yellow
          50: "#FFFCEB",
          100: "#FFF9D6",
          200: "#FFF3AD",
          300: "#FFED85",
          400: "#FFE75C",
          500: "#FFE133",
          600: "#FFD700", // Golden Yellow
          700: "#CCAC00",
          800: "#998100",
          900: "#665600",
        },
        jungle: {
          DEFAULT: "#008000", // Jungle Green
          50: "#EBFFEB",
          100: "#D6FFD6",
          200: "#ADFFAD",
          300: "#85FF85",
          400: "#5CFF5C",
          500: "#33FF33",
          600: "#00CC00",
          700: "#008000", // Jungle Green
          800: "#006100",
          900: "#004000",
        },
        electric: {
          DEFAULT: "#1E90FF", // Electric Blue
          50: "#EBF5FF",
          100: "#D6EBFF",
          200: "#ADD6FF",
          300: "#85C2FF",
          400: "#5CADFF",
          500: "#3399FF",
          600: "#1E90FF", // Electric Blue
          700: "#0073CC",
          800: "#005699",
          900: "#003A66",
        },
        neon: {
          DEFAULT: "#FF00FF", // Vibrant Magenta
          50: "#FFEBFF",
          100: "#FFD6FF",
          200: "#FFADFF",
          300: "#FF85FF",
          400: "#FF5CFF",
          500: "#FF33FF",
          600: "#FF00FF", // Vibrant Magenta
          700: "#CC00CC",
          800: "#990099",
          900: "#660066",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

