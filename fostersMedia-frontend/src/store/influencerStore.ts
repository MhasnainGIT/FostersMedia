import { create } from "zustand";

interface InfluencerStore {
  searchQuery: string;
  categoryFilter: string;
  locationFilter: string;
  sortBy: "name" | "followers" | "engagement" | "none";
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setLocationFilter: (location: string) => void;
  setSortBy: (sortBy: "name" | "followers" | "engagement" | "none") => void;
  resetFilters: () => void;
}

export const useInfluencerStore = create<InfluencerStore>((set) => ({
  searchQuery: "",
  categoryFilter: "all",
  locationFilter: "all",
  sortBy: "none",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setLocationFilter: (locationFilter) => set({ locationFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set({ searchQuery: "", categoryFilter: "all", locationFilter: "all", sortBy: "none" })
}));
