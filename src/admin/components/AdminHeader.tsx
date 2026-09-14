import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Sun,
  Moon,
  LogOut,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AdminHeaderProps {
  currentTab?: string;
  onTabChange?: (tab: any) => void;
  onRefresh?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onRefresh }) => {
  const { logout } = useAdminAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const handleRefreshClick = () => {
    setIsSpinning(true);
    if (onRefresh) {
      onRefresh();
    }
    toast.success('Refreshing portal data...', { id: 'admin-refresh', duration: 1500 });
    setTimeout(() => {
      setIsSpinning(false);
    }, 700);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-card/85 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        {/* Left: Official PGT Logo + Portal Title */}
        <div className="flex items-center space-x-2.5 sm:space-x-4 min-w-0">
          {/* Official PGT Logo */}
          <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-xl bg-card border border-border/80 p-1 sm:p-1.5 shadow-md">
            <img
              src="/PGT New Logo Transparent.png"
              alt="PGT Global Network Logo"
              className="h-full w-full object-contain filter drop-shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-500 border-2 border-card"></span>
            </span>
          </div>

          {/* Portal Title & Stealth Badge */}
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h1 className="text-xs sm:text-base font-bold tracking-tight text-foreground truncate">
                PGT Global Network
              </h1>
              <span className="hidden sm:inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-primary border border-primary/20 flex-shrink-0">
                <Sparkles className="mr-1 h-3 w-3" />
                Admin Hub
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate max-w-[140px] sm:max-w-none">
              Executive Management Suite
            </p>
          </div>
        </div>

        {/* Right: Public Site Link, Theme Switcher & Logout */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
          {/* Visit Live Website Link (in new tab) */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View Public Website in New Tab"
            className="hidden sm:inline-flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/60 admin-btn-press"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors admin-btn-press"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500" />
            )}
          </button>

          {/* Instant Portal Data Refresh Button */}
          <button
            onClick={handleRefreshClick}
            disabled={isSpinning}
            aria-label="Refresh Portal Data"
            title="Refresh Portal Data (fetch fresh database updates)"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-60 admin-btn-press"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground hover:text-foreground transition-transform ${
                isSpinning ? 'animate-spin text-primary' : ''
              }`}
            />
          </button>

          {/* Secure Logout Action */}
          <button
            onClick={logout}
            className="inline-flex items-center space-x-1 sm:space-x-1.5 rounded-lg bg-red-500/10 px-2 sm:px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all admin-btn-press"
            title="End Session & Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
