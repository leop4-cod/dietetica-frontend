import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { listCategories, deleteCategory } from "../../../api/categories.service";
import type { Category } from "../../../types/category";
import { getApiErrorMessage } from "../../../api/axios";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../auth/permissions";
import ConfirmDialog from "../../../components/ConfirmDialog";

const getRowId = (row: Category) => row.id ?? row.nombre;

function NoRowsOverlay() {
  return (
    <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
      No hay resultados
    </Box>
  );
}

export default function CategoriesList() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const canCreate = can(role, "create");
  const canEdit = can(role, "edit");
  const canDelete = can(role, "delete");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listCategories({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
      setRows(result.items ?? []);
      const total = result.meta?.totalItems ?? result.meta?.total ?? result.items?.length ?? 0;
      setRowCount(total);
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => row.nombre?.toLowerCase().includes(term));
  }, [rows, search]);

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
        flex: 1.2,
        valueGetter: ({ row }) => row.descripcion ?? "-",
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 260,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => navigate(`/admin/categorias/${row.id}`)}
            >
              Ver
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => {
                if (!canEdit) {
                  setSnackbar({ message: "No autorizado", type: "error" });
                  return;
                }
                navigate(`/admin/categorias/${row.id}/edit`);
              }}
            >
              Editar
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                if (!canDelete) {
                  setSnackbar({ message: "No autorizado", type: "error" });
                  return;
                }
                setSelected(row);
                setConfirmOpen(true);
              }}
            >
              Eliminar
            </Button>
          </Stack>
        ),
      },
    ],
    [canDelete, canEdit, navigate]
  );

  const handleDelete = async () => {
    if (!selected?.id) return;
    if (!canDelete) {
      setSnackbar({ message: "No autorizado", type: "error" });
      return;
    }
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
          <Typography color="text.secondary">Ordena tu catálogo por grupos.</Typography>
        </Box>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/categorias/new")}
          >
            Nueva categoría
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 3, mb: 2 }}>
        <TextField
          size="small"
          label="Buscar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nombre de la categoría"
          sx={{ minWidth: 240 }}
        />
      </Stack>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={getRowId}
        loading={loading}
        autoHeight
        paginationMode="server"
        rowCount={search ? filteredRows.length : rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        slots={{ noRowsOverlay: NoRowsOverlay }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar categoría"
        description="Esta acción no se puede deshacer."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmText={saving ? "Eliminando..." : "Eliminar"}
      />

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
