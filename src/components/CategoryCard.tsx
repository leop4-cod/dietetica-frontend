import { Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import type { Category } from "../types/category";
import { getImageUrl } from "../utils/images";

type Props = {
  category: Category;
};

export default function CategoryCard({ category }: Props) {
  const imageUrl = getImageUrl(category, "category");

  return (
    <Card>
      <CardMedia component="img" height="160" image={imageUrl} alt={category.nombre} />
      <CardContent>
        <Stack spacing={1}>
          <Typography fontWeight={700}>{category.nombre}</Typography>
          <Typography variant="body2" color="text.secondary">
            {category.descripcion || "Sin descripción"}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
