import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";

type Props = {
  children: ReactNode;
};

export default function PublicRoutes({ children }: Props) {
  const { token } = useAuth();
  if (token) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
