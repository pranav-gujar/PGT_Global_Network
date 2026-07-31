import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Globe, Target, CheckCircle, Star, Sparkles } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import CountUpNumber from '../components/CountUpNumber';
import Background from '../components/Background';
import HeroBackground from '../components/HeroBackground';
import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';
import { useLanguage } from '../contexts/LanguageContext';

import Seminarix from '../assets/programs/Seminarix.png';
import D3 from '../assets/programs/D3.png';
import VoA from '../assets/programs/VoA.png';
import HED from '../assets/programs/HED.png';
import MotivMinds from '../assets/programs/MotiVMinds.png';

const ProgramDetail = () => {
  const loading = usePageLoading();
  const { programId } = useParams();
  const { t } = useLanguage();

  const programData: { [key: string]: any } = {
    'd3': {
      name: 'D3 Program',
      fullName: 'Daily Discovery Digest',
      description: 'A continuous daily awareness initiative delivering knowledge, inspiration, and important milestones through social media stories.',
      image: D3,
      duration: 'Continuous',
      participants: '4,000+',
      difference: 'Brings learning into everyday student life',
      successRate: '95%',
      overview: 'D3 is our flagship daily inspiration program that helps students “Discover the Extraordinary Every Day.” Through Instagram and Facebook stories, it highlights important global and national days, historic milestones, and inspiring life stories.',
      objectives: [
        'Promote daily awareness among students',
        'Encourage discovery of history, science, and culture',
        'Inspire through stories of great personalities',
        'Build habit of lifelong learning',
        'Make social media a tool for growth'
      ],
      curriculum: [
        {
          module: 'Daily Themes',
          duration: 'Ongoing',
          topics: ['National & International Days', 'Historical Events', 'Great Personalities', 'Real-Life Stories']
        }
      ],
      requirements: [
        'Interest in learning new things daily',
        'Access to Instagram or Facebook',
        'Openness to inspiration'
      ],
      outcomes: [
        'Improved general awareness',
        'Daily dose of inspiration',
        'Positive use of social media',
        'Connection with global knowledge'
      ]
    },
    'voa': {
      name: 'VoA Initiative',
      fullName: 'Voices of Ability',
      description: 'A storytelling series that showcases individuals who turned personal challenges into change.',
      image: VoA,
      duration: 'Continuous series',
      participants: '6,500+',
      difference: 'Transforms challenges into inspiring stories of resilience',
      successRate: '93%',
      overview: 'VoA highlights true ability of the human spirit through real-life recorded journeys. Guests share their stories, which are then edited and published as episodes to build empathy, awareness, and empowerment.',
      objectives: [
        'Amplify voices of resilience',
        'Challenge stereotypes about disability and struggles',
        'Inspire youth through lived experiences',
        'Build empathy and awareness in society',
        'Create a library of change-making stories'
      ],
      curriculum: [
        {
          module: 'Storytelling',
          duration: 'Ongoing',
          topics: ['Life Journeys', 'Overcoming Struggles', 'Personal Growth', 'Social Change']
        }
      ],
      requirements: [
        'Willingness to share life story',
        'Commitment to inspire others',
        'Basic recording facility (audio/video)'
      ],
      outcomes: [
        'Increased empathy in society',
        'Platform for unheard voices',
        'Awareness about challenges and resilience',
        'Motivation for students and youth'
      ]
    },
    'seminarix': {
      name: 'Seminarix',
      fullName: 'Seminar Series',
      description: 'Educational and motivational seminar series for 10th and 12th students to excel in academics and mental wellness.',
      image: Seminarix,
      duration: 'On-ground sessions',
      participants: '1,000+',
      difference: 'Blends academics with mental wellness strategies',
      successRate: '97%',
      overview: 'Seminarix helps board exam students with practical study strategies, motivation, and mental health tools. Conducted in schools and hostels, it empowers students to balance academics with wellness.',
      objectives: [
        'Guide students for board exams',
        'Provide practical study techniques',
        'Address exam stress and anxiety',
        'Motivate with real-life experiences',
        'Promote balanced academic and mental growth'
      ],
      curriculum: [
        {
          module: 'Seminar Sessions',
          duration: '2 hours each',
          topics: ['Study Strategies', 'Motivation', 'Time Management', 'Mental Wellness']
        }
      ],
      requirements: [
        'Participation from schools or hostels',
        'Interest in academic improvement',
        'Openness to motivation and wellness practices'
      ],
      outcomes: [
        'Better academic performance',
        'Reduced exam stress',
        'Practical strategies for students',
        'Motivation and confidence boost'
      ]
    },
    'motivminds': {
      name: 'MotivMinds',
      fullName: 'Motivational Minds',
      description: 'Weekly empowerment video series delivering short, inspiring one-minute wisdom clips.',
      image: MotivMinds,
      duration: 'Weekly series',
      participants: '3,000+',
      difference: 'Delivers powerful lessons in just one minute',
      successRate: '94%',
      overview: 'MotivMinds provides students with quick, impactful motivation and real-world wisdom through 60-second videos shared on YouTube, Instagram, and Facebook every week.',
      objectives: [
        'Inspire students with weekly motivation',
        'Share real-world wisdom in short format',
        'Encourage confidence and resilience',
        'Help students unlock inner strength',
        'Build habit of positive thinking'
      ],
      curriculum: [
        {
          module: 'Weekly Videos',
          duration: '1 min each',
          topics: ['Motivation', 'Life Lessons', 'Resilience', 'Growth Mindset']
        }
      ],
      requirements: [
        'Willingness to spend one minute weekly',
        'Interest in motivation and growth',
        'Access to social media platforms'
      ],
      outcomes: [
        'Boost in self-confidence',
        'Inspiration for daily life',
        'Positive mindset building',
        'Weekly motivation habit'
      ]
    },
    'hed': {
      name: 'HED Program',
      fullName: 'Happy Eco Diwali',
      description: 'An annual campaign encouraging eco-friendly Diwali celebrations and environmental responsibility.',
      image: HED,
      duration: 'Annual campaign',
      participants: '2,200+',
      difference: 'Promotes eco-friendly traditions during festivals',
      successRate: '97%',
      overview: 'HED is the longest-running initiative of PGT Global Network. Every Diwali, it spreads awareness on celebrating with eco-conscious practices like no-crackers, tree plantation, and sustainable celebrations.',
      objectives: [
        'Promote eco-friendly Diwali practices',
        'Reduce pollution during festivals',
        'Encourage youth to adopt sustainability',
        'Organize contests and awareness drives',
        'Celebrate tradition with responsibility'
      ],
      curriculum: [
        {
          module: 'Annual Campaign',
          duration: 'Festival Season',
          topics: ['Eco-Friendly Awareness', 'Tree Plantation', 'Innovation Contest', 'Community Celebration']
        }
      ],
      requirements: [
        'Interest in celebrating eco-friendly festivals',
        'Participation in campaigns or contests',
        'Commitment to sustainability'
      ],
      outcomes: [
        'Eco-conscious festival celebration',
        'Youth engagement in sustainability',
        'Reduced cracker pollution',
        'Cultural celebration with responsibility'
      ]
    }
  };

  const program = programData[programId || 'd3'];

  const getTranslation = (key: string, fallback: any) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  if (!program) {
    return (
      <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Program Not Found</h1>
          <Link to="/programs" className="text-blue-600 hover:text-blue-800">
            ← Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const pKey = `programs.${programId}`;
  const translatedName = getTranslation(`${pKey}.name`, program.name);
  const translatedFullName = getTranslation(`${pKey}.fullName`, program.fullName);
  const translatedDescription = getTranslation(`${pKey}.description`, program.description);
  const translatedDuration = getTranslation(`${pKey}.duration`, program.duration);
  const translatedImpact = getTranslation(`${pKey}.impact`, program.impact || program.participants);
  const translatedOverview = getTranslation(`${pKey}.overview`, program.overview);
  const translatedObjectives = getTranslation(`${pKey}.objectives`, program.objectives);
  const translatedRequirements = getTranslation(`${pKey}.requirements`, program.requirements);
  const translatedOutcomes = getTranslation(`${pKey}.outcomes`, program.outcomes);
  const translatedCurriculum = getTranslation(`${pKey}.curriculum`, program.curriculum);

  return (
    <div className="pt-28 bg-background overflow-x-hidden min-h-screen transition-colors duration-300">
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
        <section className="relative overflow-hidden py-20 sm:py-28 border-b border-border bg-background transition-colors duration-300">
          <HeroBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Content */}
              <div className="lg:col-span-7 text-left">
                {/* Tagline Badge */}
                <div 
                  className="inline-flex items-center gap-2 bg-card/90 border border-border px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.03)] mb-6 animate-reveal-up backdrop-blur-md hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:border-indigo-400/40 hover:-translate-y-[1px] transform transition-all duration-300 pointer-events-auto cursor-pointer"
                  style={{ animationDelay: '100ms' }}
                >
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">{t('programs.tagline')}</span>
                </div>

                <h1 
                  className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-4 font-sans animate-reveal-up"
                  style={{ animationDelay: '250ms' }}
                >
                  {translatedName}
                </h1>
                <p 
                  className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6 animate-reveal-up"
                  style={{ animationDelay: '350ms' }}
                >
                  {translatedFullName}
                </p>

                <p 
                  className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal mb-8 max-w-2xl animate-reveal-up"
                  style={{ animationDelay: '450ms' }}
                >
                  {translatedDescription}
                </p>

                <div className="flex flex-wrap gap-4 animate-reveal-up" style={{ animationDelay: '550ms' }}>
                  <a
                    href="#details"
                    className="bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-700/30 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {t('common.learnMore').replace(/\[.*?\]\s*/g, '') === 'common.learnMore' ? 'Explore Overview' : t('common.learnMore')}
                  </a>
                  <Link
                    to="/programs"
                    className="group inline-flex items-center justify-center bg-card border border-border text-foreground hover:bg-muted px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5"
                  >
                    {t('common.explore').replace(/\[.*?\]\s*/g, '') === 'common.explore' ? 'All Programs' : t('common.explore')}
                  </Link>
                </div>
              </div>

              {/* Right Column Logo Widget */}
              <div className="lg:col-span-5 flex justify-center">
                <div 
                  className="relative w-72 sm:w-80 h-72 sm:h-80 bg-card border border-border backdrop-blur-md rounded-3xl shadow-2xl flex items-center justify-center group hover:scale-[1.02] transform transition-transform duration-500 animate-reveal-up cursor-pointer overflow-hidden"
                  style={{ animationDelay: '300ms' }}
                >
                  <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/[0.03] blur-[60px] pointer-events-none"></div>
                  
                  {/* Subtle Orbit Line */}
                  <div className="absolute w-60 h-60 border border-dashed border-border/60 rounded-full animate-[spin_30s_linear_infinite]" />

                  <img
                    src={program.image}
                    alt={translatedName}
                    className="w-40 h-40 object-contain relative z-10 transition-transform duration-500 group-hover:scale-105 filter drop-shadow-lg"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      </AnimatedCard>

      {/* Back Button Navigation Bar */}
      <section className="py-6 border-b border-border bg-card/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/programs"
            className="group inline-flex items-center text-muted-foreground hover:text-indigo-505 text-sm font-semibold tracking-wide transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            {t('common.back').replace(/\[.*?\]\s*/g, '') === 'common.back' ? 'Back to Programs' : t('common.back')}
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card/25 relative z-10 border-b border-border" id="details">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Duration */}
            <AnimatedCard animation="slideUp" delay={0}>
              <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-5 hover:bg-muted/10 hover:shadow-xl hover:shadow-slate-950/10 hover:border-indigo-500/20 hover:-translate-y-0.5 transform transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-300 shadow-sm shadow-indigo-500/10">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-muted-foreground/60 font-mono tracking-wider uppercase">{t('programs.durationTitle')}</div>
                  <div className="text-xl font-bold text-foreground mt-1">{translatedDuration}</div>
                </div>
              </div>
            </AnimatedCard>

            {/* Participants */}
            <AnimatedCard animation="slideUp" delay={150}>
              <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-5 hover:bg-muted/10 hover:shadow-xl hover:shadow-slate-950/10 hover:border-indigo-500/20 hover:-translate-y-0.5 transform transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300 shadow-sm shadow-emerald-500/10">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-muted-foreground/60 font-mono tracking-wider uppercase">{t('programs.impactTitle')}</div>
                  <div className="text-xl font-bold text-foreground mt-1">{translatedImpact}</div>
                </div>
              </div>
            </AnimatedCard>

            {/* Success Rate */}
            <AnimatedCard animation="slideUp" delay={300}>
              <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-5 hover:bg-muted/10 hover:shadow-xl hover:shadow-slate-950/10 hover:border-indigo-500/20 hover:-translate-y-0.5 transform transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/40 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform duration-300 shadow-sm shadow-orange-500/10">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-muted-foreground/60 font-mono tracking-wider uppercase">Success Rate</div>
                  <div className="text-xl font-bold text-foreground mt-1">{program.successRate}</div>
                </div>
              </div>
            </AnimatedCard>

          </div>
        </div>
      </section>

      {/* Program Overview & Bento Details */}
      <section className="py-24 bg-background border-b border-border relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Box: Overview & Objectives */}
            <AnimatedCard animation="slideLeft">
              <div className="bg-card border border-border p-8 rounded-2xl shadow-xl shadow-slate-950/10 dark:shadow-none">
                <div className="flex items-center gap-3.5 mb-6">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Program Overview</h2>
                </div>
                
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal mb-8">
                  {translatedOverview}
                </p>

                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                  Learning Objectives
                </h3>
                <ul className="space-y-3.5 pl-1">
                  {(translatedObjectives as string[]).map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-105 transition-transform" />
                      <span className="text-muted-foreground text-sm sm:text-base leading-relaxed">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>

            {/* Right Box: Requirements & Outcomes */}
            <AnimatedCard animation="slideRight">
              <div className="bg-card border border-border p-8 rounded-2xl shadow-xl shadow-slate-950/10 dark:shadow-none">
                <div className="flex items-center gap-3.5 mb-6">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{t('programs.requirements') === 'programs.requirements' ? 'Requirements' : t('programs.requirements')}</h2>
                </div>

                <ul className="space-y-3.5 mb-8 pl-1">
                  {(translatedRequirements as string[]).map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm sm:text-base leading-relaxed">{requirement}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Star className="h-4.5 w-4.5 text-yellow-500" />
                  {t('programs.outcomes') === 'programs.outcomes' ? 'Expected Outcomes' : t('programs.outcomes')}
                </h3>
                <ul className="space-y-3.5 pl-1">
                  {(translatedOutcomes as string[]).map((outcome: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm sm:text-base leading-relaxed">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>

          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24 bg-card/25 relative z-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">Structure</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">Curriculum</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Comprehensive learning modules designed for maximum impact
              </p>
            </div>
          </AnimatedCard>

          <div className="space-y-8 max-w-4xl mx-auto">
            {translatedCurriculum.map((module: any, index: number) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 100}>
                <div className="bg-muted/30 border border-border rounded-2xl p-8 hover:bg-card hover:shadow-2xl hover:shadow-slate-950/10 hover:border-indigo-500/20 transform transition-all duration-300 group cursor-pointer relative overflow-hidden">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.01] to-transparent rounded-2xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 relative z-10">
                    <h3 className="text-xl font-bold text-foreground">{module.module}</h3>
                    <span className="inline-flex bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 text-indigo-650 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">{module.duration}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
                    {module.topics.map((topic: string, topicIndex: number) => (
                      <div 
                        key={topicIndex} 
                        className="bg-card border border-border px-4 py-2.5 rounded-xl text-xs sm:text-sm text-foreground font-medium hover:border-indigo-500/20 hover:bg-muted transition-all duration-300"
                      >
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10 border-t border-white/[0.04]">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {t('common.explore').replace(/\[.*?\]\s*/g, '') === 'common.explore' ? 'Ready to Transform Your Future?' : t('common.explore')}
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              Join thousands of individuals who have experienced growth through the {translatedName}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
              {/* Apply Button */}
              <Link
                to="/contact"
                className="w-48 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-700/35 px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center justify-center"
              >
                {t('careers.apply')}
              </Link>

              {/* Free Session Button */}
              <a
                href="https://topmate.io/pranav_gujar/1355631?utm_source=public_profile&utm_campaign=pranav_gujar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-56 border border-white/20 hover:border-white/50 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center justify-center"
              >
                {t('programs.scheduleBtn').replace(/\[.*?\]\s*/g, '') === 'programs.scheduleBtn' ? 'Schedule Free Session' : t('programs.scheduleBtn')}
              </a>
            </div>
          </div>
        </section>
      </AnimatedCard>

    </div>
  );
};

export default ProgramDetail;