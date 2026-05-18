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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetch } from '../../../hooks/useFetch';
import { AdminPuntosResultadoService } from '../../../services/api/adminService';
import { PuntosResultadoAdminDTO } from '../../../types';

const EMPTY_FORM: PuntosResultadoAdminDTO = {
  idResultado: 0,
  idRegla: 0,
  puntos: 0,
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
};


export const AdminPuntosResultadoPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedResultadoId, setSelectedResultadoId] = useState<number | ''>('');
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();

  const rules = useMemo(() => ({
    idRegla: (v: number) => !v ? 'Requerido' : undefined,
    puntos: (v: number) => v == null ? 'Requerido' : undefined,
  }), []);
  const { errors, validate, clearErrors } = useFormValidation<PuntosResultadoAdminDTO>(rules);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PuntosResultadoAdminDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PuntosResultadoAdminDTO | null>(null);
  const [form, setForm] = useState<PuntosResultadoAdminDTO>(EMPTY_FORM);

  const { data: puntosData, loading } = useFetch<PuntosResultadoAdminDTO[]>(
    () =>
      selectedResultadoId !== ''
        ? AdminPuntosResultadoService.getByResultado(selectedResultadoId as number)
        : AdminPuntosResultadoService.getAll(),
    [selectedResultadoId, refreshKey]
  );
  const puntos = puntosData ?? [];

  const openNew = () => {
    if (selectedResultadoId === '') {
      showError('Selecciona un resultado primero');
      return;
    }
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, idResultado: selectedResultadoId as number });
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (p: PuntosResultadoAdminDTO) => {
    clearErrors();
    setEditTarget(p);
    setForm({ ...p });
    setDialogOpen(true);
  };

  const openDelete = (p: PuntosResultadoAdminDTO) => {
    setDeleteTarget(p);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget && editTarget.idPuntos != null) {
        await AdminPuntosResultadoService.update(editTarget.idPuntos, form);
      } else {
        await AdminPuntosResultadoService.create(form);
      }
      showSuccess('Guardado correctamente');
      setDialogOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteTarget.idPuntos == null) return;
    try {
      await AdminPuntosResultadoService.delete(deleteTarget.idPuntos);
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof PuntosResultadoAdminDTO>(
    key: K,
    val: PuntosResultadoAdminDTO[K]
  ) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Box sx={{ backgroundColor: '#111', minHeight: '100vh' }}>
      <Box
        sx={{
          backgroundColor: '#15151E',
          px: 4,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
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
            Puntos Resultado
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            {loading ? '...' : `${puntos.length} registros`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            label="ID Resultado Carrera"
            type="number"
            size="small"
            value={selectedResultadoId}
            onChange={(e) => setSelectedResultadoId(e.target.value ? Number(e.target.value) : '')}
            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
            InputProps={{ sx: { color: '#fff' } }}
            sx={{ ...textFieldSx, width: 220 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openNew}
            disabled={selectedResultadoId === ''}
            sx={{
              backgroundColor: '#E10600',
              borderRadius: 0,
              fontFamily: '"Titillium Web", sans-serif',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              '&:hover': { backgroundColor: '#a80400' },
              '&.Mui-disabled': { backgroundColor: 'rgba(225,6,0,0.3)', color: 'rgba(255,255,255,0.3)' },
            }}
          >
            Nuevo
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ backgroundColor: '#1a1a1a', borderRadius: 0 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                {['ID', 'ID Resultado', 'ID Regla', 'Tipo Sesión', 'Posición', 'Piloto', 'Puntos', 'Acciones'].map(
                  (h) => (
                    <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {puntos.map((p) => (
                <TableRow key={p.idPuntos} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
                  <TableCell sx={cellSx}>{p.idPuntos}</TableCell>
                  <TableCell sx={cellSx}>{p.idResultado}</TableCell>
                  <TableCell sx={cellSx}>{p.idRegla}</TableCell>
                  <TableCell sx={cellSx}>{p.tipoSesion ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{p.posicion ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                        {p.nombrePiloto ?? '—'}
                      </Typography>
                      {p.alias && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#E10600', fontWeight: 700 }}>
                          {p.alias}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#E10600' }}>{p.puntos}</TableCell>
                  <TableCell sx={cellSx}>
                    <IconButton
                      size="small"
                      onClick={() => openEdit(p)}
                      sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDelete(p)}
                      sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#E10600' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && puntos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ ...cellSx, py: 4 }}>
                    {selectedResultadoId === '' ? 'Sin registros de puntos' : 'Sin registros para este resultado'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
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
          {editTarget ? 'Editar Puntos Resultado' : 'Nuevo Puntos Resultado'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField
              label="ID Resultado"
              type="number"
              value={form.idResultado}
              size="small"
              disabled
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{ sx: { color: '#fff' } }}
              sx={textFieldSx}
            />
            <TextField
              label="ID Regla Puntuación"
              type="number"
              value={form.idRegla || ''}
              onChange={(e) => setField('idRegla', Number(e.target.value))}
              required
              size="small"
              error={!!errors.idRegla}
              helperText={errors.idRegla}
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{ sx: { color: '#fff' } }}
              sx={textFieldSx}
            />
            <TextField
              label="Puntos"
              type="number"
              value={form.puntos}
              onChange={(e) => setField('puntos', Number(e.target.value))}
              required
              size="small"
              inputProps={{ step: 0.5 }}
              error={!!errors.puntos}
              helperText={errors.puntos}
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
            ¿Eliminar el registro de puntos{' '}
            <strong style={{ color: '#fff' }}>ID {deleteTarget?.idPuntos}</strong>?
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
