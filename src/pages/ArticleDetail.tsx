import React from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from '../components/LoadingSpinner'; 
import { usePageLoading } from '../hooks/usePageLoading';
import {
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  Clock,
  Share2,
  Copy,
  Check,
  Facebook,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import AnimatedCard from "../components/AnimatedCard";
import { articles } from "../data/articles"; 
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';

const ArticleDetail = () => {
  const loading = usePageLoading();
  
  const { slug } = useParams();
  const [shareDropdownOpen, setShareDropdownOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const shareContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareContainerRef.current && 
        !shareContainerRef.current.contains(event.target as Node)
      ) {
        setShareDropdownOpen(false);
      }
    };

    if (shareDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareDropdownOpen]);

  // find article by slug
  const blogPost = articles.find((post) => post.slug === slug);

  if (!blogPost) {
    return (
      <div className="pt-16 text-center text-gray-600 text-lg">
        Article not found 😕
      </div>
    );
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = blogPost.title;
    const text = `Check out this insightful article: "${title}" by ${blogPost.author}`;

    switch (platform) {
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy: ", err);
        }
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
          "_blank"
        );
        break;
    }
    setShareDropdownOpen(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-28 bg-slate-50/30 overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <AnimatedCard animation="fadeIn">
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-100">
          <HeroBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Back Button Navigation Bar */}
            <div className="max-w-4xl mx-auto mb-8 text-left animate-reveal-up" style={{ animationDelay: '50ms' }}>
              <Link
                to="/articles"
                className="group inline-flex items-center text-slate-500 hover:text-indigo-600 text-sm font-semibold tracking-wide transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Articles
              </Link>
            </div>

            {/* Category Tag Badge */}
            <div className="mb-6 animate-reveal-up" style={{ animationDelay: '100ms' }}>
              <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {blogPost.category}
              </span>
            </div>

            {/* Article Main Title */}
            <h1 
              className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-8 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {blogPost.title}
            </h1>

            {/* Article Author & Metadata */}
            <div 
              className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-slate-500 text-sm font-medium animate-reveal-up"
              style={{ animationDelay: '350ms' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold uppercase select-none">
                  {blogPost.author.slice(0, 2)}
                </div>
                <span className="font-bold text-slate-700">{blogPost.author}</span>
              </div>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full hidden sm:inline" />
              <div className="flex items-center">
                <Calendar className="h-4.5 w-4.5 mr-2 text-slate-400" />
                {new Date(blogPost.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full hidden sm:inline" />
              <div className="flex items-center">
                <Clock className="h-4.5 w-4.5 mr-2 text-slate-400" />
                {blogPost.readTime}
              </div>
            </div>

            {/* Featured Image Premium Photo Card */}
            <AnimatedCard animation="fadeIn" delay={450}>
              <div className="relative max-w-4xl mx-auto mt-12 overflow-hidden rounded-3xl border border-slate-200/50 shadow-2xl shadow-slate-100/30 aspect-video group">
                <img
                  src={blogPost.image}
                  alt={blogPost.title}
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                />
              </div>
            </AnimatedCard>

          </div>
        </section>
      </AnimatedCard>

      {/* Content Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp" delay={200}>
            <div className="bg-white border border-slate-200/50 rounded-3xl shadow-xl shadow-slate-100/30 p-8 sm:p-12 md:p-16 relative z-10">
              
              <style>
                {`
                  .blog-prose h1, .blog-prose h2, .blog-prose h3, .blog-prose h4 {
                    font-family: system-ui, -apple-system, sans-serif;
                    font-weight: 800;
                    color: #1e293b;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                    line-height: 1.25;
                    letter-spacing: -0.02em;
                  }
                  .blog-prose h1 { font-size: 2.25rem; }
                  .blog-prose h2 { font-size: 1.75rem; border-b border-slate-100 pb-2; }
                  .blog-prose h3 { font-size: 1.375rem; }
                  .blog-prose p {
                    font-size: 1.125rem;
                    line-height: 1.85;
                    color: #475569;
                    margin-bottom: 1.75rem;
                    font-weight: 400;
                  }
                  .blog-prose > p:first-of-type::first-letter {
                    font-size: 3rem;
                    font-weight: 900;
                    color: #4f46e5;
                    font-family: system-ui, -apple-system, sans-serif;
                    margin-right: 0.08em;
                    line-height: 1;
                  }
                  .blog-prose strong {
                    color: #0f172a;
                    font-weight: 700;
                  }
                  .blog-prose blockquote {
                    border-left: 4px solid #4f46e5;
                    padding: 0.5rem 0 0.5rem 1.5rem;
                    font-style: italic;
                    color: #0f172a;
                    margin: 2.25rem 0;
                    font-size: 1.25rem;
                    line-height: 1.7;
                  }
                  .blog-prose ul {
                    list-style-type: disc;
                    padding-left: 1.75rem;
                    margin-bottom: 1.75rem;
                  }
                  .blog-prose ol {
                    list-style-type: decimal;
                    padding-left: 1.75rem;
                    margin-bottom: 1.75rem;
                  }
                  .blog-prose li {
                    font-size: 1.125rem;
                    line-height: 1.8;
                    color: #475569;
                    margin-bottom: 0.75rem;
                  }
                  .blog-prose pre {
                    background-color: #0f172a;
                    color: #f8fafc;
                    padding: 1.25rem;
                    border-radius: 12px;
                    overflow-x: auto;
                    font-family: monospace;
                    font-size: 0.95rem;
                    margin: 2rem 0;
                  }
                  .blog-prose code {
                    background-color: #f1f5f9;
                    color: #0f172a;
                    padding: 0.2rem 0.4rem;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-family: monospace;
                  }
                  .blog-prose pre code {
                    background-color: transparent;
                    padding: 0;
                    color: inherit;
                    font-size: inherit;
                  }
                  .blog-prose img {
                    border-radius: 16px;
                    margin: 2.5rem 0;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
                    border: 1px solid #f1f5f9;
                  }
                `}
              </style>

              {/* Dynamic Rich Text Render Output */}
              <div
                className="blog-prose max-w-none text-left"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />

              {/* Tags Section */}
              <div className="mt-16 pt-10 border-t border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase mb-5 text-left font-mono">
                  Article Tags
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {blogPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-slate-50 border border-slate-100 hover:border-indigo-500/20 hover:bg-indigo-500/[0.01] text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Options Panel */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase font-mono">
                    Share this article
                  </h3>
                  <div ref={shareContainerRef} className="relative">
                    <button
                      onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                      className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/50 text-indigo-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-sm"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Article
                    </button>

                    {shareDropdownOpen && (
                      <div className="absolute right-0 mt-3.5 w-52 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-xl z-20 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <button
                          onClick={() => handleShare("copy")}
                          className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                          {copied ? "Copied Link!" : "Copy URL Link"}
                        </button>
                        <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                        <button
                          onClick={() => handleShare("twitter")}
                          className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400 flex-shrink-0" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          Share on X
                        </button>
                        <button
                          onClick={() => handleShare("facebook")}
                          className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                        >
                          <Facebook className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          Share on Facebook
                        </button>
                        <button
                          onClick={() => handleShare("linkedin")}
                          className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                        >
                          <Linkedin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          Share on LinkedIn
                        </button>
                        <button
                          onClick={() => handleShare("whatsapp")}
                          className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          Share on WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Connection CTA / Read More */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10 border-t border-white/[0.04]">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Enjoyed Reading This Article?
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              Keep exploring more inspiring stories, leadership insights, and transformative updates from our global community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
              <Link
                to="/articles"
                className="w-56 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-700/35 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                Explore More Articles
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/contact"
                className="w-48 border border-white/20 hover:border-white/50 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center justify-center"
              >
                Connect With Us
              </Link>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default ArticleDetail;
