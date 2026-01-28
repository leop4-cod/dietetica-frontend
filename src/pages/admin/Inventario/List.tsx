import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { listProducts } from "../../../api/products.service";
import { updateStock } from "../../../api/inventory.service";
import type { Product } from "../../../types/product";
import { getApiErrorMessage } from "../../../api/axios";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../auth/permissions";

const getRowId = (row: Product) => row.id ?? row.nombre;

export default function InventarioList() {
  const { role } = useAuth();
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [stockValue, setStockValue] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [search, setSearch] = useState("");

  const canUpdate = can(role, "change_state") || can(role, "edit");

  const load = async () => {
    setLoading(true);
    try {
      const result = await listProducts({ page: 1, limit: 200 });
      setRows(result.items ?? []);
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => row.nombre?.toLowerCase().includes(term));
  }, [rows, search]);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "nombre", headerName: "Producto", flex: 1 },
      {
        field: "stock",
        headerName: "Stock",
        width: 140,
        valueGetter: ({ row }) => row.inventory?.stock ?? 0,
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 180,
        sortable: false,
        renderCell: ({ row }) => (
          <Button
            size="small"
            disabled={!canUpdate}
            onClick={() => {
              setSelected(row);
              setStockValue(String(row.inventory?.stock ?? 0));
              setOpen(true);
            }}
          >
            Actualizar
          </Button>
        ),
      },
    ],
    [canUpdate]
  );

  const handleSave = async () => {
    if (!selected?.id) return;
    try {
      await updateStock(String(selected.id), Number(stockValue));
      setSnackbar({ message: "Stock actualizado.", type: "success" });
      setOpen(false);
      await load();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Inventario
      </Typography>
      <TextField
        size="small"
        label="Buscar"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Nombre del producto"
        sx={{ mb: 2, minWidth: 260 }}
      />

      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={getRowId}
        autoHeight
        loading={loading}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Actualizar stock</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Stock"
              type="number"
              value={stockValue}
              onChange={(event) => setStockValue(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

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
