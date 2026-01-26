import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { hasRole, isAuthed, type Role } from "../auth/auth";

type Props = {
  children: ReactNode;
  roles?: Role[];
};

export default function ProtectedRoute({ children, roles }: Props) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  if (!hasRole(roles)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
