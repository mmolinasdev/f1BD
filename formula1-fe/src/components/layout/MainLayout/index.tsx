import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';

export const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Navbar onMenuToggle={() => isMobile ? setMobileOpen(v => !v) : setSidebarOpen(v => !v)} />

      {/* El Drawer permanente vive dentro del flex container y ya empuja al main */}
      {isMobile ? (
        <Sidebar open={mobileOpen} variant="temporary" onClose={() => setMobileOpen(false)} />
      ) : (
        <Sidebar open={sidebarOpen} variant="permanent" onClose={() => {}} />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '56px',
          minHeight: 'calc(100vh - 56px)',
          overflow: 'auto',
          backgroundColor: '#F5F5F5',
          // Sin ml — el Drawer permanente ya ocupa su espacio en el flex flow
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
