import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export const EmptyState = ({ title, description, icon }: EmptyStateProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
      gap: 1.5,
      opacity: 0.5,
    }}
  >
    {icon && <Box sx={{ color: '#555', '& svg': { fontSize: 56 } }}>{icon}</Box>}
    <Typography variant="h6" sx={{ color: '#888', fontWeight: 700 }}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
        {description}
      </Typography>
    )}
  </Box>
);
