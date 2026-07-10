import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { influencerService } from "../services/influencerService";
import { Influencer } from "../types";
import { toast } from "sonner";

const formatFollowersValue = (followers?: { instagram?: number; youtube?: number; twitter?: number; tiktok?: number }): string => {
  if (!followers) return "0";
  const numbers = [followers.instagram, followers.youtube, followers.twitter, followers.tiktok]
    .filter((value) => typeof value === "number") as number[];
  const total = numbers.reduce((sum, value) => sum + value, 0);
  if (total >= 1000000) return `${(total / 1000000).toFixed(1)}M`;
  if (total >= 1000) return `${(total / 1000).toFixed(1)}K`;
  return String(total);
};

const mapCreatePayload = (input: any) => ({
  name: input.name,
  username: input.username || input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4),
  category: input.category,
  city: input.city || "",
  languages: input.languages || ["English"],
  followers: input.followers || { instagram: 0, youtube: 0, twitter: 0, tiktok: 0 },
  engagementRate: input.engagementRate ?? 0,
  availability: input.availability || "available",
  profileImage: input.profileImage || "",
  bio: input.bio || "",
  socialLinks: input.socialLinks || {},
  isVerified: input.isVerified ?? false,
  phone: input.phone || "",
  email: input.email || "",
  status: input.status || "active",
});

const mapUpdatePayload = (input: Partial<Influencer>) => {
  const payload: any = {};
  if (input.name) payload.name = input.name;
  if (input.username) payload.username = input.username;
  if (input.category) payload.category = input.category;
  if (input.city) payload.city = input.city;
  if (input.languages) payload.languages = input.languages;
  if (input.bio !== undefined) payload.bio = input.bio;
  if (input.availability) payload.availability = input.availability;
  if (input.status !== undefined) payload.status = input.status;
  if (input.profileImage !== undefined) payload.profileImage = input.profileImage;
  if (input.socialLinks) payload.socialLinks = input.socialLinks;
  if (input.followers) payload.followers = input.followers;
  if (input.engagementRate !== undefined) payload.engagementRate = input.engagementRate;
  if (input.isVerified !== undefined) payload.isVerified = input.isVerified;
  if (input.phone !== undefined) payload.phone = input.phone;
  if (input.email !== undefined) payload.email = input.email;
  return payload;
};

export function useInfluencers() {
  const queryClient = useQueryClient();

  const getInfluencersQuery = useQuery({
    queryKey: ["influencers"],
    queryFn: () => influencerService.getInfluencers(),
    staleTime: 5 * 60 * 1000
  });

  const addInfluencerMutation = useMutation({
    mutationFn: (data: any) => influencerService.createInfluencer(data),
    onSuccess: (newInfluencer) => {
      toast.success("Influencer Registered", {
        description: `${newInfluencer.name} added to central database.`
      });
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
    },
    onError: (err: any) => {
      toast.error("Registration Failed", {
        description: err.message
      });
    }
  });

  const updateInfluencerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Influencer> }) =>
      influencerService.updateInfluencer(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["influencers"] });
      const previousInfluencers = queryClient.getQueryData<Influencer[]>(["influencers"]);

      if (previousInfluencers) {
        queryClient.setQueryData<Influencer[]>(
          ["influencers"],
          previousInfluencers.map((inf) => (inf.id === id ? { ...inf, ...data } as Influencer : inf))
        );
      }

      return { previousInfluencers };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousInfluencers) {
        queryClient.setQueryData(["influencers"], context.previousInfluencers);
      }
      toast.error("Update Failed", {
        description: err.message
      });
    },
    onSuccess: (updatedInfluencer) => {
      toast.success("Profile Updated", {
        description: `${updatedInfluencer.name} database record updated.`
      });
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
    }
  });

  const deleteInfluencerMutation = useMutation({
    mutationFn: (id: string) => influencerService.deleteInfluencer(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["influencers"] });
      const previousInfluencers = queryClient.getQueryData<Influencer[]>(["influencers"]);

      if (previousInfluencers) {
        queryClient.setQueryData<Influencer[]>(
          ["influencers"],
          previousInfluencers.filter((inf) => inf.id !== id)
        );
      }

      return { previousInfluencers };
    },
    onError: (err: any, id, context) => {
      if (context?.previousInfluencers) {
        queryClient.setQueryData(["influencers"], context.previousInfluencers);
      }
      toast.error("Deletion Failed", {
        description: err.message
      });
    },
    onSuccess: () => {
      toast.info("Profile Removed", {
        description: "Creator record deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
    }
  });

  const addInfluencer = (input: any) => {
    const payload = mapCreatePayload(input);
    addInfluencerMutation.mutate(payload);
  };

  const updateInfluencerData = (id: string, data: Partial<Influencer>) => {
    const payload = mapUpdatePayload(data);
    updateInfluencerMutation.mutate({ id, data: payload });
  };

  return {
    influencers: getInfluencersQuery.data ?? [],
    isLoading: getInfluencersQuery.isLoading,
    isError: getInfluencersQuery.isError,
    error: getInfluencersQuery.error,
    addInfluencer,
    isAdding: addInfluencerMutation.isPending,
    updateInfluencer: updateInfluencerData,
    isUpdating: updateInfluencerMutation.isPending,
    deleteInfluencer: deleteInfluencerMutation.mutate,
    isDeleting: deleteInfluencerMutation.isPending
  };
}

export function useInfluencerById(id: string) {
  return useQuery({
    queryKey: ["influencer", id],
    queryFn: () => influencerService.getInfluencerById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000
  });
}
