import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Grid, Typography } from "@mui/material";
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
        setProducts(Array.isArray(data) ? data : []);
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
        Este listado se alimenta desde tu backend. Usa el panel admin para gestionar
        productos y categorías.
      </Typography>
      {!token && (
        <Alert severity="info">
          Tu backend protege el endpoint de productos. Inicia sesión para ver el catálogo.
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Cargando productos...
        </Typography>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {products.map((product) => (
          <Grid item xs={12} md={4} key={product.id ?? product._id ?? product.nombre ?? product.name}>
            <Card>
              <CardContent>
                <Typography fontWeight={700}>
                  {product.nombre ?? product.name ?? "Producto"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estado: {product.estado ?? product.status ?? "SIN ESTADO"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: {product.precio ?? product.price ?? "-"}
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
