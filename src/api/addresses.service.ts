import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type Address = {
  id?: string;
  user?: { id?: string; nombre?: string; email?: string };
  user_id?: string;
  calle?: string;
  ciudad?: string;
  provincia?: string;
  codigo_postal?: string;
  referencia?: string;
};

export async function listAddresses(): Promise<Address[]> {
  const response = await api.get<ApiResponse<Address[]>>("/addresses");
  return unwrapData(response);
}

export async function getAddress(id: string): Promise<Address> {
  const response = await api.get<ApiResponse<Address>>(`/addresses/${id}`);
  return unwrapData(response);
}

export async function createAddress(payload: Partial<Address>) {
  const response = await api.post<ApiResponse<Address>>("/addresses", payload);
  return unwrapData(response);
}

export async function updateAddress(id: string, payload: Partial<Address>) {
  const response = await api.put<ApiResponse<Address>>(`/addresses/${id}`, payload);
  return unwrapData(response);
}

export async function deleteAddress(id: string) {
  const response = await api.delete<ApiResponse<unknown>>(`/addresses/${id}`);
  return unwrapData(response);
}
