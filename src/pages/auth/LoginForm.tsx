import { useState } from "react";
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
import { useAuth } from "../../auth/AuthContext";
import { getApiErrorMessage } from "../../api/axios";

type Props = {
  mode: "cliente" | "admin";
  title: string;
  subtitle?: string;
  showRegister?: boolean;
  initialMessage?: string;
};

export default function LoginForm({ mode, title, subtitle, showRegister, initialMessage }: Props) {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    initialMessage ? { message: initialMessage, type: "success" } : null
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setSnackbar({ message: "Completa los campos requeridos.", type: "error" });
      return;
    }
    try {
      const role = await login(email.trim(), password.trim(), mode);
      setSnackbar({ message: "Inicio de sesión exitoso.", type: "success" });
      if (role === "CLIENTE") {
        navigate("/app/cliente", { replace: true });
      } else {
        navigate("/app/admin/dashboard", { replace: true });
      }
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", py: 6 }}>
      <Card>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <TextField
              label="Correo"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Ingresando..." : "Entrar"}
            </Button>
            {showRegister && (
              <Button variant="text" onClick={() => navigate("/registro")}>
                Registrarse
              </Button>
            )}
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
