import { apiClient } from "../lib/apiClient";
import { WebsiteSettings } from "../types";

export const settingsService = {
  getSettings: async (): Promise<WebsiteSettings> => {
    return apiClient.get<WebsiteSettings>("/settings");
  },

  updateSettings: async (data: WebsiteSettings): Promise<WebsiteSettings> => {
    return apiClient.put<WebsiteSettings>("/settings", data);
  }
};
