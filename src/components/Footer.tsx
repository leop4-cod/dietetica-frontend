import { Box, Container, Divider, Stack, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, pb: 4 }}>
      <Divider />
      <Container sx={{ pt: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
          <Typography fontWeight={700}>Consulta Dietetica</Typography>
          <Typography color="text.secondary" variant="body2">
            Nutricion personalizada, productos saludables y acompanamiento profesional.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

