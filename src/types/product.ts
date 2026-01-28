import type { Category } from "./category";

export type Inventory = {
  id?: string;
  stock?: number;
  ubicacion?: string;
  updatedAt?: string;
};

export type Product = {
  id?: number | string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
  stock?: number;
  categoria_id?: number;
  supplier_id?: string | null;
  category?: Category;
  categoria?: Category;
  inventory?: Inventory;
};
