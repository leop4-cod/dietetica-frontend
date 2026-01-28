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

const getRowId = (row: Coupon) => row.id ?? row.codigo ?? Math.random();

export default function CuponesList() {
  const { role } = useAuth();
  const [rows, setRows] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
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
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "codigo", headerName: "Código", flex: 1 },
      { field: "descuento_porcentaje", headerName: "Descuento %", width: 140 },
      { field: "fecha_expiracion", headerName: "Expira", width: 160 },
      {
        field: "activo",
        headerName: "Activo",
        width: 100,
        valueGetter: ({ row }) => (row.activo ? "Sí" : "No"),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 220,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            {canManage && (
              <Button
                size="small"
                onClick={() => {
                  setSelected(row);
                  setForm({
                    codigo: row.codigo ?? "",
                    descuento_porcentaje: row.descuento_porcentaje?.toString() ?? "",
                    fecha_expiracion: row.fecha_expiracion ?? "",
                    activo: Boolean(row.activo),
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
        ),
      },
    ],
    [canManage]
  );

  const handleSave = async () => {
    if (!form.codigo || !form.descuento_porcentaje || !form.fecha_expiracion) {
      setSnackbar({ message: "Completa los campos obligatorios.", type: "error" });
      return;
    }
    try {
      const payload: Coupon = {
        codigo: form.codigo.trim(),
        descuento_porcentaje: Number(form.descuento_porcentaje),
        fecha_expiracion: form.fecha_expiracion,
        activo: form.activo,
      };
      if (selected?.id) {
        await updateCoupon(String(selected.id), payload);
        setSnackbar({ message: "Cupón actualizado.", type: "success" });
      } else {
        await createCoupon(payload);
        setSnackbar({ message: "Cupón creado.", type: "success" });
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
      setSnackbar({ message: "Cupón eliminado.", type: "success" });
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
        <Typography variant="h4" fontWeight={800}>
          Cupones
        </Typography>
        {canManage && (
          <Button
            variant="contained"
            onClick={() => {
              setSelected(null);
              setForm({
                codigo: "",
                descuento_porcentaje: "",
                fecha_expiracion: "",
                activo: true,
              });
              setFormOpen(true);
            }}
          >
            Nuevo cupón
          </Button>
        )}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          autoHeight
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? "Editar cupón" : "Nuevo cupón"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Código"
              value={form.codigo}
              onChange={(event) => setForm((prev) => ({ ...prev, codigo: event.target.value }))}
              required
            />
            <TextField
              label="Descuento %"
              type="number"
              value={form.descuento_porcentaje}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, descuento_porcentaje: event.target.value }))
              }
              required
            />
            <TextField
              label="Fecha expiración"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.fecha_expiracion}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fecha_expiracion: event.target.value }))
              }
              required
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
        title="Eliminar cupón"
        description="Esta acción no se puede deshacer."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmText="Eliminar"
      />

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
