import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { api } from "../api/https";

type CartItem = { product_id: string; cantidad: number };

export default function CartPage() {
  const [cart, setCart] = useState<{
    user_id?: string;
    items?: CartItem[];
    total?: number;
  } | null>(null);
  const [productId, setProductId] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api<any>("/cart");
      const data = res?.data ?? res;
      setCart(data);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addItem = async () => {
    if (!productId) return;
    setLoading(true);
    setError("");
    try {
      const res = await api<any>("/cart", {
        method: "POST",
        body: JSON.stringify({ product_id: productId, cantidad: Number(cantidad) }),
      });
      const data = res?.data ?? res;
      setCart(data);
      setProductId("");
      setCantidad("1");
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await api<any>(`/cart/${id}`, { method: "DELETE" });
      const data = res?.data ?? res;
      setCart(data);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={700}>
            Carrito
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agrega o elimina productos del carrito activo.
          </Typography>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <TextField
                label="Producto ID"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                fullWidth
              />
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(event) => setCantidad(event.target.value)}
                sx={{ maxWidth: 140 }}
              />
              <Button variant="contained" onClick={addItem} disabled={loading}>
                Agregar
              </Button>
              <Button variant="outlined" onClick={loadCart} disabled={loading}>
                Recargar
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Items
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto ID</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell align="right">Accion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(cart?.items ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography align="center" py={2}>
                      Carrito vacio
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                cart?.items?.map((item) => (
                  <TableRow key={item.product_id}>
                    <TableCell>{item.product_id}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell align="right">
                      <Button
                        color="error"
                        size="small"
                        onClick={() => removeItem(item.product_id)}
                      >
                        Quitar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {cart && cart.total !== undefined && (
        <Card>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600}>
              Total
            </Typography>
            <Typography variant="h6">${cart.total}</Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
