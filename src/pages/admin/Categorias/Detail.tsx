import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { deleteCategory, getCategory } from "../../../api/categories.service";
import type { Category } from "../../../types/category";
import { getApiErrorMessage } from "../../../api/axios";
import Loader from "../../../components/Loader";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../auth/permissions";

export default function CategoriesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const canEdit = can(role, "edit");
  const canDelete = can(role, "delete");

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getCategory(id);
        setCategory(data);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!canDelete) {
      setSnackbar({ message: "No autorizado", type: "error" });
      return;
    }
    setSaving(true);
    try {
      await deleteCategory(id);
      setSnackbar({ message: "Categoría eliminada.", type: "success" });
      navigate("/app/admin/categorias", { replace: true });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  if (!category) {
    return (
      <Box sx={{ py: 6 }}>
        <Typography align="center" color="text.secondary">
          No hay resultados
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {category.nombre}
          </Typography>
          <Typography color="text.secondary">Detalle de categoría</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => {
              if (!canEdit) {
                setSnackbar({ message: "No autorizado", type: "error" });
                return;
              }
              navigate(`/app/admin/categorias/${category.id}/edit`);
            }}
          >
            Editar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (!canDelete) {
                setSnackbar({ message: "No autorizado", type: "error" });
                return;
              }
              setConfirmOpen(true);
            }}
          >
            Eliminar
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography>
              <strong>Descripción:</strong> {category.descripcion || "-"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar categoría"
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
