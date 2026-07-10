import { create } from "zustand";

interface EventStore {
  searchQuery: string;
  statusFilter: string;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  reset: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  searchQuery: "",
  statusFilter: "all",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  reset: () => set({ searchQuery: "", statusFilter: "all" })
}));
