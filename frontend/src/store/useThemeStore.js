import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("stored-theme") || "night",
  setTheme: (theme) => {
    localStorage.setItem("stored-theme", theme);
    set({ theme });
  },
}));
