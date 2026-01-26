import { Box, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const highlights = [
  {
    title: "Nutricion personalizada",
    body: "Planes alimenticios basados en objetivos y habitos reales.",
  },
  {
    title: "Catalogo saludable",
    body: "Productos naturales, suplementos y opciones funcionales.",
  },
  {
    title: "Seguimiento simple",
    body: "Historial y recomendaciones siempre disponibles.",
  },
];

export default function Home() {
  return (
    <Stack spacing={4}>
      <Box
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          background:
            "linear-gradient(120deg, rgba(15,118,110,0.12), rgba(245,158,11,0.1))",
        }}
      >
        <Stack spacing={2} maxWidth={560}>
          <Typography variant="h3">Bienestar diario en tu dietetica</Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona productos, ventas y planes nutricionales desde un solo panel. Para clientes,
            una experiencia clara y ordenada.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" component={NavLink} to="/login">
              Acceder al panel
            </Button>
            <Button variant="outlined" component={NavLink} to="/sobre">
              Conocer mas
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {highlights.map((item) => (
          <Grid key={item.title} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.body}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
