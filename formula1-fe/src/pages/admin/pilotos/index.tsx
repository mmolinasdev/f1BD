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
import { DriversService } from '../../../services/api/driversService';
import { AdminPilotosService, PilotoCreateDTO } from '../../../services/api/adminService';
import { PilotoDTO } from '../../../types';

const EMPTY_FORM: PilotoCreateDTO = {
  tipoDocumento: '',
  numDocumento: '',
  nombre: '',
  apellidos: '',
  alias: '',
  numParrillaPermanente: null,
  nacionalidad: '',
  fechaNacimiento: '',
  estado: 'ACTIVO',
};

const ESTADO_COLORS: Record<string, string> = {
  ACTIVO: '#4caf50',
  RETIRADO: '#9e9e9e',
  SUSPENDIDO: '#ff9800',
  INACTIVO: '#f44336',
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

export const AdminPilotosPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PilotoDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PilotoDTO | null>(null);
  const [form, setForm] = useState<PilotoCreateDTO>(EMPTY_FORM);

  const rules = useMemo(() => ({
    tipoDocumento: (v: string) => !v?.trim() ? 'Requerido' : undefined,
    numDocumento:  (v: string) => !v?.trim() ? 'Requerido' : undefined,
    nombre:        (v: string) => !v?.trim() ? 'Requerido' : undefined,
    apellidos:     (v: string) => !v?.trim() ? 'Requerido' : undefined,
    alias:         (v: string) => !v?.trim() ? 'Requerido' : v.length !== 3 ? 'Debe tener exactamente 3 caracteres' : undefined,
    numParrillaPermanente: (v: number | null) =>
      v !== null && (v < 1 || v > 99) ? 'Debe estar entre 1 y 99' : undefined,
  }), []);

  const { errors, validate, clearErrors } = useFormValidation<PilotoCreateDTO>(rules);

  const { data, loading } = useFetch(
    () => DriversService.getAll(0, 200),
    [refreshKey]
  );

  const pilotos = data?.content ?? [];

  const openNew = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (p: PilotoDTO) => {
    clearErrors();
    setEditTarget(p);
    setForm({
      tipoDocumento: p.tipoDocumento,
      numDocumento: p.numDocumento,
      nombre: p.nombre,
      apellidos: p.apellidos,
      alias: p.alias,
      numParrillaPermanente: p.numParrillaPermanente,
      nacionalidad: p.nacionalidad,
      fechaNacimiento: p.fechaNacimiento,
      estado: p.estado,
    });
    setDialogOpen(true);
  };

  const openDelete = (p: PilotoDTO) => {
    setDeleteTarget(p);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget) {
        await AdminPilotosService.update(
          editTarget.tipoDocumento,
          editTarget.numDocumento,
          form
        );
      } else {
        await AdminPilotosService.create(form);
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
      await AdminPilotosService.delete(
        deleteTarget.tipoDocumento,
        deleteTarget.numDocumento
      );
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof PilotoCreateDTO>(key: K, val: PilotoCreateDTO[K]) =>
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
            Gestión de Pilotos
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            {loading ? '...' : `${pilotos.length} registros`}
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
                {['Tipo Doc', 'Num Doc', 'Nombre', 'Apellidos', 'Alias', '#', 'Escudería', 'Estado', 'Acciones'].map(
                  (h) => (
                    <TableCell key={h} sx={headCellSx}>
                      {h}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {pilotos.map((p) => (
                <TableRow
                  key={p.tipoDocumento + p.numDocumento}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}
                >
                  <TableCell sx={cellSx}>{p.tipoDocumento}</TableCell>
                  <TableCell sx={cellSx}>{p.numDocumento}</TableCell>
                  <TableCell sx={cellSx}>{p.nombre}</TableCell>
                  <TableCell sx={cellSx}>{p.apellidos}</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#E10600' }}>{p.alias}</TableCell>
                  <TableCell sx={cellSx}>{p.numParrillaPermanente ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{p.escuderiaActual ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>
                    <Chip
                      label={p.estado}
                      size="small"
                      sx={{
                        backgroundColor: ESTADO_COLORS[p.estado] ?? '#555',
                        color: '#fff',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        height: 20,
                        borderRadius: 0,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <IconButton size="small" onClick={() => openEdit(p)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => openDelete(p)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#E10600' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && pilotos.length === 0 && (
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
        <DialogTitle sx={{ color: '#fff', fontFamily: '"Titillium Web", sans-serif', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {editTarget ? 'Editar Piloto' : 'Nuevo Piloto'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Tipo Documento"
                value={form.tipoDocumento}
                onChange={(e) => setField('tipoDocumento', e.target.value)}
                required
                size="small"
                disabled={!!editTarget}
                error={!!errors.tipoDocumento}
                helperText={errors.tipoDocumento}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E10600' }, '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiInputLabel-root.Mui-disabled': { color: 'rgba(255,255,255,0.45)', opacity: 1 } }}
              />
              <TextField
                label="Num Documento"
                value={form.numDocumento}
                onChange={(e) => setField('numDocumento', e.target.value)}
                required
                size="small"
                disabled={!!editTarget}
                error={!!errors.numDocumento}
                helperText={errors.numDocumento}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiInputLabel-root.Mui-disabled': { color: 'rgba(255,255,255,0.45)', opacity: 1 } }}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Nombre"
                value={form.nombre}
                onChange={(e) => setField('nombre', e.target.value)}
                required
                size="small"
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
              <TextField
                label="Apellidos"
                value={form.apellidos}
                onChange={(e) => setField('apellidos', e.target.value)}
                required
                size="small"
                error={!!errors.apellidos}
                helperText={errors.apellidos}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Alias (máx. 3)"
                value={form.alias}
                onChange={(e) => setField('alias', e.target.value.slice(0, 3).toUpperCase())}
                required
                size="small"
                inputProps={{ maxLength: 3 }}
                error={!!errors.alias}
                helperText={errors.alias}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#E10600', fontWeight: 700 } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
              <TextField
                label="Nº Parrilla"
                type="number"
                value={form.numParrillaPermanente ?? ''}
                onChange={(e) =>
                  setField('numParrillaPermanente', e.target.value ? Number(e.target.value) : null)
                }
                size="small"
                error={!!errors.numParrillaPermanente}
                helperText={errors.numParrillaPermanente}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Nacionalidad"
                value={form.nacionalidad}
                onChange={(e) => setField('nacionalidad', e.target.value)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
              <TextField
                label="Fecha Nacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => setField('fechaNacimiento', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
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
                {['ACTIVO', 'RETIRADO', 'SUSPENDIDO', 'INACTIVO'].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
        <DialogTitle sx={{ color: '#fff', fontFamily: '"Titillium Web", sans-serif', fontWeight: 700 }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            ¿Eliminar este registro?{' '}
            <strong style={{ color: '#fff' }}>
              {deleteTarget?.nombre} {deleteTarget?.apellidos}
            </strong>
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