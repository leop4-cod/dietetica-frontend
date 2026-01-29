import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export default function EmptyState({ title, description, actionLabel, onAction, icon }: Props) {
  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
      <Stack spacing={2} alignItems="center">
        <Box sx={{ color: "primary.main", fontSize: 42 }}>
          {icon ?? <SentimentDissatisfiedIcon fontSize="inherit" />}
        </Box>
        <Box>
          <Typography fontWeight={700}>{title}</Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
