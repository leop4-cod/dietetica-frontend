import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <Box>
      <Navbar />
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}

