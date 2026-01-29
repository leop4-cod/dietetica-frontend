import type { Category } from "./category";

export type Inventory = {
  id?: string;
  stock?: number;
  ubicacion?: string | null;
  updatedAt?: string;
};

export type Product = {
  id?: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
  categoria_id?: number;
  supplier_id?: string | null;
  image_url?: string | null;
  category?: Category;
  inventory?: Inventory;
};
