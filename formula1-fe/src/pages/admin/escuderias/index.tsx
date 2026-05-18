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
import { TeamsService } from '../../../services/api/teamsService';
import { AdminEscuderiasService, EscuderiaCreateDTO } from '../../../services/api/adminService';
import { EscuderiaDTO } from '../../../types';

const EMPTY_FORM: EscuderiaCreateDTO = {
  nombreOficial: '',
  codigo: '',
  nacionalidad: '',
  estado: 'ACTIVO',
  paisSede: '',
  ciudadSede: '',
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

export const AdminEscuderiasPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EscuderiaDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EscuderiaDTO | null>(null);
  const [form, setForm] = useState<EscuderiaCreateDTO>(EMPTY_FORM);

  const rules = useMemo(() => ({
    nombreOficial: (v: string) => !v?.trim() ? 'Requerido' : undefined,
    codigo: (v: string) => !v?.trim() ? 'Requerido' : v.length < 2 ? 'Mínimo 2 caracteres' : undefined,
  }), []);
  const { errors, validate, clearErrors } = useFormValidation<EscuderiaCreateDTO>(rules);

  const { data, loading } = useFetch(
    () => TeamsService.getAll(0, 200),
    [refreshKey]
  );


  const escuderias = data?.content ?? [];

  const openNew = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (e: EscuderiaDTO) => {
    clearErrors();
    setEditTarget(e);
    setForm({
      nombreOficial: e.nombreOficial,
      codigo: e.codigo,
      nacionalidad: e.nacionalidad,
      estado: e.estado,
      paisSede: e.paisSede ?? '',
      ciudadSede: e.ciudadSede ?? '',
    });
    setDialogOpen(true);
  };

  const openDelete = (e: EscuderiaDTO) => {
    setDeleteTarget(e);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget) {
        await AdminEscuderiasService.update(editTarget.idEquipo, form);
      } else {
        await AdminEscuderiasService.create(form);
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
      await AdminEscuderiasService.delete(deleteTarget.idEquipo);
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof EscuderiaCreateDTO>(key: K, val: EscuderiaCreateDTO[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const inputSx = {
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E10600' },
  };

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
            Gestión de Escuderías
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            {loading ? '...' : `${escuderias.length} registros`}
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
                {['ID', 'Código', 'Nombre', 'Nacionalidad', 'País Sede', 'Ciudad Sede', 'Estado', 'Acciones'].map((h) => (
                  <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {escuderias.map((e) => (
                <TableRow
                  key={e.idEquipo}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}
                >
                  <TableCell sx={{ ...cellSx, color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{e.idEquipo}</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#E10600' }}>{e.codigo}</TableCell>
                  <TableCell sx={cellSx}>{e.nombreOficial}</TableCell>
                  <TableCell sx={cellSx}>{e.nacionalidad}</TableCell>
                  <TableCell sx={cellSx}>{e.paisSede ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{e.ciudadSede ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>
                    <Chip
                      label={e.estado}
                      size="small"
                      sx={{
                        backgroundColor: e.estado === 'ACTIVO' ? '#4caf50' : '#9e9e9e',
                        color: '#fff',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        height: 20,
                        borderRadius: 0,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <IconButton size="small" onClick={() => openEdit(e)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => openDelete(e)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#E10600' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && escuderias.length === 0 && (
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
        <DialogTitle sx={{ color: '#fff', fontFamily: '"Titillium Web", sans-serif', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {editTarget ? 'Editar Escudería' : 'Nueva Escudería'}
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
                label="Código (máx. 3)"
                value={form.codigo}
                onChange={(e) => setField('codigo', e.target.value.slice(0, 3).toUpperCase())}
                required
                size="small"
                inputProps={{ maxLength: 3 }}
                error={!!errors.codigo}
                helperText={errors.codigo}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#E10600', fontWeight: 700 } }}
                sx={inputSx}
              />
              <TextField
                label="Nacionalidad"
                value={form.nacionalidad}
                onChange={(e) => setField('nacionalidad', e.target.value)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="País Sede"
                value={form.paisSede ?? ''}
                onChange={(e) => setField('paisSede', e.target.value)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={inputSx}
              />
              <TextField
                label="Ciudad Sede"
                value={form.ciudadSede ?? ''}
                onChange={(e) => setField('ciudadSede', e.target.value)}
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
                {['ACTIVO', 'INACTIVO'].map((s) => (
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
