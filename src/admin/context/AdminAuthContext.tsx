import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminCredentials, AdminSession } from '../types';
import {
  authenticateFounder,
  clearAdminSession,
  getAdminSession,
} from '../services/adminAuth';
import toast from 'react-hot-toast';

interface AdminAuthContextType {
  session: AdminSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminCredentials) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Rehydrate session on mount
  useEffect(() => {
    try {
      const activeSession = getAdminSession();
      if (activeSession) {
        setSession(activeSession);
      }
    } catch (e) {
      console.error('[AdminAuthProvider] Rehydration error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: AdminCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const newSession = await authenticateFounder(credentials);
      setSession(newSession);
      toast.success('Authentication verified. Welcome back, Pranav, Founder & CEO.', {
        id: 'admin-login-success',
        duration: 4000,
      });
    } catch (err: any) {
      toast.error(err?.message || 'Access Denied: Invalid administrative credentials.', {
        id: 'admin-login-error',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAdminSession();
    setSession(null);
    toast.success('Admin session ended securely.', {
      id: 'admin-logout-success',
      duration: 3000,
    });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
