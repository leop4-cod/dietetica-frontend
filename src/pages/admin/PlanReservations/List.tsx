import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { listPlanReservations, type PlanReservation } from "../../../api/plan-reservations.service";
import { getApiErrorMessage } from "../../../api/axios";

export default function PlanReservationsList() {
  const [rows, setRows] = useState<PlanReservation[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listPlanReservations();
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
    };
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Reservas de planes
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          {rows.length === 0 ? (
            <Typography color="text.secondary">AÃºn no hay reservas registradas.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Plan</TableCell>
                  <TableCell>Calorías</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row._id ?? row.id ?? `${row.userId}-${row.planId}`}>
                    <TableCell>{row.planObjetivo ?? row.planId}</TableCell>
                    <TableCell>{row.planCalorias ?? "-"}</TableCell>
                    <TableCell>{row.userId}</TableCell>
                    <TableCell>{row.status ?? "pendiente"}</TableCell>
                    <TableCell>
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
