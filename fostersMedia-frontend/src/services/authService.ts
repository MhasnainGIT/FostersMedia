import { apiClient } from "../lib/apiClient";
import { User } from "../types";

export const authService = {
  login: async (email: string, password: string, remember: boolean): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post<{ admin: User; accessToken: string; refreshToken: string }>("/auth/login", { email, password });
    if (remember) {
      localStorage.setItem("fm_auth_token", response.accessToken);
      localStorage.setItem("fm_auth_user", JSON.stringify(response.admin));
    }
    return { token: response.accessToken, user: response.admin };
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
        await apiClient.post("/auth/logout", {});
      } catch {
      }
    }
    localStorage.removeItem("fm_auth_token");
    localStorage.removeItem("fm_auth_user");
  }
};
