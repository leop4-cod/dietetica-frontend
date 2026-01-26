import { useState, type FormEvent } from "react";
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

export default function MailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const sendMail = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await api<any>("/mail/send", {
        method: "POST",
        body: JSON.stringify({ to, subject, message }),
      });
      setResult(res?.message || "Correo enviado");
      setTo("");
      setSubject("");
      setMessage("");
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
            Envio de correo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Envia correos desde el modulo de mail.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            Nuevo mensaje
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack component="form" spacing={2} onSubmit={sendMail}>
            <TextField
              label="Para"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              fullWidth
            />
            <TextField
              label="Asunto"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              fullWidth
            />
            <TextField
              label="Mensaje"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              fullWidth
              multiline
              minRows={4}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {result && <Alert severity="success">{result}</Alert>}
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
