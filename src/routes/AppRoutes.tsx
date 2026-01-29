import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import RoleGuard from "../auth/RoleGuard";
import PublicLayout from "../components/PublicLayout";
import AdminLayout from "../components/AdminLayout";
import ClientLayout from "../components/ClientLayout";
import Home from "../pages/public/Home";
import Catalog from "../pages/public/Catalog";
import ProductDetail from "../pages/public/ProductDetail";
import Contact from "../pages/public/Contact";
import LoginCliente from "../pages/auth/LoginCliente";
import LoginAdmin from "../pages/auth/LoginAdmin";
import Dashboard from "../pages/admin/Dashboard";
import ProductsList from "../pages/admin/Productos/List";
import ProductsForm from "../pages/admin/Productos/Form";
import ProductsDetail from "../pages/admin/Productos/Detail";
import CategoriesList from "../pages/admin/Categorias/List";
import CategoriesForm from "../pages/admin/Categorias/Form";
import CategoriesDetail from "../pages/admin/Categorias/Detail";
import Registro from "../pages/public/Registro";
import NoAutorizado from "../pages/NoAutorizado";
import ClientDashboard from "../pages/app/Dashboard";
import CatalogoCliente from "../pages/app/Catalogo";
import ProductoDetalleCliente from "../pages/app/ProductoDetalle";
import Carrito from "../pages/app/Carrito";
import MisCompras from "../pages/app/MisCompras";
import Perfil from "../pages/app/Perfil";
import Direcciones from "../pages/app/Direcciones";
import Resenas from "../pages/app/Resenas";
import Planes from "../pages/app/Planes";
import Citas from "../pages/app/Citas";
import PlanesAdmin from "../pages/admin/Planes/List";
import VentasAdmin from "../pages/admin/Ventas/List";
import InventarioAdmin from "../pages/admin/Inventario/List";
import CuponesAdmin from "../pages/admin/Cupones/List";
import ProveedoresAdmin from "../pages/admin/Proveedores/List";
import UsuariosAdmin from "../pages/admin/Usuarios/List";
import AuthLogsAdmin from "../pages/admin/AuthLogs/List";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/contacto" element={<Contact />} />
        </Route>

        <Route path="/login" element={<Navigate to="/login/cliente" replace />} />
        <Route path="/login/cliente" element={<LoginCliente />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />
        <Route path="/app" element={<Navigate to="/app/cliente" replace />} />

        <Route
          path="/app/cliente"
          element={
            <ProtectedRoute redirectTo="/login/cliente">
              <RoleGuard roles={["CLIENTE"]}>
                <ClientLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="catalogo" element={<CatalogoCliente />} />
          <Route path="producto/:id" element={<ProductoDetalleCliente />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="mis-compras" element={<MisCompras />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="direcciones" element={<Direcciones />} />
          <Route path="resenas" element={<Resenas />} />
          <Route path="planes" element={<Planes />} />
          <Route path="citas" element={<Citas />} />
        </Route>

        <Route
          path="/app/admin"
          element={
            <ProtectedRoute redirectTo="/login/admin">
              <RoleGuard roles={["ADMIN", "EMPLEADO"]}>
                <AdminLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="productos">
            <Route index element={<ProductsList />} />
            <Route path="new" element={<ProductsForm />} />
            <Route path=":id" element={<ProductsDetail />} />
            <Route path=":id/edit" element={<ProductsForm />} />
          </Route>

          <Route path="categorias">
            <Route index element={<CategoriesList />} />
            <Route path="new" element={<CategoriesForm />} />
            <Route path=":id" element={<CategoriesDetail />} />
            <Route path=":id/edit" element={<CategoriesForm />} />
          </Route>
          <Route path="planes" element={<PlanesAdmin />} />
          <Route path="ventas" element={<VentasAdmin />} />
          <Route path="inventario" element={<InventarioAdmin />} />
          <Route path="cupones" element={<CuponesAdmin />} />
          <Route path="proveedores" element={<ProveedoresAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="auth-logs" element={<AuthLogsAdmin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
