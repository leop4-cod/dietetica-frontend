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
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
  type Coupon,
} from "../../../api/coupons.service";
import { getApiErrorMessage } from "../../../api/axios";
import { useAuth } from "../../../auth/AuthContext";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EmptyState from "../../../components/EmptyState";

const getRowId = (row: Coupon) => row.id ?? row.codigo ?? Math.random();

export default function CuponesList() {
  const { role } = useAuth();
  const [rows, setRows] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState({
    codigo: "",
    descuento_porcentaje: "",
    fecha_expiracion: "",
    activo: true,
  });

  const canManage = role === "ADMIN";

  const load = async () => {
    setLoading(true);
    try {
      const data = await listCoupons();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      setUnavailable((error as any)?.response?.status === 404);
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = useMemo<GridColDef<Coupon>[]>(
    () => [
      { field: "codigo", headerName: "Codigo", flex: 1 },
      { field: "descuento_porcentaje", headerName: "Descuento %", width: 140 },
      { field: "fecha_expiracion", headerName: "Expira", width: 160 },
      {
        field: "activo",
        headerName: "Activo",
        width: 100,
        valueGetter: (_value, row) => (row?.activo ? "Si" : "No"),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 220,
        sortable: false,
        renderCell: (params) => {
          const row = params?.row;
          if (!row) return null;
          return (
            <Stack direction="row" spacing={1}>
              {canManage && (
                <Button
                  size="small"
                  onClick={() => {
                    setSelected(row);
                    setForm({
                      codigo: row?.codigo ?? "",
                      descuento_porcentaje: String(row?.descuento_porcentaje ?? ""),
                      fecha_expiracion: row?.fecha_expiracion ?? "",
                      activo: row?.activo ?? true,
                    });
                    setFormOpen(true);
                  }}
                >
                  Editar
                </Button>
              )}
              {canManage && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    setSelected(row);
                    setConfirmOpen(true);
                  }}
                >
                  Eliminar
                </Button>
              )}
            </Stack>
          );
        },
      },
    ],
    [canManage]
  );

  const handleSave = async () => {
    if (!form.codigo || !form.descuento_porcentaje) {
      setSnackbar({ message: "Completa los campos obligatorios.", type: "error" });
      return;
    }
    try {
      const payload = {
        codigo: form.codigo.trim(),
        descuento_porcentaje: Number(form.descuento_porcentaje),
        fecha_expiracion: form.fecha_expiracion || undefined,
        activo: form.activo,
      };
      if (selected?.id) {
        await updateCoupon(String(selected.id), payload);
        setSnackbar({ message: "Cupon actualizado.", type: "success" });
      } else {
        await createCoupon(payload);
        setSnackbar({ message: "Cupon creado.", type: "success" });
      }
      setFormOpen(false);
      setSelected(null);
      await load();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    try {
      await deleteCoupon(String(selected.id));
      setSnackbar({ message: "Cupon eliminado.", type: "success" });
      setConfirmOpen(false);
      setSelected(null);
      await load();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Cupones
          </Typography>
          <Typography color="text.secondary">Gestiona descuentos y vigencias.</Typography>
        </Box>
        {canManage && (
          <Button
            variant="contained"
            onClick={() => {
              setSelected(null);
              setForm({ codigo: "", descuento_porcentaje: "", fecha_expiracion: "", activo: true });
              setFormOpen(true);
            }}
          >
            Nuevo cupon
          </Button>
        )}
      </Stack>

      {unavailable ? (
        <Box sx={{ mt: 3 }}>
          <EmptyState title="No disponible en API" description="El endpoint de cupones no existe." />
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            autoHeight
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? "Editar cupon" : "Nuevo cupon"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Codigo"
              value={form.codigo}
              onChange={(event) => setForm((prev) => ({ ...prev, codigo: event.target.value }))}
            />
            <TextField
              label="Descuento %"
              type="number"
              value={form.descuento_porcentaje}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, descuento_porcentaje: event.target.value }))
              }
            />
            <TextField
              label="Fecha de expiracion"
              type="date"
              value={form.fecha_expiracion}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fecha_expiracion: event.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, activo: event.target.checked }))
                  }
                />
              }
              label="Activo"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar cupon"
        description="Esta accion no se puede deshacer."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmText="Eliminar"
      />

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
