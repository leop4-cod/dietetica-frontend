import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { getUser, hasRole, logout, normalizeRole } from "../auth/auth";
import { navSections } from "../resources/config";

const drawerWidth = 260;

export default function AppShell() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useNavigate();
  const user = useMemo(() => getUser(), []);

  const handleLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  const drawerContent = (
    <Box>
      <Toolbar sx={{ px: 2, py: 2 }}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700}>
            Nutrivida
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Panel de gestion
          </Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 2 }}>
        {navSections.map((section) => (
          <li key={section.header}>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              <ListSubheader sx={{ fontWeight: 700, color: "text.primary" }}>
                {section.header}
              </ListSubheader>
              {section.items
                .filter((item) => hasRole(item.roles))
                .map((item) => (
                  <ListItemButton
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      "&.active": {
                        background: "rgba(15,118,110,0.14)",
                        color: "primary.dark",
                      },
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
            </ul>
          </li>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              Panel Nutrivida
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {user?.nombre ? `Bienvenido, ${user.nombre}` : "Sesion activa"}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={normalizeRole(user?.rol || user?.role)}
              size="small"
              sx={{
                background: "rgba(255,255,255,0.18)",
                color: "white",
                fontWeight: 700,
              }}
            />
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Salir
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
