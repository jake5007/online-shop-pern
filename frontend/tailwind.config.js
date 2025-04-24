import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
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
