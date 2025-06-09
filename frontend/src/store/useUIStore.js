import { create } from "zustand";

export const useUIStore = create((set) => ({
  showSearch: false,
  showFilter: false,

  toggleSearch: () =>
    set((state) => ({
      showSearch: !state.showSearch,
      showFilter: false,
    })),
  toggleFilter: () =>
    set((state) => ({
      showFilter: !state.showFilter,
      showSearch: false,
    })),
  closeAll: () => set({ showSearch: false, showFilter: false }),
}));
