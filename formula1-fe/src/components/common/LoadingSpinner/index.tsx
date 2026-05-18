import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingSpinner = ({ message = 'Cargando...', size = 40 }: { message?: string; size?: number }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, gap: 2 }}>
    <CircularProgress size={size} sx={{ color: '#E10600' }} thickness={3} />
    <Typography sx={{ color: '#999', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      {message}
    </Typography>
  </Box>
);
