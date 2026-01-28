import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: ReactNode;
  redirectTo?: string;
};

export default function ProtectedRoute({ children, redirectTo = "/login/cliente" }: Props) {
  const { token } = useAuth();
  if (!token) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}
