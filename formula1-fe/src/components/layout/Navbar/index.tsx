import {
  AppBar, Toolbar, Box, Select, MenuItem,
  FormControl, IconButton, Tooltip, useMediaQuery, useTheme, Typography, Avatar, Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useSeason } from '../../../context/SeasonContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const { selectedYear, setSelectedYear, availableYears } = useSeason();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const seasonMatch = location.pathname.match(/^\/seasons\/\d+/);
    if (seasonMatch) navigate(`/seasons/${year}`);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar sx={{ minHeight: 56, gap: 2, px: { xs: 2, md: 3 } }}>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onMenuToggle} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src="/f1stats-logo.svg"
            alt="F1 Statistics"
            sx={{ height: 32, width: 'auto' }}
          />
        </Box>

        <FormControl size="small">
          <Select
            value={selectedYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            sx={{
              color: '#fff',
              fontFamily: '"Titillium Web", sans-serif',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              minWidth: 90,
              borderRadius: 0,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.15)',
                borderRadius: 0,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E10600' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#E10600' },
              '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
            }}
          >
            {availableYears.map((y) => (
              <MenuItem key={y} value={y} sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 28, height: 28, backgroundColor: '#E10600',
                  fontSize: '0.7rem', fontWeight: 700, fontFamily: '"Titillium Web", sans-serif',
                }}
              >
                {user.nombreUsuario.slice(0, 2).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontFamily: '"Titillium Web", sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>
                  {user.nombreUsuario}
                </Typography>
                <Typography sx={{ fontFamily: '"Titillium Web", sans-serif', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2 }}>
                  {user.rol}
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Cerrar sesión">
              <IconButton color="inherit" onClick={handleLogout} size="small">
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Button
            variant="outlined"
            size="small"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.3)',
              fontFamily: '"Titillium Web", sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              '&:hover': { borderColor: '#E10600', color: '#E10600' },
            }}
          >
            Admin
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
