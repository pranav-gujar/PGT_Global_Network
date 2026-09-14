import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, isLoading } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Enforce SEO stealth dynamically
  useEffect(() => {
    const existingRobots = document.querySelector('meta[name="robots"]');
    const prevContent = existingRobots ? existingRobots.getAttribute('content') : null;

    if (existingRobots) {
      existingRobots.setAttribute('content', 'noindex, nofollow, noarchive');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow, noarchive';
      document.head.appendChild(meta);
    }

    const prevTitle = document.title;
    document.title = 'PGT Executive Hub • Access Gateway';

    return () => {
      document.title = prevTitle;
      if (existingRobots && prevContent) {
        existingRobots.setAttribute('content', prevContent);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both administrative username and password.');
      return;
    }

    try {
      await login({
        username: username.trim(),
        password: password.trim(),
        rememberMe,
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Access Denied: Invalid administrative credentials.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Ambient background glow matching site theme */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[130px] -top-20 -right-20 animate-float" />
        <div className="h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px] -bottom-20 -left-20 animate-float-hero" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Gateway Card */}
        <div className="relative rounded-2xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-2xl shadow-indigo-500/5 backdrop-blur-2xl">
          {/* Header Brand */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border/80 p-2.5 shadow-xl shadow-indigo-500/10 backdrop-blur-md">
              <img
                src="/PGT New Logo Transparent.png"
                alt="PGT Global Network Logo"
                className="h-full w-full object-contain filter drop-shadow-md"
              />
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-500 border border-indigo-500/20">
              <Sparkles className="h-3 w-3" />
              <span>Founder Executive Gateway</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              PGT Global Network
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Internal Administrative & Executive Control Hub
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500 animate-in fade-in-50 duration-200">
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full rounded-xl border border-border bg-input pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Founder Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full rounded-xl border border-border bg-input pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 bg-input"
                />
                <span>Keep session active (7 days)</span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-2 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 transition-all hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authorize & Access Admin Hub</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Stealth & Security Footer Badge */}
          <div className="mt-6 pt-5 border-t border-border/60 text-center">
            <p className="text-[11px] text-muted-foreground/80 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3 text-emerald-500" />
              <span>Encrypted Session • Restricted to Pranav, Founder & CEO</span>
            </p>
          </div>
        </div>

        {/* Discreet bottom link back to public site */}
        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          >
            ← Return to public website
          </a>
        </div>
      </div>
    </div>
  );
};
