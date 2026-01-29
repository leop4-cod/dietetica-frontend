import { api, unwrapData } from "../axios";
import type { ApiResponse } from "../../types/api";
import type { Paginated } from "../../types/pagination";

export type Product = {
  id?: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
  categoria_id?: number;
  supplier_id?: string | null;
  category?: { id?: number; nombre?: string };
  inventory?: { stock?: number };
};

const BASE_PATH = "/products";

export type ListProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function listProducts(params?: ListProductsParams): Promise<Paginated<Product>> {
  const response = await api.get<ApiResponse<Paginated<Product>>>(BASE_PATH, { params });
  return unwrapData(response);
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const response = await api.post<ApiResponse<Product>>(BASE_PATH, payload);
  return unwrapData(response);
}

export async function updateProduct(
  id: string | number,
  payload: Partial<Product>
): Promise<Product> {
  const response = await api.put<ApiResponse<Product>>(`${BASE_PATH}/${id}`, payload);
  return unwrapData(response);
}

export async function deleteProduct(id: string | number): Promise<void> {
  await api.delete(`${BASE_PATH}/${id}`);
}
