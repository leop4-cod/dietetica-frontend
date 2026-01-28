import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../../api/categories.service";
import type { Category } from "../../types/category";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import SearchBar from "../../components/SearchBar";
import CategoryForm from "./CategoryForm";

const getRowId = (row: Category) => row.id ?? row.nombre;

function NoRowsOverlay() {
  return (
    <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
      No hay resultados
    </Box>
  );
}

export default function CategoriesPage() {
  const { role } = useAuth();
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const canCreate = role === "admin" || role === "empleado";
  const canEdit = role === "admin" || role === "empleado";
  const canDelete = role === "admin";

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listCategories({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: search.trim() || undefined,
      });
      setRows(result.items ?? []);
      const total = result.meta?.totalItems ?? result.meta?.total ?? result.items?.length ?? 0;
      setRowCount(total);
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "nombre",
        headerName: "Nombre",
        flex: 1,
        valueGetter: ({ row }) => row.nombre ?? "Sin nombre",
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
              <Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(row)}>
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

  const openCreate = () => {
    if (!canCreate) {
      setSnackbar({ message: "No tienes permisos", type: "error" });
      return;
    }
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (row: Category) => {
    if (!canEdit) {
      setSnackbar({ message: "No tienes permisos", type: "error" });
      return;
    }
    setSelected(row);
    setFormOpen(true);
  };

  const handleSave = async (payload: { nombre: string; descripcion?: string }) => {
    if (selected && !canEdit) {
      setSnackbar({ message: "No tienes permisos", type: "error" });
      return;
    }
    if (!selected && !canCreate) {
      setSnackbar({ message: "No tienes permisos", type: "error" });
      return;
    }
    if (!payload.nombre.trim()) {
      setSnackbar({ message: "El nombre es obligatorio.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      if (selected?.id) {
        await updateCategory(selected.id, payload);
        setSnackbar({ message: "Categoría actualizada.", type: "success" });
      } else {
        await createCategory(payload);
        setSnackbar({ message: "Categoría creada.", type: "success" });
      }
      setFormOpen(false);
      fetchCategories();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) {
      setSnackbar({ message: "No tienes permisos", type: "error" });
      return;
    }
    if (!selected?.id) return;
    setSaving(true);
    try {
      await deleteCategory(selected.id);
      setSnackbar({ message: "Categoría eliminada.", type: "success" });
      setConfirmOpen(false);
      fetchCategories();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Categorías
          </Typography>
          <Typography color="text.secondary">Ordena las categorías visibles.</Typography>
        </Box>
        {canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Nueva categoría
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 3, mb: 2 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={() => setPaginationModel((prev) => ({ ...prev, page: 0 }))}
          placeholder="Buscar categoría"
        />
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        loading={loading}
        autoHeight
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        slots={{ noRowsOverlay: NoRowsOverlay }}
      />

      <CategoryForm
        open={formOpen}
        initialData={selected}
        loading={saving}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar categoria"
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
