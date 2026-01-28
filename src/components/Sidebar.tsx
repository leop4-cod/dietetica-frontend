import { NavLink } from "react-router-dom";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Productos", path: "/admin/productos" },
  { label: "Categorias", path: "/admin/categorias" },
];

type Props = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: Props) {
  return (
    <Box>
      <Toolbar sx={{ px: 2, py: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          Nutrivida
        </Typography>
      </Toolbar>
      <Divider />
      <List
        sx={{ px: 1, py: 2 }}
        subheader={
          <ListSubheader sx={{ fontWeight: 700, color: "text.primary" }}>
            Administracion
          </ListSubheader>
        }
      >
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={onNavigate}
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
      </List>
    </Box>
  );
}
