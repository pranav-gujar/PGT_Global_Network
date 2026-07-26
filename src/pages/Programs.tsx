import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Zap, Brain, GraduationCap } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';


import Seminarix from '../assets/programs/Seminarix.png';
import D3 from '../assets/programs/D3.png';
import VoA from '../assets/programs/VoA.png';
import HED from '../assets/programs/HED.png';
import MotivMinds from '../assets/programs/MotiVMinds.png';

import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';

const Programs = () => {
  
  const loading = usePageLoading();
  
  // inside Programs.tsx
const location = useLocation();

useEffect(() => {
  if (location.hash) {
    const id = location.hash.replace("#", "");

    const scrollToEl = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // try immediately
    scrollToEl();
    // try again after render cycle
    const t = setTimeout(scrollToEl, 300);

    return () => clearTimeout(t);
  }
}, [location]);





  const getTheme = (id: string) => {
    switch (id) {
      case 'd3':
        return {
          badge: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 hover:bg-indigo-100/30',
          glow: 'from-indigo-500/[0.03]',
          iconText: 'text-indigo-600',
          iconBg: 'bg-indigo-50/80',
          shadow: 'hover:shadow-indigo-500/[0.04]',
          bullet: 'bg-indigo-500',
          border: 'hover:border-indigo-500/30'
        };
      case 'voa':
        return {
          badge: 'bg-blue-50/70 text-blue-700 border-blue-100/50 hover:bg-blue-100/30',
          glow: 'from-blue-500/[0.03]',
          iconText: 'text-blue-600',
          iconBg: 'bg-blue-50/80',
          shadow: 'hover:shadow-blue-500/[0.04]',
          bullet: 'bg-blue-500',
          border: 'hover:border-blue-500/30'
        };
      case 'seminarix':
        return {
          badge: 'bg-purple-50/70 text-purple-700 border-purple-100/50 hover:bg-purple-100/30',
          glow: 'from-purple-500/[0.03]',
          iconText: 'text-purple-600',
          iconBg: 'bg-purple-50/80',
          shadow: 'hover:shadow-purple-500/[0.04]',
          bullet: 'bg-purple-500',
          border: 'hover:border-purple-500/30'
        };
      case 'motivminds':
        return {
          badge: 'bg-pink-50/70 text-pink-700 border-pink-100/50 hover:bg-pink-100/30',
          glow: 'from-pink-500/[0.03]',
          iconText: 'text-pink-600',
          iconBg: 'bg-pink-50/80',
          shadow: 'hover:shadow-pink-500/[0.04]',
          bullet: 'bg-pink-500',
          border: 'hover:border-pink-500/30'
        };
      case 'hed':
        return {
          badge: 'bg-emerald-50/70 text-emerald-700 border-emerald-100/50 hover:bg-emerald-100/30',
          glow: 'from-emerald-500/[0.03]',
          iconText: 'text-emerald-600',
          iconBg: 'bg-emerald-50/80',
          shadow: 'hover:shadow-emerald-500/[0.04]',
          bullet: 'bg-emerald-500',
          border: 'hover:border-emerald-500/30'
        };
      default:
        return {
          badge: 'bg-slate-50/70 text-slate-700 border-slate-100/50 hover:bg-slate-100/30',
          glow: 'from-indigo-500/[0.03]',
          iconText: 'text-indigo-600',
          iconBg: 'bg-slate-50/80',
          shadow: 'hover:shadow-indigo-500/[0.04]',
          bullet: 'bg-indigo-500',
          border: 'hover:border-indigo-500/30'
        };
    }
  };

  const programs = [
    {
      id: 'd3',
      name: 'D3 Program',
      fullName: 'Daily Discovery Digest',
      icon: Target,
      description: 'A flagship daily inspiration series delivering knowledge, awareness, and impactful stories to students.',
      features: [
        'Daily Instagram & Facebook Stories',
        'National & International Day Highlights',
        'Historical Milestones',
        'Great Personalities’ Anniversaries',
        'Real-Life Impact Stories',
        'Discover the Extraordinary Everyday'
      ],
      impact: '10,000+ daily story viewers and learners engaged',
      duration: 'Continuous daily program',
      image: D3
    },
    {
      id: 'voa',
      name: 'VoA Initiative',
      fullName: 'Voices of Ability',
      icon: Users,
      description: 'A storytelling series highlighting individuals who turned challenges into change and built impact.',
      features: [
        'Life Journey Recordings',
        'Empathy Building Stories',
        'Disability & Ability Awareness',
        'Video Episodes Published Online',
        'Empowerment Through Storytelling',
        'Inspiration for Social Change'
      ],
      impact: 'Dozens of powerful journeys shared and celebrated',
      duration: 'Continuous storytelling initiative',
      image: VoA
    },
    {
      id: 'seminarix',
      name: 'Seminarix',
      fullName: 'Seminar Series for Students',
      icon: GraduationCap,
      description: 'On-ground seminar sessions empowering students with academics, motivation, and wellness tools.',
      features: [
        'Motivational Talks',
        'Academic Strategies',
        'Mental Wellness Guidance',
        'Exam Preparation Techniques',
        'Interactive School & Hostel Sessions',
        'Real-Life Stories Sharing'
      ],
      impact: 'Hundreds of students guided through school and hostel sessions',
      duration: 'Continuous seminar series',
      image: Seminarix
    },
    {
      id: 'motivminds',
      name: 'MotivMinds',
      fullName: 'One-Minute Empowerment',
      icon: Brain,
      description: 'A video series sharing short and inspiring one-minute messages of motivation and real-world wisdom.',
      features: [
        'One-Minute Videos',
        'Personal Growth Insights',
        'Real-World Experience Sharing',
        'Motivational Short Films',
        'Student Empowerment Content',
        'Available on YouTube & Social Media'
      ],
      impact: 'Thousands inspired through one-minute empowerment content',
      duration: 'Continuous program',
      image: MotivMinds
    },
    {
      id: 'hed',
      name: 'HED Program',
      fullName: 'Happy Eco Diwali',
      icon: Zap,
      description: 'The longest-running campaign promoting eco-friendly Diwali celebrations through awareness and innovation.',
      features: [
        'Eco-Friendly Celebrations',
        'Awareness Campaigns',
        'Innovation Contest',
        'Tree Plantation Drives',
        'Mission ENOSAVE Initiative',
        'Student & Community Participation'
      ],
      impact: 'Thousands engaged annually in eco-friendly Diwali celebrations',
      duration: 'Annual recurring campaign',
      image: HED
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-28 bg-slate-50/30 overflow-x-hidden">
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
              className="inline-flex items-center gap-2 bg-white/95 border border-slate-200/60 px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.03)] mb-8 animate-reveal-up backdrop-blur-md hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:border-indigo-400/40 hover:-translate-y-[1px] transform transition-all duration-300 pointer-events-auto cursor-pointer"
              style={{ animationDelay: '100ms' }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">PGT Global Core Initiatives</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              Our Programs
            </h1>
            <p 
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              Comprehensive initiatives designed to transform lives and communities through purposeful growth
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Programs Overview */}
      <section className="py-24 bg-white border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">portfolio</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
                Transformative Programs for Every Journey
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                From digital transformation to personal development, our programs are designed to meet diverse needs and create lasting impact.
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
                    className={`relative overflow-hidden bg-white/65 border border-slate-200/50 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-100/30 transition-all duration-300 group flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center cursor-pointer ${theme.shadow} ${theme.border} no-underline`}
                  >
                    {/* Subtle Theme Radial Glow */}
                    <div className={`absolute -inset-[1px] bg-gradient-to-br ${theme.glow} to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <div className="flex-1 w-full overflow-hidden rounded-2xl border border-slate-200/50 relative group">
                      <img
                        src={program.image}
                        alt={program.name}
                        className="w-full h-96 object-cover group-hover:scale-[1.04] group-hover:rotate-[0.5deg] transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Floating Duration Pill */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200/40 shadow-sm px-3.5 py-1.5 rounded-full text-[10px] font-bold text-slate-700 tracking-wider uppercase select-none">
                        ⏱️ {program.duration}
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full space-y-6 relative z-10 text-left">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 ${theme.iconBg} flex items-center justify-center rounded-2xl flex-shrink-0 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.06)] transition-all duration-300 ${theme.iconText}`}>
                          <program.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{program.name}</h3>
                          <p className="text-lg text-slate-500 font-medium">{program.fullName}</p>
                        </div>
                      </div>
                      
                      <p className="text-lg text-slate-600 leading-relaxed font-normal">
                        {program.description}
                      </p>
                      
                      {/* Flex Wrapped Creative Feature Badges */}
                      <div className="flex flex-wrap gap-2">
                        {program.features.map((feature, featureIndex) => (
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
                      <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl transition-all duration-300 group-hover:bg-white group-hover:border-slate-200/60 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60">
                          <div className="pb-3 sm:pb-0">
                            <h4 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Impact Reach</h4>
                            <p className="text-slate-700 font-semibold text-sm leading-relaxed">{program.impact}</p>
                          </div>
                          <div className="pt-3 sm:pt-0 sm:pl-6">
                            <h4 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Program Duration</h4>
                            <p className="text-slate-700 font-semibold text-sm leading-relaxed">{program.duration}</p>
                          </div>
                        </div>
                      </div>
                      
                      <span className="group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-btn pointer-events-none" />
                        Learn More
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
              Ready to Join a Program?
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              Take the next step in your transformation journey. Our programs are designed to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/contact"
                className="group relative overflow-hidden w-full sm:w-auto bg-white text-slate-950 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-100 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Join Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
              </a>
              <a
                href="https://topmate.io/pranav_gujar/1355631?utm_source=public_profile&utm_campaign=pranav_gujar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-white/20 bg-white/5 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center"
              >
                Start a Conversation
              </a>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Programs;