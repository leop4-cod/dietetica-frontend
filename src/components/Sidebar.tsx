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
  { label: "Dashboard", path: "/app/admin/dashboard", roles: ["ADMIN", "EMPLEADO"] as Role[] },
  { label: "Productos", path: "/app/admin/productos", roles: ["ADMIN", "EMPLEADO"] as Role[] },
  { label: "Categorías", path: "/app/admin/categorias", roles: ["ADMIN", "EMPLEADO"] as Role[] },
  { label: "Planes nutricionales", path: "/app/admin/planes", roles: ["ADMIN", "EMPLEADO"] as Role[] },
  { label: "Ventas", path: "/app/admin/ventas", roles: ["ADMIN", "EMPLEADO"] as Role[] },
  { label: "Inventario", path: "/app/admin/inventario", roles: ["ADMIN", "EMPLEADO"] as Role[] },
  { label: "Cupones", path: "/app/admin/cupones", roles: ["ADMIN", "EMPLEADO"] as Role[] },
  { label: "Proveedores", path: "/app/admin/proveedores", roles: ["ADMIN", "EMPLEADO"] as Role[] },
  { label: "Reservas planes", path: "/app/admin/reservas-planes", roles: ["ADMIN", "EMPLEADO"] as Role[] },
  { label: "Usuarios", path: "/app/admin/usuarios", roles: ["ADMIN"] as Role[] },
  { label: "Auth logs", path: "/app/admin/auth-logs", roles: ["ADMIN"] as Role[] },
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
