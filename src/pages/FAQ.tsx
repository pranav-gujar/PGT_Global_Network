import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';

import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';

const FAQ = () => {
    const loading = usePageLoading();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'programs', name: 'Programs' },
    { id: 'application', name: 'Application Process' },
    { id: 'general', name: 'General' },
    { id: 'technical', name: 'Technical' },
    { id: 'partnership', name: 'Partnerships' }
  ];

  const faqItems = [
  {
    id: 1,
    category: 'general',
    question: 'What is PGT Global Network?',
    answer: 'PGT Global Network is a student-led, purpose-driven organization empowering individuals through leadership, awareness, education, and community-driven programs. Founded in 2019, it has grown into a platform where students discover real-world learning, social leadership, and meaningful impact.'
  },
  {
    id: 2,
    category: 'programs',
    question: 'What programs does PGT offer?',
    answer: 'We run flagship initiatives including D3 (Daily Discovery Digest), VoA (Voices of Ability), Seminarix workshops, MotivMinds video series, and the annual HED – Happy Eco Diwali campaign. Each program focuses on empowering students and communities in different ways.'
  },
  {
    id: 3,
    category: 'application',
    question: 'How can I participate in a program?',
    answer: 'Each program has its own mode of participation. For example, MotivMinds and D3 are published on our social platforms for open access, Seminarix is delivered directly in schools and hostels, and VoA accepts guest storytellers by invitation or application. Details are shared on our website and social media.'
  },
  {
    id: 4,
    category: 'programs',
    question: 'Are the programs free?',
    answer: 'Yes, almost all PGT Global Network initiatives are offered free of cost. Our goal is to make awareness, learning, and empowerment accessible to everyone.'
  },
  {
    id: 5,
    category: 'general',
    question: 'Where is PGT based?',
    answer: 'PGT Global Network is based in Daryapur, Maharashtra, India. While we operate from our hometown, our reach extends globally through digital platforms and connections.'
  },
  {
    id: 6,
    category: 'application',
    question: 'Who can join or benefit from PGT programs?',
    answer: 'Anyone interested in leadership, learning, and personal growth can benefit from our programs. Most of our initiatives are designed for students, but they are open to all age groups who seek inspiration and awareness.'
  },
  {
    id: 7,
    category: 'partnership',
    question: 'Can organizations or individuals partner with PGT?',
    answer: 'Yes, we welcome partnerships with schools, colleges, organizations, and individuals who share our vision of empowering students and communities. For collaborations, you can reach out at office@pgtglobalnetwork.com.'
  },
  {
    id: 8,
    category: 'general',
    question: 'How can I stay updated on PGT initiatives?',
    answer: 'You can follow us on Instagram, LinkedIn, and YouTube, or visit our website pgtglobalnetwork.com. All major program updates and new initiatives are announced there.'
  },
  {
  id: 9,
  category: 'technical',
  question: 'How can I report a technical issue with PGT platforms?',
  answer: 'If you face any technical issues while using our website or platforms, you can contact us at office@pgtglobalnetwork.com with details or screenshots of the problem. Our technical team will assist you as soon as possible.'
}
];


  const toggleItem = (id: number) => {
    setOpenItemId(prev => prev === id ? null : id);
  };

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">PGT Knowledge Hub</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              Frequently Asked Questions
            </h1>
            <p 
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              Find answers to common questions about our programs, application process, and organization
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Search and Filter */}
      <section className="py-8 bg-white/80 backdrop-blur-md sticky top-20 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <AnimatedCard animation="slideUp">
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm placeholder-slate-400 transition-all duration-300"
                />
              </div>
            </div>
          </AnimatedCard>

          {/* Category Filter */}
          <AnimatedCard animation="slideUp" delay={150}>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-lg shadow-indigo-500/15'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16 bg-white/70 border border-slate-200/50 backdrop-blur-sm rounded-2xl p-8 max-w-lg mx-auto">
              <HelpCircle className="h-12 w-12 text-slate-350 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No questions found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((item) => {
                const isOpen = openItemId === item.id;
                return (
                  <div 
                    key={item.id} 
                    className={`bg-white/70 border backdrop-blur-sm rounded-2xl transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'border-indigo-500/20 shadow-xl shadow-indigo-500/[0.01]' 
                        : 'border-slate-200/50 shadow-sm hover:border-slate-350'
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition-colors"
                    >
                      <h3 className={`text-base sm:text-lg font-bold transition-colors duration-300 ${
                        isOpen ? 'text-indigo-650' : 'text-slate-850'
                      }`}>
                        {item.question}
                      </h3>
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-350 ${
                        isOpen 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 rotate-180' 
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </button>
                    
                    <div 
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 pt-2 border-t border-slate-100/80">
                          <p className="text-slate-600 text-sm leading-relaxed font-normal">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10 border-t border-white/[0.04]">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Still Have Questions?
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              Can't find what you're looking for? Our team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="group/btn relative overflow-hidden bg-white text-slate-800 border border-slate-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-50 hover:shadow-lg active:scale-[0.98] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-btn pointer-events-none" />
                Contact Us
                <HelpCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default FAQ;