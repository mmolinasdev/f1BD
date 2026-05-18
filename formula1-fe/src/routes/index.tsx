import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../pages/dashboard';
import { DriversPage } from '../pages/drivers';
import { DriverDetailPage } from '../pages/driver-detail';
import { TeamsPage } from '../pages/teams';
import { TeamDetailPage } from '../pages/team-detail';
import { CircuitsPage } from '../pages/circuits';
import { CircuitDetailPage } from '../pages/circuit-detail';
import { SeasonsPage } from '../pages/seasons';
import { SeasonDetailPage } from '../pages/season-detail';
import { RacesPage } from '../pages/races';
import { RaceDetailPage } from '../pages/race-detail';
import { StatisticsPage } from '../pages/statistics';
import { NotFoundPage } from '../pages/not-found';
import { LoginPage } from '../pages/login';
import { useAuth } from '../context/AuthContext';
import { AdminPilotosPage } from '../pages/admin/pilotos';
import { AdminEscuderiasPage } from '../pages/admin/escuderias';
import { AdminCircuitosPage } from '../pages/admin/circuitos';
import { AdminTemporadasPage } from '../pages/admin/temporadas';
import { AdminGpsPage } from '../pages/admin/gps';
import { AdminSesionesPage } from '../pages/admin/sesiones';
import { AdminResultadosCarreraPage } from '../pages/admin/resultados-carrera';
import { AdminResultadosClasificacionPage } from '../pages/admin/resultados-clasificacion';
import { AdminContratosPage } from '../pages/admin/contratos';
import { AdminPuntosResultadoPage } from '../pages/admin/puntos-resultado';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    {/* Rutas públicas — accesibles sin login */}
    <Route element={<MainLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="/drivers" element={<DriversPage />} />
      <Route path="/drivers/:tipoDoc/:numDoc" element={<DriverDetailPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/teams/:id" element={<TeamDetailPage />} />
      <Route path="/circuits" element={<CircuitsPage />} />
      <Route path="/circuits/:id" element={<CircuitDetailPage />} />
      <Route path="/seasons" element={<SeasonsPage />} />
      <Route path="/seasons/:year" element={<SeasonDetailPage />} />
      <Route path="/races" element={<RacesPage />} />
      <Route path="/races/:id" element={<RaceDetailPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />

      {/* Rutas de administración — requieren login */}
      <Route path="/admin/pilotos" element={<AdminRoute><AdminPilotosPage /></AdminRoute>} />
      <Route path="/admin/escuderias" element={<AdminRoute><AdminEscuderiasPage /></AdminRoute>} />
      <Route path="/admin/circuitos" element={<AdminRoute><AdminCircuitosPage /></AdminRoute>} />
      <Route path="/admin/temporadas" element={<AdminRoute><AdminTemporadasPage /></AdminRoute>} />
      <Route path="/admin/gps" element={<AdminRoute><AdminGpsPage /></AdminRoute>} />
      <Route path="/admin/sesiones" element={<AdminRoute><AdminSesionesPage /></AdminRoute>} />
      <Route path="/admin/resultados/carrera" element={<AdminRoute><AdminResultadosCarreraPage /></AdminRoute>} />
      <Route path="/admin/resultados/clasificacion" element={<AdminRoute><AdminResultadosClasificacionPage /></AdminRoute>} />
      <Route path="/admin/contratos" element={<AdminRoute><AdminContratosPage /></AdminRoute>} />
      <Route path="/admin/puntos-resultado" element={<AdminRoute><AdminPuntosResultadoPage /></AdminRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
