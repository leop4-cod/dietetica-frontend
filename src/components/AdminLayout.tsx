import { useState } from "react";
import {
  Box,
  Breadcrumbs,
  Drawer,
  IconButton,
  Link,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../auth/AuthContext";

const drawerWidth = 260;

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar onLogout={handleLogout} />
      {isMobile && (
        <IconButton
          color="inherit"
          onClick={() => setMobileOpen(true)}
          sx={{ position: "fixed", top: 14, left: 12, zIndex: theme.zIndex.drawer + 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}
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
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={NavLink} to="/app/admin/dashboard" underline="hover" color="inherit">
            Admin
          </Link>
          {location.pathname
            .replace("/app/admin", "")
            .split("/")
            .filter(Boolean)
            .map((segment, index, arr) => {
              const to = `/app/admin/${arr.slice(0, index + 1).join("/")}`;
              const label = segment.replace(/-/g, " ");
              return (
                <Link key={to} component={NavLink} to={to} underline="hover" color="inherit">
                  {label}
                </Link>
              );
            })}
        </Breadcrumbs>
        <Outlet />
      </Box>
    </Box>
  );
}
