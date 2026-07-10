import { create } from "zustand";

interface BrandStore {
  searchQuery: string;
  minBudget: string;
  setSearchQuery: (query: string) => void;
  setMinBudget: (budget: string) => void;
  reset: () => void;
}

export const useBrandStore = create<BrandStore>((set) => ({
  searchQuery: "",
  minBudget: "all",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setMinBudget: (minBudget) => set({ minBudget }),
  reset: () => set({ searchQuery: "", minBudget: "all" })
}));
