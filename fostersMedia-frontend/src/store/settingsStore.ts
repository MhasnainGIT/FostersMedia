import { create } from "zustand";
import { WebsiteSettings } from "../types";

interface SettingsState {
  settings: WebsiteSettings;
  setSettings: (settings: WebsiteSettings) => void;
  updateSettings: (partial: Partial<WebsiteSettings>) => void;
}

const defaultSettings: WebsiteSettings = {
  heroTitle: "Connecting Brands",
  heroSubtitle: "With Visionaries",
  logoText: "Fosters Media",
  email: "partnerships@fostersmedia.com",
  phone: "+1 (555) 304-4500",
  instagramUrl: "https://instagram.com/fostersmedia",
  facebookUrl: "https://facebook.com/fostersmedia",
  footerText: "Premium Influencer marketing agency & Live Event management platform. Connecting world-class brands with visionary creators."
};

export const useSettingsStore = create<SettingsState>((set) => {
  // Sync initial from localStorage if available
  let initial = defaultSettings;
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("fosters_media_settings");
    if (saved) {
      try {
        initial = { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        // Ignore
      }
    }
  }

  return {
    settings: initial,
    setSettings: (settings) => {
      localStorage.setItem("fosters_media_settings", JSON.stringify(settings));
      set({ settings });
    },
    updateSettings: (partial) => set((state) => {
      const updated = { ...state.settings, ...partial };
      localStorage.setItem("fosters_media_settings", JSON.stringify(updated));
      return { settings: updated };
    })
  };
});
