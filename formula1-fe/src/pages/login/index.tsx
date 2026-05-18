import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/routePaths';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nombreUsuario.trim() || !contrasena.trim()) {
      setError('Por favor ingresa usuario y contraseña.');
      return;
    }
    setLoading(true);
    const result = await login(nombreUsuario.trim(), contrasena);
    if (result.ok) {
      navigate(ROUTES.HOME, { replace: true });
    } else {
      setError(result.message ?? 'Usuario o contraseña incorrectos.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#15151E',
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#E10600',
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontFamily: '"Titillium Web", sans-serif',
            }}
          >
            Formula 1
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
            Sistema de Estadísticas
          </Typography>
        </Box>

        <Card sx={{ bgcolor: '#1E1E2E', border: '1px solid rgba(225,6,0,0.2)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: '#fff', fontWeight: 700, mb: 3, textAlign: 'center' }}
            >
              Iniciar Sesión
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                fullWidth
                autoComplete="username"
                autoFocus
                sx={{ mb: 2 }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ sx: { color: '#fff' } }}
              />

              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                fullWidth
                autoComplete="current-password"
                sx={{ mb: 3 }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{
                  sx: { color: '#fff' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: '#E10600',
                  '&:hover': { bgcolor: '#b80500' },
                  fontWeight: 700,
                  py: 1.2,
                  fontSize: '1rem',
                }}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 3, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}
            >
              Acceso exclusivo para administradores
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
