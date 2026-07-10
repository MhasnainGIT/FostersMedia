import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userAuthService } from "../services/userAuthService";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";

export function useUserAuth() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const loginMutation = useMutation({
    mutationFn: ({ email, password, remember }: { email: string; password: string; remember: boolean }) =>
      userAuthService.login(email, password, remember),
    onSuccess: (data) => {
      setAuth(data.token, data.user, "user");
      toast.success("Welcome back", {
        description: `Signed in as ${data.user.name}.`
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      toast.error("Sign in failed", {
        description: error.message
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => userAuthService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.info("Signed out", {
        description: "You have been logged out."
      });
    }
  });

  const currentUserQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => userAuthService.getCurrentUser(),
    staleTime: Infinity
  });

  const registerMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      userAuthService.register(data),
    onSuccess: () => {
      toast.success("Account created", {
        description: "Your account was created successfully. Please sign in."
      });
    },
    onError: (error: Error) => {
      toast.error("Registration failed", {
        description: error.message
      });
    }
  });

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    currentUser: currentUserQuery.data,
    isLoadingUser: currentUserQuery.isLoading
  };
}
