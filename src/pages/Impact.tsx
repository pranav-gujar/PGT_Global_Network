import React from 'react';
import { Users, BookOpen, Hourglass, Star, Handshake, Smile } from 'lucide-react';
import CountUpNumber from '../components/CountUpNumber';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';

import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';


import Shraddha_Sherekar from '../assets/testimonials/ss.jpg';
import Sharayu_Dole from '../assets/testimonials/sd.jpg';
import Grishma_Chowdary from '../assets/testimonials/gc.jpg';
import Ashish_Kamble from '../assets/testimonials/ak.jpg';
import Vaibhav_Pandit from '../assets/testimonials/vp.png';



const Impact = () => {
  const loading = usePageLoading();

  const impactStats = [
    {
      icon: Users,
      number: 10000,
      suffix: '+',
      label: 'Lives Reached',
      description: 'Students and individuals engaged through our programs, seminars, and campaigns.',
      color: 'text-blue-600'
    },
    {
      icon: BookOpen,
      number: 8,
      suffix: '+',
      label: 'Programs & Campaigns',
      description: 'Flagship initiatives including D3, Seminarix, MotivMinds, Voices of Ability, and HED.',
      color: 'text-green-600'
    },
    {
      icon: Hourglass,
      number: 7,
      suffix: '+',
      label: 'Years of Impact',
      description: 'Empowering students and communities since our founding year.',
      color: 'text-purple-600'
    },
    {
      icon: Star,
      number: 200,
      suffix: '+',
      label: 'Success Stories',
      description: 'Participants who shared real transformations and positive feedback.',
      color: 'text-orange-600'
    },
    {
      icon: Handshake,
      number: 50,
      suffix: '+',
      label: 'Volunteer Leaders',
      description: 'Dedicated changemakers who contributed as volunteers, interns, and core team members.',
      color: 'text-pink-600'
    },
    {
      icon: Smile,
      number: 4.9,
      suffix: '/5',
      decimals: 1,
      label: 'Satisfaction Score',
      description: 'Average rating from students and participants across our initiatives.',
      color: 'text-yellow-600'
    }
  ];

  const testimonials = [
    {
      name: 'Shraddha Sherekar',
      role: 'D3 Program Graduate',
      country: 'Canada',
      image: Shraddha_Sherekar,
      quote: 'PGT Global Network showed me that leadership isn’t about titles—it’s about responsibility. Through their programs, I gained confidence, clarity, and a sense of purpose that I carry with me every day.',
      impact: 'Launched successful online business'
    },
    {
      name: 'Ashish Kamble',
      role: 'MotivMinds Participant',
      country: 'Mexico',
      image: Ashish_Kamble,
      quote: 'The initiatives of PGT are unlike anything I’ve experienced before. They combine real-world learning with inspiration, and the result is transformation you can actually feel in your life.',
      impact: 'Became a certified wellness coach'
    },
    {
      name: 'Sharayu Dole',
      role: 'HED Program Scholar',
      country: 'Nigeria',
      image: Sharayu_Dole,
      quote: 'Joining PGT’s programs helped me discover my strengths and channel them into meaningful action. I didn’t just learn—I grew, connected, and contributed to something bigger than myself.',
      impact: 'Earned Masters degree with distinction'
    },
    {
      name: 'Vaibhav Pandit',
      role: 'Seminarix Workshop Leader',
      country: 'Australia',
      image: Vaibhav_Pandit,
      quote: 'What makes PGT special is its authenticity. Every initiative is built with heart, vision, and commitment. It’s not just about creating leaders; it’s about creating change-makers.',
      impact: 'Expanded professional network by 300%'
    },
    {
      name: 'Grishma Chowdary',
      role: 'Multi-Program Participant',
      country: 'Egypt',
      image: Grishma_Chowdary,
      quote: 'I’ve partnered with many organizations, but the energy and professionalism of PGT Global Network is unmatched. They’re building a movement, not just running programs.',
      impact: 'Founded nonprofit organization'
    }
  ];

  const programImpact = [
    {
      program: 'D3 Program',
      participants: '2,500+',
      successStories: 'Started 150+ businesses',
      globalReach: '25 countries',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      program: 'VoA Initiative',
      participants: '1,800+',
      successStories: 'Led 300+ community projects',
      globalReach: '20 countries',
      color: 'bg-green-100 text-green-800'
    },
    {
      program: 'Seminarix',
      participants: '5,000+',
      successStories: '90% career advancement',
      globalReach: '35 countries',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      program: 'MotivMinds',
      participants: '3,200+',
      successStories: '85% improved wellbeing',
      globalReach: '30 countries',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      program: 'HED Program',
      participants: '1,200+',
      successStories: '95% graduation rate',
      globalReach: '15 countries',
      color: 'bg-pink-100 text-pink-800'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  const getGlowColor = (color: string) => {
    if (color.includes('blue')) return 'from-blue-500/[0.03]';
    if (color.includes('green')) return 'from-emerald-500/[0.03]';
    if (color.includes('purple')) return 'from-purple-500/[0.03]';
    if (color.includes('orange')) return 'from-orange-500/[0.03]';
    if (color.includes('pink')) return 'from-pink-500/[0.03]';
    if (color.includes('yellow')) return 'from-yellow-500/[0.03]';
    return 'from-indigo-500/[0.03]';
  };

  const getBorderColor = (color: string) => {
    if (color.includes('blue')) return 'hover:border-blue-500/25 hover:shadow-blue-500/[0.02]';
    if (color.includes('green')) return 'hover:border-emerald-500/25 hover:shadow-emerald-500/[0.02]';
    if (color.includes('purple')) return 'hover:border-purple-500/25 hover:shadow-purple-500/[0.02]';
    if (color.includes('orange')) return 'hover:border-orange-500/25 hover:shadow-orange-500/[0.02]';
    if (color.includes('pink')) return 'hover:border-pink-500/25 hover:shadow-pink-500/[0.02]';
    if (color.includes('yellow')) return 'hover:border-yellow-500/25 hover:shadow-yellow-500/[0.02]';
    return 'hover:border-indigo-500/25 hover:shadow-indigo-500/[0.02]';
  };

  const getIconBg = (color: string) => {
    if (color.includes('blue')) return 'bg-blue-50';
    if (color.includes('green')) return 'bg-emerald-50';
    if (color.includes('purple')) return 'bg-purple-50';
    if (color.includes('orange')) return 'bg-orange-50';
    if (color.includes('pink')) return 'bg-pink-50';
    if (color.includes('yellow')) return 'bg-yellow-50';
    return 'bg-indigo-50';
  };

  const getIconColor = (color: string) => {
    if (color.includes('blue')) return 'text-blue-600';
    if (color.includes('green')) return 'text-emerald-600';
    if (color.includes('purple')) return 'text-purple-600';
    if (color.includes('orange')) return 'text-orange-600';
    if (color.includes('pink')) return 'text-pink-600';
    if (color.includes('yellow')) return 'text-yellow-600';
    return 'text-indigo-600';
  };

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
          .swiper-pagination-bullet-active {
            background: #6366f1 !important;
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
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">PGT Global Growth Outcomes</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              Our Impact
            </h1>
            <p
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              Measuring success through the lives we've transformed and the communities we've empowered
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Impact Statistics */}
      <section className="py-24 bg-white border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">analytics</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
                Impact by Numbers
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Six years of dedication translated into measurable, meaningful change
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => {
              const glow = getGlowColor(stat.color);
              const border = getBorderColor(stat.color);
              const iconBg = getIconBg(stat.color);
              const iconText = getIconColor(stat.color);
              return (
                <AnimatedCard key={index} animation="slideUp" delay={index * 120}>
                  <div className={`relative overflow-hidden bg-slate-50/40 border border-slate-200/50 p-8 rounded-2xl hover:bg-white hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 group flex flex-col justify-between cursor-pointer ${border}`}>
                    {/* Radial Glow Highlight */}
                    <div className={`absolute -inset-[1px] bg-gradient-to-br ${glow} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconText} flex items-center justify-center mb-6 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.04)] transition-all duration-300`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                        <CountUpNumber
                          end={stat.number}
                          suffix={stat.suffix || ''}
                          decimals={stat.decimals || 0}
                          duration={2500}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-3">{stat.label}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{stat.description}</p>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Impact (Preserved Commented Block) */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Program-Specific Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each program creates unique value and measurable outcomes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programImpact.map((program, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 200}>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${program.color}`}>
                  {program.program}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-semibold text-gray-900">{program.participants}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Stories</span>
                    <span className="font-semibold text-gray-900">{program.successStories}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Global Reach</span>
                    <span className="font-semibold text-gray-900">{program.globalReach}</span>
                  </div>
                </div>
              </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="py-24 bg-slate-50/20 border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">feedbacks</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
                Voices of Transformation
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Real stories from real people whose lives have been transformed through our programs
              </p>
            </div>
          </AnimatedCard>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            className="pb-14"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="relative overflow-hidden bg-white border border-slate-200/60 p-8 rounded-2xl hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-1.5 transform transition-all duration-300 group flex flex-col justify-between cursor-pointer h-full">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{testimonial.name}</h3>
                        {/* <p className="text-gray-600 text-sm">{testimonial.role}</p> */}
                        {/* <p className="text-gray-500 text-sm">{testimonial.country}</p> */}
                      </div>
                    </div>

                    <blockquote className="text-slate-600 italic mb-6 leading-relaxed text-sm">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>

                  <div className="bg-indigo-50/50 border border-indigo-100/20 p-3 rounded-lg relative z-10">
                    <p className="text-indigo-800 font-semibold text-xs leading-none">
                      {/* Impact: {testimonial.impact} */}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Future Goals */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10">
          <Background />

          {/* Spotlight glowing gradients */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Our 2030 Vision
            </h2>
            <p className="text-lg md:text-xl mb-16 max-w-3xl mx-auto text-slate-400 leading-relaxed font-normal">
              Building on our success, we're committed to expanding our impact and reaching even more lives
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCard animation="slideUp" delay={0}>
                <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-indigo-500/35 hover:shadow-[0_20px_40px_rgba(99,102,241,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                  <div className="text-4xl sm:text-5xl font-black text-indigo-400 mb-2 tracking-tight">
                    <CountUpNumber end={100} suffix="K+" duration={3000} />
                  </div>
                  <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">Lives to Transform</div>
                </div>
              </AnimatedCard>

              <AnimatedCard animation="slideUp" delay={150}>
                <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-emerald-500/35 hover:shadow-[0_20px_40px_rgba(16,185,129,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2 tracking-tight">
                    <CountUpNumber end={100} suffix="+" duration={3000} />
                  </div>
                  <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">Countries to Reach</div>
                </div>
              </AnimatedCard>

              <AnimatedCard animation="slideUp" delay={300}>
                <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-purple-500/35 hover:shadow-[0_20px_40px_rgba(139,92,246,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                  <div className="text-4xl sm:text-5xl font-black text-purple-400 mb-2 tracking-tight">
                    <CountUpNumber end={1} suffix="M+" duration={3000} />
                  </div>
                  <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2 font-medium">Indirect Beneficiaries</div>
                </div>
              </AnimatedCard>

              <AnimatedCard animation="slideUp" delay={450}>
                <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-pink-500/35 hover:shadow-[0_20px_40px_rgba(244,63,94,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                  <div className="text-4xl sm:text-5xl font-black text-pink-400 mb-2 tracking-tight">
                    <CountUpNumber end={50} suffix="+" duration={3000} />
                  </div>
                  <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">New Programs</div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Impact;