import { useMemo, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth.service";
import { getApiErrorMessage } from "../../api/axios";

type FormState = {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
};

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const errors = useMemo(() => {
    return {
      nombre: form.nombre.trim().length === 0,
      email: !/^\S+@\S+\.\S+$/.test(form.email.trim()),
      telefono: form.telefono.trim().length === 0,
      password: form.password.length < 6,
      confirmPassword: form.confirmPassword !== form.password,
    };
  }, [form]);

  const isValid =
    !errors.nombre && !errors.email && !errors.telefono && !errors.password && !errors.confirmPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) {
      setSnackbar({ message: "Completa correctamente los campos.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await register({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        password: form.password,
        rol: "cliente",
      });
      navigate("/login/cliente", { replace: true, state: { registered: true } });
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 520, mx: "auto", py: 6 }}>
      <Card>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" fontWeight={800}>
              Registro de cliente
            </Typography>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              required
              error={errors.nombre}
              helperText={errors.nombre ? "Campo obligatorio" : undefined}
            />
            <TextField
              label="Correo"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
              error={errors.email}
              helperText={errors.email ? "Correo inválido" : undefined}
            />
            <TextField
              label="Teléfono"
              value={form.telefono}
              onChange={(event) => setForm((prev) => ({ ...prev, telefono: event.target.value }))}
              required
              error={errors.telefono}
              helperText={errors.telefono ? "Campo obligatorio" : undefined}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
              error={errors.password}
              helperText={errors.password ? "Mínimo 6 caracteres" : undefined}
            />
            <TextField
              label="Confirmar contraseña"
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
              }
              required
              error={errors.confirmPassword}
              helperText={errors.confirmPassword ? "Las contraseñas no coinciden" : undefined}
            />
            <Button type="submit" variant="contained" disabled={loading || !isValid}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={5000}
        onClose={() => setSnackbar(null)}
      >
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
