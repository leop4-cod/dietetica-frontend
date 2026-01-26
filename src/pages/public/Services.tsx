import { Grid, Card, CardContent, Stack, Typography } from "@mui/material";

const services = [
  {
    title: "Planes nutricionales",
    detail: "Programas segun objetivo, calorias y recomendaciones.",
  },
  {
    title: "Gestion de inventario",
    detail: "Stock actualizado por producto y alertas tempranas.",
  },
  {
    title: "Ventas y cupones",
    detail: "Registro de ventas, descuentos y detalle de productos.",
  },
];

export default function Services() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Servicios</Typography>
      <Typography variant="body1" color="text.secondary">
        Herramientas pensadas para dieteticas modernas, desde el control del catalogo hasta la
        atencion del cliente.
      </Typography>
      <Grid container spacing={2}>
        {services.map((service) => (
          <Grid key={service.title} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.detail}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
