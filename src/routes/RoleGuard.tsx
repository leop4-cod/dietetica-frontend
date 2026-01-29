import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { hasRole, useAuth } from "../auth/AuthContext";
import type { Role } from "../auth/permissions";

type Props = {
  children: ReactNode;
  roles?: Role[];
  redirectTo?: string;
};

export default function RoleGuard({ children, roles, redirectTo = "/no-autorizado" }: Props) {
  const { role } = useAuth();
  if (!hasRole(roles, role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}
