import { create } from "zustand";

interface DashboardStore {
  websocketConnected: boolean;
  setWebsocketConnected: (connected: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  websocketConnected: false,
  setWebsocketConnected: (websocketConnected) => set({ websocketConnected })
}));
