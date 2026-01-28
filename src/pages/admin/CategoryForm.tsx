import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type { Category } from "../../types/category";

type Props = {
  open: boolean;
  initialData?: Category | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (payload: { nombre: string; descripcion?: string }) => void;
};

export default function CategoryForm({ open, initialData, loading, onClose, onSave }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    setNombre(initialData?.nombre ?? "");
    setDescripcion(initialData?.descripcion ?? "");
  }, [initialData]);

  const handleSave = () => {
    if (!nombre.trim()) return;
    onSave({ nombre: nombre.trim(), descripcion: descripcion.trim() || undefined });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
