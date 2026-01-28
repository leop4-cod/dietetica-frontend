import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type Role = "admin" | "empleado" | "cliente";

export type User = {
  id: number | string;
  nombre: string;
  email: string;
  role: Role | string;
};

export type LoginResponse = {
  access_token: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", payload);
  return unwrapData(response);
}

