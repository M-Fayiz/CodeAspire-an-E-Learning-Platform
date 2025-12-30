import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { AuthStatus, type UserRoleType } from "../../types/auth.types";

import { SocketProvider } from "@/context/socket.context";
import { Spinner } from "../templates/Spinner";

interface ProtectedProps {
  children: ReactNode;
  fallback?: string;
  requiredRole?: UserRoleType[];
}

export const Protected_Router: React.FC<ProtectedProps> = ({
  children,
  requiredRole,
  fallback = "/auth/login",
}) => {
  const { user, status } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "mentor" && user.ApprovalStatus == "pending") {
      navigate("/mentor/data");
      return;
    }
  }, [user, navigate]);

  if (status ===AuthStatus.CHECKING) {
    return <Spinner fullScreen />;
  }

  if (status ===AuthStatus.GUEST) {
    return <Navigate to="/auth/login" replace />;
  }

  if (status ===AuthStatus.BLOCKED) {
    return <Navigate to="/blocked" replace />;
  }
  if (status ===AuthStatus.ACCESS_DENIED) {
    return  <Navigate to="/unauthorized" replace />;
  }
  if (!user) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  if (requiredRole && requiredRole.length > 0) {
    const hasRole = requiredRole.find((role) => user.role == role);

    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <SocketProvider userId={user?.id}>{children}</SocketProvider>;
};
