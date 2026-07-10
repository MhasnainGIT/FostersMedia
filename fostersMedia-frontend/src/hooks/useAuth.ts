import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";

export function useAuth() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const loginMutation = useMutation({
    mutationFn: ({ email, password, remember }: { email: string; password: string; remember: boolean }) =>
      authService.login(email, password, remember),
    onSuccess: (data) => {
      setAuth(data.token, data.user, "admin");
      toast.success("Access Granted", {
        description: `Welcome back, ${data.user.name}. Session initialized.`
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      toast.error("Console Access Denied", {
        description: error.message
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.info("Session Terminated", {
        description: "You have exited the console."
      });
    }
  });

  const currentUserQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser(),
    staleTime: Infinity
  });

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    currentUser: currentUserQuery.data,
    isLoadingUser: currentUserQuery.isLoading
  };
}
