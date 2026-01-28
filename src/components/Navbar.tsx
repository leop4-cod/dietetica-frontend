import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RoleBadge from "./RoleBadge";
import { useAuth } from "../auth/AuthContext";

type Props = {
  onLogout: () => void;
};

export default function Navbar({ onLogout }: Props) {
  const { user, role } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={800}>
            Nutrivida Admin
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            {user?.nombre ? `Hola, ${user.nombre}` : "Panel administrativo"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <RoleBadge role={role ?? undefined} />
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={onLogout}>
            Salir
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
