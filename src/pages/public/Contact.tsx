import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          Contacto
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Escribenos para recibir mas informacion o agendar una consulta personalizada.
        </Typography>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Nombre completo" fullWidth />
              <TextField label="Correo electronico" type="email" fullWidth />
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
                Consulta Dietetica
              </Typography>
              <Typography color="text.secondary">Av. Salud 123, Ciudad Saludable</Typography>
              <Typography color="text.secondary">+54 11 5555-5555</Typography>
              <Typography color="text.secondary">hola@consultadietetica.com</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography fontWeight={700}>Horarios</Typography>
                <Typography color="text.secondary">Lunes a Viernes: 9 a 18 hs</Typography>
                <Typography color="text.secondary">Sabados: 9 a 13 hs</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

