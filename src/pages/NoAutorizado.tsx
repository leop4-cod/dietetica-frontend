import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NoAutorizado() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4" fontWeight={800}>
          No autorizado
        </Typography>
        <Typography color="text.secondary" align="center">
          No tienes permisos para acceder a esta sección.
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Stack>
    </Box>
  );
}
