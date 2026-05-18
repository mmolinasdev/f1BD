import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Speed';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import BarChartIcon from '@mui/icons-material/BarChart';
import CompareIcon from '@mui/icons-material/CompareArrows';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const DRAWER_WIDTH = 200;
const DRAWER_WIDTH_COLLAPSED = 56;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/' },
  { label: 'Pilotos', icon: <PersonIcon fontSize="small" />, path: '/drivers' },
  { label: 'Equipos', icon: <GroupsIcon fontSize="small" />, path: '/teams' },
  { label: 'Circuitos', icon: <PlaceIcon fontSize="small" />, path: '/circuits' },
  { label: 'Temporadas', icon: <CalendarIcon fontSize="small" />, path: '/seasons' },
  { label: 'Grandes Premios', icon: <FlagIcon fontSize="small" />, path: '/races' },
];

const secondaryItems = [
  { label: 'Estadísticas', icon: <BarChartIcon fontSize="small" />, path: '/statistics' },
  { label: 'Head-to-Head', icon: <CompareIcon fontSize="small" />, path: '/head-to-head' },
];

const adminItems = [
  { label: 'Pilotos', icon: <PersonIcon fontSize="small" />, path: '/admin/pilotos' },
  { label: 'Equipos', icon: <GroupsIcon fontSize="small" />, path: '/admin/escuderias' },
  { label: 'Circuitos', icon: <PlaceIcon fontSize="small" />, path: '/admin/circuitos' },
  { label: 'Temporadas', icon: <CalendarIcon fontSize="small" />, path: '/admin/temporadas' },
  { label: 'GPs', icon: <DirectionsCarIcon fontSize="small" />, path: '/admin/gps' },
  { label: 'Sesiones', icon: <EventIcon fontSize="small" />, path: '/admin/sesiones' },
  { label: 'Res. Carrera', icon: <EmojiEventsIcon fontSize="small" />, path: '/admin/resultados/carrera' },
  { label: 'Res. Clasificación', icon: <LeaderboardIcon fontSize="small" />, path: '/admin/resultados/clasificacion' },
  { label: 'Contratos', icon: <HandshakeIcon fontSize="small" />, path: '/admin/contratos' },

];

interface SidebarProps {
  open: boolean;
  variant: 'permanent' | 'temporary';
  onClose: () => void;
}

export const Sidebar = ({ open, variant, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';
  const isOnAdminRoute = location.pathname.startsWith('/admin');

  const handleNav = (path: string) => {
    navigate(path);
    if (variant === 'temporary') onClose();
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const NavItem = ({ item }: { item: (typeof navItems)[0] }) => {
    const active = isActive(item.path);
    return (
      <Tooltip title={!open ? item.label : ''} placement="right">
        <ListItemButton
          onClick={() => handleNav(item.path)}
          sx={{
            minHeight: 40,
            px: open ? 2 : 1.5,
            justifyContent: open ? 'flex-start' : 'center',
            position: 'relative',
            borderLeft: active ? '3px solid #E10600' : '3px solid transparent',
            backgroundColor: active ? 'rgba(225,6,0,0.12)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.06)',
            },
            transition: 'background-color 0.15s ease',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: open ? 32 : 'auto',
              color: active ? '#E10600' : 'rgba(255,255,255,0.45)',
            }}
          >
            {item.icon}
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.78rem',
                fontWeight: active ? 700 : 400,
                fontFamily: '"Titillium Web", sans-serif',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    );
  };

  const AdminNavItem = ({ item }: { item: (typeof adminItems)[0] }) => {
    const active = isActive(item.path);
    return (
      <Tooltip title={!open ? item.label : ''} placement="right">
        <ListItemButton
          onClick={() => handleNav(item.path)}
          sx={{
            minHeight: 34,
            px: open ? 2.5 : 1.5,
            justifyContent: open ? 'flex-start' : 'center',
            borderLeft: active ? '3px solid #E10600' : '3px solid transparent',
            backgroundColor: active ? 'rgba(225,6,0,0.12)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 28 : 'auto', color: active ? '#E10600' : 'rgba(255,255,255,0.35)' }}>
            {item.icon}
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.72rem',
                fontWeight: active ? 700 : 400,
                fontFamily: '"Titillium Web", sans-serif',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                whiteSpace: 'nowrap',
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List sx={{ pt: 1, pb: 0 }}>
        {navItems.map((item) => <NavItem key={item.path} item={item} />)}
      </List>

      {open && (
        <Typography
          variant="caption"
          sx={{
            px: 2.5, pt: 2.5, pb: 0.75,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: '0.6rem',
            fontWeight: 700,
          }}
        >
          Analítica
        </Typography>
      )}

      <List sx={{ pb: 0 }}>
        {secondaryItems.map((item) => <NavItem key={item.path} item={item} />)}
      </List>

      {isAdmin && (
        <>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.07)', mx: 1, mt: 1, mb: 0.5 }} />
          {open ? (
            <Typography
              variant="caption"
              sx={{
                px: 2.5, pt: 1, pb: 0.75,
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: '0.75rem', opacity: 0.4 }} />
              Gestión
            </Typography>
          ) : (
            <Tooltip title="Gestión" placement="right">
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
                <AdminPanelSettingsIcon sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.25)' }} />
              </Box>
            </Tooltip>
          )}
          <List sx={{ pb: 0, pt: 0 }}>
            {adminItems.map((item) => <AdminNavItem key={item.path} item={item} />)}
          </List>
        </>
      )}

    </Box>
  );

  const width = open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED;

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          overflowX: 'hidden',
          transition: 'width 0.2s ease',
          boxSizing: 'border-box',
          backgroundColor: '#15151E',
          border: 'none',
          top: '56px',          // empieza justo debajo del navbar
          height: 'calc(100% - 56px)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
