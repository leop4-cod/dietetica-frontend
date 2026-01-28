import { Outlet, NavLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

export default function PublicLayout() {
  return (
    <Box>
      <AppBar position="sticky" elevation={0} color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={800}>
            Nutrivida
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={NavLink} to="/" color="inherit">
              Inicio
            </Button>
            <Button component={NavLink} to="/catalogo" color="inherit">
              Catálogo
            </Button>
            <Button component={NavLink} to="/contacto" color="inherit">
              Contacto
            </Button>
            <Button component={NavLink} to="/registro" color="inherit">
              Regístrate
            </Button>
            <Button component={NavLink} to="/login-cliente" variant="contained">
              Ingreso de clientes
            </Button>
            <Button component={NavLink} to="/login-staff" variant="outlined">
              Ingreso del personal
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
