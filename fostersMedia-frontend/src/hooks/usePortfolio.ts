import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioService } from "../services/portfolioService";
import { PortfolioItem } from "../types";
import { toast } from "sonner";

export function usePortfolio() {
  const queryClient = useQueryClient();

  const getPortfolioQuery = useQuery({
    queryKey: ["portfolio"],
    queryFn: () => portfolioService.getPortfolio(),
    staleTime: 10 * 60 * 1000
  });

  const addPortfolioMutation = useMutation({
    mutationFn: (data: Omit<PortfolioItem, "id">) => portfolioService.createPortfolioItem(data),
    onSuccess: (newItem) => {
      toast.success("Case Study Created", {
        description: `Successfully added "${newItem.title}" to portfolio.`
      });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
    onError: (err: any) => {
      toast.error("Creation Failed", {
        description: err.message
      });
    }
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PortfolioItem> }) =>
      portfolioService.updatePortfolioItem(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["portfolio"] });
      const previous = queryClient.getQueryData<PortfolioItem[]>(["portfolio"]);

      if (previous) {
        queryClient.setQueryData<PortfolioItem[]>(
          ["portfolio"],
          previous.map((item) => (item.id === id ? { ...item, ...data } as PortfolioItem : item))
        );
      }

      return { previous };
    },
    onError: (err: any, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["portfolio"], context.previous);
      }
      toast.error("Update Failed", {
        description: err.message
      });
    },
    onSuccess: (updated) => {
      toast.success("Case Study Saved", {
        description: `"${updated.title}" changes successfully updated.`
      });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    }
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: (id: string) => portfolioService.deletePortfolioItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["portfolio"] });
      const previous = queryClient.getQueryData<PortfolioItem[]>(["portfolio"]);

      if (previous) {
        queryClient.setQueryData<PortfolioItem[]>(
          ["portfolio"],
          previous.filter((item) => item.id !== id)
        );
      }

      return { previous };
    },
    onError: (err: any, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["portfolio"], context.previous);
      }
      toast.error("Deletion Failed", {
        description: err.message
      });
    },
    onSuccess: () => {
      toast.info("Case Study Deleted", {
        description: "Case study record successfully removed from portfolio."
      });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    }
  });

  return {
    portfolio: getPortfolioQuery.data ?? [],
    isLoading: getPortfolioQuery.isLoading,
    isError: getPortfolioQuery.isError,
    addPortfolioItem: addPortfolioMutation.mutate,
    isAdding: addPortfolioMutation.isPending,
    updatePortfolioItem: updatePortfolioMutation.mutate,
    isUpdating: updatePortfolioMutation.isPending,
    deletePortfolioItem: deletePortfolioMutation.mutate,
    isDeleting: deletePortfolioMutation.isPending
  };
}
