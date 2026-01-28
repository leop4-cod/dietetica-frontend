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
import { deleteProduct, getProduct } from "../../../api/products.service";
import type { Product } from "../../../types/product";
import { getApiErrorMessage } from "../../../api/axios";
import Loader from "../../../components/Loader";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../auth/permissions";

export default function ProductsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const canEdit = can(role, "edit");
  const canDelete = can(role, "delete");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!canDelete) {
      setSnackbar({ message: "No autorizado", type: "error" });
      return;
    }
    setSaving(true);
    try {
      await deleteProduct(id);
      setSnackbar({ message: "Producto eliminado.", type: "success" });
      navigate("/admin/productos", { replace: true });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  if (!product) {
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
            {product.nombre}
          </Typography>
          <Typography color="text.secondary">Detalle de producto</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => {
              if (!canEdit) {
                setSnackbar({ message: "No autorizado", type: "error" });
                return;
              }
              navigate(`/admin/productos/${product.id}/edit`);
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
              <strong>Descripción:</strong> {product.descripcion || "-"}
            </Typography>
            <Typography>
              <strong>Precio:</strong> {product.precio ?? "-"}
            </Typography>
            <Typography>
              <strong>Categoría:</strong>{" "}
              {product.category?.nombre ?? product.categoria?.nombre ?? "-"}
            </Typography>
            <Typography>
              <strong>Stock:</strong> {product.inventory?.stock ?? "-"}
            </Typography>
            <Typography>
              <strong>Activo:</strong> {product.activo ? "Sí" : "No"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar producto"
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
