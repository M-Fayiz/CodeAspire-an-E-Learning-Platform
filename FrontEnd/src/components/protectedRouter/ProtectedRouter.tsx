import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import type { UserRole } from "../../types/auth.types";
import { Spinner } from "../templates/Spinner";

interface ProtectedProps {
  children: ReactNode;
  fallback?: string;
  requiredRole?: UserRole[];
}

export const Protected_Router: React.FC<ProtectedProps> = ({
  children,
  requiredRole,
  fallback = "/auth/login",
}) => {
  const { loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "mentor" && user.ApprovalStatus == "pending") {
      navigate("/mentor/data");
      return;
    }
  }, [user, navigate]);

  if (loading) {
    return <Spinner fullScreen variant="theme" />;
  }
  if (!user) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  if (requiredRole && requiredRole.length > 0) {
    console.log("resqured role", requiredRole);

    const hasRole = requiredRole.find((role) => user.role == role);
    console.info("User Role :", hasRole);
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};
