import { useState, type FormEvent } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { login } from "../auth/auth";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("leo@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      nav("/dashboard");
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
        background: "linear-gradient(120deg, rgba(46,125,111,0.12), rgba(167,215,197,0.3))",
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
                background: "linear-gradient(135deg, rgba(46,125,111,0.95), rgba(36,104,94,0.95))",
                color: "white",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Typography variant="h4">Nutrivida Panel</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Gestión integral de ventas, catálogo, inventario y clientes en un solo lugar.
              </Typography>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.3)" }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Acceso seguro para administración y operaciones.
              </Typography>
            </Box>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Iniciar sesión
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingresa tus credenciales para continuar.
              </Typography>

              <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2, mt: 3 }}>
                <TextField
                  label="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  fullWidth
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={22} /> : "Entrar"}
                </Button>
                <Button component={NavLink} to="/register">
                  Crear cuenta
                </Button>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

