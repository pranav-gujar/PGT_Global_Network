import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { MapPin, Phone, Mail, Linkedin, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { name: t('navbar.about'), path: '/about' },
    { name: t('navbar.programs'), path: '/programs' },
    { name: t('navbar.timeline'), path: '/timeline' },
    { name: t('navbar.impact'), path: '/impact' },
    { name: t('navbar.gallery'), path: '/gallery' },
    { name: t('navbar.articles'), path: '/articles' },
  ];

  const programLinks = [
    { name: t('programs.d3.name'), path: '/programs#d3' },
    { name: t('programs.voa.name'), path: '/programs#voa' },
    { name: t('programs.seminarix.name'), path: '/programs#seminarix' },
    { name: t('programs.motivminds.name'), path: '/programs#motivminds' },
    { name: t('programs.hed.name'), path: '/programs#hed' },
  ];

  const supportLinks = [
    { name: t('navbar.careers'), path: '/careers' },
    { name: t('footer.contactUs'), path: '/contact' },
    { name: t('footer.faq'), path: '/faq' },
    { name: t('footer.privacy'), path: '/privacy' },
    { name: t('footer.terms'), path: '/terms' },
  ];

  return (
    <div className="relative -mt-10 md:-mt-12 pt-[1px] bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent rounded-t-[40px] md:rounded-t-[48px] z-20">
      <footer className="relative bg-gradient-to-b from-[#090d16] to-[#040609] text-white rounded-t-[39px] md:rounded-t-[47px] overflow-hidden">

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[150px] bg-indigo-500/[0.04] blur-[80px] pointer-events-none rounded-t-[48px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">

            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img
                  src="/PGT New Logo Transparent.png"
                  alt="PGT Global Network Logo"
                  className="w-10 h-10"
                  style={{
                    filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(99,102,241,0.25))'
                  }}
                />
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  PGT Global Network
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-normal">
                {t('footer.tagline')}
              </p>

              {/* Premium Social Sharing Badges */}
              <div className="flex space-x-3">
                <a
                  href="https://www.linkedin.com/company/pgt-global-network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center text-slate-450 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://www.instagram.com/pgt_global_network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center text-slate-450 hover:text-indigo-455 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://www.youtube.com/@PGTGlobalNetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center text-slate-455 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-6 font-mono">
                {t('footer.quickLinks')}
              </h3>
              <ul className="space-y-3.5">
                {quickLinks.map((link) => (
                  <li key={link.name} className="flex">
                    <Link
                      to={link.path}
                      className="group/link text-slate-405 hover:text-white transition-all duration-300 hover:translate-x-1.5 flex items-center gap-1.5 text-sm font-medium"
                    >
                      <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-6 font-mono">
                {t('navbar.programs')}
              </h3>
              <ul className="space-y-3.5">
                {programLinks.map((link) => (
                  <li key={link.name} className="flex">
                    <HashLink
                      smooth
                      to={link.path}
                      className="group/link text-slate-405 hover:text-white transition-all duration-300 hover:translate-x-1.5 flex items-center gap-1.5 text-sm font-medium"
                    >
                      <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                      {link.name}
                    </HashLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Contact */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-6 font-mono">
                  {t('footer.contactUs')}
                </h3>
                <ul className="space-y-3.5">
                  {supportLinks.map((link) => (
                    <li key={link.name} className="flex">
                      <Link
                        to={link.path}
                        className="group/link text-slate-405 hover:text-white transition-all duration-300 hover:translate-x-1.5 flex items-center gap-1.5 text-sm font-medium"
                      >
                        <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3.5 pt-2">
                <a
                  href="mailto:office@pgtglobalnetwork.com"
                  className="flex items-center space-x-3 text-slate-405 hover:text-indigo-300 transition-colors group/contact"
                >
                  <Mail className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0 group-hover/contact:scale-105 transition-transform" />
                  <span className="text-sm font-medium">
                    {t('contact.details.email')}
                  </span>
                </a>
                <a
                  href="tel:+918999902805"
                  className="flex items-center space-x-3 text-slate-405 hover:text-indigo-300 transition-colors group/contact"
                >
                  <Phone className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0 group-hover/contact:scale-105 transition-transform" />
                  <span className="text-sm font-medium">
                    {t('contact.details.phone')}
                  </span>
                </a>
                <div className="flex items-center space-x-3 text-slate-405">
                  <MapPin className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {t('contact.details.address')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Area */}
          <div className="border-t border-white/[0.04] mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 text-xs font-medium text-center md:text-left">
                © 2026 PGT Global Network. {t('footer.rights')}
              </p>
              <p className="text-slate-500 text-xs font-medium text-center md:text-right">
                Designed & Developed with <span className="text-red-500">❤️</span> by Technical Team.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
