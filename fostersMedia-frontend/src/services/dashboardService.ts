import { apiClient } from "../lib/apiClient";

export interface DashboardStats {
  totalInfluencers: number;
  activeInfluencers: number;
  totalCampaigns: number;
  runningCampaigns: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  upcomingEvents: number;
  revenue: number;
  visitors: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>("/dashboard");
  },

  getMonthlyRevenueTimeline: async (): Promise<{ month: string; revenue: number }[]> => {
    return apiClient.get<{ month: string; revenue: number }[]>("/dashboard/growth");
  }
};
