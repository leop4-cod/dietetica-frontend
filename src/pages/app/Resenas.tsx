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
import { createReview, listReviews, type Review } from "../../api/reviews.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import { listProducts } from "../../api/products.service";
import type { Product } from "../../types/product";

export default function Resenas() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
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
        const response = await listProducts({ page: 1, limit: 200 });
        setProducts(response.items ?? []);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      }
    };
    loadProducts();
  }, []);

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
      Boolean(productId) &&
      comentario.trim().length > 0 &&
      rating >= 1 &&
      rating <= 5,
    [productId, comentario, rating]
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
              >
                {products.map((product) => (
                  <MenuItem key={product.id ?? product.nombre} value={String(product.id ?? "")}>
                    {product.nombre ?? "Producto"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
