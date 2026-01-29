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
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
  type User,
} from "../../../api/users.service";
import { getApiErrorMessage } from "../../../api/axios";
import ConfirmDialog from "../../../components/ConfirmDialog";

const getRowId = (row: User) => row.id ?? row.email ?? Math.random();

export default function UsuariosList() {
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    rol: "cliente",
  });

  const load = async () => {
    setLoading(true);
    try {
      const result = await listUsers({ page: 1, limit: 50 });
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

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "nombre", headerName: "Nombre", flex: 1 },
      { field: "email", headerName: "Email", flex: 1 },
      { field: "telefono", headerName: "Teléfono", width: 160 },
      { field: "rol", headerName: "Rol", width: 140 },
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
              <Button
                size="small"
                onClick={() => {
                  setSelected(row);
                  setForm({
                    nombre: row.nombre ?? "",
                    email: row.email ?? "",
                    telefono: row.telefono ?? "",
                    password: "",
                    rol: row.rol ?? "cliente",
                  });
                  setFormOpen(true);
                }}
              >
                Editar
              </Button>
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
            </Stack>
          );
        },
      },
    ],
    []
  );

  const handleSave = async () => {
    if (!form.nombre || !form.email) {
      setSnackbar({ message: "Completa los campos obligatorios.", type: "error" });
      return;
    }
    if (!selected && (!form.password || !form.telefono)) {
      setSnackbar({ message: "Teléfono y contraseña son obligatorios.", type: "error" });
      return;
    }
    try {
      const payload = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim() || undefined,
        rol: form.rol,
        password: form.password || undefined,
      };
      if (selected?.id) {
        await updateUser(String(selected.id), payload);
        setSnackbar({ message: "Usuario actualizado.", type: "success" });
      } else {
        await createUser(payload);
        setSnackbar({ message: "Usuario creado.", type: "success" });
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
      await deleteUser(String(selected.id));
      setSnackbar({ message: "Usuario eliminado.", type: "success" });
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
          Usuarios
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelected(null);
            setForm({ nombre: "", email: "", telefono: "", password: "", rol: "cliente" });
            setFormOpen(true);
          }}
        >
          Nuevo usuario
        </Button>
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
        <DialogTitle>{selected ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              required
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <TextField
              label="Teléfono"
              value={form.telefono}
              onChange={(event) => setForm((prev) => ({ ...prev, telefono: event.target.value }))}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
            <TextField
              select
              label="Rol"
              value={form.rol}
              onChange={(event) => setForm((prev) => ({ ...prev, rol: event.target.value }))}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="empleado">Empleado</MenuItem>
              <MenuItem value="cliente">Cliente</MenuItem>
            </TextField>
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
        title="Eliminar usuario"
        description="Esta acción no se puede deshacer."
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
