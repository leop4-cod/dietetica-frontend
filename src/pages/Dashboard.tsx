import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Paper,
  Grid,
  Container,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { navSections } from "../resources/config";
import { hasRole } from "../auth/auth";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const quickLinks = navSections
    .flatMap((section) => section.items)
    .filter((item) => item.path !== "/dashboard")
    .filter((item) => hasRole(item.roles));

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={3}>
        <Paper
          sx={{
            p: 3,
            background:
              "linear-gradient(135deg, rgba(15,118,110,0.1), rgba(245,158,11,0.08))",
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
              Bienvenido{user?.nombre ? `, ${user.nombre}` : ""}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Organiza tu operacion con datos claros y acciones rapidas.
            </Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography fontWeight={600}>{user?.email ?? "-"}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Rol
                </Typography>
                <Typography fontWeight={600}>{user?.rol ?? "-"}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ID
                </Typography>
                <Typography fontWeight={600}>{user?.id ?? "-"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Modulos
          </Typography>
          <Grid container spacing={2}>
            {quickLinks.map((item) => (
              <Grid key={item.path} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
                    },
                  }}
                >
                  <CardActionArea component={RouterLink} to={item.path} sx={{ p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Gestiona {item.label.toLowerCase()}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
