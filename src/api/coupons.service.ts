import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type Coupon = {
  id?: string;
  codigo?: string;
  descuento_porcentaje?: number;
  fecha_expiracion?: string;
  activo?: boolean;
};

export async function listCoupons(): Promise<Coupon[]> {
  const response = await api.get<ApiResponse<Coupon[]>>("/coupons");
  return unwrapData(response);
}

export async function getCoupon(id: string): Promise<Coupon> {
  const response = await api.get<ApiResponse<Coupon>>(`/coupons/${id}`);
  return unwrapData(response);
}

export async function createCoupon(payload: Coupon): Promise<Coupon> {
  const response = await api.post<ApiResponse<Coupon>>("/coupons", payload);
  return unwrapData(response);
}

export async function updateCoupon(id: string, payload: Coupon): Promise<Coupon> {
  const response = await api.put<ApiResponse<Coupon>>(`/coupons/${id}`, payload);
  return unwrapData(response);
}

export async function deleteCoupon(id: string) {
  const response = await api.delete<ApiResponse<unknown>>(`/coupons/${id}`);
  return unwrapData(response);
}
