import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
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
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { listCategories } from "../../api/categories.service";
import { listProducts } from "../../api/products.service";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";
import { getApiErrorMessage } from "../../api/axios";

export default function Catalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        listCategories({ page: 1, limit: 200 }),
        listProducts({
          page: 1,
          limit: 100,
          search: search.trim() || undefined,
        }),
      ]);
      setCategories(cats.items ?? []);
      setProducts(prods.items ?? []);
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, search]);

  const filteredProducts = useMemo(() => {
    if (categoryId === "all") return products;
    return products.filter((product) => {
      const catId =
        product.categoria?.id ??
        product.category?.id ??
        (product as any)?.categoria_id ??
        (product as any)?.categoriaId;
      return String(catId ?? "") === categoryId;
    });
  }, [categoryId, products]);

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={800}>
          Catálogo saludable
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Buscar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nombre del producto"
            sx={{ maxWidth: 360 }}
          />
          <FormControl sx={{ maxWidth: 320 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              label="Categoría"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <MenuItem value="all">Todas</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id ?? cat.nombre} value={String(cat.id ?? cat.nombre)}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ py: 6 }}>
          <Typography align="center" color="text.secondary">
            Cargando catálogo...
          </Typography>
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ py: 6 }}>
          <Typography align="center" color="text.secondary">
            No hay resultados
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
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
                  <Button component={NavLink} to={`/catalogo/${product.id ?? ""}`}>
                    Ver detalle
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
