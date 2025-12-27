import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import type { UserRole } from "../../types/auth.types";

import { SocketProvider } from "@/context/socket.context";
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
  const {  user,status } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "mentor" && user.ApprovalStatus == "pending") {
      navigate("/mentor/data");
      return;
    }
  }, [user, navigate]);

  if (status === "checking") {
    return <Spinner fullScreen />;
  }


  if (status === "guest") {
    return <Navigate to="/auth/login" replace />;
  }


  if (status === "blocked") {
    return <Navigate to="/blocked" replace />;
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
