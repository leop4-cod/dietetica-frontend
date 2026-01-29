import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getProduct } from "../../api/products.service";
import { addToCart } from "../../api/cart.service";
import { listReviews, type Review } from "../../api/reviews.service";
import type { Product } from "../../types/product";
import { getApiErrorMessage } from "../../api/axios";
import { getImageUrl } from "../../utils/images";
import EmptyState from "../../components/EmptyState";

export default function ProductoDetalleCliente() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;
      try {
        const data = await listReviews();
        const filtered = Array.isArray(data)
          ? data.filter((review) => review.productId === id)
          : [];
        setReviews(filtered);
      } catch {
        setReviews([]);
      }
    };
    loadReviews();
  }, [id]);

  const handleAdd = async () => {
    if (!product?.id) return;
    try {
      await addToCart({ product_id: String(product.id), cantidad });
      setSnackbar({ message: "Producto agregado al carrito.", type: "success" });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  const stock = useMemo(() => product?.inventory?.stock ?? null, [product]);

  if (!product) {
    return (
      <Box sx={{ py: 6 }}>
        <EmptyState title="No se encontró el producto" description="Intenta con otro artículo." />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>
        {product.nombre}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardMedia
              component="img"
              height="320"
              image={getImageUrl(product, "product")}
              alt={product.nombre}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                {product.descripcion || "Sin descripción."}
              </Typography>
              <Typography sx={{ mt: 2 }} fontWeight={700}>
                {product.precio ? `$${product.precio}` : "Precio a consultar"}
              </Typography>
              <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                Categoría: {product.category?.nombre ?? "Sin categoría"}
              </Typography>
              <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                Stock: {stock ?? "Sin información"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <TextField
          label="Cantidad"
          type="number"
          value={cantidad}
          onChange={(event) => setCantidad(Math.max(1, Number(event.target.value)))}
          sx={{ width: 160 }}
        />
        <Button variant="contained" onClick={handleAdd}>
          Agregar al carrito
        </Button>
      </Stack>

      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Reseñas
        </Typography>
        {reviews.length === 0 ? (
          <EmptyState title="Sin reseñas" description="Aún no hay reseñas para este producto." />
        ) : (
          <Grid container spacing={2}>
            {reviews.map((review) => (
              <Grid item xs={12} md={6} key={review._id ?? review.id}>
                <Card>
                  <CardContent>
                    <Typography fontWeight={700}>Calificación: {review.rating}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {review.comentario || "Sin comentario"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
