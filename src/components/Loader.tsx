import { Box, CircularProgress } from "@mui/material";

export default function Loader() {
  return (
    <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}

