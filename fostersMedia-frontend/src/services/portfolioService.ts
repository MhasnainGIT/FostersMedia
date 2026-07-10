import { apiClient } from "../lib/apiClient";
import { PortfolioItem } from "../types";

const mapPortfolioApiToFrontend = (raw: any): PortfolioItem => ({
  id: raw._id || raw.id || "",
  title: raw.title || "",
  thumbnail: raw.thumbnail || "",
  description: raw.description || "",
  category: raw.category || "",
  client: raw.client ? { companyName: raw.client.companyName || "" } : null,
  completionDate: raw.completionDate ? new Date(raw.completionDate).toISOString().split("T")[0] : "",
  results: raw.results || ""
});

export const portfolioService = {
  getPortfolio: async (): Promise<PortfolioItem[]> => {
    const portfolios = await apiClient.get<any[]>("/portfolio");
    return portfolios.map(mapPortfolioApiToFrontend);
  },

  getPortfolioById: async (id: string): Promise<PortfolioItem | null> => {
    try {
      const portfolio = await apiClient.get<any>(`/portfolio/${id}`);
      return mapPortfolioApiToFrontend(portfolio);
    } catch {
      return null;
    }
  },

  createPortfolioItem: async (data: Omit<PortfolioItem, "id">): Promise<PortfolioItem> => {
    const raw = await apiClient.post<any>("/portfolio", data);
    return mapPortfolioApiToFrontend(raw);
  },

  updatePortfolioItem: async (id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> => {
    const raw = await apiClient.put<any>(`/portfolio/${id}`, data);
    return mapPortfolioApiToFrontend(raw);
  },

  deletePortfolioItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/portfolio/${id}`);
  }
};
