import React, { useState } from 'react';
import { Play, X, Image, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';
import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';
import { getBreadcrumbSchema } from '../lib/schema';

// Gallery Images
import one from '../assets/gallery/1.jpg';
import two from '../assets/gallery/2.jpg';
import three from '../assets/gallery/3.jpg';
import four from '../assets/gallery/4.jpg';
import five from '../assets/gallery/5.jpg';
import six from '../assets/gallery/6.jpg';
import seven from '../assets/gallery/7.jpg';
import eight from '../assets/gallery/8.jpg';
import nine from '../assets/gallery/9.jpg';
import ten from '../assets/gallery/10.jpg';
import eleven from '../assets/gallery/11.jpg';
import twelve from '../assets/gallery/12.jpg';
import thirteen from '../assets/gallery/13.jpg';
import fourteen from '../assets/gallery/14.jpg';

const Gallery = () => {
  const loading = usePageLoading();
  const { t } = useLanguage();
  
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const getTranslation = (key: string, fallback: any) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const mediaItems = [
    {
      type: 'image',
      src: one,
      thumbnail: one,
      title: getTranslation('gallery.items.1.title', 'Initiatives Discussion'),
      category: 'achievements',
      date: '2025-08-21', 
      location: getTranslation('gallery.items.1.location', 'Sangli, India'),
      description: getTranslation('gallery.items.1.description', 'Founder presented authored books to Sangli Sub-Collector, also sharing initiatives.')
    },
    {
      type: 'image',
      src: two,
      thumbnail: two,
      title: getTranslation('gallery.items.2.title', 'Seminarix Session'),
      category: 'programs',
      date: '2025-07-12',
      location: getTranslation('gallery.items.2.location', 'Daryapur, India'),
      description: getTranslation('gallery.items.2.description', 'Gifted authored books and delivered Seminarix seminar for Class 10 students of Ratnabai Rathi Highschool, Daryapur, batch 2025-26.')
    },
    {
      type: 'image',
      src: three,
      thumbnail: three,
      title: getTranslation('gallery.items.3.title', 'Student Feedback'),
      category: 'community',
      date: '2025-07-12',
      location: getTranslation('gallery.items.3.location', 'Daryapur, India'),
      description: getTranslation('gallery.items.3.description', 'Conducted Seminarix seminar for Class 10 batch 2025-26 at Ratnabai Rathi Highschool, Daryapur, receiving inspiring student feedback and appreciation.')
    },
    {
      type: 'image',
      src: four,
      thumbnail: four,
      title: getTranslation('gallery.items.4.title', '5th Anniversary'),
      category: 'events',
      date: '2024-05-17',
      location: getTranslation('gallery.items.4.location', 'Sangli, India'),
      description: getTranslation('gallery.items.4.description', 'Celebrated five years of Purpose, Growth, and Transformation with impactful activities and community engagement.')
    },
    {
      type: 'image',
      src: five,
      thumbnail: five,
      title: getTranslation('gallery.items.5.title', 'Book Published'),
      category: 'achievements',
      date: '2024-05-17',
      location: getTranslation('gallery.items.5.location', 'Sangli, India'),
      description: getTranslation('gallery.items.5.description', 'Founder launched first authored book with respected Dr. K. V. Madhale from Walchand College of Engineering, Sangli.')
    },
    {
      type: 'image',
      src: six,
      thumbnail: six,
      title: getTranslation('gallery.items.6.title', 'Seminarix Inaugural'),
      category: 'programs',
      date: '2024-07-06',
      location: getTranslation('gallery.items.6.location', 'Daryapur, India'),
      description: getTranslation('gallery.items.6.description', 'Visited Ratnabai Rathi Highschool, Daryapur, for the first Seminarix session with Class 10 batch 2024-25, honored by school leadership.')
    },
    {
      type: 'image',
      src: seven,
      thumbnail: seven,
      title: getTranslation('gallery.items.7.title', 'Hostel Seminar'),
      category: 'community',
      date: '2024-09-14',
      location: getTranslation('gallery.items.7.location', 'Daryapur, India'),
      description: getTranslation('gallery.items.7.description', 'Delivered second Seminarix seminar at Dr. B. R. Ambedkar Government Boys Hostel, Daryapur, inspiring hostel students through guidance and motivation.')
    },
    {
      type: 'image',
      src: eight,
      thumbnail: eight,
      title: getTranslation('gallery.items.8.title', 'Science Outreach'),
      category: 'community',
      date: '2024-09-21',
      location: getTranslation('gallery.items.8.location', 'Sangli, India'),
      description: getTranslation('gallery.items.8.description', 'Engaged City Highschool students in a Shanivari Vidnyanvari science session conducted with WCE Sangli under community outreach.')
    },
    {
      type: 'image',
      src: nine,
      thumbnail: nine,
      title: getTranslation('gallery.items.9.title', 'HED 6.0'),
      category: 'events',
      date: '2024-11-11',
      location: getTranslation('gallery.items.9.location', 'Sangli, India'),
      description: getTranslation('gallery.items.9.description', 'Celebrated Happy Eco Diwali 6.0 with innovative contest entries and community tree plantation to promote sustainable celebrations.')
    },
    {
      type: 'image',
      src: ten,
      thumbnail: ten,
      title: getTranslation('gallery.items.10.title', 'Dr. B. R. Ambedkar Jayanti'),
      category: 'team',
      date: '2025-04-14',
      location: getTranslation('gallery.items.10.location', 'Sangli, India'),
      description: getTranslation('gallery.items.10.description', 'Organized Dr. Ambedkar Jayanti with speeches, poster presentations, and awareness activities with WCE Sangli students team.')
    },
    {
      type: 'image',
      src: eleven,
      thumbnail: eleven,
      title: getTranslation('gallery.items.11.title', 'Knowledge Gift'),
      category: 'community',
      date: '2025-05-17',
      location: getTranslation('gallery.items.11.location', 'Sangli, India'),
      description: getTranslation('gallery.items.11.description', 'Gifting Dr. B. R. Ambedkar books to Boys Hostel Sangli during PGT’s 6th Anniversary celebration for spreading knowledge and awareness.')
    },
    {
      type: 'image',
      src: twelve,
      thumbnail: twelve,
      title: getTranslation('gallery.items.12.title', 'Second Book Published'),
      category: 'achievements',
      date: '2025-05-17',
      location: getTranslation('gallery.items.12.location', 'Sangli, India'),
      description: getTranslation('gallery.items.12.description', 'Founder published second authored book and celebrated PGT’s 6th Anniversary with WCE Registrar and CAS Cell Member Secretary.')
    },
    {
      type: 'image',
      src: thirteen,
      thumbnail: thirteen,
      title: getTranslation('gallery.items.13.title', 'HED 5.0'),
      category: 'events',
      date: '2023-12-15',
      location: getTranslation('gallery.items.13.location', 'Sangli, India'),
      description: getTranslation('gallery.items.13.description', 'Concluded eco-friendly Diwali campaign HED 5.0 by planting trees and encouraging sustainable ideas among students.')
    },
    {
      type: 'image',
      src: fourteen,
      thumbnail: fourteen,
      title: getTranslation('gallery.items.14.title', 'First Seminar Of Seminarix'),
      category: 'programs',
      date: '2024-07-06',
      location: getTranslation('gallery.items.14.location', 'Daryapur, India'),
      description: getTranslation('gallery.items.14.description', 'Conducted first-ever Seminarix seminar at Ratnabai Rathi Highschool, Daryapur, marking the beginning of this impactful program.')
    }
  ];

  const tabs = [
    { id: 'all', label: getTranslation('gallery.tabs.all', 'All Media'), count: mediaItems.length },
    { id: 'programs', label: t('navbar.programs'), count: mediaItems.filter(item => item.category === 'programs').length },
    { id: 'events', label: getTranslation('gallery.tabs.events', 'Events'), count: mediaItems.filter(item => item.category === 'events').length },
    { id: 'achievements', label: getTranslation('gallery.tabs.achievements', 'Achievements'), count: mediaItems.filter(item => item.category === 'achievements').length },
    { id: 'team', label: getTranslation('gallery.tabs.team', 'Team'), count: mediaItems.filter(item => item.category === 'team').length },
    { id: 'community', label: getTranslation('gallery.tabs.community', 'Community'), count: mediaItems.filter(item => item.category === 'community').length }
  ];

  const filteredItems = activeTab === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === activeTab);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedMedia) return;
    const currentIndex = filteredItems.findIndex(item => item.title === selectedMedia.title);
    if (currentIndex > 0) {
      setSelectedMedia(filteredItems[currentIndex - 1]);
    } else {
      setSelectedMedia(filteredItems[filteredItems.length - 1]);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedMedia) return;
    const currentIndex = filteredItems.findIndex(item => item.title === selectedMedia.title);
    if (currentIndex < filteredItems.length - 1) {
      setSelectedMedia(filteredItems[currentIndex + 1]);
    } else {
      setSelectedMedia(filteredItems[0]);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMedia) return;
      if (e.key === 'Escape') setSelectedMedia(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, filteredItems]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-28 bg-background overflow-x-hidden min-h-screen transition-colors duration-300">
      <SEO 
        title="Media Gallery & Impact Snapshots"
        description="Snapshots of PGT Global Network's impact, school seminars, webinars, summits, and community outreach projects worldwide."
        schema={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Gallery', item: '/gallery' }
        ])}
      />
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
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">{t('navbar.gallery')}</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {t('navbar.gallery') === 'navbar.gallery' ? 'Gallery' : t('navbar.gallery')}
            </h1>
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              {t('home.programsSubtitle').replace(/\[.*?\]\s*/g, '') === 'home.programsSubtitle' ? 'Capturing moments of transformation, growth, and community across our global network' : t('home.programsSubtitle')}
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Filter Tabs */}
      <section className="py-6 bg-background/80 backdrop-blur-md sticky top-20 z-40 border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 rounded-full font-semibold border text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-card border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 100}>
                <div 
                  onClick={() => setSelectedMedia(item)}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg shadow-slate-950/5 hover:shadow-2xl hover:shadow-slate-950/10 hover:border-indigo-500/20 hover:-translate-y-1.5 transform transition-all duration-300 group cursor-pointer flex flex-col h-full justify-between"
                >
                  <div className="relative overflow-hidden h-64 bg-muted/40">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    
                    {/* Media Type Icon */}
                    <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-md border border-border shadow-sm w-9 h-9 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-300">
                      {item.type === 'video' ? <Play className="h-4.5 w-4.5 fill-current" /> : <Image className="h-4.5 w-4.5" />}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3.5 mb-3 text-muted-foreground/60 text-xs font-semibold">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{item.date}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{item.location}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 font-normal">
                        {item.description}
                      </p>
                    </div>
                    
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 px-2.5 py-1 rounded-full uppercase tracking-wider w-fit mt-5">
                      {item.category}
                    </span>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox / Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 w-11 h-11 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all duration-300 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>

          <button 
            onClick={handlePrev}
            className="absolute left-6 w-11 h-11 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all duration-300 active:scale-95 hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-6 w-11 h-11 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all duration-300 active:scale-95 hidden md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div 
            className="max-w-5xl w-full bg-slate-900 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-[5] bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
              {selectedMedia.type === 'video' ? (
                <iframe 
                  src={selectedMedia.src} 
                  title={selectedMedia.title}
                  className="w-full h-full absolute inset-0 border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <img 
                  src={selectedMedia.src} 
                  alt={selectedMedia.title} 
                  className="max-h-[70vh] object-contain"
                />
              )}
            </div>

            <div className="flex-[3] p-8 flex flex-col justify-between text-left text-white bg-slate-900 border-t md:border-t-0 md:border-l border-white/[0.08]">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider w-fit">
                  {selectedMedia.category}
                </span>
                
                <h3 className="text-2xl font-bold mt-4 mb-3 leading-tight">{selectedMedia.title}</h3>
                
                <div className="flex items-center gap-3.5 mb-6 text-slate-400 text-xs font-semibold">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-indigo-400" />{selectedMedia.date}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-indigo-400" />{selectedMedia.location}</span>
                </div>
                
                <p className="text-slate-400 text-sm leading-relaxed font-normal">
                  {selectedMedia.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06] text-xs text-slate-500 font-semibold select-none">
                <span>{t('common.loading') === 'common.loading' ? 'Media' : t('common.loading')} {filteredItems.findIndex(i => i.title === selectedMedia.title) + 1} of {filteredItems.length}</span>
                <span className="hidden md:inline">Use ← or → keys to navigate</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;