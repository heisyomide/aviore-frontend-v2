/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px", // 🚀 Rule 1 Alignment
      },
    },

    extend: {
      colors: {
        // Primary Brand Identity
        brand: {
          DEFAULT: "#A4143D", // 🚀 Signature Burgundy
          dark: "#800f30",
          light: "#c21d4c",
          soft: "#fdf2f4",
        },

        primary: {
          DEFAULT: "#111111", // Premium Black
          light: "#1A1A1A",
          soft: "#2A2A2A",
        },

        // Legacy Accent (Keeping orange for small highlights/badges)
        accent: {
          DEFAULT: "#F97316",
          light: "#FDBA74",
        },

        background: {
          DEFAULT: "#FFFFFF",
          soft: "#F8F8F8",
          muted: "#F3F4F6",
        },

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
        display: ["Playfair Display", "serif"],
      },

      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "3rem", // 🚀 Used for our Flash Deal sections
      },

      keyframes: {
        // 🚀 Rule 12: Premium Interaction Animations
        "shrink-width": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      animation: {
        // 🚀 Progress Bar for FloatingCartToast
        "progress": "shrink-width 4s linear forwards",
        "fadeIn": "fadeIn 0.4s ease-out",
        "slideUp": "slideUp 0.5s ease-out",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },

  // 🚀 Essential for the "animate-in" and "fade-in" classes
  plugins: [require("tailwindcss-animate")],
};