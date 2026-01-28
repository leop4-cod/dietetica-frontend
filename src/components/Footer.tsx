import { Box, Container, Divider, Stack, Typography, Link as MuiLink } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, pb: 4 }}>
      <Divider />
      <Container sx={{ pt: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between">
          <Stack spacing={1}>
            <Typography fontWeight={700}>Nutrivida</Typography>
            <Typography color="text.secondary" variant="body2">
              Nutrición personalizada, productos saludables y acompañamiento profesional.
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Quito, Ecuador
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight={700}>Enlaces</Typography>
            <MuiLink component={NavLink} to="/" color="text.secondary" underline="hover">
              Inicio
            </MuiLink>
            <MuiLink component={NavLink} to="/catalogo" color="text.secondary" underline="hover">
              Catálogo
            </MuiLink>
            <MuiLink component={NavLink} to="/contacto" color="text.secondary" underline="hover">
              Contacto
            </MuiLink>
            <MuiLink component={NavLink} to="/registro" color="text.secondary" underline="hover">
              Registrarse
            </MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
