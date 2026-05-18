import { Box, Grid, Typography, Paper } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import PersonIcon from '@mui/icons-material/Person';
import { StatsCard } from '../../components/common/StatsCard';
import { useSeason } from '../../context/SeasonContext';
import { useFetch } from '../../hooks/useFetch';
import { SeasonsService } from '../../services/api/seasonsService';
import { AdminContratosService } from '../../services/api/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getPositionColor } from '../../utils/formatters';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
      <Box sx={{ width: 4, height: 22, backgroundColor: '#E10600', flexShrink: 0 }} />
      <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#15151E' }}>
        {title}
      </Typography>
    </Box>
    {subtitle && (
      <Typography sx={{ fontSize: '0.75rem', color: '#999', ml: '20px' }}>{subtitle}</Typography>
    )}
  </Box>
);

export const DashboardPage = () => {
  const { selectedYear } = useSeason();

  const { data: standings, loading: loadingS } = useFetch(() => SeasonsService.getDriverStandings(selectedYear), [selectedYear]);
  const { data: constructors, loading: loadingC } = useFetch(() => SeasonsService.getConstructorStandings(selectedYear), [selectedYear]);
  const { data: season } = useFetch(() => SeasonsService.getByYear(selectedYear), [selectedYear]);
  const { data: pilotosCount } = useFetch(() => AdminContratosService.countPilotosByAnio(selectedYear), [selectedYear]);

  const top5 = standings?.slice(0, 5) ?? [];

  const chartData = top5.map((d) => ({ name: d.aliasOCodigo, points: Number(d.puntosTotales), color: '#E10600' }));

  return (
    <Box>
      {/* Hero strip */}
      <Box
        sx={{
          backgroundColor: '#15151E',
          px: 4, py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', mb: 0.5 }}>
            Temporada activa
          </Typography>
          <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '2.5rem', color: '#fff', lineHeight: 1, textTransform: 'uppercase' }}>
            {selectedYear}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Stats strip */}
        <Grid container spacing={2} sx={{ mb: 5 }}>
          {[
            { title: 'Grandes Premios', value: season?.numGps ?? '—', subtitle: `Temporada ${selectedYear}`, icon: <FlagIcon />, color: '#E10600' },
            { title: 'Pilotos', value: pilotosCount ?? '—', subtitle: 'En parrilla', icon: <PersonIcon />, color: '#15151E' },
          ].map((s, i) => (
            <Grid item xs={6} md={3} key={i}>
              <StatsCard title={s.title} value={s.value} subtitle={s.subtitle} icon={s.icon} accentColor={s.color} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Driver standings */}
          <Grid item xs={12} md={7}>
            <SectionHeader title="Clasificación de Pilotos" subtitle={`Temporada ${selectedYear}`} />
            <Paper elevation={0} sx={{ boxShadow: '0 2px 8px rgba(21,21,30,0.07)' }}>
              {/* Table header */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 60px 60px 70px', gap: 0, backgroundColor: '#15151E', px: 2, py: 1.25 }}>
                {['Pos', 'Piloto', 'Equipo', 'V', 'Pod', 'Pts'].map((h) => (
                  <Typography key={h} sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: h === 'Pts' ? 'right' : 'left' }}>
                    {h}
                  </Typography>
                ))}
              </Box>

              {loadingS ? <LoadingSpinner size={28} /> : standings?.slice(0, 10).map((d) => (
                <Box
                  key={d.nombre + d.posicion}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 80px 60px 60px 70px',
                    gap: 0,
                    px: 2,
                    py: 1.25,
                    borderBottom: '1px solid rgba(21,21,30,0.05)',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '0.95rem', color: getPositionColor(d.posicion) || '#15151E', alignSelf: 'center' }}>
                    {d.posicion}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 3, height: 28, backgroundColor: '#E10600', flexShrink: 0 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#15151E', lineHeight: 1.2 }}>{d.nombre}</Typography>
                      <Typography sx={{ fontSize: '0.68rem', color: '#999' }}>{d.aliasOCodigo}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#E10600', fontWeight: 600, alignSelf: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {(d.escuderia ?? '').split(' ')[0]}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#15151E', alignSelf: 'center' }}>{d.victorias}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#15151E', alignSelf: 'center' }}>{d.podios}</Typography>
                  <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '0.95rem', color: '#15151E', alignSelf: 'center', textAlign: 'right' }}>
                    {d.puntosTotales}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={5}>
            <SectionHeader title="Puntos Top 5" subtitle="Distribución actual" />
            <Paper elevation={0} sx={{ p: 2.5, mb: 4, boxShadow: '0 2px 8px rgba(21,21,30,0.07)' }}>
              <Box sx={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
                    <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 11, fontFamily: '"Titillium Web"', fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#bbb', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <RechartTooltip
                      contentStyle={{ backgroundColor: '#15151E', border: 'none', borderRadius: 0, fontSize: 12 }}
                      labelStyle={{ color: '#fff', fontWeight: 700 }}
                      itemStyle={{ color: '#E10600' }}
                      cursor={{ fill: 'rgba(225,6,0,0.04)' }}
                    />
                    <Bar dataKey="points" radius={[2, 2, 0, 0]} maxBarSize={40}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <SectionHeader title="Constructores" />
            <Paper elevation={0} sx={{ boxShadow: '0 2px 8px rgba(21,21,30,0.07)', overflow: 'hidden' }}>
              <Box sx={{ backgroundColor: '#15151E', px: 2, py: 1.25 }}>
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Constructor · Puntos</Typography>
              </Box>
              {loadingC ? <LoadingSpinner size={24} /> : constructors?.slice(0, 5).map((t) => (
                <Box
                  key={t.nombre + t.posicion}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2, py: 1.25,
                    borderBottom: '1px solid rgba(21,21,30,0.05)',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#bbb', width: 24 }}>{t.posicion}</Typography>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#E10600', mr: 1.5, flexShrink: 0 }} />
                  <Typography sx={{ flex: 1, fontWeight: 700, fontSize: '0.8rem', color: '#15151E' }}>{t.nombre}</Typography>
                  <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '0.95rem', color: '#15151E' }}>{t.puntosTotales}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
