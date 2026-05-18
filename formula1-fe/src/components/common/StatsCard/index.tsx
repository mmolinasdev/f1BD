import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accentColor?: string;
}

export const StatsCard = ({ title, value, subtitle, icon, accentColor = '#E10600' }: StatsCardProps) => (
  <Box
    sx={{
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(21,21,30,0.07)',
      p: 2.5,
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s ease',
      '&:hover': { boxShadow: '0 6px 20px rgba(21,21,30,0.12)' },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: accentColor,
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography
          sx={{
            color: '#67676D',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.6rem',
            fontWeight: 700,
            mb: 0.75,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Titillium Web", sans-serif',
            fontWeight: 900,
            fontSize: '2rem',
            color: '#15151E',
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: '0.75rem', color: '#999', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {icon && (
        <Box sx={{ color: accentColor, opacity: 0.15, '& svg': { fontSize: 44 } }}>
          {icon}
        </Box>
      )}
    </Box>
  </Box>
);
