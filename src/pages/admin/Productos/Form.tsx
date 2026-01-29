import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getProduct, updateProduct } from "../../../api/products.service";
import { listCategories } from "../../../api/categories.service";
import type { Category } from "../../../types/category";
import type { Product } from "../../../types/product";
import { getApiErrorMessage } from "../../../api/axios";
import Loader from "../../../components/Loader";
import { can } from "../../../auth/permissions";
import { useAuth } from "../../../auth/AuthContext";

type FormState = {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria_id: string;
  activo: boolean;
  image_url: string;
};

export default function ProductsForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { role } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState<FormState>({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria_id: "",
    activo: true,
    image_url: "",
  });

  const canCreate = can(role, "create");
  const canEdit = can(role, "edit");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const categoriesRes = await listCategories({ page: 1, limit: 200 });
        setCategories(categoriesRes.items ?? []);
        if (isEdit && id) {
          const product = await getProduct(id);
          setForm({
            nombre: product.nombre ?? "",
            descripcion: product.descripcion ?? "",
            precio: product.precio !== undefined ? String(product.precio) : "",
            stock: product.inventory?.stock !== undefined ? String(product.inventory?.stock) : "",
            categoria_id: String(product.category?.id ?? (product as any)?.categoria_id ?? ""),
            activo: product.activo ?? true,
            image_url: (product as any)?.image_url ?? "",
          });
        }
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const errors = useMemo(() => {
    return {
      nombre: form.nombre.trim().length === 0,
      descripcion: form.descripcion.trim().length === 0,
      precio: form.precio.trim().length === 0 || Number(form.precio) < 0,
      categoria_id: form.categoria_id.trim().length === 0,
      stock: form.stock.trim().length > 0 && Number(form.stock) < 0,
    };
  }, [form]);

  const isValid = !errors.nombre && !errors.descripcion && !errors.precio && !errors.categoria_id;

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      field === "activo" ? String(event.target.checked) : event.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: field === "activo" ? event.target.checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isEdit && !canEdit) {
      setSnackbar({ message: "No autorizado", type: "error" });
      return;
    }
    if (!isEdit && !canCreate) {
      setSnackbar({ message: "No autorizado", type: "error" });
      return;
    }
    if (!isValid) {
      setSnackbar({ message: "Completa los campos obligatorios.", type: "error" });
      return;
    }
    setSaving(true);
    try {
    const payload: Partial<Product> & { categoria_id: number; stock?: number } = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      categoria_id: Number(form.categoria_id),
      activo: form.activo,
      image_url: form.image_url.trim() || undefined,
    };
      if (form.stock.trim().length > 0) {
        payload.stock = Number(form.stock);
      }
      if (isEdit && id) {
        await updateProduct(id, payload);
        setSnackbar({ message: "Producto actualizado.", type: "success" });
        navigate(`/app/admin/productos/${id}`, { replace: true });
      } else {
        const created = await createProduct(payload);
        setSnackbar({ message: "Producto creado.", type: "success" });
        navigate(`/app/admin/productos/${created.id}`, { replace: true });
      }
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        {isEdit ? "Editar producto" : "Nuevo producto"}
      </Typography>
      <Card>
        <CardContent>
          <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={handleChange("nombre")}
              required
              error={errors.nombre}
              helperText={errors.nombre ? "Campo obligatorio" : undefined}
            />
            <TextField
              label="Descripción"
              value={form.descripcion}
              onChange={handleChange("descripcion")}
              required
              multiline
              minRows={3}
              error={errors.descripcion}
              helperText={errors.descripcion ? "Campo obligatorio" : undefined}
            />
            <TextField
              label="Precio"
              type="number"
              value={form.precio}
              onChange={handleChange("precio")}
              required
              error={errors.precio}
              helperText={errors.precio ? "Ingresa un precio válido" : undefined}
            />
            <TextField
              label="Stock"
              type="number"
              value={form.stock}
              onChange={handleChange("stock")}
              error={errors.stock}
              helperText={errors.stock ? "No puede ser negativo" : "Opcional"}
            />
            <TextField
              label="URL de imagen"
              value={form.image_url}
              onChange={handleChange("image_url")}
              helperText="Opcional"
            />
            <FormControl required error={errors.categoria_id}>
              <InputLabel>Categoría</InputLabel>
              <Select
                label="Categoría"
                value={form.categoria_id}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, categoria_id: String(event.target.value) }))
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category.id ?? category.nombre} value={String(category.id ?? "")}>
                    {category.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch checked={form.activo} onChange={handleChange("activo")} />}
              label="Activo"
            />
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate("/app/admin/productos")}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving || !isValid}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
