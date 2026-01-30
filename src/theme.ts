import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1F3A5F",
      dark: "#162B46",
      light: "#3A6EA5",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F5F1EB",
      dark: "#E4DED6",
      light: "#FBF9F6",
      contrastText: "#1F3A5F",
    },
    background: {
      default: "#F5F1EB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#3F3F3F",
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
          backgroundColor: "#F5F1EB",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(31,58,95,0.12), transparent 45%), radial-gradient(circle at 85% 15%, rgba(58,110,165,0.12), transparent 50%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1F3A5F",
          color: "#FFFFFF",
          boxShadow: "0 12px 28px rgba(31, 58, 95, 0.28)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          "& .MuiButton-outlined": {
            color: "#FFFFFF",
            borderColor: "rgba(255,255,255,0.6)",
          },
          "& .MuiButton-outlined:hover": {
            borderColor: "#FFFFFF",
            backgroundColor: "rgba(255,255,255,0.08)",
          },
          "& .MuiButton-text": {
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(160deg, rgba(31,58,95,0.12), rgba(245,241,235,0.9))",
          borderRight: "1px solid rgba(31,58,95,0.12)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(31, 58, 95, 0.12)",
          boxShadow: "0 12px 24px rgba(31, 58, 95, 0.12)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(31, 58, 95, 0.1)",
          boxShadow: "0 16px 30px rgba(31, 58, 95, 0.12)",
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
          backgroundColor: "#3A6EA5",
          "&:hover": {
            backgroundColor: "#2C547D",
          },
        },
        outlinedPrimary: {
          borderColor: "#3A6EA5",
          color: "#1F3A5F",
          "&:hover": {
            borderColor: "#2C547D",
            backgroundColor: "rgba(58, 110, 165, 0.08)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "rgba(31, 58, 95, 0.28)",
        },
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3A6EA5",
            boxShadow: "0 0 0 3px rgba(58, 110, 165, 0.18)",
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: "rgba(31, 58, 95, 0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#1E1E1E",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#1F3A5F",
          "&:hover": {
            color: "#2C547D",
          },
        },
      },
    },
  },
});

export default theme;
