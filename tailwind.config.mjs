/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        // Primary Brand
        primary: {
          DEFAULT: "#111111", // premium black
          light: "#1A1A1A",
          soft: "#2A2A2A",
        },

        // Accent (discounts / highlights)
        accent: {
          DEFAULT: "#F97316", // modern orange
          light: "#FDBA74",
        },

        // Background shades
        background: {
          DEFAULT: "#FFFFFF",
          soft: "#F8F8F8",
          muted: "#F3F4F6",
        },

        // Border colors
        border: {
          DEFAULT: "#E5E7EB",
          soft: "#F1F1F1",
        },

        // Text hierarchy
        text: {
          primary: "#111111",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },

        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Playfair Display", "serif"], // for hero titles
      },

      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.05)",
        soft: "0 2px 8px rgba(0,0,0,0.04)",
        strong: "0 10px 40px rgba(0,0,0,0.08)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        slideUp: "slideUp 0.5s ease-out",
      },
    },
  },

  plugins: [],
};