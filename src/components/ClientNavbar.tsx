import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ClientNavbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login/cliente", { replace: true });
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight={800}
          component={NavLink}
          to="/app/cliente"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          Nutrivida
        </Typography>
        <Stack direction="row" spacing={1} sx={{ ml: 3, display: { xs: "none", md: "flex" } }}>
          <Button component={NavLink} to="/app/cliente/catalogo">
            Catálogo
          </Button>
          <Button component={NavLink} to="/app/cliente/carrito">
            Carrito
          </Button>
          <Button component={NavLink} to="/app/cliente/mis-compras">
            Mis compras
          </Button>
          <Button component={NavLink} to="/app/cliente/direcciones">
            Direcciones
          </Button>
          <Button component={NavLink} to="/app/cliente/resenas">
            Reseñas
          </Button>
          <Button component={NavLink} to="/app/cliente/planes">
            Planes
          </Button>
          <Button component={NavLink} to="/app/cliente/citas">
            Citas
          </Button>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Hola, {user?.nombre ?? "cliente"}
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Salir
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
