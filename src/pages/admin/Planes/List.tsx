import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  createNutritionPlan,
  deleteNutritionPlan,
  listNutritionPlans,
  updateNutritionPlan,
  type NutritionPlan,
} from "../../../api/nutrition-plans.service";
import { getApiErrorMessage } from "../../../api/axios";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../auth/permissions";
import ConfirmDialog from "../../../components/ConfirmDialog";

const getRowId = (row: NutritionPlan) =>
  row.id ?? (row as any)._id ?? row.userId ?? row.objetivo ?? Math.random();

export default function PlanesList() {
  const { role } = useAuth();
  const [rows, setRows] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<NutritionPlan | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [form, setForm] = useState({
    userId: "",
    objetivo: "",
    calorias_diarias: "",
    recomendaciones: "",
  });

  const canCreate = can(role, "create");
  const canEdit = can(role, "edit");
  const canDelete = can(role, "delete");

  const load = async () => {
    setLoading(true);
    try {
      const data = await listNutritionPlans();
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

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "userId", headerName: "Usuario", flex: 1 },
      { field: "objetivo", headerName: "Objetivo", flex: 1 },
      { field: "calorias_diarias", headerName: "Calorías", width: 140 },
      {
        field: "recomendaciones",
        headerName: "Recomendaciones",
        flex: 1,
        valueGetter: ({ row }) =>
          Array.isArray(row.recomendaciones) ? row.recomendaciones.join(", ") : "-",
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 220,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            {canEdit && (
              <Button
                size="small"
                onClick={() => {
                  setSelected(row);
                  setForm({
                    userId: row.userId ?? "",
                    objetivo: row.objetivo ?? "",
                    calorias_diarias: row.calorias_diarias ? String(row.calorias_diarias) : "",
                    recomendaciones: Array.isArray(row.recomendaciones)
                      ? row.recomendaciones.join("\n")
                      : "",
                  });
                  setFormOpen(true);
                }}
              >
                Editar
              </Button>
            )}
            {canDelete && (
              <Button
                size="small"
                color="error"
                onClick={() => {
                  setSelected(row);
                  setConfirmOpen(true);
                }}
              >
                Eliminar
              </Button>
            )}
          </Stack>
        ),
      },
    ],
    [canDelete, canEdit]
  );

  const handleSave = async () => {
    if (!form.userId || !form.objetivo || !form.calorias_diarias) {
      setSnackbar({ message: "Completa los campos obligatorios.", type: "error" });
      return;
    }
    try {
      const payload: NutritionPlan = {
        userId: form.userId.trim(),
        objetivo: form.objetivo.trim(),
        calorias_diarias: Number(form.calorias_diarias),
        recomendaciones: form.recomendaciones
          ? form.recomendaciones.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
          : [],
      };
      if (selected?.id || (selected as any)?._id) {
        const planId = String(selected.id ?? (selected as any)._id);
        await updateNutritionPlan(planId, payload);
        setSnackbar({ message: "Plan actualizado.", type: "success" });
      } else {
        await createNutritionPlan(payload);
        setSnackbar({ message: "Plan creado.", type: "success" });
      }
      setFormOpen(false);
      setSelected(null);
      await load();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!selected?.id && !(selected as any)?._id) return;
    try {
      const planId = String(selected.id ?? (selected as any)._id);
      await deleteNutritionPlan(planId);
      setSnackbar({ message: "Plan eliminado.", type: "success" });
      setConfirmOpen(false);
      setSelected(null);
      await load();
    } catch (error) {
      setSnackbar({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Planes nutricionales
          </Typography>
          <Typography color="text.secondary">Gestiona objetivos y calorías.</Typography>
        </Box>
        {canCreate && (
          <Button
            variant="contained"
            onClick={() => {
              setSelected(null);
              setForm({ userId: "", objetivo: "", calorias_diarias: "", recomendaciones: "" });
              setFormOpen(true);
            }}
          >
            Nuevo plan
          </Button>
        )}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          autoHeight
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? "Editar plan" : "Nuevo plan"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Usuario ID"
              value={form.userId}
              onChange={(event) => setForm((prev) => ({ ...prev, userId: event.target.value }))}
              required
            />
            <TextField
              label="Objetivo"
              value={form.objetivo}
              onChange={(event) => setForm((prev) => ({ ...prev, objetivo: event.target.value }))}
              required
            />
            <TextField
              label="Calorías diarias"
              type="number"
              value={form.calorias_diarias}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, calorias_diarias: event.target.value }))
              }
              required
            />
            <TextField
              label="Recomendaciones (una por línea)"
              value={form.recomendaciones}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, recomendaciones: event.target.value }))
              }
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar plan"
        description="Esta acción no se puede deshacer."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmText="Eliminar"
      />

      <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)}>
        {snackbar ? <Alert severity={snackbar.type}>{snackbar.message}</Alert> : null}
      </Snackbar>
    </Box>
  );
}
