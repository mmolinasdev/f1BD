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
import { AdminResultadosClasificacionService } from '../../../services/api/adminService';
import { SesionDTO, ResultadoClasificacionAdminDTO } from '../../../types';

const FASE_ELIMINACION_OPTIONS = ['Q1', 'Q2', 'Q3'];

const FASE_COLORS: Record<string, string> = {
  Q1: '#f44336',
  Q2: '#ff9800',
  Q3: '#4caf50',
};

const EMPTY_FORM: ResultadoClasificacionAdminDTO = {
  idSesion: 0,
  tipoDocumento: '',
  numDocumento: '',
  posicionParrilla: null,
  tiempoQ1: '',
  tiempoQ2: '',
  tiempoQ3: '',
  faseEliminacion: 'Q3',
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

export const AdminResultadosClasificacionPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedSesionId, setSelectedSesionId] = useState<number | ''>('');
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();

  const rules = useMemo(() => ({
    tipoDocumento: (v: string) => !v?.trim() ? 'Requerido' : undefined,
    numDocumento: (v: string) => !v?.trim() ? 'Requerido' : undefined,
  }), []);
  const { errors, validate, clearErrors } = useFormValidation<ResultadoClasificacionAdminDTO>(rules);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ResultadoClasificacionAdminDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResultadoClasificacionAdminDTO | null>(null);
  const [form, setForm] = useState<ResultadoClasificacionAdminDTO>(EMPTY_FORM);

  const { data: allSesionesData } = useFetch<SesionDTO[]>(
    () => SesionService.getAll(),
    []
  );
  const allSesiones = allSesionesData ?? [];

  const clasificacionSesiones = allSesiones.filter(
    (s) => s.tipoSesion === 'CLASIFICACION' || s.tipoSesion === 'SPRINT_CLASIFICACION'
  );

  const { data: resultadosData, loading } = useFetch<ResultadoClasificacionAdminDTO[]>(
    () =>
      selectedSesionId !== ''
        ? AdminResultadosClasificacionService.getBySesion(selectedSesionId as number)
        : Promise.resolve([]),
    [selectedSesionId, refreshKey]
  );
  const resultados = resultadosData ?? [];

  const openNew = () => {
    if (selectedSesionId === '') {
      showError('Selecciona una sesión primero');
      return;
    }
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, idSesion: selectedSesionId as number });
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (r: ResultadoClasificacionAdminDTO) => {
    clearErrors();
    setEditTarget(r);
    setForm({ ...r });
    setDialogOpen(true);
  };

  const openDelete = (r: ResultadoClasificacionAdminDTO) => {
    setDeleteTarget(r);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget && editTarget.idResultadoClas != null) {
        await AdminResultadosClasificacionService.update(editTarget.idResultadoClas, form);
      } else {
        await AdminResultadosClasificacionService.create(form);
      }
      showSuccess('Guardado correctamente');
      setDialogOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteTarget.idResultadoClas == null) return;
    try {
      await AdminResultadosClasificacionService.delete(deleteTarget.idResultadoClas);
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof ResultadoClasificacionAdminDTO>(
    key: K,
    val: ResultadoClasificacionAdminDTO[K]
  ) => setForm((f) => ({ ...f, [key]: val }));

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
            Resultados Clasificación
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            {loading ? '...' : `${resultados.length} registros`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Sesión (Clasificación)</InputLabel>
            <Select
              value={selectedSesionId}
              label="Sesión (Clasificación)"
              onChange={(e) => setSelectedSesionId(e.target.value as number)}
              sx={selectSx}
            >
              <MenuItem value="">— Seleccionar —</MenuItem>
              {clasificacionSesiones.map((s) => (
                <MenuItem key={s.idSesion} value={s.idSesion}>
                  {s.nombreGP} — {s.tipoSesion} ({s.fechaProgramada ?? 'sin fecha'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openNew}
            disabled={selectedSesionId === ''}
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
                {['Pos', 'Piloto', 'Num Doc', 'Q1', 'Q2', 'Q3', 'Fase Eliminación', 'Acciones'].map(
                  (h) => (
                    <TableCell key={h} sx={headCellSx}>
                      {h}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {resultados.map((r) => (
                <TableRow
                  key={r.idResultadoClas}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}
                >
                  <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#E10600' }}>
                    {r.posicionParrilla ?? '—'}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                        {r.nombrePiloto ?? r.tipoDocumento}
                      </Typography>
                      {r.alias && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#E10600', fontWeight: 700 }}>
                          {r.alias}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={cellSx}>{r.numDocumento}</TableCell>
                  <TableCell sx={cellSx}>{r.tiempoQ1 || '—'}</TableCell>
                  <TableCell sx={cellSx}>{r.tiempoQ2 || '—'}</TableCell>
                  <TableCell sx={cellSx}>{r.tiempoQ3 || '—'}</TableCell>
                  <TableCell sx={cellSx}>
                    <Chip
                      label={r.faseEliminacion || '—'}
                      size="small"
                      sx={{
                        backgroundColor: r.faseEliminacion ? (FASE_COLORS[r.faseEliminacion] ?? '#555') : '#555',
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
                      onClick={() => openEdit(r)}
                      sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDelete(r)}
                      sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#E10600' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && resultados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ ...cellSx, py: 4 }}>
                    {selectedSesionId === '' ? 'Selecciona una sesión para ver resultados' : 'Sin registros'}
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
          {editTarget ? 'Editar Resultado Clasificación' : 'Nuevo Resultado Clasificación'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField
              label="ID Sesión"
              type="number"
              value={form.idSesion}
              size="small"
              disabled
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{ sx: { color: '#fff' } }}
              sx={textFieldSx}
            />
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
                sx={textFieldSx}
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
                sx={textFieldSx}
              />
            </Box>
            <TextField
              label="Posición Parrilla"
              type="number"
              value={form.posicionParrilla ?? ''}
              onChange={(e) => setField('posicionParrilla', e.target.value ? Number(e.target.value) : null)}
              size="small"
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{ sx: { color: '#fff' } }}
              sx={textFieldSx}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <TextField
                label='Q1 (ej: "1:23.456")'
                value={form.tiempoQ1}
                onChange={(e) => setField('tiempoQ1', e.target.value)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
              <TextField
                label='Q2 (ej: "1:23.456")'
                value={form.tiempoQ2}
                onChange={(e) => setField('tiempoQ2', e.target.value)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
              <TextField
                label='Q3 (ej: "1:23.456")'
                value={form.tiempoQ3}
                onChange={(e) => setField('tiempoQ3', e.target.value)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
            </Box>
            <FormControl size="small">
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Fase Eliminación</InputLabel>
              <Select
                value={form.faseEliminacion}
                label="Fase Eliminación"
                onChange={(e) => setField('faseEliminacion', e.target.value)}
                sx={selectSx}
              >
                {FASE_ELIMINACION_OPTIONS.map((f) => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
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
            ¿Eliminar el resultado de clasificación del piloto{' '}
            <strong style={{ color: '#fff' }}>
              {deleteTarget?.tipoDocumento} {deleteTarget?.numDocumento}
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
