import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  GridLegacy as Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { getProduct } from "../../api/products.service";
import { listReviews } from "../../api/reviews.service";
import { addToCart } from "../../api/cart.service";
import type { Product } from "../../types/product";
import type { Review } from "../../api/reviews.service";
import { getApiErrorMessage } from "../../api/axios";
import { getImageUrl } from "../../utils/images";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../auth/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { role } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
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
    fetchReviews();
  }, [id]);

  const stock = useMemo(() => product?.inventory?.stock ?? null, [product]);

  const handleAddToCart = async () => {
    if (!product?.id) return;
    try {
      await addToCart({ product_id: String(product.id), cantidad: 1 });
      setSnackbar({ message: "Producto agregado al carrito.", type: "success" });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <Typography align="center" color="text.secondary">
          Cargando detalle...
        </Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ py: 6 }}>
        <EmptyState title="No encontramos el producto" description="Prueba con otro artículo." />
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
              {role === "CLIENTE" && (
                <Button variant="contained" sx={{ mt: 3 }} onClick={handleAddToCart}>
                  Agregar al carrito
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Reseñas
        </Typography>
        {reviews.length === 0 ? (
          <EmptyState title="Sin reseñas" description="Sé el primero en opinar." />
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
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Stack>
  );
}
