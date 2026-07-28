import React from 'react';
import { Users, BookOpen, Hourglass, Star, Handshake, Smile } from 'lucide-react';
import CountUpNumber from '../components/CountUpNumber';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

  const getTranslation = (key: string, fallback: any) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const impactStats = [
    {
      icon: Users,
      number: 10000,
      suffix: '+',
      label: getTranslation('home.stats.lives', 'Lives Reached'),
      description: getTranslation('impact.stats.lives.desc', 'Students and individuals engaged through our programs, seminars, and campaigns.'),
      color: 'text-blue-600'
    },
    {
      icon: BookOpen,
      number: 8,
      suffix: '+',
      label: getTranslation('home.stats.programs', 'Programs & Campaigns'),
      description: getTranslation('impact.stats.programs.desc', 'Flagship initiatives including D3, Seminarix, MotivMinds, Voices of Ability, and HED.'),
      color: 'text-green-600'
    },
    {
      icon: Hourglass,
      number: 7,
      suffix: '+',
      label: getTranslation('home.stats.years', 'Years of Impact'),
      description: getTranslation('impact.stats.years.desc', 'Empowering students and communities since our founding year.'),
      color: 'text-purple-600'
    },
    {
      icon: Star,
      number: 200,
      suffix: '+',
      label: getTranslation('home.stats.stories', 'Success Stories'),
      description: getTranslation('impact.stats.stories.desc', 'Participants who shared real transformations and positive feedback.'),
      color: 'text-orange-600'
    },
    {
      icon: Handshake,
      number: 50,
      suffix: '+',
      label: getTranslation('impact.stats.volunteers', 'Volunteer Leaders'),
      description: getTranslation('impact.stats.volunteers.desc', 'Dedicated changemakers who contributed as volunteers, interns, and core team members.'),
      color: 'text-pink-600'
    },
    {
      icon: Smile,
      number: 4.9,
      suffix: '/5',
      decimals: 1,
      label: getTranslation('impact.stats.satisfaction', 'Satisfaction Score'),
      description: getTranslation('impact.stats.satisfaction.desc', 'Average rating from students and participants across our initiatives.'),
      color: 'text-yellow-600'
    }
  ];

  const testimonials = [
    {
      name: 'Shraddha Sherekar',
      role: getTranslation('impact.testimonials.ss.role', 'D3 Program Graduate'),
      country: 'Canada',
      image: Shraddha_Sherekar,
      quote: getTranslation('impact.testimonials.ss.quote', 'PGT Global Network showed me that leadership isn’t about titles—it’s about responsibility. Through their programs, I gained confidence, clarity, and a sense of purpose that I carry with me every day.'),
      impact: getTranslation('impact.testimonials.ss.impact', 'Launched successful online business')
    },
    {
      name: 'Ashish Kamble',
      role: getTranslation('impact.testimonials.ak.role', 'MotivMinds Participant'),
      country: 'Mexico',
      image: Ashish_Kamble,
      quote: getTranslation('impact.testimonials.ak.quote', 'The initiatives of PGT are unlike anything I’ve experienced before. They combine real-world learning with inspiration, and the result is transformation you can actually feel in your life.'),
      impact: getTranslation('impact.testimonials.ak.impact', 'Became a certified wellness coach')
    },
    {
      name: 'Sharayu Dole',
      role: getTranslation('impact.testimonials.sd.role', 'HED Program Scholar'),
      country: 'Nigeria',
      image: Sharayu_Dole,
      quote: getTranslation('impact.testimonials.sd.quote', 'Joining PGT’s programs helped me discover my strengths and channel them into meaningful action. I didn’t just learn—I grew, connected, and contributed to something bigger than myself.'),
      impact: getTranslation('impact.testimonials.sd.impact', 'Earned Masters degree with distinction')
    },
    {
      name: 'Vaibhav Pandit',
      role: getTranslation('impact.testimonials.vp.role', 'Seminarix Workshop Leader'),
      country: 'Australia',
      image: Vaibhav_Pandit,
      quote: getTranslation('impact.testimonials.vp.quote', 'What makes PGT special is its authenticity. Every initiative is built with heart, vision, and commitment. It’s not just about creating leaders; it’s about creating change-makers.'),
      impact: getTranslation('impact.testimonials.vp.impact', 'Expanded professional network by 300%')
    },
    {
      name: 'Grishma Chowdary',
      role: getTranslation('impact.testimonials.gc.role', 'Multi-Program Participant'),
      country: 'Egypt',
      image: Grishma_Chowdary,
      quote: getTranslation('impact.testimonials.gc.quote', 'I’ve partnered with many organizations, but the energy and professionalism of PGT Global Network is unmatched. They’re building a movement, not just running programs.'),
      impact: getTranslation('impact.testimonials.gc.impact', 'Founded nonprofit organization')
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
    if (color.includes('blue')) return 'bg-blue-50/10 dark:bg-blue-950/20 border border-blue-200/20';
    if (color.includes('green')) return 'bg-emerald-50/10 dark:bg-emerald-950/20 border border-emerald-200/20';
    if (color.includes('purple')) return 'bg-purple-50/10 dark:bg-purple-950/20 border border-purple-200/20';
    if (color.includes('orange')) return 'bg-orange-50/10 dark:bg-orange-950/20 border border-orange-200/20';
    if (color.includes('pink')) return 'bg-pink-50/10 dark:bg-pink-950/20 border border-pink-200/20';
    if (color.includes('yellow')) return 'bg-yellow-50/10 dark:bg-yellow-950/20 border border-yellow-200/20';
    return 'bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20';
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
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">{t('home.impactTag')}</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {t('home.impactTitle')}
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              {t('home.impactSubtitle')}
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Impact Statistics */}
      <section className="py-24 bg-card/25 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-655 dark:text-indigo-400 tracking-wider uppercase font-mono">{t('home.valuesTag')}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">
                {t('home.valuesTitle')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('home.valuesSubtitle')}
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
                  <div className={`relative overflow-hidden bg-card border border-border p-8 rounded-2xl hover:bg-muted/10 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 group flex flex-col justify-between cursor-pointer ${border}`}>
                    {/* Radial Glow Highlight */}
                    <div className={`absolute -inset-[1px] bg-gradient-to-br ${glow} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconText} flex items-center justify-center mb-6 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.04)] transition-all duration-300`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="text-4xl font-black text-foreground mb-2 tracking-tight">
                        <CountUpNumber
                          end={stat.number}
                          suffix={stat.suffix || ''}
                          decimals={stat.decimals || 0}
                          duration={2500}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3">{stat.label}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{stat.description}</p>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 tracking-wider uppercase font-mono">feedbacks</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">
                {t('timeline.historyTitle').replace(/\[.*?\]\s*/g, '') === 'timeline.historyTitle' ? 'Voices of Transformation' : t('timeline.historyTitle')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('timeline.historySubtitle').replace(/\[.*?\]\s*/g, '') === 'timeline.historySubtitle' ? 'Real stories from real people whose lives have been transformed through our programs' : t('timeline.historySubtitle')}
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
                <div className="relative overflow-hidden bg-card border border-border p-8 rounded-2xl hover:shadow-2xl hover:shadow-slate-950/10 hover:border-indigo-500/20 hover:-translate-y-1.5 transform transition-all duration-300 group flex flex-col justify-between cursor-pointer h-full">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-border group-hover:scale-105 transition-transform duration-300"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{testimonial.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 font-semibold">{testimonial.role}</p>
                      </div>
                    </div>

                    <blockquote className="text-muted-foreground italic mb-6 leading-relaxed text-sm">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>

                  <div className="bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 p-3 rounded-lg relative z-10">
                    <p className="text-indigo-805 dark:text-indigo-400 font-semibold text-xs leading-none">
                      {testimonial.impact}
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
              {t('timeline.historyTitle').replace(/\[.*?\]\s*/g, '') === 'timeline.historyTitle' ? 'Our 2030 Vision' : t('timeline.historyTitle')}
            </h2>
            <p className="text-lg md:text-xl mb-16 max-w-3xl mx-auto text-slate-400 leading-relaxed font-normal">
              {t('about.principles.sustainability.description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCard animation="slideUp" delay={0}>
                <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-indigo-500/35 hover:shadow-[0_20px_40px_rgba(99,102,241,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                  <div className="text-4xl sm:text-5xl font-black text-indigo-400 mb-2 tracking-tight">
                    <CountUpNumber end={100} suffix="K+" duration={3000} />
                  </div>
                  <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">{t('home.stats.lives').replace(/\[.*?\]\s*/g, '') === 'home.stats.lives' ? 'Lives to Transform' : t('home.stats.lives')}</div>
                </div>
              </AnimatedCard>

              <AnimatedCard animation="slideUp" delay={150}>
                <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-emerald-500/35 hover:shadow-[0_20px_40px_rgba(16,185,129,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2 tracking-tight">
                    <CountUpNumber end={100} suffix="+" duration={3000} />
                  </div>
                  <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">{t('navbar.more').replace(/\[.*?\]\s*/g, '') === 'navbar.more' ? 'Countries to Reach' : t('navbar.more')}</div>
                </div>
              </AnimatedCard>

              <AnimatedCard animation="slideUp" delay={300}>
                <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-purple-500/35 hover:shadow-[0_20px_40px_rgba(139,92,246,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                  <div className="text-4xl sm:text-5xl font-black text-purple-400 mb-2 tracking-tight">
                    <CountUpNumber end={1} suffix="M+" duration={3000} />
                  </div>
                  <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2 font-medium">{t('about.principles.community.title').replace(/\[.*?\]\s*/g, '') === 'about.principles.community.title' ? 'Indirect Beneficiaries' : t('about.principles.community.title')}</div>
                </div>
              </AnimatedCard>

              <AnimatedCard animation="slideUp" delay={450}>
                <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-pink-500/35 hover:shadow-[0_20px_40px_rgba(244,63,94,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                  <div className="text-4xl sm:text-5xl font-black text-pink-400 mb-2 tracking-tight">
                    <CountUpNumber end={50} suffix="+" duration={3000} />
                  </div>
                  <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">{t('programs.durationTitle').replace(/\[.*?\]\s*/g, '') === 'programs.durationTitle' ? 'New Programs' : t('programs.durationTitle')}</div>
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