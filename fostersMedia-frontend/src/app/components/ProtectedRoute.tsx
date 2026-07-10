import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/authStore";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userType = useAuthStore((s) => s.userType);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Only allow users with admin role to access admin routes
  if (userType !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
