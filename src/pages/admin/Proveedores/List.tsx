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
import {
  createSupplier,
  deleteSupplier,
  listSuppliers,
  updateSupplier,
  type Supplier,
} from "../../../api/suppliers.service";
import { getApiErrorMessage } from "../../../api/axios";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../auth/permissions";
import ConfirmDialog from "../../../components/ConfirmDialog";

const getRowId = (row: Supplier) => row.id ?? row.email ?? row.nombre ?? Math.random();

export default function ProveedoresList() {
  const { role } = useAuth();
  const [rows, setRows] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState({ nombre: "", contacto: "", email: "", telefono: "" });

  const canCreate = can(role, "create");
  const canEdit = can(role, "edit");
  const canDelete = can(role, "delete");

  const load = async () => {
    setLoading(true);
    try {
      const data = await listSuppliers();
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
      { field: "nombre", headerName: "Nombre", flex: 1 },
      { field: "contacto", headerName: "Contacto", width: 180 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "telefono", headerName: "Teléfono", width: 140 },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 220,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            {canEdit && (
              <Button
                size="small"
                onClick={() => {
                  setSelected(row);
                  setForm({
                    nombre: row.nombre ?? "",
                    contacto: row.contacto ?? "",
                    email: row.email ?? "",
                    telefono: row.telefono ?? "",
                  });
                  setFormOpen(true);
                }}
              >
                Editar
              </Button>
            )}
            {canDelete && (
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
    [canDelete, canEdit]
  );

  const handleSave = async () => {
    if (!form.nombre) {
      setSnackbar({ message: "Completa el nombre.", type: "error" });
      return;
    }
    try {
      const payload: Supplier = {
        nombre: form.nombre.trim(),
        contacto: form.contacto.trim() || undefined,
        email: form.email.trim() || undefined,
        telefono: form.telefono.trim() || undefined,
      };
      if (selected?.id) {
        await updateSupplier(String(selected.id), payload);
        setSnackbar({ message: "Proveedor actualizado.", type: "success" });
      } else {
        await createSupplier(payload);
        setSnackbar({ message: "Proveedor creado.", type: "success" });
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
      await deleteSupplier(String(selected.id));
      setSnackbar({ message: "Proveedor eliminado.", type: "success" });
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
          Proveedores
        </Typography>
        {canCreate && (
          <Button
            variant="contained"
            onClick={() => {
              setSelected(null);
              setForm({ nombre: "", contacto: "", email: "", telefono: "" });
              setFormOpen(true);
            }}
          >
            Nuevo proveedor
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
        <DialogTitle>{selected ? "Editar proveedor" : "Nuevo proveedor"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              required
            />
            <TextField
              label="Contacto"
              value={form.contacto}
              onChange={(event) => setForm((prev) => ({ ...prev, contacto: event.target.value }))}
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <TextField
              label="Teléfono"
              value={form.telefono}
              onChange={(event) => setForm((prev) => ({ ...prev, telefono: event.target.value }))}
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
        title="Eliminar proveedor"
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
