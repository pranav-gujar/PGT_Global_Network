import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import HeroBackground from '../components/HeroBackground';
import AnimatedCard from '../components/AnimatedCard';

const NotFound: React.FC = () => {
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
          {/* Glowing Icon Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-[0_8px_30px_rgba(99,102,241,0.06)] text-indigo-600 hover:scale-105 transition-all duration-300">
            <Compass className="h-10 w-10 text-indigo-600 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
        </AnimatedCard>

        {/* 404 text with large stylized layout */}
        <h1 
          className="text-8xl sm:text-9xl font-black tracking-tighter leading-none mb-4 font-sans max-w-5xl mx-auto select-none bg-gradient-to-b from-indigo-600 via-indigo-700 to-blue-800 bg-clip-text text-transparent opacity-90 drop-shadow-sm animate-reveal-up" 
          style={{ animationDelay: '150ms' }}
        >
          404
        </h1>

        <h2 
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 animate-reveal-up" 
          style={{ animationDelay: '300ms' }}
        >
          Page Not Found
        </h2>

        <p 
          className="text-base sm:text-lg md:text-xl text-slate-650 mb-10 max-w-xl mx-auto leading-relaxed font-normal animate-reveal-up" 
          style={{ animationDelay: '450ms' }}
        >
          The page you're looking for doesn't exist, may have been moved, or the link is incorrect.
        </p>

        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-reveal-up w-full sm:w-auto" 
          style={{ animationDelay: '600ms' }}
        >
          <Link
            to="/"
            className="group relative overflow-hidden w-full sm:w-56 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
            Go to Homepage
          </Link>
          <Link
            to="/programs"
            className="w-full sm:w-56 border border-slate-200 bg-white/80 backdrop-blur-md text-slate-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:border-slate-300 hover:text-indigo-600 hover:-translate-y-[2px] hover:shadow-sm hover:shadow-indigo-500/5 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 group"
          >
            Explore Programs
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
