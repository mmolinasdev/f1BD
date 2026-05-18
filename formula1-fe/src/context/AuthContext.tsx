import { createContext, useContext, useState, ReactNode } from 'react';
import { apiClient } from '../services/api/apiClient';

interface AuthUser {
  id: number;
  nombreUsuario: string;
  correo: string;
  tipoUsuario: string;
  rol: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (nombreUsuario: string, contrasena: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'f1_auth_user';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (nombreUsuario: string, contrasena: string) => {
    try {
      const { data } = await apiClient.post<AuthUser>('/auth/login', {
        nombreUsuario,
        contrasena,
      });
      setUser(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { ok: true };
    } catch (err: any) {
      const message = err.message || 'Error al iniciar sesión';
      return { ok: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: user !== null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
