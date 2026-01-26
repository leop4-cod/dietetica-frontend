import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
  FormControlLabel,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { ResourceConfig, FieldConfig } from "../resources/config";
import { createResource, deleteResource, listResource, updateResource } from "../api/resources";

type Props = {
  config: ResourceConfig;
};

function getByPath(target: any, path: string) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), target);
}

function getItemId(item: any) {
  return item?.id ?? item?._id ?? "";
}

function buildInitialValues(fields: FieldConfig[], item?: any) {
  const values: Record<string, any> = {};
  fields.forEach((field) => {
    const source = field.source ?? field.name;
    let value = item ? getByPath(item, source) : undefined;
    if (field.type === "boolean") value = Boolean(value);
    if (field.type === "stringArray" && Array.isArray(value)) value = value.join("\n");
    if (value === undefined || value === null) {
      value = field.type === "boolean" ? false : "";
    }
    values[field.name] = value;
  });
  return values;
}

function buildPayload(
  fields: FieldConfig[],
  values: Record<string, any>,
  mode: "create" | "update",
) {
  const payload: Record<string, any> = {};
  fields.forEach((field) => {
    let value = values[field.name];
    if (field.type === "number") {
      value = value === "" ? undefined : Number(value);
    }
    if (field.type === "boolean") {
      value = Boolean(value);
    }
    if (field.type === "stringArray") {
      value = String(value || "")
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
    if (value === "" || value === undefined || value === null) {
      if (mode === "create" && field.required) payload[field.name] = value;
      return;
    }
    payload[field.name] = value;
  });
  return payload;
}

export default function ResourcePage({ config }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listResource<any>(config.endpoint, {
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
      });
      setItems(result.items);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, page, rowsPerPage, search]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingItem(null);
    setFormValues(buildInitialValues(config.fields));
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setFormValues(buildInitialValues(config.fields, item));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = buildPayload(config.fields, formValues, editingItem ? "update" : "create");
      if (editingItem) {
        await updateResource(
          config.endpoint,
          String(getItemId(editingItem)),
          payload,
          config.updateMethod ?? "PUT",
        );
      } else {
        await createResource(config.endpoint, payload);
      }
      setDialogOpen(false);
      await load();
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: any) => {
    const id = getItemId(item);
    if (!id) return;
    const confirmed = window.confirm("Eliminar este registro?");
    if (!confirmed) return;
    setLoading(true);
    setError("");
    try {
      await deleteResource(config.endpoint, String(id));
      await load();
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = meta?.totalItems ?? items.length;
  const currentPage = meta?.currentPage ? Number(meta.currentPage) - 1 : page;
  const itemsPerPage = meta?.itemsPerPage ?? rowsPerPage;

  const isPaginated = Boolean(meta?.totalItems);
  const emptyRows = useMemo(() => {
    if (!isPaginated) return 0;
    return Math.max(0, (currentPage + 1) * itemsPerPage - totalItems);
  }, [currentPage, isPaginated, itemsPerPage, totalItems]);

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5" fontWeight={700}>
                {config.label}
              </Typography>
              <Chip label={items.length} size="small" color="secondary" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Gestion del modulo {config.label.toLowerCase()}
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: "100%" }}>
            <TextField
              size="small"
              placeholder="Buscar"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 240 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" onClick={() => load()} disabled={loading}>
              Recargar
            </Button>
            <Button variant="contained" onClick={openCreate}>
              Nuevo
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {config.columns.map((col) => (
                  <TableCell key={col.key}>{col.label}</TableCell>
                ))}
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={config.columns.length + 1}>
                    <Stack alignItems="center" py={3}>
                      <CircularProgress size={22} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={config.columns.length + 1}>
                    <Typography align="center" py={3}>
                      Sin resultados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((row, index) => (
                  <TableRow key={`${getItemId(row) || index}`}>
                    {config.columns.map((col) => {
                      const value = col.getValue ? col.getValue(row) : getByPath(row, col.key);
                      return <TableCell key={col.key}>{String(value ?? "-")}</TableCell>;
                    })}
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <Button size="small" onClick={() => openEdit(row)}>
                          Editar
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDelete(row)}>
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={config.columns.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalItems}
          page={currentPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={itemsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? "Editar" : "Nuevo"} registro</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {config.fields.map((field) => {
              const value = formValues[field.name] ?? "";
              if (field.type === "boolean") {
                return (
                  <FormControlLabel
                    key={field.name}
                    control={
                      <Checkbox
                        checked={Boolean(value)}
                        onChange={(event) =>
                          setFormValues((prev) => ({
                            ...prev,
                            [field.name]: event.target.checked,
                          }))
                        }
                      />
                    }
                    label={field.label}
                  />
                );
              }
              if (field.type === "select") {
                return (
                  <TextField
                    key={field.name}
                    select
                    label={field.label}
                    value={value}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [field.name]: event.target.value,
                      }))
                    }
                    fullWidth
                  >
                    {(field.options ?? []).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }
              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  value={value}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      [field.name]: event.target.value,
                    }))
                  }
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  fullWidth
                  multiline={field.type === "textarea" || field.type === "stringArray"}
                  minRows={field.type === "textarea" || field.type === "stringArray" ? 3 : undefined}
                  InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
