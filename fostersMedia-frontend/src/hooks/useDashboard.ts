import { useQuery } from "@tanstack/react-query";
import { dashboardService, DashboardStats } from "../services/dashboardService";

export function useDashboard() {
  const statsQuery = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => dashboardService.getStats(),
    staleTime: 5000
  });

  const timelineQuery = useQuery({
    queryKey: ["revenueTimeline"],
    queryFn: () => dashboardService.getMonthlyRevenueTimeline(),
    staleTime: 30 * 60 * 1000
  });

  return {
    stats: statsQuery.data ?? {
      totalInfluencers: 0,
      activeInfluencers: 0,
      totalCampaigns: 0,
      runningCampaigns: 0,
      totalEnquiries: 0,
      pendingEnquiries: 0,
      upcomingEvents: 0,
      revenue: 0,
      visitors: 0
    },
    isLoadingStats: statsQuery.isLoading,
    revenueTimeline: timelineQuery.data ?? [],
    isLoadingTimeline: timelineQuery.isLoading
  };
}
