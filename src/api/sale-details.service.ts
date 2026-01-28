import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";
import type { Paginated } from "../types/pagination";

export type SaleDetail = {
  id?: string;
  cantidad?: number;
  precio_unitario?: number;
  subtotal?: number;
  product?: {
    id?: string;
    nombre?: string;
  };
  sale?: {
    id?: string;
  };
};

export type ListSaleDetailsParams = {
  page?: number;
  limit?: number;
};

export async function listSaleDetails(
  params?: ListSaleDetailsParams
): Promise<Paginated<SaleDetail>> {
  const response = await api.get<ApiResponse<Paginated<SaleDetail>>>("/sale-details", { params });
  return unwrapData(response);
}

export async function getSaleDetail(id: string): Promise<SaleDetail> {
  const response = await api.get<ApiResponse<SaleDetail>>(`/sale-details/${id}`);
  return unwrapData(response);
}
