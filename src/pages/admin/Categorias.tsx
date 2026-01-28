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
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  type Category,
} from "../../api/services/categories.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import LoaderButton from "../../components/LoaderButton";

const getRowId = (row: Category) => row.id ?? row._id ?? "";

export default function Categorias() {
  const { role } = useAuth();
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const canCreate = role === "ADMIN" || role === "EDITOR";
  const canEdit = role === "ADMIN" || role === "EDITOR";
  const canDelete = role === "ADMIN";

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await listCategories();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setSnackbar({ message: getApiErrorMessage(err), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "nombre",
        headerName: "Nombre",
        flex: 1,
        valueGetter: ({ row }) => row.nombre ?? row.name ?? "Sin nombre",
      },
      {
        field: "descripcion",
        headerName: "Descripción",
        flex: 1,
        valueGetter: ({ row }) => row.descripcion ?? "-",
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 200,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            {canEdit && (
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => openEditDialog(row)}
              >
                Editar
              </Button>
            )}
            {canDelete && (
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
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
    [canEdit, canDelete]
  );

  const resetForm = () => {
    setForm({ nombre: "", descripcion: "" });
  };

  const openCreateDialog = () => {
    resetForm();
    setSelected(null);
    setFormOpen(true);
  };

  const openEditDialog = (row: Category) => {
    setSelected(row);
    setForm({
      nombre: row.nombre ?? row.name ?? "",
      descripcion: row.descripcion ?? "",
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (selected && !canEdit) {
      setSnackbar({ message: "No tenes permisos para editar.", type: "error" });
      return;
    }
    if (!selected && !canCreate) {
      setSnackbar({ message: "No tenes permisos para crear.", type: "error" });
      return;
    }
    if (!form.nombre.trim()) {
      setSnackbar({ message: "El nombre es obligatorio.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const payload: Partial<Category> = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
      };
      if (selected && getRowId(selected)) {
        await updateCategory(getRowId(selected), payload);
        setSnackbar({ message: "Categoría actualizada.", type: "success" });
      } else {
        await createCategory(payload);
        setSnackbar({ message: "Categoría creada.", type: "success" });
      }
      setFormOpen(false);
      fetchCategories();
    } catch (err) {
      setSnackbar({ message: getApiErrorMessage(err), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) {
      setSnackbar({ message: "No tenes permisos para eliminar.", type: "error" });
      return;
    }
    if (!selected) return;
    setSaving(true);
    try {
      await deleteCategory(getRowId(selected));
      setSnackbar({ message: "Categoría eliminada.", type: "success" });
      setConfirmOpen(false);
      fetchCategories();
    } catch (err) {
      setSnackbar({ message: getApiErrorMessage(err), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Categorías
          </Typography>
          <Typography color="text.secondary">
            Ordena las categorías visibles en tu catálogo.
          </Typography>
        </Box>
        {canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
            Nueva categoría
          </Button>
        )}
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        loading={loading}
        autoHeight
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Descripción"
              value={form.descripcion}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, descripcion: event.target.value }))
              }
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <LoaderButton variant="contained" onClick={handleSave} loading={saving}>
            Guardar
          </LoaderButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar categoría"
        description="Esta acción no se puede deshacer."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmText="Eliminar"
      />

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
