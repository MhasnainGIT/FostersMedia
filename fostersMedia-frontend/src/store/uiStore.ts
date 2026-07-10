import { create } from "zustand";

export interface SystemNotification {
  id: string;
  type: "telemetry" | "new-enquiry" | "influencer-status" | "info" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface UIState {
  theme: "dark" | "light";
  sidebarOpen: boolean;
  notifications: SystemNotification[];
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
  addNotification: (notification: Omit<SystemNotification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  sidebarOpen: true,
  notifications: [],
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebar: (sidebarOpen) => set({ sidebarOpen }),
  setTheme: (theme) => set({ theme }),
  addNotification: (notif) => set((state) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    return { notifications: [newNotif, ...state.notifications].slice(0, 50) };
  }),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  clearNotifications: () => set({ notifications: [] })
}));
