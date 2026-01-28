import { NavLink } from "react-router-dom";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";
import { hasRole, useAuth } from "../auth/AuthContext";
import type { Role } from "../auth/permissions";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", roles: ["ADMIN", "EDITOR", "OPERADOR", "DOCTOR"] as Role[] },
  { label: "Productos", path: "/admin/productos", roles: ["ADMIN", "EDITOR", "OPERADOR", "DOCTOR"] as Role[] },
  { label: "Categorías", path: "/admin/categorias", roles: ["ADMIN", "EDITOR", "OPERADOR", "DOCTOR"] as Role[] },
  { label: "Planes nutricionales", path: "/admin/planes", roles: ["ADMIN", "EDITOR", "DOCTOR"] as Role[] },
  { label: "Ventas", path: "/admin/ventas", roles: ["ADMIN", "EDITOR", "OPERADOR", "DOCTOR"] as Role[] },
  { label: "Inventario", path: "/admin/inventario", roles: ["ADMIN", "OPERADOR", "DOCTOR"] as Role[] },
  { label: "Cupones", path: "/admin/cupones", roles: ["ADMIN", "EDITOR"] as Role[] },
  { label: "Proveedores", path: "/admin/proveedores", roles: ["ADMIN", "EDITOR"] as Role[] },
  { label: "Usuarios", path: "/admin/usuarios", roles: ["ADMIN"] as Role[] },
  { label: "Auth logs", path: "/admin/auth-logs", roles: ["ADMIN"] as Role[] },
];

type Props = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: Props) {
  const { role } = useAuth();

  return (
    <Box>
      <Toolbar sx={{ px: 2, py: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          Nutrivida
        </Typography>
      </Toolbar>
      <Divider />
      <List
        sx={{ px: 1, py: 2 }}
        subheader={
          <ListSubheader sx={{ fontWeight: 700, color: "text.primary" }}>
            Administración
          </ListSubheader>
        }
      >
        {navItems
          .filter((item) => hasRole(item.roles, role))
          .map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={onNavigate}
              sx={{
                borderRadius: 2,
                mx: 1,
                "&.active": {
                  background: "rgba(15,118,110,0.14)",
                  color: "primary.dark",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
      </List>
    </Box>
  );
}
