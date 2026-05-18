import { Box, Typography, Grid, Paper, Avatar } from '@mui/material';
import { useFetch } from '../../hooks/useFetch';
import { TeamsService } from '../../services/api/teamsService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useSeason } from '../../context/SeasonContext';
import { buildPath } from '../../routes/routePaths';

export const TeamsPage = () => {
  const navigate = useNavigate();
  const { selectedYear } = useSeason();
  const { data, loading } = useFetch(() => TeamsService.getAll(0, 20, selectedYear), [selectedYear]);
  const teams = data?.content ?? [];

  return (
    <Box>
      <Box sx={{ backgroundColor: '#15151E', px: 4, py: 3 }}>
        <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '1.8rem', color: '#fff', textTransform: 'uppercase' }}>
          Equipos
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
          {teams.length} constructores
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {loading ? <LoadingSpinner /> : (
          <Grid container spacing={2}>
            {teams.map((team) => (
              <Grid item xs={12} sm={6} md={4} key={team.idEquipo}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(buildPath.teamDetail(team.idEquipo))}
                  sx={{
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(21,21,30,0.07)',
                    transition: 'box-shadow 0.2s, transform 0.15s',
                    '&:hover': { boxShadow: '0 8px 24px rgba(21,21,30,0.13)', transform: 'translateY(-2px)' },
                  }}
                >
                  <Box sx={{ height: 4, background: 'linear-gradient(90deg, #E10600, transparent)' }} />
                  <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#E10600',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        letterSpacing: '0.05em',
                        color: '#fff',
                        borderRadius: 0,
                      }}
                    >
                      {team.codigo}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', color: '#15151E', textTransform: 'uppercase', lineHeight: 1.3 }}>
                        {team.nombreOficial}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#999', mt: 0.25 }}>
                        {team.nacionalidad}
                      </Typography>
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
