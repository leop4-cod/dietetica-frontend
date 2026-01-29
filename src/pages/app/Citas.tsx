import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createAppointment, listAppointments, type Appointment } from "../../api/history.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import EmptyState from "../../components/EmptyState";

const STATUS_OPTIONS = ["pendiente", "confirmada", "cancelada"];

export default function Citas() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState({
    cita_fecha: "",
    motivo: "",
    especialista: "",
    estado: "pendiente",
  });

  const loadAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    setUnavailable(false);
    try {
      const data = await listAppointments(String(user.id));
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setUnavailable(error?.response?.status === 404);
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user?.id]);

  const handleSubmit = async () => {
    if (!user?.id) {
      setSnackbar({ message: "No se encontró usuario.", type: "error" });
      return;
    }
    if (!form.cita_fecha || !form.motivo.trim()) {
      setSnackbar({ message: "Completa fecha y motivo.", type: "error" });
      return;
    }
    try {
      await createAppointment({
        userId: String(user.id),
        cita_fecha: new Date(form.cita_fecha).toISOString(),
        motivo: form.motivo.trim(),
        estado: form.estado,
        especialista: form.especialista.trim() || undefined,
      });
      setSnackbar({ message: "Cita registrada.", type: "success" });
      setForm({ cita_fecha: "", motivo: "", especialista: "", estado: "pendiente" });
      await loadAppointments();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Mis citas
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography fontWeight={700}>Reservar cita</Typography>
            <TextField
              label="Fecha y hora"
              type="datetime-local"
              value={form.cita_fecha}
              onChange={(event) => setForm((prev) => ({ ...prev, cita_fecha: event.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Motivo"
              value={form.motivo}
              onChange={(event) => setForm((prev) => ({ ...prev, motivo: event.target.value }))}
              multiline
              minRows={2}
            />
            <TextField
              label="Especialista (opcional)"
              value={form.especialista}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, especialista: event.target.value }))
              }
            />
            <TextField
              label="Estado"
              select
              value={form.estado}
              onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value }))}
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={handleSubmit}>
              Reservar cita
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {unavailable ? (
        <EmptyState title="No disponible en API" description="El endpoint de citas no existe." />
      ) : loading ? (
        <Typography color="text.secondary">Cargando citas...</Typography>
      ) : appointments.length === 0 ? (
        <EmptyState title="Sin citas registradas" description="Reserva tu primera cita." />
      ) : (
        <Grid container spacing={2}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id ?? appointment.id ?? appointment.cita_fecha}>
              <Card>
                <CardContent>
                  <Typography fontWeight={700}>
                    {new Date(appointment.cita_fecha).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Motivo: {appointment.motivo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado: {appointment.estado ?? "pendiente"}
                  </Typography>
                  {appointment.especialista && (
                    <Typography variant="body2" color="text.secondary">
                      Especialista: {appointment.especialista}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
