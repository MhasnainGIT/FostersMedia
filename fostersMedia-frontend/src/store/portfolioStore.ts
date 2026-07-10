import { create } from "zustand";

interface PortfolioStore {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  selectedCategory: "all",
  setSelectedCategory: (selectedCategory) => set({ selectedCategory })
}));
