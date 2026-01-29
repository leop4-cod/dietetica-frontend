import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { listSales } from "../../api/sales.service";
import { createReview, listReviews, type Review } from "../../api/reviews.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

type PurchasedProduct = { id: string; nombre: string };

export default function Resenas() {
  const { user } = useAuth();
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState("");
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const sales = await listSales({ page: 1, limit: 50 });
        const items = sales.items ?? [];
        const products: PurchasedProduct[] = [];
        items
          .filter((sale) => sale.user?.id === user?.id)
          .forEach((sale) => {
            sale.detalles?.forEach((detail) => {
              if (detail.product?.id) {
                products.push({
                  id: String(detail.product.id),
                  nombre: detail.product.nombre ?? "Producto",
                });
              }
            });
          });
        const unique = Array.from(new Map(products.map((p) => [p.id, p])).values());
        setPurchasedProducts(unique);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      }
    };
    loadProducts();
  }, [user?.id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await listReviews();
        const filtered = data.filter((review) => review.userId === user?.id);
        setReviews(filtered);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      }
    };
    loadReviews();
  }, [user?.id]);

  const canSubmit = useMemo(
    () =>
      purchasedProducts.length > 0 &&
      Boolean(productId) &&
      comentario.trim().length > 0 &&
      rating >= 1 &&
      rating <= 5,
    [productId, comentario, rating, purchasedProducts.length]
  );

  const handleSubmit = async () => {
    if (!user?.id) {
      setSnackbar({ message: "No se encontró usuario.", type: "error" });
      return;
    }
    if (!canSubmit) {
      setSnackbar({ message: "Completa los campos.", type: "error" });
      return;
    }
    try {
      await createReview({
        productId,
        userId: String(user.id),
        rating,
        comentario: comentario.trim(),
      });
      setSnackbar({ message: "Reseña enviada.", type: "success" });
      setComentario("");
      setRating(5);
      const data = await listReviews();
      setReviews(data.filter((review) => review.userId === user.id));
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Reseñas
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography fontWeight={700}>Nueva reseña</Typography>
            <FormControl fullWidth>
              <InputLabel>Producto</InputLabel>
              <Select
                label="Producto"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                disabled={purchasedProducts.length === 0}
              >
                {purchasedProducts.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {purchasedProducts.length === 0 && (
              <Typography color="text.secondary">
                No encontramos productos comprados para reseñar.
              </Typography>
            )}
            <TextField
              label="Calificación (1-5)"
              type="number"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
            />
            <TextField
              label="Comentario"
              value={comentario}
              onChange={(event) => setComentario(event.target.value)}
              multiline
              minRows={3}
            />
            <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit}>
              Enviar reseña
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Mis reseñas
      </Typography>
      {reviews.length === 0 ? (
        <Typography color="text.secondary">Aún no has creado reseñas.</Typography>
      ) : (
        <Stack spacing={2}>
          {reviews.map((review) => (
            <Card key={review.id ?? review._id ?? review.productId}>
              <CardContent>
                <Typography fontWeight={700}>Producto: {review.productId}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Calificación: {review.rating}
                </Typography>
                <Typography variant="body2">{review.comentario}</Typography>
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
