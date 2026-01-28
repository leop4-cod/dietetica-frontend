import { useEffect, useState } from "react";
import { Box, Card, CardContent, Snackbar, Stack, Typography } from "@mui/material";
import { listNutritionPlans, type NutritionPlan } from "../../api/nutrition-plans.service";
import { getApiErrorMessage } from "../../api/axios";

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
        <Typography color="text.secondary">No hay planes disponibles.</Typography>
      ) : (
        <Stack spacing={2}>
          {plans.map((plan) => (
            <Card key={plan.id ?? plan._id ?? plan.nombre}>
              <CardContent>
                <Typography fontWeight={700}>{plan.nombre ?? "Plan nutricional"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.descripcion ?? plan.objetivo ?? "Sin descripción"}
                </Typography>
                {plan.calorias_diarias !== undefined && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Calorías diarias: {plan.calorias_diarias}
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
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
