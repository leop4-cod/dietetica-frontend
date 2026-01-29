import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  GridLegacy as Grid,
  Stack,
  Typography,
} from "@mui/material";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SpaIcon from "@mui/icons-material/Spa";
import { NavLink } from "react-router-dom";
import { listProducts } from "../../api/products.service";
import { listCategories } from "../../api/categories.service";
import { listNutritionPlans } from "../../api/nutrition-plans.service";
import { getCart } from "../../api/cart.service";
import { listSales, type Sale } from "../../api/sales.service";
import { useAuth } from "../../auth/AuthContext";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [plansCount, setPlansCount] = useState(0);
  const [cartSummary, setCartSummary] = useState({ items: 0, total: 0 });
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [products, categories] = await Promise.all([
          listProducts({ page: 1, limit: 6 }),
          listCategories({ page: 1, limit: 6 }),
        ]);
        setProductsCount(products.meta?.totalItems ?? products.items?.length ?? 0);
        setCategoriesCount(categories.meta?.totalItems ?? categories.items?.length ?? 0);
      } catch {
        setProductsCount(0);
        setCategoriesCount(0);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plans = await listNutritionPlans();
        setPlansCount(Array.isArray(plans) ? plans.length : 0);
      } catch {
        setPlansCount(0);
      }
    };
    loadPlans();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await getCart();
        setCartSummary({ items: cart.items?.length ?? 0, total: cart.total ?? 0 });
      } catch {
        setCartSummary({ items: 0, total: 0 });
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const result = await listSales({ page: 1, limit: 5 });
        const items = result.items ?? [];
        const filtered = items.filter((sale) => sale.user?.id === user?.id);
        setRecentSales(filtered.slice(0, 3));
      } catch {
        setRecentSales([]);
      }
    };
    loadSales();
  }, [user?.id]);

  const greetingName = useMemo(() => user?.nombre ?? "cliente", [user?.nombre]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Hola, {greetingName}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <LocalMallIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Productos destacados
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {productsCount}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <CategoryIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Categorías
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {categoriesCount}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <SpaIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Planes nutricionales
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {plansCount}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <ShoppingCartIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Resumen de carrito
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {cartSummary.items} items · ${cartSummary.total.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <ReceiptLongIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Últimas compras
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {recentSales.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" component={NavLink} to="/app/cliente/catalogo">
          Ver catálogo
        </Button>
        <Button variant="outlined" component={NavLink} to="/app/cliente/carrito">
          Ir al carrito
        </Button>
        <Button variant="outlined" component={NavLink} to="/app/cliente/planes">
          Ver planes
        </Button>
      </Stack>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Últimas compras
        </Typography>
        {recentSales.length === 0 ? (
          <Typography color="text.secondary">Aún no tienes compras registradas.</Typography>
        ) : (
          <Stack spacing={2}>
            {recentSales.map((sale) => (
              <Card key={sale.id}>
                <CardContent>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <Box>
                      <Typography fontWeight={700}>Compra #{sale.id}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estado: {sale.estado ?? "sin estado"}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: "auto" }}>
                      <Typography fontWeight={700}>${sale.total?.toFixed(2) ?? "0.00"}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {sale.fecha ? new Date(sale.fecha).toLocaleDateString() : "-"}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
