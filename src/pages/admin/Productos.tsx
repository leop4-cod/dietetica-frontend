import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  type Product,
} from "../../api/services/products.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import LoaderButton from "../../components/LoaderButton";

const STATUS_OPTIONS = [
  { label: "Activo", value: true },
  { label: "Inactivo", value: false },
];

const getRowId = (row: Product) => row.id ?? row._id ?? "";

export default function Productos() {
  const { role } = useAuth();
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria_id: "",
    activo: true,
  });

  const canCreate = role === "ADMIN" || role === "EDITOR";
  const canEdit = role === "ADMIN" || role === "EDITOR";
  const canDelete = role === "ADMIN";
  const canChangeStatus = role === "OPERADOR";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await listProducts();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setSnackbar({ message: getApiErrorMessage(err), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
        field: "precio",
        headerName: "Precio",
        width: 120,
        valueGetter: ({ row }) => row.precio ?? row.price ?? "-",
      },
      {
        field: "stock",
        headerName: "Stock",
        width: 110,
        valueGetter: ({ row }) => row.inventory?.stock ?? row.stock ?? "-",
      },
      {
        field: "activo",
        headerName: "Estado",
        width: 130,
        valueGetter: ({ row }) => (row.activo ? "Activo" : "Inactivo"),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 260,
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
            {canChangeStatus && (
              <Button
                size="small"
                startIcon={<SyncIcon />}
                onClick={() => {
                  setSelected(row);
                  setForm((prev) => ({
                    ...prev,
                    activo: row.activo ?? true,
                  }));
                  setStatusOpen(true);
                }}
              >
                Estado
              </Button>
            )}
          </Stack>
        ),
      },
    ],
    [canEdit, canDelete, canChangeStatus]
  );

  const resetForm = () => {
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoria_id: "",
      activo: true,
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setSelected(null);
    setFormOpen(true);
  };

  const openEditDialog = (row: Product) => {
    setSelected(row);
    setForm({
      nombre: row.nombre ?? row.name ?? "",
      descripcion: row.descripcion ?? "",
      precio: String(row.precio ?? row.price ?? ""),
      stock: String(row.inventory?.stock ?? row.stock ?? ""),
      categoria_id: String(row.categoria_id ?? row.category?.id ?? ""),
      activo: row.activo ?? true,
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
    if (!form.descripcion.trim()) {
      setSnackbar({ message: "La descripcion es obligatoria.", type: "error" });
      return;
    }
    if (!form.precio.trim()) {
      setSnackbar({ message: "El precio es obligatorio.", type: "error" });
      return;
    }
    if (!form.categoria_id.trim()) {
      setSnackbar({ message: "La categoria es obligatoria.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const payload: Partial<Product> = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        stock: form.stock ? Number(form.stock) : undefined,
        categoria_id: Number(form.categoria_id),
        activo: form.activo,
      };

      if (selected && getRowId(selected)) {
        await updateProduct(getRowId(selected), payload);
        setSnackbar({ message: "Producto actualizado.", type: "success" });
      } else {
        await createProduct(payload);
        setSnackbar({ message: "Producto creado.", type: "success" });
      }
      setFormOpen(false);
      fetchProducts();
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
      await deleteProduct(getRowId(selected));
      setSnackbar({ message: "Producto eliminado.", type: "success" });
      setConfirmOpen(false);
      fetchProducts();
    } catch (err) {
      setSnackbar({ message: getApiErrorMessage(err), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!canChangeStatus) {
      setSnackbar({ message: "No tenes permisos para cambiar estado.", type: "error" });
      return;
    }
    if (!selected) return;
    setSaving(true);
    try {
      await updateProduct(getRowId(selected), { activo: form.activo });
      setSnackbar({ message: "Estado actualizado.", type: "success" });
      setStatusOpen(false);
      fetchProducts();
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
            Productos
          </Typography>
          <Typography color="text.secondary">
            Gestiona tu catalogo con permisos por rol.
          </Typography>
        </Box>
        {canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
            Nuevo producto
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
        <DialogTitle>{selected ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Descripcion"
              value={form.descripcion}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, descripcion: event.target.value }))
              }
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Precio"
              type="number"
              value={form.precio}
              onChange={(event) => setForm((prev) => ({ ...prev, precio: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Categoria ID"
              value={form.categoria_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, categoria_id: event.target.value }))
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                value={form.activo ? "true" : "false"}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, activo: event.target.value === "true" }))
                }
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.label} value={option.value ? "true" : "false"}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <LoaderButton variant="contained" onClick={handleSave} loading={saving}>
            Guardar
          </LoaderButton>
        </DialogActions>
      </Dialog>

      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Cambiar estado</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              value={form.activo ? "true" : "false"}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, activo: event.target.value === "true" }))
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.label} value={option.value ? "true" : "false"}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusOpen(false)}>Cancelar</Button>
          <LoaderButton variant="contained" onClick={handleStatusUpdate} loading={saving}>
            Actualizar
          </LoaderButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar producto"
        description="Esta accion no se puede deshacer."
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
