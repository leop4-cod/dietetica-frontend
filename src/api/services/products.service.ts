import { api } from "../axios";

export type Product = {
  id?: string | number;
  _id?: string | number;
  name?: string;
  nombre?: string;
  descripcion?: string;
  price?: number;
  precio?: number;
  stock?: number;
  categoria_id?: number;
  supplier_id?: string | number;
  activo?: boolean;
  category?: { id?: number; nombre?: string };
  inventory?: { stock?: number };
};

const BASE_PATH = "/products";

const unwrap = <T,>(payload: any): T => {
  if (payload?.data?.items !== undefined) return payload.data.items as T;
  if (payload?.items !== undefined) return payload.items as T;
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

export async function listProducts(): Promise<Product[]> {
  const { data } = await api.get(BASE_PATH);
  return unwrap<Product[]>(data);
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const { data } = await api.post(BASE_PATH, payload);
  return unwrap<Product>(data);
}

export async function updateProduct(
  id: string | number,
  payload: Partial<Product>
): Promise<Product> {
  const { data } = await api.put(`${BASE_PATH}/${id}`, payload);
  return unwrap<Product>(data);
}

export async function deleteProduct(id: string | number): Promise<void> {
  await api.delete(`${BASE_PATH}/${id}`);
}
