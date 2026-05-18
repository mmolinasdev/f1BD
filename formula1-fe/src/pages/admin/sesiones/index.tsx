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
import { SesionService } from '../../../services/api/sesionService';
import { SesionDTO } from '../../../types';

const TIPO_SESION_OPTIONS = ['FP1', 'FP2', 'FP3', 'CLASIFICACION', 'SPRINT_CLASIFICACION', 'SPRINT', 'CARRERA'];
const ESTADO_OPTIONS = ['PROGRAMADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA'];
const CONDICION_OPTIONS = ['SECA', 'MOJADA', 'MIXTA'];

const ESTADO_COLORS: Record<string, string> = {
  PROGRAMADA: '#2196f3',
  EN_CURSO: '#4caf50',
  FINALIZADA: '#9e9e9e',
  CANCELADA: '#f44336',
};

type SesionFormData = Omit<SesionDTO, 'idSesion' | 'nombreGP'>;

const EMPTY_FORM: SesionFormData = {
  idEvento: 0,
  tipoSesion: 'CARRERA',
  orden: 1,
  fechaProgramada: '',
  estado: 'PROGRAMADA',
  condicionPista: 'SECA',
  numVueltas: null,
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

const textFieldSx = {
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
};

export const AdminSesionesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SesionDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SesionDTO | null>(null);
  const [form, setForm] = useState<SesionFormData>(EMPTY_FORM);

  const rules = useMemo(() => ({
    idEvento: (v: number) => !v || v <= 0 ? 'Requerido' : undefined,
    orden:    (v: number) => !v || v < 1   ? 'Debe ser mayor a 0' : undefined,
  }), []);
  const { errors, validate, clearErrors } = useFormValidation<SesionFormData>(rules);

  const { data: sesionesData, loading } = useFetch<SesionDTO[]>(
    () => SesionService.getAll(),
    [refreshKey]
  );
  const sesiones = sesionesData ?? [];

  const openNew = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (s: SesionDTO) => {
    clearErrors();
    setEditTarget(s);
    setForm({
      idEvento: s.idEvento,
      tipoSesion: s.tipoSesion,
      orden: s.orden,
      fechaProgramada: s.fechaProgramada ?? '',
      estado: s.estado,
      condicionPista: s.condicionPista ?? '',
      numVueltas: s.numVueltas,
    });
    setDialogOpen(true);
  };

  const openDelete = (s: SesionDTO) => {
    setDeleteTarget(s);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget) {
        await SesionService.update(editTarget.idSesion, form);
      } else {
        await SesionService.create(form);
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
      await SesionService.delete(deleteTarget.idSesion);
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof SesionFormData>(key: K, val: SesionFormData[K]) =>
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
            Gestión de Sesiones
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            {loading ? '...' : `${sesiones.length} registros`}
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
          Nueva
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
                {['ID Sesión', 'GP', 'Tipo Sesión', 'Orden', 'Fecha', 'Estado', 'Condición Pista', 'Vueltas', 'Acciones'].map(
                  (h) => (
                    <TableCell key={h} sx={headCellSx}>
                      {h}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sesiones.map((s) => (
                <TableRow
                  key={s.idSesion}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}
                >
                  <TableCell sx={cellSx}>{s.idSesion}</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#E10600' }}>
                    {s.nombreGP ?? `GP #${s.idEvento}`}
                  </TableCell>
                  <TableCell sx={cellSx}>{s.tipoSesion}</TableCell>
                  <TableCell sx={cellSx}>{s.orden}</TableCell>
                  <TableCell sx={cellSx}>{s.fechaProgramada ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>
                    <Chip
                      label={s.estado}
                      size="small"
                      sx={{
                        backgroundColor: ESTADO_COLORS[s.estado] ?? '#555',
                        color: '#fff',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        height: 20,
                        borderRadius: 0,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={cellSx}>{s.condicionPista ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{s.numVueltas ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>
                    <IconButton
                      size="small"
                      onClick={() => openEdit(s)}
                      sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDelete(s)}
                      sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#E10600' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && sesiones.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ ...cellSx, py: 4 }}>
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
          {editTarget ? 'Editar Sesión' : 'Nueva Sesión'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="ID Gran Premio"
                type="number"
                value={form.idEvento || ''}
                onChange={(e) => setField('idEvento', Number(e.target.value))}
                required
                size="small"
                disabled={!!editTarget}
                error={!!errors.idEvento}
                helperText={errors.idEvento}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
              <TextField
                label="Orden"
                type="number"
                value={form.orden || ''}
                onChange={(e) => setField('orden', Number(e.target.value))}
                required
                size="small"
                error={!!errors.orden}
                helperText={errors.orden}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
            </Box>
            <FormControl size="small">
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Tipo Sesión</InputLabel>
              <Select
                value={form.tipoSesion}
                label="Tipo Sesión"
                onChange={(e) => setField('tipoSesion', e.target.value)}
                sx={selectSx}
              >
                {TIPO_SESION_OPTIONS.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Fecha Programada"
              type="date"
              value={form.fechaProgramada ?? ''}
              onChange={(e) => setField('fechaProgramada', e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{ sx: { color: '#fff' } }}
              sx={textFieldSx}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl size="small">
                <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Estado</InputLabel>
                <Select
                  value={form.estado}
                  label="Estado"
                  onChange={(e) => setField('estado', e.target.value)}
                  sx={selectSx}
                >
                  {ESTADO_OPTIONS.map((e) => (
                    <MenuItem key={e} value={e}>{e}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Condición Pista</InputLabel>
                <Select
                  value={form.condicionPista ?? ''}
                  label="Condición Pista"
                  onChange={(e) => setField('condicionPista', e.target.value)}
                  sx={selectSx}
                >
                  <MenuItem value="">—</MenuItem>
                  {CONDICION_OPTIONS.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Num Vueltas"
              type="number"
              value={form.numVueltas ?? ''}
              onChange={(e) => setField('numVueltas', e.target.value ? Number(e.target.value) : null)}
              size="small"
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{ sx: { color: '#fff' } }}
              sx={textFieldSx}
            />
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: '#1a1a1a', borderRadius: 0 } }}
      >
        <DialogTitle
          sx={{
            color: '#fff',
            fontFamily: '"Titillium Web", sans-serif',
            fontWeight: 700,
          }}
        >
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            ¿Eliminar la sesión{' '}
            <strong style={{ color: '#fff' }}>
              {deleteTarget?.tipoSesion} — {deleteTarget?.nombreGP}
            </strong>
            ?
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
