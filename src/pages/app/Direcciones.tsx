import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  type Address,
} from "../../api/addresses.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function Direcciones() {
  const { user } = useAuth();
  const [items, setItems] = useState<Address[]>([]);
  const [selected, setSelected] = useState<Address | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState({
    calle: "",
    ciudad: "",
    codigo_postal: "",
    referencia: "",
  });

  const load = async () => {
    try {
      const data = await listAddresses();
      const filtered = data.filter((addr) => addr.user?.id === user?.id);
      setItems(filtered);
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const openCreate = () => {
    setSelected(null);
    setForm({ calle: "", ciudad: "", codigo_postal: "", referencia: "" });
    setOpenForm(true);
  };

  const openEdit = (address: Address) => {
    setSelected(address);
    setForm({
      calle: address.calle ?? "",
      ciudad: address.ciudad ?? "",
      codigo_postal: address.codigo_postal ?? "",
      referencia: address.referencia ?? "",
    });
    setOpenForm(true);
  };

  const handleSave = async () => {
    if (!user?.id) {
      setSnackbar({ message: "No se encontró usuario.", type: "error" });
      return;
    }
    if (!form.calle || !form.ciudad || !form.codigo_postal) {
      setSnackbar({ message: "Completa los campos obligatorios.", type: "error" });
      return;
    }
    try {
      if (selected?.id) {
        await updateAddress(String(selected.id), form);
        setSnackbar({ message: "Dirección actualizada.", type: "success" });
      } else {
        await createAddress({ ...form, user_id: String(user.id) });
        setSnackbar({ message: "Dirección creada.", type: "success" });
      }
      setOpenForm(false);
      await load();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    try {
      await deleteAddress(String(selected.id));
      setSnackbar({ message: "Dirección eliminada.", type: "success" });
      setConfirmOpen(false);
      await load();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
        <Typography variant="h4" fontWeight={800}>
          Mis direcciones
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          Nueva dirección
        </Button>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {items.length === 0 ? (
          <Typography color="text.secondary">Aún no tienes direcciones registradas.</Typography>
        ) : (
          items.map((address) => (
            <Card key={address.id}>
              <CardContent>
                <Typography fontWeight={700}>{address.calle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.ciudad} · {address.codigo_postal}
                </Typography>
                {address.referencia && (
                  <Typography variant="body2" color="text.secondary">
                    {address.referencia}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button size="small" onClick={() => openEdit(address)}>
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      setSelected(address);
                      setConfirmOpen(true);
                    }}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? "Editar dirección" : "Nueva dirección"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Calle"
              value={form.calle}
              onChange={(event) => setForm((prev) => ({ ...prev, calle: event.target.value }))}
              required
            />
            <TextField
              label="Ciudad"
              value={form.ciudad}
              onChange={(event) => setForm((prev) => ({ ...prev, ciudad: event.target.value }))}
              required
            />
            <TextField
              label="Código postal"
              value={form.codigo_postal}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, codigo_postal: event.target.value }))
              }
              required
            />
            <TextField
              label="Referencia"
              value={form.referencia}
              onChange={(event) => setForm((prev) => ({ ...prev, referencia: event.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar dirección"
        description="Esta acción no se puede deshacer."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmText="Eliminar"
      />

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
      >
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
