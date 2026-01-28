import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type User = {
  id: number | string;
  nombre: string;
  email: string;
  role: string;
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

export type RegisterPayload = {
  nombre: string;
  email: string;
  telefono?: string;
  password: string;
  rol?: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
};

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await api.post<ApiResponse<RegisterResponse>>("/auth/register", payload);
  return unwrapData(response);
}
