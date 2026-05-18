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
import { CircuitsService } from '../../../services/api/circuitsService';
import { AdminCircuitosService, CircuitoCreateDTO } from '../../../services/api/adminService';
import { CircuitoDTO } from '../../../types';

const EMPTY_FORM: CircuitoCreateDTO = {
  nombreOficial: '',
  descripcion: '',
  pais: '',
  ciudad: '',
  estado: 'ACTIVO',
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

export const AdminCircuitosPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CircuitoDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CircuitoDTO | null>(null);
  const [form, setForm] = useState<CircuitoCreateDTO>(EMPTY_FORM);

  const rules = useMemo(() => ({
    nombreOficial: (v: string) => !v?.trim() ? 'Requerido' : undefined,
    pais: (v: string) => !v?.trim() ? 'Requerido' : undefined,
    ciudad: (v: string | null) => !v?.trim() ? 'Requerido' : undefined,
  }), []);
  const { errors, validate, clearErrors } = useFormValidation<CircuitoCreateDTO>(rules);

  const { data, loading } = useFetch(
    () => CircuitsService.getAll(0, 200),
    [refreshKey]
  );

  const circuitos = data?.content ?? [];

  const openNew = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (c: CircuitoDTO) => {
    clearErrors();
    setEditTarget(c);
    setForm({
      nombreOficial: c.nombreOficial,
      descripcion: c.descripcion ?? '',
      pais: c.pais ?? '',
      ciudad: c.ciudad ?? '',
      estado: c.estado,
    });
    setDialogOpen(true);
  };

  const openDelete = (c: CircuitoDTO) => {
    setDeleteTarget(c);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget) {
        await AdminCircuitosService.update(editTarget.idCircuito, form);
      } else {
        await AdminCircuitosService.create(form);
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
      await AdminCircuitosService.delete(deleteTarget.idCircuito);
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof CircuitoCreateDTO>(key: K, val: CircuitoCreateDTO[K]) =>
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
            Gestión de Circuitos
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            {loading ? '...' : `${circuitos.length} registros`}
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
                {['ID', 'Nombre', 'País', 'Ciudad', 'Estado', 'Acciones'].map((h) => (
                  <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {circuitos.map((c) => (
                <TableRow
                  key={c.idCircuito}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}
                >
                  <TableCell sx={{ ...cellSx, color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{c.idCircuito}</TableCell>
                  <TableCell sx={cellSx}>{c.nombreOficial}</TableCell>
                  <TableCell sx={cellSx}>{c.pais ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{c.ciudad ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>
                    <Chip
                      label={c.estado}
                      size="small"
                      sx={{
                        backgroundColor: c.estado === 'ACTIVO' ? '#4caf50' : '#9e9e9e',
                        color: '#fff',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        height: 20,
                        borderRadius: 0,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => openDelete(c)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#E10600' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && circuitos.length === 0 && (
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
          {editTarget ? 'Editar Circuito' : 'Nuevo Circuito'}
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
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="País"
                value={form.pais ?? ''}
                onChange={(e) => setField('pais', e.target.value)}
                required
                size="small"
                error={!!errors.pais}
                helperText={errors.pais}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={inputSx}
              />
              <TextField
                label="Ciudad"
                value={form.ciudad ?? ''}
                onChange={(e) => setField('ciudad', e.target.value)}
                required
                size="small"
                error={!!errors.ciudad}
                helperText={errors.ciudad}
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
