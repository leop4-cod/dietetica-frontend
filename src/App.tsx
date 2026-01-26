import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppShell from "./layouts/AppShell";
import ResourcePage from "./components/ResourcePage";
import { resourceConfigs } from "./resources/config";
import InventoryPage from "./pages/Inventory";
import CartPage from "./pages/Cart";
import MailPage from "./pages/Mail";
import PublicLayout from "./pages/public/PublicLayout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/contacto" element={<Contact />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          {Object.values(resourceConfigs).map((config) => (
            <Route
              key={config.key}
              path={config.path}
              element={
                <ProtectedRoute roles={config.roles}>
                  <ResourcePage config={config} />
                </ProtectedRoute>
              }
            />
          ))}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute roles={["ADMIN", "EDITOR", "OPERADOR"]}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={["ADMIN", "EDITOR", "OPERADOR", "CLIENTE"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mail"
            element={
              <ProtectedRoute roles={["ADMIN", "EDITOR"]}>
                <MailPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
