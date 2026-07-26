import React from 'react';

const Background = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Light Mesh Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      ></div>

      {/* Floating stardust nodes */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-drift"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${12 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes drift {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
            50% { transform: translateY(-40px) translateX(20px); opacity: 0.6; }
          }
          .animate-drift {
            animation: drift 15s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Background;