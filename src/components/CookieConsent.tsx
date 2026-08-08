import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const STORAGE_KEY = 'pgt_cookie_consent';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Delay display by ~1 second after initial load for smooth UX
        const timer = setTimeout(() => {
          setIsVisible(true);
          // Allow DOM element to mount before applying active animation class
          setTimeout(() => setIsAnimating(true), 50);
        }, 1000);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Failed to check cookie consent in localStorage:', error);
    }
  }, []);

  const handleDismiss = (consentType: 'all' | 'essential') => {
    try {
      localStorage.setItem(STORAGE_KEY, consentType);
    } catch (error) {
      console.error('Failed to save cookie consent to localStorage:', error);
    }
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className={`fixed bottom-4 right-4 z-50 max-w-md w-[calc(100%-2rem)] sm:w-[420px] transition-all duration-500 ease-out transform ${
        isAnimating
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white leading-snug">
                Cookie &amp; Privacy Choices
              </h3>
              <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                <span>GDPR &amp; CCPA Compliant</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDismiss('essential')}
            aria-label="Close cookie banner"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          We use essential operational cookies to run our platform securely and optional functional analytics cookies to improve your user experience. Learn more in our{' '}
          <Link
            to="/cookies"
            className="text-indigo-400 hover:text-indigo-300 underline font-medium transition-colors"
          >
            Cookie Policy
          </Link>
          .
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={() => handleDismiss('essential')}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition-all border border-slate-700/60 active:scale-95 text-center"
          >
            Essential Only
          </button>
          <button
            onClick={() => handleDismiss('all')}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95 text-center"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
