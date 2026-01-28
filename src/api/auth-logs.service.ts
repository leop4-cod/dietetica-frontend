import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type AuthLog = {
  id?: string;
  userId?: string;
  accion?: string;
  createdAt?: string;
};

export async function listAuthLogs(): Promise<AuthLog[]> {
  const response = await api.get<ApiResponse<AuthLog[]>>("/auth-logs");
  return unwrapData(response);
}
