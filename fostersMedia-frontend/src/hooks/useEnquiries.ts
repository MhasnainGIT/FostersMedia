import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enquiryService } from "../services/enquiryService";
import { Enquiry } from "../types";
import { toast } from "sonner";

export function useEnquiries() {
  const queryClient = useQueryClient();

  const getEnquiriesQuery = useQuery({
    queryKey: ["enquiries"],
    queryFn: () => enquiryService.getEnquiries(),
    staleTime: 10 * 1000
  });

  const addEnquiryMutation = useMutation({
    mutationFn: (data: any) => enquiryService.createEnquiry(data),
    onSuccess: (newEnquiry) => {
      toast.success("Enquiry Logged", {
        description: `Your campaign request has been sent.`
      });
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
    onError: (err: any) => {
      toast.error("Submission Failed", {
        description: err.message
      });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Enquiry["status"] }) =>
      enquiryService.updateEnquiryStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["enquiries"] });
      const previous = queryClient.getQueryData<Enquiry[]>(["enquiries"]);

      if (previous) {
        queryClient.setQueryData<Enquiry[]>(
          ["enquiries"],
          previous.map((e) => (e.id === id ? { ...e, status } : e))
        );
      }

      return { previous };
    },
    onError: (err: any, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["enquiries"], context.previous);
      }
      toast.error("Status Update Failed", {
        description: err.message
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    }
  });

  const deleteEnquiryMutation = useMutation({
    mutationFn: (id: string) => enquiryService.deleteEnquiry(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["enquiries"] });
      const previous = queryClient.getQueryData<Enquiry[]>(["enquiries"]);

      if (previous) {
        queryClient.setQueryData<Enquiry[]>(
          ["enquiries"],
          previous.filter((e) => e.id !== id)
        );
      }

      return { previous };
    },
    onError: (err: any, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["enquiries"], context.previous);
      }
      toast.error("Deletion Failed", {
        description: err.message
      });
    },
    onSuccess: () => {
      toast.info("Enquiry Deleted", {
        description: "Lead enquiry record successfully deleted."
      });
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    }
  });

  return {
    enquiries: getEnquiriesQuery.data ?? [],
    isLoading: getEnquiriesQuery.isLoading,
    isError: getEnquiriesQuery.isError,
    addEnquiry: addEnquiryMutation.mutate,
    addEnquiryAsync: addEnquiryMutation.mutateAsync,
    isAdding: addEnquiryMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    deleteEnquiry: deleteEnquiryMutation.mutate,
    isDeleting: deleteEnquiryMutation.isPending
  };
}
