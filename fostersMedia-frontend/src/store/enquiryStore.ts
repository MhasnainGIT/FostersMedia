import { create } from "zustand";

interface EnquiryStore {
  searchQuery: string;
  statusFilter: string;
  selectedEnquiryId: number | null;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setSelectedEnquiryId: (id: number | null) => void;
  reset: () => void;
}

export const useEnquiryStore = create<EnquiryStore>((set) => ({
  searchQuery: "",
  statusFilter: "all",
  selectedEnquiryId: null,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSelectedEnquiryId: (selectedEnquiryId) => set({ selectedEnquiryId }),
  reset: () => set({ searchQuery: "", statusFilter: "all", selectedEnquiryId: null })
}));
