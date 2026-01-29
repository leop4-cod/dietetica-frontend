import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { listProducts, deleteProduct } from "../../../api/products.service";
import { listCategories } from "../../../api/categories.service";
import type { Product } from "../../../types/product";
import type { Category } from "../../../types/category";
import { getApiErrorMessage } from "../../../api/axios";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../auth/permissions";
import ConfirmDialog from "../../../components/ConfirmDialog";

const getRowId = (row: Product) => row.id ?? (row as any)._id ?? row.nombre;

function NoRowsOverlay() {
  return (
    <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
      No hay resultados
    </Box>
  );
}

export default function ProductsList() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [rows, setRows] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const canCreate = can(role, "create");
  const canEdit = can(role, "edit");
  const canDelete = can(role, "delete");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listProducts({
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

  const fetchCategories = useCallback(async () => {
    try {
      const result = await listCategories({ page: 1, limit: 200 });
      setCategories(result.items ?? []);
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredRows = useMemo(() => {
    if (categoryFilter === "all") return rows;
    return rows.filter((row) => {
      const catId = row.category?.id ?? (row as any)?.categoria_id;
      return String(catId ?? "") === categoryFilter;
    });
  }, [rows, categoryFilter]);

  const columns = useMemo<GridColDef<Product>[]>(
    () => [
      {
        field: "nombre",
        headerName: "Nombre",
        flex: 1,
        valueGetter: (_value, row) => row?.nombre ?? "Sin nombre",
      },
      {
        field: "precio",
        headerName: "Precio",
        width: 140,
        valueGetter: (_value, row) => (row?.precio !== undefined ? `$${row.precio}` : "-"),
      },
      {
        field: "stock",
        headerName: "Stock",
        width: 120,
        valueGetter: (_value, row) => row?.inventory?.stock ?? "-",
      },
      {
        field: "categoria",
        headerName: "Categoría",
        width: 180,
        valueGetter: (_value, row) => row?.category?.nombre ?? "-",
      },
      {
        field: "activo",
        headerName: "Activo",
        width: 110,
        valueGetter: (_value, row) => (row?.activo ? "Sí" : "No"),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 260,
        sortable: false,
        renderCell: (params) => {
          const row = params?.row;
          if (!row) return null;
          return (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => navigate(`/app/admin/productos/${row.id}`)}
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
                  navigate(`/app/admin/productos/${row.id}/edit`);
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
          );
        },
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
      await deleteProduct(selected.id);
      setSnackbar({ message: "Producto eliminado.", type: "success" });
      setConfirmOpen(false);
      fetchProducts();
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
            Productos
          </Typography>
          <Typography color="text.secondary">Gestiona tu catálogo con permisos por rol.</Typography>
        </Box>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          onClick={() => navigate("/app/admin/productos/new")}
          >
            Nuevo producto
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 3, mb: 2 }}>
        <TextField
          size="small"
          label="Buscar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nombre del producto"
          sx={{ minWidth: 240 }}
        />
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel>Categoría</InputLabel>
          <Select
            label="Categoría"
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
          >
            <MenuItem value="all">Todas</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id ?? category.nombre} value={String(category.id ?? "")}>
                {category.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={getRowId}
        loading={loading}
        autoHeight
        paginationMode="server"
        rowCount={categoryFilter === "all" ? rowCount : filteredRows.length}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        slots={{ noRowsOverlay: NoRowsOverlay }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar producto"
        description="Esta acción no se puede deshacer."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmText={saving ? "Eliminando..." : "Eliminar"}
      />

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
