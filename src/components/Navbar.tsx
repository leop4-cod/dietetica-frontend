import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, role } = useAuth();
  const canAccessAdmin = role === "admin" || role === "empleado";

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" fontWeight={800} component={NavLink} to="/" sx={{ textDecoration: "none", color: "inherit" }}>
          Consulta Dietetica
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: "none", md: "flex" } }}>
          <Button component={NavLink} to="/catalog">
            Catalogo
          </Button>
          <Button component={NavLink} to="/plans">
            Planes
          </Button>
          <Button component={NavLink} to="/contact">
            Contacto
          </Button>
        </Stack>
        {token && canAccessAdmin ? (
          <Button variant="contained" component={NavLink} to="/admin/dashboard">
            Ir al panel
          </Button>
        ) : (
          <Button variant="contained" component={NavLink} to="/login">
            Iniciar sesion
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
