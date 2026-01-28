import { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { subscribeLoading } from "../api/loading";

export default function Loader() {
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeLoading(setOpen), []);

  return (
    <Backdrop
      open={open}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 10 }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
