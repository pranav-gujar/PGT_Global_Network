import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, TrendingUp, Zap, Users, Globe, Award, Star, BookOpen, Hourglass } from 'lucide-react';
import CountUpNumber from '../components/CountUpNumber';
import HeroBackground from '../components/HeroBackground';
import AnimatedCard from '../components/AnimatedCard';
import Background from '../components/Background';

import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';
import { articles } from '../data/articles';

import Seminarix from '../assets/programs/Seminarix.png';
import D3 from '../assets/programs/D3.png';
import VoA from '../assets/programs/VoA.png';


const Home = () => {
  const loading = usePageLoading();

  const coreValues = [
    {
      icon: Target,
      title: 'Positivity',
      description: 'Every initiative starts with a clear purpose and a passionate drive to create meaningful change.',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'We nurture continuous learning and leadership, helping individuals and organizations reach their potential.',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Transformation',
      description: 'We inspire positive change that uplifts lives, strengthens communities, and shapes a better world.',
      color: 'text-purple-600'
    }
  ];

  const impactStats = [
    { number: 10000, label: 'Lives Impacted', icon: Users, suffix: '+' },
    { number: 200, label: 'Success Stories', icon: Star, suffix: '+' },
    { number: 8, label: 'Programs & Campaigns', icon: BookOpen, suffix: '+' },
    { number: 6, label: 'Years of Excellence', icon: Hourglass, suffix: '+' }
  ];


  const programs = [
    {
      id: 'd3',
      name: 'D3 Program',
      description: 'A flagship daily inspiration series delivering knowledge, awareness, and impactful stories to students.',
      image: D3
    },
    {
      id: 'voa',
      name: 'VoA Initiative',
      description: 'A storytelling series highlighting individuals who turned challenges into change and built impact.',
      image: VoA
    },
    {
      id: 'seminarix',
      name: 'Seminarix',
      description: 'On-ground seminar sessions empowering students with academics, motivation, and wellness tools',
      image: Seminarix
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
        <section className="relative overflow-hidden min-h-[calc(100vh-112px)] flex items-center justify-center pt-6 pb-12 lg:pt-10 lg:pb-16">
          <HeroBackground />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
            {/* Tagline Badge */}
            <div
              className="inline-flex items-center gap-2 bg-white/95 border border-slate-200/60 px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.03)] mb-6 animate-reveal-up backdrop-blur-md hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:border-indigo-400/40 hover:-translate-y-[1px] transform transition-all duration-300 pointer-events-auto cursor-pointer"
              style={{ animationDelay: '100ms' }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Global Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-5xl mx-auto">
              <span className="block animate-reveal-up" style={{ animationDelay: '250ms' }}>Transforming Lives Through</span>
              <span className="block mt-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-black animate-reveal-up" style={{ animationDelay: '400ms' }}>
                Positivity, Growth & Transformation
              </span>
            </h1>

            <p
              className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '550ms' }}
            >
              Empowering individuals and organizations worldwide through innovative programs,
              sustainable growth, and purposeful transformation.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-reveal-up w-full sm:w-auto"
              style={{ animationDelay: '700ms' }}
            >
              <Link
                to="/programs"
                className="group relative overflow-hidden w-full sm:w-56 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
                Explore Programs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-48 border border-slate-200 bg-white/80 backdrop-blur-md text-slate-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:border-slate-300 hover:text-indigo-600 hover:-translate-y-[2px] hover:shadow-sm hover:shadow-indigo-500/5 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </AnimatedCard>

      {/* Core Values */}
      <section className="py-24 bg-white border-y border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Foundation Principles</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Three fundamental principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 150}>
                <div className="relative overflow-hidden bg-slate-50/40 border border-slate-100 p-8 rounded-2xl hover:bg-white hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-2 transform transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                  {/* Subtle Theme Glow */}
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.06)] transition-all duration-300 ${value.color}`}>
                      <value.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10">
          <Background />

          {/* Ambient deep orbs */}
          <div className="absolute top-[20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none"></div>
          <div className="absolute bottom-[20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-400 mb-4 tracking-wider uppercase">GLOBAL REACH</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Our Global Impact
              </h2>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Six years of dedication, innovation, and transformation
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <AnimatedCard key={index} animation="zoomIn" delay={index * 120}>
                  <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-indigo-500/35 hover:shadow-[0_20px_40px_rgba(99,102,241,0.06)] transition-all duration-300 group h-full flex flex-col items-center text-center justify-center cursor-pointer">
                    {/* Glass sheen highlight */}
                    <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />

                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                      <stat.icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                      <CountUpNumber
                        end={stat.number}
                        suffix={stat.suffix || ''}
                        duration={2500}
                      />
                    </div>
                    <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">{stat.label}</div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      </AnimatedCard>

      {/* Programs Preview */}
      <section className="py-24 bg-slate-50/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">INITIATIVES</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
              Our Programs
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Innovative initiatives designed to create lasting impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 150}>
                <Link
                  to={`/programs/${program.id}`}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-2 transform transition-all duration-300 group flex flex-col h-full justify-between cursor-pointer no-underline text-left"
                >
                  <div className="overflow-hidden relative h-52 bg-slate-100">
                    <img
                      src={program.image}
                      alt={program.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                        {program.name}
                      </h3>
                      <p className="text-slate-650 mb-6 text-sm leading-relaxed line-clamp-3 font-normal">
                        {program.description}
                      </p>
                    </div>
                    <span
                      className="text-indigo-600 font-semibold hover:text-indigo-800 inline-flex items-center text-sm gap-1 group/link mt-auto w-fit"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1 duration-300" />
                    </span>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/programs"
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
              View All Programs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles Preview */}
      <section className="py-24 bg-slate-50/50 border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">insights</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
                Latest Articles
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Stay updated with our latest articles, community transformations, and youth technology initiatives.
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((post, index) => (
              <AnimatedCard key={post.id} animation="slideUp" delay={index * 150}>
                <Link
                  to={`/articles/${post.slug}`}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-2 transform transition-all duration-300 group flex flex-col h-full justify-between cursor-pointer no-underline text-left"
                >
                  <div className="overflow-hidden relative h-52 bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span className="text-slate-400 text-xs font-semibold">{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-650 mb-6 text-sm leading-relaxed line-clamp-3 font-normal">
                        {post.excerpt}
                      </p>
                    </div>

                    <span
                      className="text-indigo-600 font-semibold hover:text-indigo-800 inline-flex items-center text-sm gap-1 group/link mt-auto w-fit"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1 duration-300" />
                    </span>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/articles"
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
              View All Articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
            </Link>
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
              Ready to Transform Your Future?
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              Join thousands of individuals and organizations who have experienced growth through our programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/careers"
                className="group relative overflow-hidden w-full sm:w-auto bg-white text-slate-950 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-100 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Join Our Team
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto border border-white/20 bg-white/5 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Home;
