import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Snackbar, Stack, Typography } from "@mui/material";
import { listNutritionPlans, type NutritionPlan } from "../../api/nutrition-plans.service";
import { getApiErrorMessage } from "../../api/axios";
import EmptyState from "../../components/EmptyState";
import { createPlanReservation } from "../../api/plan-reservations.service";
import { useAuth } from "../../auth/AuthContext";

export default function Planes() {
  const { user } = useAuth();
  const userId = user?.id ?? (user as any)?._id;
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [saving, setSaving] = useState<string | null>(null);

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

  const handleReserve = async (planId?: string) => {
    if (!planId) return;
    if (!userId) {
      setSnackbar({ message: "Inicia sesiÃ³n para reservar un plan.", type: "error" });
      return;
    }
    setSaving(planId);
    try {
      await createPlanReservation({ planId, userId: String(userId) });
      setSnackbar({ message: "Reserva registrada. Te contactaremos pronto.", type: "success" });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setSaving(null);
    }
  };

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
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => handleReserve(String(plan.id ?? plan._id ?? ""))}
                  disabled={saving === String(plan.id ?? plan._id ?? "")}
                >
                  Reservar plan
                </Button>
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
