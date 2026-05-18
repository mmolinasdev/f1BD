import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 2, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ width: 6, height: 80, backgroundColor: '#E10600' }} />
        <Typography sx={{ fontFamily: '"Titillium Web"', fontWeight: 900, fontSize: '6rem', color: '#15151E', lineHeight: 1 }}>
          404
        </Typography>
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#15151E' }}>
        Página no encontrada
      </Typography>
      <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>Esta página no existe en el circuito</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mt: 2, borderRadius: 0, px: 4 }}>
        Volver al Dashboard
      </Button>
    </Box>
  );
};
