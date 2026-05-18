import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Tabs, Tab, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, CircularProgress,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useFetch } from '../../hooks/useFetch';
import { RacesService } from '../../services/api/racesService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getPositionColor, formatShortDate } from '../../utils/formatters';
import SpeedIcon from '@mui/icons-material/Speed';

const TIPO_COLOR: Record<string, string> = {
  TIEMPO: '#FF8000',
  POSICIONES: '#E10600',
  DESCALIFICACION: '#67676D',
};

export const RaceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const raceId = Number(id);
  const [tab, setTab] = useState(0);

  const { data: race, loading } = useFetch(() => RacesService.getById(raceId), [raceId]);
  const { data: results, loading: loadingResults } = useFetch(() => RacesService.getResults(raceId), [raceId]);
  const { data: qualifying, loading: loadingQualifying } = useFetch(() => RacesService.getClasificacion(raceId), [raceId]);
  const { data: penalties, loading: loadingPenalties } = useFetch(() => RacesService.getPenalties(raceId), [raceId]);

  if (loading) return <LoadingSpinner />;
  if (!race) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ color: '#888', letterSpacing: '0.1em' }}>
          TEMPORADA {race.anioTemporada} · RONDA {race.numRonda}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, lineHeight: 1.2 }}>{race.nombreOficial}</Typography>
        <Typography variant="body2" sx={{ color: '#888', mt: 0.5 }}>
          {race.nombreCircuito}{race.fechaInicio ? ` · ${formatShortDate(race.fechaInicio)}` : ''}
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Resultados" />
        <Tab label="Clasificación" />
        <Tab label={`Penalizaciones${penalties && penalties.length > 0 ? ` (${penalties.length})` : ''}`} />
      </Tabs>

      {tab === 0 && (
        loadingResults ? <CircularProgress sx={{ color: '#E10600' }} /> : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Pos</TableCell>
                <TableCell>Piloto</TableCell>
                <TableCell>Equipo</TableCell>
                <TableCell align="right">Vueltas</TableCell>
                <TableCell align="right">Tiempo</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="right">Puntos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results?.map((r) => (
                <TableRow key={r.idResultado}>
                  <TableCell>
                    <Typography sx={{ fontFamily: '"Racing Sans One", sans-serif', color: r.posicionFinal ? getPositionColor(r.posicionFinal) : '#888', fontSize: '1rem' }}>
                      {r.posicionFinal ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 3, height: 20, backgroundColor: '#E10600', borderRadius: 1 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{r.nombrePiloto}</Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>{r.alias}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: '#E10600' }}>{r.nombreEscuderia}</Typography>
                  </TableCell>
                  <TableCell align="right">{r.vueltasCompletadas ?? '—'}</TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      {r.tiempoTotal ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                      <Chip
                        label={r.estadoFinalizacion}
                        size="small"
                        sx={{ fontSize: '0.6rem' }}
                        variant="outlined"
                      />
                      {r.vueltaRapida && <SpeedIcon sx={{ fontSize: 14, color: '#FF8000' }} />}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 700 }}>{r.puntos > 0 ? r.puntos : '—'}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}

      {tab === 1 && (
        loadingQualifying ? <CircularProgress sx={{ color: '#E10600' }} /> : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 40 }}>Pos</TableCell>
                <TableCell>Piloto</TableCell>
                <TableCell>Equipo</TableCell>
                <TableCell align="right">Q1</TableCell>
                <TableCell align="right">Q2</TableCell>
                <TableCell align="right">Q3</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(qualifying ?? []).map((q) => {
                const eliminado = q.faseEliminacion && q.faseEliminacion !== 'NINGUNA';
                return (
                  <TableRow key={q.posicionParrilla} sx={{ opacity: eliminado ? 0.6 : 1 }}>
                    <TableCell>
                      <Typography sx={{ fontFamily: '"Racing Sans One", sans-serif', color: q.posicionParrilla ? getPositionColor(q.posicionParrilla) : '#888', fontSize: '1rem' }}>
                        {q.posicionParrilla ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 3, height: 20, backgroundColor: '#E10600', borderRadius: 1 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{q.nombrePiloto}</Typography>
                          <Typography variant="caption" sx={{ color: '#888' }}>{q.alias}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#E10600' }}>{q.nombreEscuderia ?? '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ color: '#555', fontFamily: 'monospace' }}>{q.tiempoQ1 ?? '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ color: q.faseEliminacion === 'Q2' ? '#E10600' : '#555', fontFamily: 'monospace' }}>
                        {q.tiempoQ2 ?? <span style={{ color: '#555' }}>—</span>}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ color: q.tiempoQ3 ? '#FFD700' : '#555', fontFamily: 'monospace', fontWeight: q.tiempoQ3 ? 700 : 400 }}>
                        {q.tiempoQ3 ?? '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )
      )}

      {tab === 2 && (
        loadingPenalties ? <CircularProgress sx={{ color: '#E10600' }} /> : (
          !penalties || penalties.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <WarningAmberIcon sx={{ fontSize: 40, color: '#bbb', mb: 1 }} />
              <Typography sx={{ color: '#888', fontSize: '0.875rem' }}>Sin penalizaciones en esta carrera</Typography>
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Piloto</TableCell>
                  <TableCell align="center">Tipo</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell align="right">Magnitud</TableCell>
                  <TableCell align="right">Fecha resolución</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {penalties.map((p) => (
                  <TableRow key={p.idPenalizacion}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 3, height: 20, backgroundColor: TIPO_COLOR[p.tipo] ?? '#888', borderRadius: 1 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.nombrePiloto}</Typography>
                          <Typography variant="caption" sx={{ color: '#888' }}>{p.alias}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={p.tipo}
                        size="small"
                        sx={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          borderRadius: 0,
                          backgroundColor: `${TIPO_COLOR[p.tipo] ?? '#888'}22`,
                          color: TIPO_COLOR[p.tipo] ?? '#888',
                          border: `1px solid ${TIPO_COLOR[p.tipo] ?? '#888'}44`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#555', lineHeight: 1.4 }}>{p.motivo ?? '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 700, color: TIPO_COLOR[p.tipo] ?? '#888' }}>
                        {p.magnitud != null
                          ? p.tipo === 'TIEMPO' ? `+${p.magnitud}s` : `-${p.magnitud} pos`
                          : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ color: '#888' }}>{p.fechaResolucion ?? '—'}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )
      )}
    </Box>
  );
};
