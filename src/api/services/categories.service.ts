import { api, unwrapData } from "../axios";
import type { ApiResponse } from "../../types/api";
import type { Paginated } from "../../types/pagination";

export type Category = {
  id?: number;
  nombre: string;
  descripcion?: string | null;
};

const BASE_PATH = "/categories";

export type ListCategoriesParams = {
  page?: number;
  limit?: number;
};

export async function listCategories(params?: ListCategoriesParams): Promise<Paginated<Category>> {
  const response = await api.get<ApiResponse<Paginated<Category>>>(BASE_PATH, { params });
  return unwrapData(response);
}

export async function createCategory(payload: Partial<Category>): Promise<Category> {
  const response = await api.post<ApiResponse<Category>>(BASE_PATH, payload);
  return unwrapData(response);
}

export async function updateCategory(
  id: string | number,
  payload: Partial<Category>
): Promise<Category> {
  const response = await api.put<ApiResponse<Category>>(`${BASE_PATH}/${id}`, payload);
  return unwrapData(response);
}

export async function deleteCategory(id: string | number): Promise<void> {
  await api.delete(`${BASE_PATH}/${id}`);
}
