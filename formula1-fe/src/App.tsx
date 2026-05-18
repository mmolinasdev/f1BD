import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { f1Theme } from './theme';
import { SeasonProvider } from './context/SeasonContext';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes';

function App() {
  return (
    <ThemeProvider theme={f1Theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <SeasonProvider>
            <AppRoutes />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1A1A1A',
                  color: '#fff',
                  border: '1px solid rgba(225,6,0,0.3)',
                  fontFamily: '"Titillium Web", sans-serif',
                },
              }}
            />
          </SeasonProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
