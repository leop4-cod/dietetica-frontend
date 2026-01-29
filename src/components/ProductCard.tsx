import { Box, Button, Card, CardActions, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import type { Product } from "../types/product";
import { getImageUrl } from "../utils/images";

type Props = {
  product: Product;
  detailsPath?: string;
  onAddToCart?: (id: string) => void;
  showAddToCart?: boolean;
};

export default function ProductCard({
  product,
  detailsPath = `/producto/${product.id ?? ""}`,
  onAddToCart,
  showAddToCart,
}: Props) {
  const imageUrl = getImageUrl(product, "product");

  return (
    <Card>
      <CardMedia component="img" height="180" image={imageUrl} alt={product.nombre} />
      <CardContent>
        <Stack spacing={1}>
          <Typography fontWeight={700}>{product.nombre}</Typography>
          <Typography variant="body2" color="text.secondary">
            {product.descripcion || "Sin descripción"}
          </Typography>
          <Typography fontWeight={700}>
            {product.precio !== undefined ? `$${product.precio}` : "Precio a consultar"}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button component={NavLink} to={detailsPath}>
          Ver detalle
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {showAddToCart && product.id && onAddToCart && (
          <Button variant="contained" onClick={() => onAddToCart(String(product.id))}>
            Agregar al carrito
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
