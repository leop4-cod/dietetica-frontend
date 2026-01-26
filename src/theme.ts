import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F766E",
      dark: "#0B4F4A",
      light: "#14B8A6",
      contrastText: "#F8FAFC",
    },
    secondary: {
      main: "#F59E0B",
      dark: "#B45309",
      light: "#FCD34D",
      contrastText: "#1F2937",
    },
    background: {
      default: "#F6F4F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Fraunces", "Manrope", serif', fontWeight: 700 },
    h2: { fontFamily: '"Fraunces", "Manrope", serif', fontWeight: 700 },
    h3: { fontFamily: '"Fraunces", "Manrope", serif', fontWeight: 700 },
    h4: { fontFamily: '"Fraunces", "Manrope", serif', fontWeight: 700 },
    h5: { fontFamily: '"Fraunces", "Manrope", serif', fontWeight: 700 },
    h6: { fontFamily: '"Fraunces", "Manrope", serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at 10% 10%, rgba(20,184,166,0.12), transparent 40%), radial-gradient(circle at 90% 20%, rgba(245,158,11,0.12), transparent 45%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(120deg, rgba(15,118,110,0.94), rgba(2,132,199,0.9))",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
          borderBottom: "1px solid rgba(255,255,255,0.16)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background:
            "linear-gradient(160deg, rgba(15,118,110,0.08), rgba(226,232,240,0.7))",
          borderRight: "1px solid rgba(148,163,184,0.25)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(148, 163, 184, 0.22)",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(148, 163, 184, 0.18)",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: "10px 22px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: "rgba(15, 118, 110, 0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#0F172A",
        },
      },
    },
  },
});

export default theme;
