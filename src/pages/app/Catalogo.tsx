import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
import { listProducts } from "../../api/products.service";
import { listCategories } from "../../api/categories.service";
import { addToCart } from "../../api/cart.service";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";
import { getApiErrorMessage } from "../../api/axios";
import EmptyState from "../../components/EmptyState";
import ProductCard from "../../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function CatalogoCliente() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? (user as any)?._id;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [categoriesUnavailable, setCategoriesUnavailable] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
    action?: "cart";
  } | null>(null);

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
        const status = (error as any)?.response?.status;
        setCategoriesUnavailable(status === 404);
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !term || product.nombre?.toLowerCase().includes(term);
      if (!matchesSearch) return false;
      if (categoryId === "all") return true;
      const catId = product.category?.id ?? (product as any)?.categoria_id;
      return String(catId ?? "") === categoryId;
    });
  }, [products, categoryId, search]);

  const handleAddToCart = async (productId?: string | number) => {
    if (!productId) return;
    if (!userId) {
      setSnackbar({ message: "Inicia sesiÃ³n para agregar al carrito.", type: "error" });
      return;
    }
    try {
      await addToCart({
        product_id: String(productId),
        cantidad: 1,
        user_id: String(userId),
      });
      setSnackbar({ message: "Producto agregado al carrito.", type: "success", action: "cart" });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  const handleGoToCart = () => {
    setSnackbar(null);
    navigate("/app/cliente/carrito");
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
            disabled={categoriesUnavailable}
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
      {categoriesUnavailable && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Categorías no disponibles en API.
        </Typography>
      )}

      {loading ? (
        <Typography color="text.secondary">Cargando productos...</Typography>
      ) : filteredProducts.length === 0 ? (
        <EmptyState title="No hay productos disponibles" description="Intenta otra búsqueda." />
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id ?? product.nombre}>
              <ProductCard
                product={product}
                detailsPath={`/app/cliente/producto/${product.id}`}
                showAddToCart
                onAddToCart={(id) => handleAddToCart(id)}
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
        {snackbar ? (
          <Alert
            severity={snackbar.type}
            action={
              snackbar.action === "cart" ? (
                <Button color="inherit" size="small" onClick={handleGoToCart}>
                  Ir al carrito
                </Button>
              ) : undefined
            }
          >
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
