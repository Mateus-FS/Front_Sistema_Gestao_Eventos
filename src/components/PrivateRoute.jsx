import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

export function PrivateRoute({ role }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role && user?.role !== role) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
