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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetch } from '../../../hooks/useFetch';
import { SeasonsService } from '../../../services/api/seasonsService';
import { AdminTemporadasService, TemporadaCreateDTO } from '../../../services/api/adminService';
import { TemporadaDTO } from '../../../types';

const EMPTY_FORM: TemporadaCreateDTO = {
  anio: new Date().getFullYear(),
  estado: 'PLANIFICADA',
  numGps: null,
  fechaInicio: null,
  fechaFin: null,
};

const ESTADO_COLORS: Record<string, string> = {
  PLANIFICADA: '#2196f3',
  EN_CURSO: '#4caf50',
  FINALIZADA: '#9e9e9e',
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

export const AdminTemporadasPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TemporadaDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TemporadaDTO | null>(null);
  const [form, setForm] = useState<TemporadaCreateDTO>(EMPTY_FORM);

  const rules = useMemo(() => ({
    anio: (v: number) => !v ? 'Requerido' : v < 1950 ? 'El año mínimo es 1950' : v > new Date().getFullYear() + 5 ? 'Año demasiado futuro' : undefined,
    fechaFin: (v: string | null, f: TemporadaCreateDTO) =>
      v && f.fechaInicio && v < f.fechaInicio ? 'Fecha fin no puede ser anterior a fecha inicio' : undefined,
  }), []);
  const { errors, validate, clearErrors } = useFormValidation<TemporadaCreateDTO>(rules);

  const { data: temporadas, loading } = useFetch(
    () => SeasonsService.getAll(),
    [refreshKey]
  );

  const list = temporadas ?? [];

  const openNew = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (t: TemporadaDTO) => {
    clearErrors();
    setEditTarget(t);
    setForm({
      anio: t.anio,
      estado: t.estado,
      numGps: t.numGps,
      fechaInicio: t.fechaInicio,
      fechaFin: t.fechaFin,
    });
    setDialogOpen(true);
  };

  const openDelete = (t: TemporadaDTO) => {
    setDeleteTarget(t);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget) {
        await AdminTemporadasService.update(editTarget.anio, form);
      } else {
        await AdminTemporadasService.create(form);
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
      await AdminTemporadasService.delete(deleteTarget.anio);
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof TemporadaCreateDTO>(key: K, val: TemporadaCreateDTO[K]) =>
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
            Gestión de Temporadas
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            {loading ? '...' : `${list.length} registros`}
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
                {['Año', 'Estado', 'Nº GPs', 'Fecha Inicio', 'Fecha Fin', 'Acciones'].map((h) => (
                  <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((t) => (
                <TableRow
                  key={t.anio}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}
                >
                  <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{t.anio}</TableCell>
                  <TableCell sx={cellSx}>
                    <Chip
                      label={t.estado}
                      size="small"
                      sx={{
                        backgroundColor: ESTADO_COLORS[t.estado] ?? '#555',
                        color: '#fff',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        height: 20,
                        borderRadius: 0,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={cellSx}>{t.numGps ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{t.fechaInicio ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{t.fechaFin ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>
                    <IconButton size="small" onClick={() => openEdit(t)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => openDelete(t)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#E10600' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ ...cellSx, py: 4 }}>
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
        <DialogTitle sx={{ color: '#fff', fontFamily: '"Titillium Web", sans-serif', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {editTarget ? `Editar Temporada ${editTarget.anio}` : 'Nueva Temporada'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Año"
                type="number"
                value={form.anio}
                onChange={(e) => setField('anio', Number(e.target.value))}
                required
                size="small"
                disabled={!!editTarget}
                error={!!errors.anio}
                helperText={errors.anio}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={inputSx}
              />
              <TextField
                label="Nº GPs"
                type="number"
                value={form.numGps ?? ''}
                onChange={(e) => setField('numGps', e.target.value ? Number(e.target.value) : null)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={inputSx}
              />
            </Box>
            <FormControl size="small">
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Estado</InputLabel>
              <Select
                value={form.estado}
                label="Estado"
                onChange={(e) => setField('estado', e.target.value)}
                sx={{
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
                }}
              >
                {['PLANIFICADA', 'EN_CURSO', 'FINALIZADA'].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Fecha Inicio"
                type="date"
                value={form.fechaInicio ?? ''}
                onChange={(e) => setField('fechaInicio', e.target.value || null)}
                size="small"
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
                helperText={errors.fechaFin}
                InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={inputSx}
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
            sx={{ backgroundColor: '#E10600', borderRadius: 0, fontWeight: 700, '&:hover': { backgroundColor: '#a80400' } }}
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
            ¿Eliminar este registro?{' '}
            <strong style={{ color: '#fff' }}>Temporada {deleteTarget?.anio}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{ backgroundColor: '#E10600', borderRadius: 0, fontWeight: 700, '&:hover': { backgroundColor: '#a80400' } }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      {SnackbarElement}
    </Box>
  );
};