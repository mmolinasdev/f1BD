import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Divider, Chip, Card, CardContent } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import SpeedIcon from '@mui/icons-material/Speed';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import RouteIcon from '@mui/icons-material/Route';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useFetch } from '../../hooks/useFetch';
import { CircuitsService } from '../../services/api/circuitsService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCircuitLength } from '../../utils/formatters';
import { CIRCUIT_DATA } from '../../utils/constants';

export const CircuitDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [heroError, setHeroError] = useState(false);
  const [mapaError, setMapaError] = useState(false);

  const { data: circuit, loading } = useFetch(() => CircuitsService.getById(Number(id)), [id]);

  if (loading) return <LoadingSpinner />;
  if (!circuit) return null;

  const info = CIRCUIT_DATA[circuit.nombreOficial] ?? null;

  const sentidoLabel =
    circuit.sentido === 'HORARIO' ? 'Horario' :
    circuit.sentido === 'ANTIHORARIO' ? 'Antihorario' :
    circuit.sentido ?? '—';

  const tipoLabel =
    circuit.tipoCircuito === 'PERMANENTE' ? 'Permanente' :
    circuit.tipoCircuito === 'CALLEJERO' ? 'Callejero' :
    circuit.tipoCircuito === 'MIXTO' ? 'Mixto' :
    circuit.tipoCircuito ?? '—';

  const heroUrl = info && !heroError ? info.fotoUrl : 'https://picsum.photos/seed/circuit-track/1200/500';

  return (
    <Box>
      {/* ── Hero banner ── */}
      <Box sx={{ width: '100%', height: { xs: 220, md: 360 }, position: 'relative', overflow: 'hidden', backgroundColor: '#15151E' }}>
        <Box
          component="img"
          src={heroUrl}
          alt={circuit.nombreOficial}
          onError={() => setHeroError(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', opacity: 0.75 }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(21,21,30,0.95) 0%, rgba(21,21,30,0.2) 60%)' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <PlaceIcon sx={{ color: '#E10600', fontSize: 18 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {circuit.ciudad ? `${circuit.ciudad}, ` : ''}{circuit.pais}
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: { xs: '1.6rem', md: '2.4rem' }, color: '#fff', textTransform: 'uppercase', lineHeight: 1.1 }}>
            {circuit.nombreOficial}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            {circuit.tipoCircuito && (
              <Chip label={tipoLabel} size="small" sx={{ backgroundColor: '#E1060033', color: '#E10600', border: '1px solid #E1060066', fontWeight: 700 }} />
            )}
            {circuit.sentido && (
              <Chip label={sentidoLabel} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 600 }} />
            )}
            {info && (
              <Chip label={`Desde ${info.primerGP}`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} />
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Content ── */}
      <Box sx={{ p: { xs: 2, md: 4 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 340px' }, gap: 3, alignItems: 'start' }}>

        {/* Left: description + map */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Description — viene de la BD (circuit.descripcion), fallback a constants */}
          {(circuit.descripcion || info?.descripcion) && (
            <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderLeft: '3px solid #E10600' }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: '#E10600', fontWeight: 700, letterSpacing: 2 }}>
                  Sobre el circuito
                </Typography>
                <Divider sx={{ borderColor: '#E1060033', my: 1.5 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  {circuit.descripcion ?? info?.descripcion}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Circuit map / layout */}
          {info && !mapaError && (
            <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderLeft: '3px solid #E10600' }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: '#E10600', fontWeight: 700, letterSpacing: 2 }}>
                  Trazado del circuito
                </Typography>
                <Divider sx={{ borderColor: '#E1060033', my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, borderRadius: 2, backgroundColor: '#0a0a0a' }}>
                  <Box
                    component="img"
                    src={info.mapaUrl}
                    alt={`Trazado ${circuit.nombreOficial}`}
                    onError={() => setMapaError(true)}
                    sx={{ maxWidth: '100%', maxHeight: 340, objectFit: 'contain' }}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Right: stats card */}
        <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderLeft: '3px solid #E10600' }}>
          <CardContent>
            <Typography variant="overline" sx={{ color: '#E10600', fontWeight: 700, letterSpacing: 2 }}>
              Características
            </Typography>
            <Divider sx={{ borderColor: '#E1060033', my: 1.5 }} />

            <StatRow icon={<PlaceIcon fontSize="small" />} label="País" value={circuit.pais} />
            <StatRow icon={<PlaceIcon fontSize="small" />} label="Ciudad" value={circuit.ciudad ?? '—'} />
            {circuit.longitudKm != null && (
              <StatRow icon={<SpeedIcon fontSize="small" />} label="Longitud"
                value={formatCircuitLength(circuit.longitudKm)} highlight />
            )}
            {circuit.numCurvas != null && (
              <StatRow icon={<TurnRightIcon fontSize="small" />} label="Número de curvas"
                value={String(circuit.numCurvas)} highlight />
            )}
            <StatRow icon={<RouteIcon fontSize="small" />} label="Sentido" value={sentidoLabel} />
            <StatRow icon={<RouteIcon fontSize="small" />} label="Tipo" value={tipoLabel} />
            {info && (
              <>
                <StatRow icon={<EmojiEventsIcon fontSize="small" />} label="Primer GP" value={String(info.primerGP)} />
                <StatRow icon={<RouteIcon fontSize="small" />} label="Vueltas de carrera" value={String(info.vueltas)} />
                {info.recordVuelta && (
                  <StatRow icon={<EmojiEventsIcon fontSize="small" />} label="Récord de vuelta" value={info.recordVuelta} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

function StatRow({
  icon, label, value, highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1, borderBottom: '1px solid #2a2a2a' }}>
      <Box sx={{ color: 'rgba(255,255,255,0.3)', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: highlight ? '#E10600' : '#fff' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
