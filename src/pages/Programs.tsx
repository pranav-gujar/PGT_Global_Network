import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Zap, Brain, GraduationCap } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';
import { useLanguage } from '../contexts/LanguageContext';

import Seminarix from '../assets/programs/Seminarix.png';
import D3 from '../assets/programs/D3.png';
import VoA from '../assets/programs/VoA.png';
import HED from '../assets/programs/HED.png';
import MotivMinds from '../assets/programs/MotiVMinds.png';

import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';
import SEO from '../components/SEO';
import { getBreadcrumbSchema, getCourseSchema } from '../lib/schema';

const Programs = () => {
  const loading = usePageLoading();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      const scrollToEl = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      scrollToEl();
      const tm = setTimeout(scrollToEl, 300);
      return () => clearTimeout(tm);
    }
  }, [location]);

  const getTheme = (id: string) => {
    switch (id) {
      case 'd3':
        return {
          badge: 'bg-indigo-50/10 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200/20 hover:bg-indigo-100/20',
          glow: 'from-indigo-500/[0.03]',
          iconText: 'text-indigo-600 dark:text-indigo-400',
          iconBg: 'bg-indigo-50/10 dark:bg-indigo-950/30',
          shadow: 'hover:shadow-indigo-500/[0.04]',
          bullet: 'bg-indigo-500',
          border: 'hover:border-indigo-500/30'
        };
      case 'voa':
        return {
          badge: 'bg-blue-50/10 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200/20 hover:bg-blue-100/20',
          glow: 'from-blue-500/[0.03]',
          iconText: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-50/10 dark:bg-blue-950/30',
          shadow: 'hover:shadow-blue-500/[0.04]',
          bullet: 'bg-blue-500',
          border: 'hover:border-blue-500/30'
        };
      case 'seminarix':
        return {
          badge: 'bg-purple-50/10 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border border-purple-200/20 hover:bg-purple-100/20',
          glow: 'from-purple-500/[0.03]',
          iconText: 'text-purple-600 dark:text-purple-400',
          iconBg: 'bg-purple-50/10 dark:bg-purple-950/30',
          shadow: 'hover:shadow-purple-500/[0.04]',
          bullet: 'bg-purple-500',
          border: 'hover:border-purple-500/30'
        };
      case 'motivminds':
        return {
          badge: 'bg-pink-50/10 dark:bg-pink-950/20 text-pink-700 dark:text-pink-400 border border-pink-200/20 hover:bg-pink-100/20',
          glow: 'from-pink-500/[0.03]',
          iconText: 'text-pink-600 dark:text-pink-400',
          iconBg: 'bg-pink-50/10 dark:bg-pink-950/30',
          shadow: 'hover:shadow-pink-500/[0.04]',
          bullet: 'bg-pink-500',
          border: 'hover:border-pink-500/30'
        };
      case 'hed':
        return {
          badge: 'bg-emerald-50/10 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/20 hover:bg-emerald-100/20',
          glow: 'from-emerald-500/[0.03]',
          iconText: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'bg-emerald-50/10 dark:bg-emerald-950/30',
          shadow: 'hover:shadow-emerald-500/[0.04]',
          bullet: 'bg-emerald-500',
          border: 'hover:border-emerald-500/30'
        };
      default:
        return {
          badge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/40 hover:bg-indigo-100/40',
          glow: 'from-indigo-500/[0.03]',
          iconText: 'text-indigo-600 dark:text-indigo-400',
          iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 shadow-sm shadow-indigo-500/10',
          shadow: 'hover:shadow-indigo-500/[0.04]',
          bullet: 'bg-indigo-500',
          border: 'hover:border-indigo-500/30'
        };
    }
  };

  const programs = [
    {
      id: 'd3',
      name: t('programs.d3.name'),
      fullName: t('programs.d3.fullName'),
      icon: Target,
      description: t('programs.d3.description'),
      features: t('programs.d3.features') || [],
      impact: t('programs.d3.impact'),
      duration: t('programs.d3.duration'),
      image: D3
    },
    {
      id: 'voa',
      name: t('programs.voa.name'),
      fullName: t('programs.voa.fullName'),
      icon: Users,
      description: t('programs.voa.description'),
      features: t('programs.voa.features') || [],
      impact: t('programs.voa.impact'),
      duration: t('programs.voa.duration'),
      image: VoA
    },
    {
      id: 'seminarix',
      name: t('programs.seminarix.name'),
      fullName: t('programs.seminarix.fullName'),
      icon: GraduationCap,
      description: t('programs.seminarix.description'),
      features: t('programs.seminarix.features') || [],
      impact: t('programs.seminarix.impact'),
      duration: t('programs.seminarix.duration'),
      image: Seminarix
    },
    {
      id: 'motivminds',
      name: t('programs.motivminds.name'),
      fullName: t('programs.motivminds.fullName'),
      icon: Brain,
      description: t('programs.motivminds.description'),
      features: t('programs.motivminds.features') || [],
      impact: t('programs.motivminds.impact'),
      duration: t('programs.motivminds.duration'),
      image: MotivMinds
    },
    {
      id: 'hed',
      name: t('programs.hed.name'),
      fullName: t('programs.hed.fullName'),
      icon: Zap,
      description: t('programs.hed.description'),
      features: t('programs.hed.features') || [],
      impact: t('programs.hed.impact'),
      duration: t('programs.hed.duration'),
      image: HED
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-28 bg-background overflow-x-hidden transition-colors duration-300">
      <SEO 
        title="Core Initiatives & Programs"
        description="Explore PGT Global Network's core initiatives including D3, VoA, Happy Eco Diwali, MotivMinds, and Seminarix designed to foster digital learning and community leadership."
        schema={[
          getBreadcrumbSchema([
            { name: 'Home', item: '/' },
            { name: 'Programs', item: '/programs' }
          ]),
          getCourseSchema({
            title: 'D3 - Daily Discovery Digest',
            description: 'A continuous daily awareness initiative delivering knowledge, inspiration, and historic milestones.',
            url: 'https://pgtglobalnetwork.com/programs/d3'
          }),
          getCourseSchema({
            title: 'VoA - Voices of Ability',
            description: 'A storytelling series that showcases individuals who turned personal challenges into change.',
            url: 'https://pgtglobalnetwork.com/programs/voa'
          }),
          getCourseSchema({
            title: 'Seminarix - Digital Learning Seminars',
            description: 'Interactive educational webinars and workshops bringing tech and career guidance.',
            url: 'https://pgtglobalnetwork.com/programs/seminarix'
          })
        ]}
      />
      <style>
        {`
          @keyframes reveal-up {
            0% { opacity: 0; transform: translateY(24px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes shimmer-btn {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-reveal-up {
            animation: reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          .animate-shimmer-btn {
            animation: shimmer-btn 1.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
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
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">{t('programs.tagline')}</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {t('programs.title')}
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              {t('programs.description')}
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Programs Overview */}
      <section className="py-24 bg-card/25 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">{t('programs.portfolioTag')}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">
                {t('programs.portfolioTitle')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('programs.portfolioSubtitle')}
              </p>
            </div>
          </AnimatedCard>

          <div className="space-y-20">
            {programs.map((program, index) => {
              const theme = getTheme(program.id);
              return (
                <AnimatedCard key={program.id} animation="slideUp" delay={index * 150}>
                  <Link
                    to={`/programs/${program.id}`}
                    id={program.id}
                    className={`relative overflow-hidden bg-card border border-border backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-950/10 dark:shadow-none transition-all duration-300 group flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center cursor-pointer ${theme.shadow} ${theme.border} no-underline`}
                  >
                    {/* Subtle Theme Radial Glow */}
                    <div className={`absolute -inset-[1px] bg-gradient-to-br ${theme.glow} to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <div className="flex-1 w-full overflow-hidden rounded-2xl border border-border relative group">
                      <img
                        src={program.image}
                        alt={program.name}
                        className="w-full h-96 object-cover group-hover:scale-[1.04] group-hover:rotate-[0.5deg] transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Floating Duration Pill */}
                      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-md border border-border shadow-sm px-3.5 py-1.5 rounded-full text-[10px] font-bold text-foreground tracking-wider uppercase select-none">
                        ⏱️ {program.duration}
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full space-y-6 relative z-10 text-left">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 ${theme.iconBg} flex items-center justify-center rounded-2xl flex-shrink-0 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.06)] transition-all duration-300 ${theme.iconText}`}>
                          <program.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{program.name}</h3>
                          <p className="text-lg text-muted-foreground font-medium">{program.fullName}</p>
                        </div>
                      </div>
                      
                      <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                        {program.description}
                      </p>
                      
                      {/* Flex Wrapped Creative Feature Badges */}
                      <div className="flex flex-wrap gap-2">
                        {(program.features as string[]).map((feature, featureIndex) => (
                          <span 
                            key={featureIndex} 
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${theme.badge}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${theme.bullet} flex-shrink-0`} />
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      {/* Dashboard Metrics Sub-panel */}
                      <div className="bg-muted border border-border p-6 rounded-2xl transition-all duration-300 group-hover:bg-card group-hover:border-border w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                          <div className="pb-3 sm:pb-0">
                            <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase mb-1.5">{t('programs.impactTitle')}</h4>
                            <p className="text-foreground font-semibold text-sm leading-relaxed">{program.impact}</p>
                          </div>
                          <div className="pt-3 sm:pt-0 sm:pl-6">
                            <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase mb-1.5">{t('programs.durationTitle')}</h4>
                            <p className="text-foreground font-semibold text-sm leading-relaxed">{program.duration}</p>
                          </div>
                        </div>
                      </div>
                      
                      <span className="group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-btn pointer-events-none" />
                        {t('programs.learnMore')}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 duration-300" />
                      </span>
                    </div>
                  </Link>
                </AnimatedCard>
              );
            })}
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
              {t('common.explore').replace(/\[.*?\]\s*/g, '') === 'common.explore' ? 'Ready to Join a Program?' : t('common.explore')}
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              {t('about.principles.sustainability.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="group relative overflow-hidden w-full sm:w-auto bg-white text-slate-950 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-100 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                {t('careers.apply')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
              </Link>
              <a
                href="https://topmate.io/pranav_gujar/1355631?utm_source=public_profile&utm_campaign=pranav_gujar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-white/20 bg-white/5 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center"
              >
                {t('footer.contactUs').replace(/\[.*?\]\s*/g, '') === 'footer.contactUs' ? 'Start a Conversation' : t('footer.contactUs')}
              </a>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Programs;