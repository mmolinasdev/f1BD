import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Chip, Avatar, Card, CardContent, Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlagIcon from '@mui/icons-material/Flag';
import GroupsIcon from '@mui/icons-material/Groups';
import { useFetch } from '../../hooks/useFetch';
import { TeamsService } from '../../services/api/teamsService';
import { useSeason } from '../../context/SeasonContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { NATIONALITY_FLAGS, TEAM_COLORS, DRIVER_PHOTOS } from '../../utils/constants';
import { buildPath } from '../../routes/routePaths';

const getTeamColor = (team: { nombreOficial: string; codigo: string }): string =>
  TEAM_COLORS[team.nombreOficial] ?? TEAM_COLORS[team.codigo] ?? '#E10600';

export const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const teamId = Number(id);
  const { selectedYear } = useSeason();

  const { data: team, loading: loadingTeam } = useFetch(
    () => TeamsService.getById(teamId), [teamId]
  );

  const { data: teamDrivers, loading: loadingDrivers } = useFetch(
    () => TeamsService.getPilotos(teamId, selectedYear), [teamId, selectedYear]
  );

  if (loadingTeam) return <LoadingSpinner />;
  if (!team) return null;

  const teamColor = getTeamColor(team);
  const flag = NATIONALITY_FLAGS[team.nacionalidad] ?? '';
  const drivers = teamDrivers ?? [];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Hero ── */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 3,
          background: `linear-gradient(135deg, ${teamColor}55 0%, #0d0d0d 60%)`,
          border: `1px solid ${teamColor}99`,
          borderLeft: `5px solid ${teamColor}`,
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, md: 4 },
          px: { xs: 2, md: 4 },
          py: 4,
        }}
      >
        {/* Background code watermark */}
        <Typography
          sx={{
            position: 'absolute',
            right: { xs: -10, md: 20 },
            bottom: -10,
            fontFamily: '"Racing Sans One", sans-serif',
            fontSize: { xs: '6rem', md: '10rem' },
            fontWeight: 900,
            color: `${teamColor}28`,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {team.codigo}
        </Typography>

        {/* Code badge */}
        <Box
          sx={{
            width: { xs: 70, md: 100 },
            height: { xs: 70, md: 100 },
            backgroundColor: teamColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <Typography sx={{
            fontFamily: '"Racing Sans One", sans-serif',
            fontSize: { xs: '1.1rem', md: '1.6rem' },
            fontWeight: 900,
            color: '#fff',
            letterSpacing: 1,
          }}>
            {team.codigo}
          </Typography>
        </Box>

        {/* Name & chips */}
        <Box sx={{ zIndex: 1, flex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Racing Sans One", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '1.6rem', md: '2.8rem' },
              lineHeight: 1.1,
              textTransform: 'uppercase',
              color: teamColor,
            }}
          >
            {team.nombreOficial}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={`${flag} ${team.nacionalidad}`}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}
            />
            {team.ciudadSede && (
              <Chip
                label={`📍 ${team.ciudadSede}`}
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.08)', fontWeight: 600 }}
              />
            )}
            <Chip
              label={team.estado === 'ACTIVO' ? 'Activo' : team.estado}
              size="small"
              sx={{
                backgroundColor: team.estado === 'ACTIVO' ? '#4caf5022' : '#9e9e9e22',
                color: team.estado === 'ACTIVO' ? '#4caf50' : '#9e9e9e',
                border: `1px solid ${team.estado === 'ACTIVO' ? '#4caf5055' : '#9e9e9e55'}`,
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ── Two-column layout ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 2, alignItems: 'start' }}>

        {/* Info card */}
        <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderLeft: `3px solid ${teamColor}` }}>
          <CardContent>
            <Typography variant="overline" sx={{ color: teamColor, fontWeight: 700, letterSpacing: 2 }}>
              Información
            </Typography>
            <Divider sx={{ borderColor: `${teamColor}33`, my: 1.5 }} />

            <InfoRow icon={<FlagIcon fontSize="small" />} label="Nacionalidad"
              value={`${flag} ${team.nacionalidad}`} />
            {team.paisSede && (
              <InfoRow icon={<LocationOnIcon fontSize="small" />} label="País sede"
                value={team.paisSede} />
            )}
            {team.ciudadSede && (
              <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Ciudad sede"
                value={team.ciudadSede} />
            )}
            <InfoRow icon={<GroupsIcon fontSize="small" />} label="Pilotos activos"
              value={String(drivers.length)} />
          </CardContent>
        </Card>

        {/* Drivers section */}
        <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderLeft: `3px solid ${teamColor}` }}>
          <CardContent>
            <Typography variant="overline" sx={{ color: teamColor, fontWeight: 700, letterSpacing: 2 }}>
              Pilotos
            </Typography>
            <Divider sx={{ borderColor: `${teamColor}33`, my: 1.5 }} />

            {loadingDrivers ? (
              <LoadingSpinner />
            ) : drivers.length === 0 ? (
              <Typography sx={{ color: '#555', fontSize: '0.85rem', py: 2 }}>
                Sin pilotos registrados para este equipo.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {drivers.map((driver) => {
                  const photoUrl = driver.urlFoto ?? DRIVER_PHOTOS[driver.alias] ?? null;
                  return (
                    <Box
                      key={`${driver.tipoDocumento}-${driver.numDocumento}`}
                      onClick={() => navigate(buildPath.driverDetail(driver.tipoDocumento, driver.numDocumento))}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: '1px solid #2a2a2a',
                        transition: 'all 0.15s',
                        '&:hover': {
                          backgroundColor: `${teamColor}11`,
                          borderColor: `${teamColor}55`,
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      {/* Number */}
                      {driver.numParrillaPermanente && (
                        <Typography sx={{
                          fontFamily: '"Racing Sans One", sans-serif',
                          fontSize: '1.4rem',
                          color: teamColor,
                          minWidth: 36,
                          textAlign: 'center',
                          lineHeight: 1,
                        }}>
                          {driver.numParrillaPermanente}
                        </Typography>
                      )}

                      {/* Photo or avatar */}
                      {photoUrl ? (
                        <Box
                          component="img"
                          src={photoUrl}
                          alt={driver.alias}
                          sx={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <Avatar sx={{ width: 48, height: 48, backgroundColor: teamColor, fontSize: '0.85rem', fontWeight: 700 }}>
                          {driver.nombre[0]}{driver.apellidos[0]}
                        </Avatar>
                      )}

                      {/* Name */}
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2, color: '#fff' }}>
                          {driver.nombre} {driver.apellidos.toUpperCase()}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', mt: 0.2 }}>
                          {NATIONALITY_FLAGS[driver.nacionalidad] ?? ''} {driver.nacionalidad}
                        </Typography>
                      </Box>

                      {/* Alias badge */}
                      <Chip
                        label={driver.alias}
                        size="small"
                        sx={{
                          fontFamily: '"Racing Sans One", sans-serif',
                          backgroundColor: `${teamColor}22`,
                          color: teamColor,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />

                      <Box component="span" sx={{ color: '#444', fontSize: '1rem' }}>›</Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1, borderBottom: '1px solid #2a2a2a' }}>
      <Box sx={{ color: 'rgba(255,255,255,0.3)', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{value}</Typography>
      </Box>
    </Box>
  );
}
