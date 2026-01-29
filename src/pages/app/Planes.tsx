import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Snackbar, Stack, Typography } from "@mui/material";
import { listNutritionPlans, type NutritionPlan } from "../../api/nutrition-plans.service";
import { getApiErrorMessage } from "../../api/axios";
import EmptyState from "../../components/EmptyState";

export default function Planes() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listNutritionPlans();
        setPlans(Array.isArray(data) ? data : []);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      }
    };
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Planes nutricionales
      </Typography>

      {plans.length === 0 ? (
        <EmptyState
          title="No hay planes disponibles"
          description="Cuando el backend tenga planes activos aparecerán aquí."
        />
      ) : (
        <Stack spacing={2}>
          {plans.map((plan) => (
            <Card key={plan.id ?? plan._id ?? plan.objetivo}>
              <CardContent>
                <Typography fontWeight={700}>{plan.objetivo}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Calorías diarias: {plan.calorias_diarias}
                </Typography>
                {plan.recomendaciones?.length ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {plan.recomendaciones.join(" · ")}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Sin recomendaciones registradas
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
      >
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
