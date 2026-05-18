import { useState, useMemo } from 'react';
import { useAdminSnackbar } from '../../../hooks/useAdminSnackbar';
import { useFormValidation } from '../../../hooks/useFormValidation';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetch } from '../../../hooks/useFetch';
import { ContratoDTO } from '../../../types';
import { AdminContratosService, ContratoCreateDTO } from '../../../services/api/adminService';
import { DriversService } from '../../../services/api/driversService';
import { TeamsService } from '../../../services/api/teamsService';

const EMPTY_FORM: ContratoCreateDTO = {
  tipoDocumento: '',
  numDocumento: '',
  idEquipo: 0,
  fechaInicio: '',
  fechaFin: null,
};

const cellSx = {
  color: 'rgba(255,255,255,0.85)',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  fontSize: '0.8rem',
};

const headCellSx = {
  color: 'rgba(255,255,255,0.4)',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  fontSize: '0.65rem',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  backgroundColor: '#1a1a1a',
};

const inputSx = {
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E10600' },
  '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255,255,255,0.5)' },
  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '& .MuiInputLabel-root.Mui-disabled': { color: 'rgba(255,255,255,0.45)', opacity: 1 },
};

const selectSx = {
  color: '#fff',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
  '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '& .MuiSelect-select.Mui-disabled': { WebkitTextFillColor: 'rgba(255,255,255,0.5)' },
};

const labelSx = {
  color: 'rgba(255,255,255,0.5)',
  '&.Mui-disabled': { color: 'rgba(255,255,255,0.45)', opacity: 1 },
};

export const AdminContratosPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ContratoDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContratoDTO | null>(null);
  const [form, setForm] = useState<ContratoCreateDTO>(EMPTY_FORM);

  const rules = useMemo(() => ({
    tipoDocumento: (v: string) => !v?.trim() ? 'Selecciona un piloto' : undefined,
    idEquipo: (v: number) => !v || v <= 0 ? 'Selecciona una escudería' : undefined,
    fechaInicio: (v: string) => !v?.trim() ? 'Requerido' : undefined,
    fechaFin: (v: string | null, f: ContratoCreateDTO) =>
      v && f.fechaInicio && v < f.fechaInicio ? 'No puede ser anterior a fecha inicio' : undefined,
  }), []);
  const { errors, validate, clearErrors } = useFormValidation<ContratoCreateDTO>(rules);

  const { data: contratosData, loading } = useFetch<ContratoDTO[]>(
    () => AdminContratosService.getAll(),
    [refreshKey]
  );
  const contratos = contratosData ?? [];

  const { data: pilotsData } = useFetch(() => DriversService.getAll(0, 200), []);
  const pilotos = pilotsData?.content ?? [];

  const { data: teamsData } = useFetch(() => TeamsService.getAll(0, 50), []);
  const escuderias = teamsData?.content ?? [];

  const openNew = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (c: ContratoDTO) => {
    clearErrors();
    setEditTarget(c);
    setForm({
      tipoDocumento: c.tipoDocumento,
      numDocumento: c.numDocumento,
      idEquipo: c.idEquipo,
      fechaInicio: c.fechaInicio,
      fechaFin: c.fechaFin,
    });
    setDialogOpen(true);
  };

  const openDelete = (c: ContratoDTO) => {
    setDeleteTarget(c);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget) {
        await AdminContratosService.update(editTarget.idContrato!, form);
      } else {
        await AdminContratosService.create(form);
      }
      showSuccess('Guardado correctamente');
      setDialogOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await AdminContratosService.delete(deleteTarget.idContrato!);
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof ContratoCreateDTO>(key: K, val: ContratoCreateDTO[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <Box sx={{ backgroundColor: '#111', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#15151E',
          px: 4,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"Titillium Web", sans-serif',
              fontWeight: 900,
              fontSize: '1.6rem',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            Gestión de Contratos
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            {loading ? '...' : `${contratos.length} registros`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openNew}
          sx={{
            backgroundColor: '#E10600',
            borderRadius: 0,
            fontFamily: '"Titillium Web", sans-serif',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            '&:hover': { backgroundColor: '#a80400' },
          }}
        >
          Nuevo
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ backgroundColor: '#1a1a1a', borderRadius: 0 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                {['ID', 'Piloto', 'Escudería', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Acciones'].map((h) => (
                  <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {contratos.map((c) => (
                <TableRow
                  key={c.idContrato}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}
                >
                  <TableCell sx={cellSx}>{c.idContrato}</TableCell>
                  <TableCell sx={cellSx}>
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                        {c.nombrePiloto ?? `${c.tipoDocumento}/${c.numDocumento}`}
                      </Typography>
                      {c.alias && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#E10600', fontWeight: 700 }}>
                          {c.alias}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ ...cellSx, color: '#E10600', fontWeight: 700 }}>
                    {c.nombreEscuderia ?? c.idEquipo}
                  </TableCell>
                  <TableCell sx={cellSx}>{c.fechaInicio ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{c.fechaFin ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>
                    <Chip
                      label={c.fechaFin ? 'TERMINADO' : 'ACTIVO'}
                      size="small"
                      sx={{
                        backgroundColor: c.fechaFin ? '#9e9e9e' : '#4caf50',
                        color: '#fff',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        height: 20,
                        borderRadius: 0,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <IconButton
                      size="small"
                      onClick={() => openEdit(c)}
                      sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDelete(c)}
                      sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#E10600' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && contratos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ ...cellSx, py: 4 }}>
                    Sin registros
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#1a1a1a', borderRadius: 0 } }}
      >
        <DialogTitle
          sx={{
            color: '#fff',
            fontFamily: '"Titillium Web", sans-serif',
            fontWeight: 700,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {editTarget ? 'Editar Contrato' : 'Nuevo Contrato'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            {/* Pilot selector */}
            <FormControl size="small" disabled={!!editTarget} error={!!errors.tipoDocumento}>
              <InputLabel sx={labelSx}>Piloto</InputLabel>
              <Select
                value={
                  form.tipoDocumento && form.numDocumento
                    ? `${form.tipoDocumento}/${form.numDocumento}`
                    : ''
                }
                label="Piloto"
                onChange={(e) => {
                  const [tipo, ...rest] = (e.target.value as string).split('/');
                  const num = rest.join('/');
                  setForm((f) => ({ ...f, tipoDocumento: tipo, numDocumento: num }));
                }}
                sx={selectSx}
              >
                {pilotos.map((p) => (
                  <MenuItem
                    key={`${p.tipoDocumento}/${p.numDocumento}`}
                    value={`${p.tipoDocumento}/${p.numDocumento}`}
                  >
                    {p.nombre} {p.apellidos}
                    {p.alias ? ` (${p.alias})` : ''}
                  </MenuItem>
                ))}
              </Select>
              {errors.tipoDocumento && <FormHelperText>{errors.tipoDocumento}</FormHelperText>}
            </FormControl>

            {/* Team selector */}
            <FormControl size="small" error={!!errors.idEquipo}>
              <InputLabel sx={labelSx}>Escudería</InputLabel>
              <Select
                value={form.idEquipo || ''}
                label="Escudería"
                onChange={(e) => setField('idEquipo', Number(e.target.value))}
                sx={selectSx}
              >
                {escuderias.map((e) => (
                  <MenuItem key={e.idEquipo} value={e.idEquipo}>
                    {e.nombreOficial}
                  </MenuItem>
                ))}
              </Select>
              {errors.idEquipo && <FormHelperText>{errors.idEquipo}</FormHelperText>}
            </FormControl>

            {/* Dates */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Fecha Inicio"
                type="date"
                value={form.fechaInicio ?? ''}
                onChange={(e) => setField('fechaInicio', e.target.value)}
                required
                size="small"
                error={!!errors.fechaInicio}
                helperText={errors.fechaInicio}
                InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={inputSx}
              />
              <TextField
                label="Fecha Fin"
                type="date"
                value={form.fechaFin ?? ''}
                onChange={(e) => setField('fechaFin', e.target.value || null)}
                size="small"
                error={!!errors.fechaFin}
                helperText={errors.fechaFin ?? 'Vacío = contrato activo'}
                InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={inputSx}
                FormHelperTextProps={{ sx: { color: errors.fechaFin ? undefined : 'rgba(255,255,255,0.3)' } }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: '#E10600',
              borderRadius: 0,
              fontWeight: 700,
              '&:hover': { backgroundColor: '#a80400' },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: '#1a1a1a', borderRadius: 0 } }}
      >
        <DialogTitle sx={{ color: '#fff', fontFamily: '"Titillium Web", sans-serif', fontWeight: 700 }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            ¿Eliminar el contrato de{' '}
            <strong style={{ color: '#fff' }}>
              {deleteTarget?.nombrePiloto ?? deleteTarget?.numDocumento}
            </strong>
            {' '}con{' '}
            <strong style={{ color: '#fff' }}>{deleteTarget?.nombreEscuderia}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
              backgroundColor: '#E10600',
              borderRadius: 0,
              fontWeight: 700,
              '&:hover': { backgroundColor: '#a80400' },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {SnackbarElement}
    </Box>
  );
};
