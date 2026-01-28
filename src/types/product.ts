import type { Category } from "./category";

export type Product = {
  id?: number | string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoriaId?: number | string;
  categoria?: Category;
  category?: Category;
};

