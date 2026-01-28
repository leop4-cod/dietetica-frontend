import { useState, type FormEvent } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { register } from "../auth/auth";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Register() {
  const nav = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"cliente" | "empleado" | "admin">("cliente");
  const [codigoSecreto, setCodigoSecreto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await register({
        nombre,
        email,
        telefono,
        password,
        rol,
        codigo_secreto: rol === "cliente" ? undefined : codigoSecreto || undefined,
      });
      setSuccess("Usuario registrado. Ahora puedes iniciar sesión.");
      setNombre("");
      setEmail("");
      setTelefono("");
      setPassword("");
      setCodigoSecreto("");
      setRol("cliente");
      setTimeout(() => nav("/login"), 800);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "linear-gradient(120deg, rgba(15,118,110,0.12), rgba(245,158,11,0.12))",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                background:
                  "linear-gradient(135deg, rgba(15,118,110,0.9), rgba(2,132,199,0.9))",
                color: "white",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Typography variant="h4">Crear cuenta</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Registra usuarios para acceder al panel y sus modulos habilitados.
              </Typography>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.3)" }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Roles disponibles: cliente, empleado o admin.
              </Typography>
            </Box>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Registro
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completa los datos para crear el usuario.
              </Typography>

              <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2, mt: 3 }}>
                <TextField
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  fullWidth
                  required
                />
                <TextField
                  select
                  label="Rol"
                  value={rol}
                  onChange={(e) =>
                    setRol(e.target.value as "cliente" | "empleado" | "admin")
                  }
                  fullWidth
                >
                  <MenuItem value="cliente">Cliente</MenuItem>
                  <MenuItem value="empleado">Empleado</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>
                {rol !== "cliente" && (
                  <TextField
                    label="Codigo secreto"
                    value={codigoSecreto}
                    onChange={(e) => setCodigoSecreto(e.target.value)}
                    fullWidth
                    required
                  />
                )}

                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                  <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? <CircularProgress size={22} /> : "Crear cuenta"}
                  </Button>
                  <Button component={NavLink} to="/login">
                    Ya tengo cuenta
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
