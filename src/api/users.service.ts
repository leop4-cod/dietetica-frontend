import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";
import type { Paginated } from "../types/pagination";

export type User = {
  id?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  rol?: string;
};

export type ListUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function listUsers(params?: ListUsersParams): Promise<Paginated<User>> {
  const response = await api.get<ApiResponse<Paginated<User>>>("/users", { params });
  return unwrapData(response);
}

export async function getUser(id: string): Promise<User> {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return unwrapData(response);
}

export async function createUser(payload: Partial<User> & { password?: string }): Promise<User> {
  const response = await api.post<ApiResponse<User>>("/users", payload);
  return unwrapData(response);
}

export async function updateUser(id: string, payload: Partial<User>): Promise<User> {
  const response = await api.put<ApiResponse<User>>(`/users/${id}`, payload);
  return unwrapData(response);
}

export async function deleteUser(id: string) {
  const response = await api.delete<ApiResponse<unknown>>(`/users/${id}`);
  return unwrapData(response);
}
