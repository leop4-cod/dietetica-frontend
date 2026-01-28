import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import NavbarPublic from "./NavbarPublic";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <Box>
      <NavbarPublic />
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}
