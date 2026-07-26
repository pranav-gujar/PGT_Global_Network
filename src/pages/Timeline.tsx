import React from 'react';
import { Calendar, Award, Users, Globe, Zap, Target, Star } from 'lucide-react';
import CountUpNumber from '../components/CountUpNumber';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';

import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';

const Timeline = () => {
    const loading = usePageLoading();
  
  const timelineEvents = [
  {
    year: '2019',
    title: 'The Spark',
    description: 'PGT began as a small school initiative focused on awareness and eco-friendly action.',
    icon: Target,
    achievements: [
      'Launched the first Happy Eco Diwali (HED) campaign',
      'Organized quizzes to support classmates during board exam prep',
      'Encouraged eco-conscious celebrations in local community',
      'Planted the idea of Purpose, Growth, and Transformation'
    ],
    stats: { participants: 40, programs: 1, successStories: 15 }
  },
  {
    year: '2020',
    title: 'Early Growth',
    description: 'Expanded small initiatives with educational and awareness activities during board and community events.',
    icon: Zap,
    achievements: [
      'Conducted educational awareness quizzes and small drives',
      'Sustained eco-awareness campaigns despite pandemic challenges',
      'Engaged students in local and online formats',
      'Inspired first few documented student success experiences'
    ],
    stats: { participants: 120, programs: 2, successStories: 40 }
  },
  {
    year: '2021',
    title: 'Consistent Action',
    description: 'PGT continued through awareness drives and annual eco-campaigns, keeping the vision alive.',
    icon: Users,
    achievements: [
      'Held small awareness events in schools and college groups',
      'Expanded HED campaign into its 3rd edition',
      'Organized peer-to-peer motivational discussions',
      'Maintained student engagement despite limited scale'
    ],
    stats: { participants: 300, programs: 2, successStories: 55 }
  },
  {
    year: '2022',
    title: 'Foundation Building',
    description: 'Focused on maintaining continuity with eco-initiatives and light educational activities.',
    icon: Award,
    achievements: [
      'Executed HED campaign 4th edition with new volunteers',
      'Ran small-scale online awareness posts and contests',
      'Started experimenting with structured formats for impact',
      'Strengthened the identity of PGT as a student-led movement'
    ],
    stats: { participants: 600, programs: 2, successStories: 80 }
  },
  {
    year: '2023',
    title: 'Preparing for Impact',
    description: 'PGT tested new formats and strengthened groundwork for upcoming transformation.',
    icon: Globe,
    achievements: [
      'Celebrated HED 5th edition with wider outreach',
      'Engaged in mini-campaigns to test student response',
      'Shaped vision for larger global identity',
      'Prepared structure for upcoming programs'
    ],
    stats: { participants: 1000, programs: 3, successStories: 95 }
  },
  {
    year: '2024',
    title: 'Towards Global Impact',
    description: 'Rebranded as PGT Global Network and launched major flagship programs with massive reach.',
    icon: Calendar,
    achievements: [
      'Launched VoA, MotivMinds, D3, and Seminarix as flagship programs',
      'Seminarix returned to founder’s former school with great success',
      'VoA and MotivMinds inspired audiences with real stories',
      'Crossed 10,000 participants milestone in the very first year'
    ],
    stats: { participants: 8000, programs: 5, successStories: 140 }
  },
  {
  year: '2025',
  title: 'Continuing the Journey',
  description: 'PGT Global Network is actively scaling programs and building new opportunities for student leadership.',
  icon: Star,
  achievements: [
    'Going to run Happy Eco Diwali 7th edition with strong engagement',
    'Expanding VoA, MotivMinds, D3, and Seminarix reach across platforms',
    'Building collaborations with schools, colleges, and global networks',
    'Focusing on empowering thousands more students this year'
  ],
  stats: { participants: 1000, programs: 6, successStories: 200 }
}
];
  // const timelineEvents = [
  //   {
  //     year: '2019',
  //     title: 'Foundation & Vision',
  //     description: 'PGT Global Network was founded with a clear mission to transform lives through purpose-driven growth.',
  //     icon: Target,
  //     achievements: [
  //       'Established core values and mission',
  //       'Launched first pilot program',
  //       'Reached 100 initial participants',
  //       'Formed founding team of 5 members'
  //     ],
  //     stats: { participants: 100, programs: 1, countries: 2 }
  //   },
  //   {
  //     year: '2020',
  //     title: 'Digital Transformation',
  //     description: 'Adapted to global challenges by launching digital programs and expanding our reach through technology.',
  //     icon: Zap,
  //     achievements: [
  //       'Launched D3 Digital Program',
  //       'Transitioned to virtual delivery',
  //       'Expanded to 10 countries',
  //       'Introduced online mentorship'
  //     ],
  //     stats: { participants: 500, programs: 2, countries: 10 }
  //   },
  //   {
  //     year: '2021',
  //     title: 'Community Building',
  //     description: 'Focused on building strong communities and launching the Voice of Action initiative.',
  //     icon: Users,
  //     achievements: [
  //       'Launched VoA Initiative',
  //       'Established community chapters',
  //       'Introduced peer-to-peer learning',
  //       'Reached 1,000 active participants'
  //     ],
  //     stats: { participants: 1500, programs: 3, countries: 20 }
  //   },
  //   {
  //     year: '2022',
  //     title: 'Educational Excellence',
  //     description: 'Expanded educational offerings with Seminarix and MotivMinds programs.',
  //     icon: Award,
  //     achievements: [
  //       'Launched Seminarix workshop series',
  //       'Introduced MotivMinds program',
  //       'Partnerships with 25 organizations',
  //       'Won "Innovation in Education" award'
  //     ],
  //     stats: { participants: 3500, programs: 4, countries: 30 }
  //   },
  //   {
  //     year: '2023',
  //     title: 'Higher Education Focus',
  //     description: 'Launched HED Program to support higher education development and academic excellence.',
  //     icon: Globe,
  //     achievements: [
  //       'Launched HED Program',
  //       'University partnerships established',
  //       'Scholarship program initiated',
  //       'Reached 40 countries'
  //     ],
  //     stats: { participants: 6000, programs: 5, countries: 40 }
  //   },
  //   {
  //     year: '2024',
  //     title: 'Global Impact',
  //     description: 'Achieved significant milestones and expanded our global footprint.',
  //     icon: Calendar,
  //     achievements: [
  //       'Reached 10,000+ participants',
  //       'Expanded to 50+ countries',
  //       'Launched mobile app',
  //       'Established regional offices'
  //     ],
  //     stats: { participants: 10000, programs: 5, countries: 50 }
  //   }
  // ];

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
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">PGT Global Milestones</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              Our Journey
            </h1>
            <p 
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              Six years of growth, transformation, and impact - from a vision to a global network
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Timeline */}
      <section className="py-24 bg-white border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-24">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">history</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
                Timeline of Transformation
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Every milestone in our journey represents lives transformed and communities empowered
              </p>
            </div>
          </AnimatedCard>

          <div className="relative">
            {/* Visual Gradient Connector Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-indigo-500/20 via-blue-500/20 to-purple-500/10 hidden lg:block"></div>

            <div className="space-y-20 relative">
              {timelineEvents.map((event, index) => (
                <AnimatedCard key={event.year} animation="slideUp" delay={index * 150}>
                  <div className={`flex flex-col lg:flex-row items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 relative group`}>
                    
                    {/* Milestone Card */}
                    <div className="flex-1 lg:max-w-xl w-full">
                      <div className={`relative overflow-hidden bg-white/60 border border-slate-200/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-slate-100/30 hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.02] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer ${index % 2 === 0 ? 'lg:mr-10' : 'lg:ml-10'}`}>
                        {/* Subtle theme radial glow */}
                        <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-center space-x-4 mb-6 relative z-10">
                          <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-xl text-indigo-600 group-hover:scale-105 transition-all duration-300 shadow-[0_4px_12px_rgba(99,102,241,0.04)]">
                            <event.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50/70 border border-indigo-100/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{event.year}</span>
                            <h4 className="text-xl font-bold text-slate-900 mt-1">{event.title}</h4>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed mb-6 relative z-10">{event.description}</p>

                        <div className="space-y-3 mb-8 relative z-10">
                          {event.achievements.map((achievement, achievementIndex) => (
                            <div key={achievementIndex} className="flex items-start space-x-2.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                              <span className="text-slate-600 text-sm leading-relaxed">{achievement}</span>
                            </div>
                          ))}
                        </div>

                        {/* Metric Subgrid Dashboard */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 relative z-10 bg-slate-50/50 p-4 rounded-xl group-hover:bg-white group-hover:border-slate-200/50 transition-all duration-300">
                          <div className="text-center">
                            <div className="text-lg sm:text-xl font-black text-indigo-600">
                              <CountUpNumber end={event.stats.participants} suffix="+" duration={2000} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Participants</div>
                          </div>
                          <div className="text-center border-x border-slate-200/60">
                            <div className="text-lg sm:text-xl font-black text-emerald-600">
                              <CountUpNumber end={event.stats.programs} duration={2000} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Programs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg sm:text-xl font-black text-purple-600">
                              <CountUpNumber end={event.stats.successStories} suffix="+" duration={2000} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Stories</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node Ring */}
                    <div className="relative z-20">
                      <div className="w-14 h-14 bg-white border border-slate-200 shadow-[0_4px_16px_rgba(99,102,241,0.06)] rounded-full flex items-center justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 group-hover:scale-110 group-hover:border-indigo-400 transition-all duration-300 select-none">
                        <span className="text-slate-800 font-extrabold text-sm font-mono">{event.year}</span>
                      </div>
                    </div>

                    <div className="flex-1 lg:max-w-xl hidden lg:block"></div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10">
          <Background />
          
          {/* Spotlight glowing gradients */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-12 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Looking Ahead</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Impact Target */}
              <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-indigo-500/35 hover:shadow-[0_20px_40px_rgba(99,102,241,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                <div className="text-4xl sm:text-5xl font-black text-indigo-400 mb-2 tracking-tight">
                  <CountUpNumber end={100000} suffix="+" duration={3000} />
                </div>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">Lives to Impact</p>
              </div>

              {/* Countries to Reach */}
              <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-emerald-500/35 hover:shadow-[0_20px_40px_rgba(16,185,129,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                <div className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2 tracking-tight">
                  <CountUpNumber end={100} suffix="+" duration={3000} />
                </div>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">Countries to Reach</p>
              </div>

              {/* Target Year */}
              <div className="relative bg-white/[0.01] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl hover:bg-white/[0.03] hover:border-purple-500/35 hover:shadow-[0_20px_40px_rgba(139,92,246,0.06)] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                <div className="text-4xl sm:text-5xl font-black text-purple-400 mb-2 tracking-tight">
                  <CountUpNumber end={2030} duration={3000} />
                </div>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">Target Year</p>
              </div>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Timeline;
