import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

const plans = [
  {
    name: "Equilibrio Diario",
    price: "$29/mes",
    description: "Plan base para mejorar energia y habitos con seguimiento mensual.",
  },
  {
    name: "Metas Activas",
    price: "$59/mes",
    description: "Plan para perder peso o ganar masa con ajustes semanales y recetas.",
  },
  {
    name: "Performance Pro",
    price: "$89/mes",
    description: "Plan intensivo para deportistas con control de macros y soporte continuo.",
  },
];

export default function Plans() {
  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Planes nutricionales
        </Typography>
        <Typography color="text.secondary">
          Elige el plan que mejor se adapte a tu ritmo y objetivos.
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.name}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {plan.name}
                </Typography>
                <Typography color="primary" fontWeight={700} sx={{ mt: 1 }}>
                  {plan.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {plan.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

