import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { listSales, updateSale, type Sale } from "../../../api/sales.service";
import { getApiErrorMessage } from "../../../api/axios";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../auth/permissions";

const getRowId = (row: Sale) => row.id ?? Math.random();

export default function VentasList() {
  const { role } = useAuth();
  const [rows, setRows] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Sale | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [estado, setEstado] = useState("");
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const canEdit = can(role, "edit");

  const load = async () => {
    setLoading(true);
    try {
      const result = await listSales({ page: 1, limit: 50 });
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
    return rows.filter((row) => {
      const matchesEstado = estadoFilter === "all" || row.estado === estadoFilter;
      const matchesText =
        !term ||
        row.id?.toLowerCase().includes(term) ||
        row.user?.email?.toLowerCase().includes(term) ||
        row.user?.nombre?.toLowerCase().includes(term);
      return matchesEstado && matchesText;
    });
  }, [rows, search, estadoFilter]);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "ID", width: 220 },
      {
        field: "cliente",
        headerName: "Cliente",
        flex: 1,
        valueGetter: ({ row }) => row.user?.email ?? row.user?.nombre ?? "-",
      },
      { field: "total", headerName: "Total", width: 140 },
      { field: "metodo_pago", headerName: "Pago", width: 140 },
      { field: "estado", headerName: "Estado", width: 140 },
      {
        field: "fecha",
        headerName: "Fecha",
        width: 160,
        valueGetter: ({ row }) =>
          row.fecha ? new Date(row.fecha).toLocaleDateString() : "-",
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 220,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() => {
                setSelected(row);
                setDetailOpen(true);
              }}
            >
              Ver
            </Button>
            {canEdit && (
              <Button
                size="small"
                onClick={() => {
                  setSelected(row);
                  setEstado(row.estado ?? "");
                  setStatusOpen(true);
                }}
              >
                Cambiar estado
              </Button>
            )}
          </Stack>
        ),
      },
    ],
    [canEdit]
  );

  const handleUpdateStatus = async () => {
    if (!selected?.id) return;
    try {
      await updateSale(String(selected.id), { estado });
      setSnackbar({ message: "Estado actualizado.", type: "success" });
      setStatusOpen(false);
      await load();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Ventas
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Buscar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cliente o ID"
          sx={{ minWidth: 260 }}
        />
        <TextField
          select
          size="small"
          label="Estado"
          value={estadoFilter}
          onChange={(event) => setEstadoFilter(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="procesando">Procesando</MenuItem>
          <MenuItem value="completado">Completado</MenuItem>
          <MenuItem value="cancelado">Cancelado</MenuItem>
        </TextField>
      </Stack>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={getRowId}
        autoHeight
        loading={loading}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle de venta</DialogTitle>
        <DialogContent>
          {selected ? (
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography>Cliente: {selected.user?.email ?? "-"}</Typography>
              <Typography>Total: ${selected.total?.toFixed(2) ?? "0.00"}</Typography>
              <Typography>Estado: {selected.estado ?? "-"}</Typography>
              <Typography>Pago: {selected.metodo_pago ?? "-"}</Typography>
              {selected.detalles && selected.detalles.length > 0 && (
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  {selected.detalles.map((detail, index) => (
                    <Typography key={`${selected.id}-${index}`} variant="body2">
                      {detail.product?.nombre ?? "Producto"} · {detail.cantidad} x $
                      {detail.precio_unitario ?? 0}
                    </Typography>
                  ))}
                </Stack>
              )}
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDetailOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Actualizar estado</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Estado"
            value={estado}
            onChange={(event) => setEstado(event.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="procesando">Procesando</MenuItem>
            <MenuItem value="completado">Completado</MenuItem>
            <MenuItem value="cancelado">Cancelado</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setStatusOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdateStatus}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
