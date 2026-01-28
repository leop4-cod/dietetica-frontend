import { useEffect, useState, type FormEvent } from "react";
import { NavLink } from "react-router-dom";
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
import { api } from "../api/https";
import { getUser, normalizeRole } from "../auth/auth";

type ProfileData = {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol?: string;
};

export default function ProfilePage() {
  const localUser = getUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = async () => {
    if (!localUser?.id) {
      setError("No se encontro el usuario autenticado.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api<any>(`/users/${localUser.id}`);
      const data = res?.data ?? res;
      const next = {
        id: data?.id ?? localUser.id,
        nombre: data?.nombre ?? "",
        email: data?.email ?? "",
        telefono: data?.telefono ?? "",
        rol: data?.rol ?? data?.role,
      };
      setProfile(next);
      setNombre(next.nombre);
      setEmail(next.email);
      setTelefono(next.telefono || "");
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload: Record<string, any> = {
        nombre,
        email,
        telefono,
      };
      if (password) payload.password = password;
      const res = await api<any>(`/users/${profile.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const data = res?.data ?? res;
      const updated = {
        ...profile,
        nombre: data?.nombre ?? nombre,
        email: data?.email ?? email,
        telefono: data?.telefono ?? telefono,
      };
      setProfile(updated);
      localStorage.setItem("user", JSON.stringify({ ...localUser, ...updated }));
      setPassword("");
      setSuccess("Perfil actualizado correctamente.");
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={700}>
            Mi perfil
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Actualiza tu información personal.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            Datos personales
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              label="Telefono"
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Nueva contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Rol"
              value={normalizeRole(profile?.rol || localUser?.rol || localUser?.role)}
              fullWidth
              disabled
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
              <Button type="submit" variant="contained" disabled={loading || saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
              {normalizeRole(localUser?.rol || localUser?.role) === "ADMIN" && (
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
