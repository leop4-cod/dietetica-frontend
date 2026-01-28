import { Box, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import SpaIcon from "@mui/icons-material/Spa";
import FavoriteIcon from "@mui/icons-material/Favorite";

const benefits = [
  { icon: <LocalDiningIcon />, title: "Catalogo saludable", copy: "Productos seleccionados por nutricionistas." },
  { icon: <SpaIcon />, title: "Planes personalizados", copy: "Estrategias practicas para tu objetivo." },
  { icon: <FavoriteIcon />, title: "Seguimiento real", copy: "Acompanamiento y mejoras sostenibles." },
];

export default function Home() {
  return (
    <Box>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Typography variant="h3" fontWeight={800}>
              Consulta Dietetica para una vida mas saludable
            </Typography>
            <Typography color="text.secondary">
              Descubre productos, planes nutricionales y un equipo listo para ayudarte a mejorar tus habitos.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button variant="contained" component={NavLink} to="/catalog">
                Ver catalogo
              </Button>
              <Button variant="outlined" component={NavLink} to="/login">
                Iniciar sesion
              </Button>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {benefits.map((item) => (
              <Grid item xs={12} sm={4} key={item.title}>
                <Card>
                  <CardContent>
                    <Stack spacing={1} alignItems="center">
                      {item.icon}
                      <Typography fontWeight={700}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {item.copy}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

