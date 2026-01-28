import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Contacto() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Contacto
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Nuestro equipo responde consultas de soporte y operaciones del panel.
      </Typography>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography fontWeight={700}>Correo</Typography>
            <Typography color="text.secondary">soporte@nutrivida.com</Typography>
            <Typography fontWeight={700} sx={{ mt: 2 }}>
              Horarios
            </Typography>
            <Typography color="text.secondary">
              Lunes a viernes de 9:00 a 18:00
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
