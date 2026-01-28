import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { listProducts } from "../../api/products.service";
import { listCategories } from "../../api/categories.service";
import { addToCart } from "../../api/cart.service";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";
import { getApiErrorMessage } from "../../api/axios";

export default function CatalogoCliente() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [productRes, categoryRes] = await Promise.all([
          listProducts({ page: 1, limit: 100, search: search.trim() || undefined }),
          listCategories({ page: 1, limit: 200 }),
        ]);
        setProducts(productRes.items ?? []);
        setCategories(categoryRes.items ?? []);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search]);

  const filteredProducts = useMemo(() => {
    if (categoryId === "all") return products;
    return products.filter((product) => {
      const catId =
        product.category?.id ??
        product.categoria?.id ??
        (product as any)?.categoria_id ??
        (product as any)?.categoriaId;
      return String(catId ?? "") === categoryId;
    });
  }, [products, categoryId]);

  const handleAddToCart = async (productId?: string | number) => {
    if (!productId) return;
    try {
      await addToCart({ product_id: String(productId), cantidad: 1 });
      setSnackbar({ message: "Producto agregado al carrito.", type: "success" });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Catálogo
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Buscar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nombre del producto"
          sx={{ minWidth: 260 }}
        />
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            label="Categoría"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <MenuItem value="all">Todas</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id ?? cat.nombre} value={String(cat.id ?? "")}>
                {cat.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <Typography color="text.secondary">Cargando productos...</Typography>
      ) : filteredProducts.length === 0 ? (
        <Typography color="text.secondary">No hay productos disponibles.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id ?? product.nombre}>
              <Card>
                <CardContent>
                  <Typography fontWeight={700}>{product.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {product.descripcion || "Sin descripción"}
                  </Typography>
                  <Typography sx={{ mt: 2 }} fontWeight={700}>
                    {product.precio ? `$${product.precio}` : "Precio a consultar"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={NavLink} to={`/app/productos/${product.id}`}>
                    Ver detalle
                  </Button>
                  <Button variant="contained" onClick={() => handleAddToCart(product.id)}>
                    Agregar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
      >
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
