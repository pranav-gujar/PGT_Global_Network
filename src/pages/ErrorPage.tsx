import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import HeroBackground from '../components/HeroBackground';
import AnimatedCard from '../components/AnimatedCard';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useLanguage();
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    // Graceful fallback if rendered outside Router context
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="pt-28 bg-background overflow-x-hidden relative min-h-[80vh] flex flex-col justify-center transition-colors duration-300">
      <SEO title="Application Error" noindex={true} />
      <style>
        {`
          @keyframes reveal-up {
            0% { opacity: 0; transform: translateY(24px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes shimmer-btn {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-reveal-up {
            animation: reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          .animate-shimmer-btn {
            animation: shimmer-btn 1.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
        `}
      </style>
      
      <HeroBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center justify-center flex-grow">
        <AnimatedCard animation="zoomIn" className="mb-6">
          {/* Glowing Alarm/Alert Icon Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-[0_8px_30px_rgba(245,158,11,0.06)] text-amber-500 hover:scale-105 transition-all duration-300">
            <AlertTriangle className="h-10 w-10 text-amber-500 animate-pulse" />
          </div>
        </AnimatedCard>

        {/* Branded Error Title */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-4 max-w-3xl mx-auto animate-reveal-up" 
          style={{ animationDelay: '150ms' }}
        >
          {t('errors.general.title')}
        </h1>

        {/* Friendly Error Description */}
        <p 
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed font-normal animate-reveal-up" 
          style={{ animationDelay: '300ms' }}
        >
          {t('errors.general.description')}
        </p>

        {/* Detailed diagnostic log block in development or if an error message exists */}
        {error && (
          <div 
            className="w-full max-w-2xl bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-10 text-left font-mono text-xs text-rose-600 dark:text-rose-400 overflow-auto max-h-40 animate-reveal-up text-foreground"
            style={{ animationDelay: '400ms' }}
          >
            <p className="font-bold mb-1">{t('errors.general.diagnostics')}</p>
            <pre>{error.stack || error.message}</pre>
          </div>
        )}

        {/* Action Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-reveal-up w-full sm:w-auto" 
          style={{ animationDelay: '450ms' }}
        >
          <button
            onClick={handleRefresh}
            className="group relative overflow-hidden w-full sm:w-56 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
            {t('errors.general.btnRefresh')}
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full sm:w-56 border border-border bg-card/85 text-muted-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-card hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-[2px] hover:shadow-sm hover:shadow-indigo-500/5 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
          >
            {t('errors.general.btnHome')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
