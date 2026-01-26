import { Outlet, NavLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

const linkStyles = {
  color: "inherit",
  textDecoration: "none",
  fontWeight: 600,
  marginLeft: 16,
};

export default function PublicLayout() {
  return (
    <Box>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ borderBottom: "1px solid rgba(148,163,184,0.2)" }}>
          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            Dietetica
          </Typography>
          <NavLink to="/" style={linkStyles}>
            Inicio
          </NavLink>
          <NavLink to="/sobre" style={linkStyles}>
            Sobre
          </NavLink>
          <NavLink to="/servicios" style={linkStyles}>
            Servicios
          </NavLink>
          <NavLink to="/contacto" style={linkStyles}>
            Contacto
          </NavLink>
          <Button variant="contained" component={NavLink} to="/login" sx={{ ml: 2 }}>
            Ingresar
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
