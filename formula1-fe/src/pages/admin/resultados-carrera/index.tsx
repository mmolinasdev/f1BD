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
import { AdminResultadosCarreraService } from '../../../services/api/adminService';
import { SesionDTO, ResultadoCarreraAdminDTO } from '../../../types';

const ESTADO_FINALIZACION_OPTIONS = ['FINALIZADO', 'ABANDONADO', 'DESCALIFICADO', 'NO_CLASIFICADO'];

const ESTADO_COLORS: Record<string, string> = {
  FINALIZADO: '#4caf50',
  ABANDONADO: '#ff9800',
  DESCALIFICADO: '#f44336',
  NO_CLASIFICADO: '#9e9e9e',
};

const EMPTY_FORM: ResultadoCarreraAdminDTO = {
  idSesion: 0,
  tipoDocumento: '',
  numDocumento: '',
  posicionFinal: null,
  tiempoTotal: '',
  vueltasCompletadas: null,
  estadoFinalizacion: 'FINALIZADO',
  puntos: 0,
  vueltaRapida: false,
  posSalida: null,
  numParadasBoxes: null,
  vueltasLideradas: null,
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

export const AdminResultadosCarreraPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedSesionId, setSelectedSesionId] = useState<number | ''>('');
  const { showSuccess, showError, SnackbarElement } = useAdminSnackbar();

  const rules = useMemo(() => ({
    tipoDocumento: (v: string) => !v?.trim() ? 'Requerido' : undefined,
    numDocumento: (v: string) => !v?.trim() ? 'Requerido' : undefined,
  }), []);
  const { errors, validate, clearErrors } = useFormValidation<ResultadoCarreraAdminDTO>(rules);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ResultadoCarreraAdminDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResultadoCarreraAdminDTO | null>(null);
  const [form, setForm] = useState<ResultadoCarreraAdminDTO>(EMPTY_FORM);

  const { data: allSesionesData } = useFetch<SesionDTO[]>(
    () => SesionService.getAll(),
    []
  );
  const allSesiones = allSesionesData ?? [];

  const raceSesiones = allSesiones.filter(
    (s) => s.tipoSesion === 'CARRERA' || s.tipoSesion === 'SPRINT'
  );

  const { data: resultadosData, loading } = useFetch<ResultadoCarreraAdminDTO[]>(
    () =>
      selectedSesionId !== ''
        ? AdminResultadosCarreraService.getBySesion(selectedSesionId as number)
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

  const openEdit = (r: ResultadoCarreraAdminDTO) => {
    clearErrors();
    setEditTarget(r);
    setForm({ ...r });
    setDialogOpen(true);
  };

  const openDelete = (r: ResultadoCarreraAdminDTO) => {
    setDeleteTarget(r);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validate(form)) return;
    try {
      if (editTarget && editTarget.idResultado != null) {
        await AdminResultadosCarreraService.update(editTarget.idResultado, form);
      } else {
        await AdminResultadosCarreraService.create(form);
      }
      showSuccess('Guardado correctamente');
      setDialogOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteTarget.idResultado == null) return;
    try {
      await AdminResultadosCarreraService.delete(deleteTarget.idResultado);
      showSuccess('Eliminado correctamente');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showError((e as Error).message ?? 'Error al eliminar');
    }
  };

  const setField = <K extends keyof ResultadoCarreraAdminDTO>(
    key: K,
    val: ResultadoCarreraAdminDTO[K]
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
            Resultados Carrera
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
            {loading ? '...' : `${resultados.length} registros`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 260 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Sesión (Carrera / Sprint)</InputLabel>
            <Select
              value={selectedSesionId}
              label="Sesión (Carrera / Sprint)"
              onChange={(e) => setSelectedSesionId(e.target.value as number)}
              sx={selectSx}
            >
              <MenuItem value="">— Seleccionar —</MenuItem>
              {raceSesiones.map((s) => (
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
                {['Pos', 'Piloto', 'Num Doc', 'Pos Salida', 'Vueltas', 'Tiempo', 'Puntos', 'V.Rápida', 'Estado', 'Acciones'].map(
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
                  key={r.idResultado}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}
                >
                  <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#E10600' }}>
                    {r.posicionFinal ?? '—'}
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
                  <TableCell sx={cellSx}>{r.posSalida ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{r.vueltasCompletadas ?? '—'}</TableCell>
                  <TableCell sx={cellSx}>{r.tiempoTotal || '—'}</TableCell>
                  <TableCell sx={cellSx}>{r.puntos}</TableCell>
                  <TableCell sx={cellSx}>{r.vueltaRapida ? 'Sí' : 'No'}</TableCell>
                  <TableCell sx={cellSx}>
                    <Chip
                      label={r.estadoFinalizacion}
                      size="small"
                      sx={{
                        backgroundColor: ESTADO_COLORS[r.estadoFinalizacion] ?? '#555',
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
                  <TableCell colSpan={10} align="center" sx={{ ...cellSx, py: 4 }}>
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
          {editTarget ? 'Editar Resultado Carrera' : 'Nuevo Resultado Carrera'}
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
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Posición Final"
                type="number"
                value={form.posicionFinal ?? ''}
                onChange={(e) => setField('posicionFinal', e.target.value ? Number(e.target.value) : null)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
              <TextField
                label="Pos Salida"
                type="number"
                value={form.posSalida ?? ''}
                onChange={(e) => setField('posSalida', e.target.value ? Number(e.target.value) : null)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Vueltas Completadas"
                type="number"
                value={form.vueltasCompletadas ?? ''}
                onChange={(e) => setField('vueltasCompletadas', e.target.value ? Number(e.target.value) : null)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
              <TextField
                label='Tiempo Total (ej: "1:32.453")'
                value={form.tiempoTotal}
                onChange={(e) => setField('tiempoTotal', e.target.value)}
                size="small"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Puntos"
                type="number"
                value={form.puntos}
                onChange={(e) => setField('puntos', Number(e.target.value))}
                size="small"
                inputProps={{ step: 0.5 }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
                sx={textFieldSx}
              />
              <FormControl size="small">
                <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Vuelta Rápida</InputLabel>
                <Select
                  value={form.vueltaRapida ? 'true' : 'false'}
                  label="Vuelta Rápida"
                  onChange={(e) => setField('vueltaRapida', e.target.value === 'true')}
                  sx={selectSx}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Sí</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <FormControl size="small">
              <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Estado Finalización</InputLabel>
              <Select
                value={form.estadoFinalizacion}
                label="Estado Finalización"
                onChange={(e) => setField('estadoFinalizacion', e.target.value)}
                sx={selectSx}
              >
                {ESTADO_FINALIZACION_OPTIONS.map((e) => (
                  <MenuItem key={e} value={e}>{e}</MenuItem>
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
            ¿Eliminar el resultado del piloto{' '}
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
