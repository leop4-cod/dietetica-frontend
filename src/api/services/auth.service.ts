import { api, unwrapData } from "../axios";
import type { ApiResponse } from "../../types/api";

export type Role = "ADMIN" | "EMPLEADO" | "CLIENTE";

export type User = {
  id: string | number;
  nombre?: string;
  email?: string;
  role?: Role | string;
  rol?: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: User;
};

export type RegisterBody = {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  rol?: "cliente";
};

export type RegisterResponse = {
  message?: string;
  user?: User;
};

export async function login(body: LoginBody): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", body);
  return unwrapData(response);
}

export async function register(body: RegisterBody): Promise<RegisterResponse> {
  const response = await api.post<ApiResponse<RegisterResponse>>("/auth/register", body);
  return unwrapData(response);
}
