import React, { useState } from 'react';
import { Play, X, Image, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';

import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';

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
  
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const mediaItems = [
    {
      type: 'image',
      src: one,
      thumbnail: one,
      title: 'Initiatives Discussion',
      category: 'achievements',
      date: '2025-08-21', // YYYY-MM-DD
      location: 'Sangli, India',
      description: 'Founder presented authored books to Sangli Sub-Collector, also sharing initiatives.'
    },
    {
      type: 'image',
      src: two,
      thumbnail: two,
      title: 'Seminarix Session',
      category: 'programs',
      date: '2025-07-12',
      location: 'Daryapur, India',
      description: 'Gifted authored books and delivered Seminarix seminar for Class 10 students of Ratnabai Rathi Highschool, Daryapur, batch 2025-26.'
    },
    {
      type: 'image',
      src: three,
      thumbnail: three,
      title: 'Student Feedback',
      category: 'community',
      date: '2025-07-12',
      location: 'Daryapur, India',
      description: 'Conducted Seminarix seminar for Class 10 batch 2025-26 at Ratnabai Rathi Highschool, Daryapur, receiving inspiring student feedback and appreciation.'
    },
    {
      type: 'image',
      src: four,
      thumbnail: four,
      title: ' 5th Anniversary',
      category: 'events',
      date: '2024-05-17',
      location: 'Sangli, India',
      description: 'Celebrated five years of Purpose, Growth, and Transformation with impactful activities and community engagement.'
    },
    {
      type: 'image',
      src: five,
      thumbnail: five,
      title: 'Book Published',
      category: 'achievements',
      date: '2024-05-17',
      location: 'Sangli, India',
      description: 'Founder launched first authored book with respected Dr. K. V. Madhale from Walchand College of Engineering, Sangli.'
    },
    {
      type: 'image',
      src: six,
      thumbnail: six,
      title: 'Seminarix Inaugural',
      category: 'programs',
      date: '2024-07-06',
      location: 'Daryapur, India',
      description: 'Visited Ratnabai Rathi Highschool, Daryapur, for the first Seminarix session with Class 10 batch 2024-25, honored by school leadership.'
    },
    {
      type: 'image',
      src: seven,
      thumbnail: seven,
      title: 'Hostel Seminar',
      category: 'community',
      date: '2024-09-14',
      location: 'Daryapur, India',
      description: 'Delivered second Seminarix seminar at Dr. B. R. Ambedkar Government Boys Hostel, Daryapur, inspiring hostel students through guidance and motivation.'
    },
    {
      type: 'image',
      src: eight,
      thumbnail: eight,
      title: ' Science Outreach',
      category: 'community',
      date: '2024-09-21',
      location: 'Sangli, India',
      description: 'Engaged City Highschool students in a Shanivari Vidnyanvari science session conducted with WCE Sangli under community outreach.'
    },
    {
      type: 'image',
      src: nine,
      thumbnail: nine,
      title: 'HED 6.0',
      category: 'events',
      date: '2024-11-11',
      location: 'Sangli, India',
      description: 'Celebrated Happy Eco Diwali 6.0 with innovative contest entries and community tree plantation to promote sustainable celebrations.'
    },
    {
      type: 'image',
      src: ten,
      thumbnail: ten,
      title: 'Dr. B. R. Ambedkar Jayanti',
      category: 'team',
      date: '2025-04-14',
      location: 'Sangli, India',
      description: 'Organized Dr. Ambedkar Jayanti with speeches, poster presentations, and awareness activities with WCE Sangli students team.'
    },
    {
      type: 'image',
      src: eleven,
      thumbnail: eleven,
      title: ' Knowledge Gift',
      category: 'community',
      date: '2025-05-17',
      location: 'Sangli, India',
      description: 'Gifting Dr. B. R. Ambedkar books to Boys Hostel Sangli during PGT’s 6th Anniversary celebration for spreading knowledge and awareness.'
    },
    {
      type: 'image',
      src: twelve,
      thumbnail: twelve,
      title: 'Second Book Published',
      category: 'achievements',
      date: '2025-05-17',
      location: 'Sangli, India',
      description: 'Founder published second authored book and celebrated PGT’s 6th Anniversary with WCE Registrar and CAS Cell Member Secretary.'
    },
    {
      type: 'image',
      src: thirteen,
      thumbnail: thirteen,
      title: 'HED 5.0',
      category: 'events',
      date: '2023-12-15',
      location: 'Sangli, India',
      description: 'Concluded eco-friendly Diwali campaign HED 5.0 by planting trees and encouraging sustainable ideas among students.'
    },
    {
      type: 'image',
      src: fourteen,
      thumbnail: fourteen,
      title: 'First Seminar Of Seminarix',
      category: 'programs',
      date: '2024-07-06',
      location: 'Daryapur, India',
      description: 'Conducted first-ever Seminarix seminar at Ratnabai Rathi Highschool, Daryapur, marking the beginning of this impactful program.'
    },
    // {
    //   type: 'video',
    //   src: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    //   thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
    //   title: 'Partnership Announcement',
    //   category: 'events',
    //   date: '2024-06-20',
    //   location: 'São Paulo, Brazil',
    //   description: 'Announcement of new strategic partnerships with educational institutions'
    // },
   
  ];

  const tabs = [
    { id: 'all', label: 'All Media', count: mediaItems.length },
    { id: 'programs', label: 'Programs', count: mediaItems.filter(item => item.category === 'programs').length },
    { id: 'events', label: 'Events', count: mediaItems.filter(item => item.category === 'events').length },
    { id: 'achievements', label: 'Achievements', count: mediaItems.filter(item => item.category === 'achievements').length },
    { id: 'team', label: 'Team', count: mediaItems.filter(item => item.category === 'team').length },
    { id: 'community', label: 'Community', count: mediaItems.filter(item => item.category === 'community').length }
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

  const selectedIndex = selectedMedia 
    ? filteredItems.findIndex(item => item.title === selectedMedia.title)
    : -1;

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
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">PGT Global Media Archive</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              Gallery
            </h1>
            <p 
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              Capturing moments of transformation, growth, and community across our global network
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Filter Tabs */}
      <section className="py-6 bg-white/80 backdrop-blur-md sticky top-20 z-40 border-b border-slate-100 transition-all duration-300">
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
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {tab.label} <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${activeTab === tab.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
                </button>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <AnimatedCard
                key={index}
                animation="slideUp"
                delay={index * 100}
              >
                <div
                  className="relative overflow-hidden bg-white border border-slate-200/50 rounded-2xl shadow-xl shadow-slate-100/30 hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.02] hover:-translate-y-1 transform transition-all duration-500 group cursor-pointer"
                  onClick={() => setSelectedMedia(item)}
                >
                  {/* Subtle Theme Glow Overlay */}
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="aspect-square relative overflow-hidden bg-slate-100">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
                    />
                    
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Media Type Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg">
                        {item.type === 'video' ? (
                          <Play className="h-5 w-5 fill-slate-800 ml-0.5" />
                        ) : (
                          <Image className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    
                    {/* Floating Type Badge */}
                    <div className="absolute top-3 right-3 select-none z-10">
                      {item.type === 'video' ? (
                        <div className="bg-red-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm">
                          Video
                        </div>
                      ) : (
                        <div className="bg-indigo-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm">
                          Photo
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5 relative z-10">
                    <h3 className="font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-slate-400 text-xs">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-slate-300" />
                        {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center text-slate-400 text-xs">
                        <MapPin className="h-3.5 w-3.5 mr-2 text-slate-300" />
                        {item.location}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Celebrating Moments banner */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10 border-t border-white/[0.04]">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Celebrating Moments of Transformation
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-slate-400 leading-relaxed font-normal">
              Our gallery captures the stories, growth, and impact of individuals and communities we've touched.  
              Every image tells a journey of learning, connection, and meaningful change.
            </p>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto font-mono">
              Scroll through to relive these moments and be inspired to create your own.
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Premium Lightbox Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-10 select-none animate-fadeIn"
          onClick={() => setSelectedMedia(null)}
        >
          {/* Previous image control */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 sm:left-10 w-12 h-12 bg-white/5 border border-white/10 hover:bg-white/10 text-white hover:text-white rounded-full flex items-center justify-center transition-all duration-300 z-50 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div 
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close trigger button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white/60 hover:text-white flex items-center gap-1.5 transition-colors duration-300 text-xs font-bold tracking-widest uppercase z-50"
            >
              Close <X className="h-5 w-5" />
            </button>

            {/* Image Counter */}
            <div className="absolute -top-12 left-0 text-white/40 text-xs font-bold font-mono tracking-wider">
              IMAGE {selectedIndex + 1} OF {filteredItems.length}
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200/10 w-full flex flex-col md:flex-row max-h-[75vh]">
              {/* Media image container */}
              <div className="flex-1 bg-slate-900 flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-0">
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.title}
                  className="w-full h-full object-cover max-h-[75vh]"
                />
              </div>
              
              {/* Sidebar Info Panel */}
              <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-slate-100 max-h-[35vh] md:max-h-none overflow-y-auto">
                <div className="space-y-4">
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-150 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                    {selectedMedia.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {selectedMedia.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{selectedMedia.description}</p>
                </div>
                
                <div className="pt-6 border-t border-slate-100 flex flex-col gap-2 mt-6">
                  <div className="flex items-center text-slate-400 text-xs font-medium">
                    <Calendar className="h-4 w-4 mr-2.5 text-slate-300" />
                    {new Date(selectedMedia.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center text-slate-400 text-xs font-medium">
                    <MapPin className="h-4 w-4 mr-2.5 text-slate-300" />
                    {selectedMedia.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next image control */}
          <button 
            onClick={handleNext}
            className="absolute right-4 sm:right-10 w-12 h-12 bg-white/5 border border-white/10 hover:bg-white/10 text-white hover:text-white rounded-full flex items-center justify-center transition-all duration-300 z-50 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;