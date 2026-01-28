import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { can, type Role } from "../auth/permissions";

const canAccessAdmin = (role: Role | null) => can(role, "view");

export default function NavbarPublic() {
  const { token, role } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          fontWeight={800}
          component={NavLink}
          to="/"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          Nutrivida
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button component={NavLink} to="/catalogo">
            Catálogo
          </Button>
          <Button component={NavLink} to="/app/planes">
            Planes
          </Button>
          <Button component={NavLink} to="/contacto">
            Contacto
          </Button>
        </Stack>
        {token ? (
          canAccessAdmin(role) ? (
            <Button variant="contained" component={NavLink} to="/admin/dashboard">
              Panel
            </Button>
          ) : (
            <Button variant="contained" component={NavLink} to="/app">
              Mi cuenta
            </Button>
          )
        ) : (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" component={NavLink} to="/registro">
              Registrarse
            </Button>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Iniciar sesión
            </Button>
          </Stack>
        )}
      </Toolbar>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Selecciona tu perfil</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Elige el tipo de acceso para continuar.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button component={NavLink} to="/login/cliente" onClick={() => setOpen(false)}>
            Soy Cliente
          </Button>
          <Button
            variant="contained"
            component={NavLink}
            to="/login/admin"
            onClick={() => setOpen(false)}
          >
            Soy Administrador
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
