import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../services/settingsService";
import { useSettingsStore } from "../store/settingsStore";
import { WebsiteSettings } from "../types";
import { toast } from "sonner";
import { useEffect } from "react";

export function useSettings() {
  const queryClient = useQueryClient();
  const setSettingsStore = useSettingsStore((s) => s.setSettings);
  const updateSettingsStore = useSettingsStore((s) => s.updateSettings);
  const settings = useSettingsStore((s) => s.settings);

  const getSettingsQuery = useQuery({
    queryKey: ["websiteSettings"],
    queryFn: () => settingsService.getSettings(),
    staleTime: Infinity
  });

  // Sync server settings to Zustand store once retrieved
  useEffect(() => {
    if (getSettingsQuery.data) {
      // Merge fetched settings into the store once — use the partial updater to avoid
      // reading `settings` here which could cause a feedback loop when the store updates.
      updateSettingsStore(getSettingsQuery.data);
    }
  }, [getSettingsQuery.data, updateSettingsStore]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data: WebsiteSettings) => settingsService.updateSettings(data),
    onSuccess: (updated) => {
      setSettingsStore(updated);
      toast.success("Settings Saved", {
        description: "Website configuration saved and deployed in real-time."
      });
      queryClient.invalidateQueries({ queryKey: ["websiteSettings"] });
    },
    onError: (err) => {
      toast.error("Save Failed", {
        description: err.message
      });
    }
  });

  return {
    settings,
    isLoading: getSettingsQuery.isLoading,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending
  };
}
