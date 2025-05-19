import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
    animation: {
      fadeIn: "fadeIn 0.3s ease-in-out forwards",
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "coffee",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "garden",
      "forest",
      "aqua",
      "pastel",
      "luxury",
      "dracula",
      "autumn",
      "business",
      "night",
    ],
  },
};
