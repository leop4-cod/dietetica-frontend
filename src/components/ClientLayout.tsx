import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import ClientNavbar from "./ClientNavbar";

export default function ClientLayout() {
  return (
    <Box>
      <ClientNavbar />
      <Container sx={{ py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
