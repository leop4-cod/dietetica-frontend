import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Stack spacing={3} maxWidth={640}>
      <Typography variant="h4">Contacto</Typography>
      <Typography variant="body1" color="text.secondary">
        Si deseas mas informacion sobre el proyecto, dejanos un mensaje.
      </Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField label="Nombre" fullWidth />
            <TextField label="Email" fullWidth />
            <TextField label="Mensaje" fullWidth multiline minRows={4} />
            <Button variant="contained">Enviar mensaje</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
