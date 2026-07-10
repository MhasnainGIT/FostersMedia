import { create } from "zustand";
import { User } from "../types";

interface AuthState {
  token: string | null;
  user: User | null;
  userType: "admin" | "user" | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User, userType: "admin" | "user") => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("fm_auth_token");
  let user: User | null = null;
  let userType: "admin" | "user" | null = null;
  const savedUser = localStorage.getItem("fm_auth_user");
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
      userType = user?.role === "admin" || user?.role === "super_admin" || user?.role === "manager" ? "admin" : "user";
    } catch {
      // Ignore
    }
  }

  return {
    token,
    user,
    userType,
    isAuthenticated: !!token,
    setAuth: (token, user, userType) => {
      localStorage.setItem("fm_auth_token", token);
      localStorage.setItem("fm_auth_user", JSON.stringify(user));
      set({ token, user, userType, isAuthenticated: true });
    },
    clearAuth: () => {
      localStorage.removeItem("fm_auth_token");
      localStorage.removeItem("fm_auth_user");
      set({ token: null, user: null, userType: null, isAuthenticated: false });
    }
  };
});
