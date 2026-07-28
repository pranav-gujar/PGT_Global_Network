import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Sun, Moon, Laptop } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthModal from '../components/AuthModal';
import { useLanguage, LANGUAGES, LanguageCode } from '../contexts/LanguageContext';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
       await signOut();
       navigate('/'); // 👈 send user back to home after logout
      } catch (error) {
        console.error('Error signing out:', error);
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setDropdownOpen(false);
      setUserDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.about'), path: '/about' },
    { name: t('navbar.programs'), path: '/programs' },
    { name: t('navbar.ventures'), path: '/ventures' },
    { name: t('navbar.timeline'), path: '/timeline' },
    { name: t('navbar.impact'), path: '/impact' },
    { name: t('navbar.gallery'), path: '/gallery' },
    { name: t('navbar.articles'), path: '/articles' },
    { name: t('navbar.careers'), path: '/careers' },
    { name: t('navbar.contact'), path: '/contact' },
  ];

  const moreItems = [
    { name: t('footer.faq'), path: '/faq' },
    { name: t('footer.privacy'), path: '/privacy' },
    { name: t('footer.terms'), path: '/terms' },
  ];

  const isActive = (path: string) => {
    if (path === location.pathname) return true;
    // Check if current path is in moreItems
    return moreItems.some(item => item.path === location.pathname && item.path === path);
  };

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300">
      {/* Announcement Bar */}
      <div className={`bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden whitespace-nowrap transition-all duration-300 ${
        scrolled ? 'h-0 py-0 opacity-0 border-none' : 'py-2.5 h-10 opacity-100'
      }`}>
        <div className="w-full flex items-center text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-450">
          <div className="flex space-x-12 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            <Link to="/articles" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1">
              📢 {t('navbar.announcementArticle')} →
            </Link>
            <Link to="/careers" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1">
              🚀 {t('navbar.announcementCareers')} →
            </Link>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-flex;
            animation: marquee 16s linear infinite;
          }
        `}
      </style>

      <nav className={`w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-slate-800/60' 
          : 'bg-white dark:bg-slate-950 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${
            scrolled ? 'h-14' : 'h-16'
          }`}>
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 whitespace-nowrap">
                <img 
                  src="/PGT New Logo Transparent.png" 
                  alt="PGT Logo" 
                  className={`transition-all duration-300 filter drop-shadow-md ${
                    scrolled ? 'w-8 h-8' : 'w-10 h-10'
                  }`}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
                <span className={`font-bold text-gray-900 dark:text-white transition-all duration-300 ${
                  scrolled ? 'text-lg' : 'text-xl'
                }`}>
                  <span className="hidden sm:inline">PGT Global Network</span>
                  <span className="sm:hidden">PGT</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation (Left-aligned menu next to logo with premium spacing) */}
            <div className="hidden lg:flex flex-1 items-center justify-start ml-8 xl:ml-12">
              <div className="flex items-center space-x-1 xl:space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-2 xl:px-3 py-2 rounded-md font-medium transition-all duration-200 hover:scale-105 ${
                      scrolled ? 'text-[11px] xl:text-xs' : 'text-xs xl:text-sm'
                    } ${
                      isActive(item.path)
                        ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-blue-450 dark:hover:bg-slate-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* More Dropdown */}
                <div className="relative" ref={moreDropdownRef}>
                  <button
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className={`flex items-center px-2 xl:px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-blue-450 dark:hover:bg-slate-900 transition-all duration-200 ${
                      scrolled ? 'text-[11px] xl:text-xs' : 'text-xs xl:text-sm'
                    }`}
                  >
                    {t('navbar.more')}
                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-slate-800 z-50">
                      {moreItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800/60 ${isActive(item.path) ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : 'text-gray-700 dark:text-slate-200'}`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      
                      {/* Premium Theme Switcher inside More Dropdown */}
                      <div className="border-t border-gray-150 dark:border-slate-800 mt-2 pt-2 px-3">
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 px-1">
                          {t('navbar.theme')}
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-950 rounded-lg p-0.5 border border-gray-100 dark:border-slate-800/80">
                          <button
                            onClick={() => setTheme('light')}
                            className={`p-1.5 rounded-md transition-all duration-200 flex-1 flex justify-center ${theme === 'light' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-100'}`}
                            title={t('navbar.themeLight')}
                          >
                            <Sun className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setTheme('dark')}
                            className={`p-1.5 rounded-md transition-all duration-200 flex-1 flex justify-center ${theme === 'dark' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-100'}`}
                            title={t('navbar.themeDark')}
                          >
                            <Moon className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setTheme('system')}
                            className={`p-1.5 rounded-md transition-all duration-200 flex-1 flex justify-center ${theme === 'system' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-100'}`}
                            title={t('navbar.themeSystem')}
                          >
                            <Laptop className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Premium Language Selector inside More Dropdown */}
                      <div className="border-t border-gray-150 dark:border-slate-800 mt-2 pt-2 px-3 pb-2">
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 px-1">
                          🌐 Language
                        </div>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                          className="w-full bg-gray-50 dark:bg-slate-950 text-xs font-semibold text-foreground border border-gray-100 dark:border-slate-800/80 rounded-lg p-1.5 focus:outline-none cursor-pointer"
                        >
                          {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-foreground">
                              {lang.nativeName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              {user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                    }}
                    className={`flex items-center px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-blue-450 dark:hover:bg-slate-900 transition-all duration-200 ${
                      scrolled ? 'text-[11px] xl:text-xs' : 'text-xs xl:text-sm'
                    }`}
                  >
                    <User className="h-4 w-4 mr-1" />
                    {t('navbar.account')}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-slate-800 z-50">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        {t('navbar.dashboard')}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-750 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/60 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('navbar.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/signin')}
                  className={`bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-all duration-200 hover:scale-105 ${
                    scrolled ? 'text-xs' : 'text-sm'
                  }`}
                >
                  {t('navbar.signIn')}
                </button>
              )}
            </div>

             {/* Mobile menu button */}
             <div className="lg:hidden">
               <button
                 onClick={() => setIsOpen(!isOpen)}
                 className="text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-200"
               >
                 {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
               </button>
             </div>
           </div>
         </div>
 
         {/* Mobile Navigation */}
         {isOpen && (
           <div className="lg:hidden">
             <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
               {navItems.map((item) => (
                 <Link
                   key={item.name}
                   to={item.path}
                   className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                     isActive(item.path)
                       ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40'
                       : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-900'
                   }`}
                   onClick={() => setIsOpen(false)}
                 >
                   {item.name}
                 </Link>
               ))}
               {moreItems.map((item) => (
                 <Link
                   key={item.name}
                   to={item.path}
                   className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive(item.path) ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : 'text-gray-700 dark:text-slate-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-slate-900'}`}
                   onClick={() => setIsOpen(false)}
                 >
                   {item.name}
                 </Link>
               ))}
               
               {/* Mobile Auth */}
               {user ? (
                 <>
                   <Link
                     to="/dashboard"
                     className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-slate-900 transition-all duration-200"
                     onClick={() => setIsOpen(false)}
                   >
                     {t('navbar.dashboard')}
                   </Link>
                   <button
                     onClick={() => {
                       handleLogout();
                       setIsOpen(false);
                     }}
                     className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-slate-900 transition-all duration-200"
                   >
                     {t('navbar.signOut')}
                   </button>
                 </>
               ) : (
                 <button
                   onClick={() => {
                     navigate('/signin');
                     setIsOpen(false);
                   }}
                   className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                 >
                   {t('navbar.signIn')}
                 </button>
               )}

               {/* Mobile Theme Switcher */}
               <div className="border-t border-gray-150 dark:border-slate-800 my-3 pt-3 px-1">
                 <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('navbar.theme')}</p>
                 <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-slate-900/60 p-1 rounded-xl border border-gray-100 dark:border-slate-800/80">
                   <button
                     onClick={() => setTheme('light')}
                     className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                       theme === 'light'
                         ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700'
                         : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                     }`}
                   >
                     <Sun className="h-4 w-4" />
                     <span>{t('navbar.themeLight')}</span>
                   </button>
                   <button
                     onClick={() => setTheme('dark')}
                     className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                       theme === 'dark'
                         ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700'
                         : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                     }`}
                   >
                     <Moon className="h-4 w-4" />
                     <span>{t('navbar.themeDark')}</span>
                   </button>
                   <button
                     onClick={() => setTheme('system')}
                     className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                       theme === 'system'
                         ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700'
                         : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                     }`}
                   >
                     <Laptop className="h-4 w-4" />
                     <span>{t('navbar.themeSystem')}</span>
                   </button>
                 </div>
               </div>

               {/* Mobile Language Selector */}
               <div className="border-t border-gray-150 dark:border-slate-800 my-3 pt-3 px-1">
                 <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">🌐 Language</p>
                 <select
                   value={language}
                   onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                   className="w-full bg-gray-50 dark:bg-slate-900/60 text-sm font-semibold text-foreground border border-gray-100 dark:border-slate-800/80 rounded-xl p-2.5 focus:outline-none cursor-pointer"
                 >
                   {LANGUAGES.map((lang) => (
                     <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-foreground">
                       {lang.nativeName}
                     </option>
                   ))}
                 </select>
               </div>
             </div>
           </div>
         )}
      </nav>
    </header>
  );
};

export default Navbar;