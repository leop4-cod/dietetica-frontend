import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2E7D6F",
      dark: "#24685E",
      light: "#A7D7C5",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#A7D7C5",
      dark: "#7FB9A3",
      light: "#DCEFE7",
      contrastText: "#2E7D6F",
    },
    background: {
      default: "#FAF8F3",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2B2B2B",
      secondary: "#4A4A4A",
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
          backgroundColor: "#FAF8F3",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(167,215,197,0.35), transparent 45%), radial-gradient(circle at 85% 15%, rgba(167,215,197,0.2), transparent 50%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#2E7D6F",
          color: "#FFFFFF",
          boxShadow: "0 12px 28px rgba(46, 125, 111, 0.28)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(160deg, rgba(167,215,197,0.18), rgba(250,248,243,0.9))",
          borderRight: "1px solid rgba(46,125,111,0.12)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(46, 125, 111, 0.12)",
          boxShadow: "0 12px 24px rgba(46, 125, 111, 0.12)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(46, 125, 111, 0.1)",
          boxShadow: "0 16px 30px rgba(46, 125, 111, 0.12)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: "10px 22px",
        },
        containedPrimary: {
          backgroundColor: "#2E7D6F",
          "&:hover": {
            backgroundColor: "#24685E",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "rgba(46, 125, 111, 0.28)",
        },
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2E7D6F",
            boxShadow: "0 0 0 3px rgba(46, 125, 111, 0.15)",
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: "rgba(167, 215, 197, 0.3)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#2B2B2B",
        },
      },
    },
  },
});

export default theme;
