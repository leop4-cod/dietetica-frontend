import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { listAuthLogs, type AuthLog } from "../../../api/auth-logs.service";
import { getApiErrorMessage } from "../../../api/axios";

const getRowId = (row: AuthLog) => (row as any)._id ?? row.id ?? row.userId ?? Math.random();

export default function AuthLogsList() {
  const [rows, setRows] = useState<AuthLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const load = async () => {
    setLoading(true);
    try {
      const data = await listAuthLogs();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = useMemo<GridColDef<AuthLog>[]>(
    () => [
      { field: "userId", headerName: "Usuario", flex: 1 },
      { field: "accion", headerName: "Acción", flex: 1 },
      { field: "createdAt", headerName: "Fecha", width: 180 },
    ],
    []
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Auth logs
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        autoHeight
        loading={loading}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />
      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
