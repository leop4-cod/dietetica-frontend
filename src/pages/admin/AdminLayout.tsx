import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import RoleBadge from "../../components/RoleBadge";

const drawerWidth = 260;

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Categorias", path: "/admin/categories" },
  { label: "Productos", path: "/admin/products" },
];

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (themeValue) => themeValue.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={800}>
              Consulta Dietetica
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              {user?.nombre ? `Hola, ${user.nombre}` : "Panel administrativo"}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <RoleBadge role={role} />
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Salir
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ px: 2, pt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Administracion
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <List sx={{ px: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                mx: 1,
                "&.active": { background: "rgba(15,118,110,0.14)", color: "primary.dark" },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

