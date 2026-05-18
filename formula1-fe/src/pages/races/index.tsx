import { Box, Typography, Paper, Chip } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { useFetch } from '../../hooks/useFetch';
import { RacesService } from '../../services/api/racesService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSeason } from '../../context/SeasonContext';
import { useNavigate } from 'react-router-dom';
import { buildPath } from '../../routes/routePaths';
import { formatShortDate } from '../../utils/formatters';

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  FINALIZADO: { label: 'Completada', bg: 'rgba(0,165,80,0.1)', color: '#00A550' },
  PROGRAMADO: { label: 'Programada', bg: 'rgba(255,136,0,0.1)', color: '#FF8800' },
  EN_CURSO: { label: 'En curso', bg: 'rgba(225,6,0,0.1)', color: '#E10600' },
  CANCELADO: { label: 'Cancelada', bg: 'rgba(21,21,30,0.08)', color: '#999' },
};

export const RacesPage = () => {
  const { selectedYear } = useSeason();
  const navigate = useNavigate();
  const { data, loading } = useFetch(() => RacesService.getBySeason(selectedYear), [selectedYear]);
  const races = data?.content ?? [];

  return (
    <Box>
      <Box sx={{ backgroundColor: '#15151E', px: 4, py: 3 }}>
        <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '1.8rem', color: '#fff', textTransform: 'uppercase' }}>
          Calendario {selectedYear}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
          {races.length} Grandes Premios
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {loading ? <LoadingSpinner /> : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {races.map((race) => {
              const s = STATUS_STYLE[race.estado] ?? STATUS_STYLE.PROGRAMADO;
              return (
                <Paper
                  key={race.idEvento}
                  elevation={0}
                  onClick={() => navigate(buildPath.raceDetail(race.idEvento))}
                  sx={{
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(21,21,30,0.06)',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s, transform 0.15s',
                    '&:hover': { boxShadow: '0 6px 20px rgba(21,21,30,0.12)', transform: 'translateY(-1px)' },
                    display: 'flex',
                    alignItems: 'stretch',
                  }}
                >
                  {/* Round number */}
                  <Box
                    sx={{
                      width: 56,
                      backgroundColor: '#15151E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '1.3rem', color: 'rgba(255,255,255,0.6)' }}>
                      {race.numRonda}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: 160 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color: '#15151E', textTransform: 'uppercase', lineHeight: 1.2 }}>
                        {race.nombreOficial}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#999', mt: 0.25, display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <PlaceIcon sx={{ fontSize: 11 }} />{race.paisCircuito}
                      </Typography>
                    </Box>

                    {race.fechaInicio && (
                      <Typography sx={{ fontSize: '0.75rem', color: '#67676D', minWidth: 100 }}>
                        {formatShortDate(race.fechaInicio)}
                      </Typography>
                    )}

                    <Chip
                      label={s.label}
                      size="small"
                      sx={{ borderRadius: 0, fontSize: '0.6rem', fontWeight: 700, backgroundColor: s.bg, color: s.color, letterSpacing: '0.06em' }}
                    />
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};
