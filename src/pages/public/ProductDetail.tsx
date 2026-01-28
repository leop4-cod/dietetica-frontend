import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Card, CardContent, Snackbar, Stack, Typography } from "@mui/material";
import { getProduct } from "../../api/products.service";
import type { Product } from "../../types/product";
import { getApiErrorMessage } from "../../api/axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
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
        <Typography align="center" color="text.secondary">
          No hay resultados
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>
        {product.nombre}
      </Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            {product.descripcion || "Sin descripción."}
          </Typography>
          <Typography sx={{ mt: 2 }} fontWeight={700}>
            {product.precio ? `$${product.precio}` : "Precio a consultar"}
          </Typography>
          <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
            Categoría: {product.categoria?.nombre ?? product.category?.nombre ?? "Sin categoría"}
          </Typography>
        </CardContent>
      </Card>
      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
