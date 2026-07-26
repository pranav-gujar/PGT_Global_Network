import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import HeroBackground from '../components/HeroBackground';
import AnimatedCard from '../components/AnimatedCard';

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
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
    <div className="pt-28 bg-slate-50/30 overflow-x-hidden relative min-h-[80vh] flex flex-col justify-center">
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 border border-amber-100 shadow-[0_8px_30px_rgba(245,158,11,0.06)] text-amber-500 hover:scale-105 transition-all duration-300">
            <AlertTriangle className="h-10 w-10 text-amber-500 animate-pulse" />
          </div>
        </AnimatedCard>

        {/* Branded Error Title */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 max-w-3xl mx-auto animate-reveal-up" 
          style={{ animationDelay: '150ms' }}
        >
          Something Went Wrong
        </h1>

        {/* Friendly Error Description */}
        <p 
          className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed font-normal animate-reveal-up" 
          style={{ animationDelay: '300ms' }}
        >
          An unexpected error occurred while processing your request. Please refresh the page or try again in a few moments.
        </p>

        {/* Detailed diagnostic log block in development or if an error message exists */}
        {error && process.env.NODE_ENV === 'development' && (
          <div 
            className="w-full max-w-2xl bg-red-50/50 border border-red-100 rounded-xl p-4 mb-10 text-left font-mono text-xs text-red-650 overflow-auto max-h-40 animate-reveal-up"
            style={{ animationDelay: '400ms' }}
          >
            <p className="font-bold mb-1">Error Diagnostics:</p>
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
            className="group relative overflow-hidden w-full sm:w-56 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
            Refresh Page
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full sm:w-56 border border-slate-200 bg-white/80 backdrop-blur-md text-slate-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:border-slate-300 hover:text-indigo-600 hover:-translate-y-[2px] hover:shadow-sm hover:shadow-indigo-500/5 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
