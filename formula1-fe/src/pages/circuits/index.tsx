import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { useFetch } from '../../hooks/useFetch';
import { CircuitsService } from '../../services/api/circuitsService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSeason } from '../../context/SeasonContext';
import { useNavigate } from 'react-router-dom';
import { buildPath } from '../../routes/routePaths';
import { formatCircuitLength } from '../../utils/formatters';

const TYPE_COLOR: Record<string, string> = { PERMANENTE: '#15151E', CALLEJERO: '#E10600', MIXTO: '#FF8800' };
const TYPE_LABEL: Record<string, string> = { PERMANENTE: 'Permanente', CALLEJERO: 'Callejero', MIXTO: 'Mixto' };

export const CircuitsPage = () => {
  const navigate = useNavigate();
  const { selectedYear } = useSeason();
  const { data, loading } = useFetch(() => CircuitsService.getAll(0, 30, selectedYear), [selectedYear]);
  const circuits = data?.content ?? [];

  return (
    <Box>
      <Box sx={{ backgroundColor: '#15151E', px: 4, py: 3 }}>
        <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '1.8rem', color: '#fff', textTransform: 'uppercase' }}>
          Circuitos
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
          {circuits.length} circuitos
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {loading ? <LoadingSpinner /> : (
          <Grid container spacing={2}>
            {circuits.map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c.idCircuito}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(buildPath.circuitDetail(c.idCircuito))}
                  sx={{
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(21,21,30,0.07)',
                    transition: 'box-shadow 0.2s, transform 0.15s',
                    '&:hover': { boxShadow: '0 8px 24px rgba(21,21,30,0.13)', transform: 'translateY(-2px)' },
                  }}
                >
                  <Box sx={{ height: 4, backgroundColor: TYPE_COLOR[c.tipoCircuito ?? ''] ?? '#15151E' }} />
                  <Box sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ flex: 1, pr: 1 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', color: '#15151E', textTransform: 'uppercase', lineHeight: 1.3 }}>
                          {c.nombreOficial}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#999', mt: 0.25, display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <PlaceIcon sx={{ fontSize: 11 }} />{c.ciudad ? `${c.ciudad}, ` : ''}{c.pais}
                        </Typography>
                      </Box>
                      {c.tipoCircuito && (
                        <Chip
                          label={TYPE_LABEL[c.tipoCircuito] ?? c.tipoCircuito}
                          size="small"
                          sx={{ borderRadius: 0, fontSize: '0.6rem', fontWeight: 700, backgroundColor: `${TYPE_COLOR[c.tipoCircuito] ?? '#15151E'}18`, color: TYPE_COLOR[c.tipoCircuito] ?? '#15151E', flexShrink: 0 }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
                      {[
                        { label: 'Longitud', value: c.longitudKm != null ? formatCircuitLength(c.longitudKm) : '—' },
                        { label: 'Curvas', value: c.numCurvas ?? '—' },
                      ].map((row) => (
                        <Box key={row.label}>
                          <Typography sx={{ fontSize: '0.6rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{row.label}</Typography>
                          <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color: '#15151E' }}>{row.value}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
