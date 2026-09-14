import React from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './components/AdminLayout';
import { Loader2 } from 'lucide-react';

const AdminGatekeeper: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-xl shadow-indigo-500/25">
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground animate-pulse">
            Verifying Administrative Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminLayout />;
};

export const AdminRoot: React.FC = () => {
  return (
    <AdminAuthProvider>
      <AdminGatekeeper />
    </AdminAuthProvider>
  );
};

export default AdminRoot;
