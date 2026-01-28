import { api } from "../axios";

export type Category = {
  id?: string | number;
  _id?: string | number;
  name?: string;
  nombre?: string;
  descripcion?: string;
};

const BASE_PATH = "/categories";

const unwrap = <T,>(payload: any): T => {
  if (payload?.data?.items !== undefined) return payload.data.items as T;
  if (payload?.items !== undefined) return payload.items as T;
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get(BASE_PATH);
  return unwrap<Category[]>(data);
}

export async function createCategory(payload: Partial<Category>): Promise<Category> {
  const { data } = await api.post(BASE_PATH, payload);
  return unwrap<Category>(data);
}

export async function updateCategory(
  id: string | number,
  payload: Partial<Category>
): Promise<Category> {
  const { data } = await api.put(`${BASE_PATH}/${id}`, payload);
  return unwrap<Category>(data);
}

export async function deleteCategory(id: string | number): Promise<void> {
  await api.delete(`${BASE_PATH}/${id}`);
}
