import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { api } from "../api/https";

export default function InventoryPage() {
  const [productId, setProductId] = useState("");
  const [stock, setStock] = useState("");
  const [inventory, setInventory] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInventory = async () => {
    if (!productId) return;
    setLoading(true);
    setError("");
    try {
      const data = await api<any>(`/inventory/${productId}`);
      setInventory(data);
      setStock(data?.stock?.toString?.() ?? "");
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async () => {
    if (!productId) return;
    setLoading(true);
    setError("");
    try {
      const data = await api<any>(`/inventory/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ stock: Number(stock) }),
      });
      setInventory(data);
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
            Inventario
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta y ajusta stock por producto.
          </Typography>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Producto ID"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              fullWidth
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button variant="outlined" onClick={loadInventory} disabled={loading}>
                Buscar inventario
              </Button>
              <TextField
                label="Stock"
                type="number"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={updateStock} disabled={loading}>
                Actualizar stock
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {inventory && (
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Detalle de inventario
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box component="pre" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(inventory, null, 2)}
            </Box>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
