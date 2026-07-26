import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Globe, Target, CheckCircle, Star, Sparkles } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import CountUpNumber from '../components/CountUpNumber';
import Background from '../components/Background';
import HeroBackground from '../components/HeroBackground';

import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';

import Seminarix from '../assets/programs/Seminarix.png';
import D3 from '../assets/programs/D3.png';
import VoA from '../assets/programs/VoA.png';
import HED from '../assets/programs/HED.png';
import MotivMinds from '../assets/programs/MotiVMinds.png';

const ProgramDetail = () => {
  const loading = usePageLoading();
  
  const { programId } = useParams();

  // Mock program data - in a real app, this would come from an API
  const programData: { [key: string]: any } = {
  'd3': {
    name: 'D3 Program',
    fullName: 'Daily Discovery Digest',
    description: 'A continuous daily awareness initiative delivering knowledge, inspiration, and important milestones through social media stories.',
    image: D3,
    // image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    testimonials: [
      {
        name: 'Aarohi Patil',
        role: 'Student',
        image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'D3 stories give me daily knowledge and motivation right on Instagram.'
      },
      {
        name: 'Rohit Sharma',
        role: 'College Student',
        image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'It’s amazing how much I’ve learned about history and leaders through D3.'
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
    // image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    testimonials: [
      {
        name: 'Ankita More',
        role: 'VoA Guest',
        image: 'https://images.pexels.com/photos/3184450/pexels-photo-3184450.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'Sharing my journey on VoA made me feel empowered and heard.'
      },
      {
        name: 'Kunal Singh',
        role: 'Viewer',
        image: 'https://images.pexels.com/photos/3184342/pexels-photo-3184342.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'Each episode gave me goosebumps and deep respect for real fighters.'
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
    // image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    testimonials: [
      {
        name: 'Ramesh Kumar',
        role: '10th Student',
        image: 'https://images.pexels.com/photos/3184321/pexels-photo-3184321.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'Seminarix gave me simple tricks that helped me top my exams.'
      },
      {
        name: 'School Teacher',
        role: 'Educator',
        image: 'https://images.pexels.com/photos/3184371/pexels-photo-3184371.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'Students connected deeply with the real-life stories shared in Seminarix.'
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
    // image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    testimonials: [
      {
        name: 'Sneha Joshi',
        role: 'College Student',
        image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'MotivMinds is my go-to for a quick dose of positivity.'
      },
      {
        name: 'Vikram Deshmukh',
        role: 'Young Professional',
        image: 'https://images.pexels.com/photos/3184445/pexels-photo-3184445.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'One-minute videos, but they leave an impact for the whole week.'
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
    // image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    testimonials: [
      {
        name: 'Neha Kulkarni',
        role: 'School Student',
        image: 'https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'HED taught us how to enjoy Diwali without harming nature.'
      },
      {
        name: 'College Volunteer',
        role: 'Volunteer',
        image: 'https://images.pexels.com/photos/3184356/pexels-photo-3184356.jpeg?auto=compress&cs=tinysrgb&w=400',
        quote: 'Tree plantation and contests made this Diwali truly meaningful.'
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

  if (!program) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Program Not Found</h1>
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

  return (
    <div className="pt-28 bg-slate-50/30 overflow-x-hidden min-h-screen">
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
        <section className="relative overflow-hidden py-20 sm:py-28 border-b border-slate-100">
          <HeroBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Content */}
              <div className="lg:col-span-7 text-left">
                {/* Tagline Badge */}
                <div 
                  className="inline-flex items-center gap-2 bg-white/95 border border-slate-200/60 px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.03)] mb-6 animate-reveal-up backdrop-blur-md hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:border-indigo-400/40 hover:-translate-y-[1px] transform transition-all duration-300 pointer-events-auto cursor-pointer"
                  style={{ animationDelay: '100ms' }}
                >
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">PGT Program Highlight</span>
                </div>

                <h1 
                  className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-4 font-sans animate-reveal-up"
                  style={{ animationDelay: '250ms' }}
                >
                  {program.name}
                </h1>
                        <p 
                  className="text-xl font-semibold text-indigo-600 mb-6 animate-reveal-up"
                  style={{ animationDelay: '350ms' }}
                >
                  {program.fullName}
                </p>

                <p 
                  className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-8 max-w-2xl animate-reveal-up"
                  style={{ animationDelay: '450ms' }}
                >
                  {program.description}
                </p>

                <div className="flex flex-wrap gap-4 animate-reveal-up" style={{ animationDelay: '550ms' }}>
                  <a
                    href="#details"
                    className="bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-700/30 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Explore Overview
                  </a>
                  <Link
                    to="/programs"
                    className="group inline-flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5"
                  >
                    All Programs
                  </Link>
                </div>
              </div>

              {/* Right Column Logo Widget */}
              <div className="lg:col-span-5 flex justify-center">
                <div 
                  className="relative w-72 sm:w-80 h-72 sm:h-80 bg-white/70 border border-slate-200/50 backdrop-blur-md rounded-3xl shadow-2xl flex items-center justify-center group hover:scale-[1.02] transform transition-transform duration-500 animate-reveal-up cursor-pointer overflow-hidden"
                  style={{ animationDelay: '300ms' }}
                >
                  <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/[0.03] blur-[60px] pointer-events-none"></div>
                  
                  {/* Subtle Orbit Line */}
                  <div className="absolute w-60 h-60 border border-dashed border-slate-200/60 rounded-full animate-[spin_30s_linear_infinite]" />

                  <img
                    src={program.image}
                    alt={program.name}
                    className="w-40 h-40 object-contain relative z-10 transition-transform duration-500 group-hover:scale-105 filter drop-shadow-lg"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      </AnimatedCard>

      {/* Back Button Navigation Bar */}
      <section className="py-6 border-b border-slate-100 bg-white/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/programs"
            className="group inline-flex items-center text-slate-500 hover:text-indigo-600 text-sm font-semibold tracking-wide transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Programs
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative z-10 border-b border-slate-100" id="details">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Duration */}
            <AnimatedCard animation="slideUp" delay={0}>
              <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl flex items-center gap-5 hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 hover:border-indigo-500/20 hover:-translate-y-0.5 transform transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform duration-300">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-400 font-mono tracking-wider uppercase">Duration</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">{program.duration}</div>
                </div>
              </div>
            </AnimatedCard>

            {/* Participants */}
            <AnimatedCard animation="slideUp" delay={150}>
              <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl flex items-center gap-5 hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 hover:border-indigo-500/20 hover:-translate-y-0.5 transform transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform duration-300">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-400 font-mono tracking-wider uppercase">Lives Impacted</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">{program.participants}</div>
                </div>
              </div>
            </AnimatedCard>

            {/* Success Rate */}
            <AnimatedCard animation="slideUp" delay={300}>
              <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl flex items-center gap-5 hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 hover:border-indigo-500/20 hover:-translate-y-0.5 transform transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform duration-300">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-400 font-mono tracking-wider uppercase">Success Rate</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">{program.successRate}</div>
                </div>
              </div>
            </AnimatedCard>

          </div>
        </div>
      </section>

      {/* Program Overview & Bento Details */}
      <section className="py-24 bg-slate-50/10 border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Box: Overview & Objectives */}
            <AnimatedCard animation="slideLeft">
              <div className="bg-white border border-slate-200/50 p-8 rounded-2xl shadow-xl shadow-slate-100/30">
                <div className="flex items-center gap-3.5 mb-6">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Program Overview</h2>
                </div>
                
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-8">
                  {program.overview}
                </p>

                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                  Learning Objectives
                </h3>
                <ul className="space-y-3.5 pl-1">
                  {program.objectives.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-105 transition-transform" />
                      <span className="text-slate-600 text-sm sm:text-base leading-relaxed">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>

            {/* Right Box: Requirements & Outcomes */}
            <AnimatedCard animation="slideRight">
              <div className="bg-white border border-slate-200/50 p-8 rounded-2xl shadow-xl shadow-slate-100/30">
                <div className="flex items-center gap-3.5 mb-6">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Requirements</h2>
                </div>

                <ul className="space-y-3.5 mb-8 pl-1">
                  {program.requirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="text-slate-600 text-sm sm:text-base leading-relaxed">{requirement}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Star className="h-4.5 w-4.5 text-yellow-500" />
                  Expected Outcomes
                </h3>
                <ul className="space-y-3.5 pl-1">
                  {program.outcomes.map((outcome: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="text-slate-605 text-sm sm:text-base leading-relaxed">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>

          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24 bg-white relative z-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">Structure</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">Curriculum</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Comprehensive learning modules designed for maximum impact
              </p>
            </div>
          </AnimatedCard>

          <div className="space-y-8 max-w-4xl mx-auto">
            {program.curriculum.map((module: any, index: number) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 100}>
                <div className="bg-slate-50/40 border border-slate-150/60 rounded-2xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-slate-100/50 hover:border-indigo-500/20 transform transition-all duration-300 group cursor-pointer relative overflow-hidden">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.01] to-transparent rounded-2xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 relative z-10">
                    <h3 className="text-xl font-bold text-slate-800">{module.module}</h3>
                    <span className="inline-flex bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">{module.duration}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
                    {module.topics.map((topic: string, topicIndex: number) => (
                      <div 
                        key={topicIndex} 
                        className="bg-white border border-slate-100/60 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-600 font-medium hover:border-indigo-500/20 hover:bg-indigo-500/[0.01] transition-all duration-300"
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
              Ready to Transform Your Future?
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              Join thousands of individuals who have experienced growth through the {program.name}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
              {/* Apply Button */}
              <a
                href="/contact"
                className="w-48 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-700/35 px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center justify-center"
              >
                Apply Now
              </a>

              {/* Free Session Button */}
              <a
                href="https://topmate.io/pranav_gujar/1355631?utm_source=public_profile&utm_campaign=pranav_gujar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-56 border border-white/20 hover:border-white/50 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center justify-center"
              >
                Schedule Free Session
              </a>
            </div>
          </div>
        </section>
      </AnimatedCard>

    </div>
  );
};

export default ProgramDetail;