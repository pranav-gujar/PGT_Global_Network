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
      className={`fixed bottom-5 right-[4.75rem] sm:bottom-6 sm:right-20 z-40 p-3 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-xl border border-indigo-500/30 backdrop-blur-md shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/25 transition-all duration-300 transform active:scale-95 group ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5 transform group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  );
};

export default ScrollToTop;