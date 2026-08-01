import React from 'react';
import { Target, Eye, Heart, Users, Globe, Award } from 'lucide-react';
import founderImg from '../assets/founderImg.jpg';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';
import { getBreadcrumbSchema } from '../lib/schema';

const About = () => {
  const loading = usePageLoading();
  const { t } = useLanguage();

  const foundingPrinciples = [
    {
      icon: Target,
      title: t('about.principles.purpose.title'),
      description: t('about.principles.purpose.description'),
      color: 'text-indigo-600 dark:text-indigo-400',
      bgBox: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800/40 shadow-indigo-500/10'
    },
    {
      icon: Users,
      title: t('about.principles.people.title'),
      description: t('about.principles.people.description'),
      color: 'text-blue-600 dark:text-blue-400',
      bgBox: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-800/40 shadow-blue-500/10'
    },
    {
      icon: Globe,
      title: t('about.principles.global.title'),
      description: t('about.principles.global.description'),
      color: 'text-purple-600 dark:text-purple-400',
      bgBox: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-800/40 shadow-purple-500/10'
    },
    {
      icon: Award,
      title: t('about.principles.excellence.title'),
      description: t('about.principles.excellence.description'),
      color: 'text-amber-600 dark:text-amber-400',
      bgBox: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/40 shadow-amber-500/10'
    }
  ];

  const coreValues = [
    {
      icon: Target,
      title: t('home.coreValues.positivity.title'),
      description: t('home.coreValues.positivity.description'),
      color: 'text-indigo-600 dark:text-indigo-400',
      bgBox: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800/40 shadow-indigo-500/10',
      bgGlow: 'from-indigo-500/[0.05]'
    },
    {
      icon: StarIcon,
      title: t('home.coreValues.growth.title'),
      description: t('home.coreValues.growth.description'),
      color: 'text-emerald-600 dark:text-emerald-400',
      bgBox: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/40 shadow-emerald-500/10',
      bgGlow: 'from-emerald-500/[0.05]'
    },
    {
      icon: Heart,
      title: t('home.coreValues.transformation.title'),
      description: t('home.coreValues.transformation.description'),
      color: 'text-purple-600 dark:text-purple-400',
      bgBox: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-800/40 shadow-purple-500/10',
      bgGlow: 'from-purple-500/[0.05]'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-28 bg-background overflow-x-hidden transition-colors duration-300">
      <SEO 
        title="About Us"
        description="Learn about PGT Global Network's mission, values, founder note, and journey toward empowering communities worldwide through digital education and leadership."
        schema={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'About Us', item: '/about' }
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
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">{t('about.tagline')}</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {t('navbar.about') === 'navbar.about' ? 'About PGT Global Network' : t('navbar.about')}
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              {t('about.description')}
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Mission & Vision */}
      <section className="py-24 bg-card/25 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatedCard animation="slideLeft">
              <div className="bg-card border border-border p-8 md:p-10 rounded-2xl hover:bg-muted/10 hover:shadow-2xl hover:shadow-slate-950/10 hover:border-indigo-500/20 hover:-translate-y-1 transform transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-all duration-300 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10">
                    <Target className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4 tracking-tight">
                    {t('about.principles.purpose.title').replace(/\[.*?\]\s*/g, '') === 'about.principles.purpose.title' ? 'Our Mission' : t('about.principles.purpose.title')}
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    {t('programs.description')}
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard animation="slideRight">
              <div className="bg-card border border-border p-8 md:p-10 rounded-2xl hover:bg-muted/10 hover:shadow-2xl hover:shadow-slate-950/10 hover:border-indigo-500/20 hover:-translate-y-1 transform transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/40 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-all duration-300 text-purple-600 dark:text-purple-400 shadow-sm shadow-purple-500/10">
                    <Eye className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4 tracking-tight">
                    {t('about.philosophyTitle').replace(/\[.*?\]\s*/g, '') === 'about.philosophyTitle' ? 'Our Vision' : t('about.philosophyTitle')}
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    {t('about.principles.people.description')}
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-background border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">{t('home.valuesTag')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">
              {t('home.valuesTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('home.valuesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 150}>
                <div className="relative overflow-hidden bg-card border border-border p-8 rounded-2xl hover:shadow-2xl hover:shadow-slate-950/10 hover:border-indigo-500/20 hover:-translate-y-2 transform transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                  <div className={`absolute -inset-[1px] bg-gradient-to-br ${value.bgGlow} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  <div className="relative z-10">
                    <div className={`w-14 h-14 ${value.bgBox} border flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 ${value.color}`}>
                      <value.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-24 bg-background/25 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="fadeIn">
            <div className="relative bg-card border border-border rounded-3xl shadow-xl shadow-slate-950/10 dark:shadow-none p-8 md:p-16 max-w-4xl mx-auto group">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-3xl pointer-events-none" />

              <div className="text-center mb-12 relative z-10">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">{t('about.leadershipTag')}</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-8 tracking-tight">
                  {t('about.leadershipTitle')}
                </h2>
                
                {/* Executive Founder Frame */}
                <div className="relative mx-auto mb-10 w-44 h-52 sm:w-48 sm:h-56 group/founder">
                  {/* Ambient Indigo Soft Aura */}
                  <div className="absolute -inset-3 bg-gradient-to-b from-indigo-500/15 via-blue-500/10 to-transparent dark:from-indigo-500/25 dark:via-blue-500/15 rounded-[2.2rem] blur-xl opacity-75 group-hover/founder:opacity-100 group-hover/founder:blur-2xl transition-all duration-500" />

                  {/* Outer Frame Box */}
                  <div className="relative w-full h-full bg-card border border-border p-2.5 rounded-[2rem] shadow-xl shadow-slate-950/5 dark:shadow-none transition-all duration-500 group-hover/founder:border-indigo-500/30 group-hover/founder:shadow-2xl group-hover/founder:shadow-indigo-500/10 group-hover/founder:-translate-y-1">
                    
                    {/* Subtle Top Brand Accent Line */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full opacity-60 group-hover/founder:opacity-100 transition-opacity" />

                    {/* Photo Container */}
                    <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-muted/30 relative border border-border/40">
                      <img
                        src={founderImg}
                        alt="Pranav Gujar"
                        className="w-full h-full object-cover object-top group-hover/founder:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Elegant Badge overlapping bottom */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-md border border-border shadow-md px-3.5 py-1 rounded-full text-[11px] font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5 whitespace-nowrap group-hover/founder:border-indigo-500/30 group-hover/founder:shadow-indigo-500/10 transition-all duration-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      Founder & CEO
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-1">Pranav Gujar</h3>
                <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">{t('about.CEO')}</p>
              </div>

              <div className="max-w-3xl mx-auto relative z-10">
                <blockquote className="text-lg md:text-xl text-foreground/90 leading-relaxed text-center italic font-normal mb-8 border-l-4 border-indigo-500/20 pl-4 py-2">
                  "{t('about.quote')}"
                </blockquote>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-6">
                  {t('about.p1')}
                </p>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-6">
                  {t('about.p2')}
                </p>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-6">
                  {t('about.p3')}
                </p>

                <div className="mt-12 text-center pt-8 border-t border-border">
                  <p className="text-muted-foreground text-sm font-medium">{t('about.gratitude')}</p>
                  <p className="text-xl font-bold text-foreground mt-2 font-mono">Pranav Gujar</p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Founding Principles */}
      <section className="py-24 bg-card/25 border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">{t('about.philosophyTag')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">
              {t('about.philosophyTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('about.philosophySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {foundingPrinciples.map((principle, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 150}>
                <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-2xl hover:shadow-slate-950/10 hover:border-indigo-500/20 hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer h-full">
                  <div className="flex items-start space-x-5">
                    <div className={`w-14 h-14 ${principle.bgBox} border flex items-center justify-center rounded-2xl flex-shrink-0 group-hover:scale-110 transition-all duration-300 ${principle.color}`}>
                      <principle.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        {principle.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10">
          <Background />

          {/* Spotlight glowing gradients */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {t('common.explore').replace(/\[.*?\]\s*/g, '') === 'common.explore' ? 'Join Our Mission of Positive Change' : t('common.explore')}
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-slate-400 leading-relaxed font-normal">
              {t('about.principles.excellence.description')}
            </p>
            <p className="text-base text-slate-400 max-w-2xl mx-auto font-medium">
              {t('common.learnMore').replace(/\[.*?\]\s*/g, '') === 'common.learnMore' ? 'Learn, grow, and create meaningful impact with us.' : t('common.learnMore')}
            </p>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

// Simple StarIcon svg
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default About;