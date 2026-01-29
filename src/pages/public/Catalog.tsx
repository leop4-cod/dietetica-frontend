import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  FormControl,
  GridLegacy as Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { listCategories } from "../../api/categories.service";
import { listProducts } from "../../api/products.service";
import { addToCart } from "../../api/cart.service";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import EmptyState from "../../components/EmptyState";
import ProductCard from "../../components/ProductCard";
import type { AxiosError } from "axios";

export default function Catalog() {
  const { role } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [productsUnavailable, setProductsUnavailable] = useState(false);
  const [categoriesUnavailable, setCategoriesUnavailable] = useState(false);
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
      const status = (error as AxiosError)?.response?.status;
      setProductsUnavailable(status === 404);
      setCategoriesUnavailable(status === 404);
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
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !term || product.nombre?.toLowerCase().includes(term);
      if (!matchesSearch) return false;
      if (categoryId === "all") return true;
      const catId = product.category?.id ?? (product as any)?.categoria_id;
      return String(catId ?? "") === categoryId;
    });
  }, [categoryId, products, search]);

  const handleAddToCart = async (productId?: string) => {
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
            disabled={categoriesUnavailable}
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
      {categoriesUnavailable && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Categorías no disponibles en API.
        </Typography>
      )}
      </Stack>

      {loading ? (
        <Box sx={{ py: 6 }}>
          <Typography align="center" color="text.secondary">
            Cargando catálogo...
          </Typography>
        </Box>
      ) : productsUnavailable ? (
        <Box sx={{ py: 6 }}>
          <EmptyState title="No disponible en API" description="El endpoint de productos no responde." />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ py: 6 }}>
          <EmptyState
            title="No hay resultados"
            description="Prueba con otra búsqueda o categoría."
          />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id ?? product.nombre}>
              <ProductCard
                product={product}
                detailsPath={`/producto/${product.id ?? ""}`}
                showAddToCart={role === "CLIENTE"}
                onAddToCart={handleAddToCart}
              />
            </Grid>
          ))}
        </Grid>
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
