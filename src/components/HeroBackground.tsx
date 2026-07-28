import React from 'react';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-50/50 dark:bg-slate-950/30 pointer-events-none">
      {/* Aurora Nodes - Shifting soft color glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-blue-200/20 dark:bg-blue-900/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[55%] h-[50%] rounded-full bg-purple-200/15 dark:bg-purple-900/8 blur-[110px] animate-pulse-slow" style={{ animationDelay: '5s' }}></div>

      {/* Vector Grid Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
        }}
      ></div>

      {/* Abstract Concentric Glass Rings (Network Blueprint) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-indigo-500/[0.04] animate-spin-slow pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-dashed border-blue-500/[0.03] animate-spin-reverse pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[960px] h-[960px] rounded-full border border-indigo-500/[0.02] animate-spin-slow pointer-events-none" style={{ animationDuration: '60s' }}></div>

      {/* Radial Gradient Mask to fade grid at the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--radial-fade)_95%)] opacity-85"></div>
      
      {/* Shimmer line effect (Linear/Stripe style) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent animate-shimmer-line"></div>

      {/* Bottom fade mask to transition smoothly to page body */}
      <div className="absolute bottom-0 left-0 right-0 h-42 bg-gradient-to-t from-background to-transparent"></div>

      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.8; }
            33% { transform: scale(1.08) translate(20px, -15px); opacity: 1; }
            66% { transform: scale(0.92) translate(-15px, 10px); opacity: 0.7; }
          }
          @keyframes shimmer-line {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes spin-slow {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: translate(-50%, -50%) rotate(360deg); }
            to { transform: translate(-50%, -50%) rotate(0deg); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 24s ease-in-out infinite;
          }
          .animate-shimmer-line {
            animation: shimmer-line 9s linear infinite;
          }
          .animate-spin-slow {
            animation: spin-slow 40s linear infinite;
          }
          .animate-spin-reverse {
            animation: spin-reverse 50s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default HeroBackground;