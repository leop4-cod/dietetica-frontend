import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Grid, Snackbar, Typography } from "@mui/material";
import { listCategories } from "../../api/categories.service";
import { listProducts } from "../../api/products.service";
import { getApiErrorMessage } from "../../api/axios";
import Loader from "../../components/Loader";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ categories: 0, products: 0 });
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  useEffect(() => {
    const fetchTotals = async () => {
      setLoading(true);
      try {
        const [categories, products] = await Promise.all([
          listCategories({ page: 1, limit: 1 }),
          listProducts({ page: 1, limit: 1 }),
        ]);
        const categoriesTotal =
          categories.meta?.totalItems ?? categories.meta?.total ?? categories.items?.length ?? 0;
        const productsTotal =
          products.meta?.totalItems ?? products.meta?.total ?? products.items?.length ?? 0;
        setTotals({ categories: categoriesTotal, products: productsTotal });
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
                <Typography color="text.secondary">Total categorias</Typography>
                <Typography variant="h4" fontWeight={800}>
                  {totals.categories}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Total productos</Typography>
                <Typography variant="h4" fontWeight={800}>
                  {totals.products}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}

