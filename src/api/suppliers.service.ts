import { api, unwrapData } from "./axios";
import type { ApiResponse } from "../types/api";

export type Supplier = {
  id?: string;
  nombre?: string;
  contacto?: string;
  email?: string;
  telefono?: string;
};

export async function listSuppliers(): Promise<Supplier[]> {
  const response = await api.get<ApiResponse<Supplier[]>>("/suppliers");
  return unwrapData(response);
}

export async function getSupplier(id: string): Promise<Supplier> {
  const response = await api.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
  return unwrapData(response);
}

export async function createSupplier(payload: Supplier): Promise<Supplier> {
  const response = await api.post<ApiResponse<Supplier>>("/suppliers", payload);
  return unwrapData(response);
}

export async function updateSupplier(id: string, payload: Supplier): Promise<Supplier> {
  const response = await api.put<ApiResponse<Supplier>>(`/suppliers/${id}`, payload);
  return unwrapData(response);
}

export async function deleteSupplier(id: string) {
  const response = await api.delete<ApiResponse<unknown>>(`/suppliers/${id}`);
  return unwrapData(response);
}
