import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type Inventory = {
  id?: string;
  product?: {
    id?: string;
    nombre?: string;
  };
  stock?: number;
  ubicacion?: string;
};

export async function getInventory(productId: string): Promise<Inventory> {
  const response = await api.get<ApiResponse<Inventory>>(`/inventory/${productId}`);
  return unwrapData(response);
}

export async function updateStock(productId: string, stock: number) {
  const response = await api.put<ApiResponse<Inventory>>(`/inventory/${productId}`, { stock });
  return unwrapData(response);
}
