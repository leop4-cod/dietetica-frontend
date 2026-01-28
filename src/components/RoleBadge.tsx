import { Chip } from "@mui/material";

type Props = {
  role?: string | null;
};

export default function RoleBadge({ role }: Props) {
  return (
    <Chip
      label={(role ?? "sin rol").toUpperCase()}
      size="small"
      sx={{ fontWeight: 700, textTransform: "uppercase" }}
    />
  );
}

