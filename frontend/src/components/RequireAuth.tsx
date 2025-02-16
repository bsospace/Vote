import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/UseAuth";
import { SkeletonCard } from "./Skeleton";

interface RequireAuthProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

export default function RequireAuth({
  children,
  requireAdmin = false,
}: RequireAuthProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
