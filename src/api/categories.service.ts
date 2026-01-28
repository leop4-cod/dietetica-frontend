import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";
import type { Category } from "../types/category";
import type { Paginated } from "../types/pagination";

export type ListCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function listCategories(params?: ListCategoriesParams): Promise<Paginated<Category>> {
  const response = await api.get<ApiResponse<Paginated<Category>>>("/categories", { params });
  return unwrapData(response);
}

export async function getCategory(id: number | string): Promise<Category> {
  const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
  return unwrapData(response);
}

export async function createCategory(payload: Partial<Category>): Promise<Category> {
  const response = await api.post<ApiResponse<Category>>("/categories", payload);
  return unwrapData(response);
}

export async function updateCategory(
  id: number | string,
  payload: Partial<Category>
): Promise<Category> {
  const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, payload);
  return unwrapData(response);
}

export async function deleteCategory(id: number | string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/categories/${id}`);
}

