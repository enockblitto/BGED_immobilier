/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lagoon: {
          deep: "#082F30",
          DEFAULT: "#0E4749",
          light: "#1D7A70",
        },
        clay: {
          DEFAULT: "#C6862B",
          light: "#E0A94E",
        },
        ink: "#1C2321",
        sand: "#F2F4EF",
        // alias pour compatibilité avec les classes existantes (navy/gold)
        navy: {
          DEFAULT: "#0E4749",
          dark: "#082F30",
          light: "#1D7A70",
        },
        gold: {
          DEFAULT: "#C6862B",
          light: "#E0A94E",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Sora", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "lagoon-gradient": "linear-gradient(160deg, #082F30 0%, #0E4749 55%, #1D7A70 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "fade-in": "fade-in 0.8s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
