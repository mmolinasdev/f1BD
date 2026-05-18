import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { useFetch } from '../../hooks/useFetch';
import { SeasonsService } from '../../services/api/seasonsService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { buildPath } from '../../routes/routePaths';

const STATUS: Record<string, { label: string; color: string }> = {
  FINALIZADA: { label: 'Finalizada', color: '#67676D' },
  EN_CURSO: { label: 'En curso', color: '#00A550' },
  PLANIFICADA: { label: 'Planificada', color: '#FF8800' },
};

export const SeasonsPage = () => {
  const navigate = useNavigate();
  const { data: seasons, loading } = useFetch(() => SeasonsService.getAll(), []);

  return (
    <Box>
      <Box sx={{ backgroundColor: '#15151E', px: 4, py: 3 }}>
        <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '1.8rem', color: '#fff', textTransform: 'uppercase' }}>
          Temporadas
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {loading ? <LoadingSpinner /> : (
          <Grid container spacing={2} alignItems="stretch">
            {seasons?.map((s) => {
              const st = STATUS[s.estado] ?? { label: s.estado, color: '#67676D' };
              const isCurrent = s.estado === 'EN_CURSO';
              return (
                <Grid item xs={12} sm={6} md={3} key={s.idTemporada} sx={{ display: 'flex' }}>
                  <Paper
                    elevation={0}
                    onClick={() => navigate(buildPath.seasonDetail(s.anio))}
                    sx={{
                      cursor: 'pointer',
                      overflow: 'hidden',
                      width: '100%',
                      boxShadow: isCurrent ? '0 4px 16px rgba(225,6,0,0.15)' : '0 2px 8px rgba(21,21,30,0.07)',
                      border: isCurrent ? '1px solid rgba(225,6,0,0.2)' : '1px solid transparent',
                      transition: 'box-shadow 0.2s, transform 0.15s',
                      '&:hover': { boxShadow: '0 8px 24px rgba(21,21,30,0.13)', transform: 'translateY(-2px)' },
                    }}
                  >
                    <Box sx={{ height: 4, backgroundColor: isCurrent ? '#E10600' : '#15151E' }} />
                    <Box sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '2.5rem', color: '#15151E', lineHeight: 1 }}>
                          {s.anio}
                        </Typography>
                        <Chip
                          label={st.label}
                          size="small"
                          sx={{ borderRadius: 0, fontSize: '0.6rem', fontWeight: 700, color: st.color, backgroundColor: `${st.color}18`, letterSpacing: '0.06em' }}
                          slotProps={{ label: { style: { paddingLeft: 10, paddingRight: 10 } } }}
                        />
                      </Box>

                      <Typography sx={{ fontSize: '0.7rem', color: '#bbb', mb: 1.5 }}>
                        {s.numGps != null ? `${s.numGps} Grandes Premios` : 'Grandes Premios por confirmar'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
