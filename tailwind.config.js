/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        neon: {
          50: "#f3ffe0",
          100: "#e6ffc2",
          200: "#d2ff8f",
          300: "#c6ff63",
          400: "#b7ff2f",
          500: "#a9ff00",
          600: "#8fd600",
          700: "#6da300",
          800: "#4b7000",
          900: "#2b4200",
        },
        night: {
          900: "#04060D",
          800: "#0B1020",
        },
      },

      borderRadius: {
        "2xl": "1rem",
      },

      boxShadow: {
        glass: "0 10px 30px -12px rgba(0,0,0,0.35)",
      },

      backdropBlur: {
        "2xl": "48px",
      },

      backgroundImage: {
        "radial-fade":
          "radial-gradient(60% 60% at 50% 40%, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.12) 100%)",
      },

      keyframes: {
        "bg-pan": {
          "0%": { transform: "translate3d(-10%, -10%, 0) scale(1.05) rotate(0deg)" },
          "50%": { transform: "translate3d(8%, 6%, 0)    scale(1.07) rotate(20deg)" },
          "100%": { transform: "translate3d(-6%, 10%, 0)  scale(1.05) rotate(40deg)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.05)" },
          "67%": { transform: "translate(-25px, 25px) scale(0.98)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: 0.55, filter: "blur(40px)" },
          "50%": { opacity: 0.9, filter: "blur(55px)" },
        },

        sheen: {
          "0%": { backgroundPosition: "110% 0" },
          "100%": { backgroundPosition: "-110% 0" },
        },
        liquid: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%, -1%, 0) scale(1.01)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
        breath: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-0.5px)" },
        },
      },

      animation: {
        "bg-pan-slow": "bg-pan 45s ease-in-out infinite",
        "blob-slow": "blob 28s ease-in-out infinite",
        "blob-slower": "blob 36s ease-in-out infinite",
        glow: "glow-pulse 7s ease-in-out infinite",

        sheen: "sheen 1.8s ease-in-out 1",
        "liquid-slow": "liquid 14s ease-in-out infinite",
        breath: "breath 6s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};
