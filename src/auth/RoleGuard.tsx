import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { hasRole, useAuth } from "./AuthContext";
import type { Role } from "./permissions";

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
