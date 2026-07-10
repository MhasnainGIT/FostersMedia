const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const getAuthToken = () => {
  return localStorage.getItem("fm_auth_token");
};

const clearAuth = () => {
  localStorage.removeItem("fm_auth_token");
  localStorage.removeItem("fm_auth_user");
};

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
      }
      throw new Error(data.message || "API request failed");
    }
    return data.data as T;
  },

  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
      }
      throw new Error(data.message || "API request failed");
    }
    return data.data as T;
  },

  put: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
      }
      throw new Error(data.message || "API request failed");
    }
    return data.data as T;
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
      }
      throw new Error(data.message || "API request failed");
    }
    return data.data as T;
  },
};