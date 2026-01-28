import { Stack, Typography, Card, CardContent } from "@mui/material";

export default function About() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Sobre nuestro proyecto</Typography>
      <Typography variant="body1" color="text.secondary">
        Nutrivida es una plataforma que conecta el cuidado nutricional con operaciones de venta
        eficientes. Centraliza inventario, proveedores y planes de alimentacion.
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>
            Nuestro enfoque
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Informacion clara para equipos operativos y experiencia simple para clientes.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
