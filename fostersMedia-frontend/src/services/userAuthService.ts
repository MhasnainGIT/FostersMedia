import { apiClient } from "../lib/apiClient";
import { User } from "../types";

export const userAuthService = {
  login: async (email: string, password: string, remember: boolean): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post<{ user: User; accessToken: string; refreshToken: string }>("/users/login", { email, password });
    if (remember) {
      localStorage.setItem("fm_auth_token", response.accessToken);
      localStorage.setItem("fm_auth_user", JSON.stringify(response.user));
    }
    return { token: response.accessToken, user: response.user };
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    accountType?: "user" | "influencer" | "brand";
    instagramHandle?: string;
    category?: string;
    location?: string;
    bio?: string;
    website?: string;
    platforms?: string[];
  }): Promise<User> => {
    return apiClient.post<User>("/users/register", data);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem("fm_auth_token");
    const userSaved = localStorage.getItem("fm_auth_user");
    if (token && userSaved) {
      try {
        return JSON.parse(userSaved);
      } catch {
        return null;
      }
    }
    return null;
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem("fm_auth_token");
    if (token) {
      try {
        await apiClient.post("/users/logout", {});
      } catch {
      }
    }
    localStorage.removeItem("fm_auth_token");
    localStorage.removeItem("fm_auth_user");
  }
};
