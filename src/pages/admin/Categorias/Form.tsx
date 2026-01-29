import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { createCategory, getCategory, updateCategory } from "../../../api/categories.service";
import type { Category } from "../../../types/category";
import { getApiErrorMessage } from "../../../api/axios";
import Loader from "../../../components/Loader";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../auth/permissions";

type FormState = {
  nombre: string;
  descripcion: string;
  image_url: string;
};

export default function CategoriesForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState<FormState>({
    nombre: "",
    descripcion: "",
    image_url: "",
  });

  const canCreate = can(role, "create");
  const canEdit = can(role, "edit");

  useEffect(() => {
    const load = async () => {
      if (!isEdit || !id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getCategory(id);
        setForm({
          nombre: data.nombre ?? "",
          descripcion: data.descripcion ?? "",
          image_url: (data as any)?.image_url ?? "",
        });
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
    };
  }, [form.nombre]);

  const isValid = !errors.nombre;

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
      const payload: Partial<Category> = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
        image_url: form.image_url.trim() || undefined,
      };
      if (isEdit && id) {
        await updateCategory(id, payload);
        setSnackbar({ message: "Categoría actualizada.", type: "success" });
        navigate(`/app/admin/categorias/${id}`, { replace: true });
      } else {
        const created = await createCategory(payload);
        setSnackbar({ message: "Categoría creada.", type: "success" });
        navigate(`/app/admin/categorias/${created.id}`, { replace: true });
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
        {isEdit ? "Editar categoría" : "Nueva categoría"}
      </Typography>
      <Card>
        <CardContent>
          <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              required
              error={errors.nombre}
              helperText={errors.nombre ? "Campo obligatorio" : undefined}
            />
            <TextField
              label="Descripción"
              value={form.descripcion}
              onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
              multiline
              minRows={3}
            />
            <TextField
              label="URL de imagen"
              value={form.image_url}
              onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
              helperText="Opcional"
            />
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate("/app/admin/categorias")}>
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
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
