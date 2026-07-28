import React, { useState, useEffect } from 'react';

const LoadingSpinner = () => {
  const messages = [
    "Igniting Possibilities...",
    "Empowering Change...",
    "Building Tomorrow...",
    "Creating Impact...",
    "Almost Ready..."
  ];

  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 250);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col items-center justify-center overflow-hidden">
      <style>
        {`
          @keyframes loader-shimmer {
            0% { transform: translateX(-150%) rotate(25deg); }
            100% { transform: translateX(150%) rotate(25deg); }
          }
          .animate-loader-shimmer {
            animation: loader-shimmer 2.5s ease-in-out infinite;
          }
        `}
      </style>

      {/* Background spot light glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[280px] h-[280px] rounded-full bg-blue-350/5 dark:bg-blue-900/10 blur-[80px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[280px] h-[280px] rounded-full bg-indigo-350/5 dark:bg-indigo-900/10 blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>

      {/* Loader visual container */}
      <div className="relative flex flex-col items-center z-10">
        <div className="relative w-48 h-48 flex items-center justify-center">
          
          {/* Inner orbit ring with animated node */}
          <div className="absolute w-36 h-36 border border-slate-200/50 dark:border-slate-800/50 rounded-full animate-[spin_8s_linear_infinite]">
            <div className="absolute -top-1 left-[calc(50%-4px)] w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
          </div>
          
          {/* Outer dashed orbit ring */}
          <div className="absolute w-44 h-44 border border-dashed border-slate-300/45 dark:border-slate-700/40 rounded-full animate-[spin_16s_linear_infinite_reverse]">
            <div className="absolute -bottom-1.5 left-[calc(50%-6px)] w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>

          {/* Core Glow Backdrop */}
          <div className="absolute w-24 h-24 rounded-full bg-indigo-500/[0.03] blur-md animate-ping pointer-events-none"></div>

          {/* Focal Logo */}
          <div className="relative w-20 h-20 bg-card border border-border rounded-3xl flex items-center justify-center shadow-xl shadow-slate-100/50 dark:shadow-none hover:scale-105 transition-transform duration-300 overflow-hidden">
            <img 
              src="/PGT New Logo Transparent.png" 
              alt="PGT Logo" 
              className="w-12 h-12 object-contain animate-[pulse_3s_ease-in-out_infinite]"
            />
            {/* Gloss shine reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[50%] h-full -skew-x-12 animate-loader-shimmer" />
          </div>
        </div>

        {/* Rotating Brand messages container */}
        <div className="mt-6 h-8 flex items-center justify-center">
          <p 
            className={`text-foreground/80 dark:text-foreground/90 font-semibold tracking-wide text-sm sm:text-base transition-all duration-300 ${
              fade ? 'opacity-100 transform translate-y-0 scale-100' : 'opacity-0 transform -translate-y-1 scale-95'
            }`}
          >
            {messages[msgIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoadingSpinner);