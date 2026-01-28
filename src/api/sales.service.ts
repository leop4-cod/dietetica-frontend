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
};

export type Sale = {
  id?: string;
  total?: number;
  metodo_pago?: string;
  estado?: string;
  fecha?: string;
  user?: {
    id?: string;
    nombre?: string;
    email?: string;
  };
  detalles?: SaleDetail[];
};

export type CreateSalePayload = {
  user_id: string;
  metodo_pago: string;
  estado?: string;
  coupon_code?: string;
};

export type ListSalesParams = {
  page?: number;
  limit?: number;
};

export async function listSales(params?: ListSalesParams): Promise<Paginated<Sale>> {
  const response = await api.get<ApiResponse<Paginated<Sale>>>("/sales", { params });
  return unwrapData(response);
}

export async function getSale(id: string): Promise<Sale> {
  const response = await api.get<ApiResponse<Sale>>(`/sales/${id}`);
  return unwrapData(response);
}

export async function createSale(payload: CreateSalePayload): Promise<Sale> {
  const response = await api.post<ApiResponse<Sale>>("/sales", payload);
  return unwrapData(response);
}

export async function updateSale(id: string, payload: Partial<CreateSalePayload>) {
  const response = await api.put<ApiResponse<any>>(`/sales/${id}`, payload);
  return unwrapData(response);
}
