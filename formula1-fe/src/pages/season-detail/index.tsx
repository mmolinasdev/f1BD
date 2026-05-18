import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSeason } from '../../context/SeasonContext';
import {
  Box, Typography, Tabs, Tab, Table, TableHead, TableBody,
  TableRow, TableCell, CircularProgress,
} from '@mui/material';
import { useFetch } from '../../hooks/useFetch';
import { SeasonsService } from '../../services/api/seasonsService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getPositionColor } from '../../utils/formatters';

export const SeasonDetailPage = () => {
  const { year } = useParams<{ year: string }>();
  const seasonYear = Number(year);
  const [tab, setTab] = useState(0);
  const { setSelectedYear } = useSeason();

  useEffect(() => {
    if (seasonYear) setSelectedYear(seasonYear);
  }, [seasonYear]);

  const { data: season, loading } = useFetch(() => SeasonsService.getByYear(seasonYear), [seasonYear]);
  const { data: driverStandings, loading: loadingDS } = useFetch(() => SeasonsService.getDriverStandings(seasonYear), [seasonYear]);
  const { data: constructorStandings, loading: loadingCS } = useFetch(() => SeasonsService.getConstructorStandings(seasonYear), [seasonYear]);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ fontFamily: '"Racing Sans One", sans-serif', color: '#E10600', mb: 0.5 }}>
        TEMPORADA {seasonYear}
      </Typography>
      {season?.numGps != null && (
        <Typography sx={{ color: '#888', mb: 3, fontSize: '0.9rem' }}>
          {season.numGps} Grandes Premios · Estado: {season.estado}
        </Typography>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Pilotos" />
        <Tab label="Constructores" />
      </Tabs>

      {tab === 0 && (
        loadingDS ? <CircularProgress sx={{ color: '#E10600' }} /> : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Pos</TableCell>
                <TableCell>Piloto</TableCell>
                <TableCell>Equipo</TableCell>
                <TableCell align="right">Victorias</TableCell>
                <TableCell align="right">Podios</TableCell>
                <TableCell align="right">Poles</TableCell>
                <TableCell align="right">Puntos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {driverStandings?.map((d) => (
                <TableRow key={d.nombre + d.posicion}>
                  <TableCell>
                    <Typography sx={{ fontFamily: '"Racing Sans One", sans-serif', color: getPositionColor(d.posicion), fontSize: '1rem' }}>
                      {d.posicion}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 3, height: 20, backgroundColor: '#E10600', borderRadius: 1 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{d.nombre}</Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>{d.aliasOCodigo}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: '#E10600' }}>{d.escuderia ?? '—'}</Typography>
                  </TableCell>
                  <TableCell align="right">{d.victorias}</TableCell>
                  <TableCell align="right">{d.podios}</TableCell>
                  <TableCell align="right">{d.poles}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 700 }}>{d.puntosTotales}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}

      {tab === 1 && (
        loadingCS ? <CircularProgress sx={{ color: '#E10600' }} /> : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Pos</TableCell>
                <TableCell>Constructor</TableCell>
                <TableCell align="right">Victorias</TableCell>
                <TableCell align="right">Podios</TableCell>
                <TableCell align="right">Poles</TableCell>
                <TableCell align="right">Puntos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {constructorStandings?.map((t) => (
                <TableRow key={t.nombre + t.posicion}>
                  <TableCell>
                    <Typography sx={{ fontFamily: '"Racing Sans One", sans-serif', color: getPositionColor(t.posicion), fontSize: '1rem' }}>
                      {t.posicion}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#E10600' }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.nombre}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{t.victorias}</TableCell>
                  <TableCell align="right">{t.podios}</TableCell>
                  <TableCell align="right">{t.poles}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 700 }}>{t.puntosTotales}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
    </Box>
  );
};
