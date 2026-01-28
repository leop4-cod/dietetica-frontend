import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          Contacto
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Escríbenos para recibir más información o agendar una consulta personalizada.
        </Typography>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Nombre completo" fullWidth />
              <TextField label="Correo electrónico" type="email" fullWidth />
              <TextField label="Mensaje" multiline minRows={4} fullWidth />
              <Button variant="contained">Enviar mensaje</Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                Nutrivida
              </Typography>
              <Typography color="text.secondary">Quito, Ecuador</Typography>
              <Typography color="text.secondary">0995974161</Typography>
              <Typography color="text.secondary">contacto@nutrivida.ec</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography fontWeight={700}>Horarios</Typography>
                <Typography color="text.secondary">Lunes a Viernes: 8h00 a 17h00</Typography>
                <Typography color="text.secondary">Sábados: 9h00 a 13h00</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
