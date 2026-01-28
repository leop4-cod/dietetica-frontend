import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Snackbar, Stack, Typography } from "@mui/material";
import { getUser } from "../../api/users.service";
import { getApiErrorMessage } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function Perfil() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const data = await getUser(String(user.id));
        setProfile(data);
      } catch (error) {
        setSnackbar({ message: getApiErrorMessage(error), type: "error" });
      }
    };
    load();
  }, [user?.id]);

  if (!profile) {
    return (
      <Box sx={{ py: 6 }}>
        <Typography color="text.secondary">No se pudo cargar el perfil.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Mi perfil
      </Typography>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography>
              <strong>Nombre:</strong> {profile.nombre ?? "-"}
            </Typography>
            <Typography>
              <strong>Email:</strong> {profile.email ?? "-"}
            </Typography>
            <Typography>
              <strong>Teléfono:</strong> {profile.telefono ?? "-"}
            </Typography>
            <Typography>
              <strong>Rol:</strong> {profile.rol ?? profile.role ?? "-"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
