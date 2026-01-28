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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { listProducts, createProduct, updateProduct, deleteProduct } from "../../api/products.service";
import { listCategories } from "../../api/categories.service";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import SearchBar from "../../components/SearchBar";
import ProductForm from "./ProductForm";

const getRowId = (row: Product) => row.id ?? row.nombre;

function NoRowsOverlay() {
  return (
    <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
      No hay resultados
    </Box>
  );
}

export default function ProductsPage() {
  const { role } = useAuth();
  const [rows, setRows] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const canCreate = role === "admin" || role === "empleado";
  const canEdit = role === "admin" || role === "empleado";
  const canDelete = role === "admin";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listProducts({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: search.trim() || undefined,
        categoryId: categoryFilter === "all" ? undefined : categoryFilter,
      });
      setRows(result.items ?? []);
      const total = result.meta?.totalItems ?? result.meta?.total ?? result.items?.length ?? 0;
      setRowCount(total);
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize, search, categoryFilter]);

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

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "nombre",
        headerName: "Nombre",
        flex: 1,
        valueGetter: ({ row }) => row.nombre ?? "Sin nombre",
      },
      {
        field: "precio",
        headerName: "Precio",
        width: 140,
        valueGetter: ({ row }) => (row.precio ? `$${row.precio}` : "-"),
      },
      {
        field: "categoria",
        headerName: "Categoría",
        width: 180,
        valueGetter: ({ row }) =>
          row.categoria?.nombre ?? row.category?.nombre ?? row.categoriaId ?? "-",
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 220,
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

  const openEdit = (row: Product) => {
    if (!canEdit) {
      setSnackbar({ message: "No tienes permisos", type: "error" });
      return;
    }
    setSelected(row);
    setFormOpen(true);
  };

  const handleSave = async (payload: {
    nombre: string;
    descripcion?: string;
    precio?: number;
    categoriaId?: number | string;
  }) => {
    if (selected && !canEdit) {
      setSnackbar({ message: "No tienes permisos", type: "error" });
      return;
    }
    if (!selected && !canCreate) {
      setSnackbar({ message: "No tienes permisos", type: "error" });
      return;
    }
    if (!payload.nombre.trim() || !payload.categoriaId) {
      setSnackbar({ message: "Completa los campos obligatorios.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const normalizedPayload = {
        ...payload,
        categoryId: payload.categoriaId,
        categoriaId: payload.categoriaId,
        categoria_id: payload.categoriaId,
      } as Partial<Product> & {
        categoryId?: number | string;
        categoriaId?: number | string;
        categoria_id?: number | string;
      };
      if (selected?.id) {
        await updateProduct(selected.id, normalizedPayload);
        setSnackbar({ message: "Producto actualizado.", type: "success" });
      } else {
        await createProduct(normalizedPayload);
        setSnackbar({ message: "Producto creado.", type: "success" });
      }
      setFormOpen(false);
      fetchProducts();
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
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Nuevo producto
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 3, mb: 2 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={() => setPaginationModel((prev) => ({ ...prev, page: 0 }))}
          placeholder="Buscar producto"
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

      <ProductForm
        open={formOpen}
        initialData={selected}
        categories={categories}
        loading={saving}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar producto"
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
