import type { ReactNode } from "react";
import type { Role } from "../auth/auth";

export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "textarea"
  | "select"
  | "stringArray";

export type FieldOption = { label: string; value: string };

export type FieldConfig = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: FieldOption[];
  source?: string;
};

export type ColumnConfig = {
  key: string;
  label: string;
  getValue?: (row: any) => ReactNode;
};

export type ResourceConfig = {
  key: string;
  label: string;
  path: string;
  endpoint: string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  createMethod?: "POST";
  updateMethod?: "PUT" | "PATCH";
  roles?: Role[];
  createRoles?: Role[];
  updateRoles?: Role[];
  deleteRoles?: Role[];
};

export type NavItem = {
  label: string;
  path: string;
  roles?: Role[];
};

export type NavSection = {
  header: string;
  items: NavItem[];
};

export const resourceConfigs: Record<string, ResourceConfig> = {
  users: {
    key: "users",
    label: "Usuarios",
    path: "/users",
    endpoint: "/users",
    roles: ["ADMIN"],
    createRoles: ["ADMIN"],
    updateRoles: ["ADMIN"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "id", label: "ID" },
      { key: "nombre", label: "Nombre" },
      { key: "email", label: "Email" },
      { key: "telefono", label: "Telefono" },
      { key: "rol", label: "Rol" },
      { key: "fecha_registro", label: "Registro" },
    ],
    fields: [
      { name: "nombre", label: "Nombre", required: true },
      { name: "email", label: "Email", required: true },
      { name: "telefono", label: "Telefono" },
      { name: "password", label: "Password", required: true, source: "__empty__" },
      {
        name: "rol",
        label: "Rol",
        type: "select",
        options: [
          { label: "Admin", value: "admin" },
          { label: "Empleado", value: "empleado" },
          { label: "Cliente", value: "cliente" },
        ],
      },
      { name: "codigo_secreto", label: "Codigo Secreto" },
    ],
  },
  categories: {
    key: "categories",
    label: "Categorias",
    path: "/categories",
    endpoint: "/categories",
    roles: ["ADMIN", "OPERADOR"],
    createRoles: ["ADMIN", "OPERADOR"],
    updateRoles: ["ADMIN", "OPERADOR"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "id", label: "ID" },
      { key: "nombre", label: "Nombre" },
      { key: "descripcion", label: "Descripcion" },
    ],
    fields: [
      { name: "nombre", label: "Nombre", required: true },
      { name: "descripcion", label: "Descripcion", type: "textarea" },
    ],
  },
  products: {
    key: "products",
    label: "Productos",
    path: "/products",
    endpoint: "/products",
    roles: ["ADMIN", "OPERADOR"],
    createRoles: ["ADMIN", "OPERADOR"],
    updateRoles: ["ADMIN", "OPERADOR"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "id", label: "ID" },
      { key: "nombre", label: "Nombre" },
      { key: "precio", label: "Precio" },
      {
        key: "inventory.stock",
        label: "Stock",
        getValue: (row) => row?.inventory?.stock ?? "-",
      },
      {
        key: "category.nombre",
        label: "Categoria",
        getValue: (row) => row?.category?.nombre ?? "-",
      },
      {
        key: "supplier.nombre",
        label: "Proveedor",
        getValue: (row) => row?.supplier?.nombre ?? "-",
      },
      { key: "activo", label: "Activo" },
    ],
    fields: [
      { name: "nombre", label: "Nombre", required: true },
      { name: "descripcion", label: "Descripcion", type: "textarea", required: true },
      { name: "precio", label: "Precio", type: "number", required: true },
      { name: "stock", label: "Stock", type: "number", source: "inventory.stock" },
      {
        name: "categoria_id",
        label: "Categoria ID",
        type: "number",
        required: true,
        source: "category.id",
      },
      { name: "supplier_id", label: "Proveedor ID", source: "supplier.id" },
      { name: "activo", label: "Activo", type: "boolean" },
    ],
  },
  suppliers: {
    key: "suppliers",
    label: "Proveedores",
    path: "/suppliers",
    endpoint: "/suppliers",
    roles: ["ADMIN", "OPERADOR"],
    createRoles: ["ADMIN", "OPERADOR"],
    updateRoles: ["ADMIN", "OPERADOR"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "id", label: "ID" },
      { key: "nombre", label: "Nombre" },
      { key: "contacto", label: "Contacto" },
      { key: "email", label: "Email" },
      { key: "telefono", label: "Telefono" },
      { key: "fecha_registro", label: "Registro" },
    ],
    fields: [
      { name: "nombre", label: "Nombre", required: true },
      { name: "contacto", label: "Contacto" },
      { name: "email", label: "Email" },
      { name: "telefono", label: "Telefono" },
    ],
  },
  addresses: {
    key: "addresses",
    label: "Direcciones",
    path: "/addresses",
    endpoint: "/addresses",
    roles: ["ADMIN", "OPERADOR", "CLIENTE"],
    createRoles: ["ADMIN", "OPERADOR", "CLIENTE"],
    updateRoles: ["ADMIN", "OPERADOR", "CLIENTE"],
    deleteRoles: ["ADMIN", "OPERADOR", "CLIENTE"],
    columns: [
      { key: "id", label: "ID" },
      {
        key: "user.email",
        label: "Usuario",
        getValue: (row) => row?.user?.email ?? "-",
      },
      { key: "calle", label: "Calle" },
      { key: "ciudad", label: "Ciudad" },
      { key: "codigo_postal", label: "Codigo Postal" },
      { key: "referencia", label: "Referencia" },
    ],
    fields: [
      { name: "user_id", label: "Usuario ID", required: true, source: "user.id" },
      { name: "calle", label: "Calle", required: true },
      { name: "ciudad", label: "Ciudad", required: true },
      { name: "codigo_postal", label: "Codigo Postal", required: true },
      { name: "referencia", label: "Referencia" },
    ],
  },
  coupons: {
    key: "coupons",
    label: "Cupones",
    path: "/coupons",
    endpoint: "/coupons",
    roles: ["ADMIN", "OPERADOR"],
    createRoles: ["ADMIN"],
    updateRoles: ["ADMIN"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "id", label: "ID" },
      { key: "codigo", label: "Codigo" },
      { key: "descuento_porcentaje", label: "Descuento %" },
      { key: "fecha_expiracion", label: "Expira" },
      { key: "activo", label: "Activo" },
    ],
    fields: [
      { name: "codigo", label: "Codigo", required: true },
      {
        name: "descuento_porcentaje",
        label: "Descuento %",
        type: "number",
        required: true,
      },
      { name: "fecha_expiracion", label: "Fecha Expiracion", type: "date", required: true },
      { name: "activo", label: "Activo", type: "boolean" },
    ],
  },
  sales: {
    key: "sales",
    label: "Ventas",
    path: "/sales",
    endpoint: "/sales",
    roles: ["ADMIN", "OPERADOR", "CLIENTE"],
    createRoles: ["ADMIN", "OPERADOR", "CLIENTE"],
    updateRoles: ["ADMIN", "OPERADOR"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "id", label: "ID" },
      {
        key: "user.email",
        label: "Cliente",
        getValue: (row) => row?.user?.email ?? "-",
      },
      { key: "total", label: "Total" },
      { key: "metodo_pago", label: "Pago" },
      { key: "estado", label: "Estado" },
      { key: "fecha", label: "Fecha" },
    ],
    fields: [
      { name: "user_id", label: "Usuario ID", required: true, source: "user.id" },
      { name: "metodo_pago", label: "Metodo Pago", required: true },
      { name: "estado", label: "Estado" },
      { name: "coupon_code", label: "Cupon", source: "coupon.codigo" },
    ],
  },
  saleDetails: {
    key: "sale-details",
    label: "Detalles Venta",
    path: "/sale-details",
    endpoint: "/sale-details",
    updateMethod: "PATCH",
    roles: ["ADMIN", "OPERADOR"],
    createRoles: ["ADMIN", "OPERADOR"],
    updateRoles: ["ADMIN", "OPERADOR"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "id", label: "ID" },
      {
        key: "sale.id",
        label: "Venta",
        getValue: (row) => row?.sale?.id ?? "-",
      },
      {
        key: "product.nombre",
        label: "Producto",
        getValue: (row) => row?.product?.nombre ?? "-",
      },
      { key: "cantidad", label: "Cantidad" },
      { key: "precio_unitario", label: "Precio Unitario" },
      { key: "subtotal", label: "Subtotal" },
    ],
    fields: [
      { name: "sale_id", label: "Venta ID", required: true, source: "sale.id" },
      { name: "product_id", label: "Producto ID", required: true, source: "product.id" },
      { name: "cantidad", label: "Cantidad", type: "number", required: true },
      { name: "precio_unitario", label: "Precio Unitario", type: "number", required: true },
    ],
  },
  reviews: {
    key: "reviews",
    label: "Resenas",
    path: "/reviews",
    endpoint: "/reviews",
    roles: ["ADMIN", "OPERADOR", "CLIENTE"],
    createRoles: ["ADMIN", "OPERADOR", "CLIENTE"],
    updateRoles: ["ADMIN", "OPERADOR", "CLIENTE"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "_id", label: "ID" },
      { key: "productId", label: "Producto ID" },
      { key: "userId", label: "Usuario ID" },
      { key: "rating", label: "Rating" },
      { key: "comentario", label: "Comentario" },
    ],
    fields: [
      { name: "productId", label: "Producto ID", required: true },
      { name: "userId", label: "Usuario ID", required: true },
      { name: "rating", label: "Rating", type: "number", required: true },
      { name: "comentario", label: "Comentario", type: "textarea", required: true },
    ],
  },
  nutritionPlans: {
    key: "nutrition-plans",
    label: "Planes Nutricionales",
    path: "/nutrition-plans",
    endpoint: "/nutrition-plans",
    updateMethod: "PATCH",
    roles: ["ADMIN", "OPERADOR"],
    createRoles: ["ADMIN", "OPERADOR"],
    updateRoles: ["ADMIN", "OPERADOR"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "_id", label: "ID" },
      { key: "userId", label: "Usuario ID" },
      { key: "objetivo", label: "Objetivo" },
      { key: "calorias_diarias", label: "Calorias" },
      { key: "recomendaciones", label: "Recomendaciones" },
    ],
    fields: [
      { name: "userId", label: "Usuario ID", required: true },
      { name: "objetivo", label: "Objetivo", required: true },
      { name: "calorias_diarias", label: "Calorias Diarias", type: "number", required: true },
      { name: "recomendaciones", label: "Recomendaciones", type: "stringArray" },
    ],
  },
  history: {
    key: "history",
    label: "Historial",
    path: "/history",
    endpoint: "/history",
    roles: ["ADMIN", "OPERADOR", "CLIENTE"],
    createRoles: ["ADMIN", "OPERADOR", "CLIENTE"],
    updateRoles: ["ADMIN", "OPERADOR", "CLIENTE"],
    deleteRoles: ["ADMIN", "OPERADOR", "CLIENTE"],
    columns: [
      { key: "_id", label: "ID" },
      { key: "userId", label: "Usuario ID" },
      { key: "productId", label: "Producto ID" },
      { key: "date", label: "Fecha" },
    ],
    fields: [
      { name: "userId", label: "Usuario ID", required: true },
      { name: "productId", label: "Producto ID", required: true },
    ],
  },
  authLogs: {
    key: "auth-logs",
    label: "Auth Logs",
    path: "/auth-logs",
    endpoint: "/auth-logs",
    roles: ["ADMIN"],
    createRoles: ["ADMIN"],
    updateRoles: ["ADMIN"],
    deleteRoles: ["ADMIN"],
    columns: [
      { key: "_id", label: "ID" },
      { key: "userId", label: "Usuario ID" },
      { key: "accion", label: "Accion" },
      { key: "fecha", label: "Fecha" },
    ],
    fields: [
      { name: "userId", label: "Usuario ID", required: true },
      { name: "accion", label: "Accion", required: true },
      { name: "fecha", label: "Fecha", type: "date" },
    ],
  },
};

export const navSections: NavSection[] = [
  {
    header: "General",
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Mi Perfil", path: "/profile", roles: ["ADMIN", "OPERADOR", "CLIENTE"] },
      { label: "Usuarios", path: "/users", roles: ["ADMIN"] },
      { label: "Direcciones", path: "/addresses", roles: ["ADMIN", "OPERADOR", "CLIENTE"] },
    ],
  },
  {
    header: "Catalogo",
    items: [
      { label: "Categorias", path: "/categories", roles: ["ADMIN", "OPERADOR"] },
      { label: "Productos", path: "/products", roles: ["ADMIN", "OPERADOR"] },
      { label: "Proveedores", path: "/suppliers", roles: ["ADMIN", "OPERADOR"] },
      { label: "Inventario", path: "/inventory", roles: ["ADMIN", "OPERADOR"] },
    ],
  },
  {
    header: "Ventas",
    items: [
      { label: "Carrito", path: "/cart", roles: ["ADMIN", "OPERADOR", "CLIENTE"] },
      { label: "Ventas", path: "/sales", roles: ["ADMIN", "OPERADOR", "CLIENTE"] },
      { label: "Detalles Venta", path: "/sale-details", roles: ["ADMIN", "OPERADOR"] },
      { label: "Cupones", path: "/coupons", roles: ["ADMIN", "OPERADOR"] },
    ],
  },
  {
    header: "Clientes",
    items: [
      { label: "Pacientes", path: "/patients", roles: ["ADMIN", "OPERADOR"] },
      { label: "Resenas", path: "/reviews", roles: ["ADMIN", "OPERADOR", "CLIENTE"] },
      { label: "Planes Nutricionales", path: "/nutrition-plans", roles: ["ADMIN", "OPERADOR"] },
      { label: "Historial", path: "/history", roles: ["ADMIN", "OPERADOR", "CLIENTE"] },
    ],
  },
  {
    header: "Sistema",
    items: [
      { label: "Auth Logs", path: "/auth-logs", roles: ["ADMIN"] },
      { label: "Correo", path: "/mail", roles: ["ADMIN"] },
    ],
  },
];
