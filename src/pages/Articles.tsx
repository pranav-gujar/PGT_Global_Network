import React, { useState, useMemo } from 'react';
import { Search, Calendar, User, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedCard from '../components/AnimatedCard';
import { articles, Article } from '../data/articles'; 
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';
import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';
import { useLanguage } from '../contexts/LanguageContext';

const Articles = () => {
  const loading = usePageLoading();
  const { t } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const getArticleTitle = (post: any) => {
    const key = `articles.list.${post.id}.title`;
    const val = t(key);
    return val === key ? post.title : val;
  };

  const getArticleExcerpt = (post: any) => {
    const key = `articles.list.${post.id}.excerpt`;
    const val = t(key);
    return val === key ? post.excerpt : val;
  };

  const getArticleCategory = (post: any) => {
    const key = `articles.list.${post.id}.category`;
    const val = t(key);
    return val === key ? post.category : val;
  };

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(articles.map(post => getArticleCategory(post))))];
  }, [t]);

  const filteredPosts = useMemo(() => {
    return articles.filter(post => {
      const title = getArticleTitle(post);
      const excerpt = getArticleExcerpt(post);
      const category = getArticleCategory(post);

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, t]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const featuredPost = filteredPosts.length > 0 && searchTerm === '' && selectedCategory === 'All'
    ? filteredPosts[0]
    : null;

  const postsToRender = featuredPost 
    ? filteredPosts.slice(1)
    : filteredPosts;

  return (
    <div className="pt-28 bg-background overflow-x-hidden transition-colors duration-300">
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
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">{t('articles.tagline')}</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {t('articles.title')}
            </h1>
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              {t('articles.description')}
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Search and Filter Section */}
      <section className="py-6 bg-background/80 backdrop-blur-md sticky top-20 z-40 border-b border-border transition-all duration-305">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={t('articles.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all duration-305 text-foreground"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-card text-sm text-foreground transition-all duration-300 w-full md:w-auto"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Articles Area */}
      <section className="py-24 bg-card/25 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Elevated Featured Article Banner */}
          {featuredPost && (
            <div className="mb-20">
              <AnimatedCard animation="slideUp">
                <Link
                  to={`/articles/${featuredPost.slug}`}
                  className="relative overflow-hidden bg-card border border-border rounded-3xl shadow-xl shadow-slate-950/10 dark:shadow-none hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.02] transform transition-all duration-550 group cursor-pointer flex flex-col lg:flex-row gap-8 lg:gap-12 p-6 sm:p-8 no-underline text-left"
                >
                  {/* Subtle Theme Radial Glow Overlay */}
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-3xl pointer-events-none" />
                  
                  {/* Featured Cover Image */}
                  <div className="flex-1 overflow-hidden rounded-2xl border border-border relative group aspect-video lg:aspect-auto lg:h-[400px]">
                    <img
                      src={featuredPost.image}
                      alt={getArticleTitle(featuredPost)}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-lg text-[9px] font-extrabold tracking-widest uppercase shadow-sm">
                      {t('articles.tagline') === 'insights' ? 'Featured Article' : t('articles.tagline')}
                    </div>
                  </div>

                  {/* Featured Info Details */}
                  <div className="flex-1 flex flex-col justify-between py-2 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-indigo-50/10 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200/20 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {getArticleCategory(featuredPost)}
                        </span>
                        <span className="text-muted-foreground/80 text-xs font-semibold">{t('articles.readTime', { time: featuredPost.readTime })}</span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight group-hover:text-indigo-600 transition-colors duration-300">
                        {getArticleTitle(featuredPost)}
                      </h2>
                      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
                        {getArticleExcerpt(featuredPost)}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border">
                      <div className="flex items-center space-x-3 text-muted-foreground/85 text-xs">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold uppercase select-none border border-border">
                          {featuredPost.author.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground leading-none">{featuredPost.author}</p>
                          <p className="text-[10px] mt-0.5">{new Date(featuredPost.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>

                      <span
                        className="group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-btn pointer-events-none" />
                        {t('common.readMore') === 'common.readMore' ? 'Read Full Article' : t('common.readMore')}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            </div>
          )}

          {filteredPosts.length === 0 ? (
            <AnimatedCard animation="fadeIn">
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-foreground mb-4">{t('articles.noArticles')}</h3>
              </div>
            </AnimatedCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postsToRender.map((post, index) => (
                <AnimatedCard key={post.id} animation="slideUp" delay={index * 120}>
                  <Link
                    to={`/articles/${post.slug}`}
                    className="relative overflow-hidden bg-card border border-border rounded-2xl shadow-xl shadow-slate-950/10 dark:shadow-none hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.02] hover:-translate-y-1.5 transform transition-all duration-300 group flex flex-col justify-between cursor-pointer h-full no-underline text-left"
                  >
                    {/* Subtle Theme Radial Glow Overlay */}
                    <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                        {/* Cover thumbnail */}
                        <div className="aspect-video relative overflow-hidden bg-muted rounded-t-2xl border-b border-border">
                          <img
                            src={post.image}
                            alt={getArticleTitle(post)}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                          />
                        </div>

                        {/* Article Header info */}
                        <div className="p-6 pb-0">
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-2.5 py-1 bg-indigo-50/10 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200/20 text-[10px] font-bold rounded-full uppercase tracking-wider">
                              {getArticleCategory(post)}
                            </span>
                            <span className="text-muted-foreground/80 text-xs font-semibold">{t('articles.readTime', { time: post.readTime })}</span>
                          </div>

                          <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                            {getArticleTitle(post)}
                          </h2>

                          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 font-normal">{getArticleExcerpt(post)}</p>
                        </div>
                      </div>

                      {/* Article Footer details */}
                      <div className="p-6 pt-4 border-t border-border/60 flex items-center justify-between gap-4 mt-6">
                        <div className="flex items-center space-x-2.5 text-muted-foreground/80 text-[11px] font-semibold">
                          <User className="h-3.5 w-3.5 text-muted-foreground/50" />
                          <span>{post.author}</span>
                          <Calendar className="h-3.5 w-3.5 ml-2 text-muted-foreground/50" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>

                        <span
                          className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-500 inline-flex items-center text-xs tracking-wider uppercase group-hover:translate-x-0.5 transition-transform duration-300"
                        >
                          {t('common.readMore') === 'common.readMore' ? 'Read More' : t('common.readMore')}
                          <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 duration-300" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stay Inspired banner */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {t('common.explore').replace(/\[.*?\]\s*/g, '') === 'common.explore' ? 'Stay Inspired with Our Articles' : t('common.explore')}
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-slate-400 leading-relaxed font-normal">
              {t('about.principles.sustainability.description')}
            </p>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Articles;
