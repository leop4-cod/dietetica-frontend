import type { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";

type Props = {
  children: ReactNode;
};

export default function PrivateRoutes({ children }: Props) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
