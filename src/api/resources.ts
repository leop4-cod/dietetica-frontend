import { api } from "./https";

type SuccessResponse<T> = { message?: string; data: T };

export type ListMeta = {
  totalItems?: number;
  itemCount?: number;
  itemsPerPage?: number;
  totalPages?: number;
  currentPage?: number;
};

export type ListResult<T> = { items: T[]; meta?: ListMeta };

function unwrap<T>(payload: any): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as SuccessResponse<T>).data;
  }
  return payload as T;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  });
  const query = qs.toString();
  return query ? `?${query}` : "";
}

export async function listResource<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<ListResult<T>> {
  const query = buildQuery(params);
  const res = await api<any>(`${path}${query}`);
  const data = unwrap<any>(res);

  if (data && Array.isArray(data.items)) {
    return { items: data.items, meta: data.meta };
  }
  if (Array.isArray(data)) {
    return { items: data };
  }
  if (data) {
    return { items: [data] };
  }
  return { items: [] };
}

export async function createResource<T>(path: string, payload: any): Promise<T> {
  const res = await api<any>(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrap<T>(res);
}

export async function updateResource<T>(
  path: string,
  id: string,
  payload: any,
  method: "PUT" | "PATCH" = "PUT",
): Promise<T> {
  const res = await api<any>(`${path}/${id}`, {
    method,
    body: JSON.stringify(payload),
  });
  return unwrap<T>(res);
}

export async function deleteResource(path: string, id: string): Promise<void> {
  await api(`${path}/${id}`, { method: "DELETE" });
}
