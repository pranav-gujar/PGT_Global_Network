import React from 'react';
import { Target, Eye, Heart, Users, Globe, Award } from 'lucide-react';
import founderImg from '../assets/founderImg.jpg';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '..//components/Background';

import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';

const About = () => {
  const loading = usePageLoading();

  const foundingPrinciples = [
    {
      icon: Target,
      title: 'Purpose-Driven',
      description: 'Every initiative begins with a mission to create real and lasting impact.'
    },
    {
      icon: Users,
      title: 'People-Centered',
      description: 'We believe in human potential and invest in developing individuals.'
    },
    {
      icon: Globe,
      title: 'Global Vision',
      description: 'Connecting communities across continents, building a united world of learners and leaders.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Striving for the highest standards in our programs, partnerships, and impact.'
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
              className="inline-flex items-center gap-2 bg-white/95 border border-slate-200/60 px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.03)] mb-8 animate-reveal-up backdrop-blur-md hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:border-indigo-400/40 hover:-translate-y-[1px] transform transition-all duration-300 pointer-events-auto cursor-pointer"
              style={{ animationDelay: '100ms' }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">PGT Global Network Story</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              About PGT Global Network
            </h1>
            <p
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up animate-delay-150"
              style={{ animationDelay: '400ms' }}
            >
              Transforming lives through purpose, growth, and meaningful change since 2019
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Mission & Vision */}
      <section className="py-24 bg-white border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatedCard animation="slideLeft">
              <div className="bg-slate-50/40 border border-slate-100 p-8 md:p-10 rounded-2xl hover:bg-white hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-1 transform transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-xl mb-8 group-hover:scale-105 transition-transform duration-300 text-indigo-600">
                    <Target className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Our Mission</h2>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    To empower students, individuals, and organizations worldwide through innovative programs, leadership-driven growth, and purposeful action that creates lasting community impact.
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard animation="slideRight">
              <div className="bg-slate-50/40 border border-slate-100 p-8 md:p-10 rounded-2xl hover:bg-white hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-1 transform transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="w-12 h-12 bg-purple-50 flex items-center justify-center rounded-xl mb-8 group-hover:scale-105 transition-transform duration-300 text-purple-600">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Our Vision</h2>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    To be a global network where purpose-driven growth transforms lives, enabling every individual and organization to unlock their true potential and contribute meaningfully to society.
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-50/20 border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">Core Tenets</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              The fundamental principles that guide our work and define who we are
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCard animation="slideUp" delay={0}>
              <div className="relative overflow-hidden bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-2 transform transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-xl mb-6 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(59,130,246,0.06)] transition-all duration-300 text-blue-600">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Positivity</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We believe that meaningful work begins with a clear purpose. Every initiative
                    we undertake is driven by the intention to create positive, lasting impact.
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard animation="slideUp" delay={150}>
              <div className="relative overflow-hidden bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-2 transform transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-green-500/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-green-50 flex items-center justify-center rounded-xl mb-6 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(16,185,129,0.06)] transition-all duration-300 text-green-600">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Growth</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We foster continuous learning and development, believing that growth is
                    essential for both personal fulfillment and organizational success.
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard animation="slideUp" delay={300}>
              <div className="relative overflow-hidden bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-2 transform transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-purple-500/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-50 flex items-center justify-center rounded-xl mb-6 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(139,92,246,0.06)] transition-all duration-300 text-purple-600">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Transformation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We catalyze positive change that transforms lives, communities, and organizations,
                    creating ripple effects that extend far beyond our direct reach.
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="fadeIn">
            <div className="relative bg-white border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-100/50 p-8 md:p-16 max-w-4xl mx-auto group">
              {/* Subtle visual glow inside the card */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-3xl pointer-events-none" />

              <div className="text-center mb-12 relative z-10">
                <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">MESSAGE FROM LEADERSHIP</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-8 tracking-tight">
                  A Note from Our Founder
                </h2>
                <div className="w-28 h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-md">
                  <img
                    src={founderImg}
                    alt="Pranav Gujar"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Pranav Gujar</h3>
                <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Founder & CEO, PGT Global Network</p>
              </div>

              <div className="max-w-3xl mx-auto relative z-10">
                <blockquote className="text-lg md:text-xl text-slate-700 leading-relaxed text-center italic font-normal mb-8 border-l-4 border-indigo-500/20 pl-4 py-2">
                  "When I founded PGT Global Network, the vision was simple yet powerful: to build a space where purpose turns into action, where growth is cultivated through real-world learning, and where transformation becomes a shared journey."
                </blockquote>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mt-6">
                  What began as a small student-led initiative has now grown into a global network that has touched lives across 15+ countries. Along the way, we’ve learned, adapted, and stayed true to our core belief — that real change starts with empowering people.
                </p>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mt-6">
                  Today, PGT continues to stand for empowerment, awareness, and action. Every program we launch, every partnership we form, and every step we take brings us closer to a world where purposeful growth is not an exception, but a way of life.
                </p>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mt-6">
                  Thank you for being part of this journey. Together, we’re not just changing lives — we’re transforming the world, one purpose at a time.
                </p>

                <div className="mt-12 text-center pt-8 border-t border-slate-100">
                  <p className="text-slate-500 text-sm font-medium">With gratitude and excitement for what's ahead,</p>
                  <p className="text-xl font-bold text-slate-900 mt-2 font-mono">Pranav Gujar</p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Founding Principles */}
      <section className="py-24 bg-slate-50/20 border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">PHILOSOPHY</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
              Our Founding Principles
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              The core beliefs that have guided us from day one
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {foundingPrinciples.map((principle, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 150}>
                <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer h-full">
                  <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-xl flex-shrink-0 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.06)] transition-all duration-300 text-indigo-600">
                      <principle.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                        {principle.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
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
              Join Our Mission of Positive Change
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-slate-400 leading-relaxed font-normal">
              From our founding vision to today, we continue to empower individuals and communities worldwide.
              Discover how you can be part of this transformative journey.
            </p>
            <p className="text-base text-slate-400 max-w-2xl mx-auto font-medium">
              Learn, grow, and create meaningful impact with us.
            </p>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default About;