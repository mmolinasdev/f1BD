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
import { apiClient } from '../../../services/api/apiClient';
import { AdminGpsService, GpCreateDTO } from '../../../services/api/adminService';
import { GranPremioDTO, PaginatedResponse } from '../../../types';
import { useSeason } from '../../../context/SeasonContext';

const EMPTY_FORM: GpCreateDTO = {
  nombreOficial: '',
  numRonda: 1,
  estado: 'PLANIFICADO',
  fechaInicio: null,
  fechaFin: null,
};

const ESTADO_COLORS: Record<string, string> = {
  PLANIFICADO: '#2196f3',
  EN_CURSO: '#4caf50',
  FINALIZADO: '#9e9e9e',
  CANCELADO: '#f44336',
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
};

export const AdminGpsPage = () => {
  const { selectedYear } = useSeason();
  const [refreshKey, setRefreshKey] = useState(0);
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GranPremioDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GranPremioDTO | null>(null);
  const [form, setForm] = useState<GpCreateDTO>(EMPTY_FORM);

  const rules = useMemo(() => ({
    nombreOficial: (v: string) => !v?.trim() ? 'Requerido' : undefined,
    numRonda: (v: number) => !v || v < 1 ? 'Debe ser mayor a 0' : undefined,
    fechaFin: (v: string | null, f: GpCreateDTO) =>
      v && f.fechaInicio && v < f.fechaInicio ? 'Fecha fin no puede ser anterior a fecha inicio' : undefined,
  }), []);
  const { errors, validate, clearErrors } = useFormValidation<GpCreateDTO>(rules);

  const { data, loading } = useFetch<PaginatedResponse<GranPremioDTO>>(
    () =>
      apiClient
        .get(`/temporadas/${selectedYear}/gps`, { params: { page: 0, size: 100 } })
        .then((r) => r.data),
    [refreshKey, selectedYear]
  );

  const gps = data?.content ?? [];

  const openNew = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (g: GranPremioDTO) => {
    clearErrors();
    setEditTarget(g);
    setForm({
      nombreOficial: g.nombreOficial,
      numRonda: g.numRonda,
      estado: g.estado,
      fechaInicio: g.fechaInicio,
      fechaFin: g.fechaFin,
    });
    setDialogOpen(true);
  };

  const openDelete = (g: GranPremioDTO) => {
    setDeleteTarget(g);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget) {
        await AdminGpsService.update(editTarget.idEvento, form);
      } else {
        await AdminGpsService.create({ ...form, anioTemporada: selectedYear });
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
      await AdminGpsService.delete(deleteTarget.idEvento);
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof GpCreateDTO>(key: K, val: GpCreateDTO[K]) =>
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
            Gestión de Grandes Premios
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            Temporada {selectedYear} — {loading ? '...' : `${gps.length} registros`}
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
                {['ID', 'Ronda', 'Nombre', 'Temporada', 'Circuito', 'Estado', 'Acciones'].map((h) => (
                  <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {gps.map((g) => (
                <TableRow
                  key={g.idEvento}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}
                >
                  <TableCell sx={{ ...cellSx, color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{g.idEvento}</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#E10600' }}>R{g.numRonda}</TableCell>
                  <TableCell sx={cellSx}>{g.nombreOficial}</TableCell>
                  <TableCell sx={cellSx}>{g.anioTemporada}</TableCell>
                  <TableCell sx={cellSx}>{g.nombreCircuito}</TableCell>
                  <TableCell sx={cellSx}>
                    <Chip
                      label={g.estado}
                      size="small"
                      sx={{
                        backgroundColor: ESTADO_COLORS[g.estado] ?? '#555',
                        color: '#fff',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        height: 20,
                        borderRadius: 0,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <IconButton size="small" onClick={() => openEdit(g)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => openDelete(g)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#E10600' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && gps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ ...cellSx, py: 4 }}>
                    Sin registros para la temporada {selectedYear}
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
          {editTarget ? 'Editar Gran Premio' : 'Nuevo Gran Premio'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre Oficial"
              value={form.nombreOficial}
              onChange={(e) => setField('nombreOficial', e.target.value)}
              required
              size="small"
              error={!!errors.nombreOficial}
              helperText={errors.nombreOficial}
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{ sx: { color: '#fff' } }}
              sx={inputSx}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
              <TextField
                label="Nº Ronda"
                type="number"
                value={form.numRonda}
                onChange={(e) => setField('numRonda', Number(e.target.value))}
                required
                size="small"
                error={!!errors.numRonda}
                helperText={errors.numRonda}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={inputSx}
              />
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
                  {['PLANIFICADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'].map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
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
            <strong style={{ color: '#fff' }}>{deleteTarget?.nombreOficial}</strong>
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