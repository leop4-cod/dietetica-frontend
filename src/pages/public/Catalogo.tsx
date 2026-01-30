import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, GridLegacy as Grid, Typography } from "@mui/material";
import { listProducts, type Product } from "../../api/services/products.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function Catalogo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await listProducts();
        const items = Array.isArray(data) ? data : data.items ?? [];
        setProducts(items);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Catálogo público
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Este listado se alimenta desde la API. Usa el panel admin para gestionar productos y
        categorías.
      </Typography>
      {!token && <Alert severity="info">Inicia sesión para ver el catálogo.</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Cargando productos...
        </Typography>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {products.map((product) => (
          <Grid item xs={12} md={4} key={product.id ?? product.nombre}>
            <Card>
              <CardContent>
                <Typography fontWeight={700}>{product.nombre ?? "Producto"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Estado:{" "}
                  {product.activo === undefined ? "SIN ESTADO" : product.activo ? "Activo" : "Inactivo"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: {product.precio ?? "-"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {!products.length && !error && (
          <Grid item xs={12}>
            <Typography color="text.secondary">No hay productos cargados.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
