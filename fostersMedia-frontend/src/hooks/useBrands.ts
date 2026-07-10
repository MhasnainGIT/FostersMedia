import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "../services/brandService";
import { Brand } from "../types";
import { toast } from "sonner";

export function useBrands() {
  const queryClient = useQueryClient();

  const getBrandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.getBrands(),
    staleTime: 5 * 60 * 1000
  });

  const addBrandMutation = useMutation({
    mutationFn: (data: Omit<Brand, "id">) => brandService.createBrand(data),
    onSuccess: (newBrand) => {
      toast.success("Brand Registered", {
        description: `Successfully added "${newBrand.company}" as partner.`
      });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (err) => {
      toast.error("Registration Failed", {
        description: err.message
      });
    }
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) =>
      brandService.updateBrand(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["brands"] });
      const previous = queryClient.getQueryData<Brand[]>(["brands"]);

      if (previous) {
        queryClient.setQueryData<Brand[]>(
          ["brands"],
          previous.map((b) => (b.id === id ? { ...b, ...data } as Brand : b))
        );
      }

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["brands"], context.previous);
      }
      toast.error("Update Failed", {
        description: err.message
      });
    },
    onSuccess: (updated) => {
      toast.success("Brand Saved", {
        description: `"${updated.company}" profile resolved.`
      });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    }
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (id: string) => brandService.deleteBrand(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["brands"] });
      const previous = queryClient.getQueryData<Brand[]>(["brands"]);

      if (previous) {
        queryClient.setQueryData<Brand[]>(
          ["brands"],
          previous.filter((b) => b.id !== id)
        );
      }

      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["brands"], context.previous);
      }
      toast.error("Deletion Failed", {
        description: err.message
      });
    },
    onSuccess: () => {
      toast.info("Brand Removed", {
        description: "Brand partner deleted from database."
      });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    }
  });

  return {
    brands: getBrandsQuery.data ?? [],
    isLoading: getBrandsQuery.isLoading,
    isError: getBrandsQuery.isError,
    addBrand: addBrandMutation.mutate,
    isAdding: addBrandMutation.isPending,
    updateBrand: updateBrandMutation.mutate,
    isUpdating: updateBrandMutation.isPending,
    deleteBrand: deleteBrandMutation.mutate,
    isDeleting: deleteBrandMutation.isPending
  };
}
