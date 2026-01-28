import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";
import type { Product } from "../types/product";
import type { Paginated } from "../types/pagination";

export type ListProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number | string;
};

export async function listProducts(params?: ListProductsParams): Promise<Paginated<Product>> {
  const query: Record<string, string | number | undefined> = { ...params };
  if (params?.categoryId !== undefined) {
    query.categoryId = params.categoryId;
    query.categoriaId = params.categoryId as any;
    query.categoria_id = params.categoryId as any;
  }
  const response = await api.get<ApiResponse<Paginated<Product>>>("/products", { params: query });
  return unwrapData(response);
}

export async function getProduct(id: number | string): Promise<Product> {
  const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return unwrapData(response);
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const response = await api.post<ApiResponse<Product>>("/products", payload);
  return unwrapData(response);
}

export async function updateProduct(id: number | string, payload: Partial<Product>): Promise<Product> {
  const response = await api.put<ApiResponse<Product>>(`/products/${id}`, payload);
  return unwrapData(response);
}

export async function deleteProduct(id: number | string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/products/${id}`);
}
