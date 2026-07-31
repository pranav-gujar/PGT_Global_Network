import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const loading = usePageLoading();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTranslation = (key: string, fallback: any) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const contactInfo = [
    {
      icon: Mail,
      title: getTranslation('footer.quickLinks', 'Email Us'),
      details: t('contact.details.email') === 'contact.details.email' ? 'office@pgtglobalnetwork.com' : t('contact.details.email'),
      description: "Send us an email and we'll respond within 24 hours",
      action: 'mailto:' + (t('contact.details.email') === 'contact.details.email' ? 'office@pgtglobalnetwork.com' : t('contact.details.email'))
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: t('contact.details.phone') === 'contact.details.phone' ? '+91 8999902805' : t('contact.details.phone'),
      description: 'Speak directly with our team during business hours',
      action: 'tel:' + (t('contact.details.phone') === 'contact.details.phone' ? '+91 8999902805' : t('contact.details.phone').replace(/\s+/g, ''))
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 9AM-6PM IST',
      description: "We're available during these hours for immediate assistance",
      action: '#'
    }
  ];

  const enquiryCategories = [
    'General Inquiry',
    'Partnership / Collaboration',
    'Volunteer Opportunities',
    'Core Team Recruitment',
    'Event / Seminar Request',
    'Technical Support',
    'Media / Press',
    'Feedback / Suggestions',
    'Report an Issue',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validate category is selected
    if (!category) {
      toast.error('Please select an enquiry category.');
      setSubmitting(false);
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }

    try {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          full_name: fullName.trim(),
          email: email.trim(),
          category,
          subject: category === 'Other' ? customSubject.trim() : null,
          message: message.trim(),
        });

      if (dbError) throw dbError;

      setSuccess(true);
      toast.success(t('contact.form.successToast') === 'contact.form.successToast' ? 'Message sent successfully!' : t('contact.form.successToast'));

      // Reset form fields
      setFullName('');
      setEmail('');
      setCategory('');
      setCustomSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact submission failed:', err);
      const errMsg = err.message || 'Failed to send message. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
        <section className="relative overflow-hidden pt-12 pb-24 sm:pt-16 sm:pb-32">
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
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase font-mono">{t('contact.tagline')}</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              {t('contact.title')}
            </h1>
            <p 
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              {t('contact.description')}
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Main Grid: Form and Contact Info */}
      <section className="py-24 bg-card/25 border-b border-border relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Contact Form (1st in markup for mobile-top display) */}
            <div className="lg:col-span-7 animate-reveal-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-card border border-border backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-950/10 dark:shadow-none">
                {success ? (
                  <div className="text-center py-12 px-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-emerald-500/20 mb-6 text-green-500 animate-bounce">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">Thank You!</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed text-sm sm:text-base font-normal">
                      Your message has been successfully received. We will get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Send Us a Message</h2>
                      <p className="text-sm text-muted-foreground font-normal">Fill out the fields below and we'll respond directly.</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground/80 mb-2">
                          {t('apply.form.fullName')} <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm font-normal"
                          placeholder={t('apply.form.fullNamePlaceholder')}
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground/80 mb-2">
                          {t('apply.form.email')} <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm font-normal"
                          placeholder={t('apply.form.emailPlaceholder')}
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-muted-foreground/80 mb-2">
                        Enquiry Category <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <select
                          className={`w-full px-4 py-3 bg-input border border-input rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 appearance-none text-sm font-normal ${
                            category === '' ? 'text-muted-foreground/50' : 'text-foreground'
                          }`}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        >
                          <option value="" disabled className="text-muted-foreground/50 bg-card">Select Enquiry Category...</option>
                          {enquiryCategories.map((cat, idx) => (
                            <option key={idx} value={cat} className="text-foreground bg-card">
                              {cat}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground/60">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Conditional Custom Subject Field with height and opacity transition */}
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        category === 'Other' ? 'max-h-28 opacity-100 visible' : 'max-h-0 opacity-0 invisible pointer-events-none'
                      }`}
                    >
                      <div className="pt-2">
                        <label className="block text-sm font-semibold text-muted-foreground/80 mb-2">
                          Custom Subject <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm font-normal"
                          placeholder="Please specify your subject"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          required={category === 'Other'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground/80 mb-2">
                        {t('contact.form.message')} <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <textarea
                        rows={5}
                        className="w-full px-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm font-normal resize-none"
                        placeholder={t('contact.form.messagePlaceholder')}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative overflow-hidden w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.01] transform transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
                      {submitting ? t('common.submitting') : t('contact.form.send')}
                      <Send className={`h-4 w-4 transition-transform ${submitting ? 'translate-x-1' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'} duration-300`} />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Contact Methods & Info (2nd in markup for mobile-bottom display) */}
            <div className="lg:col-span-5 space-y-8 animate-reveal-up" style={{ animationDelay: '400ms' }}>
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">Reach out</span>
                <h2 className="text-3xl font-extrabold text-foreground mt-2 mb-4 tracking-tight">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed font-normal text-sm sm:text-base">
                  Have questions, collaboration ideas, or feedback? Use the form to get in touch with our team, or reach out directly through any of our channels.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <AnimatedCard key={index} animation="slideUp" delay={index * 100}>
                    <a 
                      href={info.action !== '#' ? info.action : undefined}
                      className="relative overflow-hidden bg-card border border-border p-6 rounded-2xl hover:bg-muted/40 hover:shadow-2xl hover:shadow-slate-955/5 hover:border-indigo-500/20 hover:-translate-y-1.5 transform transition-all duration-300 group cursor-pointer flex items-center gap-6 text-left block"
                    >
                      <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10 relative z-10">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-foreground mb-0.5 group-hover:text-indigo-600 transition-colors duration-300 relative z-10">{info.title}</h4>
                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1 relative z-10">{info.details}</p>
                        <p className="text-muted-foreground text-xs leading-normal font-normal relative z-10">{info.description}</p>
                      </div>
                    </a>
                  </AnimatedCard>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-background border-b border-border relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedCard animation="slideUp">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">{t('faq.tagline')}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mt-2 mb-6 tracking-tight">
              {t('faq.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              {t('faq.contactDesc')}
            </p>
            <a
              href="/faq"
              className="group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-btn pointer-events-none" />
              {t('faq.contactBtn')}
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </a>
          </AnimatedCard>
        </div>
      </section>

      {/* Connection Banner */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {t('contact.title')}
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-slate-400 leading-relaxed font-normal">
              {t('contact.description')}
            </p>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Contact;