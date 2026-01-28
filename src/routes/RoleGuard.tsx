import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { hasRole, useAuth } from "../auth/AuthContext";
import type { Role } from "../api/services/auth.service";

type Props = {
  children: ReactNode;
  roles?: Role[];
  redirectTo?: string;
};

export default function RoleGuard({ children, roles, redirectTo = "/admin" }: Props) {
  const { role } = useAuth();
  if (!hasRole(roles, role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}
