import { Box, Typography, Grid, Card, CardContent, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useFetch } from '../../hooks/useFetch';
import { SeasonsService } from '../../services/api/seasonsService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatsCard } from '../../components/common/StatsCard';
import { useSeason } from '../../context/SeasonContext';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SpeedIcon from '@mui/icons-material/Speed';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts';

const CHAMPIONS_DATA = [
  { pilot: 'Verstappen', wins: 4, color: '#3671C6' },
  { pilot: 'Hamilton', wins: 7, color: '#27F4D2' },
  { pilot: 'Schumacher', wins: 7, color: '#E8002D' },
  { pilot: 'Vettel', wins: 4, color: '#3671C6' },
  { pilot: 'Senna', wins: 3, color: '#FF8000' },
  { pilot: 'Prost', wins: 4, color: '#FFD700' },
];

const ENGINE_DATA = [
  { name: 'Ferrari', value: 16, color: '#E8002D' },
  { name: 'Mercedes', value: 8, color: '#27F4D2' },
  { name: 'Honda RBPT', value: 6, color: '#3671C6' },
  { name: 'Renault', value: 4, color: '#FF87BC' },
  { name: 'Otros', value: 40, color: '#555' },
];

export const StatisticsPage = () => {
  const { selectedYear } = useSeason();
  const { data: driverStandings, loading } = useFetch(
    () => SeasonsService.getDriverStandings(selectedYear),
    [selectedYear]
  );

  const topWins = driverStandings?.slice().sort((a, b) => b.victorias - a.victorias).slice(0, 8) ?? [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ fontFamily: '"Racing Sans One", sans-serif', color: '#E10600', mb: 3 }}>
        ESTADÍSTICAS
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Total Campeones" value={34} subtitle="Pilotos distintos" icon={<EmojiEventsIcon />} accentColor="#FFD700" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="GPs Disputados" value="1,100+" subtitle="Desde 1950" icon={<SpeedIcon />} accentColor="#E10600" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Récord de Victorias" value="103" subtitle="Lewis Hamilton" accentColor="#27F4D2" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Récord de Poles" value="103" subtitle="Lewis Hamilton" accentColor="#FF8000" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Campeones con más títulos</Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHAMPIONS_DATA} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" tick={{ fill: '#666', fontSize: 11 }} />
                    <YAxis dataKey="pilot" type="category" width={80} tick={{ fill: '#333', fontSize: 11 }} />
                    <RechartTooltip
                      contentStyle={{ backgroundColor: '#15151E', border: '1px solid #333', color: '#fff' }}
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(v: number) => [`${v} títulos`, '']}
                    />
                    <Bar dataKey="wins" radius={[0, 2, 2, 0]}>
                      {CHAMPIONS_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Victorias por motorista (histórico)</Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ENGINE_DATA}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {ENGINE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ color: '#333', fontSize: 12 }}>{v}</span>} />
                    <RechartTooltip
                      contentStyle={{ backgroundColor: '#15151E', border: '1px solid #333', color: '#fff' }}
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Top victorias — Temporada {selectedYear}</Typography>
              {loading ? <LoadingSpinner size={28} /> : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Piloto</TableCell>
                      <TableCell>Equipo</TableCell>
                      <TableCell align="right">Victorias</TableCell>
                      <TableCell align="right">Podios</TableCell>
                      <TableCell align="right">Poles</TableCell>
                      <TableCell align="right">Puntos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topWins.map((d) => (
                      <TableRow key={d.nombre + d.posicion}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 3, height: 20, backgroundColor: '#E10600', borderRadius: 1 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{d.nombre}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: '#E10600' }}>{d.escuderia ?? '—'}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 700, color: d.victorias > 0 ? '#FFD700' : '#888' }}>{d.victorias}</Typography>
                        </TableCell>
                        <TableCell align="right">{d.podios}</TableCell>
                        <TableCell align="right">{d.poles}</TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 700 }}>{d.puntosTotales}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
