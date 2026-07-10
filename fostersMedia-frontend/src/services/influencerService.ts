import { apiClient } from "../lib/apiClient";
import { Influencer } from "../types";

const formatFollowers = (followers: any): string => {
  if (!followers) return "0";
  const numbers = [followers.instagram, followers.youtube, followers.twitter, followers.tiktok]
    .filter((value) => typeof value === "number") as number[];
  const total = numbers.reduce((sum, value) => sum + value, 0);
  if (total >= 1000000) return `${(total / 1000000).toFixed(1)}M`;
  if (total >= 1000) return `${(total / 1000).toFixed(1)}K`;
  return String(total);
};

const normalizeAvailability = (v: string): Influencer["availability"] => {
  const map: Record<string, Influencer["availability"]> = {
    available: "available", Available: "available",
    busy: "busy", Busy: "busy",
    unavailable: "unavailable", Unavailable: "unavailable",
  };
  return map[v] ?? "available";
};

const mapInfluencerApiToFrontend = (raw: any): Influencer => ({
  id: raw._id || raw.id || "",
  name: raw.name || "",
  username: raw.username || "",
  profileImage: raw.profileImage || "",
  coverImage: raw.coverImage || "",
  bio: raw.bio || "",
  category: raw.category || "",
  city: raw.city || "",
  location: raw.city || "",
  languages: raw.languages || [],
  phone: raw.phone || "",
  email: raw.email || "",
  followers: raw.followers || { instagram: 0, youtube: 0, twitter: 0, tiktok: 0 },
  engagementRate: raw.engagementRate ?? 0,
  socialLinks: raw.socialLinks || {},
  availability: normalizeAvailability(raw.availability),
  status: raw.status || "active",
  mediaKit: raw.mediaKit || "",
  isFeatured: raw.isFeatured ?? false,
  isVerified: raw.isVerified ?? false
});

export const influencerService = {
  getInfluencers: async (): Promise<Influencer[]> => {
    const influencers = await apiClient.get<any[]>("/influencers?limit=1000");
    return influencers.map(mapInfluencerApiToFrontend);
  },

  getInfluencerById: async (id: string): Promise<Influencer | null> => {
    try {
      const influencer = await apiClient.get<any>(`/influencers/${id}`);
      return mapInfluencerApiToFrontend(influencer);
    } catch {
      return null;
    }
  },

  createInfluencer: async (data: any): Promise<Influencer> => {
    const raw = await apiClient.post<any>("/influencers", data);
    return mapInfluencerApiToFrontend(raw);
  },

  updateInfluencer: async (id: string, data: any): Promise<Influencer> => {
    const raw = await apiClient.put<any>(`/influencers/${id}`, data);
    return mapInfluencerApiToFrontend(raw);
  },

  uploadProfileImage: async (id: string, file: File): Promise<Influencer> => {
    const token = localStorage.getItem("fm_auth_token");
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetch(`/api/v1/influencers/${id}/self`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) localStorage.removeItem("fm_auth_token");
      throw new Error(data.message || "Image upload failed");
    }
    return mapInfluencerApiToFrontend(data.data);
  },

  deleteInfluencer: async (id: string): Promise<void> => {
    await apiClient.delete(`/influencers/${id}`);
  },

  selfUpdateInfluencer: async (id: string, data: any): Promise<Influencer> => {
    const raw = await apiClient.put<any>(`/influencers/${id}/self`, data);
    return mapInfluencerApiToFrontend(raw);
  },

  getInfluencerByUsername: async (username: string): Promise<Influencer | null> => {
    try {
      const influencer = await apiClient.get<any>(`/influencers/username/${username}`);
      return mapInfluencerApiToFrontend(influencer);
    } catch {
      return null;
    }
  },

  createInfluencerWithFiles: async (data: any, profileImageFile?: File): Promise<Influencer> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4));
    formData.append("category", data.category);
    formData.append("city", data.city || "");
    formData.append("languages", JSON.stringify(data.languages || ["English"]));
    formData.append("followers", JSON.stringify(data.followers || { instagram: 0, youtube: 0, twitter: 0, tiktok: 0 }));
    formData.append("engagementRate", String(data.engagementRate ?? 0));
    formData.append("socialLinks", JSON.stringify(data.socialLinks || {}));
    formData.append("availability", data.availability || "available");
    formData.append("bio", data.bio || "");
    formData.append("isVerified", String(data.isVerified ?? false));
    formData.append("phone", data.phone || "");
    formData.append("email", data.email || "");
    formData.append("status", data.status || "active");

    if (profileImageFile) {
      formData.append("profileImage", profileImageFile);
    }

    const token = localStorage.getItem("fm_auth_token");
    const response = await fetch(`/api/v1/influencers`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create influencer");
    }
    return mapInfluencerApiToFrontend(result.data);
  },

  updateInfluencerWithFiles: async (id: string, data: any, profileImageFile?: File): Promise<Influencer> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.username) formData.append("username", data.username);
    if (data.category) formData.append("category", data.category);
    if (data.city !== undefined) formData.append("city", data.city);
    if (data.languages) formData.append("languages", JSON.stringify(data.languages));
    if (data.bio !== undefined) formData.append("bio", data.bio);
    if (data.availability) formData.append("availability", data.availability);
    if (data.status !== undefined) formData.append("status", data.status);
    if (data.socialLinks) formData.append("socialLinks", JSON.stringify(data.socialLinks));
    if (data.followers) formData.append("followers", JSON.stringify(data.followers));
    if (data.engagementRate !== undefined) formData.append("engagementRate", String(data.engagementRate));
    if (data.isVerified !== undefined) formData.append("isVerified", String(data.isVerified));
    if (data.phone !== undefined) formData.append("phone", data.phone);
    if (data.email !== undefined) formData.append("email", data.email);

    if (profileImageFile) {
      formData.append("profileImage", profileImageFile);
    }

    const token = localStorage.getItem("fm_auth_token");
    const response = await fetch(`/api/v1/influencers/${id}`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to update influencer");
    }
    return mapInfluencerApiToFrontend(result.data);
  }
};
