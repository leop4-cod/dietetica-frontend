import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { listSales, type Sale } from "../../api/sales.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import { formatMoney } from "../../utils/format";

export default function MisCompras() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      try {
        const result = await listSales({ page: 1, limit: 50 });
        const items = result.items ?? [];
        setSales(items.filter((sale) => sale.user?.id === user?.id));
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      }
    };
    load();
  }, [user?.id]);

  const totalCompras = useMemo(
    () => sales.reduce((acc, sale) => acc + (sale.total ?? 0), 0),
    [sales]
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Mis compras
      </Typography>

      {sales.length === 0 ? (
        <Typography color="text.secondary">No tienes compras registradas.</Typography>
      ) : (
        <Stack spacing={2}>
          {sales.map((sale) => (
            <Card key={sale.id}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Typography fontWeight={700}>Compra #{sale.id}</Typography>
                    <Typography color="text.secondary">
                      {sale.fecha ? new Date(sale.fecha).toLocaleDateString() : "-"}
                    </Typography>
                    <Typography color="text.secondary">Estado: {sale.estado ?? "-"}</Typography>
                    <Typography sx={{ ml: "auto" }} fontWeight={700}>
                      ${formatMoney(sale.total)}
                    </Typography>
                  </Stack>
                  {sale.detalles && sale.detalles.length > 0 && (
                    <>
                      <Divider />
                      <Stack spacing={0.5}>
                        {sale.detalles.map((detail, index) => (
                          <Typography key={`${sale.id}-${index}`} variant="body2">
                            {detail.product?.nombre ?? "Producto"} · {detail.cantidad} x $
                            {detail.precio_unitario ?? 0}
                          </Typography>
                        ))}
                      </Stack>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
          <Typography fontWeight={700}>Total gastado: ${formatMoney(totalCompras)}</Typography>
        </Stack>
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
