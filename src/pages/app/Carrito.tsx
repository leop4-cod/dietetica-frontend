import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { getCart, removeFromCart } from "../../api/cart.service";
import { createSale } from "../../api/sales.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import { formatMoney } from "../../utils/format";

export default function Carrito() {
  const { user } = useAuth();
  const userId = user?.id ?? (user as any)?._id;
  const [cart, setCart] = useState<{ items: any[]; total: number }>({ items: [], total: 0 });
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!userId) {
      setSnackbar({ message: "Inicia sesiÃ³n para ver el carrito.", type: "error" });
      return;
    }
    try {
      const data = await getCart(String(userId));
      setCart({ items: data.items ?? [], total: data.total ?? 0 });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  useEffect(() => {
    loadCart();
  }, [user?.id]);

  const handleRemove = async (productId: string) => {
    if (!userId) {
      setSnackbar({ message: "Inicia sesiÃ³n para editar el carrito.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await removeFromCart(productId, String(userId));
      await loadCart();
      setSnackbar({ message: "Producto eliminado del carrito.", type: "success" });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user?.id) {
      setSnackbar({ message: "No se encontró usuario.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await createSale({ user_id: String(user.id), metodo_pago: "tarjeta" });
      await loadCart();
      setSnackbar({ message: "Compra generada con éxito.", type: "success" });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Carrito
      </Typography>

      {cart.items.length === 0 ? (
        <Typography color="text.secondary">Tu carrito está vacío.</Typography>
      ) : (
        <Stack spacing={2}>
          {cart.items.map((item) => (
            <Card key={item.product_id}>
              <CardContent>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                  <Box>
                    <Typography fontWeight={700}>{item.nombre ?? "Producto"}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cantidad: {item.cantidad}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: "auto" }}>
                    <Typography fontWeight={700}>
                      ${item.subtotal ?? item.precio ?? 0}
                    </Typography>
                  </Box>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => handleRemove(item.product_id)}
                    disabled={loading}
                  >
                    Quitar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
          <Divider />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Total: ${formatMoney(cart.total)}
            </Typography>
            <Button
              variant="contained"
              onClick={handleCheckout}
              disabled={loading || cart.items.length === 0}
            >
              Finalizar compra
            </Button>
          </Stack>
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
