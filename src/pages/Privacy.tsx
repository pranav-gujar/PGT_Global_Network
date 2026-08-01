import React from 'react';
import { Shield, Eye, Lock, Users, Globe, FileText } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';
import { getBreadcrumbSchema } from '../lib/schema';

const Privacy = () => {
  const loading = usePageLoading();
  const { t } = useLanguage();

  const getTranslation = (key: string, fallback: any) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const sections = [
    {
      icon: Eye,
      title: getTranslation('privacy.bullets.1', 'Information We Collect').split(':')[0],
      content: [
        getTranslation('privacy.bullets.1', 'Data Collection: We collect only necessary details (name, email) for registration, newsletter updates, and program submissions.'),
        'Usage data and analytics from our website and digital platforms',
        'Communication records including emails, messages, and feedback',
        'Program participation data and progress tracking information'
      ]
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'To deliver our programs and services effectively',
        'To communicate with you about programs, updates, and opportunities',
        'To improve our services and develop new programs',
        'To comply with legal obligations and protect our rights'
      ]
    },
    {
      icon: Users,
      title: getTranslation('privacy.bullets.3', 'Information Sharing').split(':')[0],
      content: [
        getTranslation('privacy.bullets.3', 'Third-Parties: We do not sell or trade user information with external marketers. Analytics data is kept strictly anonymous.'),
        'We may share information with trusted partners who help deliver our programs',
        'We may disclose information when required by law or to protect safety',
        'Anonymous, aggregated data may be used for research and impact reporting'
      ]
    },
    {
      icon: Shield,
      title: getTranslation('privacy.bullets.2', 'Data Security').split(':')[0],
      content: [
        getTranslation('privacy.bullets.2', 'Security: User passwords are encrypted. We maintain standard safety filters to prevent data leaks and unauthorized access.'),
        'All sensitive information is encrypted during transmission and storage',
        'Access to personal data is restricted to authorized personnel only',
        'Regular security audits and updates are conducted to maintain protection'
      ]
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-28 bg-background overflow-x-hidden transition-colors duration-300">
      <SEO 
        title="Privacy Policy"
        description="Learn how PGT Global Network handles user data, privacy protection, analytics, security, and cookie policies."
        schema={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Privacy Policy', item: '/privacy' }
        ])}
      />
      <style>
        {`
          @keyframes reveal-up {
            0% { opacity: 0; transform: translateY(24px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          .animate-reveal-up {
            animation: reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        `}
      </style>

      {/* Hero Section */}
      <AnimatedCard animation="fadeIn">
        <section className="relative overflow-hidden py-24 sm:py-32">
          <HeroBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Tagline Badge */}
            <div
              className="inline-flex items-center gap-2 bg-card/90 border border-border px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.03)] mb-8 animate-reveal-up backdrop-blur-md hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:border-indigo-400/40 hover:-translate-y-[1px] transform transition-all duration-300 pointer-events-auto cursor-pointer"
              style={{ animationDelay: '100ms' }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">{t('privacy.tagline')}</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {t('privacy.title')}
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              {t('privacy.description')}
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Last Updated */}
      <section className="py-8 bg-muted/40 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center">
              <p className="text-muted-foreground text-xs font-mono tracking-wider uppercase">
                {t('privacy.description').split('.')[0] || 'Last Updated: July 27, 2026'}
              </p>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-card/25 border-b border-border relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="space-y-6">
              <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-normal">
                {t('privacy.heading') === 'privacy.heading' ? 'Privacy & Data Terms' : t('privacy.heading')}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                At PGT Global Network, your privacy matters to us. This policy explains how we collect, use, and safeguard your personal information when you engage with our website, programs, and services.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-24 bg-background border-b border-border relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 100}>
                <div className="relative overflow-hidden bg-card border border-border backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-slate-950/10 dark:shadow-none hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.02] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer h-full">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-300 shadow-sm shadow-indigo-500/10">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                  </div>
                  <ul className="space-y-3 relative z-10">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-24 bg-card/25 relative z-10 border-b border-border transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Cookies and Tracking */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10">
                  <Globe className="h-5 w-5" />
                </div>
                Cookies & Tracking
              </h2>
              <div className="text-muted-foreground space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  We use cookies to remember preferences, analyze website traffic and trends, and improve functionality.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10">
                  <FileText className="h-5 w-5" />
                </div>
                Your Rights
              </h2>
              <div className="text-muted-foreground space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>You may request access, correction, or deletion of your data, or withdraw consent at any time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Contact Us About Privacy
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>

            <div className="flex justify-center relative z-10">
              <div className="bg-card border border-border shadow-2xl shadow-slate-950/10 dark:shadow-none p-8 rounded-2xl w-80 text-center group cursor-pointer relative overflow-hidden backdrop-blur">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.04] to-transparent rounded-2xl pointer-events-none" />

                <h3 className="text-lg font-bold text-foreground mb-4">Privacy Query</h3>
                <div className="space-y-2 text-muted-foreground text-xs sm:text-sm font-normal">
                  <p>Email: <a href="mailto:office@pgtglobalnetwork.com" className="text-indigo-600 font-semibold hover:underline">office@pgtglobalnetwork.com</a></p>
                  <p className="text-[10px] text-muted-foreground/50 font-mono pt-2">Response Time: Within 48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Privacy;