import React, { useState, useEffect } from "react";
import { MapPin, Clock, Users, ArrowRight, ExternalLink, Check, BookOpen, Award, Briefcase, Target, GraduationCap, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ProtectedAction from "../components/ProtectedAction";
import AnimatedCard from "../components/AnimatedCard";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import HeroBackground from "../components/HeroBackground";
import Background from "../components/Background";
import LoadingSpinner from "../components/LoadingSpinner";
import { usePageLoading } from "../hooks/usePageLoading";
import { useLanguage } from "../contexts/LanguageContext";
import SEO from "../components/SEO";
import { getBreadcrumbSchema, getJobPostingSchema } from "../lib/schema";

// JobPosition component for Core Team roles
const JobPosition = ({ position, handleApply, isApplied, onSignInClick }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  return (
    <AnimatedCard animation="slideUp" delay={0}>
      <div className="relative overflow-hidden bg-card border border-border backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-950/10 dark:shadow-none hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.02] hover:-translate-y-1.5 transform transition-all duration-300 group flex flex-col h-full cursor-pointer justify-between">
        <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex-grow space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {position.department}
            </span>
            <span className="text-muted-foreground/60 text-xs font-semibold">PGT Core Team</span>
          </div>

          <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-600 transition-colors duration-300">
            {position.title}
          </h3>

          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              {t('programs.timelineTitle') === 'programs.timelineTitle' ? 'Key Responsibilities' : t('programs.timelineTitle')}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              {(position.responsibilities as string[]).map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed text-xs">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="pt-6 mt-6 border-t border-border relative z-10">
          {user ? (
            isApplied ? (
              <button
                disabled
                className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide inline-flex items-center justify-center gap-1.5 cursor-not-allowed"
              >
                <Check className="h-3.5 w-3.5" />
                {t('apply.form.successTitle').replace(/\[.*?\]\s*/g, '') === 'apply.form.successTitle' ? 'Application Submitted' : t('apply.form.successTitle')}
              </button>
            ) : (
              <button
                onClick={() => handleApply(position.title)}
                className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-btn pointer-events-none" />
                {t('careers.apply')}
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )
          ) : (
            <button
              onClick={onSignInClick}
              className="w-full bg-muted border border-border text-muted-foreground hover:bg-muted/80 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide inline-flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer"
            >
              Sign in to Apply
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
};

const Careers = () => {
  const loading = usePageLoading();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const [appliedPositions, setAppliedPositions] = useState([]);
  const [fetchingApps, setFetchingApps] = useState(false);

  useEffect(() => {
    const fetchAppliedPositions = async () => {
      if (!user) return;
      setFetchingApps(true);
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("position_title")
          .eq("user_id", user.id);
        
        if (error) throw error;
        if (data) {
          setAppliedPositions(data.map((app) => app.position_title));
        }
      } catch (err) {
        console.error("Error fetching user applications:", err);
      } finally {
        setFetchingApps(false);
      }
    };

    fetchAppliedPositions();
  }, [user]);

  const getTranslation = (key: string, fallback: any) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const handleApply = (positionTitle) => {
    navigate(`/apply?position=${encodeURIComponent(positionTitle)}`);
  };

  const openPositions = [
    {
      id: 1,
      title: getTranslation("careers.positions.cod.title", "Chief Operations Director (COD)"),
      department: getTranslation("careers.positions.cod.department", "Operations"),
      responsibilities: getTranslation("careers.positions.cod.responsibilities", [
        "Manage day-to-day team operations, timelines, and internal coordination",
        "Track tasks and ensure smooth execution of programs",
        "Collaborate with all departments to keep projects running on time"
      ])
    },
    {
      id: 2,
      title: getTranslation("careers.positions.cco.title", "Chief Communications Officer (CCO)"),
      department: getTranslation("careers.positions.cco.department", "Communications"),
      responsibilities: getTranslation("careers.positions.cco.responsibilities", [
        "Write and review all content: captions, posts, internal documents, and scripts",
        "Maintain the tone and voice of PGT across platforms",
        "Collaborate with PR and Design teams for campaigns"
      ])
    },
    {
      id: 3,
      title: getTranslation("careers.positions.cd.title", "Creative Director (CD)"),
      department: getTranslation("careers.positions.cd.department", "Creative"),
      responsibilities: getTranslation("careers.positions.cd.responsibilities", [
        "Design posters, carousels, edit videos, reels, thumbnails, and all brand creatives",
        "Maintain visual identity and consistency across platforms",
        "Support all departments with design and media content"
      ])
    },
    {
      id: 4,
      title: getTranslation("careers.positions.cso.title", "Chief Strategy Officer (CSO)"),
      department: getTranslation("careers.positions.cso.department", "Strategy"),
      responsibilities: getTranslation("careers.positions.cso.responsibilities", [
        "Lead campaign ideas, innovation, and planning",
        "Analyze what's working and suggest improvements",
        "Assist in building long-term strategies for PGT programs"
      ])
    },
    {
      id: 5,
      title: getTranslation("careers.positions.prh.title", "Public Relations Head (PRH)"),
      department: getTranslation("careers.positions.prh.department", "Public Relations"),
      responsibilities: getTranslation("careers.positions.prh.responsibilities", [
        "Represent PGT publicly and build collaborations",
        "Handle outreach to colleges, NGOs, media, and influencers",
        "Support visibility and networking of the brand"
      ])
    },
    {
      id: 6,
      title: getTranslation("careers.positions.cap.title", "Campus Director (CAP)"),
      department: getTranslation("careers.positions.cap.department", "Campus Relations"),
      responsibilities: getTranslation("careers.positions.cap.responsibilities", [
        "Act as the official link between PGT and college campus",
        "Organize on-ground activities and represent PGT at events",
        "Promote awareness and engagement inside campus"
      ])
    },
    {
      id: 7,
      title: getTranslation("careers.positions.ctd.title", "Chief Technical Director (CTD)"),
      department: getTranslation("careers.positions.ctd.department", "Technology"),
      responsibilities: getTranslation("careers.positions.ctd.responsibilities", [
        "Build and manage the official PGT website",
        "Create event registration pages and landing pages",
        "Maintain form integrations, analytics, and digital tools"
      ])
    },
    {
      id: 8,
      title: getTranslation("careers.positions.gsec.title", "General Secretary (GSEC)"),
      department: getTranslation("careers.positions.gsec.department", "Administration"),
      responsibilities: getTranslation("careers.positions.gsec.responsibilities", [
        "Handle official documentation, letters, and internal announcements",
        "Support the Founder in maintaining structure and follow-ups",
        "Keep track of internal workflows and communication logs"
      ])
    }
  ];

  const benefits = [
    {
      title: getTranslation("careers.list.scale", "Global Impact"),
      description: getTranslation("about.principles.sustainability.description", "Work on projects that transform lives across the world"),
      icon: "🌍"
    },
    {
      title: getTranslation("careers.benefitsTitle", "Professional Growth"),
      description: getTranslation("about.principles.people.description", "Continuous learning opportunities and skill development"),
      icon: "📈"
    },
    {
      title: getTranslation("careers.list.remote", "Flexible Work"),
      description: "Remote-first culture with flexible working arrangements",
      icon: "💻"
    },
    {
      title: getTranslation("about.principles.sustainability.title", "Sustainability"),
      description: "Comprehensive core values and purpose-driven work",
      icon: "🏥"
    },
    {
      title: getTranslation("about.principles.community.title", "Team Culture"),
      description: getTranslation("about.principles.community.description", "Collaborative, inclusive, and purpose-driven work environment"),
      icon: "🤝"
    },
    {
      title: getTranslation("careers.list.growth", "Learning Mentorship"),
      description: "Mentorship, courses, and certifications",
      icon: "📚"
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-28 bg-background overflow-x-hidden transition-colors duration-300">
      <SEO 
        title="Careers & Opportunities"
        description="Join PGT Global Network. Explore core team positions, volunteer roles, and leadership opportunities to shape global digital education."
        schema={[
          getBreadcrumbSchema([
            { name: 'Home', item: '/' },
            { name: 'Careers', item: '/careers' }
          ]),
          getJobPostingSchema({
            title: 'Digital Content Creator & Community Lead',
            description: 'Lead content strategy and community growth initiatives across PGT platforms.',
            datePosted: '2026-01-01'
          }),
          getJobPostingSchema({
            title: 'Technical Program Coordinator',
            description: 'Coordinate digital learning webinars and technology programs globally.',
            datePosted: '2026-01-01'
          })
        ]}
      />
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
              className="inline-flex items-center gap-2 bg-card/90 border border-border px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.03)] mb-8 animate-reveal-up backdrop-blur-md hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:border-indigo-400/40 hover:-translate-y-[1px] transform transition-all duration-300 pointer-events-auto cursor-pointer"
              style={{ animationDelay: '100ms' }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">{t('careers.tagline')}</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {t('careers.title')}
            </h1>
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              {t('careers.description')}
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Why Join Us */}
      <section className="py-24 bg-card/25 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">{t('careers.benefitsTag')}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">
                {t('careers.benefitsTitle')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('careers.benefitsSubtitle')}
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 100}>
                <div className="relative overflow-hidden bg-card border border-border backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-slate-950/10 dark:shadow-none hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.02] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer text-center">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-3 relative z-10">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm relative z-10">
                    {benefit.description}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Join the PGT Core Team Section */}
      <section className="py-24 bg-background border-b border-border relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">{t('careers.positionsTag')}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">
                {t('careers.positionsTitle')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('careers.positionsSubtitle')}
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {openPositions.map((position, index) => (
              <JobPosition
                key={index}
                position={position}
                handleApply={handleApply}
                isApplied={appliedPositions.includes(position.title)}
                onSignInClick={() => navigate(`/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mentorship & Internship Programs */}
      <section className="relative py-16 sm:py-24 bg-card/30 border-b border-border overflow-hidden z-10 transition-colors duration-300">
        {/* Subtle background glow tint */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3.5 font-mono shadow-sm">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                GROWTH & OPPORTUNITIES
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-1 mb-3 sm:mb-4 tracking-tight font-sans">
                Mentorship & Internship Programs
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal px-2">
                Empowering students and emerging professionals through structured learning, hands-on experience, and real-world opportunities.
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Mentorship Program Card */}
            <AnimatedCard animation="fadeIn">
              <div className="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-950/5 dark:shadow-none hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full">
                {/* Top Accent Gradient Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600" />
                
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 opacity-40 transition-opacity duration-500" />

                <div className="p-5 sm:p-8 md:p-10 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Badge row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-5 sm:mb-6">
                      <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-200/40 dark:border-indigo-800/40">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Mentorship Program
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">PGT Learning</span>
                    </div>

                    {/* Header */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground mb-2.5 sm:mb-3 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {getTranslation("careers.mentorshipTitle", "Explore Mentorship Program")}
                    </h3>

                    {/* Intro */}
                    <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 font-normal">
                      Structured mentorship designed to support learners from <span className="font-semibold text-indigo-600 dark:text-indigo-400">any educational background</span>,
                      helping them gain clarity, confidence, and real-world skills.
                    </p>

                    {/* Feature Items List */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                      
                      {/* Feature 1 */}
                      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/70 hover:border-indigo-500/20 transition-all duration-300">
                        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-800/30 flex-shrink-0 mt-0.5">
                          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1">150+ Specialized Domains</h4>
                          <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed font-normal">
                            Spanning <strong>11+ broad categories</strong> including technology, engineering, design, business, content, and social impact.
                          </p>
                        </div>
                      </div>

                      {/* Feature 2 */}
                      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/70 hover:border-indigo-500/20 transition-all duration-300">
                        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-800/30 flex-shrink-0 mt-0.5">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1">Open to All Streams</h4>
                          <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed font-normal">
                            Designed for students of <strong>all branches and degrees</strong>. Focuses on guided learning, hands-on practice, and mentor-led growth.
                          </p>
                        </div>
                      </div>

                      {/* Feature 3 */}
                      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/70 hover:border-indigo-500/20 transition-all duration-300">
                        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-800/30 flex-shrink-0 mt-0.5">
                          <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1">Verified Certification</h4>
                          <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed font-normal">
                            Earn an official certificate of completion and verified performance badges from PGT Global Network.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* CTA Button - Direct External Link */}
                  <div className="pt-2 relative z-10">
                    <a
                      href="https://mentorship.pgtglobalnetwork.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.01] transition-all duration-300 inline-flex items-center justify-center gap-2"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-btn pointer-events-none" />
                      Explore Mentorship
                      <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  </div>
                </div>

              </div>
            </AnimatedCard>

            {/* Internship Program Card */}
            <AnimatedCard animation="fadeIn" delay={150}>
              <div className="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-950/5 dark:shadow-none hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full">
                {/* Top Accent Gradient Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />
                
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 opacity-40 transition-opacity duration-500" />

                <div className="p-5 sm:p-8 md:p-10 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Badge row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-5 sm:mb-6">
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-200/40 dark:border-blue-800/40">
                        <Briefcase className="h-3.5 w-3.5" />
                        Internship Program
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">PGT Careers</span>
                    </div>

                    {/* Header */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground mb-2.5 sm:mb-3 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {getTranslation("careers.internshipTitle", "Explore Internship Program")}
                    </h3>

                    {/* Intro */}
                    <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 font-normal">
                      Gain practical experience, work on real-world projects, and collaborate with PGT Global Network teams to <span className="font-semibold text-blue-600 dark:text-blue-400">accelerate your career</span>.
                    </p>

                    {/* Feature Items List */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                      
                      {/* Feature 1 */}
                      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/70 hover:border-blue-500/20 transition-all duration-300">
                        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-800/30 flex-shrink-0 mt-0.5">
                          <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1">Practical Real-World Experience</h4>
                          <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed font-normal">
                            Work directly on <strong>live projects, campaigns, and digital platforms</strong> with global reach and measurable impact.
                          </p>
                        </div>
                      </div>

                      {/* Feature 2 */}
                      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/70 hover:border-blue-500/20 transition-all duration-300">
                        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-800/30 flex-shrink-0 mt-0.5">
                          <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1">Diverse Domain Roles</h4>
                          <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed font-normal">
                            Opportunities across <strong>Tech, Creative Media, Operations, Strategy, PR, and Content Creation</strong>.
                          </p>
                        </div>
                      </div>

                      {/* Feature 3 */}
                      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/70 hover:border-blue-500/20 transition-all duration-300">
                        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-800/30 flex-shrink-0 mt-0.5">
                          <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1">Official Credentials & Certification</h4>
                          <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed font-normal">
                            Receive official <strong>Internship Completion Certificates, recommendation letters</strong>, and performance recognition.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* CTA Button - Direct External Link */}
                  <div className="pt-2 relative z-10">
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSftcJxHfGfY29pYBliDi__zniohipKYHq9zggpxKmM4FpsepQ/viewform?usp=dialog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] hover:scale-[1.01] transition-all duration-300 inline-flex items-center justify-center gap-2"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-btn pointer-events-none" />
                      Explore Internship
                      <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  </div>
                </div>

              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24 bg-card/25 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">workflow</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">
                Application Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our streamlined process ensures we find the right fit for both you and our organization
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group cursor-pointer">
              <AnimatedCard animation="zoomIn" delay={0}>
                <div className="w-16 h-16 bg-card border border-border text-indigo-600 dark:text-indigo-400 font-extrabold text-xl shadow-slate-950/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-indigo-400 transition-all duration-300 select-none">
                  <span>1</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Apply Online</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-normal max-w-xs mx-auto">Submit your application through our online form</p>
              </AnimatedCard>
            </div>

            <div className="text-center group cursor-pointer">
              <AnimatedCard animation="zoomIn" delay={150}>
                <div className="w-16 h-16 bg-card border border-border text-emerald-600 font-extrabold text-xl shadow-slate-950/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-emerald-400 transition-all duration-300 select-none">
                  <span>2</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Initial Review</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-normal max-w-xs mx-auto">Our team reviews your application and qualifications</p>
              </AnimatedCard>
            </div>

            <div className="text-center group cursor-pointer">
              <AnimatedCard animation="zoomIn" delay={300}>
                <div className="w-16 h-16 bg-card border border-border text-purple-600 font-extrabold text-xl shadow-slate-950/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-purple-400 transition-all duration-300 select-none">
                  <span>3</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Interview</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-normal max-w-xs mx-auto">Virtual or in-person interview with the hiring team</p>
              </AnimatedCard>
            </div>

            <div className="text-center group cursor-pointer">
              <AnimatedCard animation="zoomIn" delay={450}>
                <div className="w-16 h-16 bg-card border border-border text-pink-600 font-extrabold text-xl shadow-slate-950/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-pink-400 transition-all duration-300 select-none">
                  <span>4</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Welcome</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-normal max-w-xs mx-auto">Join our team and start making an impact</p>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10 border-t border-white/[0.04]">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              Don't see a position that fits? We're always looking for passionate individuals to join our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="group/btn relative overflow-hidden bg-white text-slate-800 border border-slate-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-50 hover:shadow-lg active:scale-[0.98] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Send Us Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/contact"
                className="border-2 border-white/80 text-white hover:bg-white hover:text-slate-950 hover:border-white px-8 py-3.5 rounded-xl font-semibold active:scale-[0.98] transform transition-all duration-300 inline-flex items-center justify-center"
              >
                {t('footer.contactUs')}
              </a>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Careers;
