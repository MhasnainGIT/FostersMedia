import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialService } from "../services/testimonialService";
import { Testimonial } from "../types";
import { toast } from "sonner";

export function useTestimonials() {
  const queryClient = useQueryClient();

  const getTestimonialsQuery = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => testimonialService.getTestimonials(),
    staleTime: 5 * 60 * 1000
  });

  const addTestimonialMutation = useMutation({
    mutationFn: (data: Omit<Testimonial, "id">) => testimonialService.createTestimonial(data),
    onSuccess: () => {
      toast.success("Testimonial Submitted", {
        description: "Thank you. Your review is logged."
      });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (err: any) => {
      toast.error("Submission Failed", {
        description: err.message
      });
    }
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Testimonial> }) =>
      testimonialService.updateTestimonial(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["testimonials"] });
      const previous = queryClient.getQueryData<Testimonial[]>(["testimonials"]);

      if (previous) {
        queryClient.setQueryData<Testimonial[]>(
          ["testimonials"],
          previous.map((t) => (t.id === id ? { ...t, ...data } as Testimonial : t))
        );
      }

      return { previous };
    },
    onError: (err: any, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["testimonials"], context.previous);
      }
      toast.error("Update Failed", {
        description: err.message
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    }
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: string) => testimonialService.deleteTestimonial(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["testimonials"] });
      const previous = queryClient.getQueryData<Testimonial[]>(["testimonials"]);

      if (previous) {
        queryClient.setQueryData<Testimonial[]>(
          ["testimonials"],
          previous.filter((t) => t.id !== id)
        );
      }

      return { previous };
    },
    onError: (err: any, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["testimonials"], context.previous);
      }
      toast.error("Deletion Failed", {
        description: err.message
      });
    },
    onSuccess: () => {
      toast.info("Testimonial Deleted", {
        description: "Testimonial removed from review queue."
      });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    }
  });

  return {
    testimonials: getTestimonialsQuery.data ?? [],
    isLoading: getTestimonialsQuery.isLoading,
    isError: getTestimonialsQuery.isError,
    addTestimonial: addTestimonialMutation.mutate,
    isAdding: addTestimonialMutation.isPending,
    updateTestimonial: updateTestimonialMutation.mutate,
    isUpdating: updateTestimonialMutation.isPending,
    deleteTestimonial: deleteTestimonialMutation.mutate,
    isDeleting: deleteTestimonialMutation.isPending
  };
}
