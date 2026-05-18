import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Chip, Avatar, Card, CardContent, Divider,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CakeIcon from '@mui/icons-material/Cake';
import FlagIcon from '@mui/icons-material/Flag';
import BadgeIcon from '@mui/icons-material/Badge';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import GroupsIcon from '@mui/icons-material/Groups';
import { useFetch } from '../../hooks/useFetch';
import { DriversService } from '../../services/api/driversService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { NATIONALITY_FLAGS, TEAM_COLORS, DRIVER_PHOTOS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { buildPath } from '../../routes/routePaths';

const getTeamColor = (teamName: string | null): string => {
  if (!teamName) return '#E10600';
  return TEAM_COLORS[teamName] ?? '#E10600';
};

const getStatusColor = (estado: string) => {
  if (estado === 'ACTIVO') return '#4caf50';
  if (estado === 'RETIRADO') return '#ff9800';
  return '#9e9e9e';
};

const getStatusLabel = (estado: string) => {
  if (estado === 'ACTIVO') return 'Activo';
  if (estado === 'RETIRADO') return 'Retirado';
  if (estado === 'SUSPENDIDO') return 'Suspendido';
  return estado;
};

export const DriverDetailPage = () => {
  const { tipoDoc, numDoc } = useParams<{ tipoDoc: string; numDoc: string }>();
  const navigate = useNavigate();
  const [photoError, setPhotoError] = useState(false);

  const { data: driver, loading } = useFetch(
    () => DriversService.getById(tipoDoc!, numDoc!),
    [tipoDoc, numDoc]
  );

  if (loading) return <LoadingSpinner />;
  if (!driver) return null;

  const teamColor = getTeamColor(driver.escuderiaActual);
  const photoUrl = driver.urlFoto ?? DRIVER_PHOTOS[driver.alias] ?? null;
  const flag = NATIONALITY_FLAGS[driver.nacionalidad] ?? '';

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Hero ── */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 3,
          minHeight: 220,
          background: `linear-gradient(135deg, ${teamColor}33 0%, #111 60%)`,
          border: `1px solid ${teamColor}55`,
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, md: 4 },
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        {/* Background driver number */}
        {driver.numParrillaPermanente && (
          <Typography
            sx={{
              position: 'absolute',
              right: { xs: -10, md: 20 },
              bottom: -20,
              fontFamily: '"Racing Sans One", sans-serif',
              fontSize: { xs: '10rem', md: '14rem' },
              fontWeight: 900,
              color: `${teamColor}18`,
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {driver.numParrillaPermanente}
          </Typography>
        )}

        {/* Photo or avatar */}
        {photoUrl && !photoError ? (
          <Box
            component="img"
            src={photoUrl}
            alt={`${driver.nombre} ${driver.apellidos}`}
            onError={() => setPhotoError(true)}
            sx={{
              height: { xs: 120, md: 180 },
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))',
              flexShrink: 0,
              zIndex: 1,
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: { xs: 90, md: 120 },
              height: { xs: 90, md: 120 },
              backgroundColor: teamColor,
              fontSize: { xs: '2rem', md: '2.8rem' },
              fontWeight: 700,
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            {driver.nombre[0]}{driver.apellidos[0]}
          </Avatar>
        )}

        {/* Name & badges */}
        <Box sx={{ zIndex: 1, flex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Racing Sans One", sans-serif',
              color: teamColor,
              lineHeight: 1,
              fontSize: { xs: '2.5rem', md: '4rem' },
            }}
          >
            {driver.alias}
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mt: 0.5, fontSize: { xs: '1.1rem', md: '1.5rem' } }}
          >
            {driver.nombre} {driver.apellidos.toUpperCase()}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={`${flag} ${driver.nacionalidad}`}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}
            />
            {driver.escuderiaActual && driver.escuderiaId && (
              <Chip
                label={driver.escuderiaActual}
                size="small"
                onClick={() => navigate(buildPath.teamDetail(driver.escuderiaId!))}
                sx={{
                  backgroundColor: `${teamColor}33`, color: teamColor, fontWeight: 700,
                  border: `1px solid ${teamColor}66`, cursor: 'pointer',
                  '&:hover': { backgroundColor: `${teamColor}55` },
                }}
              />
            )}
            <Chip
              label={getStatusLabel(driver.estado)}
              size="small"
              sx={{
                backgroundColor: `${getStatusColor(driver.estado)}22`,
                color: getStatusColor(driver.estado),
                fontWeight: 700,
                border: `1px solid ${getStatusColor(driver.estado)}55`,
              }}
            />
          </Box>
        </Box>

        {/* Driver number badge */}
        {driver.numParrillaPermanente && (
          <Box
            sx={{
              zIndex: 1,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 90,
              height: 90,
              borderRadius: 2,
              border: `3px solid ${teamColor}`,
              backgroundColor: `${teamColor}22`,
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: '0.6rem', color: teamColor, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              Nº
            </Typography>
            <Typography sx={{ fontFamily: '"Racing Sans One", sans-serif', fontSize: '2.5rem', color: teamColor, lineHeight: 1 }}>
              {driver.numParrillaPermanente}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Info cards ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>

        {/* Personal */}
        <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <CardContent>
            <Typography variant="overline" sx={{ color: teamColor, fontWeight: 700, letterSpacing: 2 }}>
              Información Personal
            </Typography>
            <Divider sx={{ borderColor: `${teamColor}33`, my: 1.5 }} />

            <InfoRow icon={<CakeIcon fontSize="small" />} label="Fecha de nacimiento"
              value={driver.fechaNacimiento ? formatDate(driver.fechaNacimiento) : '—'} />
            <InfoRow icon={<FlagIcon fontSize="small" />} label="Nacionalidad"
              value={`${flag} ${driver.nacionalidad}`} />
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="Documento"
              value={`${driver.tipoDocumento}: ${driver.numDocumento}`} />
          </CardContent>
        </Card>

        {/* Carrera */}
        <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <CardContent>
            <Typography variant="overline" sx={{ color: teamColor, fontWeight: 700, letterSpacing: 2 }}>
              Carrera Profesional
            </Typography>
            <Divider sx={{ borderColor: `${teamColor}33`, my: 1.5 }} />

            <InfoRow icon={<SportsMotorsportsIcon fontSize="small" />} label="Alias / Código"
              value={driver.alias} />
            {driver.numParrillaPermanente && (
              <InfoRow icon={<SportsMotorsportsIcon fontSize="small" />} label="Número permanente"
                value={`#${driver.numParrillaPermanente}`} />
            )}
            {driver.escuderiaActual && (
              <InfoRow icon={<GroupsIcon fontSize="small" />} label="Escudería actual"
                value={driver.escuderiaActual} color={teamColor}
                onClick={driver.escuderiaId ? () => navigate(buildPath.teamDetail(driver.escuderiaId!)) : undefined} />
            )}
            <InfoRow icon={<FlagIcon fontSize="small" />} label="Estado"
              value={getStatusLabel(driver.estado)} color={getStatusColor(driver.estado)} />
            {driver.estado === 'RETIRADO' && driver.temporadaRetiro && (
              <InfoRow icon={<FlagIcon fontSize="small" />} label="Temporada de retiro"
                value={String(driver.temporadaRetiro)}
                onClick={() => navigate(buildPath.seasonDetail(driver.temporadaRetiro!))} />
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

function InfoRow({
  icon, label, value, color, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
  onClick?: () => void;
}) {
  const isLink = !!onClick;
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1,
        borderBottom: '1px solid #2a2a2a',
        cursor: isLink ? 'pointer' : 'default',
        borderRadius: 1,
        px: isLink ? 0.5 : 0,
        mx: isLink ? -0.5 : 0,
        '&:hover': isLink ? { backgroundColor: 'rgba(255,255,255,0.04)' } : {},
      }}
    >
      <Box sx={{ color: 'rgba(255,255,255,0.35)', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', display: 'block', lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: isLink ? (color ?? '#4fc3f7') : (color ?? '#fff'),
            display: 'flex', alignItems: 'center', gap: 0.5,
            textDecoration: isLink ? 'underline' : 'none',
            textUnderlineOffset: 3,
          }}
        >
          {value}
          {isLink && <OpenInNewIcon sx={{ fontSize: '0.75rem', opacity: 0.7 }} />}
        </Typography>
      </Box>
    </Box>
  );
}
