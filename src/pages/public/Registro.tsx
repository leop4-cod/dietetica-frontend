import { useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../../components/LoaderButton";
import { getApiErrorMessage } from "../../api/axios";
import { register } from "../../api/services/auth.service";

export default function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!email.trim()) {
      setError("El email es obligatorio.");
      return;
    }
    if (!telefono.trim()) {
      setError("El telefono es obligatorio.");
      return;
    }
    if (!password.trim()) {
      setError("La contrasena es obligatoria.");
      return;
    }
    if (password.trim().length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        password: password.trim(),
        rol: "cliente",
      });
      setSuccess(res.message || "Cuenta creada. Ya podes iniciar sesion.");
      setTimeout(() => navigate("/login-cliente", { replace: true }), 1200);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, md: 8 } }}>
      <Card sx={{ width: "100%", maxWidth: 460 }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={0.5} alignItems="center">
              <HowToRegIcon color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight={800}>
                Registro de clientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Solo para clientes de Nutrivida
              </Typography>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Nombre completo"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Telefono"
                  value={telefono}
                  onChange={(event) => setTelefono(event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Contrasena"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  fullWidth
                />
                <LoaderButton type="submit" variant="contained" fullWidth loading={loading}>
                  Crear cuenta
                </LoaderButton>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
