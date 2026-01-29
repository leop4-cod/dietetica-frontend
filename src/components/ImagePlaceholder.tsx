import { Box, Stack, Typography } from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

type Props = {
  height?: number | string;
  label?: string;
};

export default function ImagePlaceholder({ height = 160, label }: Props) {
  return (
    <Box
      sx={{
        height,
        borderRadius: 2,
        background:
          "linear-gradient(135deg, rgba(167,215,197,0.45), rgba(46,125,111,0.15))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed rgba(46,125,111,0.35)",
      }}
    >
      <Stack spacing={1} alignItems="center">
        <ImageNotSupportedIcon color="action" />
        <Typography variant="caption" color="text.secondary">
          {label ?? "Imagen no disponible en la API"}
        </Typography>
      </Stack>
    </Box>
  );
}
