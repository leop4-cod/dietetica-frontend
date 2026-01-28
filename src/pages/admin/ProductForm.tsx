import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";

type Props = {
  open: boolean;
  categories: Category[];
  initialData?: Product | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (payload: {
    nombre: string;
    descripcion?: string;
    precio?: number;
    categoriaId?: number | string;
  }) => void;
};

export default function ProductForm({
  open,
  categories,
  initialData,
  loading,
  onClose,
  onSave,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  useEffect(() => {
    setNombre(initialData?.nombre ?? "");
    setDescripcion(initialData?.descripcion ?? "");
    setPrecio(initialData?.precio ? String(initialData.precio) : "");
    const rawCategoryId =
      (initialData as any)?.categoria_id ??
      initialData?.categoriaId ??
      initialData?.categoria?.id ??
      initialData?.category?.id ??
      "";
    setCategoriaId(rawCategoryId ? String(rawCategoryId) : "");
  }, [initialData]);

  const handleSave = () => {
    if (!nombre.trim() || !categoriaId) return;
    const parsedCategory = Number(categoriaId);
    onSave({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      precio: precio ? Number(precio) : undefined,
      categoriaId: Number.isNaN(parsedCategory) ? categoriaId : parsedCategory,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Editar producto" : "Nuevo producto"}</DialogTitle>
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
            label="Descripcion"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Precio"
            type="number"
            value={precio}
            onChange={(event) => setPrecio(event.target.value)}
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel>Categoria</InputLabel>
            <Select
              label="Categoria"
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id ?? category.nombre} value={String(category.id ?? "")}>
                  {category.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
