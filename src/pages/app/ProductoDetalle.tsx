import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getProduct } from "../../api/products.service";
import { addToCart } from "../../api/cart.service";
import type { Product } from "../../types/product";
import { getApiErrorMessage } from "../../api/axios";

export default function ProductoDetalleCliente() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [cantidad, setCantidad] = useState(1);
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

  const handleAdd = async () => {
    if (!product?.id) return;
    try {
      await addToCart({ product_id: String(product.id), cantidad });
      setSnackbar({ message: "Producto agregado al carrito.", type: "success" });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  if (!product) {
    return (
      <Box sx={{ py: 6 }}>
        <Typography color="text.secondary">No se encontró el producto.</Typography>
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

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
