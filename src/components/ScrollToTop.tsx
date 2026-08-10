import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed bottom-4 right-[68px] sm:bottom-6 sm:right-[88px] z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 shadow-2xl flex items-center justify-center text-indigo-400 hover:text-indigo-300 hover:border-indigo-400/50 hover:bg-slate-800/90 transition-all duration-300 transform hover:scale-110 active:scale-95 group ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
    >
      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  );
};

export default ScrollToTop;