import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2";
import SellIcon from "@mui/icons-material/Sell";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { NavLink } from "react-router-dom";
import { listCategories } from "../../api/categories.service";
import { listProducts } from "../../api/products.service";
import { listSales, type Sale } from "../../api/sales.service";
import { getApiErrorMessage } from "../../api/axios";
import Loader from "../../components/Loader";
import type { Product } from "../../types/product";
import { useAuth } from "../../auth/AuthContext";
import { can } from "../../auth/permissions";

export default function Dashboard() {
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ categories: 0, products: 0, sales: 0 });
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  useEffect(() => {
    const fetchTotals = async () => {
      setLoading(true);
      try {
        const [categories, products, sales] = await Promise.all([
          listCategories({ page: 1, limit: 1 }),
          listProducts({ page: 1, limit: 100 }),
          listSales({ page: 1, limit: 5 }),
        ]);
        const categoriesTotal =
          categories.meta?.totalItems ?? categories.meta?.total ?? categories.items?.length ?? 0;
        const productsTotal =
          products.meta?.totalItems ?? products.meta?.total ?? products.items?.length ?? 0;
        const salesTotal = sales.meta?.totalItems ?? sales.meta?.total ?? sales.items?.length ?? 0;
        setTotals({ categories: categoriesTotal, products: productsTotal, sales: salesTotal });
        setRecentSales(sales.items ?? []);
        const lowStockProducts = (products.items ?? []).filter(
          (product) => (product.inventory?.stock ?? 0) <= 5
        );
        setLowStock(lowStockProducts.slice(0, 5));
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchTotals();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      {loading ? (
        <Loader />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CategoryIcon color="primary" />
                  <Box>
                    <Typography color="text.secondary">Total categorías</Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {totals.categories}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <InventoryIcon color="primary" />
                  <Box>
                    <Typography color="text.secondary">Total productos</Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {totals.products}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <ShoppingBasketIcon color="primary" />
                  <Box>
                    <Typography color="text.secondary">Total ventas</Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {totals.sales}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <SellIcon color="primary" />
                  <Box>
                    <Typography color="text.secondary">Stock bajo</Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {lowStock.length}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {!loading && (
        <>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 4 }}>
            {(can(role, "create") || can(role, "edit")) && (
              <Button component={NavLink} to="/admin/productos/new" variant="contained">
                Nuevo producto
              </Button>
            )}
            {(can(role, "create") || can(role, "edit")) && (
              <Button component={NavLink} to="/admin/categorias/new" variant="outlined">
                Nueva categoría
              </Button>
            )}
            {(can(role, "view") || can(role, "change_state")) && (
              <Button component={NavLink} to="/admin/ventas" variant="outlined">
                Ver ventas
              </Button>
            )}
            {(can(role, "change_state") || can(role, "edit")) && (
              <Button component={NavLink} to="/admin/inventario" variant="outlined">
                Gestionar inventario
              </Button>
            )}
          </Stack>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Ventas recientes
                  </Typography>
                  {recentSales.length === 0 ? (
                    <Typography color="text.secondary">No hay ventas registradas.</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {recentSales.map((sale) => (
                        <Stack
                          key={sale.id}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box>
                            <Typography fontWeight={700}>#{sale.id}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {sale.user?.nombre ?? sale.user?.email ?? "-"}
                            </Typography>
                          </Box>
                          <Typography fontWeight={700}>
                            ${sale.total?.toFixed(2) ?? "0.00"}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Stock bajo
                  </Typography>
                  {lowStock.length === 0 ? (
                    <Typography color="text.secondary">Sin alertas de stock.</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {lowStock.map((product) => (
                        <Stack key={product.id ?? product.nombre} direction="row" spacing={2}>
                          <Typography fontWeight={700}>{product.nombre}</Typography>
                          <Typography color="text.secondary">
                            {product.inventory?.stock ?? 0} unidades
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
