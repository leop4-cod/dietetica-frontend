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
            <Typography color="text.secondary">contacto@nutrivida.ec</Typography>
            <Typography fontWeight={700} sx={{ mt: 2 }}>
              Dirección
            </Typography>
            <Typography color="text.secondary">Quito, Ecuador</Typography>
            <Typography fontWeight={700} sx={{ mt: 2 }}>
              Teléfono
            </Typography>
            <Typography color="text.secondary">0995974161</Typography>
            <Typography fontWeight={700} sx={{ mt: 2 }}>
              Horarios
            </Typography>
            <Typography color="text.secondary">
              Lunes a Viernes: 8h00 a 17h00
            </Typography>
            <Typography color="text.secondary">
              Sábados: 9h00 a 13h00
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
