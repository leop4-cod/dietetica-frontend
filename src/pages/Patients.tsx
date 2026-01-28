import { useState, type FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { register } from "../auth/auth";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { hasRole } from "../auth/auth";

export default function PatientsPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = hasRole(["ADMIN"]);

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
        rol: "cliente",
      });
      setSuccess("Paciente registrado correctamente.");
      setNombre("");
      setEmail("");
      setTelefono("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={700}>
            Pacientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registro rapido de nuevos pacientes (rol cliente).
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            Nuevo paciente
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Telefono"
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              fullWidth
              required
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Guardando..." : "Registrar paciente"}
              </Button>
              {isAdmin && (
                <Button component={NavLink} to="/users">
                  Ver usuarios
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
