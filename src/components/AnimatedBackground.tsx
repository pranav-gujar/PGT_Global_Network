import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-blue-950/15 dark:via-background dark:to-purple-950/15 animate-gradient-shift"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-200/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Subtle wave pattern */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="url(#wave-gradient)"
            className="animate-wave"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default AnimatedBackground;