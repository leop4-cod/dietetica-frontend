import { Component, type ReactNode } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message?: string;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error("UI error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ py: 8 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h4" fontWeight={800}>
              Algo saliÃ³ mal
            </Typography>
            <Typography color="text.secondary" align="center">
              {this.state.message ?? "OcurriÃ³ un error inesperado en la interfaz."}
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Recargar
            </Button>
          </Stack>
        </Box>
      );
    }
    return this.props.children;
  }
}
