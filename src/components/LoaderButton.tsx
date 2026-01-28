import { Button, CircularProgress } from "@mui/material";
import type { ButtonProps } from "@mui/material";

type Props = ButtonProps & {
  loading?: boolean;
};

export default function LoaderButton({ loading, children, disabled, ...rest }: Props) {
  return (
    <Button
      {...rest}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : rest.startIcon}
    >
      {children}
    </Button>
  );
}
