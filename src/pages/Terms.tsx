import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, Users, Globe } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';
import { useLanguage } from '../contexts/LanguageContext';

const Terms = () => {
  const loading = usePageLoading();
  const { t } = useLanguage();

  const getTranslation = (key: string, fallback: any) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const sections = [
    {
      icon: Users,
      title: 'User Responsibilities',
      items: [
        getTranslation('terms.bullets.2', 'User Code: Portal members must maintain positive engagement, avoiding toxic, spam, or malicious actions on dashboards.'),
        'Provide accurate and complete information during registration',
        'Maintain confidentiality of account credentials',
        'Use our services in compliance with applicable laws'
      ]
    },
    {
      icon: Shield,
      title: 'Prohibited Activities',
      items: [
        'Harassment, discrimination, or harmful behavior toward others',
        'Sharing false, misleading, or inappropriate content',
        'Attempting to gain unauthorized access to our systems',
        'Using our services for illegal or unethical purposes'
      ]
    },
    {
      icon: Globe,
      title: getTranslation('terms.bullets.1', 'Intellectual Property').split(':')[0],
      items: [
        getTranslation('terms.bullets.1', 'Usage Rights: Platform content, codes, designs, and materials are copyrighted. Personal non-commercial usage is permitted.'),
        'Users retain rights to their original contributions',
        'Limited license granted for personal, non-commercial use',
        'Respect for third-party intellectual property rights'
      ]
    },
    {
      icon: AlertTriangle,
      title: getTranslation('terms.bullets.3', 'Limitation of Liability').split(':')[0],
      items: [
        getTranslation('terms.bullets.3', 'Liability Limit: PGT operates as an impact network. We provide motivational tools as-is and are not responsible for direct outcomes.'),
        'No liability for indirect or consequential damages',
        'Maximum liability limited to fees paid (if any)',
        'Users responsible for their own decisions and actions'
      ]
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-28 bg-background overflow-x-hidden transition-colors duration-300">
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
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">{t('terms.tagline')}</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {t('terms.title')}
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              {t('terms.description')}
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
                {t('terms.description').split('.')[0] || 'Last Updated: July 27, 2026'}
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
                {t('terms.heading') === 'terms.heading' ? 'Standard Site Terms' : t('terms.heading')}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                Welcome to PGT Global Network. These Terms and Conditions ("Terms") govern your use of our website, programs, and services. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Key Terms Grid */}
      <section className="py-24 bg-background border-b border-border relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">overview</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">
                Key Terms Overview
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Understanding your rights and responsibilities when using our services
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 100}>
                <div className="relative overflow-hidden bg-card border border-border backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-slate-955/10 dark:shadow-none hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.02] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer h-full">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 bg-muted border border-border rounded-xl flex items-center justify-center text-indigo-700 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-300">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
                  </div>
                  <ul className="space-y-3 relative z-10">
                    {section.items.map((item, itemIndex) => (
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

      {/* Detailed Terms */}
      <section className="py-24 bg-card/25 relative z-10 border-b border-border transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Acceptance of Terms */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">1. Acceptance of Terms</h2>
              <div className="text-muted-foreground space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  By accessing and using PGT Global Network's website, programs, and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>

            {/* Services Description */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">2. Description of Services</h2>
              <div className="text-muted-foreground space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>PGT Global Network provides educational programs, learning resources, and community networking opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;