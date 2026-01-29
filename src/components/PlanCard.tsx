import { Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import type { NutritionPlan } from "../api/nutrition-plans.service";
import { getImageUrl } from "../utils/images";

type Props = {
  plan: NutritionPlan;
};

export default function PlanCard({ plan }: Props) {
  const imageUrl = getImageUrl(plan, "plan");

  return (
    <Card>
      <CardMedia component="img" height="160" image={imageUrl} alt={plan.objetivo} />
      <CardContent>
        <Stack spacing={1}>
          <Typography fontWeight={700}>{plan.objetivo}</Typography>
          <Typography variant="body2" color="text.secondary">
            Calorías diarias: {plan.calorias_diarias}
          </Typography>
          {plan.recomendaciones?.length ? (
            <Typography variant="body2" color="text.secondary">
              {plan.recomendaciones.slice(0, 3).join(" · ")}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sin recomendaciones registradas
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
