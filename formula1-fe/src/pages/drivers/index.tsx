import { useState } from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Chip, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useFetch } from '../../hooks/useFetch';
import { DriversService } from '../../services/api/driversService';
import { useSeason } from '../../context/SeasonContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { buildPath } from '../../routes/routePaths';
import { NATIONALITY_FLAGS } from '../../utils/constants';

export const DriversPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'retired'>('active');
  const navigate = useNavigate();
  const { selectedYear } = useSeason();
  const { data, loading } = useFetch(() => DriversService.getAll(0, 50, search, selectedYear), [search, selectedYear]);

  const drivers = (data?.content ?? []).filter((d) => {
    if (filter === 'active') return d.estado === 'ACTIVO';
    if (filter === 'retired') return d.estado === 'RETIRADO';
    return true;
  });

  return (
    <Box>
      {/* Header bar */}
      <Box sx={{ backgroundColor: '#15151E', px: 4, py: 3 }}>
        <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '1.8rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Pilotos
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>
          {drivers.length} pilotos encontrados
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar piloto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              width: 260,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                backgroundColor: '#fff',
                '&:hover fieldset': { borderColor: '#E10600' },
                '&.Mui-focused fieldset': { borderColor: '#E10600' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#bbb', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['all', 'active', 'retired'] as const).map((f) => (
              <Chip
                key={f}
                label={f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Retirados'}
                onClick={() => setFilter(f)}
                sx={{
                  borderRadius: 0,
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  backgroundColor: filter === f ? '#E10600' : '#fff',
                  color: filter === f ? '#fff' : '#67676D',
                  border: `1px solid ${filter === f ? '#E10600' : 'rgba(21,21,30,0.12)'}`,
                  '&:hover': { backgroundColor: filter === f ? '#A80400' : 'rgba(21,21,30,0.04)' },
                }}
              />
            ))}
          </Box>
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {drivers.map((driver) => (
              <Paper
                key={driver.tipoDocumento + driver.numDocumento}
                elevation={0}
                onClick={() => navigate(buildPath.driverDetail(driver.tipoDocumento, driver.numDocumento))}
                sx={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(21,21,30,0.07)',
                  transition: 'box-shadow 0.2s, transform 0.15s',
                  '&:hover': { boxShadow: '0 8px 24px rgba(21,21,30,0.13)', transform: 'translateY(-2px)' },
                }}
              >
                  {/* Color accent bar */}
                  <Box sx={{ height: 4, backgroundColor: '#E10600' }} />

                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"Titillium Web"',
                            fontWeight: 900,
                            fontSize: '1.6rem',
                            color: '#E10600',
                            lineHeight: 1,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {driver.alias}
                        </Typography>
                        {driver.numParrillaPermanente && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#bbb', fontWeight: 700, letterSpacing: '0.05em' }}>
                            #{driver.numParrillaPermanente}
                          </Typography>
                        )}
                      </Box>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          backgroundColor: '#E10600',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          color: '#fff',
                        }}
                      >
                        {driver.nombre[0]}{driver.apellidos[0]}
                      </Avatar>
                    </Box>

                    <Typography sx={{ fontWeight: 400, fontSize: '0.8rem', color: '#67676D', lineHeight: 1.2 }}>
                      {driver.nombre}
                    </Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#15151E', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                      {driver.apellidos}
                    </Typography>

                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(21,21,30,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#999' }}>
                        {NATIONALITY_FLAGS[driver.nacionalidad] ?? ''} {driver.nacionalidad}
                      </Typography>
                      {driver.escuderiaActual && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#E10600', fontWeight: 700, textAlign: 'right', maxWidth: 80, lineHeight: 1.2 }}>
                          {driver.escuderiaActual.split(' ').slice(-1)[0]}
                        </Typography>
                      )}
                    </Box>
                  </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
